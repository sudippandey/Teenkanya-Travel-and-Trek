# SEO deployment configuration

The canonical origin is shared by Next.js metadata, Open Graph absolute URLs, `sitemap.xml`, and `robots.txt`. Keep these endpoints on the same host.

## `SITE_URL`

`SITE_URL` is an optional server-side environment variable. It must be an absolute origin only (scheme + hostname + optional port), with no path, query or hash.

- **Production:** set `SITE_URL` to the verified company domain after confirming domain ownership, DNS and the Vercel domain attachment. Do not point canonical metadata at a domain that is not under company control.
- **Preview:** leave `SITE_URL` unset so the app uses Vercel's deployment-specific `VERCEL_URL`. This prevents preview deployments from advertising the production canonical host.
- **Local development:** leave it unset; the fallback is `https://3kanyatravel.vercel.app`. To test a local absolute URL explicitly, use `SITE_URL=http://localhost:3000`.

If `SITE_URL` is unset outside Vercel, the fallback remains `https://3kanyatravel.vercel.app`. Configure the production value in Vercel Project Settings → Environment Variables and redeploy after changing it.

## Post-deployment checks

1. Open `/robots.txt` and confirm its sitemap URL uses the intended canonical host.
2. Open `/sitemap.xml` and confirm every URL uses that same host.
3. Inspect the home page and one detail page source; canonical and Open Graph URLs should use the same host.
4. Confirm Vercel redirects any non-canonical domain aliases to the chosen primary domain.
5. Submit the sitemap to Google Search Console only after the production domain is verified.

Do not change the canonical domain solely because a preview URL is available.
