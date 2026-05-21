import { createClient } from "@/lib/supabase/server";

export default async function ContractPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: contracts } = await supabase
    .from("contracts")
    .select("*")
    .eq("client_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-[1100px] mx-auto p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-medium mb-1.5">قراردادها</h1>
        <p className="text-xs text-text-faint">جزئیات کامل قراردادهای شما</p>
      </div>

      {!contracts?.length ? (
        <EmptyState />
      ) : (
        <div className="space-y-5">
          {contracts.map(c => {
            const initial = Number(c.initial_capital);
            const current = Number(c.current_balance);
            const profit = current - initial;
            const profitPct = initial > 0 ? (profit / initial) * 100 : 0;
            return (
              <div key={c.id} className="rounded-2xl border border-line p-7" style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-[11px] text-text-faint num">{c.contract_number}</div>
                    <div className="text-lg font-medium mt-1">قرارداد مدیریت سرمایه</div>
                    <div className="text-xs text-text-dim mt-1">شروع: {new Date(c.start_date || c.created_at).toLocaleDateString("fa-IR")}</div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-line pt-5">
                  <Stat label="سرمایه اولیه" value={`$${initial.toLocaleString()}`} />
                  <Stat label="موجودی فعلی" value={`$${current.toLocaleString()}`} accent />
                  <Stat label="سود/زیان" value={`${profit >= 0 ? "+" : ""}$${profit.toLocaleString()}`} color={profit >= 0 ? "up" : "down"} />
                  <Stat label="درصد بازده" value={`${profitPct >= 0 ? "+" : ""}${profitPct.toFixed(2)}%`} color={profit >= 0 ? "up" : "down"} />
                </div>

                {c.manager_share && (
                  <div className="mt-5 pt-5 border-t border-line grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-text-faint">سهم مدیر: </span>
                      <span className="text-accent">{c.manager_share}%</span>
                    </div>
                    <div>
                      <span className="text-text-faint">سطح ریسک: </span>
                      <span className="text-text">{c.risk_level || "—"}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent, color }: any) {
  const colorClass = color === "up" ? "text-up" : color === "down" ? "text-down" : accent ? "text-accent" : "";
  return (
    <div className="border-l border-line last:border-0 px-5 first:pl-5 first:pr-0">
      <div className="text-[10px] text-text-dim tracking-wider mb-2 uppercase">{label}</div>
      <div className={`text-lg font-medium num ${colorClass}`}>{value}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-line p-16 text-center bg-bg-2">
      <div className="text-4xl mb-4 opacity-50">📄</div>
      <div className="text-base font-medium mb-2">هنوز قراردادی ثبت نشده</div>
      <div className="text-xs text-text-dim">پس از بسته‌شدن اولین قرارداد، جزئیات اینجا نمایش داده می‌شود</div>
    </div>
  );
}

function StatusBadge({ status }: any) {
  const styles: any = {
    active: { bg: "rgba(107,174,124,0.12)", color: "#6BAE7C", label: "● فعال" },
    closed: { bg: "rgba(138,133,123,0.12)", color: "#8A857B", label: "بسته شده" },
    paused: { bg: "rgba(201,179,107,0.12)", color: "#C9B36B", label: "⏸ متوقف" },
  };
  const s = styles[status] || styles.active;
  return (
    <span className="text-[10px] px-3 py-1 rounded-md font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>
      {s.label}
    </span>
  );
}
