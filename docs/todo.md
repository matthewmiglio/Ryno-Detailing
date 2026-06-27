# TODO

Build order is top-to-bottom. Each rung mostly unblocks the next.

## 0. Foundation
- [x] Envs for `website/` (Supabase URL/anon/service, Resend key, contact form to/from) + `.env.example`
- [x] Envs for `dashboard/` (Supabase URL/anon/service, Resend key) + `.env.example`

## 1. Website page scaffolding (desktop)
- [x] Favicon (Foam Bubbles mark; favicon.ico + icon.svg + apple-icon.png in website/app and dashboard/app)
- [x] Home `/`
- [x] Services `/services`
- [x] Gallery `/gallery` (before/after photos)
- [x] About `/about` (Ryder Helms, Noah Pickelhaupt) — team uses CSS initials avatars (no headshot in public/ yet)
- [x] Contact `/contact` — page + visual form UI (Resend/Supabase wiring is section 2)
- [x] 404 / not-found (branded)
- [x] Privacy policy `/privacy`
- [x] Terms `/terms`
- [ ] Sitemap (`app/sitemap.ts`, all public routes) + robots
- [ ] Finished navbar — replace the scaffold nav in `app/layout.tsx` with the final design (sticky/scroll behavior, active-link state, polished logo/CTA)

## 2. Contact form + data
- [x] Build contact form (client component `app/contact/ContactForm.tsx`; required fields, sending/success/error states; click-to-call + email links live in the page)
- [x] Hook contact form to email — form POSTs to `/api/send-email` (builds subject + HTML from fields). NOTE: currently calls send-email directly, no spam filter; revisit when `/api/forms` lands (it should validate + run spam filter, then send server-side).
- [x] Hook contact form to Supabase (submission retention table) — `ContactForm` now POSTs `/api/forms`, which inserts `RYNO_FORMS` then sends the email server-side (phone + email made required)
- [x] Analytics (Supabase pageview tracking across all pages) — `app/AnalyticsTracker.tsx` mounted in layout: pageview POST on route change + delegated tel: click logging

## 3. API routes (website)
Mirrors the proven pattern from the pxb-development reference sites (diaz / georgia /
cruz / true-phase): a small set of POST routes plus shared lib helpers. All live under
`website/app/api/<name>/route.ts`. Geolocation comes free from Vercel edge headers
(`x-vercel-ip-city`, `x-vercel-ip-country-region`, `x-vercel-ip-country`).

Routes:
- [x] POST `/api/forms` (runtime nodejs) — validates required fields -> 400; runs spam filter -> 400; reads Vercel geo; inserts `RYNO_FORMS` via `supabaseAdmin`; 500 on insert error; then sends notification email server-side (failure non-fatal); 200 `{ success, data }`.
- [x] POST `/api/analytics` (runtime edge) — requires `path` -> 400; inserts `RYNO_ANALYTICS`; GET -> 405.
- [x] POST `/api/send-email` (runtime nodejs) — done. Resend REST (`https://api.resend.com/emails`, Bearer `RESEND_API_KEY`) via fetch; requires `subject` + `html`; recipients from `CONTACT_FORM_TO` (comma-split, drop any `example.com`), `from` = `CONTACT_FORM_FROM`. Logic extracted to `website/lib/email.ts` (`sendEmail`) so `/api/forms` can reuse it server-side. (env names differ from the original `FORM_RESPONSE_DESTINATION_EMAILS` note.)
- [x] POST `/api/phone-click` (runtime nodejs) — logs a click-to-call event into `RYNO_PHONE_CLICKS`.

