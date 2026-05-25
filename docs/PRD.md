PRODUCT REQUIREMENTS DOCUMENT

AdmitIQ

AI Voice Agent for Indian Education Admissions

Version 1  ·  Build specification

“AdmitIQ” is a working name; product branding is to be finalised. This document specifies the requirements for the first shippable version (v1) of the product, covering the MVP/pilot release and the general-availability release that follows it.

| Field | Value |
| --- | --- |
| Document | AdmitIQ v1 — Product Requirements Document |
| Version | 1.0 (Draft for review) |
| Status | Draft |
| Date | May 2026 |
| Document owner | Madhusudhan Sairam — Product |
| Prepared for | TechnoElevate / TestYantra |
| Classification | Confidential |

# Document Control

## Version history

| Version | Date | Author | Summary of change |
| --- | --- | --- | --- |
| 0.1 | May 2026 | Product | Initial outline and scope definition |
| 1.0 | May 2026 | Product | First complete draft circulated for review |

## Reviewers and stakeholders

| Role | Responsibility | Status |
| --- | --- | --- |
| Product (owner) | Owns this document, scope and prioritisation | Drafting |
| Engineering lead | Feasibility, estimation, technical design | Pending |
| Founder / CEO | Strategic alignment, commercial sign-off | Pending |
| Sales / GTM | Pilot customer commitments, positioning | Pending |
| Legal / Compliance | DPDP, TRAI DLT, data-handling review | Pending |

## How to read this document

Functional requirements are identified as FR-<module>.<number> and non-functional requirements as NFR-<number>. Each requirement carries a priority:

* P0 — must ship in v1.0 (MVP / pilot). The product is not viable without it.
* P1 — targeted for v1.1 (general availability). Important but not pilot-blocking.
* P2 — desirable; scheduled opportunistically or deferred to a later release.

# Contents

TOC \h \o "1-2"

# 1. Overview

## 1.1 Purpose

This document defines the product requirements for AdmitIQ version 1 — an AI voice agent that places outbound calls to prospective students on behalf of Indian education institutions, qualifies the inquiry through a natural multi-turn conversation, and hands a qualified, context-rich lead to a human counsellor. It is the build specification for the engineering, design and delivery teams, and the reference for scope, prioritisation and acceptance.

## 1.2 Problem statement

Indian education institutions spend heavily to generate admission inquiries, then lose most of them at the first step. Counsellor teams cannot call every lead fast enough: a large share of inquiries never receive a meaningful first conversation, and the institution that responds first generally wins the student. Response speed, counsellor capacity, language coverage and CRM hygiene are the four points where the funnel leaks. The result is that a significant portion of marketing spend is wasted on leads that no one worked.

AdmitIQ addresses the first-contact gap directly: it calls every inquiry within a minute, conducts Layer-1 qualification in the caller's language, and routes only qualified leads to counsellors — with full context already captured in the CRM.

## 1.3 Product summary

AdmitIQ v1 is an outbound voice qualification product for the admissions use case. It consists of four customer-facing surfaces working against one engine, plus an internal console operated by AdmitIQ's own team:

| Surface | Primary user | Purpose |
| --- | --- | --- |
| Voice engine | (automated) | Places and conducts the qualification call; captures structured data |
| Admin console (web) | Admissions operations manager | Configure campaigns and flows; monitor the funnel; manage users |
| CRM-embedded widget | Counsellor / ops | Surfaces AdmitIQ call summary, transcript and slots inside the CRM |
| Counsellor mobile app | Counsellor | Receive qualified leads; prepare for and complete the callback |
| Internal operations console | AdmitIQ operations / support | Manage tenants and support customers across the platform (Section 6.9) |

v1 is deliberately scoped to admissions only. The lifecycle use cases that the platform will later support — fee reminders, attendance escalation, placement intimation, alumni outreach — are out of scope for this release and are noted as non-goals in Section 2.2.

## 1.4 Strategic context

AdmitIQ is an India-only product. The market, the customer archetypes, the CRM and telephony landscape, and the regulatory environment (DPDP Act, TRAI DLT, UGC) are all India-specific, and the product is designed around them rather than adapted from a global template. v1 targets two beachhead archetypes — skilling / IT-training institutes and online-degree / EdTech platforms — with test-prep and universities following in v1.1.

# 2. Goals and Success Metrics

## 2.1 Product goals

| # | Goal |
| --- | --- |
| G1 | Cut speed-to-first-contact from hours or days to under five minutes (within calling hours). |
| G2 | Reach and meaningfully converse with 85%+ of inquiries, against a typical baseline near 50%. |
| G3 | Free 60%+ of the counsellor time currently spent on Layer-1 qualification. |
| G4 | Demonstrate a measurable lead-to-application conversion lift in pilot accounts. |
| G5 | Ship a product that is DPDP- and TRAI-DLT-compliant and deployable across India from day one. |

## 2.2 Non-goals (explicitly out of scope for v1)

The following are deliberately excluded from v1 to keep the release focused. Each is a candidate for a later release.

* Lifecycle voice use cases — fee reminders, attendance escalation, placement intimation, alumni outreach. Deferred to post-v1.
* Inbound call handling — v1 is outbound-led. Inbound answering is a fast-follow candidate, not a v1 commitment.
* School ERP integrations — Fedena, Entab CampusCare, MyClassboard and similar. Deferred; v1 integrates higher-ed / EdTech CRMs only.
* Per-customer LLM fine-tuning — a future Enterprise-tier capability, not in v1.
* Omnichannel (WhatsApp / chat) — v1 is voice-first; only transactional SMS confirmations are in scope.
* Self-serve onboarding — v1 onboarding is assisted by the AdmitIQ team.
* Markets outside India — the product is India-only by design.
* Full accessibility conformance — WCAG 2.1 AA conformance is targeted for v1.1, not v1.0 (see NFR-12).

