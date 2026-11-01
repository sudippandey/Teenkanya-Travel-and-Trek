# Contributing

Thank you for helping improve Teenkanya Travel & Trek.

This repository powers a public-facing travel website and enquiry experience. Changes should improve clarity, accessibility, reliability or maintainability without inventing business capabilities.

## Development setup

1. Use Node.js 22 and pnpm 12.3.4.
2. Clone the repository and install dependencies:

   ```bash
   corepack enable
   corepack prepare pnpm@12.3.4 --activate
   pnpm install
   ```

3. Copy `.env.example` to `.env.local` if you need to exercise the server-side enquiry workflow.
4. Start the app with `pnpm dev`.

Public pages can be developed without sending real enquiries. Never use production credentials or submit test enquiries to a real customer mailbox unless the test is explicitly authorised.

## Branch and pull request workflow

- Branch from `main`.
- Use a descriptive prefix such as `v2/` for public website improvements.
- Keep each pull request focused on one coherent change.
- Do not commit directly to `main`.
- Explain user-visible changes, tests, deployment impact and any required environment/database setup.
- Do not merge database changes until they have been validated against a disposable or staging Supabase project.

## Required checks

Run these before requesting review:

```bash
pnpm check
pnpm build
```

The CI workflow runs the same TypeScript, test and production-build checks for pushes and pull requests targeting `main`, `v1/**` and `v2/**`.

Add regression tests whenever changing validation, enquiry delivery, URL state, catalogue relationships or structured content.

## Content standards

- Do not invent prices, availability, fixed departures, awards, licences, testimonials, team credentials or supplier arrangements.
- Clearly distinguish sample itineraries from confirmed operating plans.
- Confirm route details, permits, access and safety information against current authoritative sources.
- Preserve image attribution, licence and source metadata.
- Keep customer data minimal and never place personal data in commits, fixtures, screenshots or issue descriptions.

## Security

- Never commit `.env.local`, API keys, access tokens, service-role keys or credentials.
- Keep privileged integrations in server-only modules.
- Validate untrusted input on the server, even when the client form already validates it.
- Avoid logging request bodies, personal data, provider response bodies or secrets.
- Do not change Supabase RLS, grants, migrations or production environment variables without an explicit review and a tested rollback plan.

## Pull request checklist

- [ ] Scope is focused and the description explains the reason for the change.
- [ ] TypeScript checks pass.
- [ ] Relevant tests pass; new behaviour has regression coverage.
- [ ] Production build passes.
- [ ] No secrets or personal data are included.
- [ ] Content claims are verified and image attribution is preserved.
- [ ] Required environment variables or database steps are documented.
