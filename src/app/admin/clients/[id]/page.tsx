import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: client } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (!client) notFound();

  const { data: contracts } = await supabase.from("contracts").select("*").eq("client_id", id);
  const { count: ticketCount } = await supabase.from("tickets").select("*", { count: "exact", head: true }).eq("client_id", id);

  const totalBalance = (contracts || []).reduce((s, c) => s + Number(c.current_balance || 0), 0);

  return (
    <div className="p-7 max-w-[1200px] mx-auto">
      <Link href="/admin/clients" className="text-xs text-text-dim hover:text-accent mb-4 inline-block">← بازگشت به لیست</Link>

      <div className="rounded-2xl p-7 border border-line mb-5 flex gap-6 items-center"
        style={{ background: "linear-gradient(135deg,rgba(201,169,97,0.04),transparent),linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
        <div className="w-16 h-16 rounded-2xl bg-tint-2 grid place-items-center text-accent font-semibold text-2xl">
          {client.full_name?.charAt(0) || "?"}
        </div>
        <div className="flex-1">
          <div className="text-xl font-medium">{client.full_name || "بدون نام"}</div>
          <div className="text-sm text-text-dim mt-1 flex gap-3">
            <span>{client.email}</span>
            <span>·</span>
            <span className="num">{client.phone || "—"}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/kyc/${id}`} className="px-4 py-2.5 rounded-xl text-xs border border-line-strong bg-tint text-text">⚖ مدیریت KYC</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <Stat label="موجودی کل" value={`$${totalBalance.toLocaleString()}`} accent />
        <Stat label="قراردادها" value={contracts?.length || 0} />
        <Stat label="تیکت‌ها" value={ticketCount || 0} />
      </div>

      <div className="rounded-2xl border border-line bg-bg-2 p-6">
        <div className="text-sm font-medium mb-4">قراردادها</div>
        {!contracts?.length ? (
          <div className="text-center text-text-faint text-sm py-8">قراردادی ندارد</div>
        ) : (
          <div className="space-y-2">
            {contracts.map(c => (
              <div key={c.id} className="rounded-xl p-4 border border-line bg-bg flex justify-between items-center">
                <div>
                  <div className="text-xs text-text-faint num">{c.contract_number}</div>
                  <div className="text-sm mt-1">شروع: ${Number(c.initial_capital).toLocaleString()}</div>
                </div>
                <div className="text-base text-accent num font-medium">${Number(c.current_balance).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: any) {
  return (
    <div className="rounded-2xl p-5 border border-line bg-bg-2">
      <div className="text-[11px] text-text-dim mb-2">{label}</div>
      <div className={`text-xl font-semibold num ${accent ? "text-accent" : ""}`}>{value}</div>
    </div>
  );
}
