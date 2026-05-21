import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FlowConfigSchema } from '@admitiq/shared';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  findAll(tenantId: string) {
    return this.prisma.campaign.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(tenantId: string, id: string) {
    return this.prisma.campaign.findFirst({ where: { id, tenantId } });
  }

  async create(
    tenantId: string,
    data: { name: string; flowConfig: unknown; callerId?: string; isActive?: boolean },
  ) {
    const flowConfig = FlowConfigSchema.parse(data.flowConfig);
    return this.prisma.campaign.create({
      data: {
        tenantId,
        name: data.name,
        flowConfig,
        callerId: data.callerId,
        isActive: data.isActive ?? false,
      },
    });
  }

  async update(
    tenantId: string,
    id: string,
    data: { name?: string; flowConfig?: unknown; callerId?: string; isActive?: boolean },
  ) {
    const existing = await this.findOne(tenantId, id);
    if (!existing) throw new NotFoundException('Campaign not found');

    return this.prisma.campaign.update({
      where: { id },
      data: {
        name: data.name,
        callerId: data.callerId,
        isActive: data.isActive,
        flowConfig: data.flowConfig ? FlowConfigSchema.parse(data.flowConfig) : undefined,
      },
    });
  }
}
