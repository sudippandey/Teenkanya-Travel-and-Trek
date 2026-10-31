# Security

## Authorization model

| Actor | How identified | Access |
| --- | --- | --- |
| Public visitor | none | `POST /api/enquiries`, `GET /api/health` |
| Staff `agent` | Supabase Auth JWT + active `staff_members` row | read, update status, add notes |
| Staff `admin` | same | agent permissions plus notification retry |
| Database | `service_role` key, server only | everything; never sent to the browser |

Every admin route calls `authorizeStaff(request, permission)` first. The JWT is verified by Supabase (`auth.getUser`), not decoded locally. Deactivating a staff member (`active = false`) revokes access on their next request. Staff membership is managed with SQL only; no API can grant roles.

## Controls

| Risk | Control |
| --- | --- |
| Injection | Supabase query builder and parameterised RPCs; references validated against `^TTT-\d{6}-[0-9A-F]{16}$`; functions use `search_path = ''`. |
| Broken access control | RLS on, `anon`/`authenticated` have no grants, server-side role checks, closed permission set. |
| CSRF | Public route rejects cross-origin `Origin`. Admin routes use bearer tokens (not cookies), so a browser cannot attach them cross-site. |
| Abuse / DoS | IP-HMAC rate limit, 16 KB public and 8 KB admin body limits, 2s database timeout, `maxDuration` 15s. |
| Lost updates | Optimistic concurrency on status (`expectedStatus`) and on notification claims. |
| XSS | All values rendered by React; notes and messages are stored as text with control characters stripped. |
| Secret exposure | `server-only` guards; no secret uses a `NEXT_PUBLIC_` prefix; a test asserts the contact form does not reference provider credentials or endpoints. |
| Trust of client IP | Only Vercel's `x-real-ip` is trusted; `x-forwarded-for` is ignored. |

## Logging policy

`logEvent` writes JSON lines containing only event names, references, status values and counts. Never log names, emails, phone numbers, messages, notes, tokens, IPs or provider response bodies. Enquiry references are not personal data on their own.

## Monitoring

- `GET /api/health` for uptime checks (alert on `503`).
- Alert on log events `enquiry.*_failed`, `admin.*_failed`, `admin.authorization_unavailable` and `health.degraded`.
- Watch for enquiries in `notification_status = 'failed'`:

```sql
select reference, notification_attempts, last_notification_attempt_at
from public.enquiries where notification_status = 'failed' order by created_at desc;
```

## Recommended HTTP headers

Add these to `next.config` before launch: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security: max-age=63072000`, and `X-Frame-Options: SAMEORIGIN` for `/admin`. They are not added in this branch to avoid changing global site behaviour without review.

## Testing policy

Automated tests use injected fakes and never call Web3Forms or Supabase. Do not submit real enquiries against production without authorisation.
