import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tywin Capital",
  description: "Private Wealth Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
