import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import TicketChat from "@/app/tickets/[id]/ticket-chat";

export default async function AdminTicketDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: ticket } = await supabase
    .from("tickets")
    .select("*, profiles!tickets_client_id_fkey(full_name, email, phone)")
    .eq("id", id)
    .single();

  if (!ticket) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="p-7 max-w-[1200px] mx-auto">
      <Link href="/admin/tickets" className="text-xs text-text-dim hover:text-accent mb-4 inline-block">← بازگشت به لیست</Link>

      <div className="rounded-2xl border border-line p-6 mb-4" style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[11px] text-text-faint num mb-1">{ticket.ticket_number}</div>
            <div className="text-lg font-medium">{ticket.subject}</div>
            <div className="text-xs text-text-dim mt-2">
              مشتری: <span className="text-text">{ticket.profiles?.full_name}</span> · {ticket.profiles?.email}
            </div>
          </div>
        </div>
      </div>

      <TicketChat ticketId={id} initialMessages={messages || []} userId={user!.id} isAdmin={true} />
    </div>
  );
}
