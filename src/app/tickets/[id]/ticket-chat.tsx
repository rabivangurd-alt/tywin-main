"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TicketChat({ ticketId, initialMessages, userId, isAdmin }: any) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [internal, setInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`ticket-${ticketId}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `ticket_id=eq.${ticketId}` },
        payload => {
          const newMsg = payload.new as any;
          // Skip internal messages for non-admins
          if (newMsg.is_internal && !isAdmin) return;
          setMessages((prev: any[]) => prev.find(m => m.id === newMsg.id) ? prev : [...prev, newMsg]);
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [ticketId, isAdmin]);

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({ ticket_id: ticketId, sender_id: userId, body: text, is_internal: internal && isAdmin })
      .select()
      .single();

    if (!error && data) {
      setMessages((prev: any[]) => [...prev, data]);
      setText("");
      // Update ticket's updated_at
      await supabase.from("tickets").update({ updated_at: new Date().toISOString() }).eq("id", ticketId);
    } else {
      alert("خطا: " + error?.message);
    }
    setSending(false);
  };

  return (
    <>
      <div className="rounded-2xl border border-line p-5 mb-4 space-y-3 bg-bg" style={{ minHeight: 320, maxHeight: 600, overflowY: "auto" }}>
        {messages.length === 0 ? (
          <div className="text-center text-text-faint text-sm py-10">هنوز پیامی نیست</div>
        ) : (
          messages.map((m: any) => <MessageBubble key={m.id} m={m} mine={m.sender_id === userId} isAdmin={isAdmin} />)
        )}
        <div ref={bottomRef} />
      </div>

      <div className="rounded-2xl border border-line p-4" style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
        {isAdmin && (
          <div className="flex gap-2 mb-3 pb-3 border-b border-line">
            <button onClick={() => setInternal(false)}
              className={`px-3 py-1.5 rounded-lg text-xs border ${!internal ? "text-accent border-line-strong bg-tint" : "text-text-dim border-transparent"}`}>
              💬 پاسخ به مشتری
            </button>
            <button onClick={() => setInternal(true)}
              className={`px-3 py-1.5 rounded-lg text-xs border ${internal ? "text-warning bg-warning-bg" : "text-text-dim border-transparent"}`}
              style={internal ? { borderColor: "rgba(201,179,107,0.3)", background: "rgba(201,179,107,0.08)" } : {}}>
              🔒 یادداشت داخلی
            </button>
          </div>
        )}
        <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
          placeholder={internal ? "یادداشت برای خودتان..." : "پیامتان را بنویسید..."}
          className="w-full bg-transparent border-none text-sm outline-none resize-none mb-3" />
        <div className="flex justify-end">
          <button onClick={send} disabled={sending || !text.trim()}
            className="px-5 py-2 rounded-lg text-xs text-[#0A0A0B] font-semibold"
            style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)" }}>
            {sending ? "..." : "ارسال ←"}
          </button>
        </div>
      </div>
    </>
  );
}

function MessageBubble({ m, mine, isAdmin }: any) {
  if (m.is_internal) {
    return (
      <div className="rounded-xl p-3.5 border border-dashed" style={{ background: "rgba(201,179,107,0.08)", borderColor: "rgba(201,179,107,0.25)" }}>
        <div className="text-[10px] text-warning mb-1.5 font-medium tracking-wide">🔒 یادداشت داخلی — مشتری نمی‌بیند</div>
        <div className="text-xs leading-relaxed text-text">{m.body}</div>
        <div className="text-[10px] text-text-faint mt-1.5">{new Date(m.created_at).toLocaleString("fa-IR")}</div>
      </div>
    );
  }

  return (
    <div className={`flex ${mine ? "" : "justify-end"} gap-2`}>
      <div className="max-w-[78%]">
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${mine ? "bg-bg-2 border border-line" : ""}`}
          style={mine ? {} : {
            background: "linear-gradient(180deg,rgba(201,169,97,0.08),rgba(201,169,97,0.04))",
            border: "1px solid rgba(201,169,97,0.3)",
          }}>
          {m.body}
        </div>
        <div className={`text-[10px] text-text-faint mt-1 ${mine ? "" : "text-left"}`}>
          {new Date(m.created_at).toLocaleString("fa-IR")}
        </div>
      </div>
    </div>
  );
}
