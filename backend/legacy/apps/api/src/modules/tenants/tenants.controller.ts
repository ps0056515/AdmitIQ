import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/current-user.decorator';
import type { Tenant } from '@admitiq/db';

@ApiTags('tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Get('current')
  @Roles('TENANT_ADMIN', 'OPERATIONS_MANAGER', 'ANALYST', 'COUNSELLOR_SUPERVISOR', 'COUNSELLOR')
  current(@CurrentTenant() tenant: Tenant) {
    return this.tenantsService.findById(tenant.id);
  }
}
