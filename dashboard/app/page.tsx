import { getDashboardStats, getRecentForms } from "@/lib/supabase";

// Service-role RPCs need the real env + live DB, so render per-request, never at build.
export const dynamic = "force-dynamic";

const ORANGE = "#ff7314";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
      <div className="text-3xl font-bold tabular-nums" style={{ color: ORANGE }}>
        {value.toLocaleString()}
      </div>
      <div className="mt-1 text-sm text-neutral-400">{label}</div>
    </div>
  );
}

// Inline SVG bar chart — ponytail: a few lines beats pulling in a charting lib.
function DailyBars({ data }: { data: { day: string; views: number }[] }) {
  if (!data.length) return <p className="text-neutral-500">No pageviews in this window.</p>;
  const max = Math.max(...data.map((d) => d.views), 1);
  const W = 720, H = 160, gap = 3;
  const bw = (W - gap * (data.length - 1)) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Pageviews per day">
      {data.map((d, i) => {
        const h = (d.views / max) * (H - 20);
        return (
          <g key={d.day}>
            <rect x={i * (bw + gap)} y={H - h} width={bw} height={h} fill={ORANGE} rx={2}>
              <title>{`${d.day}: ${d.views}`}</title>
            </rect>
          </g>
        );
      })}
    </svg>
  );
}

function TopPages({ data }: { data: { path: string; views: number }[] }) {
  if (!data.length) return <p className="text-neutral-500">No data yet.</p>;
  const max = Math.max(...data.map((d) => d.views), 1);
  return (
    <ul className="space-y-2">
      {data.map((d) => (
        <li key={d.path} className="flex items-center gap-3 text-sm">
          <span className="w-48 shrink-0 truncate text-neutral-300">{d.path}</span>
          <span className="relative h-5 flex-1 rounded bg-neutral-800">
            <span
              className="absolute inset-y-0 left-0 rounded"
              style={{ width: `${(d.views / max) * 100}%`, background: ORANGE }}
            />
          </span>
          <span className="w-10 shrink-0 text-right tabular-nums text-neutral-400">{d.views}</span>
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
        <h1 className="text-2xl font-bold">
          Ryno Detailing <span style={{ color: ORANGE }}>Dashboard</span>
        </h1>
        <p className="text-sm text-neutral-400">Last 30 days</p>
      </header>

      {error && (
        <div className="rounded border border-red-800 bg-red-950 p-4 text-sm text-red-300">
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

          <section className="mb-8 rounded-lg border border-neutral-800 bg-neutral-900 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-400">
              Pageviews per day
            </h2>
            <DailyBars data={stats.pageviews_by_day} />
          </section>

          <section className="mb-8 rounded-lg border border-neutral-800 bg-neutral-900 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-400">
              Top pages
            </h2>
            <TopPages data={stats.top_pages} />
          </section>

          <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-400">
              Recent submissions ({forms.length})
            </h2>
            {forms.length === 0 ? (
              <p className="text-neutral-500">No submissions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-neutral-500">
                    <tr className="border-b border-neutral-800">
                      <th className="py-2 pr-4 font-medium">When</th>
                      <th className="py-2 pr-4 font-medium">Name</th>
                      <th className="py-2 pr-4 font-medium">Contact</th>
                      <th className="py-2 pr-4 font-medium">Location</th>
                      <th className="py-2 font-medium">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forms.map((f) => (
                      <tr key={f.id} className="border-b border-neutral-800/60 align-top">
                        <td className="py-2 pr-4 whitespace-nowrap text-neutral-400">
                          {new Date(f.created_at).toLocaleString()}
                        </td>
                        <td className="py-2 pr-4">{f.full_name ?? "-"}</td>
                        <td className="py-2 pr-4 text-neutral-300">
                          {[f.email, f.phone].filter(Boolean).join(" · ") || "-"}
                        </td>
                        <td className="py-2 pr-4 text-neutral-400">
                          {[f.city, f.state, f.country].filter(Boolean).join(", ") || "-"}
                        </td>
                        <td className="py-2 max-w-xs text-neutral-300">{f.message ?? "-"}</td>
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