## 2.3 Success metrics

North-star metric: median speed-to-first-contact — the time between an inquiry being created and the prospect having a meaningful first conversation. Target: under five minutes within calling hours.

| Metric | Definition | v1 target |
| --- | --- | --- |
| Contact rate | Share of inquiries reached with a meaningful conversation | 85%+ |
| Qualification rate | Share of contacted leads classified Qualified | Tracked; baselined in pilot |
| Counsellor time freed | Reduction in counsellor Layer-1 qualification effort | 60%+ |
| Lead-to-application lift | Improvement in application rate vs the account baseline | Positive, measured per pilot |
| Cost per qualified lead | Fully-loaded AdmitIQ cost divided by qualified leads | Tracked; trend down with scale |
| CRM write-back accuracy | Share of calls with correct disposition and slots written back | 98%+ |
| Pilot-to-paid conversion | Share of pilots converting to a paid contract | Tracked at programme level |

# 3. Target Users and Personas

AdmitIQ has the institution's staff who use the product, the student or parent who receives the call, and AdmitIQ's own operations staff who run the multi-tenant platform. v1 design serves all six.

| Persona | Role | What they need |
| --- | --- | --- |
| Admissions Director / Head | Buyer / economic decision-maker | Owns enrolment targets and the admissions budget. Judges AdmitIQ on conversion lift and return on existing lead spend. Wants proof, not promises. |
| Admissions Operations Manager | Primary admin user | Configures campaigns and qualification flows, monitors the dashboard, manages the counsellor team. Needs control and visibility without engineering help. |
| Counsellor | Primary end user | Receives qualified leads, makes callbacks, closes admissions. Wants better leads and less manual Layer-1 grunt work — and must not feel displaced by the bot. |
| Marketing Head | Influencer | Owns lead generation spend. Cares about clean funnel attribution and cost-per-enrolment. Benefits from AdmitIQ's disposition data flowing back to the CRM. |
| Student / Parent | Call recipient (not a software user) | The person AdmitIQ calls. Wants a fast, helpful, respectful response in their own language, and a clear path to a human when they want one. |
| AdmitIQ Operations / Support | Internal platform user | AdmitIQ's own staff who provision tenants, monitor platform health and resolve customer issues. They work across all tenants through the internal operations console (Section 6.9). |

Design implication: the counsellor is the user most at risk of resisting the product. v1 must consistently position the bot as doing Layer-1 work that counsellors dislike, handing them better-prepared leads — never as a replacement for the counsellor's closing conversation.

# 4. Scope and Release Plan

## 4.1 Release phases

| Release | Window | Contents | Exit criteria |
| --- | --- | --- | --- |
| v1.0 — MVP / Pilot | Q3–Q4 2026 | Core voice engine; Smartflo telephony; LeadSquared and Meritto connectors; Hindi and English; two archetype packs (skilling, online-degree); admin console core; counsellor mobile core; compliance foundation. | Three paid pilots live; north-star metric measured against baseline. |
| v1.1 — General Availability | Q1–Q2 2027 | Admissions pack GA; test-prep and university archetype packs; four additional Indic languages; Salesforce and Dynamics connectors; live call monitoring; reporting and export. | GA launch; first non-pilot paying customers onboarded. |

## 4.2 In scope for v1

* Outbound calling for the admissions use case, triggered by CRM lead-creation events and by batch upload.
* Multi-turn voice qualification in Hindi and English (v1.0); four further Indic languages (v1.1).
* Structured slot capture, eligibility evaluation, disposition classification and lead scoring.
* Counsellor handoff with scheduling, routing, context package and notification.
* Bidirectional CRM integration — LeadSquared and Meritto (v1.0); Salesforce and Dynamics (v1.1).
* Admin console, CRM-embedded widget and counsellor mobile app.
* An internal operations and support console for AdmitIQ staff to manage tenants and support customers across the platform.
* Identity and access management — authentication, multi-factor authentication and role-based access control across all surfaces.
* Tenant onboarding and implementation tooling, including CRM field mapping, test-call mode and a go-live readiness gate.
* A multi-channel notification framework covering counsellor, student and operational messaging.
* AI quality assurance — call sampling, human review and correction of bot output, and accuracy tracking.
* Reporting and ROI visibility, telephony call-handling controls, and enforceable plan-tier entitlements.
* DPDP and TRAI DLT compliance foundation, comprehensive audit and activity logging, and configurable data retention.

## 4.3 Out of scope for v1

As listed in Section 2.2 — lifecycle use cases, inbound handling, school ERP integrations, per-customer fine-tuning, omnichannel, self-serve onboarding, and non-India markets.

# 5. User Journeys

## 5.1 Primary journey — inquiry to qualified handoff

The golden path that v1 must deliver end to end:

* A prospective student submits an inquiry form on the institution's website late at night.
* The CRM creates a lead and fires a new-lead webhook to AdmitIQ.
* AdmitIQ checks the calling window. The inquiry is out of hours, so the call is queued for the next morning.
* Shortly after the calling window opens, AdmitIQ places an outbound call via the telephony provider.
* The call connects. The bot discloses at the outset that it is an automated assistant calling on behalf of the institution.
* The bot conducts a qualification conversation in the caller's language, capturing course interest, eligibility, location and mode preference.
* The caller asks about fees. This fires a handoff trigger.
* The bot offers and confirms a counsellor callback slot, then closes the call politely.
* AdmitIQ classifies the disposition (Qualified — Hot), scores the lead and assembles a context package.
* AdmitIQ writes the disposition, transcript link, captured slots, score and next action back to the CRM record.
* The assigned counsellor receives a mobile notification with the prepared lead card.
* A transactional SMS confirmation is sent to the student.
* At the scheduled time the counsellor makes the callback and records the outcome, which flows back to the CRM and dashboard.

