import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import NewTicketButton from "./new-ticket-button";

export default async function TicketsListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .eq("client_id", user!.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="max-w-[1100px] mx-auto p-8">
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-2xl font-medium mb-1.5">پیام‌ها</h1>
          <p className="text-xs text-text-faint">گفتگو با مدیر سرمایه · {tickets?.length || 0} مکالمه</p>
        </div>
        <NewTicketButton />
      </div>

      {!tickets?.length ? (
        <div className="rounded-2xl border border-line p-16 text-center bg-bg-2">
          <div className="text-4xl mb-4 opacity-50">💬</div>
          <div className="text-base font-medium mb-2">هنوز پیامی ندارید</div>
          <div className="text-xs text-text-dim mb-4">برای شروع گفتگو، تیکت جدید بسازید</div>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map(t => (
            <Link key={t.id} href={`/tickets/${t.id}`}
              className="rounded-2xl p-5 border border-line hover:border-line-strong block bg-bg-2 hover:bg-tint">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-tint-2 grid place-items-center text-accent">💬</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] text-text-faint num">{t.ticket_number}</span>
                  </div>
                  <div className="text-sm font-medium mb-1">{t.subject}</div>
                  <div className="text-[11px] text-text-faint">
                    آخرین فعالیت: {new Date(t.updated_at).toLocaleDateString("fa-IR")}
                  </div>
                </div>
                <TicketStatus status={t.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function TicketStatus({ status }: any) {
  const styles: any = {
    open: { bg: "rgba(107,174,124,0.12)", color: "#6BAE7C", label: "● باز" },
    in_progress: { bg: "rgba(107,156,201,0.12)", color: "#6B9CC9", label: "در حال پیگیری" },
    waiting_client: { bg: "rgba(201,179,107,0.12)", color: "#C9B36B", label: "⏳ منتظر شما" },
    closed: { bg: "rgba(138,133,123,0.12)", color: "#8A857B", label: "بسته" },
  };
  const s = styles[status] || styles.open;
  return (
    <span className="text-[10px] px-2.5 py-1 rounded-md font-medium whitespace-nowrap"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>
      {s.label}
    </span>
  );
}
