# Progress Log

## How to use this doc
- **Append-only.** Never edit or delete past entries. Only add new ones at the bottom.
- Each entry uses this format:

```
{date}
{list of changes / additions / fixes, one per line}
==================
```

- `{date}` is the calendar date of the work (YYYY-MM-DD).
- Add a `==================` separator line after each entry.
- Newest entries go at the bottom.

---

2026-06-27
Scaffolded the project at C:\My_Files\my_programs\ryno-detailing\
Created Next.js website/ via `npx create-next-app@latest` (defaults).
Imported service photos into website/public/images/ (JPGs as-is, HEICs converted to JPG).
Moved the project brief to docs/prompt.txt and gitignored it (contains the Supabase key).
Added docs/progress.md and docs/todo.md.
==================

2026-06-27
Added .claude/settings.local.json with bypassPermissions default mode; gitignored .claude/.
Built 10 desktop home-page design previews in a temp styling-testing/ folder (orange/white/black), using website/public/ images via full file paths; a few followed the luxury style guide from site-docs.
Verified all 10 previews in Puppeteer at 1440px desktop viewport.
Picked the 06-diagonal-dynamic concept as the direction.
Wrote docs/style.md: full style guide from the 06 design (tokens, Saira typography, signature skew/clip effects, component HTML+CSS, starter shell).
Deleted styling-testing/ and removed its .gitignore entry.
==================

2026-06-27
Renamed all 59 service photos in website/public/images/ from IMG_#### to descriptive names, with before/after pairs matched (e.g. black-leather-rear-seat-before/after). Normalized extensions to lowercase .jpg.
Converted website/public/images/IMG_8524.MOV to MP4 (H.264, faststart) and named it subaru-interior-walkthrough-dirty-mats-before.mp4 based on extracted-frame analysis.
Filled in docs/todo.md with the build plan (envs, website scaffolding, contact form + email/Supabase, analytics, QA/mobile/puppeteer passes, dashboard).
==================

2026-06-27
Added docs/profiles.md (Resend account email) and gitignored it.
Created .env.local for website/ and dashboard/ with Supabase URL/anon/service keys and the Resend API key; website/ also got contact form to/from addresses.
Added matching .env.example files (placeholders only, no secrets) for both apps.
Added !.env.example exception to both .gitignore files so examples commit while .env*.local stays ignored; verified with git check-ignore.
==================

2026-06-27
Fixed NEXT_PUBLIC_SUPABASE_URL in both .env.local files to the base project URL (dropped the /rest/v1/ suffix) so supabase-js can use it.
Confirmed both apps are on Next.js 16.2.9; read the bundled app-router docs (layouts/pages, fonts) before editing per AGENTS.md.
Stripped both website/ and dashboard/ to a single blank page: page.tsx returns null, layout.tsx is a minimal root layout (no Geist fonts, real titles), globals.css is just the Tailwind import.
Removed all Next/Vercel default assets: public/{file,globe,next,vercel,window}.svg and app/favicon.ico from both apps. website/public/images/ left intact; dashboard/public/ now empty.
==================

2026-06-27
Built icons.html at repo root: a picker of 20 orange/white/black favicon marks (detailing themed), each with 16/24/32px previews and a client-side SVG-to-512px-PNG download button. Verified rendering and untainted PNG export via Puppeteer.
Picked the Foam Bubbles mark. Authored the vector and rendered it natively in Pillow (supersampled per size) into a multi-size favicon.ico (16/32/48/64/128/256 via ImageMagick), icon.svg, and an opaque 180px apple-icon.png.
Installed favicon.ico + icon.svg + apple-icon.png into website/app and dashboard/app (Next.js file-based metadata auto-wires the link tags; confirmed neither layout.tsx sets a conflicting icons metadata key).
==================

2026-06-27
Added Service Areas (Atlanta, Alpena, Mio, Hillman, Lachine, all MI) to docs/prompt.txt and renumbered its sections.
Added a sitemap task to docs/todo.md (app/sitemap.ts + robots, under website page scaffolding).
Wrote top-level CLAUDE.md: repo guide covering website/ (customer site), dashboard/ (admin), and docs/ (brief, todo, progress, style, profiles), plus the Next 16 caveat and env/Supabase/Resend notes.
==================