## 5.2 Secondary journeys and edge cases

| Scenario | Expected behaviour |
| --- | --- |
| No answer / busy | AdmitIQ retries per the configured schedule; after final attempt, marks No Answer and notifies ops. |
| Voicemail / answering machine | AdmitIQ detects the machine and either leaves a configured message or schedules a retry (P1). |
| Information-only inquiry | Bot answers the question, marks Information Only, and closes without a counsellor handoff. |
| Out-of-scope or hostile caller | Bot does not argue; it offers a human callback or closes politely, and flags the call. |
| Caller wants a human immediately | Bot honours the request — schedules a callback or transfers where supported — without forcing qualification. |
| Engine error / low confidence | Bot fails gracefully: it offers a human callback rather than continuing a degraded conversation. |
| Caller is a minor | Heightened consent and data-handling rules apply; see Section 6.8. |
| CRM integration unavailable | Lead events are queued and retried; no inquiry is lost. Operations is alerted if the outage persists. |
| Telephony provider outage | Outbound calls are queued and resume automatically on recovery; operations is alerted. |
| Speech or model service failure mid-call | The bot degrades gracefully and offers a human callback rather than dropping the call silently (FR-2.12). |
| CRM write-back failure | Write-back is retried; persistent failures move to a dead-letter queue, so a completed call's result is never lost. |

# 6. Functional Requirements

## 6.1 Lead Ingestion and Call Orchestration

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-1.1 | P0 | CRM webhook intake | System exposes secured webhook endpoints to receive new-lead events from connected CRMs. Authenticated; payload validated. |
| FR-1.2 | P0 | Lead data model | System ingests and stores name, phone, optional email, course/program interest, source, campaign, inquiry timestamp and CRM lead ID. |
| FR-1.3 | P0 | 60-second call trigger | On a qualifying new-lead event within the calling window, an outbound call is initiated within 60 seconds (p90). |
| FR-1.4 | P0 | Calling-window enforcement | Calls are placed only within TRAI-permitted hours and institution-configured windows (default 09:00–21:00 IST). |
| FR-1.5 | P0 | DND and consent check | Before dialling, the number is checked against DND status and consent flags; non-compliant numbers are not called. |
| FR-1.6 | P0 | Retry logic | On no-answer, busy or failure, the system retries per a configurable schedule (default up to 3 attempts over 48 hours, spaced). |
| FR-1.7 | P0 | Deduplication | The system does not place concurrent or duplicate calls to the same lead within a configurable window. |
| FR-1.8 | P1 | Batch ingestion | Ops can upload a CSV of leads for back-catalogue calling, with validation and an error report. |
| FR-1.9 | P1 | Priority queueing | Campaign-level priority determines call order when concurrent-call capacity is constrained. |

## 6.2 Voice Conversation Engine

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-2.1 | P0 | Outbound call placement | Calls are placed through the integrated telephony provider (Smartflo at launch) via a provider-abstracted interface. |
| FR-2.2 | P0 | Real-time speech-to-text | Caller speech is transcribed in real time with support for Indian-accented English and Hindi. |
| FR-2.3 | P0 | Dialogue management | An LLM-driven manager conducts a multi-turn conversation following the configured qualification flow for the campaign. |
| FR-2.4 | P0 | Text-to-speech | Natural-sounding voice output with a configurable voice persona per institution. |
| FR-2.5 | P0 | Hindi and English with code-switching | The engine handles Hindi, English and intra-sentence code-switching (Hinglish) within a single call. |
| FR-2.6 | P1 | Additional Indic languages | Tamil, Telugu, Marathi and Kannada are supported, including code-switching with English. |
| FR-2.7 | P0 | Barge-in handling | The caller can interrupt the bot mid-utterance; the bot stops speaking and listens. |
| FR-2.8 | P0 | Bot disclosure | At the start of every call the bot clearly discloses that it is an automated assistant calling for the institution. |
| FR-2.9 | P0 | Response latency | Speech-to-speech response latency is under 3 seconds at p90 under normal load. |
| FR-2.10 | P0 | Call recording | Full call audio is recorded and stored, subject to consent and the configured retention policy. |
| FR-2.11 | P0 | Transcript storage | A full transcript with timestamps and speaker labels is stored for every call. |
| FR-2.12 | P0 | Graceful failure | On engine error or sustained low confidence, the bot offers a human callback rather than continuing a degraded call. |
| FR-2.13 | P1 | Voicemail detection | The system detects an answering machine and either leaves a configured message or schedules a retry. |
| FR-2.14 | P1 | Sentiment-aware delivery | The bot adjusts tone and pacing in response to detected caller sentiment. |

## 6.3 Qualification and Disposition

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-3.1 | P0 | Configurable slot schema | Qualification slots are configurable per archetype and campaign (e.g. course interest, eligibility, location, mode, budget, urgency). |
| FR-3.2 | P0 | Entity extraction | Slot values are extracted from the conversation in real time as the dialogue proceeds. |
| FR-3.3 | P0 | Eligibility evaluation | Configurable eligibility rules are applied; the lead is flagged eligible, ineligible or uncertain. |
| FR-3.4 | P0 | Disposition classification | Every call is assigned one disposition: Qualified, Not Interested, Information Only, Callback Requested, Out of Scope, No Answer or Drop-off. |
| FR-3.5 | P0 | Lead scoring | A hot / warm / cold score is assigned from captured slots, intent signals and sentiment. |
| FR-3.6 | P0 | Confidence scoring | A confidence value is attached to the disposition and to key extracted slots, and surfaced to staff. |
| FR-3.7 | P0 | Handoff trigger rules | Configurable rules determine when a call escalates to a counsellor (e.g. fee discussion, qualified-hot, explicit request). |
| FR-3.8 | P1 | AI-suggested approach | The system generates a short recommended approach to guide the counsellor's follow-up conversation. |

