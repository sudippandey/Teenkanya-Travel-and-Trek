# Web3Forms Verification

Date: 2026-10-31  
Branch: `v1/web3forms-verification`  
Intended PR base: `v1/enquiry-api`

## Automated checks

- `pnpm check`: passed; TypeScript and all 24 tests passed, including the new streaming-size and forwarding-header regressions.
- `pnpm build`: passed for Next.js 16.4.3.
- GitHub Actions `Quality checks`: succeeded on commit `7becfc9c275c8060211c33791759a34c15c67c61` ([run](https://github.com/sudippandey/Teenkanya-Travel-and-Trek/actions/runs/41180735025)). This is a push check; no PR is open for this branch.
- Provider success mock: passed; only HTTP success plus `{ success: true }` is accepted.
- Provider rejection, invalid-key response, non-2xx response, malformed JSON, and network failure mocks: passed. Failures are reduced to generic reason codes and do not return provider or transport text.
- Enquiry workflow: valid submission, invalid-before-persistence, notification failure, and duplicate suppression tests passed.
- Client secret check: no Web3Forms access key or provider endpoint is present in the contact-form source. A scan of 15 compiled client assets found zero matches for either `WEB3FORMS_ACCESS_KEY` or `VERCEL_AUTOMATION_BYPASS_SECRET` (values or names).

## Live provider diagnosis

Prior live `/submit` probes with the configured key returned HTTP 403 with a non-JSON response; a probe with a synthetic invalid key returned the same category. No provider success was confirmed. Web3Forms documents this response as `403: This method is not allowed` when the standard endpoint is called server-side; server-side use requires a paid plan and the server IP on its safelist ([troubleshooting](https://docs.web3forms.com/getting-started/troubleshooting), [API reference](https://docs.web3forms.com/getting-started/api-reference)). The observed 403 therefore does not by itself establish that the key is invalid.

The Preview `WEB3FORMS_ACCESS_KEY` is configured and exactly matches the Development value; neither value was printed or logged. This confirms environment consistency, not which form or mailbox the key targets. The Standard access-key API does not expose the bound recipient or its verification state, so those two items remain unverified without the Web3Forms dashboard. No additional valid provider submissions were sent during this review pass.

## Vercel preview

The API hardening deployment reached `Ready` at:

`https://tenkanyatravelandtrek-omb2tq5ei-aura-ff3b.vercel.app`

The stable branch alias is `https://tenkanyatravelandtrek-git-v1-web3forms-verification-aura-ff3b.vercel.app`.

Vercel CLI requests reached the deployed API without creating or changing an enquiry:

- `{}` returned `422 invalid_submission` before persistence or notification.
- A 16,127-byte chunked JSON body returned `413 payload_too_large`.
- A 15,914-byte JSON body below the cap returned `422 invalid_submission`, confirming it reached validation rather than the size rejection.

The existing saved enquiry reference `TTT-261031-EEBDBC3046BF3F96` was not re-submitted or modified. No new valid enquiry or provider submission was created during these Preview checks. The prior saved notification attempt was not provider-confirmed; no inbox access is available to confirm delivery.

## Security and remaining limitations

- `WEB3FORMS_ACCESS_KEY` is read only in the server-only provider module. The UI receives generic application messages and never receives provider response text.
- Vercel documents `x-real-ip` as identical to its client-IP `x-forwarded-for` header and overwrites forwarded IP data by default to prevent spoofing. The API now validates and uses only `x-real-ip`; absent/malformed values share the `unknown` rate-limit bucket, and `x-forwarded-for` is never a fallback ([Vercel request headers](https://vercel.com/docs/headers/request-headers)).
- Route logs contain fixed operational messages only; provider bodies, credentials, and transport errors are not logged. `VERCEL_AUTOMATION_BYPASS_SECRET` was used only by the Vercel CLI for protected-preview requests, not committed or passed to client code. `vercel env ls` initially showed it in Production, Preview, and Development. After approval, the Production scope was removed and verified; it now remains in Preview and Development. Vercel warned that removing the environment target does not rotate or revoke the underlying credential. No production deployment occurred.
- The Standard payload uses the recipient bound to `WEB3FORMS_ACCESS_KEY` and sends neither `to` nor Pro-only `ccemail`. The key-bound recipient and its verified status still require confirmation in the Web3Forms dashboard. The previously configured `CONTACT_TO_EMAIL` variable is no longer read by the application.
- No email arrival in the sandbox inbox was confirmed. The live provider response was not successful, and inbox access is unavailable.
- No production deployment or merge was performed. PR #3 is the already-merged foundation PR targeting `main`; it was left untouched. No PR is open for this branch. GitHub CLI has read-only PR permissions, so this branch could not be opened as a draft PR here. The API hardening commit `7becfc9c275c8060211c33791759a34c15c67c61` is pushed; this verification note follows it. Use this compare link to open a draft PR with base `v1/enquiry-api`: https://github.com/sudippandey/Teenkanya-Travel-and-Trek/compare/v1/enquiry-api...v1/web3forms-verification?expand=1
