# Ryno Detailing — Repo Guide

Auto detailing business. Two Next.js apps plus a docs folder.

## Lay of the land

- `website/` — the main customer-facing website (informational, no online
  scheduling; goal is to drive contact via call/contact buttons).
- `dashboard/` — admin view for the website (reads analytics + contact form
  submissions out of Supabase).
- `tests/` — standalone integration checks (e.g. Resend key/email send). Python,
  stdlib-only, read their own gitignored `tests/.env` (see `tests/.env.example`).
- `docs/` — gameplans, progress, and guides:
  - `prompt.txt` — the project brief (business info, services, areas, stack). **Gitignored** (holds the Supabase key).
  - `todo.md` — the build plan, top-to-bottom in build order, with checkboxes.
  - `progress.md` — append-only work log. Add new dated entries at the bottom; never edit past ones.
  - `style.md` — the visual style guide (tokens, type, component CSS).
  - `profiles.md` — account emails/logins. **Gitignored.**

## Working here

- Both apps are **Next.js 16** (App Router). The version has breaking changes
  vs. older Next — read the relevant guide in
  `<app>/node_modules/next/dist/docs/` before writing app code. See each app's
  `AGENTS.md`.
- Secrets live in `website/.env.local` and `dashboard/.env.local` (gitignored).
  `.env.example` in each app lists the keys with placeholder values.
- Backend is Supabase (project `rxwd**********hudix`); contact email is Resend.
- After meaningful changes, append an entry to `docs/progress.md` and tick the
  matching `docs/todo.md` item.
