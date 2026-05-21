import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InternalService {
  constructor(private prisma: PrismaService) {}

  listTenants() {
    return this.prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        planTier: true,
        createdAt: true,
        _count: { select: { leads: true, callSessions: true, users: true } },
      },
    });
  }

  tenantHealth(tenantId: string) {
    return this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        _count: { select: { leads: true, callSessions: true, campaigns: true } },
        crmConnections: { select: { id: true, provider: true, isActive: true } },
      },
    });
  }
}
