import NewClientForm from "./new-client-form";
import Link from "next/link";

export default function NewClientPage() {
  return (
    <div className="p-7 max-w-[700px] mx-auto">
      <Link href="/admin/clients" className="text-xs text-text-dim hover:text-accent mb-4 inline-block">← بازگشت به لیست مشتری‌ها</Link>
      <div className="mb-7">
        <h1 className="text-2xl font-medium mb-1.5">افزودن مشتری جدید</h1>
        <p className="text-xs text-text-faint">مشتری مستقیماً ساخته و فعال می‌شود — نیازی به تأیید جداگانه نیست</p>
      </div>
      <NewClientForm />
    </div>
  );
}
