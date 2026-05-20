export default function AdminTopbar({ profile }: { profile: any }) {
  const initials = profile.full_name?.charAt(0) || "A";
  return (
    <div className="h-16 flex items-center justify-between px-7 sticky top-0 z-10 border-b border-line backdrop-blur-xl"
      style={{ background: "rgba(10,10,11,0.7)" }}>
      <div className="text-sm text-text-dim">پنل مدیریت</div>
      <div className="flex items-center gap-3 px-3 py-1 rounded-xl border border-line bg-tint">
        <div className="text-right">
          <div className="text-[13px] font-medium">{profile.full_name || "ادمین"}</div>
          <div className="text-[10px] text-accent tracking-wider">ADMIN</div>
        </div>
        <div className="w-8 h-8 rounded-lg grid place-items-center text-[#0A0A0B] font-semibold text-sm"
          style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)" }}>
          {initials}
        </div>
      </div>
    </div>
  );
}