## 6.4 Counsellor Handoff

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-4.1 | P0 | Callback scheduling | The bot can schedule a counsellor callback at a slot agreed with the caller during the call. |
| FR-4.2 | P0 | Counsellor routing | Leads are routed to a counsellor by configurable rules — round-robin, by program, by location or by language. |
| FR-4.3 | P0 | Context package | A handoff package is generated: transcript, extracted slots, sentiment, disposition and recommended approach. |
| FR-4.4 | P0 | Counsellor notification | The assigned counsellor is notified of a new lead via mobile push and/or email. |
| FR-4.5 | P1 | Calendar integration | Scheduled callback slots are synced to the counsellor's calendar. |
| FR-4.6 | P1 | SLA tracking | The system tracks whether the callback occurred within the target window and flags overdue leads. |

## 6.5 CRM Integration

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-5.1 | P0 | Bidirectional sync framework | A connector framework supports reading lead state and writing disposition, transcript, slots and next action. |
| FR-5.2 | P0 | LeadSquared connector | Native bidirectional connector for LeadSquared, including new-lead trigger and write-back. |
| FR-5.3 | P0 | Meritto connector | Native bidirectional connector for Meritto (NoPaperForms), including new-lead trigger and write-back. |
| FR-5.4 | P0 | Call write-back | On call completion the disposition, transcript link, slots, lead score and next action are written to the CRM record. |
| FR-5.5 | P0 | Activity logging | Each AdmitIQ action is recorded as a CRM activity or note for an auditable lead history. |
| FR-5.6 | P1 | Salesforce connector | Native connector for Salesforce Education Cloud. |
| FR-5.7 | P1 | Dynamics connector | Native connector for Microsoft Dynamics 365 (Education Accelerator). |
| FR-5.8 | P1 | Generic webhook framework | A generic REST / webhook integration path for CRMs without a native connector. |
| FR-5.9 | P2 | Zoho CRM connector | Native connector for Zoho CRM. |

## 6.6 Admin Console (Web)

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-6.1 | P0 | Operations dashboard | Displays KPIs (inquiries, contact rate, qualified count, time freed), a funnel view and a call-language breakdown. |
| FR-6.2 | P0 | Live queue | Shows qualified leads awaiting counsellor callback, with overdue items flagged. |
| FR-6.3 | P0 | Call log and search | A searchable, filterable list of all calls, with access to transcripts and recordings. |
| FR-6.4 | P0 | Campaign management | Create and configure campaigns, assign numbers and set calling windows. |
| FR-6.5 | P0 | Flow configuration | Configure qualification flows, slots and eligibility rules per archetype, with minimal engineering involvement. |
| FR-6.6 | P0 | User and role management | The console provides delegated user and role management for the tenant. The canonical role model and access rules are defined in Section 6.10. |
| FR-6.7 | P1 | Live call monitoring | Supervisors can observe an in-progress AI call via streaming transcript. |
| FR-6.8 | P1 | Reporting and export | Scheduled and ad-hoc reports with CSV and PDF export. |
| FR-6.9 | P1 | Number management | Provision, assign and release telephony numbers from the console. |

## 6.7 Counsellor Mobile App

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-7.1 | P0 | Lead inbox | A prioritised list of assigned leads showing status (hot / warm) and the scheduled callback time. |
| FR-7.2 | P0 | Lead detail / prep card | Full context for a lead: captured slots, AI assessment and recommended approach. |
| FR-7.3 | P0 | Transcript access | The counsellor can read the full AI call transcript before the callback. |
| FR-7.4 | P0 | Click-to-call | The counsellor can initiate the callback from within the app. |
| FR-7.5 | P0 | Disposition update | The counsellor records the outcome of their callback, which syncs to the CRM and dashboard. |
| FR-7.6 | P1 | Reschedule | The counsellor can reschedule a callback, updating the lead and notifying as needed. |
| FR-7.7 | P1 | Push notifications | Push notifications for newly assigned leads and for overdue callbacks. |
| FR-7.8 | P2 | Offline view | Cached lead context is viewable without connectivity. |

## 6.8 Compliance and Data Governance

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-8.1 | P0 | Bot disclosure | Automated-assistant disclosure at the start of every call (also covered by FR-2.8). |
| FR-8.2 | P0 | Consent capture | Caller consent for the call and for data processing is captured and logged in line with DPDP requirements. |
| FR-8.3 | P0 | TRAI DLT compliance | Calling uses registered headers and templates; calling-window rules are enforced (also FR-1.4). |
| FR-8.4 | P0 | Data retention policy | Configurable retention for recordings, transcripts and PII, with a default and per-tenant overrides. |
| FR-8.5 | P0 | Right to erasure | The system supports deletion of a data principal's records on a verified request. |
| FR-8.6 | P0 | Audit logging | Security-relevant events are recorded in a tamper-evident audit log; the full audit requirements are specified in Section 6.11. |
| FR-8.7 | P0 | Minor data handling | Where the caller is a minor, heightened consent and data-handling rules apply, including a verifiable parental-consent path. |
| FR-8.8 | P1 | Data residency | Personal data is stored within India. |
| FR-8.9 | P1 | Encryption | Personal data is encrypted in transit and at rest. |

