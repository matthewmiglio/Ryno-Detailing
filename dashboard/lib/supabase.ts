// Server-only Supabase access for the dashboard. Uses the SERVICE ROLE key, the
// only role allowed to call the RYNO_ read RPCs (see supabase/rpc.sql). Never
// import this from a client component — it exposes the service-role key.
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export type DashboardStats = {
  total_forms: number;
  total_pageviews: number;
  total_phone_clicks: number;
  pageviews_by_day: { day: string; views: number }[];
  top_pages: { path: string; views: number }[];
};

export type FormSubmission = {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
};

// Aggregate analytics for the overview page.
export async function getDashboardStats(days = 30): Promise<DashboardStats> {
  const { data, error } = await supabaseAdmin.rpc("ryno_dashboard_stats", { days });
  if (error) throw new Error(`ryno_dashboard_stats failed: ${error.message}`);
  return data as DashboardStats;
}

// Recent contact submissions for the submissions page.
export async function getRecentForms(limit = 100): Promise<FormSubmission[]> {
  const { data, error } = await supabaseAdmin.rpc("ryno_forms_recent", { p_limit: limit });
  if (error) throw new Error(`ryno_forms_recent failed: ${error.message}`);
  return (data ?? []) as FormSubmission[];
}
