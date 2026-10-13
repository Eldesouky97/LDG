// Privacy policy and terms for LDG Social Command Center (social.liliandata.com), the platform
// Lilian Data Group uses to manage its own brands on Facebook and Instagram. Keep this text in sync with
// what the platform actually does (retention values come from its docs/DATABASE.md and SECURITY.md).
import type { Language } from "./translations";

export type LegalSection = { title: string; paragraphs?: string[]; items?: string[] };
export type LegalDocument = { title: string; intro: string; updated: string; sections: LegalSection[] };

export const LEGAL_UPDATED = "2026-10-14";
export const DATA_DELETION_URL = "https://social-api.liliandata.com/meta/data-deletion";

export const privacyPolicy: Record<Language, LegalDocument> = {
  ar: {
    title: "سياسة الخصوصية",
    intro:
      "توضح هذه السياسة كيف تجمع Lilian Data Group البيانات وتستخدمها وتحميها عند تشغيل منصة «LDG Social Command Center» على social.liliandata.com، وهي منصة داخلية ندير بها حسابات علاماتنا التجارية (Lilian Data Group وHome Craft وCockatiel ومراحل) على فيسبوك وإنستجرام.",
    updated: "آخر تحديث",
    sections: [
      {
        title: "البيانات التي نجمعها",
        items: [
          "بيانات أعضاء الفريق: الاسم والبريد الإلكتروني وصورة حساب Google عند تسجيل الدخول، والأدوار والصلاحيات، وسجل الإجراءات داخل المنصة.",
          "بيانات صفحات فيسبوك وحسابات إنستجرام التابعة لعلاماتنا: الاسم والمعرّف والمنشورات وإحصاءات الأداء.",
          "رسائل العملاء المرسلة إلى صفحاتنا وحساباتنا على ماسنجر وإنستجرام: نص الرسالة ومرفقاتها، ومعرّف المرسل لدى Meta، واسمه وصورته العامة إن أتاحتها Meta.",
          "نماذج العملاء المحتملين من إعلاناتنا على Meta: الإجابات التي يرسلها الشخص في النموذج (مثل الاسم والهاتف والبريد).",
          "بيانات حساباتنا الإعلانية: الحملات والمجموعات والإعلانات ومؤشرات الأداء والإنفاق.",
          "رموز الوصول التي تمنحها Meta للمنصة، وتُخزَّن مشفرة ولا تُعرض لأي مستخدم.",
        ],
      },
      {
        title: "كيف نستخدم البيانات",
        items: [
          "نشر المحتوى على صفحاتنا وحساباتنا بعد مراجعته واعتماده من فريقنا.",
          "الرد على رسائل العملاء بواسطة موظفين، ومتابعة الطلبات والعملاء المحتملين.",
          "قياس أداء المحتوى والإعلانات وإعداد التقارير الداخلية.",
          "قد تُستخدم أدوات ذكاء اصطناعي لاقتراح ردود أو تصنيف الرسائل؛ هذه الاقتراحات لا تُرسل إلى العميل إلا بعد مراجعة موظف وموافقته، ولا تُستخدم بياناتك لتدريب نماذج ذكاء اصطناعي.",
          "لا نبيع البيانات الشخصية ولا نستخدمها لأي غرض إعلاني خارج علاماتنا.",
        ],
      },
      {
        title: "مشاركة البيانات",
        paragraphs: [
          "لا نشارك البيانات إلا مع مزودي الخدمة الذين نحتاجهم لتشغيل المنصة، وبالقدر اللازم فقط:",
        ],
        items: [
          "Cloudflare: الاستضافة وقاعدة البيانات وتخزين الملفات وخدمة الذكاء الاصطناعي (Workers AI).",
          "Google Firebase: تسجيل دخول أعضاء الفريق.",
          "Meta Platforms: عبر واجهاتها الرسمية لإرسال المنشورات والردود وقراءة الإحصاءات.",
          "مزودو ذكاء اصطناعي أو بريد إلكتروني إضافيون فقط إذا فعّلناهم صراحةً في إعدادات المنصة.",
        ],
      },
      {
        title: "مدة الاحتفاظ بالبيانات",
        items: [
          "رسائل المحادثات: 365 يومًا ثم تُحذف تلقائيًا.",
          "اقتراحات الذكاء الاصطناعي: 30 يومًا.",
          "إحصاءات الأداء والإعلانات: 400 يوم.",
          "سجل الإجراءات (التدقيق): 365 يومًا.",
          "البيانات الخام الواردة من Meta (Webhooks): 30 يومًا.",
          "العملاء المحتملون: حتى نحذفهم أو يُطلب حذفهم.",
          "النسخ الاحتياطية المشفرة على خوادم Cloudflare: آخر 8 نسخ أسبوعية.",
        ],
      },
      {
        title: "حذف البيانات",
        paragraphs: [
          "إذا أزلت تطبيق «LDG Social» من إعدادات فيسبوك لديك (الإعدادات ← التطبيقات ومواقع الويب)، ترسل لنا Meta طلب حذف تلقائيًا ونحذف رموز الوصول والبيانات المرتبطة بحسابك، ونعطيك رمز تأكيد ورابطًا لمتابعة حالة الطلب.",
          "ويمكنك أيضًا طلب حذف رسائلك أو بياناتك كعميل محتمل بالتواصل معنا عبر البيانات أدناه، وننفذ الطلب خلال 30 يومًا.",
        ],
      },
      {
        title: "حماية البيانات",
        items: [
          "اتصال مشفر (HTTPS) في جميع الأوقات.",
          "تشفير رموز الوصول بمعيار AES-256-GCM.",
          "صلاحيات دقيقة لكل عضو فريق وكل علامة، وسجل لكل إجراء.",
          "لا تُسجَّل رموز الوصول أو نصوص الرسائل أو بيانات العملاء المحتملين في سجلات التشغيل.",
        ],
      },
      {
        title: "حقوقك",
        paragraphs: [
          "يمكنك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها في أي وقت. لا تستهدف المنصة الأطفال دون 13 عامًا. سننشر أي تعديل على هذه السياسة في هذه الصفحة مع تاريخ التحديث.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    intro:
      "This policy explains how Lilian Data Group collects, uses and protects data when operating “LDG Social Command Center” at social.liliandata.com, the internal platform we use to manage our own brands (Lilian Data Group, Home Craft, Cockatiel and Marahil) on Facebook and Instagram.",
    updated: "Last updated",
    sections: [
      {
        title: "Data we collect",
        items: [
          "Team member data: the name, email address and photo of the Google account used to sign in, roles and permissions, and a log of actions in the platform.",
          "Data about our brands' Facebook Pages and Instagram accounts: names, IDs, posts and performance insights.",
          "Customer messages sent to our Pages and accounts on Messenger and Instagram: message text and attachments, the sender's Meta-scoped ID, and their public name and picture when Meta provides them.",
          "Lead forms from our Meta ads: the answers a person submits (such as name, phone and email).",
          "Our ad accounts' data: campaigns, ad sets, ads, performance and spend.",
          "Access tokens granted by Meta, stored encrypted and never shown to any user.",
        ],
      },
      {
        title: "How we use data",
        items: [
          "Publishing content to our Pages and accounts after our team reviews and approves it.",
          "Answering customer messages through our staff and following up on requests and leads.",
          "Measuring content and ad performance and preparing internal reports.",
          "AI tools may suggest replies or classify messages; suggestions are never sent to a customer unless a staff member reviews and approves them, and your data is not used to train AI models.",
          "We do not sell personal data or use it for advertising beyond our own brands.",
        ],
      },
      {
        title: "Sharing",
        paragraphs: ["We share data only with the service providers needed to run the platform, and only as much as needed:"],
        items: [
          "Cloudflare: hosting, database, file storage and AI inference (Workers AI).",
          "Google Firebase: team member sign-in.",
          "Meta Platforms: through its official APIs to publish posts and replies and read insights.",
          "Additional AI or email providers only if we explicitly enable them in the platform settings.",
        ],
      },
      {
        title: "Retention",
        items: [
          "Conversation messages: 365 days, then deleted automatically.",
          "AI suggestions: 30 days.",
          "Performance and ad insights: 400 days.",
          "Activity (audit) log: 365 days.",
          "Raw data received from Meta (webhooks): 30 days.",
          "Leads: until we delete them or deletion is requested.",
          "Backups on Cloudflare servers: the last 8 weekly backups.",
        ],
      },
      {
        title: "Data deletion",
        paragraphs: [
          "If you remove the “LDG Social” app from your Facebook settings (Settings → Apps and Websites), Meta sends us a deletion request automatically; we delete the access tokens and data linked to your account and give you a confirmation code and a link to check the request status.",
          "You can also ask us to delete your messages or lead data by contacting us using the details below; we complete requests within 30 days.",
        ],
      },
      {
        title: "Security",
        items: [
          "Encrypted connections (HTTPS) at all times.",
          "Access tokens encrypted with AES-256-GCM.",
          "Fine-grained permissions per team member and brand, with a log of every action.",
          "Access tokens, message text and lead data are never written to operational logs.",
        ],
      },
      {
        title: "Your rights",
        paragraphs: [
          "You can ask to access, correct or delete your data at any time. The platform is not directed at children under 13. Any change to this policy will be published on this page with its update date.",
        ],
      },
    ],
  },
};

export const termsOfService: Record<Language, LegalDocument> = {
  ar: {
    title: "شروط الخدمة",
    intro:
      "تنظم هذه الشروط استخدام منصة «LDG Social Command Center» على social.liliandata.com، المملوكة لـ Lilian Data Group والمخصصة لإدارة علاماتها التجارية على منصات Meta.",
    updated: "آخر تحديث",
    sections: [
      {
        title: "من يمكنه الاستخدام",
        paragraphs: ["المنصة مخصصة لفريق Lilian Data Group ومن ندعوهم بصلاحيات محددة. الدخول يتم بحساب Google، وكل مستخدم مسؤول عن الحفاظ على حسابه وعدم مشاركته."],
      },
      {
        title: "الاستخدام المقبول",
        items: [
          "استخدام المنصة لإدارة حسابات علاماتنا فقط وبما يتوافق مع شروط Meta وسياسات المنصات والإعلانات.",
          "عدم نشر محتوى مضلل أو أسعار أو عروض غير مؤكدة، وعدم إرسال رسائل مزعجة أو غير مرغوبة.",
          "مراجعة أي محتوى أو رد مقترح بالذكاء الاصطناعي قبل نشره أو إرساله.",
          "عدم محاولة تجاوز الصلاحيات أو الوصول إلى بيانات علامات غير مسموح بها.",
        ],
      },
      {
        title: "المحتوى والإعلانات",
        paragraphs: ["تظل ملكية المحتوى للعلامة صاحبته. لا تنشئ المنصة إعلانات ولا ترفع ميزانيات من تلقاء نفسها؛ أي تعديل على الإعلانات يحتاج موافقة شخص ثانٍ مخوّل."],
      },
      {
        title: "التوفر والمسؤولية",
        paragraphs: ["نعمل على أن تكون المنصة متاحة وآمنة، لكنها تعتمد على خدمات أطراف أخرى (Meta وCloudflare وGoogle) وقد تتوقف مؤقتًا. تُقدَّم المنصة كما هي دون ضمانات إضافية."],
      },
      {
        title: "الخصوصية والتعديلات",
        paragraphs: ["تخضع معالجة البيانات لسياسة الخصوصية المنشورة على هذا الموقع. قد نحدّث هذه الشروط وننشر التعديل في هذه الصفحة مع تاريخه."],
      },
    ],
  },
  en: {
    title: "Terms of Service",
    intro:
      "These terms govern the use of “LDG Social Command Center” at social.liliandata.com, owned by Lilian Data Group and used to manage its brands on Meta platforms.",
    updated: "Last updated",
    sections: [
      {
        title: "Who may use it",
        paragraphs: ["The platform is for the Lilian Data Group team and people we invite with specific permissions. Sign-in uses a Google account; each user is responsible for keeping their account secure and not sharing it."],
      },
      {
        title: "Acceptable use",
        items: [
          "Use the platform only to manage our brands' accounts, in line with Meta's terms and its platform and advertising policies.",
          "Do not publish misleading content or unconfirmed prices or offers, and do not send spam or unwanted messages.",
          "Review any AI-suggested content or reply before it is published or sent.",
          "Do not attempt to bypass permissions or access data of brands you are not allowed to see.",
        ],
      },
      {
        title: "Content and ads",
        paragraphs: ["Content remains owned by its brand. The platform never creates ads or raises budgets on its own; any ad change needs the approval of a second authorized person."],
      },
      {
        title: "Availability and liability",
        paragraphs: ["We work to keep the platform available and secure, but it relies on third-party services (Meta, Cloudflare and Google) and may be temporarily unavailable. It is provided as is, without additional warranties."],
      },
      {
        title: "Privacy and changes",
        paragraphs: ["Data processing follows the privacy policy published on this website. We may update these terms and will publish the change on this page with its date."],
      },
    ],
  },
};

export const legalChrome: Record<Language, { back: string; contactTitle: string; contactFallback: string; deletionLabel: string; switchLabel: string; privacy: string; terms: string }> = {
  ar: {
    back: "العودة إلى الموقع",
    contactTitle: "التواصل معنا",
    contactFallback: "يمكنك التواصل معنا عبر قسم «تواصل معنا» في الصفحة الرئيسية.",
    deletionLabel: "رابط طلبات حذف البيانات من Meta",
    switchLabel: "English",
    privacy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
  },
  en: {
    back: "Back to the website",
    contactTitle: "Contact us",
    contactFallback: "You can reach us through the Contact section on the home page.",
    deletionLabel: "Meta data deletion callback",
    switchLabel: "العربية",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
  },
};