## 6.9 Internal Operations and Support Console

AdmitIQ is a multi-tenant platform, so it needs a separate console operated by AdmitIQ's own operations and support staff — the “admin of admins.” It is distinct from the tenant-facing Admin Console in Section 6.6: that console serves one institution's staff, whereas this one serves the AdmitIQ team across all tenants. It is also the single legitimate, audited path for the cross-tenant access that NFR-8 otherwise isolates — no one should reach tenant data through back-channels or direct database access.

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-9.1 | P0 | Tenant provisioning and lifecycle | Internal staff can create, configure, suspend and offboard tenant accounts, including plan tier and usage limits. |
| FR-9.2 | P0 | Tenant directory | A searchable list of all tenants showing status, plan, onboarding stage and key configuration. |
| FR-9.3 | P0 | Per-tenant health view | For a selected tenant: call volume, success and failure rates, latency, and the status of CRM and telephony integrations. |
| FR-9.4 | P0 | Support access to tenant records | Support staff can view a tenant's calls, transcripts and lead records to diagnose issues, gated by role and explicit permission. |
| FR-9.5 | P0 | Cross-tenant access audit | Every internal access to tenant data is recorded immutably with actor, tenant, scope, timestamp and stated reason. |
| FR-9.6 | P0 | Internal role management | Internal roles (e.g. support agent, platform admin) with least-privilege permissions, fully separate from tenant-side roles. |
| FR-9.7 | P1 | Cross-tenant operations dashboard | Platform-wide health — total call volume, error rates, provider status and latency percentiles across all tenants. |
| FR-9.8 | P1 | Tenant view-as / impersonation | Support staff can view a tenant's Admin Console as the tenant sees it; read-only by default, time-boxed and fully audited. |
| FR-9.9 | P1 | Usage metering and billing view | Per-tenant usage — call minutes, call counts, active numbers — for billing reconciliation and plan management. |
| FR-9.10 | P1 | Feature-flag and limit management | Enable or disable features and adjust limits per tenant without a code deployment. |
| FR-9.11 | P1 | Incident and alert console | Surfaces and triages system alerts — call failures, latency breaches, integration errors — with tenant attribution. |
| FR-9.12 | P2 | Tenant status broadcast | Internal staff can push planned-maintenance or incident notices to tenant administrators. |
| FR-9.13 | P0 | Tenant data export on exit | On offboarding, a tenant's data — leads, call records, transcripts and configuration — can be exported and handed to the customer in a usable format. |
| FR-9.14 | P0 | Tenant data deletion on exit | After a defined grace period, an offboarded tenant's personal data is deleted in line with the retention policy and DPDP obligations. |
| FR-9.15 | P0 | Audit retention through offboarding | The audit record of the offboarding, and compliance records that must be kept, are retained per FR-11.10 and FR-11.13 even after tenant data is deleted. |

## 6.10 Identity and Access Management

Every console and mobile user authenticates and is governed by a defined role. The role model below is canonical for the product and covers both tenant-side and internal roles; internal roles are exercised through the operations console in Section 6.9.

| Role | Scope | Key permissions |
| --- | --- | --- |
| Tenant Admin | Tenant | Full tenant configuration, user and role management, billing visibility, and access to all leads, calls and reports. |
| Operations Manager | Tenant | Campaign and flow configuration, dashboard, live queue, call logs and transcripts. No user management. |
| Counsellor Supervisor | Team | Live call monitoring, team performance reporting, and lead reassignment within the team. |
| Counsellor | Own leads | Assigned leads, callbacks, transcripts for own leads, disposition updates, and the mobile app. |
| Analyst | Tenant (read-only) | Dashboards, funnel and reports with export. No configuration and no access to edit personal data. |
| Platform Admin | All tenants (internal) | Tenant provisioning and lifecycle, feature flags and internal user management, via the console in Section 6.9. |
| Support Agent | All tenants (internal, gated) | Per-tenant health, permissioned support access to records, and time-boxed view-as sessions. |

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-10.1 | P0 | Authentication | All console and mobile users authenticate with a secure credential before any access is granted. |
| FR-10.2 | P0 | Password policy | Configurable minimum password strength, expiry and account lockout after repeated failed attempts. |
| FR-10.3 | P0 | Multi-factor authentication | MFA is available to all users and enforceable per tenant; it is mandatory for Tenant Admin and all internal roles. |
| FR-10.4 | P0 | Session management | Configurable session and idle timeout; users and admins can view and revoke active sessions. |
| FR-10.5 | P0 | Role-based access control | Access is governed by the role model above; each role carries a least-privilege permission set on a default-deny basis. |
| FR-10.6 | P0 | User lifecycle | Users can be invited, activated, deactivated and removed; deactivation immediately revokes all access. |
| FR-10.7 | P0 | Lead reassignment on deactivation | When a counsellor is deactivated, their open leads are reassigned per a configurable rule so none are orphaned. |
| FR-10.8 | P0 | Delegated tenant administration | Tenant Admins manage their own users and roles without AdmitIQ involvement. |
| FR-10.9 | P1 | Single sign-on | SAML 2.0 / OIDC single sign-on for tenants that require it, configurable per tenant. |
| FR-10.10 | P1 | Directory provisioning | Optional automated user provisioning and de-provisioning (SCIM) from the tenant's identity provider. |

## 6.11 Audit and Activity Logging

