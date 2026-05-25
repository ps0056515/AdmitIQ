import { PrismaClient, UserRole, PlanTier } from '@prisma/client';
import { prisma } from '../src/index';
import bcrypt from 'bcryptjs';

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-institute' },
    update: {},
    create: {
      name: 'Demo Skilling Institute',
      slug: 'demo-institute',
      status: 'LIVE',
      planTier: PlanTier.PRO,
      campaigns: {
        create: {
          name: 'Full Stack Admissions Q3',
          isActive: true,
          flowConfig: {
            flowId: 'skilling-v1',
            languages: ['hi', 'en'],
            slots: ['course_interest', 'location', 'mode', 'eligibility'],
            disclosureScript:
              'Namaste, main ek automated assistant hoon calling on behalf of Demo Institute.',
          },
        },
      },
    },
    include: { campaigns: true },
  });

  await prisma.user.upsert({
    where: { email: 'admin@demo-institute.in' },
    update: {},
    create: {
      email: 'admin@demo-institute.in',
      passwordHash,
      firstName: 'Admissions',
      lastName: 'Admin',
      role: UserRole.TENANT_ADMIN,
      tenantId: tenant.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'ops@demo-institute.in' },
    update: {},
    create: {
      email: 'ops@demo-institute.in',
      passwordHash,
      firstName: 'Operations',
      lastName: 'Manager',
      role: UserRole.OPERATIONS_MANAGER,
      tenantId: tenant.id,
    },
  });

  const counsellor = await prisma.user.upsert({
    where: { email: 'counsellor@demo-institute.in' },
    update: {},
    create: {
      email: 'counsellor@demo-institute.in',
      passwordHash,
      firstName: 'Priya',
      lastName: 'Sharma',
      role: UserRole.COUNSELLOR,
      tenantId: tenant.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'platform@admitiq.in' },
    update: {},
    create: {
      email: 'platform@admitiq.in',
      passwordHash,
      firstName: 'Platform',
      lastName: 'Admin',
      role: UserRole.PLATFORM_ADMIN,
      tenantId: null,
    },
  });

  const campaign = tenant.campaigns[0];
  if (campaign) {
    await prisma.lead.createMany({
      data: [
        {
          tenantId: tenant.id,
          campaignId: campaign.id,
          crmLeadId: 'LSQ-1001',
          name: 'Rahul Verma',
          phoneE164: '+919876543210',
          email: 'rahul@example.com',
          courseInterest: 'Full Stack Development',
          source: 'website',
          dedupKey: `${tenant.id}:+919876543210:${campaign.id}`,
          assignedToId: counsellor.id,
        },
        {
          tenantId: tenant.id,
          campaignId: campaign.id,
          crmLeadId: 'LSQ-1002',
          name: 'Ananya Patel',
          phoneE164: '+919876543211',
          courseInterest: 'Data Analytics',
          source: 'facebook',
          dedupKey: `${tenant.id}:+919876543211:${campaign.id}`,
        },
      ],
      skipDuplicates: true,
    });
  }

  console.log('Seed complete.');
  console.log('  Tenant:', tenant.slug);
  console.log('  Admin: admin@demo-institute.in / password123');
  console.log('  Ops: ops@demo-institute.in / password123');
  console.log('  Counsellor: counsellor@demo-institute.in / password123');
  console.log('  Platform: platform@admitiq.in / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
