import { getDashboardStats, getRecentForms } from "@/lib/supabase";

// Service-role RPCs need the real env + live DB, so render per-request, never at build.
export const dynamic = "force-dynamic";

const ORANGE = "#ff7314";
// Square, brand-black panels. No rounded corners anywhere (per design).
const PANEL = "border border-neutral-700 bg-neutral-900 p-5";
const HEADING = "mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-300";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className={PANEL}>
      <div className="text-3xl font-bold tabular-nums" style={{ color: ORANGE }}>
        {value.toLocaleString()}
      </div>
      <div className="mt-1 text-sm text-neutral-300">{label}</div>
    </div>
  );
}

// Inline SVG bar chart — ponytail: a few lines beats pulling in a charting lib.
function DailyBars({ data }: { data: { day: string; views: number }[] }) {
  if (!data.length) return <p className="text-neutral-400">No pageviews in this window.</p>;
  const max = Math.max(...data.map((d) => d.views), 1);
  const H = 160, gap = 4, maxBar = 40;
  // Cap bar width so a single day reads as a bar, not a full-width block.
  const bw = Math.min(maxBar, 720 / data.length - gap);
  const W = data.length * (bw + gap);
  return (
    <svg viewBox={`0 0 ${Math.max(W, 1)} ${H}`} preserveAspectRatio="xMinYMid meet"
         className="w-full" height={H} role="img" aria-label="Pageviews per day">
      {data.map((d, i) => {
        const h = (d.views / max) * (H - 20);
        return (
          <rect key={d.day} x={i * (bw + gap)} y={H - h} width={bw} height={h} fill={ORANGE}>
            <title>{`${d.day}: ${d.views}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}

function TopPages({ data }: { data: { path: string; views: number }[] }) {
  if (!data.length) return <p className="text-neutral-400">No data yet.</p>;
  const max = Math.max(...data.map((d) => d.views), 1);
  return (
    <ul className="space-y-2">
      {data.map((d) => (
        <li key={d.path} className="flex items-center gap-3 text-sm">
          <span className="w-48 shrink-0 truncate text-neutral-200">{d.path}</span>
          <span className="relative h-5 flex-1 bg-neutral-800">
            <span
              className="absolute inset-y-0 left-0"
              style={{ width: `${(d.views / max) * 100}%`, background: ORANGE }}
            />
          </span>
          <span className="w-10 shrink-0 text-right tabular-nums text-neutral-300">{d.views}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function Page() {
  let stats, forms, error: string | null = null;
  try {
    [stats, forms] = await Promise.all([getDashboardStats(30), getRecentForms(50)]);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 text-neutral-100">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-50">
          Ryno Detailing <span style={{ color: ORANGE }}>Dashboard</span>
        </h1>
        <p className="text-sm text-neutral-400">Last 30 days</p>
      </header>

      {error && (
        <div className="border border-red-700 bg-red-950 p-4 text-sm text-red-200">
          Failed to load stats: {error}
        </div>
      )}

      {stats && forms && (
        <>
          <section className="mb-8 grid grid-cols-3 gap-4">
            <StatCard label="Form submissions" value={stats.total_forms} />
            <StatCard label="Pageviews" value={stats.total_pageviews} />
            <StatCard label="Phone-call clicks" value={stats.total_phone_clicks} />
          </section>

          <section className={`mb-8 ${PANEL}`}>
            <h2 className={HEADING}>Pageviews per day</h2>
            <DailyBars data={stats.pageviews_by_day} />
          </section>

          <section className={`mb-8 ${PANEL}`}>
            <h2 className={HEADING}>Top pages</h2>
            <TopPages data={stats.top_pages} />
          </section>

          <section className={PANEL}>
            <h2 className={HEADING}>Recent submissions ({forms.length})</h2>
            {forms.length === 0 ? (
              <p className="text-neutral-400">No submissions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-neutral-400">
                    <tr className="border-b border-neutral-700">
                      <th className="py-2 pr-4 font-medium">When</th>
                      <th className="py-2 pr-4 font-medium">Name</th>
                      <th className="py-2 pr-4 font-medium">Contact</th>
                      <th className="py-2 pr-4 font-medium">Location</th>
                      <th className="py-2 font-medium">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forms.map((f) => (
                      <tr key={f.id} className="border-b border-neutral-800 align-top">
                        <td className="py-2 pr-4 whitespace-nowrap text-neutral-400">
                          {new Date(f.created_at).toLocaleString()}
                        </td>
                        <td className="py-2 pr-4 text-neutral-100">{f.full_name ?? "-"}</td>
                        <td className="py-2 pr-4 text-neutral-200">
                          {[f.email, f.phone].filter(Boolean).join(" · ") || "-"}
                        </td>
                        <td className="py-2 pr-4 text-neutral-400">
                          {[f.city, f.state, f.country].filter(Boolean).join(", ") || "-"}
                        </td>
                        <td className="py-2 max-w-xs text-neutral-200">{f.message ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