Because the product handles student and parent personal data across many tenants, audit is treated as a first-class capability rather than a side effect of logging. This section elaborates the audit obligation referenced in FR-8.6 and supports the ISO 27001 trajectory in NFR-5. It specifies which events are recorded, what each record contains, and how the log behaves.

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-11.1 | P0 | Authentication and session events | Login success and failure, MFA challenges, logout, password reset and session revocation are logged. |
| FR-11.2 | P0 | User and access administration events | User creation, activation, deactivation and removal, and all role or permission changes, are logged. |
| FR-11.3 | P0 | Data access (read) events | Viewing a lead, transcript or call recording is logged — the DPDP-sensitive read category. |
| FR-11.4 | P0 | Data modification events | Disposition overrides, slot edits and flow or campaign configuration changes are logged with before and after values. |
| FR-11.5 | P0 | Data export events | Every CSV, report or transcript download is logged with actor, scope and record count. |
| FR-11.6 | P0 | Compliance action events | Consent capture, erasure requests and their execution, and retention-driven deletions are logged. |
| FR-11.7 | P0 | Internal and cross-tenant access events | Internal staff access to tenant data and every impersonation session are logged (also FR-9.5). |
| FR-11.8 | P0 | Audit record content | Each entry carries UTC timestamp and timezone, actor identity and role, tenant, source IP, action, resource type and ID, outcome, before/after values for changes, and a stated reason for sensitive access. |
| FR-11.9 | P0 | Integrity and isolation | The audit log is append-only and tamper-evident; no role can edit or delete entries; it is stored separately from operational data. |
| FR-11.10 | P0 | Audit survives erasure | When a data principal's personal data is erased, the erasure is itself logged and that audit entry persists. |
| FR-11.11 | P0 | Audit access control | The audit trail is access-controlled and tenant-scoped; a Tenant Admin sees only their own tenant's entries. |
| FR-11.12 | P1 | Audit search and export | The audit trail is searchable by actor, resource, event type and date range, and exportable. |
| FR-11.13 | P1 | Audit retention | Audit entries are retained for a configurable period that is longer than operational-data retention. |
| FR-11.14 | P1 | Anomaly alerting | The audit stream feeds monitoring that flags anomalous access patterns such as bulk exports or off-hours access. |

## 6.12 Onboarding and Implementation

v1 onboarding is assisted (Section 2.2), but assisted onboarding still needs product capability. This section specifies what a signed customer needs in order to reach their first live call.

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-12.1 | P0 | Tenant onboarding workflow | A structured, trackable onboarding sequence carries a signed customer from setup to first live call, with stage visibility in the internal console. |
| FR-12.2 | P0 | CRM field mapping | A configuration step maps AdmitIQ's lead-intake and write-back fields to the tenant's CRM schema; the mapping is validated before go-live. |
| FR-12.3 | P0 | Connection validation | The system verifies CRM and telephony connectivity — authentication, webhook and a test call — during onboarding and reports pass or fail. |
| FR-12.4 | P0 | Test-call / sandbox mode | Staff can place a test call against a configured flow to a nominated number without affecting live leads, dispositions or metrics. |
| FR-12.5 | P0 | Flow preview and dry-run | A configured qualification flow can be reviewed and dry-run before it is activated for live calling. |
| FR-12.6 | P0 | Go-live readiness gate | A defined, gated checklist — mapping validated, connections green, flow tested, calling window set, compliance configured — must pass before a tenant moves to live calling. |
| FR-12.7 | P1 | Baseline capture | Onboarding records the account's pre-AdmitIQ baseline metrics so conversion lift can be measured against them. |
| FR-12.8 | P1 | Onboarding templates | Archetype packs supply a starting flow and slot set, so onboarding is configuration rather than creation. |

## 6.13 Notifications and Communications

Notifications are referenced across the handoff, mobile and internal-console modules. This section consolidates them into one framework and specifies the messaging behaviour, including the student confirmation referenced in the primary user journey.

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-13.1 | P0 | Notification framework | A single framework delivers notifications consistently across channels — mobile push, email and SMS. |
| FR-13.2 | P0 | Notification catalogue | A defined catalogue maps each notification type to its trigger event, channels and recipient role; it covers counsellor lead-assignment and overdue-callback alerts (FR-4.4, FR-7.7), the student confirmation and operational alerts. |
| FR-13.3 | P0 | Student callback confirmation | When a counsellor callback is scheduled, a transactional SMS confirming the time is sent to the student, completing the journey step in Section 5.1. |
| FR-13.4 | P0 | Transactional messaging compliance | SMS is sent using registered DLT templates with templated, compliant content, consistent with FR-8.3. |
| FR-13.5 | P1 | Notification preferences | Users can configure which notifications they receive and on which channel, within tenant-set bounds. |
| FR-13.6 | P1 | Operational alerts | Operations managers are alerted to conditions such as an overdue-callback backlog or a spike in call failures. |
| FR-13.7 | P1 | Delivery log | Notification sends and failures are recorded and visible for troubleshooting. |

## 6.14 AI Quality Assurance and Monitoring

For an AI-first product, conversation quality must be measured and improved deliberately, not assumed. This section gives the product the capability to monitor the bot's output, correct it, and feed findings back into the flows — the operational mitigation for the trust and speech-quality risks in Section 10.

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-14.1 | P0 | Call QA sampling | The system surfaces a sample of completed calls for human quality review, with sample volume and selection criteria configurable. |
| FR-14.2 | P0 | Disposition and slot review | A reviewer can inspect and correct the bot's disposition and extracted slots for a call; corrections are recorded against the call. |
| FR-14.3 | P0 | Quality flagging | Staff — and the engine itself on low confidence — can flag a call as problematic so it enters the review queue. |
| FR-14.4 | P0 | Accuracy tracking | From reviewed calls, the system tracks disposition accuracy and slot-extraction accuracy over time and by language. |
| FR-14.5 | P1 | Conversation quality metrics | Containment, drop-off points, average handle time, barge-in frequency and similar conversation-health metrics are tracked. |
| FR-14.6 | P1 | Language quality breakdown | Quality metrics are available per language so weaker languages are visible and can be gated or improved. |
| FR-14.7 | P1 | Feedback loop to flows | Review findings feed flow and prompt refinement; the link from a QA finding to a flow change is tracked. |

