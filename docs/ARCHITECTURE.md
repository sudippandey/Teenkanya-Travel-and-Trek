# Backend Architecture

Product and content rules remain in `V1-ARCHITECTURE.md`. This document covers the backend platform.

## System diagram

```mermaid
flowchart LR
  Browser[Public site / contact form] -->|POST /api/enquiries| Public[Public enquiry route]
  AdminUI[Admin dashboard - Engineer 3] -->|Bearer token| Admin[/api/admin/*]
  AdminUI -->|sign in| SupaAuth[(Supabase Auth)]
  Public --> Workflow[processEnquirySubmission]
  Workflow --> Repo[lib/enquiries/server.ts]
  Admin --> AuthZ[authorizeStaff]
  AuthZ --> SupaAuth
  AuthZ --> Staff[(staff_members)]
  Admin --> AdminRepo[lib/admin/enquiries-repository.server.ts]
  Repo --> DB[(Supabase Postgres)]
  AdminRepo --> DB
  Workflow --> Notifier[Web3Forms notifier]
  Admin -->|retry| Notifier
  Notifier --> W3F[Web3Forms API]
  Health[/api/health] --> DB
```

## Layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| Route handlers | `app/api/**/route.ts` | HTTP concerns only: origin/content-type checks, body limits, status codes. |
| Workflow | `lib/enquiries/submission-workflow.ts` | Pure orchestration with injected dependencies — unit tested without network. |
| Validation | `lib/enquiries/validation.ts`, `lib/admin/input.ts` | Pure, dependency-free parsing. Never trusts client input. |
| Domain rules | `lib/enquiries/status.ts`, `lib/admin/permissions.ts`, `lib/enquiries/fingerprint.ts` | Status graph, role permissions, duplicate fingerprinting. |
| Persistence | `lib/enquiries/server.ts`, `lib/admin/enquiries-repository.server.ts` | All database access; `server-only`. |
| Infrastructure | `lib/supabase/server-client.ts`, `lib/observability/log.ts` | Shared client with timeout; structured, PII-free logs. |

## Key design decisions

- **Service-role access only.** The browser never talks to the database. RLS is enabled and `anon`/`authenticated` have no grants, so a leaked anon key exposes nothing.
- **Persist before notify.** An enquiry is written before any email is attempted, so a provider outage never loses a lead.
- **Explicit notification state.** `pending -> sent | failed` with a lease so retries are safe and never double-send concurrently.
- **Atomic staff mutations.** Status changes and notes go through Postgres functions that write the change and its audit event in one transaction.
- **Supabase Auth for staff.** Admin routes verify the JWT with Supabase and then require an active `staff_members` row. No custom session handling.
