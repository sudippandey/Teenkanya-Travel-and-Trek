# Web3Forms Verification

Date: 2026-10-31  
Branch: `v1/web3forms-verification`  
Intended PR base: `v1/enquiry-api`

## Automated checks

- `pnpm check`: passed; TypeScript and 18 tests passed.
- `pnpm build`: passed.
- Provider success mock: passed; only HTTP success plus `{ success: true }` is accepted.
- Provider rejection, invalid-key response, non-2xx response, malformed JSON, and network failure mocks: passed. Failures are reduced to generic reason codes and do not return provider or transport text.
- Enquiry workflow: valid submission, invalid-before-persistence, notification failure, and duplicate suppression tests passed.
- Client secret check: no Web3Forms access key or provider endpoint is present in the contact-form source. A scan of 15 compiled client assets found zero matches for either `WEB3FORMS_ACCESS_KEY` or `VERCEL_AUTOMATION_BYPASS_SECRET` (values or names).

## Live provider probe

Synthetic requests using the configured credential were sent directly from the verification runner to Web3Forms `/submit`: first with the previous CC field, then with the Standard payload (no `to` or `ccemail`). Both returned HTTP 403 with non-JSON responses. A separate request with a synthetic invalid key also returned HTTP 403 without JSON. No provider success was confirmed and no email notification can be claimed. Because these requests did not originate from Vercel, the results do not distinguish an invalid/disabled key from provider account restrictions or origin/IP policy. No response body, credentials, or customer data were logged.

## Vercel preview

The branch preview deployment reached `Ready` at:

`https://tenkanyatravelandtrek-1h9cxbx20-aura-ff3b.vercel.app`

With the automation bypass configured, Vercel CLI requests reached the deployed API:

- Empty JSON submission returned `422 invalid_submission` before persistence or notification.
- One synthetic valid submission was saved, then returned `notification_failed` because Web3Forms did not confirm notification. The saved reference is `TTT-261031-EEBDBC3046BF3F96`. No email was confirmed.

Direct `agent-browser` navigation still redirects to Vercel Authentication because its browser sandbox cannot access the project-side bypass credential/cookie without transferring secret material. The local contact form was exercised separately with a mocked API success: required-field validation prevented a blank submission, and the success confirmation/reference state rendered. This is not a browser test of the deployed preview.

## Security and remaining limitations

- `WEB3FORMS_ACCESS_KEY` is read only in the server-only provider module. The UI receives generic application messages and never receives provider response text.
- Route logs contain fixed operational messages only; provider bodies, credentials, and transport errors are not logged. `VERCEL_AUTOMATION_BYPASS_SECRET` was used only by the Vercel CLI for protected-preview requests, not committed or passed to client code. `vercel env ls` initially showed it in Production, Preview, and Development. After approval, the Production scope was removed and verified; it now remains in Preview and Development. Vercel warned that removing the environment target does not rotate or revoke the underlying credential. No production deployment occurred.
- The Standard payload uses the recipient bound to `WEB3FORMS_ACCESS_KEY` and sends neither `to` nor Pro-only `ccemail`. The user confirmed the key-bound recipient is the temporary sandbox mailbox. Vercel-origin requests may also require provider-side IP allowlisting. The previously configured `CONTACT_TO_EMAIL` variable is no longer read by the application.
- Provider acceptance would confirm that Web3Forms accepted the notification request, not independently verify inbox delivery. Inbox access was not available.
- No production deployment or merge was performed. GitHub CLI has read-only PR permissions, so no PR URL exists and no draft PR was opened. The branch is pushed. Compare link with base `v1/enquiry-api` (choose the draft option when creating the PR): https://github.com/sudippandey/Teenkanya-Travel-and-Trek/compare/v1/enquiry-api...v1/web3forms-verification?expand=1
