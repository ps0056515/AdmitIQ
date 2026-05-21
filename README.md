# AdmitIQ

AI voice agent for Indian education admissions — **NestJS + React + PostgreSQL + Redis** monorepo.

## Stack

| Layer | Tech |
|---|---|
| API | NestJS 11, Swagger, JWT auth |
| Workers | BullMQ orchestrator + voice worker |
| Database | PostgreSQL + Prisma |
| Cache/queues | Redis |
| Frontends | React 19 + Vite (admin, ops, counsellor, CRM widget) |

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (PostgreSQL + Redis)

## Quick start

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env and start infrastructure
copy .env.example .env
pnpm docker:up

# 3. Database setup
pnpm db:generate
pnpm db:push
pnpm db:seed

# 4. Build shared packages
pnpm --filter @admitiq/shared build

# 5. Run services (separate terminals)
pnpm dev:api              # http://localhost:3000  (Swagger: /docs)
pnpm dev:orchestrator     # BullMQ worker
pnpm dev:voice            # Voice simulation worker
pnpm dev:admin            # http://localhost:5173
pnpm dev:ops              # http://localhost:5174
pnpm dev:counsellor       # http://localhost:5175
```

## Demo credentials (after seed)

| User | Email | Password |
|---|---|---|
| Tenant admin | admin@demo-institute.in | password123 |
| Ops manager | ops@demo-institute.in | password123 |
| Counsellor | counsellor@demo-institute.in | password123 |
| Platform admin | platform@admitiq.in | password123 |

## Project structure

```
apps/
  api/              NestJS REST API
  orchestrator/     Call scheduling worker
  voice/            Voice session worker (simulation mode)
  web-admin/        Tenant admin console
  web-ops/          Internal operations console
  web-counsellor/   Counsellor PWA
  web-crm-widget/   CRM embeddable widget
packages/
  db/               Prisma schema + client
  shared/           Types, Zod schemas, queue payloads
  api-client/       Frontend API client
  ui/               Shared React components
docs/
  TECHNICAL-ARCHITECTURE.md
```

## Test webhook (lead intake)

```bash
curl -X POST http://localhost:3000/webhooks/v1/leadsquared/demo-institute ^
  -H "Content-Type: application/json" ^
  -d "{\"crmLeadId\":\"LSQ-9999\",\"name\":\"Test Student\",\"phone\":\"9876543210\",\"courseInterest\":\"AI/ML\"}"
```

## Documentation

See [docs/TECHNICAL-ARCHITECTURE.md](docs/TECHNICAL-ARCHITECTURE.md) for full system design.
