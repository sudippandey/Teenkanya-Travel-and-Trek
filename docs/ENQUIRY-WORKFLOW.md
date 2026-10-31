# Enquiry Workflow

## Submission sequence

```mermaid
sequenceDiagram
  participant C as Contact form
  participant R as POST /api/enquiries
  participant DB as Postgres
  participant W as Web3Forms
  C->>R: JSON + submissionId
  R->>R: origin, content-type, size, honeypot
  R->>R: validateEnquiry (+ catalogue lookup)
  R->>DB: consume_enquiry_rate_limit(hmac(ip))
  alt limit exceeded
    R-->>C: 429
  end
  R->>DB: find content duplicate (24h, same fingerprint)
  alt duplicate found
    R->>DB: event duplicate_suppressed
    Note over R,DB: reuse existing enquiry (claim if retryable)
  else new
    R->>DB: insert (notification_status = pending)
    Note over DB: triggers: attempts = 1, event "created"
  end
  alt shouldNotify
    R->>W: send notification
    W-->>R: HTTP 2xx and success true?
    R->>DB: notification_status = sent or failed (only from pending)
  end
  R-->>C: 201/200 reference, or 502 saved+reference, or 409, or 503
```

## Guarantees

1. **No false success.** `201/200` is returned only after the row exists **and** Web3Forms returned `success: true`.
2. **No lost leads.** The row is written before notification; a provider failure returns `502` with the saved reference.
3. **No duplicate emails from retries.** The same `submissionId`, or the same content within 24 hours, maps to the existing enquiry. Notification is only re-attempted when the existing row is `failed`, `not_configured` or a `pending` row older than the 2-minute lease, and the claim is a compare-and-set on `(notification_status, updated_at)` so two concurrent retries cannot both send.
4. **Audit trail.** Creation, every notification state change, duplicate suppression, retry requests, staff status changes and notes are recorded in `enquiry_events`.

## Status lifecycle (staff-managed)

```mermaid
stateDiagram-v2
  [*] --> new
  new --> contacted
  new --> closed
  new --> spam
  contacted --> quoted
  contacted --> closed
  contacted --> spam
  quoted --> contacted
  quoted --> confirmed
  quoted --> closed
  confirmed --> closed
  closed --> contacted
  spam --> new
```

`confirmed` means the customer agreed to a quote. It is not a payment or booking guarantee.

## Notification lifecycle

`pending -> sent` or `pending -> failed`. `failed`, `not_configured` and stale `pending` rows can be re-claimed to `pending` by a customer retry or by an admin calling `notification-retry`.

## Spam and abuse controls

- Hidden honeypot field `website`.
- Per-IP rate limit: 5 submissions per 15 minutes, keyed by an HMAC of the IP (raw IPs are never stored).
- Same-origin check and a 16 KB body limit.
- Content fingerprint duplicate suppression.
- Staff can mark enquiries `spam`; spam rows are excluded from duplicate matching.

## Customer acknowledgement

The `acknowledgement_status` column exists (default `not_configured`) but **no acknowledgement email is sent yet**. Sending to customers requires an authorised sending domain and explicit approval; see Known limitations in `BACKEND-AUDIT.md`. The UI must not tell customers they will receive a confirmation email.
