import { createClient } from "@/lib/supabase/server";

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("reports")
    .select("*, profiles!reports_client_id_fkey(full_name)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="p-7 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-2xl font-medium mb-1.5">گزارش‌ها</h1>
        <p className="text-xs text-text-faint">تولید و مدیریت گزارش‌ها</p>
      </div>

      <div className="rounded-2xl p-6 border border-line-strong mb-5"
        style={{ background: "linear-gradient(135deg,rgba(201,169,97,0.08),transparent 60%)" }}>
        <div className="text-[11px] text-accent tracking-wider mb-1 uppercase">به‌زودی</div>
        <div className="text-base font-medium mb-1">تولید خودکار گزارش</div>
        <div className="text-xs text-text-dim">این بخش در نسخه‌های بعدی فعال می‌شود · فعلاً می‌توانید PDF را خارجی بسازید و در table اضافه کنید</div>
      </div>

      {!reports?.length ? (
        <div className="rounded-2xl border border-line p-16 text-center bg-bg-2">
          <div className="text-4xl mb-4 opacity-50">📊</div>
          <div className="text-base font-medium">گزارشی ثبت نشده</div>
        </div>
      ) : (
        <div className="rounded-2xl border border-line overflow-hidden bg-bg-2">
          <table className="w-full">
            <thead style={{ background: "rgba(201,169,97,0.04)" }}>
              <tr className="text-[10px] text-text-dim tracking-wider uppercase">
                <th className="p-4 text-right">گزارش</th>
                <th className="p-4 text-right">مشتری</th>
                <th className="p-4 text-right">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} className="border-t border-line text-sm">
                  <td className="p-4">{r.title || r.period}</td>
                  <td className="p-4 text-xs">{r.profiles?.full_name || "—"}</td>
                  <td className="p-4 text-xs text-text-dim">{new Date(r.created_at).toLocaleDateString("fa-IR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
