"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewClientForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const genPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let p = "";
    for (let i = 0; i < 10; i++) p += chars[Math.floor(Math.random() * chars.length)];
    setForm({ ...form, password: p });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!form.full_name || !form.email || !form.password) {
      setError("نام، ایمیل و رمز عبور الزامی است");
      return;
    }
    if (form.password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setError("نشست شما منقضی شده — دوباره وارد شوید");
      setLoading(false);
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-create-client`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "خطا در ساخت مشتری");
        setLoading(false);
        return;
      }

      setSuccess(`مشتری «${form.full_name}» با موفقیت ساخته شد ✓`);
      setLoading(false);

      // Redirect to the new client's detail page after a moment
      setTimeout(() => {
        router.push(`/admin/clients/${result.user_id}`);
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError("خطا در ارتباط: " + String(err));
      setLoading(false);
    }
  };

  const inp = "w-full bg-bg border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent";
  const lbl = "block text-[11px] text-text-dim tracking-wider mb-2 uppercase";

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line p-7"
      style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>

      {error && (
        <div className="mb-5 p-3.5 rounded-lg text-xs text-down border"
          style={{ background: "rgba(201,122,107,0.1)", borderColor: "rgba(201,122,107,0.3)" }}>
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 p-3.5 rounded-lg text-xs border"
          style={{ background: "rgba(107,174,124,0.1)", borderColor: "rgba(107,174,124,0.3)", color: "#6BAE7C" }}>
          {success} — در حال انتقال...
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className={lbl}><span className="text-accent">*</span> نام و نام خانوادگی</label>
          <input className={inp} value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        </div>

        <div>
          <label className={lbl}><span className="text-accent">*</span> ایمیل</label>
          <input type="email" dir="ltr" className={inp + " text-right"} value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="client@example.com" />
        </div>

        <div>
          <label className={lbl}>شماره تماس</label>
          <input type="tel" dir="ltr" className={inp + " text-right"} value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09xxxxxxxxx" />
        </div>

        <div>
          <label className={lbl}><span className="text-accent">*</span> رمز عبور</label>
          <div className="flex gap-2">
            <input dir="ltr" className={inp + " text-right flex-1"} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="حداقل ۸ کاراکتر" />
            <button type="button" onClick={genPassword}
              className="px-4 rounded-xl text-xs border border-line-strong bg-tint text-accent whitespace-nowrap">
              تولید خودکار
            </button>
          </div>
          <div className="text-[10px] text-text-faint mt-2">
            این رمز را به مشتری بدهید تا بتواند وارد شود. بعداً می‌تواند تغییرش دهد.
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-7 pt-5 border-t border-line">
        <button type="submit" disabled={loading}
          className="px-6 py-3 rounded-xl text-[#0A0A0B] font-semibold text-sm"
          style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)" }}>
          {loading ? "در حال ساخت..." : "ساخت و فعال‌سازی مشتری"}
        </button>
      </div>
    </form>
  );
}
