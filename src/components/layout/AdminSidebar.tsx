"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar({
  pendingCount, openTickets
}: { pendingCount: number; openTickets: number }) {
  const pathname = usePathname();
  const isActive = (path: string) =>
    pathname === path || (path !== "/admin" && pathname.startsWith(path));

  const navClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer mb-0.5 transition-colors ${
      isActive(path)
        ? "bg-tint-2 text-accent border border-line-strong"
        : "text-text-dim hover:bg-tint hover:text-text border border-transparent"
    }`;

  return (
    <aside className="sticky top-0 h-screen overflow-y-auto py-6 border-l border-line"
      style={{ background: "linear-gradient(180deg,#0F0F11,#0A0A0B)" }}>
      <Link href="/admin" className="flex items-center gap-3 px-6 pb-6 border-b border-line">
        <div className="w-10 h-10 rounded-xl grid place-items-center text-[#0A0A0B] font-bold text-xl"
          style={{ background: "linear-gradient(135deg,#C9A961,#8B7338)" }}>T</div>
        <div>
          <div className="text-base font-semibold">Tywin Capital</div>
          <div className="text-[9px] text-accent tracking-[2px] mt-0.5">PRIVATE WEALTH</div>
        </div>
      </Link>

      <div className="px-4 py-5">
        <div className="text-[10px] text-text-faint tracking-[2px] px-2 pb-3">منو اصلی</div>
        <Link href="/admin" className={navClass("/admin")}>
          <span>⌂</span> داشبورد
        </Link>
        <Link href="/admin/clients" className={navClass("/admin/clients")}>
          <span>👥</span> مشتری‌ها
        </Link>
        <Link href="/admin/approvals" className={navClass("/admin/approvals")}>
          <span>⏳</span> تأیید ثبت‌نام‌ها
          {pendingCount > 0 && (
            <span className="mr-auto bg-warning text-[#0A0A0B] text-[10px] font-semibold px-1.5 py-0.5 rounded-lg">
              {pendingCount}
            </span>
          )}
        </Link>
      </div>

      <div className="px-4 py-5">
        <div className="text-[10px] text-text-faint tracking-[2px] px-2 pb-3">پشتیبانی</div>
        <Link href="/admin/tickets" className={navClass("/admin/tickets")}>
          <span>💬</span> تیکت‌ها
          {openTickets > 0 && (
            <span className="mr-auto bg-accent text-[#0A0A0B] text-[10px] font-semibold px-1.5 py-0.5 rounded-lg">
              {openTickets}
            </span>
          )}
        </Link>
        <Link href="/admin/reports" className={navClass("/admin/reports")}>
          <span>📊</span> گزارش‌ها
        </Link>
      </div>

      <div className="px-4 py-5">
        <div className="text-[10px] text-text-faint tracking-[2px] px-2 pb-3">سیستم</div>
        <form action="/api/auth/signout" method="POST">
          <button type="submit" className="w-full text-right flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-dim hover:bg-tint hover:text-down">
            <span>⏻</span> خروج
          </button>
        </form>
      </div>
    </aside>
  );
}
