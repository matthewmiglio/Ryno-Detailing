-- Ryno Detailing — Supabase schema
--
-- All tables are prefixed RYNO_ (quoted, so the name stays uppercase).
-- RLS is enabled on every table with NO public policies: all writes go through
-- server-side API routes using the SERVICE ROLE key (which bypasses RLS). The
-- anon key is therefore fully locked out of every table. See docs/todo.md §4.
--
-- Idempotent: safe to re-run. Apply with the Management API (see
-- tests/apply_schema.py) or: psql "$DATABASE_URL" -f supabase/schema.sql

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists "RYNO_FORMS" (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  full_name   text,
  email       text,
  phone       text,
  message     text,
  site_name   text,
  visitor_id  text,
  session_id  text,
  ip_hash     text,
  ua          text,
  referrer    text,
  city        text,
  state       text,
  country     text
);

create table if not exists "RYNO_ANALYTICS" (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  path        text not null,
  referrer    text,
  visitor_id  text,
  session_id  text,
  ua          text,
  city        text,
  state       text,
  country     text,
  site_name   text
);

create table if not exists "RYNO_PHONE_CLICKS" (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  site_name   text,
  visitor_id  text,
  session_id  text,
  ip_hash     text,
  ua          text,
  referrer    text,
  city        text,
  state       text,
  country     text
);

-- ---------------------------------------------------------------------------
-- Row Level Security: enable everywhere, grant nothing.
-- No policy = anon/authenticated are denied all access. service_role bypasses
-- RLS, so the server-side API routes still read/write freely.
-- ---------------------------------------------------------------------------

alter table "RYNO_FORMS"        enable row level security;
alter table "RYNO_ANALYTICS"    enable row level security;
alter table "RYNO_PHONE_CLICKS" enable row level security;

-- ---------------------------------------------------------------------------
-- Indexes for dashboard queries
-- ---------------------------------------------------------------------------

create index if not exists ryno_forms_created_at_idx        on "RYNO_FORMS"        (created_at);
create index if not exists ryno_analytics_created_at_idx     on "RYNO_ANALYTICS"    (created_at);
create index if not exists ryno_analytics_path_idx           on "RYNO_ANALYTICS"    (path);
create index if not exists ryno_phone_clicks_created_at_idx  on "RYNO_PHONE_CLICKS" (created_at);
