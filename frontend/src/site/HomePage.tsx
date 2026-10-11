"use client";

import Image from "next/image";
import { defaultSiteContent, parseSiteContent, safeImage, safeLink } from '@/shared/content/site-content';
import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion, MotionConfig, useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";
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

import { content, type Language } from "./content/translations";

const serviceIcons = [Database, BarChart3, Code2, Boxes, Cloud, Network];
const solutionIcons = [Layers3, Network, Database];

function readPreview() {
  if (new URLSearchParams(window.location.search).get('preview') !== '1') return null;
  try {
    const payload = sessionStorage.getItem('ldg-preview');
    return payload ? parseSiteContent(payload) : null;
  } catch {
    return null; // Invalid preview falls back to published content.
  }
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("ar");
  const [siteContent, setSiteContent] = useState(defaultSiteContent);
  const [previewMode, setPreviewMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [inquiryInterest, setInquiryInterest] = useState("");
  const [inquiryKind, setInquiryKind] = useState<"demo" | "quote" | null>(
    null,
  );
  const [formMessage, setFormMessage] = useState("");
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const visualX = useSpring(pointerX, { stiffness: 80, damping: 22 });
  const visualY = useSpring(pointerY, { stiffness: 80, damping: 22 });
  const t = {
    ...content[language],
    hero: [siteContent.heroFirst[language], siteContent.heroSecond[language]],
    intro: siteContent.heroDescription[language],
    about: [siteContent.aboutFirst[language], siteContent.aboutSecond[language]],
    aboutText: siteContent.aboutDescription[language],
    contactText: siteContent.contactDescription[language],
  };
  const currentLogo = safeImage(siteContent.logo) || logoSrc;
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
    let stopped = false;
    let unsubscribe: (() => void) | undefined;
    const preview = readPreview();
    if (preview) {
      // Applied after hydration, which must match the static HTML.
      void Promise.resolve().then(() => {
        if (stopped) return;
        setSiteContent(preview);
        setPreviewMode(true);
      });
      return () => { stopped = true; };
    }
    import('@/services/firebase/content-repository').then(({watchPublished}) => {
      if (stopped) return;
      unsubscribe = watchPublished(setSiteContent, () => { /* Keep the static fallback available offline. */ });
    }).catch(() => {});
    return () => { stopped = true; unsubscribe?.(); };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [language, rtl]);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      ".section-heading, .about-copy, .about-art, .solutions-layout, .industries-intro, .industry-chip, .project-card, .insight-card, .contact-copy, .contact-form",
    );
    if (reducedMotion || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach((target) => {
      target.classList.add("reveal-ready");
      const siblings = target.parentElement?.children;
      const index = siblings ? Array.from(siblings).indexOf(target) : 0;
      target.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 65}ms`);
      observer.observe(target);
    });
    return () => {
      observer.disconnect();
      targets.forEach((target) => target.classList.remove("reveal-ready", "is-revealed"));
    };
  }, [reducedMotion, siteContent.projects, siteContent.partners]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

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
    window.location.href = `mailto:${encodeURIComponent(siteContent.email).replace('%40','@')}?subject=${subject}&body=${body}`;
    setFormMessage("");
  }

  return (
    <MotionConfig reducedMotion="user">
    <main className="site-shell" dir={rtl ? "rtl" : "ltr"}>
      {previewMode ? <div className="site-preview-banner">{rtl ? 'معاينة مسودة غير منشورة' : 'Unpublished draft preview'}<a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/admin`}>{rtl ? 'العودة للإدارة' : 'Back to admin'}</a></div> : null}
      <motion.div className="scroll-progress" style={{ scaleX: reducedMotion ? scrollYProgress : progress }} aria-hidden="true" />
      <header className="site-header">
        <a
          href="#home"
          className="brand-lockup"
          aria-label="Lilian Data Group home"
        >
          <Image
            src={currentLogo}
            alt="LDG"
            width={58}
            height={38}
            className="brand-logo"
            style={{
              width: "var(--brand-logo-width, 58px)",
              height: "var(--brand-logo-height, 38px)",
              maxWidth: 58,
              maxHeight: 38,
              objectFit: "contain",
              flexShrink: 0,
            }}
            priority
          />
          <span className="brand-name">
            {siteContent.companyName}
          </span>
        </a>
        <nav
          className={`main-nav ${menuOpen ? "is-open" : ""}`}
          id="main-navigation"
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
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
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
          onPointerMove={(event) => {
            if (reducedMotion || event.pointerType !== "mouse") return;
            const bounds = event.currentTarget.getBoundingClientRect();
            pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 18);
            pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 14);
          }}
          onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}
        >
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-glow" />
          <div className="data-thread thread-one" />
          <div className="data-thread thread-two" />
          <motion.div className="visual-center" style={{ x: visualX, y: visualY }}>
            <Image
              src={currentLogo}
              alt="Lilian Data Group ribbon logo"
              width={370}
              height={245}
              priority
            />
            <span className="visual-caption">
              DATA · SYSTEMS · DIGITAL TRANSFORMATION
            </span>
          </motion.div>
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

      {siteContent.partners.some(partner => partner.visible) ? <section className="partners-section section-pad" aria-label={rtl ? 'شركاؤنا' : 'Our partners'}><div className="section-kicker"><span/>{rtl ? 'شركاؤنا' : 'Our partners'}</div><div className="partners-grid">{siteContent.partners.filter(partner => partner.visible).map(partner => {
        const inner = <>{safeImage(partner.image) ? <img src={safeImage(partner.image)} alt={partner.name} loading="lazy"/> : <span className="partner-monogram">{partner.name.slice(0,2)}</span>}<b>{partner.name}</b></>;
        return safeLink(partner.url) ? <a className="partner-item" href={safeLink(partner.url)} target="_blank" rel="noopener noreferrer" key={partner.id}>{inner}</a> : <div className="partner-item" key={partner.id}>{inner}</div>;
      })}</div></section> : null}

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
                whileHover={reducedMotion ? undefined : { y: -5 }}
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
                transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
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
          {siteContent.projects.length ? siteContent.projects.filter(project => project.visible).map((project,index) => <a className={`project-card ${index === 0 ? 'project-wide' : ''}`} href={safeLink(project.url) || '#contact'} target={safeLink(project.url) ? '_blank' : undefined} rel={safeLink(project.url) ? 'noopener noreferrer' : undefined} key={project.id}><div className="project-visual cms-project-visual">{safeImage(project.image) ? <img src={safeImage(project.image)} alt={project.title[language]} loading="lazy"/> : <Boxes size={52}/>}<span className="project-tag">{project.category[language]}</span></div><div className="project-caption"><span><small>{String(index+1).padStart(2,'0')} / {project.category[language]}</small><b>{project.title[language]}</b></span><ArrowUpRight size={19}/></div>{project.description[language] ? <p className="cms-project-description">{project.description[language]}</p> : null}</a>) : <>
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
          </>}
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
          <div className="cms-contact-details">
            {siteContent.email ? <a href={`mailto:${encodeURIComponent(siteContent.email).replace('%40','@')}`} dir="ltr">{siteContent.email}</a> : null}
            {siteContent.phone ? <a href={`tel:${siteContent.phone.replace(/[^+0-9]/g,'')}`} dir="ltr">{siteContent.phone}</a> : null}
            {siteContent.whatsapp ? <a href={`https://wa.me/${siteContent.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">{rtl ? 'تواصل عبر واتساب' : 'Contact on WhatsApp'}</a> : null}
            {siteContent.address[language] ? <span>{siteContent.address[language]}</span> : null}
            {safeLink(siteContent.linkedin) ? <a href={safeLink(siteContent.linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a> : null}
            {safeLink(siteContent.facebook) ? <a href={safeLink(siteContent.facebook)} target="_blank" rel="noopener noreferrer">Facebook</a> : null}
          </div>
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
          <Image src={currentLogo} alt="LDG" width={45} height={30} />
          <span className="brand-name">
            {siteContent.companyName}
          </span>
        </a>
        <span className="footer-line">{t.footer}</span>
        <div className="footer-right">
          <span>© {siteContent.companyName}. {t.rights}</span>
          <a href="#home" aria-label={rtl ? "العودة للأعلى" : "Back to top"}>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </footer>
    </main>
    </MotionConfig>
  );
}
