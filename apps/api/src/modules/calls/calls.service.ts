import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CallsService {
  constructor(private prisma: PrismaService) {}

  findAll(tenantId: string) {
    return this.prisma.callSession.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        lead: { select: { id: true, name: true, phoneE164: true, courseInterest: true } },
      },
    });
  }

  findOne(tenantId: string, id: string) {
    return this.prisma.callSession.findFirst({
      where: { id, tenantId },
      include: {
        lead: true,
        transcriptTurns: { orderBy: { timestampMs: 'asc' } },
      },
    });
  }
}
