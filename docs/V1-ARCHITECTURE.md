# Teenkanya Travel & Trek — V1 Architecture

## Product direction

Teenkanya serves both domestic Nepali travellers and international visitors. The public website uses English as its initial language. This is one shared product, not two separate websites.

The experience should collect enough context to respond appropriately to either audience:

- Traveller residence/country and preferred contact channel.
- Travel dates or date flexibility.
- Party size and travel interests.
- Destination, tour or trekking interest.
- Budget range only when useful and voluntarily supplied.
- Accessibility, dietary or other trip notes where relevant.

Do not infer nationality from a phone number. Do not make English-only content imply that the service is limited to international customers.

## Commercial rules

- Treat enquiries as the initial conversion path; do not imply a confirmed booking.
- Do not publish invented prices, availability, company history, awards, licences, partnerships, testimonials or team credentials.
- Use NPR for approved domestic quotes. Support USD for approved international quotes when the company supplies verified prices and exchange-rate policy.
- Until pricing is verified, show an enquiry/quote flow rather than fabricated amounts.
- Keep supplier-backed flight, bus, hotel and vehicle availability out of the product until real providers and operational workflows are selected.

## Application architecture

Start with a modular monolith in the existing Next.js App Router application.

### Presentation
- Existing public routes and visual components remain the customer-facing layer.
- Keep reusable UI and accessible interactions in components/.
- Keep route-specific composition in app/.

### Application and business modules
Introduce modules behind server-side boundaries as each capability is implemented:
- Enquiries and customer contact preferences.
- Travel catalogue: destinations, packages, treks, services and editorial content.
- Staff identity, roles and permissions.
- Quotes and booking lifecycle (later phase).
- Supplier integrations and payments (later phase).

### Data access
- Preserve lib/travel-service.ts as the catalogue abstraction.
- Add repository/service interfaces for new database-backed modules.
- PostgreSQL is the intended system of record.
- Prisma is the proposed ORM, to be added with the first database-backed feature after the hosting and credential choices are confirmed.
- Keep credentials in server-only environment variables. Never expose secrets to client components.

### Security
- Validate all untrusted input on the server.
- Add rate limiting and spam controls to public submission endpoints.
- Restrict staff data and admin routes with server-verified authorization.
- Record important administrative changes in an audit trail.
- Collect only customer information needed to respond to the enquiry.

## Delivery phases

1. **Foundation:** quality checks, architecture documentation, content governance and deployment hygiene.
2. **Enquiries:** server validation, persistence, delivery notifications and customer acknowledgement.
3. **Admin:** staff authentication, roles and enquiry management.
4. **Catalogue CMS:** manage destinations, packages, treks, services and publication status.
5. **Quotes and bookings:** quote versions, customer acceptance, booking statuses and operational records.
6. **Integrations:** selected flight/bus/hotel suppliers, payments and customer accounts only after business requirements are confirmed.

## Release policy

- main is the production baseline.
- Work happens on v1/* feature branches.
- Each coherent module is delivered through a pull request into main.
- A pull request must pass the repository quality workflow and receive review before merge.
- Do not merge or deploy to production without explicit approval.
- Do not add production credentials to source control or issue descriptions.
