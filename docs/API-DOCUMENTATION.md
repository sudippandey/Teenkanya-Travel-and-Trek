# API Documentation

All responses are JSON with `Cache-Control: no-store`. Errors always have the shape:

```json
{ "error": "machine_code", "message": "Human readable text", "fieldErrors": { "field": "reason" } }
```

`fieldErrors` is only present for validation failures (`422`).

---

## Public API (Engineer 2 — enquiry forms)

### `POST /api/enquiries`

Same-origin only (a cross-origin `Origin` header is rejected with `403`). `Content-Type: application/json`, body at most 16 KB.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `submissionId` | UUID string | yes | Generate once per form instance with `crypto.randomUUID()`; **reuse it when retrying**. |
| `fullName` | string | yes | 2–120 chars. |
| `email` | string | conditional | Required when `preferredContactChannel` is `email`; at least one of email/phone is required. At most 254 chars. |
| `phone` | string | conditional | Required for `phone` / `whatsapp`. 7–15 digits, at most 30 chars. |
| `countryOfResidence` | string | no | At most 100 chars. |
| `preferredContactChannel` | `email` \| `phone` \| `whatsapp` | yes | |
| `interest` | `tour` \| `trekking` \| `travel_service` \| `other` | yes | |
| `message` | string | yes | 10–4000 chars. |
| `travelStartDate` | `YYYY-MM-DD` | no | Must be a real calendar date. |
| `datesFlexible` | boolean | no | |
| `travellerCount` | integer | no | 1–50. |
| `catalogueItemType` | `destination` \| `package` \| `trek` | with slug | Must be sent together with `catalogueItemSlug`. |
| `catalogueItemSlug` | string | with type | Must match an item that exists in `lib/travel-data.ts`. |
| `specialRequirements` | string | no | At most 1000 chars. |
| `website` | string | no | Honeypot — leave empty and hidden. |

| Status | Body | Meaning / UI action |
| --- | --- | --- |
| `201` | `{ status: "received", reference }` | Saved and the team was notified. Show the reference. |
| `200` | `{ status: "received", reference }` | Duplicate of an already-notified enquiry. Show the same success state. |
| `400` | `invalid_json`, `invalid_submission`, `invalid_content_length` | Generic "please try again". |
| `403` | `invalid_origin` | Not expected from the site itself. |
| `409` | `{ error: "notification_pending", saved: true, reference }` | Saved; another attempt is in flight. Wait, then retry with the **same** `submissionId`. |
| `413` | `payload_too_large` | |
| `415` | `unsupported_media_type` | |
| `422` | `invalid_submission` + `fieldErrors` | Show per-field errors. |
| `429` | `rate_limited`, header `Retry-After: 900` | |
| `502` | `{ error: "notification_failed", saved: true, reference }` | Saved but email not confirmed. Show the reference and a retry button (same `submissionId`). |
| `503` | `submission_unavailable` | **Not saved.** Offer a retry and direct contact details. |

Pre-selecting a catalogue item (for Engineer 2 to wire up; the current form doesn't read query params): link to `/contact?type=destination&slug=kathmandu`, read the params, and send them as `catalogueItemType` / `catalogueItemSlug`. Unknown slugs return `422`.

### `GET /api/health`

`200 { status: "ok", checks: { database, notifications } }` or `503` with `status: "degraded"`. Each check is `ok`, `not_configured` or `unavailable`. Suitable for uptime monitors.

---

## Admin API (Engineer 3 — enquiry dashboard)

### Authentication

1. Sign the staff user in with Supabase Auth in the browser (`supabase.auth.signInWithPassword`).
2. Send `Authorization: Bearer <session.access_token>` on every admin request.
3. The server verifies the token with Supabase and requires an **active** row in `staff_members`.

| Status | `error` | Meaning |
| --- | --- | --- |
| `401` | `unauthenticated` | Missing, malformed or expired token. Refresh the session or sign in. |
| `403` | `forbidden` | Valid user but not staff, inactive, or role lacks the permission. |
| `503` | `service_unavailable` | Authorization backend unreachable. Retry. |

### Permissions

| Permission | `admin` | `agent` |
| --- | --- | --- |
| `enquiries:read` | yes | yes |
| `enquiries:update_status` | yes | yes |
| `enquiries:add_note` | yes | yes |
| `enquiries:retry_notification` | yes | no |

### `GET /api/admin/enquiries` — `enquiries:read`

Query: `status`, `reference`, `email`, `page` (default 1), `pageSize` (1–100, default 25). Invalid filters return `422 invalid_query`.

```json
{
  "items": [{
    "reference": "TTT-261101-0A1B2C3D4E5F6071",
    "fullName": "…", "email": "…", "phone": null,
    "countryOfResidence": "Nepal", "preferredContactChannel": "email",
    "interest": "trekking",
    "catalogueItem": { "type": "trek", "slug": "everest-base-camp" },
    "travelStartDate": "2027-03-01", "datesFlexible": true, "travellerCount": 2,
    "status": "new", "notificationStatus": "sent", "notificationAttempts": 1,
    "acknowledgementStatus": "not_configured", "assignedStaffId": null,
    "createdAt": "…", "updatedAt": "…", "statusChangedAt": null
  }],
  "page": 1, "pageSize": 25, "total": 1
}
```

Sorted newest first.

### `GET /api/admin/enquiries/:reference` — `enquiries:read`

`200 { enquiry }`: the summary fields plus `message`, `specialRequirements`, `sourcePage`, `lastNotificationAttemptAt` and `events[]` (`id, type, actorType, actorId, fromStatus, toStatus, note, metadata, createdAt`, oldest first, up to 200). Returns `404 not_found` when the reference is unknown or malformed.

### `PATCH /api/admin/enquiries/:reference/status` — `enquiries:update_status`

```json
{ "status": "contacted", "expectedStatus": "new", "note": "Called, will send quote" }
```

`expectedStatus` is the status the UI last displayed (optimistic concurrency).

| Status | Meaning |
| --- | --- |
| `200 { reference, status }` | Updated and audited. |
| `404` | Unknown reference. |
| `409 status_conflict` | Someone else changed it — refetch the detail. |
| `415` / `400` / `413` | Body problems. |
| `422 invalid_update` | Bad value or transition not allowed. |

Allowed transitions:

| From | To |
| --- | --- |
| `new` | `contacted`, `closed`, `spam` |
| `contacted` | `quoted`, `closed`, `spam` |
| `quoted` | `contacted`, `confirmed`, `closed` |
| `confirmed` | `closed` |
| `closed` | `contacted` |
| `spam` | `new` |

### `POST /api/admin/enquiries/:reference/notes` — `enquiries:add_note`

`{ "note": "…" }` (1–2000 characters) -> `201 { reference, added: true }`.

### `POST /api/admin/enquiries/:reference/notification-retry` — `enquiries:retry_notification`

No body. Re-sends the internal team notification for `failed`, `not_configured` or stale (over 2 minutes) `pending` enquiries.

| Status | Body |
| --- | --- |
| `200` | `{ reference, notificationStatus: "sent", retried: true }` or `retried: false` if it was already sent. |
| `409` | `notification_in_progress` |
| `502` | `{ notificationStatus: "failed", retried: true }` |
