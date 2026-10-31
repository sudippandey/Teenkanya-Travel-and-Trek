# Backend Audit

Audit of the actual state of the repository on branch `v1/backend-platform` before backend platform work. Findings were verified by reading code, running the test suite and type-checking. Nothing here assumes production behaviour that was not observed in code.

## 1. Existing architecture (verified)

| Area | State before this work |
| --- | --- |
| Framework | Next.js App Router (Next 16), Node.js runtime for API routes. |
| Public pages | Static marketing pages driven by `lib/travel-data.ts` (destinations, packages, treks, articles). No CMS. |
| API routes | Single route: `POST /api/enquiries`. No server actions. |
| Enquiry flow | `contact` form -> `POST /api/enquiries` -> `processEnquirySubmission` (validate -> persist -> notify -> update notification status). |
| Persistence | Supabase Postgres via service-role key, table `public.enquiries`, migration `20261031000000_create_enquiries.sql`. RLS enabled, all access revoked from `anon`/`authenticated`. |
| Rate limiting | Postgres function `consume_enquiry_rate_limit` keyed by an HMAC of the Vercel `x-real-ip` header (5 per 15 minutes). |
| Notification | Web3Forms called server-side; success only when HTTP 2xx **and** `success: true` in the body. Key read from `WEB3FORMS_ACCESS_KEY`. |
| Idempotency | Client-generated `submissionId` (UUID) with a unique index; re-submits return the same reference. |
| Admin | None. No staff authentication, no way to view or update enquiries other than the Supabase dashboard. |
| Monitoring | `console.error` strings only; no health endpoint. |
| Tests | 24 Node test-runner tests covering validation, workflow, request security and Web3Forms handling. All passing. |

## 2. Problems and risks found

| # | Finding | Severity | Resolution in this branch |
| --- | --- | --- | --- |
| A1 | Enquiries could not reference a specific tour/destination/trek, so staff had to infer intent from free text. | Medium | Added `catalogue_item_type` + `catalogue_item_slug`, validated against the real catalogue on the server. |
| A2 | No special-requirements field (dietary, accessibility, permits). | Low | Added bounded `special_requirements`. |
| A3 | Duplicate protection relied only on `submissionId`; a user refreshing the page and resubmitting created duplicates and duplicate emails. | Medium | Added an HMAC content fingerprint with a 24h duplicate window. |
| A4 | A notification stuck in `pending` (function timeout mid-send) could never be retried. | High | Added a 2-minute lease: stale `pending`, `failed` and `not_configured` rows can be re-claimed with an optimistic compare-and-set. |
| A5 | No audit history of what happened to an enquiry. | Medium | Added `enquiry_events` populated by triggers and staff RPCs. |
| A6 | Enquiry `status` existed but nothing could change it and transitions were unconstrained. | Medium | Defined a transition graph and an atomic `change_enquiry_status` RPC with optimistic concurrency. |
| A7 | No admin API, so the team could not work enquiries without database access. | High | Added an authenticated, role-based admin API. |
| A8 | Two separate Supabase client constructions with no request timeout. | Low | Consolidated into `lib/supabase/server-client.ts` with a 2s fetch timeout. |
| A9 | Logs were unstructured. | Low | Added `logEvent` structured logging that carries only non-personal fields. |
| A10 | No health check. | Low | Added `GET /api/health`. |
| A11 | Customer acknowledgement email is not implemented. | Medium | **Not resolved** — schema column added, sending deferred (see Known limitations). |

## 3. Things verified as working and preserved

- Server-only secret usage (`server-only` import guard, no `NEXT_PUBLIC_` secrets).
- Origin check, content-type check, bounded body reading (16 KB) and honeypot on the public route.
- Honest responses: `201/200` only after Web3Forms confirms; `502` with a saved reference when notification fails; `503` when persistence fails.
- Public website design system and branding were not modified.

## 4. Recommended follow-ups

1. Implement customer acknowledgement through a transactional provider (e.g. Resend) once a sending domain is authorised.
2. Add a scheduled retry job for `failed` / stale `pending` notifications (currently manual via admin API).
3. Purge `enquiry_rate_limits` rows older than 24h on a schedule.
4. Enable Supabase Point-in-Time Recovery on the production project.
5. Add an error-monitoring sink (e.g. Sentry) that ingests the structured logs.
