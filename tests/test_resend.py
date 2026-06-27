#!/usr/bin/env python3
"""Send a test email through the Resend API to verify the key + sending domain.

Reads tests/.env for:
  RESEND_API_KEY   - the Resend API key (required)
  RESEND_TEST_TO   - recipient (default matmigg0804@gmail.com)
  RESEND_TEST_FROM - sender, must be on a verified Resend domain
                     (default noreply@rynodetailing.com)

Run: python tests/test_resend.py
PASS = Resend accepted the email (prints the message id).
FAIL = key or domain problem (prints Resend's error).
"""
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path


def load_env(path):
    """Tiny .env reader. ponytail: avoids a python-dotenv dependency."""
    env = {}
    if path.exists():
        for line in path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def send_test_email(key, sender, recipient):
    """POST one email to the Resend API. Returns (ok, message)."""
    payload = json.dumps({
        "from": f"Ryno Detailing <{sender}>",
        "to": [recipient],
        "subject": "Ryno Detailing - Resend test",
        "html": "<p>Resend API key + domain test. If you got this, sending works.</p>",
    }).encode()
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        method="POST",
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            # Cloudflare in front of Resend blocks the default urllib UA (err 1010).
            "User-Agent": "ryno-detailing-tests/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            body = json.loads(r.read().decode())
            return True, f"sent (HTTP {r.status}, id={body.get('id')})"
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:300]
        return False, f"rejected (HTTP {e.code}): {detail}"
    except urllib.error.URLError as e:
        return False, f"network error: {e.reason}"


def main():
    env = load_env(Path(__file__).parent / ".env")
    key = env.get("RESEND_API_KEY") or os.environ.get("RESEND_API_KEY")
    if not key:
        print("FAIL: RESEND_API_KEY not found in tests/.env or environment")
        return 1
    sender = env.get("RESEND_TEST_FROM", "noreply@rynodetailing.com")
    recipient = env.get("RESEND_TEST_TO", "matmigg0804@gmail.com")
    print(f"Sending test email {sender} -> {recipient} ...")
    ok, msg = send_test_email(key, sender, recipient)
    print(("PASS: " if ok else "FAIL: ") + msg)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
