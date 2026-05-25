import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CallsService } from './calls.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/current-user.decorator';
import type { Tenant } from '@admitiq/db';

@ApiTags('calls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('calls')
export class CallsController {
  constructor(private callsService: CallsService) {}

  @Get()
  @Roles('TENANT_ADMIN', 'OPERATIONS_MANAGER', 'COUNSELLOR_SUPERVISOR', 'ANALYST')
  findAll(@CurrentTenant() tenant: Tenant) {
    return this.callsService.findAll(tenant.id);
  }

  @Get(':id')
  @Roles('TENANT_ADMIN', 'OPERATIONS_MANAGER', 'COUNSELLOR_SUPERVISOR', 'COUNSELLOR', 'ANALYST')
  findOne(@CurrentTenant() tenant: Tenant, @Param('id') id: string) {
    return this.callsService.findOne(tenant.id, id);
  }
}
