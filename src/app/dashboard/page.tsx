import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ClientDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: contracts } = await supabase
    .from("contracts")
    .select("*")
    .eq("client_id", user!.id)
    .eq("status", "active");

  const totalBalance = contracts?.reduce((sum, c) => sum + (Number(c.current_balance) || 0), 0) || 0;
  const totalInitial = contracts?.reduce((sum, c) => sum + (Number(c.initial_capital) || 0), 0) || 0;
  const totalProfit = totalBalance - totalInitial;
  const profitPct = totalInitial > 0 ? (totalProfit / totalInitial) * 100 : 0;

  const { data: recentTx } = await supabase
    .from("capital_transactions")
    .select("*")
    .in("contract_id", (contracts || []).map(c => c.id))
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="max-w-[1280px] mx-auto p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-medium mb-1.5">سلام 👋</h1>
        <p className="text-xs text-text-faint">مرور سرمایه و عملکرد شما</p>
      </div>

      {/* Balance hero */}
      <div className="rounded-3xl p-8 border border-line-strong mb-6"
        style={{ background: "radial-gradient(circle at top right, rgba(201,169,97,0.08), transparent 60%), linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
        <div className="text-[11px] text-accent tracking-[2px] mb-3 uppercase">موجودی کل</div>
        <div className="text-5xl font-medium mb-4 num text-accent">${totalBalance.toLocaleString()}</div>
        <div className="flex gap-5 text-xs">
          <div>
            <span className="text-text-faint">سود کل: </span>
            <span className={totalProfit >= 0 ? "text-up num" : "text-down num"}>
              {totalProfit >= 0 ? "+" : ""}${totalProfit.toLocaleString()} ({profitPct.toFixed(2)}%)
            </span>
          </div>
          <div>
            <span className="text-text-faint">قراردادهای فعال: </span>
            <span className="text-text">{contracts?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Contracts grid */}
      {contracts && contracts.length > 0 && (
        <div className="mb-6">
          <div className="text-xs text-text-dim tracking-wider mb-3 uppercase">قراردادهای فعال</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.map(c => (
              <Link key={c.id} href={`/contract`} className="rounded-2xl p-5 border border-line hover:border-line-strong bg-bg-2 block">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-xs text-text-faint num">{c.contract_number}</div>
                    <div className="text-sm font-medium mt-1">قرارداد فعال</div>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded text-up" style={{ background: "rgba(107,174,124,0.1)", border: "1px solid rgba(107,174,124,0.3)" }}>● فعال</span>
                </div>
                <div className="text-2xl font-medium num text-accent">${Number(c.current_balance).toLocaleString()}</div>
                <div className="text-xs text-text-dim mt-2">شروع: ${Number(c.initial_capital).toLocaleString()}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <div className="rounded-2xl border border-line overflow-hidden bg-bg-2">
        <div className="p-5 border-b border-line flex justify-between items-center">
          <div className="text-sm font-medium">آخرین تراکنش‌ها</div>
          <Link href="/transactions" className="text-xs text-accent">مشاهده همه ←</Link>
        </div>
        {!recentTx?.length ? (
          <div className="p-10 text-center text-text-faint text-sm">تراکنشی ثبت نشده</div>
        ) : (
          <div>
            {recentTx.map(t => (
              <div key={t.id} className="flex justify-between items-center p-4 border-b border-line last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-tint grid place-items-center text-accent">
                    {t.type === "deposit" ? "↓" : t.type === "withdrawal" ? "↑" : "•"}
                  </div>
                  <div>
                    <div className="text-sm">{t.type === "deposit" ? "واریز" : t.type === "withdrawal" ? "برداشت" : "تراکنش"}</div>
                    <div className="text-[11px] text-text-faint">{new Date(t.created_at).toLocaleDateString("fa-IR")}</div>
                  </div>
                </div>
                <div className={t.type === "deposit" ? "text-up num text-sm" : "text-down num text-sm"}>
                  {t.type === "deposit" ? "+" : "-"}${Number(t.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
