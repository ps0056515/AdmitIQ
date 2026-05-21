import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.tenant.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        planTier: true,
        callingWindowStart: true,
        callingWindowEnd: true,
        timezone: true,
        maxConcurrentCalls: true,
      },
    });
  }
}
