import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Tenant, User } from '@admitiq/db';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    return request.user;
  },
);

export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Tenant => {
    const request = ctx.switchToHttp().getRequest<{ tenant: Tenant }>();
    return request.tenant;
  },
);
