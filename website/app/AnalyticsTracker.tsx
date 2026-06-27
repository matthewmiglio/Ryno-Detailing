"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// crypto.randomUUID is available in all modern browsers we target.
function getId(store: Storage, key: string) {
  let id = store.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    store.setItem(key, id);
  }
  return id;
}

function ids() {
  return {
    visitor_id: getId(localStorage, "ryno_vid"), // persists across visits
    session_id: getId(sessionStorage, "ryno_sid"), // resets per tab/session
  };
}

// Mounted once in the root layout. Records a pageview on every route change and
// logs click-to-call events. Failures are swallowed — tracking must never break
// the page. ponytail: a document-level click listener covers every tel: link
// site-wide, no per-link wiring.
export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer: document.referrer, ...ids() }),
    }).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement)?.closest?.('a[href^="tel:"]');
      if (!link) return;
      fetch("/api/phone-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ids()),
        keepalive: true, // survive the navigation the tel: link triggers
      }).catch(() => {});
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
