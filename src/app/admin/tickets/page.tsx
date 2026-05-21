import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminTicketsPage() {
  const supabase = await createClient();
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*, profiles!tickets_client_id_fkey(full_name, email)")
    .order("updated_at", { ascending: false });

  return (
    <div className="p-7">
      <div className="mb-7">
        <h1 className="text-2xl font-medium mb-1.5">تیکت‌ها و پیام‌ها</h1>
        <p className="text-xs text-text-faint">{tickets?.length || 0} تیکت در سیستم</p>
      </div>

      {!tickets?.length ? (
        <div className="rounded-2xl border border-line p-16 text-center bg-bg-2">
          <div className="text-4xl mb-4 opacity-50">💬</div>
          <div className="text-base font-medium">هنوز تیکتی نیست</div>
        </div>
      ) : (
        <div className="rounded-2xl border border-line overflow-hidden bg-bg-2">
          <table className="w-full">
            <thead style={{ background: "rgba(201,169,97,0.04)" }}>
              <tr className="text-[10px] text-text-dim tracking-wider uppercase">
                <th className="p-4 text-right">تیکت</th>
                <th className="p-4 text-right">مشتری</th>
                <th className="p-4 text-right">اولویت</th>
                <th className="p-4 text-right">وضعیت</th>
                <th className="p-4 text-right">آخرین فعالیت</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} className="border-t border-line text-sm hover:bg-tint cursor-pointer"
                  onClick={() => location.href = `/admin/tickets/${t.id}`}>
                  <td className="p-4">
                    <Link href={`/admin/tickets/${t.id}`}>
                      <div className="text-[11px] text-text-faint num">{t.ticket_number}</div>
                      <div className="text-sm font-medium mt-0.5">{t.subject}</div>
                    </Link>
                  </td>
                  <td className="p-4">
                    <div className="text-xs">{t.profiles?.full_name || "—"}</div>
                    <div className="text-[10px] text-text-faint">{t.profiles?.email}</div>
                  </td>
                  <td className="p-4"><PriorityBadge priority={t.priority} /></td>
                  <td className="p-4"><StatusBadge status={t.status} /></td>
                  <td className="p-4 text-xs text-text-dim">{new Date(t.updated_at).toLocaleDateString("fa-IR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PriorityBadge({ priority }: any) {
  const styles: any = {
    high: { bg: "rgba(201,122,107,0.12)", color: "#C97A6B", label: "⚠ بالا" },
    normal: { bg: "rgba(201,169,97,0.04)", color: "#8A857B", label: "عادی" },
    low: { bg: "rgba(201,169,97,0.04)", color: "#5A5852", label: "پایین" },
  };
  const s = styles[priority] || styles.normal;
  return <span className="text-[10px] px-2 py-1 rounded font-medium" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>{s.label}</span>;
}

function StatusBadge({ status }: any) {
  const styles: any = {
    open: { bg: "rgba(107,174,124,0.12)", color: "#6BAE7C", label: "● باز" },
    in_progress: { bg: "rgba(107,156,201,0.12)", color: "#6B9CC9", label: "در جریان" },
    waiting_client: { bg: "rgba(201,179,107,0.12)", color: "#C9B36B", label: "⏳ منتظر" },
    closed: { bg: "rgba(138,133,123,0.12)", color: "#8A857B", label: "بسته" },
  };
  const s = styles[status] || styles.open;
  return <span className="text-[10px] px-2 py-1 rounded font-medium" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>{s.label}</span>;
}
