-- Ryno Detailing — dashboard read RPCs
--
-- The RYNO_ tables have RLS enabled with no policies (locked to anon). These
-- functions are SECURITY DEFINER so they read past RLS, and EXECUTE is granted
-- ONLY to service_role — the dashboard calls them server-side with the service
-- key. anon/authenticated are revoked, so the dashboard read path stays as
-- locked down as the tables themselves. See docs/todo.md §4 / §9.
--
-- Idempotent (create or replace). Apply: python tests/apply_schema.py supabase/rpc.sql

-- Aggregate stats for the analytics overview page.
create or replace function public.ryno_dashboard_stats(days int default 30)
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'total_forms',        (select count(*) from "RYNO_FORMS"),
    'total_pageviews',    (select count(*) from "RYNO_ANALYTICS"),
    'total_phone_clicks', (select count(*) from "RYNO_PHONE_CLICKS"),
    'pageviews_by_day', (
      select coalesce(json_agg(row_to_json(d) order by d.day), '[]'::json)
      from (
        select date_trunc('day', created_at)::date as day, count(*) as views
        from "RYNO_ANALYTICS"
        where created_at >= now() - make_interval(days => days)
        group by 1
      ) d
    ),
    'top_pages', (
      select coalesce(json_agg(row_to_json(p)), '[]'::json)
      from (
        select path, count(*) as views
        from "RYNO_ANALYTICS"
        where created_at >= now() - make_interval(days => days)
        group by path
        order by count(*) desc
        limit 10
      ) p
    )
  );
$$;

-- Recent contact submissions for the submissions page.
create or replace function public.ryno_forms_recent(p_limit int default 100)
returns setof "RYNO_FORMS"
language sql
security definer
set search_path = public
as $$
  select * from "RYNO_FORMS" order by created_at desc limit p_limit;
$$;

-- Lock execution to service_role only. Supabase's default privileges grant
-- EXECUTE on new public functions to anon + authenticated, so revoking from
-- PUBLIC isn't enough — revoke those roles explicitly too.
revoke all on function public.ryno_dashboard_stats(int) from public, anon, authenticated;
revoke all on function public.ryno_forms_recent(int)   from public, anon, authenticated;
grant execute on function public.ryno_dashboard_stats(int) to service_role;
grant execute on function public.ryno_forms_recent(int)   to service_role;

-- Tell PostgREST to pick up the new functions immediately.
notify pgrst, 'reload schema';
