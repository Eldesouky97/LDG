import type { Metadata } from "next";
import LegalPage from "@/site/LegalPage";

export const metadata: Metadata = {
  title: "شروط الخدمة | Lilian Data Group",
  description: "شروط استخدام منصة LDG Social Command Center التابعة لـ Lilian Data Group.",
};

export default function Page() {
  return <LegalPage kind="terms" />;
}
