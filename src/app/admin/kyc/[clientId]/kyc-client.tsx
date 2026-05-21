"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function KycClient({ client: initialClient }: any) {
  const [client, setClient] = useState(initialClient);
  const [adminMessage, setAdminMessage] = useState(initialClient.admin_message || "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const docs = client.kyc_documents || {};

  const toggleVerified = async () => {
    setSaving(true);
    const supabase = createClient();
    const newVal = !client.kyc_verified;
    const { error } = await supabase
      .from("profiles")
      .update({ kyc_verified: newVal, kyc_verified_at: newVal ? new Date().toISOString() : null })
      .eq("id", client.id);
    if (!error) {
      setClient({ ...client, kyc_verified: newVal });
      router.refresh();
    }
    setSaving(false);
  };

  const setDocStatus = async (docKey: string, status: "approved" | "rejected", reason?: string) => {
    const supabase = createClient();
    const newDocs = { ...docs, [docKey]: { ...docs[docKey], status, ...(reason ? { rejection_reason: reason } : {}) } };
    const { error } = await supabase.from("profiles").update({ kyc_documents: newDocs }).eq("id", client.id);
    if (!error) {
      setClient({ ...client, kyc_documents: newDocs });
      router.refresh();
    }
  };

  const saveMessage = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ admin_message: adminMessage }).eq("id", client.id);
    setSaving(false);
  };

  const docTypes = [
    { key: "id_card", icon: "🆔", label: "کارت ملی" },
    { key: "national_id", icon: "📄", label: "شناسنامه" },
    { key: "selfie", icon: "🤳", label: "سلفی با مدرک" },
    { key: "address_proof", icon: "🏠", label: "اثبات آدرس" },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-medium mb-1.5">مدیریت احراز هویت</h1>
        <p className="text-xs text-text-faint">{client.full_name} · شما تصمیم می‌گیرید چه مدرکی کافی است</p>
      </div>

      {/* Master toggle */}
      <div className="rounded-2xl p-6 border mb-5 flex gap-5 items-center"
        style={{
          background: client.kyc_verified ? "linear-gradient(135deg,rgba(107,174,124,0.1),transparent 60%)" : "linear-gradient(135deg,rgba(201,179,107,0.1),transparent 60%)",
          borderColor: client.kyc_verified ? "rgba(107,174,124,0.3)" : "rgba(201,179,107,0.3)",
        }}>
        <div className="w-14 h-14 rounded-2xl grid place-items-center text-2xl"
          style={{ background: client.kyc_verified ? "#6BAE7C" : "#C9B36B", color: client.kyc_verified ? "white" : "#0A0A0B" }}>
          ⚖
        </div>
        <div className="flex-1">
          <div className="text-[11px] tracking-wider uppercase font-medium mb-1"
            style={{ color: client.kyc_verified ? "#6BAE7C" : "#C9B36B" }}>
            {client.kyc_verified ? "احراز کامل" : "تأیید نهایی"}
          </div>
          <div className="text-base font-medium mb-1">احراز هویت این مشتری</div>
          <div className="text-xs text-text-dim leading-relaxed">
            {client.kyc_verified ? "این مشتری به‌طور رسمی احراز شده" : "وقتی فعال کنید، مشتری در پنل خود وضعیت «احراز کامل» می‌بیند"}
          </div>
        </div>
        <button onClick={toggleVerified} disabled={saving}
          className="relative w-16 h-9 rounded-full transition-all"
          style={{
            background: client.kyc_verified ? "linear-gradient(135deg,#6BAE7C,#5a9d6a)" : "#0A0A0B",
            border: `1px solid ${client.kyc_verified ? "#6BAE7C" : "rgba(201,169,97,0.3)"}`,
          }}>
          <div className="absolute top-1 w-7 h-7 rounded-full transition-all"
            style={{
              right: client.kyc_verified ? "calc(100% - 31px)" : "3px",
              background: client.kyc_verified ? "white" : "#8A857B",
            }} />
        </button>
      </div>

      {/* Documents */}
      <div className="rounded-2xl border border-line p-6 mb-5 bg-bg-2">
        <div className="text-sm font-medium mb-4">مدارک ارسالی</div>
        <div className="space-y-3">
          {docTypes.map(t => {
            const doc = docs[t.key];
            return (
              <div key={t.key} className="rounded-xl border border-line bg-bg p-4 flex gap-4 items-center">
                <div className="w-11 h-11 rounded-lg bg-tint-2 grid place-items-center text-accent text-lg">{t.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{t.label}</div>
                  {doc ? (
                    <div className="text-[11px] text-text-dim mt-1">
                      آپلود: {new Date(doc.uploaded_at).toLocaleDateString("fa-IR")} · وضعیت: {doc.status}
                      {doc.rejection_reason && <div className="text-down mt-1">دلیل رد: {doc.rejection_reason}</div>}
                    </div>
                  ) : (
                    <div className="text-[11px] text-text-faint mt-1">آپلود نشده</div>
                  )}
                </div>
                {doc && (
                  <div className="flex gap-1.5">
                    <button onClick={() => setDocStatus(t.key, "approved")}
                      className="px-3 py-1.5 rounded-lg text-[11px] text-white font-semibold"
                      style={{ background: "linear-gradient(135deg,#6BAE7C,#5a9d6a)" }}>
                      ✓ تأیید
                    </button>
                    <button onClick={() => {
                        const reason = prompt("دلیل رد:");
                        if (reason) setDocStatus(t.key, "rejected", reason);
                      }}
                      className="px-3 py-1.5 rounded-lg text-[11px]"
                      style={{ background: "rgba(201,122,107,0.15)", color: "#C97A6B", border: "1px solid rgba(201,122,107,0.3)" }}>
                      ✕ رد
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin message */}
      <div className="rounded-2xl p-5 border border-line-strong bg-tint-2 mb-5">
        <div className="text-[11px] text-accent tracking-wider mb-2 uppercase">پیام عمومی به مشتری</div>
        <div className="text-[11px] text-text-faint mb-3">این پیام در صفحه‌ی KYC مشتری نمایش داده می‌شود</div>
        <textarea value={adminMessage} onChange={e => setAdminMessage(e.target.value)} rows={3}
          placeholder="مثلاً: مدارک شما کافی است، در حال نهایی‌سازی هستیم..."
          className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-accent resize-none" />
        <div className="flex justify-end mt-3">
          <button onClick={saveMessage} disabled={saving}
            className="px-4 py-2 rounded-lg text-xs text-[#0A0A0B] font-semibold"
            style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)" }}>
            {saving ? "..." : "ذخیره پیام"}
          </button>
        </div>
      </div>
    </div>
  );
}
