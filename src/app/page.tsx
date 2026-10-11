"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Check,
  ChevronDown,
  Cloud,
  Code2,
  Database,
  Globe2,
  Layers3,
  Menu,
  Network,
  PanelTop,
  Send,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

const logoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ldg-ribbon-logo.webp`;

type Language = "ar" | "en";
const content = {
  ar: {
    nav: ["من نحن", "خدماتنا", "حلولنا", "القطاعات", "مشروعاتنا", "رؤى LDG"],
    talk: "تحدث إلى فريقنا",
    eyebrow: "DATA · SYSTEMS · DIGITAL TRANSFORMATION",
    hero: ["بياناتك تستحق", "أن تعمل بذكاء أكبر."],
    intro:
      "نصمم ونبني أنظمة رقمية تحول البيانات المعقدة إلى قرارات أوضح، وعمليات أسرع، ونمو يمكن قياسه.",
    explore: "اكتشف حلولنا",
    start: "ابدأ محادثة",
    trust: "شريك التقنية لفرق تبني المستقبل",
    heroNote: "من الإشارة إلى القرار، كل شيء متصل.",
    aboutKicker: "نبني ما يأتي بعد ذلك",
    about: ["التقنية الجيدة لا تضيف تعقيدًا.", "إنها تزيله."],
    aboutText:
      "في Lilian Data Group، نربط الاستراتيجية بالهندسة لنصنع تجارب وأنظمة تخدم العمل الحقيقي. من أول سؤال إلى ما بعد الإطلاق، فريق واحد يفكر معك ويصنع أثرًا يدوم.",
    aboutLink: "تعرّف على LDG",
    servicesLabel: "ما نبنيه معك",
    servicesTitle: ["أساس رقمي أقوى.", "مساحة أوسع للنمو."],
    servicesIntro: "خبرات متصلة تغطي دورة التحول الرقمي كاملة.",
    services: [
      [
        "البيانات والتحليلات",
        "حوّل بياناتك إلى صورة واضحة وخطوة واثقة.",
        "DATA & ANALYTICS",
      ],
      [
        "ذكاء الأعمال",
        "مؤشرات ولوحات قيادة تجعل القرار أقرب.",
        "BUSINESS INTELLIGENCE",
      ],
      [
        "تطوير المواقع والتطبيقات",
        "تجارب رقمية سريعة، مصممة للناس والعمل.",
        "WEB & MOBILE",
      ],
      [
        "الأنظمة الإدارية ERP",
        "عمليات مترابطة تنمو مع احتياجات مؤسستك.",
        "ENTERPRISE SYSTEMS",
      ],
      [
        "الحلول السحابية",
        "بنية مرنة وآمنة، جاهزة لما هو قادم.",
        "CLOUD SOLUTIONS",
      ],
      [
        "التحول الرقمي",
        "خارطة طريق عملية من الفكرة إلى أثر ملموس.",
        "DIGITAL TRANSFORMATION",
      ],
    ],
    solutionsLabel: "منتجات LDG",
    solutionsTitle: ["أنظمة تفهم عملك.", "وتتطور معه."],
    solutionsIntro: "حلول برمجية مرنة صممناها لتواجه تحديات العمل اليومية.",
    products: ["مدار", "وصل", "مخزون"],
    productTypes: [
      "إدارة موارد المؤسسات",
      "إدارة الخدمات والعمليات",
      "إدارة المخزون والتوريد",
    ],
    productText: [
      "منصة موحدة تربط المالية والموارد والعمليات في رؤية واحدة.",
      "نظّم الطلبات والفرق وسير العمل من نقطة بداية واحدة.",
      "تحكم في حركة المخزون وتوقع الاحتياج بثقة أكبر.",
    ],
    demo: "اطلب عرضًا توضيحيًا",
    quote: "اطلب عرض سعر",
    discover: "استكشف الحل",
    industriesLabel: "خبرة عبر قطاعات مختلفة",
    industriesTitle: "نبدأ من واقع قطاعك.",
    industries: [
      "اللوجستيات",
      "التجارة",
      "التعليم",
      "التجزئة",
      "الرعاية الصحية",
    ],
    projectsLabel: "أثر يمكن ملاحظته",
    projectsTitle: "من التحدي إلى تغيير حقيقي.",
    projectsText: "نماذج من المساحات التي نصنع فيها فرقًا مع فرق العمل.",
    projectTypes: ["منصة تحليلات", "منظومة تشغيل", "تجربة تجارة رقمية"],
    concept: "نماذج توضيحية",
    insightsLabel: "أفكار تستحق المشاركة",
    insightsTitle: "رؤى من عالم البيانات والتقنية.",
    articles: [
      "من البيانات المتفرقة إلى قرار موحد",
      "ما الذي يجعل التحول الرقمي قابلًا للاستمرار؟",
      "كيف تختار بنية سحابية تناسب نموك؟",
    ],
    read: "اقرأ المقال",
    contactKicker: "الخطوة التالية تبدأ بسؤال",
    contactTitle: ["ما الذي يمكننا", "بناءه معًا؟"],
    contactText:
      "أخبرنا عن فكرتك أو التحدي الذي تعمل عليه، وسنرتب معك الخطوة المناسبة.",
    name: "الاسم",
    namePlaceholder: "كيف نناديك؟",
    email: "البريد الإلكتروني",
    emailPlaceholder: "name@company.com",
    interest: "مهتم بـ",
    choose: "اختر مجالًا",
    message: "نبذة عن مشروعك",
    messagePlaceholder: "ما الذي تريد تحقيقه؟",
    send: "إرسال طلب التواصل",
    formHint: "سيتم فتح رسالة جاهزة في تطبيق البريد لديك.",
    footer: "البيانات · الأنظمة · التحول الرقمي",
    rights: "جميع الحقوق محفوظة.",
    menu: "القائمة",
    close: "إغلاق",
    required: "يرجى إكمال الحقول المطلوبة.",
  },
  en: {
    nav: [
      "About",
      "Services",
      "Solutions",
      "Industries",
      "Projects",
      "Insights",
    ],
    talk: "Talk to our team",
    eyebrow: "DATA · SYSTEMS · DIGITAL TRANSFORMATION",
    hero: ["Your data deserves", "to work smarter."],
    intro:
      "We design and build digital systems that turn complex data into clearer decisions, faster operations, and measurable growth.",
    explore: "Explore solutions",
    start: "Start a conversation",
    trust: "Technology partner to teams building what’s next",
    heroNote: "From signal to decision, everything connected.",
    aboutKicker: "Building what comes next",
    about: ["Good technology doesn’t add complexity.", "It removes it."],
    aboutText:
      "At Lilian Data Group, we connect strategy with engineering to create experiences and systems built for real work. From the first question to post-launch, one team thinks with you and creates lasting impact.",
    aboutLink: "Meet LDG",
    servicesLabel: "What we build together",
    servicesTitle: ["A stronger digital foundation.", "More room to grow."],
    servicesIntro:
      "Connected expertise across the full digital transformation journey.",
    services: [
      [
        "Data & Analytics",
        "Turn your data into clarity and confident next steps.",
        "DATA & ANALYTICS",
      ],
      [
        "Business Intelligence",
        "Signals and dashboards that bring decisions closer.",
        "BUSINESS INTELLIGENCE",
      ],
      [
        "Web & Mobile",
        "Fast digital experiences designed for people and work.",
        "WEB & MOBILE",
      ],
      [
        "Enterprise Systems",
        "Connected operations that grow with your business.",
        "ENTERPRISE SYSTEMS",
      ],
      [
        "Cloud Solutions",
        "Flexible, secure infrastructure ready for what’s next.",
        "CLOUD SOLUTIONS",
      ],
      [
        "Digital Transformation",
        "A practical path from idea to measurable impact.",
        "DIGITAL TRANSFORMATION",
      ],
    ],
    solutionsLabel: "LDG products",
    solutionsTitle: [
      "Systems that understand your business.",
      "And grow with it.",
    ],
    solutionsIntro:
      "Flexible software built to meet the challenges of everyday work.",
    products: ["Madar", "Wasl", "Makhzan"],
    productTypes: [
      "Enterprise resource planning",
      "Service & operations management",
      "Inventory & supply management",
    ],
    productText: [
      "One platform connecting finance, people, and operations in a shared view.",
      "Organize requests, teams, and workflows from one starting point.",
      "Control inventory movement and forecast demand with greater confidence.",
    ],
    demo: "Request a demo",
    quote: "Request a quote",
    discover: "Explore solution",
    industriesLabel: "Experience across industries",
    industriesTitle: "We start with your reality.",
    industries: ["Logistics", "Commerce", "Education", "Retail", "Healthcare"],
    projectsLabel: "Impact you can see",
    projectsTitle: "From challenge to meaningful change.",
    projectsText: "A glimpse of where we make a difference alongside teams.",
    projectTypes: [
      "Analytics platform",
      "Operations system",
      "Digital commerce",
    ],
    concept: "Illustrative concepts",
    insightsLabel: "Ideas worth sharing",
    insightsTitle: "Perspectives on data and technology.",
    articles: [
      "From scattered data to a shared decision",
      "What makes digital transformation last?",
      "How to choose a cloud architecture for growth",
    ],
    read: "Read article",
    contactKicker: "The next step starts with a question",
    contactTitle: ["What could we", "build together?"],
    contactText:
      "Tell us about your idea or challenge, and we’ll find the right next step together.",
    name: "Name",
    namePlaceholder: "What should we call you?",
    email: "Work email",
    emailPlaceholder: "name@company.com",
    interest: "I’m interested in",
    choose: "Choose an area",
    message: "A little about your project",
    messagePlaceholder: "What are you looking to achieve?",
    send: "Send an inquiry",
    formHint: "A ready-to-send message will open in your email app.",
    footer: "DATA · SYSTEMS · DIGITAL TRANSFORMATION",
    rights: "All rights reserved.",
    menu: "Menu",
    close: "Close",
    required: "Please complete the required fields.",
  },
} as const;

const serviceIcons = [Database, BarChart3, Code2, Boxes, Cloud, Network];
const solutionIcons = [Layers3, Network, Database];

export default function Home() {
  const [language, setLanguage] = useState<Language>("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [inquiryInterest, setInquiryInterest] = useState("");
  const [inquiryKind, setInquiryKind] = useState<"demo" | "quote" | null>(
    null,
  );
  const [formMessage, setFormMessage] = useState("");
  const t = content[language];
  const rtl = language === "ar";
  const navIds = [
    "about",
    "services",
    "solutions",
    "industries",
    "projects",
    "insights",
  ];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [language, rtl]);

  function sendInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const name = String(values.get("name") ?? "").trim();
    const email = String(values.get("email") ?? "").trim();
    const interest = String(values.get("interest") ?? "").trim();
    const message = String(values.get("message") ?? "").trim();
    if (!name || !email || !interest || !message) {
      setFormMessage(t.required);
      return;
    }
    const requestType = inquiryKind
      ? rtl
        ? inquiryKind === "demo"
          ? "طلب عرض توضيحي"
          : "طلب عرض سعر"
        : inquiryKind === "demo"
          ? "Demo request"
          : "Quote request"
      : rtl
        ? "طلب تواصل"
        : "New inquiry";
    const subject = encodeURIComponent(`${requestType}: ${interest} - ${name}`);
    const body = encodeURIComponent(
      `${requestType}\n${t.name}: ${name}\n${t.email}: ${email}\n${t.interest}: ${interest}\n\n${message}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setFormMessage("");
  }

  return (
    <main className="site-shell" dir={rtl ? "rtl" : "ltr"}>
      <header className="site-header">
        <a
          href="#home"
          className="brand-lockup"
          aria-label="Lilian Data Group home"
        >
          <Image
            src={logoSrc}
            alt="LDG"
            width={58}
            height={38}
            priority
          />
          <span className="brand-name">
            Lilian <b>Data</b> Group
          </span>
        </a>
        <nav
          className={`main-nav ${menuOpen ? "is-open" : ""}`}
          aria-label={rtl ? "التنقل الرئيسي" : "Main navigation"}
        >
          {t.nav.map((label, index) => (
            <a
              href={`#${navIds[index]}`}
              key={navIds[index]}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            className="mobile-nav-cta"
            href="#contact"
            onClick={() => setMenuOpen(false)}
          >
            {t.talk}
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="language-toggle"
            onClick={() => {
              setLanguage(rtl ? "en" : "ar");
              setInquiryInterest("");
              setInquiryKind(null);
            }}
            type="button"
            aria-label="Switch language"
          >
            <Globe2 size={16} />
            <span>{rtl ? "EN" : "عربي"}</span>
          </button>
          <a className="header-cta" href="#contact">
            {t.talk}
            <ArrowUpRight size={15} />
          </a>
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? t.close : t.menu}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-copy">
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow-dot" />
            {t.eyebrow}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            {t.hero.map((line, i) => (
              <span key={line} className={i ? "gradient-text" : ""}>
                {line}
              </span>
            ))}
          </motion.h1>
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
          >
            {t.intro}
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28 }}
          >
            <a href="#solutions" className="button button-primary">
              {t.explore}
              <ArrowLeft size={17} />
            </a>
            <a href="#contact" className="button button-quiet">
              {t.start}
              <ArrowUpRight size={16} />
            </a>
          </motion.div>
          <div className="hero-trust">
            <span className="trust-rule" />
            {t.trust}
          </div>
        </div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12 }}
        >
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-glow" />
          <div className="data-thread thread-one" />
          <div className="data-thread thread-two" />
          <div className="visual-center">
            <Image
              src={logoSrc}
              alt="Lilian Data Group ribbon logo"
              width={370}
              height={245}
              priority
            />
            <span className="visual-caption">
              DATA · SYSTEMS · DIGITAL TRANSFORMATION
            </span>
          </div>
          <div className="float-card card-analytics">
            <span className="mini-icon">
              <BarChart3 size={18} />
            </span>
            <span>
              <b>
                {rtl ? "رؤية أوضح" : "Clearer insight"}
                <small>{rtl ? "بيانات مترابطة" : "Connected data"}</small>
              </b>
            </span>
            <span className="sparkline" />
          </div>
          <div className="float-card card-cloud">
            <span className="mini-icon cyan">
              <Cloud size={18} />
            </span>
            <span>
              <b>
                {rtl ? "جاهز للتوسع" : "Ready to scale"}
                <small>{rtl ? "بنية مرنة" : "Flexible systems"}</small>
              </b>
            </span>
          </div>
          <div className="visual-note">
            <span className="note-cross">+</span>
            {t.heroNote}
          </div>
        </motion.div>
        <div className="hero-bottom-mark">
          <span>01</span>
          <span className="bottom-mark-line" />
          <span>06</span>
          <ArrowDownLeft size={16} />
        </div>
      </section>

      <section className="about-section section-pad" id="about">
        <div className="about-art" aria-hidden="true">
          <div className="art-grid" />
          <div className="connected-node node-a">
            <Database size={23} />
          </div>
          <div className="connected-node node-b">
            <PanelTop size={23} />
          </div>
          <div className="connected-node node-c">
            <Network size={23} />
          </div>
          <div className="connected-node node-d">
            <Sparkles size={22} />
          </div>
          <div className="art-link link-a" />
          <div className="art-link link-b" />
          <div className="art-link link-c" />
          <span className="art-label label-a">DATA</span>
          <span className="art-label label-b">SYSTEMS</span>
          <span className="art-label label-c">PEOPLE</span>
        </div>
        <div className="about-copy">
          <div className="section-kicker">
            <span />
            {t.aboutKicker}
          </div>
          <h2>
            {t.about.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p>{t.aboutText}</p>
          <a className="text-link" href="#services">
            {t.aboutLink}
            <ArrowLeft size={16} />
          </a>
        </div>
      </section>

      <section className="services-section section-pad" id="services">
        <div className="section-heading">
          <div>
            <div className="section-kicker">
              <span />
              {t.servicesLabel}
            </div>
            <h2>
              {t.servicesTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </div>
          <p>{t.servicesIntro}</p>
        </div>
        <div className="services-grid">
          {t.services.map((service, index) => {
            const Icon = serviceIcons[index];
            return (
              <motion.a
                className="service-item"
                href="#contact"
                key={service[0]}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
              >
                <div className={`service-icon service-icon-${index}`}>
                  <Icon size={23} strokeWidth={1.7} />
                </div>
                <span className="service-en">{service[2]}</span>
                <h3>{service[0]}</h3>
                <p>{service[1]}</p>
                <span className="service-arrow">
                  <ArrowLeft size={16} />
                </span>
              </motion.a>
            );
          })}
        </div>
      </section>

      <section className="solutions-section section-pad" id="solutions">
        <div className="section-heading solutions-heading">
          <div>
            <div className="section-kicker">
              <span />
              {t.solutionsLabel}
            </div>
            <h2>
              {t.solutionsTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </div>
          <p>{t.solutionsIntro}</p>
        </div>
        <div className="solutions-layout">
          <div
            className="solutions-list"
            role="tablist"
            aria-label={t.solutionsLabel}
          >
            {t.products.map((product, index) => {
              const Icon = solutionIcons[index];
              return (
                <button
                  className={`solution-tab ${selectedProduct === index ? "active" : ""}`}
                  key={product}
                  type="button"
                  role="tab"
                  aria-selected={selectedProduct === index}
                  onClick={() => setSelectedProduct(index)}
                >
                  <span className="solution-tab-icon">
                    <Icon size={19} />
                  </span>
                  <span className="solution-tab-copy">
                    <b>{product}</b>
                    <small>{t.productTypes[index]}</small>
                  </span>
                  <ArrowLeft size={17} className="tab-arrow" />
                </button>
              );
            })}
            <div className="solutions-footnote">
              <Check size={15} />
              {rtl
                ? "مصممة لتتكامل مع أنظمتك"
                : "Designed to integrate with your stack"}
            </div>
          </div>
          <div className="solution-showcase" role="tabpanel">
            <div className="showcase-topline">
              <span className="showcase-live">
                <i />
                {rtl ? "منظومة متصلة" : "CONNECTED PLATFORM"}
              </span>
              <span className="showcase-index">
                0{selectedProduct + 1} / 03
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                className="showcase-body"
                key={selectedProduct}
                initial={{ opacity: 0, x: rtl ? -12 : 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: rtl ? 12 : -12 }}
                transition={{ duration: 0.24 }}
              >
                <div className="showcase-copy">
                  <span className="showcase-kicker">
                    {t.productTypes[selectedProduct]}
                  </span>
                  <h3>{t.products[selectedProduct]}</h3>
                  <p>{t.productText[selectedProduct]}</p>
                  <div className="showcase-actions">
                    <a
                      href="#contact"
                      onClick={() => {
                        setInquiryInterest(t.products[selectedProduct]);
                        setInquiryKind("demo");
                      }}
                      className="button button-primary button-small"
                    >
                      {t.demo}
                      <ArrowUpRight size={15} />
                    </a>
                    <a
                      href="#contact"
                      onClick={() => {
                        setInquiryInterest(t.products[selectedProduct]);
                        setInquiryKind("quote");
                      }}
                      className="button button-quiet button-small"
                    >
                      {t.quote}
                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>
                <div className="product-window" aria-hidden="true">
                  <div className="window-top">
                    <span />
                    <span />
                    <span />
                    <div className="window-search" />
                  </div>
                  <div className="window-content">
                    <div className="window-sidebar">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                    <div className="window-dashboard">
                      <div className="window-title">
                        <b>{t.products[selectedProduct]}</b>
                        <span>•••</span>
                      </div>
                      <div className="window-metrics">
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className="window-chart">
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="window-rows">
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <a
              className="showcase-discover"
              href="#contact"
              onClick={() => {
                setInquiryInterest(t.products[selectedProduct]);
                setInquiryKind(null);
              }}
            >
              {t.discover}
              <ArrowLeft size={15} />
            </a>
          </div>
        </div>
      </section>

      <section className="industries-section section-pad" id="industries">
        <div className="industries-intro">
          <div className="section-kicker">
            <span />
            {t.industriesLabel}
          </div>
          <h2>{t.industriesTitle}</h2>
        </div>
        <div className="industry-list">
          {t.industries.map((industry, index) => (
            <div className={`industry-chip industry-${index}`} key={industry}>
              <span className="industry-number">0{index + 1}</span>
              <span className="industry-icon">
                {index === 0 ? (
                  <Network />
                ) : index === 1 ? (
                  <ShoppingBag />
                ) : index === 2 ? (
                  <Sparkles />
                ) : index === 3 ? (
                  <Boxes />
                ) : (
                  <Check />
                )}
              </span>
              <b>{industry}</b>
              <ArrowUpRight className="industry-arrow" size={17} />
            </div>
          ))}
        </div>
      </section>

      <section className="projects-section section-pad" id="projects">
        <div className="section-heading">
          <div>
            <div className="section-kicker">
              <span />
              {t.projectsLabel}
            </div>
            <h2>{t.projectsTitle}</h2>
          </div>
          <p>{t.projectsText}</p>
        </div>
        <div className="project-grid">
          <a className="project-card project-wide" href="#contact">
            <div className="project-visual project-visual-data">
              <div className="project-orbit" />
              <div className="project-bars">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <span className="project-tag">DATA INTELLIGENCE</span>
              <span className="project-dot dot-one" />
              <span className="project-dot dot-two" />
            </div>
            <div className="project-caption">
              <span>
                <small>01 / {t.concept}</small>
                <b>{t.projectTypes[0]}</b>
              </span>
              <ArrowUpRight size={19} />
            </div>
          </a>
          <a className="project-card" href="#contact">
            <div className="project-visual project-visual-system">
              <div className="system-ring ring-one" />
              <div className="system-ring ring-two" />
              <div className="system-core">
                <Boxes size={33} />
              </div>
              <div className="system-node node-one" />
              <div className="system-node node-two" />
              <div className="system-node node-three" />
              <span className="project-tag">CONNECTED OPERATIONS</span>
            </div>
            <div className="project-caption">
              <span>
                <small>02 / {t.concept}</small>
                <b>{t.projectTypes[1]}</b>
              </span>
              <ArrowUpRight size={19} />
            </div>
          </a>
          <a className="project-card" href="#contact">
            <div className="project-visual project-visual-commerce">
              <div className="commerce-window">
                <span />
                <span />
                <span />
                <div className="commerce-product product-one" />
                <div className="commerce-product product-two" />
                <div className="commerce-product product-three" />
              </div>
              <span className="project-tag">DIGITAL EXPERIENCE</span>
            </div>
            <div className="project-caption">
              <span>
                <small>03 / {t.concept}</small>
                <b>{t.projectTypes[2]}</b>
              </span>
              <ArrowUpRight size={19} />
            </div>
          </a>
        </div>
      </section>

      <section className="insights-section section-pad" id="insights">
        <div className="section-heading">
          <div>
            <div className="section-kicker">
              <span />
              {t.insightsLabel}
            </div>
            <h2>{t.insightsTitle}</h2>
          </div>
          <a className="text-link" href="#contact">
            {t.read}
            <ArrowLeft size={16} />
          </a>
        </div>
        <div className="insights-grid">
          {t.articles.map((article, index) => (
            <a className="insight-card" href="#contact" key={article}>
              <div className={`insight-art insight-art-${index}`}>
                <span>
                  {index === 0 ? (
                    <Database />
                  ) : index === 1 ? (
                    <Network />
                  ) : (
                    <Cloud />
                  )}
                </span>
                <small>LDG / INSIGHT 0{index + 1}</small>
              </div>
              <div className="insight-meta">
                <span>{rtl ? "رؤى LDG" : "LDG INSIGHTS"}</span>
                <span>0{index + 1}</span>
              </div>
              <h3>{article}</h3>
              <span className="insight-link">
                {t.read}
                <ArrowLeft size={15} />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="contact-section section-pad" id="contact">
        <div className="contact-copy">
          <div className="section-kicker">
            <span />
            {t.contactKicker}
          </div>
          <h2>
            {t.contactTitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p>{t.contactText}</p>
          <div className="contact-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="contact-tagline">
            <span className="contact-tag-dot" />
            LDG · LET’S BUILD WHAT’S NEXT
          </div>
        </div>
        <form className="contact-form" onSubmit={sendInquiry}>
          <div className="form-row">
            <label>
              {t.name}
              <input
                name="name"
                autoComplete="name"
                placeholder={t.namePlaceholder}
                required
              />
            </label>
            <label>
              {t.email}
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t.emailPlaceholder}
                required
              />
            </label>
          </div>
          <label>
            {t.interest}
            <span className="select-wrap">
              <select
                name="interest"
                value={inquiryInterest}
                onChange={(event) => setInquiryInterest(event.target.value)}
                required
              >
                <option value="" disabled>
                  {t.choose}
                </option>
                <optgroup label={t.solutionsLabel}>
                  {t.products.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={t.servicesLabel}>
                  {t.services.map((service) => (
                    <option key={service[0]} value={service[0]}>
                      {service[0]}
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown size={16} />
            </span>
          </label>
          <label>
            {t.message}
            <textarea
              name="message"
              rows={3}
              placeholder={t.messagePlaceholder}
              required
            />
          </label>
          <div className="form-submit-row">
            <button className="button button-primary" type="submit">
              {t.send}
              <Send size={16} />
            </button>
            <span>{t.formHint}</span>
          </div>
          <AnimatePresence>
            {formMessage && (
              <motion.p
                className="form-message"
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {formMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </section>

      <footer className="site-footer">
        <a href="#home" className="brand-lockup footer-brand">
          <Image src={logoSrc} alt="LDG" width={45} height={30} />
          <span className="brand-name">
            Lilian <b>Data</b> Group
          </span>
        </a>
        <span className="footer-line">{t.footer}</span>
        <div className="footer-right">
          <span>© Lilian Data Group. {t.rights}</span>
          <a href="#home" aria-label={rtl ? "العودة للأعلى" : "Back to top"}>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </footer>
    </main>
  );
}
