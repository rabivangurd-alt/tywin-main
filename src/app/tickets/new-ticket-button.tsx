"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewTicketButton() {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (!subject.trim() || !body.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: ticket, error } = await supabase
      .from("tickets")
      .insert({ client_id: user!.id, subject, status: "open", priority: "normal" })
      .select()
      .single();

    if (!error && ticket) {
      await supabase.from("messages").insert({
        ticket_id: ticket.id,
        sender_id: user!.id,
        body,
        is_internal: false,
      });
      router.push(`/tickets/${ticket.id}`);
    } else {
      alert("خطا: " + error?.message);
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="px-5 py-2.5 rounded-xl text-[#0A0A0B] font-semibold text-xs"
        style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)" }}>
        + پیام جدید
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
      <div className="rounded-2xl border border-line p-6 max-w-md w-full" style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
        <div className="text-lg font-medium mb-4">پیام جدید</div>
        <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="موضوع..."
          className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-accent mb-3" />
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="پیام شما..." rows={5}
          className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-accent resize-none mb-4" />
        <div className="flex gap-2 justify-end">
          <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-xs text-text-dim border border-line">انصراف</button>
          <button onClick={submit} disabled={loading || !subject || !body}
            className="px-5 py-2 rounded-lg text-xs text-[#0A0A0B] font-semibold"
            style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)" }}>
            {loading ? "..." : "ارسال"}
          </button>
        </div>
      </div>
    </div>
  );
}
