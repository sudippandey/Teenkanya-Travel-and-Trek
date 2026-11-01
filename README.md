# Teenkanya Travel & Trek

A Nepal travel and trekking website built for **Teenkanya Travel & Trek**, a Kathmandu-based travel company.

The site helps visitors explore destinations, compare sample journeys, understand trekking options and send an enquiry to the team. It is designed around direct travel consultation rather than instant online booking.

<p align="center">
  <img src="https://raw.githubusercontent.com/sudippandey/Teenkanya-Travel-and-Trek/main/public/teenkanya-logo.jpg" alt="Teenkanya Travel & Trek logo" width="150" />
</p>

<p align="center">
  <a href="https://3kanyatravel.vercel.app/">Visit the website</a> ·
  <a href="https://github.com/sudippandey/Teenkanya-Travel-and-Trek/issues">Report an issue</a>
</p>

![A view of the Everest region in Nepal](public/images/destinations/everest-region/01.jpg)

## What is included

- **Destination guides** — eight destination pages with highlights, practical access information, planning notes, FAQs and related journeys.
- **Tours and sample packages** — four example itineraries to help visitors start planning. Final routes, prices and arrangements are confirmed through enquiry.
- **Trekking information** — three trek profiles covering route context, preparation, season guidance, permits and safety.
- **Journey finder** — search destinations, tours and treks together, then filter by experience and duration. Filters are reflected in the URL so a search can be shared.
- **Travel services** — six service categories with enquiry links and direct WhatsApp contact.
- **Travel journal** — editorial travel articles and destination information.
- **Enquiry form** — a structured contact flow for sending requests to the team.

## Built with

| Layer | Technology |
| --- | --- |
| Application | Next.js App Router, React, TypeScript |
| Styling | Tailwind CSS |
| UI components | Reusable React components, Lucide icons |
| Enquiry API | Next.js Route Handler with server-side validation |
| Data and persistence | Typed catalogue data; Supabase for enquiry persistence |
| Email notification | Web3Forms |
| Quality checks | pnpm, TypeScript, Node.js tests, GitHub Actions |

## Run locally

### Requirements

- Node.js 22
- pnpm 12.3.4
- Git

### Setup

```bash
git clone https://github.com/sudippandey/Teenkanya-Travel-and-Trek.git
cd Teenkanya-Travel-and-Trek

corepack enable
corepack prepare pnpm@12.3.4 --activate
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

The public pages can run locally without connecting the enquiry providers. To test the complete enquiry flow, configure these server-side variables in `.env.local`:

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Preferred server-only Supabase credential |
| `SUPABASE_SERVICE_ROLE_KEY` | Legacy server-only fallback |
| `WEB3FORMS_ACCESS_KEY` | Access key for enquiry email notifications |

Configure one Supabase credential. Never commit `.env.local`, expose server credentials through `NEXT_PUBLIC_*` variables, or include secrets in issues or pull requests.

A migration is included in `supabase/migrations/`, but its presence in the repository does not mean it has been applied to a live Supabase project. The database, permissions, rate limiting and notification settings must be configured and tested separately before relying on live enquiry submissions.

## Development commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm test` | Run automated tests |
| `pnpm check` | Run typechecking and tests |
| `pnpm build` | Create a production build |
| `pnpm start` | Run the production build locally |

Before submitting a change:

```bash
pnpm check
pnpm build
```

## Project layout

```text
app/                  Next.js routes and pages
components/           Shared page sections and UI components
docs/                 Architecture and provider notes
lib/
  enquiries/          Enquiry validation, persistence and notification
  travel-data.ts      Destination, package, journal and service content
  trekking-data.ts    Trek profiles and planning information
  travel-service.ts   Catalogue data access layer
public/               Brand assets and destination photography
supabase/migrations/  Database schema and functions
tests/                Automated regression tests
```

### Where content lives

- `lib/travel-data.ts` contains destination, sample package, journal and service content.
- `lib/trekking-data.ts` contains trekking profiles and related planning information.
- `lib/destination-images.json` records image paths, alt text, captions, credits, licences and source details.
- `lib/travel-service.ts` provides the catalogue access layer used by pages.

## Enquiry flow

The contact form sends a request to `POST /api/enquiries`. The server validates the request, applies abuse protections, stores the enquiry through the Supabase integration and sends an email notification through Web3Forms.

The browser does not choose the notification recipient. That recipient is configured against the provider access key. The form distinguishes a confirmed submission from a saved enquiry whose notification needs to be retried.

For provider setup and verification details, see [the Web3Forms verification notes](docs/WEB3FORMS-VERIFICATION.md).

## Content accuracy

The catalogue is intended to support planning conversations, not to imply unverified availability or commercial commitments.

- Sample journeys are examples, not guaranteed departures.
- Prices, availability and final itineraries are confirmed directly with the travel team.
- Accommodation, meals, transport, permits, route operations and other inclusions must be confirmed for each enquiry.
- Trekking information should be checked against current official guidance before travel.
- Keep image credits and licence information with the relevant image metadata.

## Current scope

This repository contains the public website, travel catalogue and enquiry workflow. It does not currently provide a staff enquiry dashboard, full content-management system, customer accounts, online payments, supplier inventory or a confirmed booking lifecycle.

## Project notes

- [Architecture overview](docs/V1-ARCHITECTURE.md)
- [Web3Forms verification](docs/WEB3FORMS-VERIFICATION.md)
- [Contribution guide](CONTRIBUTING.md)
- [Open issues](https://github.com/sudippandey/Teenkanya-Travel-and-Trek/issues)
