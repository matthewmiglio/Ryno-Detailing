#!/usr/bin/env python3
"""Verify the dashboard read RPCs: access policy + data round-trip.

The dashboard reads everything through two SECURITY DEFINER functions, EXECUTE
granted ONLY to service_role (supabase/rpc.sql): ryno_dashboard_stats(days) and
ryno_forms_recent(p_limit). This test has two phases.

Phase 1 — policy/shape:
  - SERVICE ROLE key calling each RPC -> 200 + sane shape
  - ANON key calling each RPC          -> blocked (no execute grant)

Phase 2 — data round-trip (service role):
  1. Snapshot stats (baseline totals).
  2. Inject tagged fake rows: N forms, M analytics pageviews on a unique path,
     K phone clicks (all tagged site_name = a unique run marker).
  3. Call both RPCs and assert the fake data shows up: each total grew by exactly
     what was injected, today's bucket is in pageviews_by_day, the unique path is
     in top_pages with the right count, and ryno_forms_recent returns our forms.
  4. Delete every tagged row (cleanup), pass or fail.

Reads tests/.env:
  NEXT_PUBLIC_SUPABASE_URL       - project URL (required)
  SUPABASE_SERVICE_ROLE_KEY      - service role key (required)
  NEXT_PUBLIC_SUPABASE_ANON_KEY  - anon key (required)

Run: python tests/test_dashboard_rpc.py
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

from _env import load_env

# rpc name -> args sent in the POST body (phase 1)
RPCS = {
    "ryno_dashboard_stats": {"days": 30},
    "ryno_forms_recent": {"p_limit": 10},
}

N_FORMS = 4
M_VIEWS = 50  # ponytail: 50 so the unique path lands in top_pages on a low-traffic
              # site. Bump if this ever runs against a site with >10 busier paths.
K_CLICKS = 3


def _request(method, url, key, body=None, prefer=None):
    """PostgREST request. Returns (status, parsed_or_text). status=0 on net error."""
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "User-Agent": "ryno-detailing-tests/1.0",
    }
    if prefer:
        headers["Prefer"] = prefer
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            raw = r.read().decode("utf-8", "replace")
            try:
                return r.status, json.loads(raw)
            except json.JSONDecodeError:
                return r.status, raw
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")
    except urllib.error.URLError as e:
        return 0, str(e.reason)


def call_rpc(base, name, key, args):
    return _request("POST", f"{base}/rest/v1/rpc/{name}", key, body=args)


# -- Phase 1: policy + shape ------------------------------------------------

def test_policy(base, service_key, anon_key):
    failures = []
    for name, args in RPCS.items():
        print(f"\n[{name}]")

        st, payload = call_rpc(base, name, service_key, args)
        ok = st == 200
        print(f"  service-role call -> HTTP {st} {'PASS' if ok else 'FAIL'}")
        if not ok:
            failures.append(f"{name}: service-role expected 200, got {st}: {str(payload)[:200]}")
        elif name == "ryno_dashboard_stats":
            keys = {"total_forms", "total_pageviews", "total_phone_clicks",
                    "pageviews_by_day", "top_pages"}
            if not (isinstance(payload, dict) and keys <= set(payload)):
                failures.append(f"{name}: missing expected keys, got {str(payload)[:200]}")
            else:
                print(f"    shape OK (forms={payload['total_forms']}, "
                      f"pageviews={payload['total_pageviews']}, "
                      f"phone_clicks={payload['total_phone_clicks']})")
        elif name == "ryno_forms_recent":
            if not isinstance(payload, list):
                failures.append(f"{name}: expected a list, got {type(payload).__name__}")
            else:
                print(f"    shape OK (returned {len(payload)} row(s))")

        st, _ = call_rpc(base, name, anon_key, args)
        blocked = st != 200
        print(f"  anon call (want blocked) -> HTTP {st} {'PASS' if blocked else 'FAIL'}")
        if not blocked:
            failures.append(f"{name}: anon should be denied execute, but got 200")
    return failures


# -- Phase 2: data round-trip -----------------------------------------------

def test_data_roundtrip(base, service_key):
    failures = []
    marker = "RynoRpcE2E-" + format(abs(hash((os.getpid(), base))) % 10**10, "010d")
    path = f"/__rpc_e2e__/{marker}"
    print(f"\n[data round-trip] marker = {marker}")

    def stats():
        st, data = call_rpc(base, "ryno_dashboard_stats", service_key, {"days": 30})
        assert st == 200, f"ryno_dashboard_stats -> HTTP {st}: {data}"
        return data

    def insert(table, rows):
        st, data = _request("POST", f"{base}/rest/v1/{table}", service_key,
                            body=rows, prefer="return=minimal")
        assert st in (200, 201, 204), f"insert {table} -> HTTP {st}: {data}"

    before = stats()
    print(f"  baseline: forms={before['total_forms']} views={before['total_pageviews']} "
          f"clicks={before['total_phone_clicks']}")

    insert("RYNO_FORMS", [
        {"full_name": f"RPC Test {i}", "email": f"rpc{i}@example.com",
         "phone": "989 884 7661", "message": f"rpc test row {i}", "site_name": marker}
        for i in range(N_FORMS)])
    insert("RYNO_ANALYTICS", [{"path": path, "site_name": marker} for _ in range(M_VIEWS)])
    insert("RYNO_PHONE_CLICKS", [{"site_name": marker} for _ in range(K_CLICKS)])
    print(f"  injected: {N_FORMS} forms, {M_VIEWS} views ({path}), {K_CLICKS} clicks")

    try:
        after = stats()

        def check_delta(field, want):
            got = after[field] - before[field]
            print(f"  {field}: +{got} (want +{want}) {'OK' if got == want else 'FAIL'}")
            if got != want:
                failures.append(f"{field} grew by {got}, expected {want}")

        check_delta("total_forms", N_FORMS)
        check_delta("total_pageviews", M_VIEWS)
        check_delta("total_phone_clicks", K_CLICKS)

        if not after["pageviews_by_day"]:
            failures.append("pageviews_by_day is empty after inserting views")
        else:
            print(f"  pageviews_by_day buckets: {len(after['pageviews_by_day'])} OK")

        top = {p["path"]: p["views"] for p in after["top_pages"]}
        if path not in top:
            failures.append(f"unique path {path} not in top_pages (got {list(top)[:5]}...)")
        elif top[path] != M_VIEWS:
            failures.append(f"top_pages[{path}] = {top[path]}, expected {M_VIEWS}")
        else:
            print(f"  top_pages has unique path = {top[path]} OK")

        st, recent = call_rpc(base, "ryno_forms_recent", service_key, {"p_limit": 200})
        ours = [r for r in recent if r.get("site_name") == marker] if isinstance(recent, list) else []
        if len(ours) != N_FORMS:
            failures.append(f"ryno_forms_recent returned {len(ours)} tagged forms, expected {N_FORMS}")
        else:
            print(f"  ryno_forms_recent returned all {N_FORMS} tagged forms OK")
    finally:
        for t in ("RYNO_FORMS", "RYNO_ANALYTICS", "RYNO_PHONE_CLICKS"):
            enc = urllib.parse.quote(marker, safe="")
            st, _ = _request("DELETE", f"{base}/rest/v1/{t}?site_name=eq.{enc}", service_key)
            print(f"  cleanup {t}: HTTP {st}")
    return failures


def main():
    env = load_env()
    base = env.get("NEXT_PUBLIC_SUPABASE_URL")
    service_key = env.get("SUPABASE_SERVICE_ROLE_KEY")
    anon_key = env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    missing = [n for n, v in [
        ("NEXT_PUBLIC_SUPABASE_URL", base),
        ("SUPABASE_SERVICE_ROLE_KEY", service_key),
        ("NEXT_PUBLIC_SUPABASE_ANON_KEY", anon_key),
    ] if not v]
    if missing:
        print("FAIL: missing in tests/.env: " + ", ".join(missing))
        return 1
    base = base.rstrip("/")

    failures = test_policy(base, service_key, anon_key)
    failures += test_data_roundtrip(base, service_key)

    print("\n" + ("=" * 40))
    if failures:
        print("FAIL:")
        for f in failures:
            print("  - " + f)
        return 1
    print("PASS: dashboard RPCs are service-role-only and return injected data correctly.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
