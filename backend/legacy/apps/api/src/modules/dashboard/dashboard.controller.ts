import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/current-user.decorator';
import type { Tenant } from '@admitiq/db';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('kpis')
  @Roles('TENANT_ADMIN', 'OPERATIONS_MANAGER', 'ANALYST')
  kpis(@CurrentTenant() tenant: Tenant) {
    return this.dashboardService.getKpis(tenant.id);
  }

  @Get('queue')
  @Roles('TENANT_ADMIN', 'OPERATIONS_MANAGER', 'COUNSELLOR_SUPERVISOR')
  queue(@CurrentTenant() tenant: Tenant) {
    return this.dashboardService.getLiveQueue(tenant.id);
  }
}
