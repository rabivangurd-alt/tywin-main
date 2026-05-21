import { createClient } from "@/lib/supabase/server";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: contracts } = await supabase.from("contracts").select("id").eq("client_id", user!.id);
  const contractIds = (contracts || []).map(c => c.id);

  const { data: txs } = await supabase
    .from("capital_transactions")
    .select("*, contracts(contract_number)")
    .in("contract_id", contractIds.length ? contractIds : ["none"])
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-[1100px] mx-auto p-8">
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-2xl font-medium mb-1.5">تراکنش‌ها</h1>
          <p className="text-xs text-text-faint">تاریخچه کامل واریز، برداشت و عملکرد</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 rounded-xl text-xs border border-line-strong bg-tint">+ درخواست واریز</button>
          <button className="px-4 py-2.5 rounded-xl text-xs border border-line text-text-dim">↑ درخواست برداشت</button>
        </div>
      </div>

      {!txs?.length ? (
        <div className="rounded-2xl border border-line p-16 text-center bg-bg-2">
          <div className="text-4xl mb-4 opacity-50">💱</div>
          <div className="text-base font-medium">تراکنشی ثبت نشده</div>
        </div>
      ) : (
        <div className="rounded-2xl border border-line overflow-hidden bg-bg-2">
          <table className="w-full">
            <thead style={{ background: "rgba(201,169,97,0.04)" }}>
              <tr className="text-[10px] text-text-dim tracking-wider uppercase">
                <th className="p-4 text-right">تاریخ</th>
                <th className="p-4 text-right">نوع</th>
                <th className="p-4 text-right">قرارداد</th>
                <th className="p-4 text-right">مبلغ</th>
                <th className="p-4 text-right">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {txs.map(t => (
                <tr key={t.id} className="border-t border-line text-sm">
                  <td className="p-4 text-text-dim text-xs">{new Date(t.created_at).toLocaleDateString("fa-IR")}</td>
                  <td className="p-4">
                    <span className="text-xs">{t.type === "deposit" ? "↓ واریز" : t.type === "withdrawal" ? "↑ برداشت" : "• " + t.type}</span>
                  </td>
                  <td className="p-4 text-xs text-text-faint num">{t.contracts?.contract_number || "—"}</td>
                  <td className={`p-4 num text-sm ${t.type === "deposit" ? "text-up" : t.type === "withdrawal" ? "text-down" : "text-text"}`}>
                    {t.type === "deposit" ? "+" : t.type === "withdrawal" ? "-" : ""}${Number(t.amount).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <StatusPill status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: any) {
  const styles: any = {
    completed: { bg: "rgba(107,174,124,0.12)", color: "#6BAE7C", label: "✓ تکمیل" },
    pending: { bg: "rgba(201,179,107,0.12)", color: "#C9B36B", label: "⏳ در انتظار" },
    rejected: { bg: "rgba(201,122,107,0.12)", color: "#C97A6B", label: "✕ رد" },
  };
  const s = styles[status] || styles.pending;
  return (
    <span className="text-[10px] px-2.5 py-1 rounded font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>
      {s.label}
    </span>
  );
}
