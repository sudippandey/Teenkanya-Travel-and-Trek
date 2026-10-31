# Environment Variables

No production environment variables were changed in this branch. No new variables are required.

| Variable | Scope | Required | Used by | Notes |
| --- | --- | --- | --- | --- |
| `SUPABASE_URL` | server | yes* | `lib/supabase/server-client.ts` | Falls back to `NEXT_PUBLIC_SUPABASE_URL`. |
| `NEXT_PUBLIC_SUPABASE_URL` | public | fallback | same; admin UI client | URL only, not a secret. |
| `SUPABASE_SECRET_KEY` | server, **secret** | yes* | DB access, rate-limit HMAC, fingerprint HMAC | Falls back to `SUPABASE_SERVICE_ROLE_KEY`. |
| `SUPABASE_SERVICE_ROLE_KEY` | server, **secret** | fallback | same | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | admin UI only | Engineer 3's browser sign-in | Grants nothing on enquiry tables (RLS and no grants). |
| `WEB3FORMS_ACCESS_KEY` | server, **secret** | yes | `notification-provider.server.ts` | Without it notifications are `failed` and health reports `not_configured`. |

\* One of each pair is required. Without database credentials the public route returns `503` and never claims success.

## Rules

- Never prefix a secret with `NEXT_PUBLIC_`.
- Rotating `SUPABASE_SECRET_KEY` changes the HMAC used for rate-limit keys and fingerprints. Existing rate-limit windows reset and 24h duplicate detection restarts. This is safe.
- Set values in Vercel Project Settings → Environment Variables, separately for Preview and Production. Preview should point at a non-production Supabase project.
