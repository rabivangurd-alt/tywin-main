import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Stats
  const { count: totalClients } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "client")
    .eq("status", "active");

  const { count: pendingApprovals } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: openTickets } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .in("status", ["open", "in_progress"]);

  // Latest clients
  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name, email, created_at, status")
    .eq("role", "client")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="p-7">
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-2xl font-medium mb-1.5">سلام، <span className="text-accent">ارباب تایوین</span> 👑</h1>
          <p className="text-xs text-text-faint">مرور کلی Tywin Capital</p>
        </div>
        <div className="flex gap-2.5">
          <Link href="/admin/clients" className="px-4 py-2.5 rounded-xl text-xs border border-line-strong bg-tint text-text">
            + افزودن مشتری
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-7">
        <KpiCard label="مشتری‌های فعال" value={totalClients ?? 0} icon="👥" />
        <KpiCard label="در انتظار تأیید" value={pendingApprovals ?? 0} icon="⏳"
          highlight={pendingApprovals && pendingApprovals > 0 ? "warning" : undefined}
          href="/admin/approvals" />
        <KpiCard label="تیکت‌های باز" value={openTickets ?? 0} icon="💬"
          highlight={openTickets && openTickets > 0 ? "accent" : undefined}
          href="/admin/tickets" />
        <KpiCard label="سرمایه تحت مدیریت" value="—" icon="💰" />
      </div>

      {/* Action items */}
      {((pendingApprovals ?? 0) > 0 || (openTickets ?? 0) > 0) && (
        <div className="rounded-2xl p-6 border border-line mb-7"
          style={{ background: "linear-gradient(180deg,rgba(201,169,97,0.04),transparent)" }}>
          <div className="text-sm font-medium mb-4">اقدامات لازم</div>
          <div className="space-y-3">
            {pendingApprovals && pendingApprovals > 0 && (
              <Link href="/admin/approvals" className="flex items-center gap-3 p-3 rounded-xl bg-tint border border-line hover:border-line-strong">
                <div className="w-9 h-9 rounded-xl grid place-items-center"
                  style={{ background: "rgba(201,179,107,0.1)", color: "#C9B36B" }}>!</div>
                <div className="flex-1">
                  <div className="text-sm">{pendingApprovals} ثبت‌نام در انتظار تأیید</div>
                </div>
                <div className="text-xs text-accent">بررسی →</div>
              </Link>
            )}
            {openTickets && openTickets > 0 && (
              <Link href="/admin/tickets" className="flex items-center gap-3 p-3 rounded-xl bg-tint border border-line hover:border-line-strong">
                <div className="w-9 h-9 rounded-xl bg-tint-2 grid place-items-center text-accent">💬</div>
                <div className="flex-1">
                  <div className="text-sm">{openTickets} تیکت باز</div>
                </div>
                <div className="text-xs text-accent">پاسخ →</div>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Recent clients */}
      <div className="rounded-2xl border border-line overflow-hidden bg-bg-2">
        <div className="p-5 flex justify-between items-center border-b border-line">
          <div>
            <div className="text-sm font-medium">جدیدترین مشتری‌ها</div>
            <div className="text-[11px] text-text-faint mt-1">آخرین ۵ ثبت‌نام</div>
          </div>
          <Link href="/admin/clients" className="text-xs text-accent">مشاهده همه ←</Link>
        </div>
        {!clients?.length ? (
          <div className="p-10 text-center text-text-faint text-sm">هنوز مشتری ثبت‌نام نکرده</div>
        ) : (
          <div>
            {clients.map(c => (
              <Link key={c.id} href={`/admin/clients/${c.id}`}
                className="flex items-center gap-3 p-4 border-b border-line last:border-0 hover:bg-tint">
                <div className="w-9 h-9 rounded-xl bg-tint-2 grid place-items-center text-accent font-semibold text-xs">
                  {c.full_name?.charAt(0) || "?"}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{c.full_name || "بدون نام"}</div>
                  <div className="text-xs text-text-faint">{c.email}</div>
                </div>
                <StatusBadge status={c.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon, highlight, href }: any) {
  const Wrapper: any = href ? Link : "div";
  return (
    <Wrapper href={href} className="rounded-2xl border border-line p-5 block cursor-default"
      style={{ background: `linear-gradient(180deg,${highlight === "warning" ? "rgba(201,179,107,0.08)" : "rgba(201,169,97,0.04)"},transparent)` }}>
      <div className="flex justify-between items-center mb-3.5">
        <span className="text-[11px] text-text-dim">{label}</span>
        <div className="w-9 h-9 rounded-xl bg-tint-2 grid place-items-center text-base text-accent">{icon}</div>
      </div>
      <div className="text-2xl font-semibold num">{value}</div>
    </Wrapper>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    active: { bg: "rgba(107,174,124,0.12)", color: "#6BAE7C", label: "● فعال" },
    pending: { bg: "rgba(201,179,107,0.12)", color: "#C9B36B", label: "⏳ در انتظار" },
    rejected: { bg: "rgba(201,122,107,0.12)", color: "#C97A6B", label: "✕ رد شده" },
    suspended: { bg: "rgba(201,122,107,0.12)", color: "#C97A6B", label: "⛔ معلق" },
  };
  const s = styles[status] || styles.pending;
  return (
    <span className="text-[10px] px-2.5 py-1 rounded-md font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>
      {s.label}
    </span>
  );
}
