import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/current-user.decorator';
import type { Tenant } from '@admitiq/db';

@ApiTags('campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Get()
  @Roles('TENANT_ADMIN', 'OPERATIONS_MANAGER', 'ANALYST')
  findAll(@CurrentTenant() tenant: Tenant) {
    return this.campaignsService.findAll(tenant.id);
  }

  @Get(':id')
  @Roles('TENANT_ADMIN', 'OPERATIONS_MANAGER')
  findOne(@CurrentTenant() tenant: Tenant, @Param('id') id: string) {
    return this.campaignsService.findOne(tenant.id, id);
  }

  @Post()
  @Roles('TENANT_ADMIN', 'OPERATIONS_MANAGER')
  create(@CurrentTenant() tenant: Tenant, @Body() body: Record<string, unknown>) {
    return this.campaignsService.create(tenant.id, body as Parameters<CampaignsService['create']>[1]);
  }

  @Patch(':id')
  @Roles('TENANT_ADMIN', 'OPERATIONS_MANAGER')
  update(
    @CurrentTenant() tenant: Tenant,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.campaignsService.update(tenant.id, id, body as Parameters<CampaignsService['update']>[2]);
  }
}
