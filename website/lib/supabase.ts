// Server-only Supabase client. Uses the SERVICE ROLE key, which bypasses RLS —
// the RYNO_ tables are fully locked to anon (see supabase/schema.sql), so all
// writes must go through here on the server. Never import from a client component.
import { createClient } from "@supabase/supabase-js";

// Fallbacks keep the module importable at build time if env is missing; real
// requests only succeed when the env vars are present at runtime.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
  { auth: { persistSession: false, autoRefreshToken: false } }
);
