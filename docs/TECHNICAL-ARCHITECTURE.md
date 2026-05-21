# AdmitIQ v1 — Technical Architecture Document

| Field | Value |
|---|---|
| Document | AdmitIQ v1 — Technical Architecture |
| Version | 1.2 (Draft) |
| Status | Draft for engineering review |
| Stack | **NestJS (TypeScript) + React (TypeScript)** |
| Date | May 2026 |
| Source PRD | AdmitIQ v1 PRD v1.0 |
| Audience | Engineering, DevOps, Security, Product |

---

## Table of Contents

1. [Purpose and Scope](#1-purpose-and-scope)
2. [Architecture Principles](#2-architecture-principles)
3. [System Context](#3-system-context)
4. [Logical Architecture](#4-logical-architecture)
5. [Core Services and Responsibilities](#5-core-services-and-responsibilities)
6. [Voice Pipeline Architecture](#6-voice-pipeline-architecture)
7. [Data Architecture](#7-data-architecture)
8. [Integration Architecture](#8-integration-architecture)
9. [Multi-Tenancy Model](#9-multi-tenancy-model)
10. [Identity, Access, and Audit](#10-identity-access-and-audit)
11. [Compliance Architecture](#11-compliance-architecture)
12. [Notification Architecture](#12-notification-architecture)
13. [Observability and Operations](#13-observability-and-operations)
14. [Resilience and Failure Handling](#14-resilience-and-failure-handling)
15. [Deployment and Infrastructure](#15-deployment-and-infrastructure)
16. [Security Architecture](#16-security-architecture)
17. [Technology Stack (Recommended)](#17-technology-stack-recommended)
18. [NFR Traceability](#18-nfr-traceability)
19. [Release Alignment (v1.0 vs v1.1)](#19-release-alignment-v10-vs-v11)
20. [Open Technical Decisions](#20-open-technical-decisions)
21. [Appendix: Sequence Diagrams](#21-appendix-sequence-diagrams)

---

## 1. Purpose and Scope

This document translates the AdmitIQ v1 Product Requirements Document into a implementable technical architecture. It defines **what to build**, **how components interact**, and **non-negotiable cross-cutting constraints** (multi-tenancy, compliance, resilience, provider abstraction).

**Technology stack (decided):** **NestJS + TypeScript** backend, **React + TypeScript** frontends, PostgreSQL (Prisma), Redis (BullMQ). See [Section 17](#17-technology-stack).

### 1.1 In scope

- Outbound voice qualification for admissions (v1.0 pilot and v1.1 GA path)
- Lead ingestion, call orchestration, voice conversation, qualification, handoff
- CRM bidirectional integration (LeadSquared, Meritto at launch)
- Tenant admin console, counsellor mobile app, CRM widget, internal ops console
- IAM, audit, compliance, onboarding, notifications, QA, reporting

### 1.2 Out of scope

Per PRD Section 2.2: lifecycle voice, inbound handling, school ERP, omnichannel chat, self-serve onboarding, non-India markets, per-customer LLM fine-tuning.

### 1.3 Architectural goals

| Goal | Target | PRD reference |
|---|---|---|
| Speed-to-first-contact | Median < 5 min within calling hours | G1, FR-1.3 |
| Voice latency | Speech-to-speech p90 < 3s | FR-2.9, NFR-1 |
| Concurrent calls | ≥ 500 at launch; path to 5,000+ | NFR-2 |
| Calling service availability | 99.5% during calling hours | NFR-3 |
| CRM write-back | p90 < 2s; 98%+ accuracy | NFR-1, §2.3 |
| Tenant isolation | Strict per-tenant data and config isolation | NFR-8 |
| No data loss on dependency failure | Queues, retries, DLQ | NFR-10 |

---

## 2. Architecture Principles

1. **Voice-first, event-driven core** — Lead lifecycle and call state are driven by durable events, not synchronous request chains. Real-time voice runs on a dedicated low-latency path.

2. **Provider abstraction at boundaries** — Telephony (Smartflo → Exotel/Airtel IQ), STT, LLM, TTS, and SMS are accessed through internal interfaces. No business logic depends on a vendor SDK directly.

3. **Multi-tenant by default** — Every request carries tenant context. Cross-tenant access is limited to the internal ops console with mandatory audit and reason capture.

4. **Compliance as architecture** — Consent, disclosure, DLT templates, retention, erasure, and audit are first-class subsystems, not add-on logging.

5. **Graceful degradation over silent failure** — When speech, model, or integration services fail, the voice layer offers human callback (FR-2.12); async paths retry with backoff and dead-letter queues.

6. **TypeScript modular monolith → selective extraction** — v1.0 ships as a **NestJS modular monolith** (`apps/api`) with domain modules and shared packages, plus separate worker processes (`apps/orchestrator`, `apps/voice`) in the same pnpm monorepo.

7. **Configuration over code for flows** — Qualification flows, slots, eligibility rules, and handoff triggers are tenant/campaign configuration stored in versioned documents, not hard-coded.

8. **Audit everything sensitive** — Authentication, admin changes, PII reads, exports, cross-tenant access, and compliance actions produce immutable audit records (FR-11.x).

---

## 3. System Context

### 3.1 Context diagram

```
                        ┌─────────────────────────────────────────────┐
                        │              External Actors                 │
                        └─────────────────────────────────────────────┘
     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
     │ Institution  │  │  Student /   │  │   AdmitIQ    │  │  Telephony   │
     │   Staff      │  │   Parent     │  │  Operations  │  │   (Smartflo) │
     │ (Admin,      │  │  (call       │  │  (internal   │  │              │
     │  Counsellor) │  │   recipient) │  │   console)   │  │              │
     └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
            │                 │                 │                 │
            │                 │                 │                 │
            └─────────────────┴────────┬────────┴─────────────────┘
                                       │
                              ┌────────▼────────┐
                              │                 │
                              │    AdmitIQ      │
                              │    Platform     │
                              │                 │
                              └────────┬────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          │                            │                            │
   ┌──────▼──────┐              ┌──────▼──────┐              ┌──────▼──────┐
   │ LeadSquared │              │   Meritto   │              │ STT/LLM/TTS │
   │    CRM      │              │    CRM      │              │  Providers  │
   └─────────────┘              └─────────────┘              └─────────────┘
                                       │
                                ┌──────▼──────┐
                                │  DLT SMS    │
                                │  Provider   │
                                └─────────────┘
```

### 3.2 Primary data flows

| Flow | Trigger | Outcome |
|---|---|---|
| Lead intake | CRM webhook or batch upload | Lead persisted; call job scheduled |
| Outbound call | Orchestrator within calling window | Voice session; transcript + disposition |
| Qualification | In-call dialogue | Slots extracted; eligibility evaluated |
| Handoff | Trigger rules met | Counsellor assigned; callback scheduled |
| CRM write-back | Call completed | Disposition, slots, transcript link in CRM |
| Counsellor callback | Scheduled time | Mobile click-to-call; outcome synced |

---

## 4. Logical Architecture

### 4.1 Container view

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Client Applications                                │
├──────────────┬──────────────┬──────────────┬──────────────┬─────────────────┤
│ Admin Console│ Counsellor   │ CRM Widget   │ Internal Ops │ Public Webhooks │
│ React (Vite) │ React PWA    │ React bundle │ React (Vite) │ (CRM intake)    │
└──────┬───────┴──────┬───────┴──────┬───────┴──────┬───────┴────────┬────────┘
       │              │              │              │                │
       └──────────────┴──────────────┴──────────────┴────────────────┘
                                       │  HTTPS / REST / SSE
                              ┌────────▼────────┐
                              │   NestJS API    │
                              │  (auth, tenant  │
                              │   ctx, Swagger) │
                              └────────┬────────┘
                                       │
┌──────────────────────────────────────┼──────────────────────────────────────┐
│           AdmitIQ Application Layer (NestJS modules + shared packages)      │
├──────────────┬──────────────┬────────┴────────┬──────────────┬───────────────┤
│ Tenant &     │ Lead & Call  │ Qualification   │ Handoff &    │ Integration   │
│ Campaign     │ Orchestrator │ Engine          │ Routing      │ Hub (CRM)     │
│ Service      │              │                 │ Service      │               │
├──────────────┼──────────────┼─────────────────┼──────────────┼───────────────┤
│ IAM Service  │ Notification │ Reporting &     │ QA Service   │ Onboarding    │
│              │ Service      │ Analytics       │              │ Service       │
├──────────────┴──────────────┴─────────────────┴──────────────┴───────────────┤
│ Compliance Service (consent, retention, erasure, DLT) │ Audit Service       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┼──────────────────────────────────────┐
│         Voice Runtime (Node.js workers — apps/voice)                          │
├──────────────────────────────────────┤                                      │
│  Session Manager │ Dialogue Manager │ STT/TTS Adapters │ Telephony Adapter │
└──────────────────────────────────────┴──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┼──────────────────────────────────────┐
│                              Data & Messaging Layer                         │
├──────────────┬──────────────┬────────┴────────┬──────────────┬─────────────┤
│ PostgreSQL   │ Redis        │ Message Broker  │ Object Store │ Search/     │
│ (tenant      │ (cache,      │ (events, jobs,  │ (recordings, │ Analytics   │
│  data)       │  sessions)   │  retries)       │  exports)    │ (optional)  │
└──────────────┴──────────────┴─────────────────┴──────────────┴─────────────┘
```

### 4.2 Module boundaries (modular monolith)

For v1.0, these map to **NestJS modules** in `apps/api/src/modules/` and **shared packages** under `packages/`, with separate worker entrypoints for orchestration and voice:

| Process | Entrypoint | Runtime |
|---|---|---|
| REST API | `apps/api` | NestJS (Node.js) |
| Job orchestrator | `apps/orchestrator` | BullMQ worker |
| Voice sessions | `apps/voice` | Node.js worker pool |
| Frontends | `apps/web-*` | Vite dev server / static CDN |

| Module | Owns | Does not own |
|---|---|---|
| **Tenant & Campaign** | Tenants, plans, entitlements, campaigns, flows, calling windows | Call execution |
| **Lead & Orchestrator** | Leads, dedup, scheduling, retries, DND/consent gates | Dialogue logic |
| **Voice Runtime** | Live call sessions, STT/LLM/TTS loop, barge-in, recording | CRM write-back |
| **Qualification** | Slot schema, extraction, eligibility, disposition, scoring | Telephony signaling |
| **Handoff & Routing** | Counsellor assignment, callback slots, context packages | Mobile push delivery |
| **Integration Hub** | CRM connectors, field mapping, write-back, activity logs | Lead creation UI |
| **IAM** | Auth, MFA, sessions, RBAC, user lifecycle | Audit storage |
| **Audit** | Append-only audit log, search, export | Business transactions |
| **Compliance** | Consent records, retention jobs, erasure workflow, DLT registry | Campaign config |
| **Notification** | Push, email, SMS dispatch, delivery logs | Trigger logic (owned by domain events) |
| **Reporting** | KPI aggregation, baselines, exports | Raw call storage |
| **QA** | Sampling, review queue, corrections, accuracy metrics | Flow authoring |
| **Onboarding** | Checklist, validation, test-call mode, go-live gate | Tenant billing |
| **Internal Ops** | Cross-tenant views, impersonation, feature flags, metering | Tenant RBAC rules |

### 4.3 Repository structure (NestJS + React monorepo)

```
admitiq/
├── apps/
│   ├── api/                    # NestJS REST API
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       ├── common/         # guards, decorators, filters
│   │       └── modules/        # auth, leads, campaigns, calls, …
│   ├── orchestrator/           # BullMQ consumer: call scheduling, retries
│   ├── voice/                  # Node worker: live call sessions
│   ├── web-admin/              # React — tenant admin console
│   ├── web-ops/                # React — internal operations console
│   ├── web-counsellor/         # React PWA — counsellor mobile experience
│   └── web-crm-widget/         # React embeddable bundle (Vite lib mode)
├── packages/
│   ├── db/                     # Prisma schema + client
│   ├── shared/                 # shared types, enums, Zod schemas
│   └── ui/                     # shared React component library
├── docker-compose.yml
├── package.json                # pnpm workspaces
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

**Layering rules**

- `modules/*/controllers` — HTTP only: validation, auth, call services, return DTOs
- `modules/*/services` — business logic; injectable NestJS services
- `packages/db` — Prisma schema and generated client
- `packages/shared` — Zod schemas and TypeScript types shared API ↔ workers ↔ React
- React apps consume NestJS Swagger/OpenAPI via `openapi-typescript`

---

## 5. Core Services and Responsibilities

### 5.1 NestJS API layer

**Responsibilities**

- TLS termination at load balancer; NestJS served via Node.js (PM2 or container)
- JWT validation via `@nestjs/passport` guards and custom `TenantGuard`
- Tenant resolution from JWT claim, subdomain, or `X-Tenant-Id` header
- Rate limiting via `@nestjs/throttler` or Redis-backed guard
- Correlation ID injection for OpenTelemetry traces
- Swagger/OpenAPI at `/docs` (dev/staging)

**NestJS middleware / guards**

```typescript
// Global: ValidationPipe, TenantContextInterceptor, AuditInterceptor
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
app.enableCors({ origin: allowedOrigins, credentials: true });
```

**Webhook intake (FR-1.1)**

- Dedicated `WebhooksController` at `POST /webhooks/v1/:crm/:tenantSlug`
- HMAC signature validation per CRM connector (class-validator DTOs)
- Payload validation → enqueue BullMQ `lead.ingested` job → return `202 Accepted`

### 5.2 Lead & Call Orchestrator

**Responsibilities**

- Persist lead model (FR-1.2): name, phone, email, course, source, campaign, inquiry timestamp, CRM lead ID
- Enforce calling window (FR-1.4): TRAI 09:00–21:00 IST default + tenant override
- DND and consent check before dial (FR-1.5)
- Schedule outbound call within 60s p90 for in-window leads (FR-1.3)
- Retry schedule: default 3 attempts over 48h (FR-1.6)
- Dedup window: no concurrent/duplicate calls to same lead (FR-1.7)
- Per-tenant concurrency cap (FR-16.2)
- Priority queue when at capacity (FR-1.9, P1)

**Implementation pattern**

```
LeadIngested → Validate → ScheduleCallJob(deadline=now+60s)
ScheduleCallJob → ConsentCheck → DNDCheck → AcquireConcurrencySlot
  → DispatchToVoiceRuntime → OnComplete/OnFail → RetryOrFinalize
```

Jobs are durable (PostgreSQL + broker delay queues). Orchestrator is horizontally scalable; concurrency enforced via Redis distributed semaphores per tenant.

### 5.3 Voice Runtime

See [Section 6](#6-voice-pipeline-architecture). Runs as **stateful workers** (one worker per active call session), not in the request path of the monolith API.

### 5.4 Qualification Engine

**Responsibilities**

- Load campaign flow configuration (slot schema, prompts, eligibility rules, handoff triggers)
- Receive partial transcripts and dialogue state from Voice Runtime
- Real-time entity/slot extraction (FR-3.2)
- Eligibility evaluation: eligible / ineligible / uncertain (FR-3.3)
- Disposition classification at call end (FR-3.4)
- Hot/warm/cold scoring (FR-3.5)
- Confidence scores on disposition and key slots (FR-3.6)
- Evaluate handoff trigger rules (FR-3.7)
- On low confidence: signal Voice Runtime to initiate graceful handoff (FR-2.12)

**Flow configuration model**

Flows are versioned JSON/YAML documents:

```json
{
  "flowId": "skilling-v1",
  "version": 3,
  "languages": ["hi", "en"],
  "slots": [
    { "name": "course_interest", "type": "enum", "required": true },
    { "name": "location", "type": "string", "required": true }
  ],
  "eligibilityRules": [ ... ],
  "handoffTriggers": [
    { "type": "slot_mentioned", "slot": "fees" },
    { "type": "disposition", "value": "qualified_hot" },
    { "type": "intent", "value": "speak_to_human" }
  ],
  "systemPromptTemplate": "...",
  "disclosureScript": "..."
}
```

Prompt assembly: system prompt + flow instructions + tenant brand voice + captured slots + conversation history (trimmed/summarised for token budget).

### 5.5 Handoff & Routing Service

**Responsibilities**

- Callback scheduling with caller-agreed slot (FR-4.1)
- Counsellor routing: round-robin, program, location, language (FR-4.2)
- Context package assembly: transcript, slots, sentiment, disposition, recommended approach (FR-4.3, FR-3.8 P1)
- Emit `CounsellorLeadAssigned` → Notification Service (FR-4.4)
- Reassign open leads on counsellor deactivation (FR-10.7)

### 5.6 Integration Hub (CRM)

**Responsibilities**

- Connector framework: read lead state, write disposition/transcript/slots/score/next action (FR-5.1)
- Native connectors: LeadSquared (FR-5.2), Meritto (FR-5.3)
- Activity/note logging per AdmitIQ action (FR-5.5)
- Field mapping from onboarding config (FR-12.2)
- Async write-back with retry and DLQ (NFR-10)
- Generic webhook connector (FR-5.8, P1)

**Write-back payload (canonical)**

```json
{
  "crmLeadId": "LSQ-12345",
  "disposition": "qualified_hot",
  "leadScore": "hot",
  "confidence": 0.91,
  "slots": { "course_interest": "Full Stack", "mode": "online" },
  "transcriptUrl": "https://...",
  "recordingUrl": "https://...",
  "nextAction": "counsellor_callback",
  "callbackScheduledAt": "2026-05-21T10:00:00+05:30"
}
```

Connector adapters translate canonical payload → CRM-specific API.

### 5.7 Reporting & Analytics

**Responsibilities**

- Aggregate KPIs: inquiries, contact rate, qualified count, speed-to-first-contact (FR-6.1, FR-15.1)
- Baseline vs current lift view (FR-15.2, FR-12.7)
- Outcome attribution when CRM provides downstream data (FR-15.3)
- Funnel, language breakdown, campaign/counsellor breakdowns (FR-6.1, FR-15.6 P1)
- Scheduled/ad-hoc export CSV/PDF (FR-6.8 P1)

Metrics computed via event stream + periodic rollups (materialised views or OLAP-friendly tables).

### 5.8 QA Service

**Responsibilities**

- Configurable call sampling for human review (FR-14.1)
- Review UI backend: disposition/slot correction with audit trail (FR-14.2)
- Quality flagging by staff or low-confidence engine signal (FR-14.3)
- Accuracy tracking over time and by language (FR-14.4)
- Link QA findings to flow versions (FR-14.7 P1)

### 5.9 Internal Ops Module

**Responsibilities**

- Tenant provisioning, suspend, offboard (FR-9.1)
- Tenant directory and per-tenant health (FR-9.2, FR-9.3)
- Permissioned support access to tenant records (FR-9.4)
- Cross-tenant audit for every internal access (FR-9.5)
- Time-boxed read-only impersonation (FR-9.8 P1)
- Usage metering for billing (FR-9.9 P1)
- Feature flags and per-tenant limits (FR-9.10 P1)
- Tenant data export and deletion on exit (FR-9.13, FR-9.14)

**Critical constraint:** Internal ops APIs use a **separate auth realm** and **separate audit stream** from tenant APIs. No shared "superuser" session in tenant context without impersonation token.

---

## 6. Voice Pipeline Architecture

### 6.1 Design constraints

| Constraint | Requirement |
|---|---|
| End-to-end latency | Speech-to-speech p90 < 3s (FR-2.9) |
| Barge-in | Caller interrupt stops TTS immediately (FR-2.7) |
| Languages | Hindi, English, Hinglish code-switching (FR-2.5) |
| Disclosure | Opening utterance every call (FR-2.8) |
| Recording | Full audio stored per retention policy (FR-2.10) |
| Transcript | Timestamped, speaker-labelled (FR-2.11) |
| Failure | Offer human callback, don't continue degraded (FR-2.12) |

### 6.2 Voice session architecture

```
┌─────────────┐     RTP/media      ┌──────────────────┐
│  Smartflo   │◄──────────────────►│ Voice Worker     │
│  (CPaaS)    │     WebSocket/     │ (per call)       │
└─────────────┘     SIP bridge      └────────┬─────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
             ┌──────▼──────┐          ┌──────▼──────┐          ┌──────▼──────┐
             │ STT Stream  │          │  Dialogue   │          │ TTS Stream  │
             │  Adapter    │────────►│  Loop       │────────►│  Adapter    │
             └─────────────┘          │ (turn mgmt) │          └─────────────┘
                                      └──────┬──────┘
                                             │
                                      ┌──────▼──────┐
                                      │Qualification│
                                      │ Engine API  │
                                      └─────────────┘
```

### 6.3 Turn loop (per utterance)

1. **Listen** — Streaming STT with partial results; VAD detects end-of-utterance
2. **Barge-in** — If caller speaks during TTS, cancel TTS stream and return to Listen
3. **Understand** — Send transcript + dialogue state to Qualification Engine / LLM
4. **Extract** — Update slots, evaluate handoff triggers mid-call
5. **Respond** — Stream TTS for bot reply; log turn to transcript buffer
6. **Repeat** until disposition finalized or handoff initiated

### 6.4 Provider abstraction interfaces

TypeScript interfaces in `packages/shared/src/providers/`:

```typescript
export interface TelephonyProvider {
  initiateOutboundCall(params: OutboundCallParams): Promise<CallHandle>;
  hangup(callId: string): Promise<void>;
  mediaStream(callId: string): AsyncIterable<AudioFrame>;
  signalingEvents(callId: string): AsyncIterable<TelephonyEvent>;
}

export interface SpeechToTextProvider {
  createStreamingSession(config: STTConfig): STTSession;
}

export interface TextToSpeechProvider {
  synthesizeStream(text: string, voice: VoiceConfig): AsyncIterable<AudioChunk>;
}

export interface LLMProvider {
  complete(params: CompletionParams): Promise<CompletionResult>;
  stream(params: CompletionParams): AsyncIterable<TokenChunk>;
}
```

Smartflo is the v1.0 implementation of `TelephonyProvider`. STT/LLM/TTS implementations are swappable per tenant plan or feature flag (multi-provider routing, P1).

### 6.5 Latency budget (p90 target: 3s)

| Stage | Budget |
|---|---|
| STT finalization (end-of-utterance → text) | 400–700 ms |
| LLM first token (streaming) | 300–600 ms |
| Qualification/slot extraction | 200–400 ms (parallel with LLM where possible) |
| TTS first audio chunk | 300–500 ms |
| Network/telephony buffer | 200–400 ms |
| **Total (typical)** | **~1.4–2.6 s** |

Mitigations: streaming STT+LLM+TTS pipelining, edge POP in India, warm provider connections, prompt caching for static flow portions, smaller models for slot extraction vs dialogue.

### 6.6 Call state machine

```
INIT → DISCLOSURE → QUALIFYING → [HANDOFF_OFFER | INFO_ONLY | CLOSING]
  │                      │
  │                      └──► GRACEFUL_FAILURE (offer callback)
  │
  └──► NO_ANSWER / BUSY / FAILED → (orchestrator retry)
```

Telephony outcomes (no-answer, busy, disconnect reason) captured at signaling layer (FR-16.3) and merged with conversational disposition.

### 6.7 Post-call processing

1. Finalize transcript → object store + DB reference
2. Upload recording → encrypted object store
3. Final disposition and confidence from Qualification Engine
4. Emit `CallCompleted` event
5. Async: CRM write-back, counsellor notification, SMS confirmation, QA sampling enrollment

---

## 7. Data Architecture

### 7.1 Storage tiers

| Tier | Technology | Data |
|---|---|---|
| **Operational DB** | PostgreSQL 15+ | Tenants, users, leads, calls, dispositions, campaigns, flows, assignments |
| **Cache / coordination** | Redis | Sessions, concurrency semaphores, rate limits, hot config |
| **Message broker** | RabbitMQ or AWS SQS (+ FIFO where needed) | Domain events, call jobs, retries, DLQ |
| **Object storage** | S3-compatible ( India region ) | Recordings, exports, large transcripts |
| **Audit log** | Append-only table + WORM bucket optional | Immutable audit entries (FR-11.9) |
| **Analytics** | PostgreSQL rollups (v1.0); ClickHouse optional (v1.1) | KPI aggregates, QA metrics |

### 7.2 Core entity model (simplified ER)

```
Tenant ──┬── Campaign ─── FlowVersion
         ├── User ─── RoleAssignment
         ├── CounsellorProfile
         ├── TelephonyNumber
         ├── CRMConnection ─── FieldMapping
         └── PlanEntitlement

Lead ─── CallSession ─── TranscriptTurn[]
  │         │
  │         ├── Recording
  │         ├── Disposition
  │         └── SlotValue[]
  │
  └── CRMSyncState

CounsellorAssignment ─── CallbackSchedule
ConsentRecord
AuditEntry (tenant-scoped or platform-scoped)
QaReview
NotificationDelivery
```

### 7.3 Key tables (conceptual)

**leads**

| Column | Notes |
|---|---|
| id, tenant_id | PK; tenant-scoped index on all queries |
| crm_lead_id | External reference |
| phone_e164 | Normalized |
| status | new, queued, calling, contacted, closed |
| campaign_id | FK |
| inquiry_at | For speed-to-contact metric |
| dedup_key | phone + campaign window |

**call_sessions**

| Column | Notes |
|---|---|
| id, tenant_id, lead_id | |
| telephony_provider, provider_call_id | |
| started_at, ended_at, duration_sec | |
| language_detected | hi, en, mixed |
| disposition, lead_score, confidence | |
| recording_s3_key, transcript_s3_key | |
| flow_version_id | Reproducibility |

**audit_entries** (append-only)

| Column | Notes |
|---|---|
| id, timestamp_utc, actor_id, actor_role | |
| tenant_id (nullable for platform) | |
| action, resource_type, resource_id | |
| outcome, ip_address | |
| before_json, after_json | For modifications |
| reason | Required for sensitive/cross-tenant reads |

### 7.4 Data retention and erasure

- Per-tenant retention policies for recordings, transcripts, PII (FR-8.4)
- Scheduled purge jobs mark then delete operational data
- Erasure workflow: verify request → delete PII across DB + object store → log erasure in audit (FR-8.5, FR-11.10)
- Audit entries outlive erased PII (FR-11.10)

### 7.5 Data residency

P1 requirement (FR-8.8): deploy primary databases and object storage in **ap-south-1 (Mumbai)** or equivalent India region. Cross-border replication disabled by default.

---

## 8. Integration Architecture

### 8.1 CRM integration pattern

```
CRM ──webhook──► AdmitIQ Gateway ──► Lead Ingestion
AdmitIQ ──async worker──► Connector Adapter ──► CRM REST API
                      │
                      └──► On failure: retry (exponential backoff)
                           └──► DLQ + ops alert
```

### 8.2 LeadSquared connector

- **Inbound:** Lead create/update webhook; map to canonical lead model
- **Outbound:** Update lead fields, create activity/note, attach transcript link
- **Auth:** API key + tenant-specific credentials in secrets manager

### 8.3 Meritto (NoPaperForms) connector

- Same pattern; Meritto-specific field IDs from onboarding mapping (FR-12.2)

### 8.4 CRM widget

- Lightweight JS bundle or iframe embedded in CRM
- Authenticates via short-lived token scoped to CRM lead ID
- Reads call summary, transcript, slots from AdmitIQ API
- No direct DB access; all via Integration Hub read APIs with audit logging (FR-11.3)

### 8.5 Telephony (Smartflo)

- Outbound call API with tenant caller ID (FR-16.1)
- Media bridge to Voice Worker via WebSocket or SIP REC
- Webhook callbacks: ringing, answered, hangup, amd (voicemail P1)

### 8.6 SMS (DLT)

- Transactional SMS via DLT-registered template IDs (FR-13.4, FR-8.3)
- Trigger: counsellor callback confirmed (FR-13.3)
- Provider abstracted; template content stored per tenant registration

---

## 9. Multi-Tenancy Model

### 9.1 Isolation strategy

**Recommended for v1.0:** Shared database, **row-level tenant isolation**

- Every table includes `tenant_id NOT NULL`
- Application-enforced tenant context on every query
- PostgreSQL Row Level Security (RLS) as defense-in-depth
- Separate encryption keys per tenant for recordings (optional Enterprise, KMS key policy)

### 9.2 Tenant context propagation

```
Request → Gateway resolves tenant from JWT claim / subdomain / API key
        → tenant_id injected into request context
        → all DB queries filtered by tenant_id
        → object storage paths: s3://bucket/{tenant_id}/...
```

### 9.3 Configuration isolation

Each tenant has independent:

- Campaigns, flows, calling windows
- CRM connections and field mappings
- Telephony numbers and concurrency caps
- Retention policies (within legal bounds)
- Plan entitlements and feature flags
- Notification preferences (P1)

### 9.4 Shared vs dedicated resources

| Resource | Model |
|---|---|
| Application compute | Shared pool |
| Voice workers | Shared pool with per-tenant concurrency cap |
| Telephony numbers | Dedicated per tenant/campaign |
| Database | Shared (RLS); dedicated DB for Enterprise (future) |
| Audit log | Shared store; tenant-scoped queries |

### 9.5 Cross-tenant access

Only via Internal Ops Console:

1. Support agent selects tenant + enters reason
2. Short-lived impersonation or scoped read token issued
3. Every action logged to platform audit stream (FR-9.5)
4. Default read-only; write requires elevated role

---

## 10. Identity, Access, and Audit

### 10.1 Authentication

- Email/password + MFA (TOTP or SMS OTP)
- MFA mandatory: Tenant Admin, all internal roles (FR-10.3)
- MFA optional but enforceable per tenant for other roles
- Session management with configurable timeout (FR-10.4)
- SSO SAML/OIDC per tenant (FR-10.9, P1)

### 10.2 RBAC model

Canonical roles from PRD Section 6.10 implemented as **permission sets**:

```
Permission examples:
  campaign:read, campaign:write
  flow:read, flow:write
  call:read, call:read_transcript, call:read_recording
  lead:read, lead:reassign
  user:manage
  report:export
  audit:read
  qa:review
```

Roles are bundles of permissions. Default deny.

**Internal roles** (Platform Admin, Support Agent) exist in a separate identity store or separate `internal_users` table — never mixed with tenant user tables without explicit linking.

### 10.3 Multi-tenant user identity (open: PRD Q9)

**Recommended default:** One user account belongs to **one tenant** in v1.0. Internal AdmitIQ staff use separate internal identities. If multi-tenant membership is required later, add `tenant_memberships` join table and tenant switcher in JWT refresh.

### 10.4 Audit architecture

- **Write path:** Domain services emit audit events to dedicated Audit Service
- **Storage:** Append-only `audit_entries` table; no UPDATE/DELETE grants for app roles
- **Integrity:** Hash chain per tenant/day (optional tamper-evidence) or WORM storage
- **Access:** Tenant Admin sees tenant audit only (FR-11.11); Platform Admin sees platform audit
- **Sensitive reads:** Transcript/recording view → async audit event before streaming content (FR-11.3)

---

## 11. Compliance Architecture

### 11.1 DPDP

| Requirement | Implementation |
|---|---|
| Consent capture (FR-8.2) | Verbal consent scripted + logged with timestamp, call ID |
| Purpose limitation | Data used only for admissions qualification; documented in tenant DPA |
| Right to erasure (FR-8.5) | Erasure workflow with identity verification |
| Retention (FR-8.4) | Configurable per data class; automated purge |
| Audit (FR-8.6) | Full audit subsystem (Section 10.4) |
| Minor handling (FR-8.7) | Flow branch: detect minor → parental consent path or restricted collection |

### 11.2 TRAI DLT

- Registered CLI headers per tenant number (FR-16.1)
- SMS via approved templates only (FR-13.4)
- Calling hours enforced in orchestrator (FR-1.4)
- DND registry check before outbound dial (FR-1.5)
- Consent registry integration or tenant-provided consent flag

### 11.3 Bot disclosure

- First TTS utterance in every call from `disclosureScript` in flow config (FR-2.8)
- Logged in transcript turn 0 with type `disclosure`

---

## 12. Notification Architecture

### 12.1 Event-driven dispatch

Domain events trigger notifications via Notification Service:

| Event | Recipients | Channels |
|---|---|---|
| `CounsellorLeadAssigned` | Assigned counsellor | Push, email |
| `CallbackOverdue` | Counsellor, ops manager | Push, email (P1) |
| `CallbackScheduled` | Student | SMS (transactional) |
| `CallFailedSpike` | Ops manager | Email (P1) |
| `CRMWriteBackFailed` | Internal ops | Alert console |

### 12.2 Notification catalogue (FR-13.2)

Stored as configuration mapping `event_type → template → channels → recipient_role`.

### 12.3 Delivery guarantees

- At-least-once delivery with idempotency keys
- Delivery log with status for troubleshooting (FR-13.7 P1)
- Push via FCM/APNs (platform TBD — PRD Q4)

---

## 13. Observability and Operations

### 13.1 Three pillars

| Pillar | Tooling (recommended) |
|---|---|
| **Metrics** | Prometheus + Grafana |
| **Logs** | Structured JSON → Loki or CloudWatch |
| **Traces** | OpenTelemetry → Jaeger or Tempo |

### 13.2 Key metrics

**Platform**

- Active call sessions, call setup latency, speech-to-speech latency p50/p90/p99
- Orchestrator queue depth, time-to-dial from lead ingest
- CRM write-back success rate and latency
- Per-tenant concurrency utilization

**Business**

- Contact rate, qualification rate, speed-to-first-contact (also in Reporting module)
- Disposition accuracy from QA sampling

### 13.3 Alerting (FR-9.11 P1)

- Call failure rate spike (tenant-attributed)
- Latency breach > 3s sustained
- CRM/telephony provider errors
- DLQ depth threshold
- Audit anomaly: bulk exports, off-hours cross-tenant access (FR-11.14 P1)

### 13.4 Internal ops dashboards (FR-9.7 P1)

Platform-wide view aggregating per-tenant health (FR-9.3): call volume, error rates, integration status, latency percentiles.

---

## 14. Resilience and Failure Handling

### 14.1 Failure matrix

| Failure | Behaviour |
|---|---|
| CRM webhook down (us) | CRM retries; we return 5xx; no data loss on their side |
| CRM API down (write-back) | Retry with backoff → DLQ → manual replay |
| Telephony outage | Queue outbound jobs; resume on recovery; alert ops |
| STT/LLM/TTS mid-call | Graceful callback offer (FR-2.12); disposition = Callback Requested or engine error flag |
| Voice worker crash | Telephony hangup or hold message; orchestrator marks failed; retry per policy |
| Database slow | Circuit breaker on non-critical reads; voice path uses cached flow config |

### 14.2 Idempotency

- Webhook intake: idempotency key = `crm_lead_id + event_id`
- CRM write-back: idempotency key = `call_session_id + writeback_version`
- Notifications: idempotency key = `event_id + recipient_id`

### 14.3 Dead-letter queues

Separate DLQs for:

- `lead-ingestion-dlq`
- `call-dispatch-dlq`
- `crm-writeback-dlq`
- `notification-dlq`

Ops console surfaces DLQ items with replay action (internal ops).

### 14.4 Backup and DR (NFR-11)

- PostgreSQL: continuous backup + PITR; cross-AZ replication
- Object storage: versioning enabled
- RTO/RPO: **TBD** (PRD Q11) — propose RPO ≤ 15 min, RTO ≤ 4 hours for pilot
- Quarterly restore drills

---

## 15. Deployment and Infrastructure

### 15.1 Recommended cloud layout (India)

Primary region: **AWS ap-south-1 (Mumbai)** or **GCP asia-south1**.

```
┌─────────────────────────────────────────────────────────┐
│                      AWS / GCP (India)                   │
├─────────────────────────────────────────────────────────┤
│  AZ-a          AZ-b          AZ-c                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ API      │  │ API      │  │ API      │  (Auto-scale) │
│  │ Workers  │  │ Workers  │  │ Workers  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Voice    │  │ Voice    │  │ Voice    │  (GPU opt.) │
│  │ Workers  │  │ Workers  │  │ Workers  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│  ┌──────────────────────────────────────┐              │
│  │ RDS PostgreSQL (Multi-AZ)             │              │
│  └──────────────────────────────────────┘              │
│  ┌──────────┐  ┌──────────┐  S3 / GCS                  │
│  │ Redis    │  │ Message  │  (recordings)              │
│  │ Cluster  │  │ Broker   │                           │
│  └──────────┘  └──────────┘                           │
└─────────────────────────────────────────────────────────┘
```

### 15.2 Scaling model

| Component | Scaling trigger |
|---|---|
| API workers | CPU, request rate (NestJS cluster / replicas) |
| Voice workers | Active session count (target: 1 worker ≈ 1 concurrent call) |
| Orchestrator job consumers | Queue depth |
| PostgreSQL | Vertical scale v1.0; read replicas for reporting; sharding post-5000 calls |

### 15.3 Environments

| Environment | Purpose |
|---|---|
| **dev** | Developer integration |
| **staging** | Pre-prod with sandbox CRM/telephony |
| **pilot** | Production for pilot tenants |
| **production** | GA |

Test-call / sandbox mode (FR-12.4) uses staging telephony credentials or flagged numbers — never writes to live CRM metrics.

### 15.4 CI/CD

- Trunk-based development with feature flags (FR-9.10)
- Automated tests: unit, integration, contract tests for CRM/telephony adapters
- Load testing: voice latency and 500 concurrent call soak before pilot
- IaC: Terraform or Pulumi

---

## 16. Security Architecture

### 16.1 Defense in depth

| Layer | Controls |
|---|---|
| Network | VPC, private subnets for DB/broker, WAF on gateway |
| Transport | TLS 1.2+ everywhere |
| Application | RBAC, input validation, CSRF on web, webhook signature verification |
| Data | Encryption at rest (AES-256); field-level encryption for phone numbers optional |
| Secrets | AWS Secrets Manager / HashiCorp Vault; no secrets in code |
| Supply chain | Dependency scanning, container image scanning |

### 16.2 PII handling

- Phone numbers stored normalized (E.164); masked in logs
- Transcripts and recordings access requires `call:read_transcript` permission + audit
- Export actions logged with record count (FR-11.5)

### 16.3 Penetration testing

Periodic pentest per NFR-4; before GA at minimum.

---

## 17. Technology Stack

**Decided stack: NestJS + React.** All choices below are defaults for v1.0.

### 17.1 Stack overview

| Layer | Choice | Key libraries |
|---|---|---|
| **Backend API** | **NestJS 11** | class-validator, class-transformer, Prisma, Swagger |
| **Background jobs** | **BullMQ** (Redis) | Call scheduling, CRM write-back, retries, DLQ |
| **Voice workers** | **Node.js TypeScript** | Same monorepo packages as API |
| **Admin console** | **React 19 + Vite + TypeScript** | React Router, TanStack Query, Zustand |
| **Internal ops console** | **React 19 + Vite + TypeScript** | Shared `@admitiq/ui` component library |
| **Counsellor app** | **React PWA** (responsive web) | vite-plugin-pwa, Web Push API |
| **CRM widget** | **React embeddable bundle** | Vite library mode; iframe or script embed |
| **Database** | PostgreSQL 15+ | Prisma ORM, JSON fields for flow configs |
| **Cache / broker** | Redis 7 | Sessions, semaphores, BullMQ, rate limits |
| **Object storage** | S3 (ap-south-1) | `@aws-sdk/client-s3` for recordings and exports |
| **STT / LLM / TTS** | Provider TBD (PRD Q1) | TypeScript adapter interfaces in `@admitiq/shared` |
| **Telephony** | Smartflo (v1.0) | `apps/api/src/modules/integrations/smartflo/` |
| **SMS** | MSG91 / Kaleyra | DLT-compliant transactional SMS |
| **Auth** | NestJS + `@nestjs/jwt` | MFA via TOTP (`otplib`); SSO via OIDC (v1.1) |
| **Observability** | OpenTelemetry Node SDK | `@opentelemetry/instrumentation-nestjs-core` |
| **Monorepo tooling** | **pnpm workspaces** | Single TypeScript toolchain across API, workers, React |

### 17.2 NestJS application patterns

**Module organisation** — one NestJS module per domain:

```typescript
@Module({
  imports: [PrismaModule, BullModule.registerQueue({ name: 'calls' })],
  controllers: [LeadsController],
  providers: [LeadsService, LeadOrchestratorService],
  exports: [LeadsService],
})
export class LeadsModule {}
```

**Dependency injection** — tenant context via custom decorator + guard:

```typescript
@Get()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Roles('OPERATIONS_MANAGER', 'TENANT_ADMIN')
findAll(@CurrentTenant() tenant: Tenant, @CurrentUser() user: User) {
  return this.leadsService.findAll(tenant.id);
}
```

**Async all the way** — Prisma async client, `fetch`/`axios` for CRM/telephony, BullMQ for background work.

**Validation** — class-validator DTOs on all inputs; Zod schemas in `@admitiq/shared` for flow configs stored as JSON.

**Real-time (v1.1 live monitoring)** — NestJS `@WebSocketGateway` or SSE for streaming transcript to supervisor UI.

### 17.3 React application patterns

**Shared component library** — `packages/ui/` with Tailwind CSS. Consumed by all React apps.

**Data fetching** — TanStack Query; OpenAPI-generated types:

```bash
pnpm openapi-typescript http://localhost:3000/docs-json -o packages/shared/src/api/schema.d.ts
```

**Routing**

| App | Base path | Primary routes |
|---|---|---|
| `web-admin` | `/admin` | `/dashboard`, `/campaigns`, `/calls`, `/flows`, `/users` |
| `web-ops` | `/ops` | `/tenants`, `/health`, `/support`, `/audit` |
| `web-counsellor` | `/counsellor` | `/inbox`, `/leads/:id`, `/callbacks` |
| `web-crm-widget` | embedded | `/lead-summary/:leadId` |

**Auth flow** — React apps POST to NestJS `/api/v1/auth/login`; JWT stored in memory; refresh via HTTP-only cookie. Axios/fetch interceptor attaches Bearer token.

**State** — TanStack Query for server data; Zustand for UI state.

**Counsellor PWA** — Vite PWA plugin; Web Push for lead notifications. Click-to-call via `tel:` URI.

**Build & deploy** — Static React builds on CDN; NestJS API on `api.admitiq.in`. CORS per app origin.

### 17.4 Package map

| Package | Responsibility |
|---|---|
| `packages/db` | Prisma schema, migrations, PrismaService |
| `packages/shared` | Zod schemas, enums, provider interfaces, queue payload types |
| `packages/ui` | Shared React components, layout, theme |
| `apps/api/modules/leads` | Lead ingestion, dedup API |
| `apps/api/modules/campaigns` | Campaign and flow configuration |
| `apps/api/modules/calls` | Call logs, transcripts, dispositions |
| `apps/api/modules/integrations` | Smartflo, LeadSquared, Meritto adapters |
| `apps/orchestrator` | BullMQ processors: schedule calls, retries, CRM write-back |
| `apps/voice` | Live call session loop, STT/LLM/TTS orchestration |

---

## 18. NFR Traceability

| NFR | Architectural response |
|---|---|
| NFR-1 Performance | Streaming voice pipeline; CDN for consoles; async CRM write-back |
| NFR-2 Scalability | Horizontally scaled voice workers; queue-based orchestration; concurrency caps |
| NFR-3 Availability | Multi-AZ deployment; health checks; calling-hours SLO monitoring |
| NFR-4 Security | Encryption, RBAC, secrets management, pentest |
| NFR-5 Compliance | Compliance module, audit subsystem, DPDP/DLT built-in |
| NFR-6 Localisation | Multi-language STT/TTS; English admin UI |
| NFR-7 Observability | Metrics, logs, traces, alerting |
| NFR-8 Multi-tenancy | Row-level isolation, RLS, separate internal access path |
| NFR-9 Maintainability | Provider interfaces for telephony, STT, LLM, TTS, SMS |
| NFR-10 Resilience | Retries, DLQ, graceful voice degradation |
| NFR-11 Backup/DR | PITR, cross-AZ, documented RTO/RPO |
| NFR-12 Accessibility | v1.1 target; use accessible component library from start |

---

## 19. Release Alignment (v1.0 vs v1.1)

### 19.1 v1.0 MVP / Pilot — build list

| Area | Deliver |
|---|---|
| Voice | Hindi/English/Hinglish, barge-in, disclosure, recording, transcript, graceful failure |
| Telephony | Smartflo adapter, caller ID, concurrency cap, outcome capture |
| Orchestration | Webhook intake, 60s trigger, calling window, DND, retry, dedup |
| Qualification | Configurable slots, disposition, scoring, handoff triggers |
| CRM | LeadSquared + Meritto connectors, write-back, activity log |
| Handoff | Callback scheduling, routing, context package, SMS confirmation |
| Surfaces | Admin console (dashboard, queue, call log, campaign, flow config) |
| Mobile | React PWA: lead inbox, prep card, transcript, click-to-call, disposition update |
| Internal ops | P0 subset: tenant provisioning, directory, health, support access, audit |
| IAM | Auth, MFA, RBAC, user lifecycle, lead reassignment |
| Compliance | Consent, DLT SMS, retention, erasure, audit P0 set |
| Onboarding | Workflow, field mapping, connection validation, test-call, go-live gate |
| QA | Sampling, review, corrections, accuracy tracking |
| Reporting | North-star metric, basic funnel KPIs |
| Entitlements | Lite/Pro/Enterprise enforcement |

### 19.2 v1.1 GA — add

- Tamil, Telugu, Marathi, Kannada
- Salesforce, Dynamics connectors; generic webhook
- Live call monitoring (streaming transcript to supervisor)
- Reporting export (CSV/PDF), calendar integration, SLA tracking
- SSO/SCIM, data residency hardening, WCAG 2.1 AA
- Warm transfer (FR-16.4 — pending Q12)
- Voicemail detection, sentiment-aware delivery
- Full internal ops dashboard, impersonation, metering UI

---

## 20. Open Technical Decisions

| ID | Decision | Options | Recommendation | Owner |
|---|---|---|---|---|
| TD-1 | STT/LLM/TTS providers | Deepgram/Azure/Google × OpenAI/Anthropic × ElevenLabs/Azure | Evaluate Hindi/Hinglish WER + latency in POC | Engineering |
| TD-2 | Backend language | ~~Python vs Go~~ | **Decided: NestJS (TypeScript) monorepo** | ~~Engineering~~ |
| TD-3 | Counsellor mobile surface | React PWA vs React Native | **React PWA for v1.0** (same React codebase); evaluate React Native if push/ offline gaps appear | Eng / Design |
| TD-4 | Flow builder depth | JSON config only vs visual no-code | JSON/YAML editor + preview for v1.0; visual builder v1.1 | Product |
| TD-5 | Internal ops scope for pilot | Full console vs P0 APIs + minimal UI | Minimal UI covering FR-9.1–9.6, 9.13–9.15 | Product |
| TD-6 | Multi-tenant user membership | Single vs multi-tenant users | Single tenant per user for v1.0 | Product |
| TD-7 | Warm transfer in v1.0 | Ship vs defer | Defer to v1.1 unless pilot requires | Product |
| TD-8 | QA reviewer | AdmitIQ team vs tenant staff | Tenant Operations Manager role in v1.0; AdmitIQ samples cross-tenant | Product / GTM |
| TD-9 | RTO/RPO | Various | RPO 15 min, RTO 4 hr for pilot | Engineering |
| TD-10 | Recording opt-in vs opt-out | Legal decision | Default opt-in with disclosure; tenant-configurable retention | Legal |
| TD-11 | Message broker | RabbitMQ vs SQS vs Redis Streams | SQS if AWS; RabbitMQ if self-managed | DevOps |
| TD-12 | Analytics store | PostgreSQL rollups vs ClickHouse | PostgreSQL for v1.0; ClickHouse if report latency suffers | Engineering |

---

## 21. Appendix: Sequence Diagrams

### 21.1 Primary journey: inquiry to qualified handoff

```
Student          CRM           AdmitIQ          Smartflo        Voice Worker       Counsellor
  │               │               │                │                │                 │
  │──form submit─►│               │                │                │                 │
  │               │──webhook─────►│                │                │                 │
  │               │               │──queue call───►│                │                 │
  │               │               │                │──dial─────────►│                 │
  │◄────────────screen pop───────────────────────────ring───────────│                 │
  │◄────────────voice call──────────────────────────────────────────►│                 │
  │               │               │                │◄──qualification loop──────────────►│
  │               │               │                │                │                 │
  │               │               │◄──CallCompleted event───────────│                 │
  │               │◄──write-back──│                │                │                 │
  │◄──SMS confirm─│               │──notify──────────────────────────────────────────►│
  │               │               │                │                │                 │
  │◄──counsellor callback─────────────────────────────────────────────────────────────►│
```

### 21.2 CRM write-back with retry

```
Voice Worker    Event Bus    Write-back Worker    CRM API    DLQ    Ops Alert
     │              │               │               │         │         │
     │─CallCompleted►│               │               │         │         │
     │              │──consume──────►│               │         │         │
     │              │               │──write───────►│         │         │
     │              │               │◄──5xx/timeout─│         │         │
     │              │               │──retry (backoff)         │         │
     │              │               │──write───────►│         │         │
     │              │               │◄──200 OK──────│         │         │
     │              │               │               │         │         │
     │              │               │ (on max retry)│──move──►│         │
     │              │               │               │         │──alert─►│
```

### 21.3 Cross-tenant support access

```
Support Agent    Internal Ops API    Audit Service    Tenant Data API
      │                  │                  │                 │
      │──request access──►│                  │                 │
      │  (tenant, reason)  │                  │                 │
      │                  │──log access──────►│                 │
      │                  │──issue scoped token────────────────►│
      │                  │                  │                 │
      │──view transcript──────────────────────────────────────►│
      │                  │                  │◄──log read──────│
      │◄──transcript─────────────────────────────────────────│
```

---

## Document history

| Version | Date | Author | Summary |
|---|---|---|---|
| 1.0 | May 2026 | Engineering (draft) | Initial architecture from PRD v1.0 |
| 1.1 | May 2026 | Engineering (draft) | Stack decided: FastAPI + React (superseded) |
| 1.2 | May 2026 | Engineering (draft) | Stack revised: NestJS + React; team TypeScript preference |

---

*This document should be reviewed alongside the AdmitIQ v1 PRD, a detailed API specification (next artifact), and a security/compliance checklist before pilot implementation begins.*
