import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InternalService } from './internal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('internal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('internal')
export class InternalController {
  constructor(private internalService: InternalService) {}

  @Get('tenants')
  @Roles('PLATFORM_ADMIN', 'SUPPORT_AGENT')
  listTenants() {
    return this.internalService.listTenants();
  }

  @Get('tenants/:id/health')
  @Roles('PLATFORM_ADMIN', 'SUPPORT_AGENT')
  tenantHealth(@Param('id') id: string) {
    return this.internalService.tenantHealth(id);
  }
}
