import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { prisma } from '@admitiq/db';
import {
  JOB_NAMES,
  QUEUE_NAMES,
  type LeadIngestedPayload,
  type ScheduleCallPayload,
} from '@admitiq/shared';

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

const callsQueue = new Queue(QUEUE_NAMES.CALLS, { connection });

function isWithinCallingWindow(start: string, end: string): boolean {
  const now = new Date();
  const istOffset = 5.5 * 60;
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const istMinutes = (utcMinutes + istOffset) % (24 * 60);
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  return istMinutes >= startMinutes && istMinutes <= endMinutes;
}

async function handleLeadIngested(job: { data: LeadIngestedPayload }) {
  const { tenantId, leadId } = job.data;
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!tenant || !lead) return;

  const inWindow = isWithinCallingWindow(tenant.callingWindowStart, tenant.callingWindowEnd);
  const delayMs = inWindow ? 0 : 60_000;

  await callsQueue.add(
    JOB_NAMES.SCHEDULE_CALL,
    { tenantId, leadId, attempt: 1 } satisfies ScheduleCallPayload,
    { delay: delayMs, jobId: `schedule-${leadId}-1` },
  );

  await prisma.lead.update({
    where: { id: leadId },
    data: { status: inWindow ? 'QUEUED' : 'NEW' },
  });

  console.log(`[orchestrator] Lead ${leadId} scheduled (delay=${delayMs}ms, inWindow=${inWindow})`);
}

async function handleScheduleCall(job: { data: ScheduleCallPayload }) {
  const { tenantId, leadId, attempt } = job.data;

  const callSession = await prisma.callSession.create({
    data: { tenantId, leadId, status: 'INITIATED' },
  });

  await callsQueue.add(
    JOB_NAMES.PLACE_CALL,
    { tenantId, leadId, callSessionId: callSession.id },
    { jobId: `place-${callSession.id}` },
  );

  await prisma.lead.update({ where: { id: leadId }, data: { status: 'CALLING' } });
  console.log(`[orchestrator] Call session ${callSession.id} created (attempt ${attempt})`);
}

const leadsWorker = new Worker(
  QUEUE_NAMES.LEADS,
  async (job) => {
    if (job.name === JOB_NAMES.LEAD_INGESTED) {
      await handleLeadIngested(job as { data: LeadIngestedPayload });
    }
  },
  { connection },
);

const callsWorker = new Worker(
  QUEUE_NAMES.CALLS,
  async (job) => {
    if (job.name === JOB_NAMES.SCHEDULE_CALL) {
      await handleScheduleCall(job as { data: ScheduleCallPayload });
    }
    if (job.name === JOB_NAMES.PLACE_CALL) {
      console.log(`[orchestrator] PLACE_CALL job ready for voice worker:`, job.data);
    }
  },
  { connection },
);

leadsWorker.on('failed', (job, err) => console.error('[orchestrator] leads job failed', job?.id, err));
callsWorker.on('failed', (job, err) => console.error('[orchestrator] calls job failed', job?.id, err));

console.log('AdmitIQ orchestrator started');
console.log(`  Redis: ${process.env.REDIS_URL ?? 'redis://localhost:6379'}`);
console.log(`  Queues: ${QUEUE_NAMES.LEADS}, ${QUEUE_NAMES.CALLS}`);

process.on('SIGINT', async () => {
  await leadsWorker.close();
  await callsWorker.close();
  await prisma.$disconnect();
  process.exit(0);
});
