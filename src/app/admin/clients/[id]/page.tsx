import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ClientManager from "./client-manager";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (!client) notFound();

  const { data: contracts } = await supabase
    .from("contracts").select("*").eq("client_id", id)
    .order("created_at", { ascending: false });

  const contractIds = (contracts || []).map(c => c.id);
  const { data: transactions } = await supabase
    .from("capital_transactions")
    .select("*")
    .in("contract_id", contractIds.length ? contractIds : ["none"])
    .order("transaction_date", { ascending: false });

  return (
    <div className="p-7 max-w-[1200px] mx-auto">
      <Link href="/admin/clients" className="text-xs text-text-dim hover:text-accent mb-4 inline-block">← بازگشت به لیست</Link>
      <ClientManager
        client={client}
        contracts={contracts || []}
        transactions={transactions || []}
      />
    </div>
  );
}
