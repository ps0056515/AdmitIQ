import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { INTERNAL_ROLES, TENANT_ROLES, type UserRoleName } from '@admitiq/shared';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { User } from '@admitiq/db';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleName[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) return true;

    const { user } = context.switchToHttp().getRequest<{ user: User }>();
    if (!user) throw new ForbiddenException('Not authenticated');

    const allowed = requiredRoles.includes(user.role as UserRoleName);
    if (!allowed) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}

export function isInternalRole(role: string): boolean {
  return INTERNAL_ROLES.includes(role as UserRoleName);
}

export function isTenantRole(role: string): boolean {
  return TENANT_ROLES.includes(role as UserRoleName);
}