Shared lib + client wiring (required by the routes):
- [x] `lib/constants.ts` — `SITE_NAME = "ryno-detailing"` (stamped onto every inserted row)
- [x] `lib/analytics/geolocation.ts` — `getLocationFromHeaders(req)` reading the `x-vercel-ip-*` headers into `{ city, state, country }`
- [x] `lib/spamFilter.ts` — `checkForSpam(email, message)` + `isGibberish(text)` + blocked-keyword lists
- [x] Supabase client: `lib/supabase.ts` — `supabaseAdmin` via `@supabase/supabase-js` with the SERVICE ROLE key (named `lib/supabase.ts`, not `lib/supabase/server.ts`)
- [x] Client: visitor_id (localStorage) + session_id (sessionStorage) via `crypto.randomUUID`, pageview POST on route change, document-level tel: click -> `/api/phone-click` (`app/AnalyticsTracker.tsx`)
- [x] Email trigger: server-side inside `/api/forms` (one client call). Decided + implemented.

## 4. Database (Supabase)
All tables MUST be prefixed `RYNO_`. The reference sites hand-create their tables with
no migrations in-repo; we will instead check in a SQL schema. Three core tables (the
extra beyond forms + analytics is the phone-click log).

Tables:
- [x] `RYNO_FORMS` — contact submissions
  - `id` uuid pk default `gen_random_uuid()`, `created_at` timestamptz default `now()`
  - `full_name` text, `email` text, `phone` text, `message` text
  - `site_name` text, `visitor_id` text, `session_id` text, `ip_hash` text, `ua` text, `referrer` text
  - `city` text, `state` text, `country` text
- [x] `RYNO_ANALYTICS` — page views
  - `id` uuid pk default `gen_random_uuid()`, `created_at` timestamptz default `now()`
  - `path` text not null, `referrer` text, `visitor_id` text, `session_id` text, `ua` text
  - `city` text, `state` text, `country` text, `site_name` text
- [x] `RYNO_PHONE_CLICKS` — click-to-call events
  - `id` uuid pk default `gen_random_uuid()`, `created_at` timestamptz default `now()`
  - `site_name` text, `visitor_id` text, `session_id` text, `ip_hash` text, `ua` text, `referrer` text
  - `city` text, `state` text, `country` text
- [ ] (optional) `RYNO_EMAIL_LOG` — audit of sent emails: `id`, `created_at`, `to` text, `subject` text, `status` text, `resend_id` text

DB setup tasks:
- [x] Write `supabase/schema.sql` creating the 3 `RYNO_` tables above (quoted uppercase names; `pgcrypto` for `gen_random_uuid()`). Applied to project `rxwdtssnaymiebnhudix` via the Management API (`tests/apply_schema.py`).
- [x] RLS: enabled on every `RYNO_` table with NO public policies (fully locked). API routes run server-side with the SERVICE ROLE key (bypasses RLS); anon is blocked. Verified by `tests/test_supabase_rls.py`.
- [x] Indexes for dashboard queries: `RYNO_ANALYTICS(created_at)`, `RYNO_ANALYTICS(path)`, `RYNO_FORMS(created_at)`, `RYNO_PHONE_CLICKS(created_at)`
- [x] Dashboard read path: `supabase/rpc.sql` — two SECURITY DEFINER RPCs (`ryno_dashboard_stats`, `ryno_forms_recent`) with EXECUTE granted only to `service_role`; called from `dashboard/lib/supabase.ts`. Verified by `tests/test_dashboard_rpc.py`.

## 5. Human QA (desktop, all pages)
- [ ] Home `/`
- [ ] Services `/services`
- [ ] Gallery `/gallery`
- [ ] About `/about`
- [ ] Contact `/contact`

## 6. Mobile + tablet styling (all pages)
Tablet (<=1024px) and mobile (<=640px) breakpoints added to `globals.css`
(nav stacks, grids collapse, type/padding scale down). Legal pages also covered.
- [x] Home `/`
- [x] Services `/services`
- [x] Gallery `/gallery`
- [x] About `/about`
- [x] Contact `/contact`

