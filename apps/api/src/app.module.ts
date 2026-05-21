import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { LeadsModule } from './modules/leads/leads.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { CallsModule } from './modules/calls/calls.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { InternalModule } from './modules/internal/internal.module';
import { QUEUE_NAMES } from '@admitiq/shared';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL ?? 'redis://localhost:6379',
      },
    }),
    BullModule.registerQueue(
      { name: QUEUE_NAMES.LEADS },
      { name: QUEUE_NAMES.CALLS },
      { name: QUEUE_NAMES.CRM_WRITEBACK },
      { name: QUEUE_NAMES.NOTIFICATIONS },
    ),
    PrismaModule,
    AuthModule,
    HealthModule,
    TenantsModule,
    LeadsModule,
    CampaignsModule,
    CallsModule,
    DashboardModule,
    WebhooksModule,
    InternalModule,
  ],
})
export class AppModule {}
