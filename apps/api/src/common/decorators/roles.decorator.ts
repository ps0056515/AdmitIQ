import { SetMetadata } from '@nestjs/common';
import type { UserRoleName } from '@admitiq/shared';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoleName[]) => SetMetadata(ROLES_KEY, roles);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_INTERNAL_KEY = 'isInternal';
export const InternalOnly = () => SetMetadata(IS_INTERNAL_KEY, true);
