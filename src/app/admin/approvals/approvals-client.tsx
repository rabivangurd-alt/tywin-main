"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ApprovalsClient({ initialPending }: { initialPending: any[] }) {
  const [pending, setPending] = useState(initialPending);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const router = useRouter();

  const handleApprove = async (id: string) => {
    setProcessing(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ status: "active", approved_at: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      setPending(pending.filter(p => p.id !== id));
      router.refresh();
    } else {
      alert("خطا در تأیید: " + error.message);
    }
    setProcessing(null);
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      alert("لطفاً دلیل رد را بنویسید");
      return;
    }
    setProcessing(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        status: "rejected",
        rejection_reason: rejectReason,
      })
      .eq("id", id);

    if (!error) {
      setPending(pending.filter(p => p.id !== id));
      setRejectingId(null);
      setRejectReason("");
      router.refresh();
    } else {
      alert("خطا در رد: " + error.message);
    }
    setProcessing(null);
  };

  if (pending.length === 0) {
    return (
      <div className="rounded-2xl border border-line p-16 text-center"
        style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
        <div className="text-5xl mb-4 text-up">✓</div>
        <div className="text-base font-medium mb-2">همه چی به‌روزه</div>
        <div className="text-xs text-text-dim">هیچ درخواست در انتظاری وجود ندارد</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pending.map(p => (
        <div key={p.id} className="rounded-2xl border border-line p-6"
          style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_auto] gap-6 items-start">
            {/* Action column */}
            <div className="md:order-1 md:border-l md:border-line md:pl-6">
              <div className="text-[10px] text-text-dim tracking-wider mb-2 uppercase">اقدام</div>
              {rejectingId === p.id ? (
                <div className="space-y-2">
                  <textarea
                    value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                    rows={3}
                    placeholder="دلیل رد را بنویسید..."
                    className="w-full bg-bg border border-line rounded-lg px-3 py-2 text-xs outline-none focus:border-accent resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleReject(p.id)}
                      disabled={processing === p.id}
                      className="flex-1 py-2 rounded-lg text-xs font-medium"
                      style={{ background: "rgba(201,122,107,0.15)", color: "#C97A6B", border: "1px solid rgba(201,122,107,0.3)" }}>
                      تأیید رد
                    </button>
                    <button onClick={() => { setRejectingId(null); setRejectReason(""); }}
                      className="flex-1 py-2 rounded-lg text-xs bg-tint border border-line text-text-dim">
                      انصراف
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button onClick={() => handleApprove(p.id)} disabled={processing === p.id}
                    className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg,#6BAE7C,#4A9963)" }}>
                    {processing === p.id ? <span className="spinner" /> : "✓"} تأیید و فعال کردن حساب
                  </button>
                  <button onClick={() => setRejectingId(p.id)}
                    className="w-full py-2.5 rounded-xl font-medium text-sm border"
                    style={{ background: "rgba(201,122,107,0.1)", color: "#C97A6B", borderColor: "rgba(201,122,107,0.3)" }}>
                    ✕ رد درخواست
                  </button>
                </div>
              )}
            </div>

            {/* Profile column */}
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-xl bg-tint-2 grid place-items-center text-accent font-semibold text-xl">
                  {p.full_name?.charAt(0) || "?"}
                </div>
                <div>
                  <div className="text-base font-medium">{p.full_name || "بدون نام"}</div>
                  <div className="text-[11px] text-warning mt-0.5">
                    ⏰ ثبت‌نام {timeAgo(p.created_at)}
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <InfoLine icon="📧" label={p.email} />
                {p.phone && <InfoLine icon="📱" label={p.phone} mono />}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoLine({ icon, label, mono }: { icon: string; label: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-text-faint text-sm">{icon}</span>
      <span className={`text-text ${mono ? "num" : ""}`}>{label}</span>
    </div>
  );
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "چند دقیقه پیش";
  if (hours < 24) return `${hours} ساعت پیش`;
  return `${Math.floor(hours / 24)} روز پیش`;
}
