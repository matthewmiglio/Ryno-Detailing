#!/usr/bin/env python3
"""Verify Supabase connectivity + RLS policies on every RYNO_ table.

The policy design (docs/todo.md §4): RLS is ENABLED on every table with NO
public policies. So:
  - the SERVICE ROLE key (bypasses RLS) must be able to INSERT  -> expect success
  - the ANON key (no policy grants it anything) must be BLOCKED -> expect denial

This test inserts a tagged row into each table with each key and asserts that
matrix. Service-role rows are deleted again at the end so the tables stay clean.

Reads tests/.env for:
  NEXT_PUBLIC_SUPABASE_URL       - project URL (required)
  SUPABASE_SERVICE_ROLE_KEY      - service role key (required)
  NEXT_PUBLIC_SUPABASE_ANON_KEY  - anon key (required)

Run: python tests/test_supabase_rls.py
"""
import json
import sys
import urllib.error
import urllib.request

from _env import load_env

TEST_TAG = "ryno-detailing-test"

# One representative row per table (only columns that matter for the write).
ROWS = {
    "RYNO_FORMS": {
        "full_name": "Test Runner",
        "email": "test@example.com",
        "phone": "989 884 7661",
        "message": "RLS test row",
        "site_name": TEST_TAG,
    },
    "RYNO_ANALYTICS": {
        "path": "/rls-test",
        "site_name": TEST_TAG,
    },
    "RYNO_PHONE_CLICKS": {
        "site_name": TEST_TAG,
    },
}


def _request(method, url, key, body=None, prefer=None):
    """Make a PostgREST request. Returns (status, text). status=0 on net error."""
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
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")
    except urllib.error.URLError as e:
        return 0, str(e.reason)


def insert(base, table, key, row):
    url = f"{base}/rest/v1/{table}"
    return _request("POST", url, key, body=row, prefer="return=representation")


def delete_test_rows(base, table, service_key):
    """Service role cleanup of rows tagged by this test."""
    url = f"{base}/rest/v1/{table}?site_name=eq.{TEST_TAG}"
    return _request("DELETE", url, service_key)


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

    failures = []
    for table, row in ROWS.items():
        print(f"\n[{table}]")

        # Service role: must succeed (201 Created).
        st, body = insert(base, table, service_key, row)
        ok = st in (200, 201)
        print(f"  service-role insert -> HTTP {st} {'PASS' if ok else 'FAIL'}")
        if not ok:
            failures.append(f"{table}: service-role insert expected 2xx, got {st}: {body[:200]}")

        # Anon: must be blocked by RLS (any non-2xx; typically 401/403).
        st, body = insert(base, table, anon_key, row)
        blocked = st not in (200, 201)
        print(f"  anon insert (want blocked) -> HTTP {st} {'PASS' if blocked else 'FAIL'}")
        if not blocked:
            failures.append(f"{table}: anon insert should be blocked by RLS, but got {st}")

        # Cleanup any rows this run inserted.
        st, _ = delete_test_rows(base, table, service_key)
        print(f"  cleanup delete -> HTTP {st}")

    print("\n" + ("=" * 40))
    if failures:
        print("FAIL:")
        for f in failures:
            print("  - " + f)
        return 1
    print("PASS: all RYNO_ tables reachable; service-role writes, anon blocked by RLS.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
