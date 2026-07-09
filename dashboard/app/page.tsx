import Link from "next/link";
import { getDashboardStats, getRecentForms, type DashboardStats, type FormSubmission } from "@/lib/supabase";

// Service-role RPCs need the real env + live DB, so render per-request, never at build.
export const dynamic = "force-dynamic";

const ORANGE = "#ff7314";
// Square, brand-black panels. No rounded corners anywhere (per design).
const PANEL = "border border-neutral-700 bg-neutral-900 p-5";
const HEADING = "mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-300";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "traffic", label: "Traffic" },
  { id: "contacts", label: "Contacts" },
] as const;
type TabId = (typeof TABS)[number]["id"];

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
// Generic over one measure so pageviews / phone clicks / forms all reuse it.
function Bars({ data, empty }: { data: { day: string; value: number }[]; empty: string }) {
  if (!data.length) return <p className="text-neutral-400">{empty}</p>;
  const max = Math.max(...data.map((d) => d.value), 1);
  const H = 160, gap = 4, maxBar = 40;
  // Cap bar width so a single day reads as a bar, not a full-width block.
  const bw = Math.min(maxBar, 720 / data.length - gap);
  const W = data.length * (bw + gap);
  return (
    <svg viewBox={`0 0 ${Math.max(W, 1)} ${H}`} preserveAspectRatio="xMinYMid meet"
         className="w-full" height={H} role="img" aria-label="Activity per day">
      {data.map((d, i) => {
        const h = (d.value / max) * (H - 20);
        return (
          <rect key={d.day} x={i * (bw + gap)} y={H - h} width={bw} height={h} fill={ORANGE}>
            <title>{`${d.day}: ${d.value}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}

// Horizontal bar list — reused for top pages and top referrers.
function TopList({ data, empty }: { data: { label: string; value: number }[]; empty: string }) {
  if (!data.length) return <p className="text-neutral-400">{empty}</p>;
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-2">
      {data.map((d) => (
        <li key={d.label} className="flex items-center gap-3 text-sm">
          <span className="w-48 shrink-0 truncate text-neutral-200">{d.label}</span>
          <span className="relative h-5 flex-1 bg-neutral-800">
            <span className="absolute inset-y-0 left-0"
                  style={{ width: `${(d.value / max) * 100}%`, background: ORANGE }} />
          </span>
          <span className="w-10 shrink-0 text-right tabular-nums text-neutral-300">{d.value}</span>
        </li>
      ))}
    </ul>
  );
}

function OverviewTab({ stats }: { stats: DashboardStats }) {
  return (
    <>
      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Pageviews" value={stats.total_pageviews} />
        <StatCard label="Unique visitors" value={stats.unique_visitors} />
        <StatCard label="Phone-call clicks" value={stats.total_phone_clicks} />
        <StatCard label="Form submissions" value={stats.total_forms} />
      </section>
      <section className={PANEL}>
        <h2 className={HEADING}>Pageviews per day</h2>
        <Bars
          data={stats.activity_by_day.map((d) => ({ day: d.day, value: d.pageviews }))}
          empty="No pageviews in this window."
        />
      </section>
    </>
  );
}

function TrafficTab({ stats }: { stats: DashboardStats }) {
  const series: { key: "pageviews" | "phone_clicks" | "forms"; title: string; empty: string }[] = [
    { key: "pageviews", title: "Pageviews per day", empty: "No pageviews in this window." },
    { key: "phone_clicks", title: "Phone-call clicks per day", empty: "No phone clicks in this window." },
    { key: "forms", title: "Form submissions per day", empty: "No submissions in this window." },
  ];
  return (
    <>
      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard label="Unique visitors" value={stats.unique_visitors} />
        <StatCard label="Unique sessions" value={stats.unique_sessions} />
        <StatCard label="Pageviews" value={stats.total_pageviews} />
      </section>

      <section className={`mb-8 ${PANEL}`}>
        <h2 className={HEADING}>Activity over time</h2>
        <div className="space-y-6">
          {series.map((s) => (
            <div key={s.key}>
              <p className="mb-2 text-xs text-neutral-400">{s.title}</p>
              <Bars data={stats.activity_by_day.map((d) => ({ day: d.day, value: d[s.key] }))} empty={s.empty} />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className={PANEL}>
          <h2 className={HEADING}>Top pages</h2>
          <TopList data={stats.top_pages.map((p) => ({ label: p.path, value: p.views }))} empty="No data yet." />
        </div>
        <div className={PANEL}>
          <h2 className={HEADING}>Top referrers</h2>
          <TopList data={stats.top_referrers.map((r) => ({ label: r.referrer, value: r.views }))} empty="No data yet." />
        </div>
      </section>
    </>
  );
}

function ContactsTab({ stats, forms }: { stats: DashboardStats; forms: FormSubmission[] }) {
  return (
    <>
      <section className="mb-8 grid grid-cols-2 gap-4">
        <StatCard label="Form submissions" value={stats.total_forms} />
        <StatCard label="Phone-call clicks" value={stats.total_phone_clicks} />
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
  );
}

export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab: raw } = await searchParams;
  const tab: TabId = TABS.some((t) => t.id === raw) ? (raw as TabId) : "overview";

  let stats: DashboardStats | undefined, forms: FormSubmission[] | undefined;
  let error: string | null = null;
  try {
    [stats, forms] = await Promise.all([getDashboardStats(30), getRecentForms(50)]);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 text-neutral-100">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-50">
          Ryno Detailing <span style={{ color: ORANGE }}>Dashboard</span>
        </h1>
        <p className="text-sm text-neutral-400">Totals all-time · trends last 30 days</p>
      </header>

      <nav className="mb-8 flex gap-1 border-b border-neutral-700">
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <Link
              key={t.id}
              href={t.id === "overview" ? "/" : `/?tab=${t.id}`}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
                active
                  ? "text-neutral-50"
                  : "border-transparent text-neutral-400 hover:text-neutral-200"
              }`}
              style={active ? { borderColor: ORANGE } : undefined}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      {error && (
        <div className="border border-red-700 bg-red-950 p-4 text-sm text-red-200">
          Failed to load stats: {error}
        </div>
      )}

      {stats && forms && (
        <>
          {tab === "overview" && <OverviewTab stats={stats} />}
          {tab === "traffic" && <TrafficTab stats={stats} />}
          {tab === "contacts" && <ContactsTab stats={stats} forms={forms} />}
        </>
      )}
    </main>
  );
}
