// Cheap, dependency-free spam heuristics for the contact form. Not bulletproof —
// just enough to drop the obvious bot junk before it hits the inbox + DB.

const BLOCKED_KEYWORDS = [
  "viagra", "cialis", "casino", "porn", "crypto", "bitcoin", "forex",
  "seo service", "seo services", "backlink", "guest post", "loan offer",
  "make money", "work from home", "click here", "buy now",
];

// Long unbroken strings / heavy character repetition read as keyboard-mash spam.
export function isGibberish(text: string) {
  const t = text.trim();
  if (!t) return false;
  if (/(.)\1{7,}/.test(t)) return true; // same char 8+ times in a row
  const longestWord = t.split(/\s+/).reduce((m, w) => Math.max(m, w.length), 0);
  return longestWord > 45;
}

export function checkForSpam(email: string, message: string): boolean {
  const blob = `${email} ${message}`.toLowerCase();
  if (BLOCKED_KEYWORDS.some((k) => blob.includes(k))) return true;
  const links = (message.match(/https?:\/\//gi) ?? []).length;
  if (links >= 3) return true;
  return isGibberish(message);
}