## 7. Puppeteer MCP pass (all pages)
Audited at mobile 375 and tablet 768. No horizontal overflow, no broken/distorted
images, all inputs labeled. Fixed: tablet nav overlap (logo over links + clipped CTA).
- [x] Home `/`
- [x] Services `/services`
- [x] Gallery `/gallery`
- [x] About `/about`
- [x] Contact `/contact`
- [ ] Sub-service pages `/services/[service]` (all 7) — `/puppeteer-style-audit`

## 8. Service-by-area pages (programmatic local SEO) — BIG, separate from basic scaffolding
Pattern lifted from pxb-development/georgia-natural-scapes: data-driven dynamic
routes, one static page per service × area combo, each with its own SEO metadata
and JSON-LD. Three layers:

```
/services                          # layer 1: main services page (already in section 1)
   /services/[service]             # layer 2: one page per individual service
      /services/[service]/[area]   # layer 3: that service, localized to one area
```

- Layer 1 (`/services`) links down to each per-service page.
- Layer 2 (`/services/[service]`) links down to that service's per-area pages.
- Layer 3 (`/services/[service]/[area]`) is the localized landing page.
- All three reuse the same dynamic-generation approach (`generateStaticParams`
  over the service × area cross product, per-page `generateMetadata`).

**Internal links are required (not optional):**
- Main service page (`/services`) MUST link to every sub-service page (`/services/[service]`).
- Each sub-service page MUST link to its sub-service-by-area pages (`/services/[service]/[area]`).
- This top-down link mesh is what makes the programmatic SEO work; every generated page must be reachable by crawlers via real `<Link>`s, not just by URL.

Tasks:
- [x] Service data — `website/app/data.ts` `subServices` (7 consolidated services: slug, lead/accent, intro, body, includes[], before/after pairs). NOTE: no `src/` dir in this project, data lives in app/data.ts. Photos are interior-only, so exterior/wax/wheels/window pages render copy-only (no gallery) until exterior assets exist.
- [ ] `src/data/area-data.ts` — one entry per service area (slug, name, county/region, intro, neighborhoods, local copy)
- [x] Layer 2 route `/services/[service]/page.tsx` — `generateStaticParams` over the 7 sub-services; per-page `generateMetadata` (title+desc only so far, no canonical/OG/JSON-LD yet); each page ends in a CTA `<Link href="/contact">`. Still TODO once layer 3 exists: link each sub-service down to its area pages.
- [ ] Layer 3 route `/services/[service]/[area]/page.tsx` — `generateStaticParams` over service × area; `notFound()` on bad slug
- [ ] Per-page SEO: dynamic `generateMetadata` (title, description, canonical, OG/Twitter) + JSON-LD `Service`/`LocalBusiness` schema with `areaServed`
- [ ] Shared content component (e.g. `ServiceAreaContent`) so all area pages render consistently
- [ ] Wire layer 1 `/services` to link each service; wire each service to link its areas (internal-link mesh for SEO) — layer 1 -> sub-service DONE (`/services` card grid links all 7); service -> area pending layer 3.
- [ ] Add area pages to sitemap

## 9. Dashboard
- [x] Dashboard auth (HTTP Basic Auth via `dashboard/proxy.ts`) — empty placeholder page gated; DASHBOARD_USER/PASSWORD in env. NOTE: Next 16 renamed `middleware.ts` -> `proxy.ts` (root, fn named `proxy`); guide below still says middleware.
- [ ] Dashboard layout (shell, nav between the two pages)
  - [ ] Overview / analytics page
  - [ ] Contact submissions page
- [x] Dashboard RPCs (read analytics + form submissions from Supabase) — `supabase/rpc.sql` + typed wrappers in `dashboard/lib/supabase.ts` (`getDashboardStats`, `getRecentForms`). Locked to `service_role`; tested. (The layout/pages above still consume these.)

### Auth guide (lifted from `wow_fishbot/dashboard`)

Same approach as the fishbot dashboard: **HTTP Basic Auth enforced by Next.js
middleware**. No login page, no session table, no cookies, no auth library. The
browser shows its native username/password prompt and remembers it for the
session. This is the right amount of auth for a single-admin internal dashboard.

