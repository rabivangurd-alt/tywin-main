import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  return (
    <div className="p-7">
      <div className="mb-7">
        <h1 className="text-2xl font-medium mb-1.5">مشتری‌ها</h1>
        <p className="text-xs text-text-faint">{clients?.length || 0} مشتری ثبت‌شده</p>
      </div>

      <div className="rounded-2xl border border-line overflow-hidden bg-bg-2">
        <table className="w-full">
          <thead style={{ background: "rgba(201,169,97,0.04)" }}>
            <tr className="text-[10px] text-text-dim tracking-wider uppercase">
              <th className="p-4 text-right">نام</th>
              <th className="p-4 text-right">ایمیل</th>
              <th className="p-4 text-right">تلفن</th>
              <th className="p-4 text-right">وضعیت</th>
              <th className="p-4 text-right">عضویت</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {!clients?.length ? (
              <tr><td colSpan={6} className="p-10 text-center text-text-faint text-sm">هنوز مشتری ندارید</td></tr>
            ) : clients.map(c => (
              <tr key={c.id} className="border-t border-line text-sm hover:bg-tint">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-tint-2 grid place-items-center text-accent font-semibold text-xs">
                      {c.full_name?.charAt(0) || "?"}
                    </div>
                    <span className="font-medium">{c.full_name || "—"}</span>
                  </div>
                </td>
                <td className="p-4 text-xs text-text-dim">{c.email}</td>
                <td className="p-4 text-xs text-text-dim num">{c.phone || "—"}</td>
                <td className="p-4"><StatusBadge status={c.status} /></td>
                <td className="p-4 text-xs text-text-faint">{new Date(c.created_at).toLocaleDateString("fa-IR")}</td>
                <td className="p-4 text-left">
                  <Link href={`/admin/clients/${c.id}`} className="text-xs text-accent hover:underline">جزئیات ←</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: any) {
  const styles: any = {
    active: { bg: "rgba(107,174,124,0.12)", color: "#6BAE7C", label: "● فعال" },
    pending: { bg: "rgba(201,179,107,0.12)", color: "#C9B36B", label: "⏳ در انتظار" },
    rejected: { bg: "rgba(201,122,107,0.12)", color: "#C97A6B", label: "✕ رد" },
    suspended: { bg: "rgba(201,122,107,0.12)", color: "#C97A6B", label: "⛔ معلق" },
  };
  const s = styles[status] || styles.pending;
  return (
    <span className="text-[10px] px-2.5 py-1 rounded font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>
      {s.label}
    </span>
  );
}
