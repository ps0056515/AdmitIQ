import { Body, Controller, HttpCode, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/roles.decorator';
import { LeadsService } from '../leads/leads.service';
import { PrismaService } from '../../prisma/prisma.service';
import { LeadWebhookSchema } from '@admitiq/shared';

@ApiTags('webhooks')
@Controller('webhooks/v1')
export class WebhooksController {
  constructor(
    private leadsService: LeadsService,
    private prisma: PrismaService,
  ) {}

  @Public()
  @Post(':crm/:tenantSlug')
  @HttpCode(HttpStatus.ACCEPTED)
  async ingestLead(
    @Param('crm') crm: string,
    @Param('tenantSlug') tenantSlug: string,
    @Body() body: unknown,
  ) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const payload = LeadWebhookSchema.parse(body);
    const lead = await this.leadsService.ingestFromWebhook(tenant.id, payload, payload.campaignId);

    return {
      accepted: true,
      crm,
      leadId: lead.id,
      message: 'Lead queued for outbound call orchestration',
    };
  }
}