## 6.15 Reporting and ROI

The operations dashboard (FR-6.1) shows the institution's staff how the funnel is performing day to day. This section adds what the buyer needs in order to renew — the north-star metric and a clear view of the conversion lift AdmitIQ delivers against the account's own baseline. It uses the reporting and export mechanism in FR-6.8.

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-15.1 | P0 | North-star metric surfaced | The product surfaces median speed-to-first-contact prominently to the tenant, not only as an internal metric. |
| FR-15.2 | P0 | Conversion-lift view | A view compares current contact rate, speed-to-contact and qualified ratio against the captured pre-AdmitIQ baseline (FR-12.7), expressed as lift. |
| FR-15.3 | P0 | Outcome attribution | Reporting attributes downstream outcomes — counsellor callback, application and, where the CRM provides it, enrolment — back to AdmitIQ-qualified leads. |
| FR-15.4 | P1 | Cost-per-qualified-lead view | The product surfaces the cost-per-qualified-lead efficiency metric defined in Section 2.3. |
| FR-15.5 | P1 | Executive summary report | A periodic, buyer-facing summary covering lift, funnel and ROI, delivered through the reporting mechanism in FR-6.8. |
| FR-15.6 | P1 | Campaign and counsellor breakdowns | Performance reporting can be broken down by campaign and by counsellor. |

## 6.16 Telephony and Call Handling

The voice engine (Section 6.2) covers how a call is conducted. This section covers the telephony-layer behaviour around it — what number the recipient sees, how shared call capacity is allocated fairly across tenants, and how a live call can reach a human.

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-16.1 | P0 | Caller-ID presentation | The number presented to the recipient is configurable per tenant and campaign and uses the tenant's own registered number, not a generic one. |
| FR-16.2 | P0 | Per-tenant concurrency cap | Each tenant has a configurable cap on simultaneous calls, enforced so that no single tenant can exhaust shared call capacity (relates to NFR-2 and NFR-8). |
| FR-16.3 | P0 | Telephony outcome capture | Call-outcome signals from the telephony layer — no-answer, busy, failed, disconnection reason — are captured and feed disposition and retry logic. |
| FR-16.4 | P1 | Warm transfer to a live agent | Where supported, the bot can transfer a live call to an available human agent with context, instead of only scheduling a callback. |
| FR-16.5 | P1 | Number pooling and rotation | Tenants can use a pool of registered numbers with rotation to manage call volume and answer rates. |

## 6.17 Plan Tiers and Entitlements

AdmitIQ is sold in Lite, Pro and Enterprise tiers. This section operationalises those tiers as enforceable entitlements rather than a price-list distinction. It builds on the usage metering in FR-9.9 and the feature-flag mechanism in FR-9.10.

| ID | Pri | Requirement | Detail & acceptance |
| --- | --- | --- | --- |
| FR-17.1 | P0 | Plan assignment | Each tenant is assigned a plan tier — Lite, Pro or Enterprise — that determines its entitlements. |
| FR-17.2 | P0 | Entitlement enforcement | Entitlements — number count, language access, feature availability and usage limits — are enforced according to the tenant's plan. |
| FR-17.3 | P0 | Usage-limit handling | As a tenant approaches or reaches a usage limit, defined behaviour applies — alert, soft cap or hard cap — per plan and configuration. |
| FR-17.4 | P1 | Plan change | Internal staff can change a tenant's plan, with entitlements updated accordingly. |
| FR-17.5 | P1 | Add-ons | Plan add-ons such as extra numbers or extra languages can be applied on top of a base plan. |

# 7. Non-Functional Requirements

| ID | Area | Requirement |
| --- | --- | --- |
| NFR-1 | Performance | Speech-to-speech latency under 3s (p90); CRM write-back under 2s; admin console primary views load under 3s. |
| NFR-2 | Scalability | Support at least 500 concurrent calls at launch, with a clear path to 5,000+, and tens of thousands of leads per day. |
| NFR-3 | Availability | 99.5% uptime target for the calling service during calling hours; graceful degradation on provider failure. |
| NFR-4 | Security | Encryption in transit and at rest; role-based access control; secrets management; periodic penetration testing. |
| NFR-5 | Compliance | DPDP Act and TRAI DLT compliance from day one; architecture and process aligned to an ISO 27001 trajectory. |
| NFR-6 | Localisation | All caller-facing voice in supported Indian languages; admin and counsellor interfaces in English for v1. |
| NFR-7 | Observability | Centralised logging, monitoring and alerting on call failures, latency breaches and integration errors. |
| NFR-8 | Multi-tenancy | Multi-tenant architecture with strict per-tenant data isolation and independent configuration. |
| NFR-9 | Maintainability | Telephony and LLM providers are abstracted behind internal interfaces so either can be swapped without rework. |
| NFR-10 | Resilience | The system tolerates failure or slowness of any single external dependency (CRM, telephony, model or speech provider) without data loss. Failed operations are retried with backoff; operations that cannot complete move to a dead-letter queue for operator attention; the conversation layer degrades gracefully per FR-2.12. |
| NFR-11 | Backup and DR | Operational data, recordings, transcripts and audit logs are backed up regularly. The system has a documented disaster-recovery plan with defined recovery-time and recovery-point objectives; restore procedures are tested periodically. |
| NFR-12 | Accessibility | The admin console and counsellor mobile app target WCAG 2.1 AA conformance; this is a v1.1 objective (see Section 2.2). |

