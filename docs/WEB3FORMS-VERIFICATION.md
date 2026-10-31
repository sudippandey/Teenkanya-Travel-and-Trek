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
- Client credential check: no Web3Forms access-key name, value, or provider endpoint in the contact-form source; a scan of 15 compiled client assets found zero matches for the configured key value or variable name.

## Live provider probe

Synthetic requests using the configured credential were sent directly from the verification runner to Web3Forms `/submit`: first with the previous CC field, then with the Standard payload (no `to` or `ccemail`). Both returned HTTP 403 with non-JSON responses. A separate request with a synthetic invalid key also returned HTTP 403 without JSON. No provider success was confirmed and no email notification can be claimed. Because these requests did not originate from Vercel, the results do not distinguish an invalid/disabled key from provider account restrictions or origin/IP policy. No response body, credentials, or customer data were logged.

## Vercel preview

The branch preview deployment reached `Ready` at:

`https://tenkanyatravelandtrek-9j4d039z4-aura-ff3b.vercel.app`

The deployment is protected by Vercel Authentication. Browser navigation redirects to Vercel login; authenticated CLI preview requests also returned `401 Protected deployment`. Therefore the browser enquiry flow and the preview API could not be exercised in this environment. No valid enquiry was submitted through the preview and no preview email was triggered.

## Security and remaining limitations

- `WEB3FORMS_ACCESS_KEY` is read only in the server-only provider module. The UI receives generic application messages and never receives provider response text.
- Route logs contain fixed operational messages only; provider bodies, credentials, and transport errors are not logged.
- The Standard payload uses the recipient bound to `WEB3FORMS_ACCESS_KEY` and sends neither `to` nor Pro-only `ccemail`. The user confirmed the key-bound recipient is the temporary sandbox mailbox. Vercel-origin requests may also require provider-side IP allowlisting. The previously configured `CONTACT_TO_EMAIL` variable is no longer read by the application.
- Provider acceptance would confirm that Web3Forms accepted the notification request, not independently verify inbox delivery. Inbox access was not available.
- No production deployment or merge was performed. GitHub CLI has read-only PR permissions, so no draft PR was opened. The branch is pushed. Draft PR form with base `v1/enquiry-api`: https://github.com/sudippandey/Teenkanya-Travel-and-Trek/compare/v1/enquiry-api...v1/web3forms-verification?expand=1
