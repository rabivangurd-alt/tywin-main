import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import KycClient from "./kyc-client";

export default async function KycPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const supabase = await createClient();
  const { data: client } = await supabase.from("profiles").select("*").eq("id", clientId).single();
  if (!client) notFound();

  return (
    <div className="p-7 max-w-[1100px] mx-auto">
      <Link href={`/admin/clients/${clientId}`} className="text-xs text-text-dim hover:text-accent mb-4 inline-block">← بازگشت به مشتری</Link>
      <KycClient client={client} />
    </div>
  );
}
