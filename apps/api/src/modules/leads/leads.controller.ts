import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/current-user.decorator';
import type { Tenant } from '@admitiq/db';

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Get()
  @Roles('TENANT_ADMIN', 'OPERATIONS_MANAGER', 'COUNSELLOR_SUPERVISOR', 'COUNSELLOR', 'ANALYST')
  findAll(@CurrentTenant() tenant: Tenant) {
    return this.leadsService.findAll(tenant.id);
  }

  @Get(':id')
  @Roles('TENANT_ADMIN', 'OPERATIONS_MANAGER', 'COUNSELLOR_SUPERVISOR', 'COUNSELLOR', 'ANALYST')
  findOne(@CurrentTenant() tenant: Tenant, @Param('id') id: string) {
    return this.leadsService.findOne(tenant.id, id);
  }
}
