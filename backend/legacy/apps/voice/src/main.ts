import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { prisma } from '@admitiq/db';
import { JOB_NAMES, QUEUE_NAMES, type PlaceCallPayload } from '@admitiq/shared';

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

/**
 * Voice worker skeleton — processes PLACE_CALL jobs.
 * Smartflo + STT/LLM/TTS integration wired in next iteration.
 */
async function handlePlaceCall(job: { data: PlaceCallPayload }) {
  const { tenantId, leadId, callSessionId } = job.data;

  const [tenant, lead, session] = await Promise.all([
    prisma.tenant.findUnique({ where: { id: tenantId }, include: { campaigns: { where: { isActive: true }, take: 1 } } }),
    prisma.lead.findUnique({ where: { id: leadId } }),
    prisma.callSession.findUnique({ where: { id: callSessionId } }),
  ]);

  if (!tenant || !lead || !session) {
    console.warn('[voice] Missing tenant/lead/session for job', job.data);
    return;
  }

  const campaign = tenant.campaigns[0];
  const flowConfig = campaign?.flowConfig as { disclosureScript?: string } | undefined;
  const disclosure = flowConfig?.disclosureScript ?? 'This is an automated assistant.';

  console.log(`[voice] Simulating outbound call to ${lead.phoneE164} for ${lead.name}`);
  console.log(`[voice] Disclosure: ${disclosure.slice(0, 80)}...`);

  await prisma.callSession.update({
    where: { id: callSessionId },
    data: {
      status: 'IN_PROGRESS',
      startedAt: new Date(),
      languageDetected: 'hi-en',
    },
  });

  await prisma.transcriptTurn.createMany({
    data: [
      {
        callSessionId,
        speaker: 'bot',
        text: disclosure,
        timestampMs: 0,
      },
      {
        callSessionId,
        speaker: 'caller',
        text: '[simulated] Haan, Full Stack course ke baare mein jaanna hai.',
        timestampMs: 5000,
      },
      {
        callSessionId,
        speaker: 'bot',
        text: 'Bahut achha. Kya aap online ya offline mode prefer karte hain?',
        timestampMs: 9000,
      },
    ],
  });

  await prisma.callSession.update({
    where: { id: callSessionId },
    data: {
      status: 'COMPLETED',
      endedAt: new Date(),
      disposition: 'QUALIFIED',
      leadScore: 'HOT',
      confidence: 0.88,
      slots: {
        course_interest: lead.courseInterest,
        mode: 'online',
        location: 'Bengaluru',
      },
    },
  });

  await prisma.lead.update({ where: { id: leadId }, data: { status: 'CONTACTED' } });

  console.log(`[voice] Call ${callSessionId} completed (simulated qualification)`);
}

const worker = new Worker(
  QUEUE_NAMES.CALLS,
  async (job) => {
    if (job.name === JOB_NAMES.PLACE_CALL) {
      await handlePlaceCall(job as { data: PlaceCallPayload });
    }
  },
  { connection, concurrency: 5 },
);

worker.on('failed', (job, err) => console.error('[voice] job failed', job?.id, err));

console.log('AdmitIQ voice worker started (simulation mode)');
console.log(`  Listening on queue: ${QUEUE_NAMES.CALLS}`);

process.on('SIGINT', async () => {
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
});
