#!/usr/bin/env python3
"""Apply a SQL file to the project via the Supabase Management API.

Reads tests/.env for:
  SUPABASE_ACCESS_TOKEN - personal access token (sbp_...), required
  SUPABASE_PROJECT_REF  - project ref (default rxwdtssnaymiebnhudix)

Usage:
  python tests/apply_schema.py                  # defaults to supabase/schema.sql
  python tests/apply_schema.py supabase/rpc.sql # any SQL file (path relative to repo root or cwd)

All the SQL we apply is idempotent (create-if-not-exists / create-or-replace),
so re-running is safe.
"""
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _env import load_env


def run_sql(token, ref, sql):
    """POST a SQL string to the Management API query endpoint. Returns (ok, msg)."""
    req = urllib.request.Request(
        f"https://api.supabase.com/v1/projects/{ref}/database/query",
        data=json.dumps({"query": sql}).encode(),
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "ryno-detailing-tests/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return True, f"HTTP {r.status}"
    except urllib.error.HTTPError as e:
        return False, f"HTTP {e.code}: {e.read().decode('utf-8', 'replace')[:400]}"
    except urllib.error.URLError as e:
        return False, f"network error: {e.reason}"


def main():
    env = load_env()
    token = env.get("SUPABASE_ACCESS_TOKEN")
    ref = env.get("SUPABASE_PROJECT_REF", "rxwdtssnaymiebnhudix")
    if not token:
        print("FAIL: SUPABASE_ACCESS_TOKEN not found in tests/.env")
        return 1
    repo_root = Path(__file__).resolve().parents[1]
    rel = sys.argv[1] if len(sys.argv) > 1 else "supabase/schema.sql"
    sql_path = Path(rel)
    if not sql_path.is_absolute():
        sql_path = (repo_root / rel) if (repo_root / rel).exists() else Path.cwd() / rel
    sql = sql_path.read_text()
    print(f"Applying {rel} to project {ref} ...")
    ok, msg = run_sql(token, ref, sql)
    print(("PASS: schema applied (" if ok else "FAIL: ") + msg + (")" if ok else ""))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