# 8. Integrations and Dependencies

| Category | v1.0 (MVP) | v1.1 (GA) | Notes |
| --- | --- | --- | --- |
| Telephony (CPaaS) | TTSL Smartflo | Exotel, Airtel IQ (optional) | Abstracted behind a provider interface (NFR-9). |
| CRM | LeadSquared, Meritto | Salesforce, Dynamics 365 | Generic webhook path for long-tail CRMs (FR-5.8). |
| LLM / speech | STT, LLM, TTS providers | Multi-provider routing | Provider-abstracted; selection finalised in technical design. |
| Messaging | Transactional SMS | — | For callback confirmations only; not omnichannel. |

External dependency risk: the product depends on third-party telephony and model providers. The provider-abstraction requirement (NFR-9) exists specifically so that pricing, reliability or availability problems with any single provider do not block the product. See Section 10.

# 9. Assumptions and Constraints

## 9.1 Assumptions

* Pilot institutions run a supported CRM (LeadSquared or Meritto) or can accept the generic webhook integration.
* Pilot institutions can provide TRAI-registered calling headers/templates, or accept AdmitIQ's guidance to obtain them.
* Inquiry phone numbers captured by the CRM are valid and reachable for the majority of leads.
* Counsellors have a smartphone capable of running the AdmitIQ mobile app.
* The two beachhead archetypes (skilling, online-degree) have inquiry volumes and economics that justify voice qualification.

## 9.2 Constraints

* The product must operate within TRAI calling-window and DLT rules and within the DPDP Act — these are hard constraints, not preferences.
* v1 onboarding is assisted; the product does not need to support unattended self-serve setup.
* Caller-facing interaction is voice and transactional SMS only; no chat or WhatsApp channel in v1.
* The product is delivered for India only; no multi-currency, multi-geography or non-Indic-language support is required.

# 10. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| CRMs ship competitive native voice agents | High | Compete on vertical depth and lifecycle breadth; position as a specialist layer rather than a generic agent. |
| Telephony provider dependency (pricing, reliability) | Medium | Provider abstraction (NFR-9); ability to onboard alternative CPaaS providers quickly. |
| LLM cost volatility erodes margin | Medium | Multi-provider routing, caching and smaller tuned models for high-volume flows. |
| Conversion ROI takes one to two admission cycles to prove | Medium | Track leading indicators (contact rate, speed-to-contact, qualified ratio) weekly during pilots. |
| Regulatory shift on AI-led calling (TRAI, DPDP, UGC) | High | Disclosure, consent capture and human handoff built in; periodic legal review. |
| Parent / student trust gap with an AI caller | Medium | Bot restricted to Layer-1; transparent disclosure; human counsellor for the closing conversation. |
| Counsellor resistance to the product | Medium | Position the bot as removing grunt work and delivering better-prepared leads; involve counsellors in pilots. |
| Speech quality across Indic languages and accents | Medium | Language-by-language quality gates; graceful fallback to human callback on low confidence (FR-2.12). |

# 11. Open Questions

These must be resolved before or during technical design. Each has a suggested owner.

| # | Open question | Owner |
| --- | --- | --- |
| Q1 | Final selection of STT, LLM and TTS providers, and the hosting model for each. | Engineering |
| Q2 | Whether v1.0 includes basic inbound-call answering or defers it entirely. | Product |
| Q3 | Per-call and per-minute cost target that keeps the pricing tiers viable at scale. | Product / Finance |
| Q4 | Counsellor app platform for v1 — native, cross-platform, or responsive web. | Engineering / Design |
| Q5 | Depth of the v1 no-code flow builder versus AdmitIQ-configured flows. | Product |
| Q6 | Data-retention defaults and whether recording is opt-in or opt-out per tenant. | Legal / Product |
| Q7 | Definition and measurement method for the lead-to-application lift baseline in pilots. | Product / GTM |
| Q8 | Whether the full internal operations console or only its P0 subset ships for the v1.0 pilot. | Product / Engineering |
| Q9 | Whether a single user identity may belong to more than one tenant, and if so how tenant switching works. | Product / Engineering |
| Q10 | Whether human QA review of AI calls is performed by the AdmitIQ team or by the tenant's operations staff in v1. | Product / GTM |
| Q11 | The specific recovery-time and recovery-point objectives (RTO/RPO) for disaster recovery. | Engineering / Product |
| Q12 | Whether warm transfer to a live agent (FR-16.4) ships in v1.0 or v1.1. | Product / Engineering |

# 12. Appendix

## 12.1 Glossary

| Term | Meaning |
| --- | --- |
| Archetype | A customer segment with a distinct admissions pattern (e.g. skilling institute, online-degree platform). |
| Archetype pack | A pre-built set of qualification flows, slots and eligibility rules tuned to one archetype. |
| CPaaS | Communications Platform as a Service — the telephony provider that places and carries calls. |
| Disposition | The outcome classification assigned to a completed call. |
| DLT | Distributed Ledger Technology registration — the TRAI framework for registered commercial calling. |
| DPDP Act | India's Digital Personal Data Protection Act, governing personal-data handling. |
| Handoff | The transfer of a qualified lead, with context, from AdmitIQ to a human counsellor. |
| Layer-1 qualification | The initial qualification of an inquiry that AdmitIQ automates. |
| Slot | A discrete piece of structured information captured during the call (e.g. course interest). |
| Speed-to-first-contact | Time from inquiry creation to the prospect's first meaningful conversation; the north-star metric. |

— End of document —