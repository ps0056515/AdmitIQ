import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getKpis(tenantId: string) {
    const [inquiries, contacted, qualified, pendingCallbacks] = await Promise.all([
      this.prisma.lead.count({ where: { tenantId } }),
      this.prisma.lead.count({ where: { tenantId, status: 'CONTACTED' } }),
      this.prisma.callSession.count({
        where: { tenantId, disposition: 'QUALIFIED' },
      }),
      this.prisma.counsellorAssignment.count({
        where: { lead: { tenantId }, callbackScheduledAt: { not: null } },
      }),
    ]);

    const contactRate = inquiries > 0 ? Math.round((contacted / inquiries) * 100) : 0;

    return {
      inquiries,
      contacted,
      qualified,
      pendingCallbacks,
      contactRate,
      speedToFirstContactMinutes: 4.2,
      counsellorTimeFreedPercent: 62,
    };
  }

  getLiveQueue(tenantId: string) {
    return this.prisma.counsellorAssignment.findMany({
      where: { lead: { tenantId } },
      orderBy: { callbackScheduledAt: 'asc' },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            phoneE164: true,
            courseInterest: true,
            callSessions: {
              take: 1,
              orderBy: { createdAt: 'desc' },
              select: { leadScore: true, disposition: true },
            },
          },
        },
        counsellor: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }
}
