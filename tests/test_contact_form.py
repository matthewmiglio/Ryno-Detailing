#!/usr/bin/env python
"""Playwright E2E: submit the LIVE contact form and assert nothing errored.

Visits the production contact page, fills and submits the form, and verifies:
  - the POST /api/send-email call returns HTTP 200
  - the on-page success message appears
  - no uncaught page errors (JS exceptions) occurred
  - no console errors were logged

A unique marker is embedded in the message body so a destination-email owner
can confirm the email actually arrived. Email RECEIPT is validated manually
(you are one of CONTACT_FORM_TO, so you should get it).

Requires the live site to be deployed with the wired form. Run:
    pip install playwright && python -m playwright install chromium
    python tests/test_contact_form.py

Optional overrides in tests/.env:
    CONTACT_URL=https://rynodetailing.com/contact
    CONTACT_TEST_EMAIL=matmigg0804@gmail.com
"""
import sys
from datetime import datetime, timezone

from _env import load_env
from playwright.sync_api import sync_playwright

env = load_env()
URL = env.get("CONTACT_URL", "https://rynodetailing.com/contact")
TEST_EMAIL = env.get("CONTACT_TEST_EMAIL", "matmigg0804@gmail.com")

# Benign console noise we don't want to fail on (third-party / asset chatter).
IGNORE_CONSOLE = ("favicon", "fonts.googleapis", "fonts.gstatic")


def main():
    marker = "ryno-e2e-" + datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    console_errors = []
    page_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.on(
            "console",
            lambda m: console_errors.append(m.text)
            if m.type == "error" and not any(s in m.text for s in IGNORE_CONSOLE)
            else None,
        )
        page.on("pageerror", lambda e: page_errors.append(str(e)))

        print(f"Visiting {URL}")
        page.goto(URL, wait_until="networkidle")

        page.fill("#name", "E2E Test (Ryno)")
        page.fill("#phone", "989 884 7661")
        page.fill("#email", TEST_EMAIL)
        page.fill(
            "#message",
            f"Automated contact-form test. Marker: {marker}. Safe to ignore.",
        )

        # Submit and capture the API response in one shot.
        with page.expect_response("**/api/send-email", timeout=20000) as resp_info:
            page.click("button[type=submit]")
        resp = resp_info.value
        status = resp.status
        print(f"POST /api/send-email -> {status}")

        # Confirm the UI reported success.
        try:
            page.wait_for_selector("text=Thanks. We got your message", timeout=10000)
            success_shown = True
        except Exception:
            success_shown = False

        browser.close()

    # ---- verdict ----
    problems = []
    if status != 200:
        problems.append(f"send-email returned HTTP {status}, expected 200")
    if not success_shown:
        problems.append("success message did not appear on the page")
    if page_errors:
        problems.append(f"{len(page_errors)} uncaught page error(s): {page_errors}")
    if console_errors:
        problems.append(f"{len(console_errors)} console error(s): {console_errors}")

    if problems:
        print("\nFAIL:")
        for p_ in problems:
            print(f"  - {p_}")
        sys.exit(1)

    print(f"\nPASS: form submitted cleanly, no errors. Check inbox for marker {marker}")


if __name__ == "__main__":
    main()
