<div align="center">
  <img src="https://raw.githubusercontent.com/sudippandey/Teenkanya-Travel-and-Trek/main/public/teenkanya-logo.jpg" alt="Teenkanya Travel & Trek" width="180" />
  <h1>Teenkanya Travel & Trek</h1>
  <p><strong>A thoughtful digital travel guide to Nepal.</strong></p>
  <p>Explore destinations, discover sample journeys and trekking routes, and start a conversation with a Kathmandu-based travel team.</p>
  <p>
    <a href="https://3kanyatravel.vercel.app/">Website</a> ·
    <a href="https://github.com/sudippandey/Teenkanya-Travel-and-Trek/issues">Issues</a> ·
    <a href="https://github.com/sudippandey/Teenkanya-Travel-and-Trek/pulls">Pull requests</a>
  </p>
  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
    <img alt="React" src="https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?logo=tailwindcss&logoColor=white" />
    <a href="https://github.com/sudippandey/Teenkanya-Travel-and-Trek/actions/workflows/quality.yml"><img alt="Quality checks" src="https://github.com/sudippandey/Teenkanya-Travel-and-Trek/actions/workflows/quality.yml/badge.svg?branch=main" /></a>
  </p>
</div>

![Himalayan landscape in Nepal](https://raw.githubusercontent.com/sudippandey/Teenkanya-Travel-and-Trek/main/public/images/destinations/everest-region/01.jpg)

## About the project

Teenkanya Travel & Trek is a public-facing travel website for presenting Nepal as a destination and helping prospective travellers make an informed enquiry. The experience brings together destination guides, sample tours, trekking information, travel services and a contact journey.

The website is designed as an **enquiry-led travel brochure**, not an online booking marketplace. Prices, availability, departure dates and operational arrangements are discussed and confirmed directly with the team rather than implied by sample catalogue content.

## What the website includes

| Area | What it does |
| --- | --- |
| **Home** | Introduces the brand and highlights destinations, sample journeys and journal content. |
| **Destinations** | Browse and search 8 destination guides, with practical planning notes, attractions, access and permit context, FAQs and related journeys. |
| **Tours & packages** | Explore 4 sample journey ideas with itinerary outlines, inclusions/exclusions, related destinations and planning questions. |
| **Trekking** | Browse 3 sample trek listings with route notes, season guidance, preparation, permit context and safety information. |
| **Journey finder** | Search destinations, tours and treks together; filter by experience and duration; share or bookmark the selected filters through the URL. |
| **Travel services** | Review 6 service categories and start a service-specific enquiry or WhatsApp conversation. |
| **Travel journal** | Read editorial destination guides and practical travel notes. |
| **Contact & enquiries** | Send a structured enquiry or contact the team by phone, WhatsApp and email. |

## Technology

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS v4 and reusable UI components
- **Icons:** Lucide React
- **Forms and server workflow:** Next.js Route Handler with server-side validation
- **Enquiry persistence:** Supabase Postgres (server-side integration)
- **Email notification:** Web3Forms standard submit API
- **Analytics:** Vercel Analytics
- **Hosting workflow:** Vercel deployments connected to GitHub
- **Automated quality:** GitHub Actions, pnpm, TypeScript checks, Node.js tests and Next.js production build

## Getting started

### Requirements

- Node.js 22 (the CI workflow uses Node 22)
- pnpm 12.3.4
- Git

### 1. Clone the repository

```bash
git clone https://github.com/sudippandey/Teenkanya-Travel-and-Trek.git
cd Teenkanya-Travel-and-Trek
```

### 2. Install dependencies

```bash
corepack enable
corepack prepare pnpm@12.3.4 --activate
pnpm install
```

### 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Add the server-side values required for the enquiry workflow:

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL used by the server-side enquiry repository. |
| `SUPABASE_SECRET_KEY` | Preferred server-only Supabase credential. |
| `SUPABASE_SERVICE_ROLE_KEY` | Legacy server-only credential fallback if the preferred secret key is not configured. |
| `WEB3FORMS_ACCESS_KEY` | Server-side Web3Forms access key used to send enquiry notifications. |

Use one Supabase server credential, not both. Never commit `.env.local`, paste secrets into issues or pull requests, or expose a Supabase secret / service-role key or Web3Forms access key in a `NEXT_PUBLIC_*` variable.

The public pages can be explored locally, but successful enquiry persistence and notification require the corresponding services and credentials to be configured.

### 4. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the local Next.js development server. |
| `pnpm typecheck` | Run the TypeScript compiler without emitting files. |
| `pnpm test` | Run the Node.js unit and regression tests. |
| `pnpm check` | Run TypeScript checks followed by the test suite. |
| `pnpm build` | Create an optimized production build. |
| `pnpm start` | Serve the production build locally. |

Before opening a pull request, run:

```bash
pnpm check
pnpm build
```

The GitHub Actions **Quality checks** workflow runs on pushes and pull requests targeting `main`, `v1/**` and `v2/**`. It installs from the frozen pnpm lockfile, runs typechecking and tests, and builds the application.

## Project structure

```text
.
├── app/
│   ├── about/                 # About page
│   ├── api/enquiries/         # Enquiry API route
│   ├── blog/                  # Journal index and article pages
│   ├── contact/               # Contact and enquiry page
│   ├── destinations/          # Destination index and detail routes
│   ├── services/              # Travel services page
│   ├── tours/                 # Tour index and detail routes
│   ├── trekking/              # Trek index and detail routes
│   ├── globals.css            # Global design system and styles
│   ├── layout.tsx             # Root layout, metadata and shared shell
│   ├── robots.ts              # Search crawler rules
│   └── sitemap.ts             # Public route sitemap
├── components/
│   ├── ui/                    # Reusable UI primitives
│   ├── contact-form.tsx       # Client-side enquiry form
│   ├── journey-finder.tsx     # Cross-catalogue search and filters
│   ├── collection-browser.tsx # Catalogue search and filtering
│   ├── page-templates.tsx     # Shared page sections and templates
│   ├── travel-cards.tsx       # Destination, package and article cards
│   ├── travel-gallery.tsx     # Image gallery
│   ├── trek-detail.tsx        # Trek detail presentation
│   ├── site-header.tsx        # Global navigation
│   └── site-footer.tsx        # Global footer
├── docs/
│   ├── V1-ARCHITECTURE.md     # Product and architecture direction
│   └── WEB3FORMS-VERIFICATION.md
├── lib/
│   ├── enquiries/              # Validation, persistence and notification workflow
│   ├── travel-data.ts          # Destination, package, article and service content
│   ├── trekking-data.ts        # Trek route and safety profiles
│   ├── destination-images.json # Image metadata and attribution
│   ├── travel-service.ts       # Catalogue access abstraction
│   └── contact-links.ts        # Shared WhatsApp link helper
├── public/
│   ├── images/                 # Destination photography
│   └── ...                     # Brand marks and app icons
├── supabase/
│   └── migrations/             # SQL schema and database functions
├── tests/                      # Validation, workflow and content regression tests
├── .env.example                # Environment variable names (no secrets)
├── .github/workflows/          # CI quality workflow
├── next.config.mjs
├── package.json
└── pnpm-lock.yaml
```

## How the application is organised

### Public catalogue

The App Router pages compose reusable components from `components/`. Catalogue content is currently held in typed source modules:

- `lib/travel-data.ts` — destinations, sample packages, journal articles, services and browse-card data.
- `lib/trekking-data.ts` — route stages, season notes, permit context, preparation, safety guidance and FAQs for trekking listings.
- `lib/destination-images.json` — image paths, alternative text, captions, credits, licence details and source links.

Pages access catalogue content through `lib/travel-service.ts`. This adapter keeps the presentation layer separate from the current sample-backed data source and provides a replacement point for a future CMS or database-backed catalogue.

### Enquiry lifecycle

The contact form submits JSON to `POST /api/enquiries`. The server-side workflow is separated into small modules:

1. The route checks the request origin and content type, limits request-body size and rejects honeypot submissions.
2. `lib/enquiries/validation.ts` normalises and validates the submitted fields.
3. `lib/enquiries/submission-workflow.ts` coordinates persistence, notification and retry outcomes.
4. `lib/enquiries/server.ts` stores enquiries in Supabase, generates a reference, applies a database-backed rate limit and handles duplicate submission IDs.
5. `lib/enquiries/web3forms.ts` sends the notification through the Web3Forms standard `/submit` endpoint.
6. The form displays success only after the application confirms the notification workflow; saved-but-unconfirmed submissions retain a reference so the user can retry safely.

The notification recipient is associated with the Web3Forms access key in the provider account. The application does not accept a recipient address from the browser.

### Database and operational prerequisites

The repository includes a Supabase migration at `supabase/migrations/20261031000000_create_enquiries.sql`. It defines the enquiries table, rate-limit storage, row-level security and the rate-limit database function used by the server.

**A migration file in Git does not mean that a Supabase project has been configured or that the migration has been applied.** Before relying on live enquiries, the intended Supabase project must be configured, the migration must be applied and the persistence, permissions, rate-limit and retry/concurrency behaviour must be tested against a non-production environment. Web3Forms server-side restrictions and the access-key recipient must also be verified in the provider dashboard. See [Web3Forms verification notes](docs/WEB3FORMS-VERIFICATION.md).

## Content and business-integrity principles

This project deliberately avoids presenting unverified commercial information as fact:

- Sample tours and trek listings are planning starting points, not guaranteed departures.
- Prices and availability are confirmed through direct enquiry; the site does not invent live rates.
- Exact route operations, overnight stops, transport, accommodation, meals, permits and inclusions must be confirmed before being represented as a final itinerary.
- Trekking altitude, access and permit information should be checked against current official guidance and the selected route.
- Do not add fabricated testimonials, awards, licences, company history, partnerships, team credentials or customer numbers.
- Keep image credits, licences and source links with the image metadata.

## Current scope and future work

The current repository is focused on the public website, catalogue browsing and enquiry capture. A staff-facing enquiry console, full catalogue CMS, customer accounts, quote management, confirmed booking lifecycle, supplier inventory and payment integrations are not represented as completed features.

Future work should be introduced as small, reviewable modules with clear data ownership, server-side security and operational requirements.

## Contributing

1. Create a focused branch from `main` (for example, `v2/feature-name`).
2. Keep changes scoped to one coherent improvement.
3. Add or update tests for changed behaviour and content relationships.
4. Run `pnpm check` and `pnpm build`.
5. Open a pull request into `main` and describe the change, validation and any operational prerequisites.
6. Never include secrets, unverified business claims or unreviewed database changes.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the working agreement.

## Useful links

- [Website](https://3kanyatravel.vercel.app/)
- [Source repository](https://github.com/sudippandey/Teenkanya-Travel-and-Trek)
- [Open issues](https://github.com/sudippandey/Teenkanya-Travel-and-Trek/issues)
- [Pull requests](https://github.com/sudippandey/Teenkanya-Travel-and-Trek/pulls)
- [Architecture notes](docs/V1-ARCHITECTURE.md)
- [Web3Forms verification notes](docs/WEB3FORMS-VERIFICATION.md)

---

<div align="center">
  <sub>Built to help travellers explore Nepal with context, clarity and a direct line to local planning support.</sub>
</div>
