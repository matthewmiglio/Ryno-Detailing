#!/usr/bin/env python
"""E2E: visit a few live pages under a synthetic user-agent, then confirm the
pageviews landed in RYNO_ANALYTICS and clean them up.

Flow:
  1. Launch a browser with a unique synthetic user-agent (the analytics route
     stores `ua` from the request header, so the UA is our row tag).
  2. Visit a few pages; each route change fires POST /api/analytics. Assert 200.
  3. Pull the 50 most recent RYNO_ANALYTICS rows via PostgREST (service role).
  4. Assert every visited path shows up among our synthetic rows.
  5. Delete the synthetic rows (ua = our marker) so the table stays clean.

Reads tests/.env:
  NEXT_PUBLIC_SUPABASE_URL    - project URL (required)
  SUPABASE_SERVICE_ROLE_KEY   - service role key (required)
  SITE_URL                    - base site URL (optional, default below)

Run: python -m playwright install chromium  (once)
     python tests/test_analytics.py
"""
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone

from _env import load_env
from playwright.sync_api import sync_playwright

env = load_env()
BASE = env.get("SITE_URL", "https://rynodetailing.com").rstrip("/")
SUPABASE = (env.get("NEXT_PUBLIC_SUPABASE_URL") or "").rstrip("/")
SERVICE_KEY = env.get("SUPABASE_SERVICE_ROLE_KEY")

PATHS = ["/", "/services", "/gallery", "/about"]


def _rest(method, url, prefer=None):
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "ryno-detailing-tests/1.0",
    }
    if prefer:
        headers["Prefer"] = prefer
    req = urllib.request.Request(url, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")
    except urllib.error.URLError as e:
        return 0, str(e.reason)


def main():
    if not SUPABASE or not SERVICE_KEY:
        print("FAIL: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in tests/.env")
        return 1

    marker = "RynoAnalyticsE2E-" + datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    problems = []

    # 1-2. Visit pages under the synthetic UA, asserting each pageview POSTs 200.
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(user_agent=marker)
        page = context.new_page()
        for path in PATHS:
            with page.expect_response("**/api/analytics", timeout=20000) as ri:
                page.goto(BASE + path, wait_until="load")
            status = ri.value.status
            print(f"visit {path:12s} -> /api/analytics {status}")
            if status != 200:
                problems.append(f"{path}: /api/analytics returned {status}")
        browser.close()

    # 3. Pull the 50 most recent rows.
    q = f"{SUPABASE}/rest/v1/RYNO_ANALYTICS?select=path,ua,created_at&order=created_at.desc&limit=50"
    st, body = _rest("GET", q)
    if st != 200:
        print(f"FAIL: fetch recent rows -> HTTP {st}: {body[:200]}")
        return 1
    rows = json.loads(body)
    ours = [r for r in rows if r.get("ua") == marker]
    found_paths = {r.get("path") for r in ours}
    print(f"\nrecent rows: {len(rows)} | ours (ua={marker}): {len(ours)} | paths={sorted(found_paths)}")

    # 4. Every visited path must be present in our synthetic rows.
    for path in PATHS:
        if path not in found_paths:
            problems.append(f"visited {path} but no matching analytics row found")

    # 5. Cleanup: delete our synthetic rows regardless of pass/fail.
    enc = urllib.parse.quote(marker, safe="")
    st, body = _rest("DELETE", f"{SUPABASE}/rest/v1/RYNO_ANALYTICS?ua=eq.{enc}",
                     prefer="return=representation")
    deleted = len(json.loads(body)) if st in (200, 201) else "?"
    print(f"cleanup delete -> HTTP {st}, removed {deleted} synthetic row(s)")
    if st not in (200, 201, 204):
        problems.append(f"cleanup delete returned HTTP {st}")

    print("\n" + "=" * 40)
    if problems:
        print("FAIL:")
        for pb in problems:
            print("  - " + pb)
        return 1
    print(f"PASS: all {len(PATHS)} pageviews recorded in RYNO_ANALYTICS and cleaned up.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
