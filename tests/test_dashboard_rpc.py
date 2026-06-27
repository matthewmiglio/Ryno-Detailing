#!/usr/bin/env python3
"""Verify the dashboard read RPCs work and are locked to service_role only.

Policy design (supabase/rpc.sql): the dashboard read functions are SECURITY
DEFINER with EXECUTE granted ONLY to service_role. So:
  - SERVICE ROLE key calling each RPC -> expect success + sane shape
  - ANON key calling each RPC          -> expect blocked (no execute grant)

Reads tests/.env for:
  NEXT_PUBLIC_SUPABASE_URL       - project URL (required)
  SUPABASE_SERVICE_ROLE_KEY      - service role key (required)
  NEXT_PUBLIC_SUPABASE_ANON_KEY  - anon key (required)

Run: python tests/test_dashboard_rpc.py
"""
import json
import sys
import urllib.error
import urllib.request

from _env import load_env

# rpc name -> args sent in the POST body
RPCS = {
    "ryno_dashboard_stats": {"days": 30},
    "ryno_forms_recent": {"p_limit": 10},
}


def call_rpc(base, name, key, args):
    """POST to PostgREST /rest/v1/rpc/<name>. Returns (status, parsed_or_text)."""
    url = f"{base}/rest/v1/rpc/{name}"
    req = urllib.request.Request(
        url,
        data=json.dumps(args).encode(),
        method="POST",
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "User-Agent": "ryno-detailing-tests/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            raw = r.read().decode("utf-8", "replace")
            try:
                return r.status, json.loads(raw)
            except json.JSONDecodeError:
                return r.status, raw
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")
    except urllib.error.URLError as e:
        return 0, str(e.reason)


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
    for name, args in RPCS.items():
        print(f"\n[{name}]")

        # Service role: must succeed.
        st, payload = call_rpc(base, name, service_key, args)
        ok = st == 200
        print(f"  service-role call -> HTTP {st} {'PASS' if ok else 'FAIL'}")
        if not ok:
            failures.append(f"{name}: service-role expected 200, got {st}: {str(payload)[:200]}")
        else:
            # Light shape check so we know the function actually returned data.
            if name == "ryno_dashboard_stats":
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

        # Anon: must be blocked (no execute grant -> 401/403/404, never 200).
        st, payload = call_rpc(base, name, anon_key, args)
        blocked = st != 200
        print(f"  anon call (want blocked) -> HTTP {st} {'PASS' if blocked else 'FAIL'}")
        if not blocked:
            failures.append(f"{name}: anon should be denied execute, but got 200")

    print("\n" + ("=" * 40))
    if failures:
        print("FAIL:")
        for f in failures:
            print("  - " + f)
        return 1
    print("PASS: dashboard RPCs work for service-role and are blocked for anon.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