The only difference from fishbot: fishbot hardcoded the user as `admin` and read
just `DASHBOARD_PASSWORD`. Here we make **both** the user and password env vars.

**1. Env vars.** Add to `dashboard/.env.local` (and document in
`dashboard/.env.example` with these same placeholder values):

```
DASHBOARD_USER=username
DASHBOARD_PASSWORD=password
```

`.env.local` is gitignored, so the real values never get committed. `username`
/ `password` are fine as the temporary working credentials for now; change them
before this goes anywhere real.

**2. Middleware.** Create `dashboard/src/middleware.ts` (or `dashboard/middleware.ts`
if the app isn't using a `src/` dir — match wherever the app's code lives):

```ts
import { NextRequest, NextResponse } from "next/server";

// Protect everything except Next's static assets.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const user = process.env.DASHBOARD_USER;
  const pwd = process.env.DASHBOARD_PASSWORD;
  if (!user || !pwd) {
    return new NextResponse("DASHBOARD_USER / DASHBOARD_PASSWORD not set", {
      status: 500,
    });
  }
  const expected = "Basic " + btoa(`${user}:${pwd}`);
  if (auth !== expected) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="dashboard"' },
    });
  }
  return NextResponse.next();
}
```

How it works:
- The `matcher` runs the middleware on every request except Next's static
  assets and the favicon. So every page and API route is gated.
- The browser sends `Authorization: Basic base64(user:pass)`. We rebuild the
  expected header from the env vars and string-compare.
- On mismatch we return `401` with `WWW-Authenticate: Basic`, which is what
  triggers the browser's native login prompt. After the user enters
  credentials, the browser resends them on every request automatically.
- `btoa` is used (not Node's `Buffer`) because middleware runs on the Edge
  runtime where `Buffer` isn't available.

**3. Notes / gotchas.**
- This is plaintext Basic Auth, so it's only safe over HTTPS (fine on Vercel,
  which is HTTPS by default). Don't run the real dashboard over plain HTTP.
- To "log out" there's no button: it's the browser's stored basic-auth
  credential. Closing the browser, or visiting `https://user@host` with a wrong
  user, clears it. Not worth building a logout flow for one admin.
- If you ever want >1 user or real sessions, that's a rewrite to Supabase Auth,
  not an extension of this. Don't pre-build for it (YAGNI).

## 10. Tests
Standalone scripts in `tests/` (Python, own gitignored `tests/.env`). Mostly stdlib-only; the Playwright E2E needs `playwright` + a browser.
- [x] Resend API key / email send (`tests/test_resend.py`) — verified, real send to matmigg0804@gmail.com succeeded
- [x] Supabase connectivity + RLS (`tests/test_supabase_rls.py`) — inserts into all 3 `RYNO_` tables with service-role (succeeds) vs anon (blocked by RLS), then cleans up its rows. All PASS.
- [x] Dashboard RPC policies (`tests/test_dashboard_rpc.py`) — calls both read RPCs with service-role (200 + shape check) vs anon (401, execute revoked). All PASS.
- [x] Live contact form E2E (`tests/test_contact_form.py`, Playwright) — visits `rynodetailing.com/contact`, fills + submits, asserts `/api/forms` 200 + success message + no page/console errors. Embeds a marker for manual email-receipt check. PASSED against prod (200, clean). Run: `python -m playwright install chromium` then `python tests/test_contact_form.py`.
- [x] Live analytics E2E (`tests/test_analytics.py`, Playwright) — visits a few pages under a unique synthetic user-agent, asserts each `/api/analytics` POST 200, then pulls the 50 most recent `RYNO_ANALYTICS` rows and confirms every visited path appears (matched by the synthetic `ua`), then deletes those synthetic rows. PASSED against prod (4/4 paths recorded + cleaned up). Optional `SITE_URL` override (default `https://rynodetailing.com`).
