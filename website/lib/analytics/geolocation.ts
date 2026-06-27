// Vercel injects the visitor's coarse geo on every edge request as headers.
// Free, no IP lookup needed. Absent in local dev — all fields come back null.
export function getLocationFromHeaders(req: Request) {
  const h = req.headers;
  const city = h.get("x-vercel-ip-city");
  return {
    city: city ? decodeURIComponent(city) : null,
    state: h.get("x-vercel-ip-country-region"),
    country: h.get("x-vercel-ip-country"),
  };
}
