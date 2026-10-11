export type Localized = { ar: string; en: string };
export type PortfolioItem = {
  id: string;
  title: Localized;
  description: Localized;
  category: Localized;
  image: string;
  url: string;
  visible: boolean;
};
export type Partner = {
  id: string;
  name: string;
  image: string;
  url: string;
  visible: boolean;
};
export type SiteContent = {
  version: 1;
  companyName: string;
  logo: string;
  heroFirst: Localized;
  heroSecond: Localized;
  heroDescription: Localized;
  aboutFirst: Localized;
  aboutSecond: Localized;
  aboutDescription: Localized;
  contactDescription: Localized;
  email: string;
  phone: string;
  whatsapp: string;
  address: Localized;
  linkedin: string;
  facebook: string;
  projects: PortfolioItem[];
  partners: Partner[];
};

export const defaultSiteContent: SiteContent = {
  version: 1,
  companyName: "Lilian Data Group",
  logo: "",
  heroFirst: { ar: "بياناتك تستحق", en: "Your data deserves" },
  heroSecond: { ar: "أن تعمل بذكاء أكبر.", en: "to work smarter." },
  heroDescription: {
    ar: "نصمم ونبني أنظمة رقمية تحول البيانات المعقدة إلى قرارات أوضح، وعمليات أسرع، ونمو يمكن قياسه.",
    en: "We design and build digital systems that turn complex data into clearer decisions, faster operations, and measurable growth.",
  },
  aboutFirst: {
    ar: "التقنية الجيدة لا تضيف تعقيدًا.",
    en: "Good technology doesn’t add complexity.",
  },
  aboutSecond: { ar: "إنها تزيله.", en: "It removes it." },
  aboutDescription: {
    ar: "في Lilian Data Group، نربط الاستراتيجية بالهندسة لنصنع تجارب وأنظمة تخدم العمل الحقيقي. من أول سؤال إلى ما بعد الإطلاق، فريق واحد يفكر معك ويصنع أثرًا يدوم.",
    en: "At Lilian Data Group, we connect strategy with engineering to create experiences and systems built for real work. From the first question to post-launch, one team thinks with you and creates lasting impact.",
  },
  contactDescription: {
    ar: "أخبرنا عن فكرتك أو التحدي الذي تعمل عليه، وسنرتب معك الخطوة المناسبة.",
    en: "Tell us about your idea or challenge, and we’ll find the right next step together.",
  },
  email: "",
  phone: "",
  whatsapp: "",
  address: { ar: "", en: "" },
  linkedin: "",
  facebook: "",
  projects: [],
  partners: [],
};

export function safeLink(value: string): string {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : "";
  } catch {
    return "";
  }
}

export function safeImage(value: string): string {
  if (/^data:image\/(webp|png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(value))
    return value;
  return safeLink(value);
}

function text(value: unknown, maximum = 3000): value is string {
  return typeof value === "string" && value.length <= maximum;
}
function localized(value: unknown): value is Localized {
  if (!value || typeof value !== "object") return false;
  const item = value as Localized;
  return text(item.ar) && text(item.en);
}
export function parseSiteContent(payload: string): SiteContent {
  if (new TextEncoder().encode(payload).length > 800_000)
    throw new Error("المحتوى أكبر من المساحة المتاحة. قلل عدد الصور أو حجمها.");
  const value = JSON.parse(payload) as SiteContent;
  if (
    !value ||
    value.version !== 1 ||
    !text(value.companyName, 100) ||
    !value.companyName.trim()
  )
    throw new Error("اسم الشركة غير صالح.");
  for (const key of [
    "heroFirst",
    "heroSecond",
    "heroDescription",
    "aboutFirst",
    "aboutSecond",
    "aboutDescription",
    "contactDescription",
    "address",
  ] as const) {
    if (!localized(value[key]))
      throw new Error("راجع النصوص العربية والإنجليزية.");
  }
  for (const key of [
    "logo",
    "email",
    "phone",
    "whatsapp",
    "linkedin",
    "facebook",
  ] as const) {
    if (!text(value[key], key === "logo" ? 200_000 : 2000))
      throw new Error("بيانات الموقع غير صالحة.");
  }
  if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email))
    throw new Error("البريد الإلكتروني غير صالح.");
  if (value.whatsapp && !/^\+?[0-9\s()-]{7,25}$/.test(value.whatsapp))
    throw new Error("رقم واتساب غير صالح.");
  if (value.phone && !/^\+?[0-9\s()-]{7,25}$/.test(value.phone))
    throw new Error("رقم الهاتف غير صالح.");
  if (value.logo && !safeImage(value.logo))
    throw new Error("صورة الشعار غير صالحة.");
  for (const key of ["linkedin", "facebook"] as const)
    if (value[key] && !safeLink(value[key]))
      throw new Error("استخدم رابطًا كاملًا يبدأ بـ https://");
  if (
    !Array.isArray(value.projects) ||
    value.projects.length > 40 ||
    !Array.isArray(value.partners) ||
    value.partners.length > 40
  )
    throw new Error("الحد الأقصى 40 عملًا و40 شريكًا.");
  const ids = new Set<string>();
  for (const item of [...value.projects, ...value.partners]) {
    if (
      !item ||
      !text(item.id, 100) ||
      !item.id ||
      ids.has(item.id) ||
      typeof item.visible !== "boolean" ||
      !text(item.url, 2000) ||
      !text(item.image, 200_000)
    )
      throw new Error("بيانات العناصر غير صالحة.");
    ids.add(item.id);
    if (item.url && !safeLink(item.url))
      throw new Error("رابط العنصر غير صالح.");
    if (item.image && !safeImage(item.image))
      throw new Error("صورة العنصر غير صالحة.");
  }
  for (const item of value.projects) {
    if (
      !localized(item.title) ||
      !localized(item.description) ||
      !localized(item.category) ||
      !item.title.ar.trim() ||
      !item.title.en.trim()
    )
      throw new Error("أكمل عنوان العمل بالعربية والإنجليزية.");
  }
  for (const item of value.partners)
    if (!text(item.name, 100) || !item.name.trim())
      throw new Error("أكمل اسم الشريك.");
  return value;
}
