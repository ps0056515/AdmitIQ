import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { User } from '@admitiq/db';
import { isInternalRole } from './roles.guard';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: User;
      headers: Record<string, string | undefined>;
      tenant?: { id: string };
    }>();

    const user = request.user;
    if (!user) throw new ForbiddenException('Not authenticated');

    if (isInternalRole(user.role)) {
      const tenantHeader = request.headers['x-tenant-id'];
      if (!tenantHeader) {
        throw new ForbiddenException('Internal users must pass X-Tenant-Id');
      }
      const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantHeader } });
      if (!tenant) throw new ForbiddenException('Tenant not found');
      request.tenant = tenant;
      return true;
    }

    if (!user.tenantId) throw new ForbiddenException('User has no tenant');
    const tenant = await this.prisma.tenant.findUnique({ where: { id: user.tenantId } });
    if (!tenant) throw new ForbiddenException('Tenant not found');
    request.tenant = tenant;
    return true;
  }
}
