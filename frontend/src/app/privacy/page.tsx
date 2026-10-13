import type { Metadata } from "next";
import LegalPage from "@/site/LegalPage";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | Lilian Data Group",
  description: "سياسة خصوصية منصة LDG Social Command Center التابعة لـ Lilian Data Group.",
};

export default function Page() {
  return <LegalPage kind="privacy" />;
}
