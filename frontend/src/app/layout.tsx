import type { Metadata } from "next";
import "@fontsource/cairo/400.css";
import "@fontsource/cairo/600.css";
import "@fontsource/cairo/700.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@/site/styles/site.css";

export const metadata: Metadata = {
  title: "Lilian Data Group | البيانات والأنظمة والتحول الرقمي",
  description:
    "نصمم ونبني أنظمة رقمية وحلول بيانات تساعد المؤسسات على اتخاذ قرارات أوضح والنمو بثقة.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
