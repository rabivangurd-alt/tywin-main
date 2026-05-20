"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfileClient({ profile, userId, userEmail }: any) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
  });

  const save = async () => {
    setSaving(true);
    setMsg("");
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: form.full_name, phone: form.phone })
      .eq("id", userId);
    if (error) setMsg("خطا: " + error.message);
    else { setMsg("ذخیره شد ✓"); router.refresh(); }
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const initials = form.full_name?.charAt(0) || "C";
  const kycStatus = profile?.kyc_verified ? "verified" : "pending";

  return (
    <div className="max-w-[900px] mx-auto p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-medium mb-1.5">پروفایل و احراز هویت</h1>
        <p className="text-xs text-text-faint">اطلاعات شخصی و مدارک هویتی</p>
      </div>

      {/* Profile header */}
      <div className="rounded-2xl p-7 border border-line mb-5 flex gap-6 items-center"
        style={{ background: "linear-gradient(135deg,rgba(201,169,97,0.04),transparent),linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
        <div className="w-20 h-20 rounded-2xl grid place-items-center text-[#0A0A0B] font-bold text-3xl"
          style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)" }}>{initials}</div>
        <div className="flex-1">
          <div className="text-xl font-medium">{form.full_name || "بدون نام"}</div>
          <div className="text-sm text-text-dim mt-1">{userEmail}</div>
          <div className="flex gap-2 mt-3">
            {kycStatus === "verified" ? (
              <span className="text-[10px] px-2.5 py-1 rounded font-medium" style={{ background: "rgba(107,174,124,0.12)", color: "#6BAE7C", border: "1px solid rgba(107,174,124,0.3)" }}>
                ✓ احراز هویت تأیید شده
              </span>
            ) : (
              <span className="text-[10px] px-2.5 py-1 rounded font-medium" style={{ background: "rgba(201,179,107,0.12)", color: "#C9B36B", border: "1px solid rgba(201,179,107,0.3)" }}>
                ⚡ احراز هویت در جریان
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Admin message */}
      {profile?.admin_message && (
        <div className="rounded-xl p-4 mb-5 border border-line-strong" style={{ background: "rgba(201,169,97,0.08)" }}>
          <div className="text-[10px] text-accent tracking-wider mb-2 uppercase">پیام از Tywin Capital</div>
          <div className="text-xs leading-relaxed">{profile.admin_message}</div>
        </div>
      )}

      {/* Personal info */}
      <div className="rounded-2xl border border-line p-6 mb-5" style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
        <div className="text-sm font-medium mb-5">اطلاعات شخصی</div>

        <div className="space-y-4">
          <Field label="نام و نام خانوادگی" value={form.full_name} onChange={v => setForm({ ...form, full_name: v })} />
          <Field label="ایمیل" value={userEmail} disabled />
          <Field label="شماره تماس" value={form.phone} onChange={v => setForm({ ...form, phone: v })} ltr />
        </div>

        <div className="flex justify-between items-center mt-6 pt-5 border-t border-line">
          {msg && <div className="text-xs text-up">{msg}</div>}
          <button onClick={save} disabled={saving}
            className="mr-auto px-5 py-2.5 rounded-xl text-[#0A0A0B] font-semibold text-xs"
            style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)" }}>
            {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </div>

      {/* KYC */}
      <KycSection profile={profile} userId={userId} />

      {/* Sign out */}
      <div className="rounded-2xl border border-line p-6 bg-bg-2">
        <div className="text-sm font-medium mb-4">امنیت</div>
        <form action="/api/auth/signout" method="POST">
          <button className="px-5 py-2.5 rounded-xl text-xs border" style={{ borderColor: "rgba(201,122,107,0.3)", color: "#C97A6B", background: "rgba(201,122,107,0.05)" }}>
            خروج از حساب
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, disabled, ltr }: any) {
  return (
    <div>
      <label className="block text-[11px] text-text-dim tracking-wider mb-2 uppercase">{label}</label>
      <input value={value || ""} onChange={e => onChange?.(e.target.value)} disabled={disabled}
        dir={ltr ? "ltr" : undefined} className={ltr ? "text-right" : ""}
        style={{
          width: "100%", background: "#0A0A0B", border: "1px solid rgba(201,169,97,0.12)",
          borderRadius: 10, padding: "12px 14px", color: disabled ? "#5A5852" : "#E8E6E1",
          fontSize: 13, outline: "none",
        }} />
    </div>
  );
}

function KycSection({ profile, userId }: any) {
  const [uploading, setUploading] = useState(false);
  const docs = profile?.kyc_documents || {}; // {id_card, national_id, selfie, address_proof}

  const upload = async (type: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("حجم فایل بیش از 10MB است");
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const path = `${userId}/${type}-${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("proofs").upload(path, file);
    if (error) {
      alert("خطا در آپلود: " + error.message);
    } else {
      const newDocs = { ...docs, [type]: { path, uploaded_at: new Date().toISOString(), status: "pending" } };
      await supabase.from("profiles").update({ kyc_documents: newDocs }).eq("id", userId);
      alert("آپلود شد · در انتظار بررسی ادمین");
      window.location.reload();
    }
    setUploading(false);
  };

  const items = [
    { key: "id_card", icon: "🆔", label: "کارت ملی", desc: "تصویر دو طرف کارت ملی" },
    { key: "national_id", icon: "📄", label: "شناسنامه", desc: "صفحه اول و مشخصات", optional: true },
    { key: "selfie", icon: "🤳", label: "سلفی با مدرک", desc: "عکس شما با کارت ملی" },
    { key: "address_proof", icon: "🏠", label: "اثبات آدرس", desc: "قبض آب/برق/گاز (حداکثر ۳ ماه)", optional: true },
  ];

  return (
    <div className="rounded-2xl border border-line p-6 mb-5" style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
      <div className="mb-5">
        <div className="text-sm font-medium">مدارک هویتی</div>
        <div className="text-[11px] text-text-faint mt-1">می‌توانید هر مدرکی که در دسترس دارید آپلود کنید · تأیید نهایی با تیم ماست</div>
      </div>

      <div className="space-y-3">
        {items.map(item => {
          const doc = docs[item.key];
          return (
            <div key={item.key} className="rounded-xl p-4 border border-line bg-bg flex gap-4 items-center">
              <div className="w-11 h-11 rounded-lg bg-tint-2 grid place-items-center text-accent text-lg">{item.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{item.label}</div>
                  {item.optional && <span className="text-[9px] px-1.5 py-0.5 rounded bg-tint text-text-faint">اختیاری</span>}
                </div>
                <div className="text-xs text-text-dim mt-1">{item.desc}</div>
              </div>
              <div className="flex items-center gap-3">
                {doc ? (
                  <span className="text-[10px] px-2.5 py-1 rounded font-medium"
                    style={{
                      background: doc.status === "approved" ? "rgba(107,174,124,0.12)" : doc.status === "rejected" ? "rgba(201,122,107,0.12)" : "rgba(107,156,201,0.12)",
                      color: doc.status === "approved" ? "#6BAE7C" : doc.status === "rejected" ? "#C97A6B" : "#6B9CC9",
                    }}>
                    {doc.status === "approved" ? "✓ تأیید" : doc.status === "rejected" ? "✕ رد" : "⏳ بررسی"}
                  </span>
                ) : (
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg text-xs text-[#0A0A0B] font-semibold"
                    style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)" }}>
                    + آپلود
                    <input type="file" hidden accept="image/*,application/pdf" disabled={uploading}
                      onChange={e => e.target.files?.[0] && upload(item.key, e.target.files[0])} />
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
