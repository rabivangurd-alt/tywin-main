import { createClient } from "@/lib/supabase/server";

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Try fetching reports if table exists; otherwise show empty state
  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("client_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-[1100px] mx-auto p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-medium mb-1.5">گزارش‌ها</h1>
        <p className="text-xs text-text-faint">گزارش‌های ماهانه، فصلی و سالانه</p>
      </div>

      {!reports?.length ? (
        <div className="rounded-2xl border border-line p-16 text-center bg-bg-2">
          <div className="text-4xl mb-4 opacity-50">📊</div>
          <div className="text-base font-medium mb-2">هنوز گزارشی منتشر نشده</div>
          <div className="text-xs text-text-dim">گزارش‌های شما در پایان هر ماه اینجا قرار می‌گیرد</div>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(r => (
            <div key={r.id} className="rounded-xl border border-line p-4 bg-bg-2 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-tint-2 grid place-items-center text-accent text-lg">📊</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{r.title || `گزارش ${r.period || ""}`}</div>
                <div className="text-[11px] text-text-faint mt-1">منتشر شده: {new Date(r.created_at).toLocaleDateString("fa-IR")}</div>
              </div>
              {r.file_url && (
                <a href={r.file_url} download className="px-4 py-2 rounded-lg text-xs text-accent border border-line-strong bg-tint">
                  📥 دانلود
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