2026-06-27
Read the bundled Next 16 docs (layouts/pages, fonts, not-found) before coding, per website/AGENTS.md.
Built all basic desktop pages off docs/style.md: Home /, Services /services, Gallery /gallery, About /about, Contact /contact, branded not-found (404), Privacy /privacy, Terms /terms.
Added shared chrome (nav with click-to-call CTA + footer) to website/app/layout.tsx; wired Saira + Saira Condensed via next/font (CSS vars --font-body / --font-display).
Wrote full desktop-only stylesheet in website/app/globals.css (tokens, signature skew/clip/hover effects, plus new gallery/about/contact/legal/404 component classes). No mobile breakpoints by request.
Centralized copy in website/app/data.ts: contact info, 3 fabricated package tiers, the 18 services, team bios, and 12 verified before/after gallery pairs.
About team cards use CSS initials avatars (headshot lives on D:\, not in public/). Contact form is visual-only; Resend + Supabase wiring deferred to todo section 2.
Verified `npm run build` passes: all 8 routes prerendered static.
==================

2026-06-27
Rewrote the dashboard auth task in docs/todo.md (section 7) into a thorough guide: HTTP Basic Auth via Next middleware, same approach as wow_fishbot/dashboard but with both user and password as env vars (DASHBOARD_USER / DASHBOARD_PASSWORD, defaulting to username / password). Guide includes env setup, full middleware.ts, the 401 + WWW-Authenticate flow, and gotchas (Edge btoa, HTTPS-only, no logout, don't pre-build multi-user).
==================

2026-06-27
Researched the 4 pxb-development reference sites (diaz / georgia / cruz / true-phase) via gh; found they are byte-identical App Router clones sharing one pattern: 4 POST routes (add_to_supabase_table, analytics [edge], send_email [Resend REST via fetch], incrementPhoneClickCount) plus lib helpers (constants/SITE_NAME, geolocation from x-vercel-ip-* headers, spamFilter, supabase client). No SQL/migrations in-repo; they use the anon key + RLS insert policies.
Added docs/todo.md section 3 (API routes for website): /api/forms, /api/analytics, /api/send-email, /api/phone-click, plus shared lib + client wiring (visitor/session IDs, pageview hook, tel: click tracking), each cross-referenced to its reference route.
Added docs/todo.md section 4 (Database): 3 RYNO_-prefixed tables (RYNO_FORMS, RYNO_ANALYTICS, RYNO_PHONE_CLICKS) with full column lists, optional RYNO_EMAIL_LOG, plus tasks for a checked-in supabase/schema.sql, RLS, and indexes. Renumbered later sections (Human QA->5, Mobile->6, Puppeteer->7, Service-by-area->8, Dashboard->9).
Two deliberate deviations from the reference flagged in the todo for confirmation: use the service-role key + RLS fully locked (routes are server-side) instead of anon key + permissive insert policy; and send the notification email server-side inside /api/forms (one client call) instead of separate client calls.
==================

2026-06-27
Added a top-level tests/ folder and docs/todo.md section 10 (Tests). Added tests/ to CLAUDE.md.
Wrote tests/test_resend.py: stdlib-only (urllib) Resend check that sends one email; reads tests/.env (RESEND_API_KEY, RESEND_TEST_TO, RESEND_TEST_FROM). Added tests/.env (gitignored) and tests/.env.example.
First run hit Cloudflare error 1010 (it blocks the default Python-urllib User-Agent); fixed by setting a custom User-Agent header.
Re-ran: PASS, HTTP 200, real email sent noreply@rynodetailing.com -> matmigg0804@gmail.com (Resend id 8f38ff0d-e15e-47b9-90e1-7ec8d0975463). Confirms the key works and rynodetailing.com is a verified Resend sending domain.
==================

2026-06-27
Wrote supabase/schema.sql: the 3 RYNO_ tables (RYNO_FORMS, RYNO_ANALYTICS, RYNO_PHONE_CLICKS) as quoted uppercase identifiers, pgcrypto for gen_random_uuid(), RLS enabled on all with NO policies (fully locked), plus the 4 dashboard indexes. Idempotent (create-if-not-exists / enable RLS).
Applied it to project rxwdtssnaymiebnhudix via the Supabase Management API (POST /v1/projects/{ref}/database/query) using the sbp_ access token from docs/prompt.txt. tests/apply_schema.py reads the SQL + token from tests/.env and posts it; returned HTTP 201.
Wrote tests/test_supabase_rls.py: for each RYNO_ table, inserts a tagged row via PostgREST with the service-role key (must succeed) and the anon key (must be blocked by RLS), then service-role-deletes its test rows. Verifies the locked-down policy design end to end.
Added tests/_env.py (shared stdlib .env reader) so the new scripts don't duplicate the loader.
Added SUPABASE_ACCESS_TOKEN, SUPABASE_PROJECT_REF, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY to tests/.env (gitignored) and placeholder versions to tests/.env.example.
Ran both: schema apply PASS (201); RLS test PASS for all 3 tables (service-role 201, anon 401, cleanup 204). Confirms tables exist, connections work, and RLS correctly locks anon out while service-role writes through.
==================

2026-06-27
Built the /api/send-email route (website/app/api/send-email/route.ts, nodejs runtime): POST, validates JSON + required subject/html (400), calls the helper, returns { success, id } or 500.
Extracted the Resend logic to website/lib/email.ts (sendEmail): Resend REST via fetch (no SDK), reads RESEND_API_KEY + CONTACT_FORM_FROM, recipients default to CONTACT_FORM_TO (comma-split, drops example.com placeholders). Split out so /api/forms can reuse it server-side later.
Wired the contact form to it: converted the contact form into a client component (website/app/contact/ContactForm.tsx) that builds a subject + HTML-escaped body from the fields and POSTs /api/send-email, with sending/success/error UI states; contact/page.tsx now renders <ContactForm/>. Added .formmsg styles to globals.css.
Verified `npm run build` passes (send-email is the only dynamic route; all pages still static).
==================

2026-06-27
Wrote tests/test_contact_form.py: a Playwright (Python) E2E that visits the live rynodetailing.com/contact, fills + submits the form, and asserts POST /api/send-email returns 200, the success message appears, and there are no uncaught page errors or console errors (favicon/font noise filtered). Embeds a unique ryno-e2e-<timestamp> marker in the message body for manual email-receipt confirmation; reuses tests/_env.py.
Added optional CONTACT_URL / CONTACT_TEST_EMAIL to tests/.env.example (defaults baked into the script).
Not run yet by request: it needs the wired form deployed to production first. Run with `python -m playwright install chromium` then `python tests/test_contact_form.py`.
==================

2026-06-27
Added @supabase/supabase-js to website/ and dashboard/ (per request to use real deps, not the raw-fetch shim). Both apps now use a server-only supabaseAdmin client built with the SERVICE ROLE key (RLS bypass; tables are locked to anon).
Built the website API routes: /api/forms (nodejs — validate required fields -> 400, spam filter -> 400, Vercel geo, insert RYNO_FORMS, then send notification email server-side with sendEmail [failure non-fatal], 200 {success,data}); /api/analytics (edge — require path, insert RYNO_ANALYTICS, GET -> 405); /api/phone-click (nodejs — insert RYNO_PHONE_CLICKS).
Added shared lib: website/lib/constants.ts (SITE_NAME), website/lib/supabase.ts (supabaseAdmin), website/lib/analytics/geolocation.ts (getLocationFromHeaders from x-vercel-ip-* headers), website/lib/spamFilter.ts (checkForSpam/isGibberish + blocked-keyword list).
Rewired the contact form: ContactForm now POSTs /api/forms (saves + emails server-side) instead of /api/send-email directly; made phone + email required so the route's validation passes.
Added client analytics: app/AnalyticsTracker.tsx (mounted in layout) generates visitor_id (localStorage) + session_id (sessionStorage) via crypto.randomUUID, POSTs /api/analytics on every route change, and logs tel: clicks to /api/phone-click via a document-level listener (keepalive).
Dashboard RPCs: wrote supabase/rpc.sql — two SECURITY DEFINER functions ryno_dashboard_stats(days) (totals + pageviews-by-day + top pages as JSON) and ryno_forms_recent(p_limit) (setof RYNO_FORMS). EXECUTE revoked from public + anon + authenticated, granted only to service_role; notify pgrst to reload. dashboard/lib/supabase.ts exposes typed getDashboardStats / getRecentForms wrappers.
Generalized tests/apply_schema.py to take a SQL-file arg (defaults to supabase/schema.sql); applied supabase/rpc.sql with it.
First dashboard RPC test run FAILED: anon could still call the RPCs (200). Cause: Supabase default privileges grant EXECUTE on new public functions to anon + authenticated, so revoking from PUBLIC alone wasn't enough. Fixed rpc.sql to also revoke from anon + authenticated explicitly, reapplied.
Wrote tests/test_dashboard_rpc.py: calls both RPCs with the service-role key (expect 200 + shape check) and the anon key (expect blocked). Re-ran: PASS — service-role 200 for both, anon 401 for both. Policies confirmed solid.
==================

2026-06-27
Built the dashboard auth gate. Next 16 deprecated middleware.ts -> proxy.ts, so the file is dashboard/proxy.ts (project root, exported fn named `proxy`, Edge runtime so btoa not Buffer). HTTP Basic Auth over a matcher gating everything except _next static assets + favicon; reads DASHBOARD_USER/DASHBOARD_PASSWORD, returns 401 + WWW-Authenticate on mismatch, 500 if those env vars are unset.
Added DASHBOARD_USER=username / DASHBOARD_PASSWORD=password to dashboard/.env.local and .env.example.
Replaced the blank dashboard page with a minimal placeholder heading so there's something visible behind the auth wall (real pages are todo section 9).
Verified `npm run build` passes; build output lists "Proxy (Middleware)". Ticked the dashboard auth item in todo section 9 (flagged that the auth guide text below it still says middleware).
==================
2026-06-27
Built the sub-service pages (todo section 8, layer 2). Consolidated the 18 brief services into 7 pages: interior-detailing, leather-care, exterior-wash, wax-and-shine, wheels-and-tires, stain-and-odor-removal, window-cleaning (user-approved list).
Added `subServices` to website/app/data.ts (slug, lead/accent for the h1, intro, body, includes[], before/after pairs). Kept it in app/data.ts because this project has no src/ dir; the todo's planned `src/data/service-data.ts` path does not apply here.
Built one dynamic route `website/app/services/[service]/page.tsx` rendering all 7 via generateStaticParams + per-page generateMetadata. Each page ends with a CTA section linking to /contact (required). Reuses existing CSS classes (pagehead, slist/sitem, gallery/ba, ctaimg). Named the segment `[service]` (not `[slug]`) to nest cleanly under the planned layer-3 `/services/[service]/[area]`.
Photos: all 60 assets in public/images are interior shots, so only interior-detailing, leather-care, and stain-and-odor-removal got real before/after galleries. Exterior-wash, wax-and-shine, wheels-and-tires, and window-cleaning are copy-only (no gallery) until exterior/wheel/glass photos exist. NEED: exterior, wheels/tires, wax/gloss, and glass photography.
Wired layer 1: /services now shows a linked card grid of the 7 sub-services (uses .scards/.scard) above the raw 18-item menu, so the pages aren't orphans and the SEO link mesh starts top-down.
Verified `npm run build` passes; all 7 paths prerender as static HTML (● SSG) under /services/[service].
Todo: ticked section-8 service-data + layer-2 route (with notes on the divergences above); added two new items per request: a "Finished navbar" item (section 1) and a `/puppeteer-style-audit` of the 7 sub-service pages (section 7). The "sub-service-by-area data file" the user asked to add already exists in section 8 as `area-data.ts`, so no duplicate was added.
==================

2026-06-27
Loaded the Vercel env vars for both projects from their .env.local files (production + development). Preview vars failed (CLI v52 "all preview branches" hint loop); set those via the dashboard later. The live /api/forms + /api/analytics were 500ing ("Failed to save submission") because the existing prod deployment predated the env vars; redeployed ryno-website via `vercel redeploy <prod-url> --scope matthewmiglios-projects` (CLI default scope is a different team; project Root Directory=website so `vercel --prod` from website/ doubles the path). After redeploy, both routes work. Saved the deploy quirks to project memory.
Wrote tests/test_contact_form.py (Playwright): visits the live /contact, fills + submits, asserts /api/forms 200 + success message + no page/console errors, embeds a marker for manual email-receipt check. Re-pointed it from /api/send-email to /api/forms after the form was rewired. PASSED against prod.
Wrote tests/test_analytics.py (Playwright): visits /, /services, /gallery, /about under a unique synthetic user-agent (the analytics route tags rows by request UA), asserts each /api/analytics POST 200, pulls the 50 most recent RYNO_ANALYTICS rows via PostgREST (service role), confirms all 4 visited paths appear among the synthetic rows, then deletes them. PASSED (4/4 recorded + cleaned up). Added optional SITE_URL / CONTACT_URL / CONTACT_TEST_EMAIL to tests/.env.example.
==================
2026-06-27
Made the website responsive. Added tablet (<=1024px) and mobile (<=640px) breakpoints to website/app/globals.css (was desktop-only with min-width:1280px). Removed the body min-width; nav stacks (logo over a wrapped, centered link row), hero/about/contact grids collapse to one column, service cards and the service list go 2-col on tablet and 1-col on mobile, the gallery + team grids collapse, and type/padding/clip-frame heights scale down. Then ran /puppeteer-style-audit on all 7 basic pages (/, /services, /gallery, /about, /contact, /privacy, /terms) at 375 and 768. Only real defect: at 768 the horizontal nav didn't fit (logo overlapped the links, Call CTA wrapped and clipped off the right edge); fixed by stacking the nav from the 1024 breakpoint, not just 640. After the fix every page had no horizontal overflow (scrollWidth==clientWidth), no broken/distorted images, and labeled inputs. Note: Turbopack's file watcher did not pick up CSS edits on this box; had to rm -rf .next + restart `npm run dev` for changes to show.
==================
