import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { JOB_NAMES, QUEUE_NAMES, type LeadIngestedPayload } from '@admitiq/shared';
import type { LeadWebhookPayload } from '@admitiq/shared';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue(QUEUE_NAMES.LEADS) private leadsQueue: Queue,
  ) {}

  findAll(tenantId: string) {
    return this.prisma.lead.findMany({
      where: { tenantId },
      orderBy: { inquiryAt: 'desc' },
      include: {
        campaign: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        callSessions: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: { id: true, disposition: true, leadScore: true, status: true },
        },
      },
    });
  }

  findOne(tenantId: string, id: string) {
    return this.prisma.lead.findFirst({
      where: { id, tenantId },
      include: {
        campaign: true,
        assignedTo: true,
        callSessions: { orderBy: { createdAt: 'desc' }, include: { transcriptTurns: true } },
        assignments: { include: { counsellor: true } },
      },
    });
  }

  async ingestFromWebhook(tenantId: string, payload: LeadWebhookPayload, campaignId?: string) {
    const phoneE164 = payload.phone.startsWith('+') ? payload.phone : `+91${payload.phone.replace(/\D/g, '').slice(-10)}`;
    const dedupKey = `${tenantId}:${phoneE164}:${campaignId ?? 'default'}`;

    const lead = await this.prisma.lead.upsert({
      where: { tenantId_dedupKey: { tenantId, dedupKey } },
      update: {
        name: payload.name,
        email: payload.email,
        courseInterest: payload.courseInterest,
        source: payload.source,
        crmLeadId: payload.crmLeadId,
      },
      create: {
        tenantId,
        campaignId,
        crmLeadId: payload.crmLeadId,
        name: payload.name,
        phoneE164,
        email: payload.email,
        courseInterest: payload.courseInterest,
        source: payload.source,
        dedupKey,
        inquiryAt: payload.inquiryAt ? new Date(payload.inquiryAt) : new Date(),
      },
    });

    const jobPayload: LeadIngestedPayload = {
      tenantId,
      leadId: lead.id,
      campaignId: lead.campaignId ?? undefined,
    };

    await this.leadsQueue.add(JOB_NAMES.LEAD_INGESTED, jobPayload, {
      jobId: `lead-ingested-${lead.id}-${Date.now()}`,
      removeOnComplete: 1000,
      removeOnFail: 5000,
    });

    return lead;
  }
}
