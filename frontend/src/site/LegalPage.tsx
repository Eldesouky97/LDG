"use client";

import { useEffect, useState } from "react";
import { defaultSiteContent, safeLink } from "@/shared/content/site-content";
import { DATA_DELETION_URL, LEGAL_UPDATED, legalChrome, privacyPolicy, termsOfService } from "./content/legal";
import type { Language } from "./content/translations";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Privacy policy or terms page. Contact details come from the published site content (admin-editable). */
export default function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const [language, setLanguage] = useState<Language>("ar");
  const [siteContent, setSiteContent] = useState(defaultSiteContent);
  const rtl = language === "ar";
  const doc = (kind === "privacy" ? privacyPolicy : termsOfService)[language];
  const chrome = legalChrome[language];

  useEffect(() => {
    let stopped = false;
    let unsubscribe: (() => void) | undefined;
    import("@/services/firebase/content-repository")
      .then(({ watchPublished }) => {
        if (stopped) return;
        unsubscribe = watchPublished(setSiteContent, () => {
          /* The static fallback stays visible offline. */
        });
      })
      .catch(() => {});
    return () => {
      stopped = true;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [language, rtl]);

  const address = siteContent.address[language];
  const linkedin = safeLink(siteContent.linkedin);
  const hasContact = Boolean(siteContent.email || siteContent.phone || address);

  return (
    <main className="legal-page" dir={rtl ? "rtl" : "ltr"}>
      <header className="legal-header">
        <a href={`${base}/`} className="legal-back">
          {chrome.back}
        </a>
        <nav className="legal-nav" aria-label={doc.title}>
          <a href={`${base}/privacy`} aria-current={kind === "privacy" ? "page" : undefined}>
            {chrome.privacy}
          </a>
          <a href={`${base}/terms`} aria-current={kind === "terms" ? "page" : undefined}>
            {chrome.terms}
          </a>
          <button type="button" className="legal-language" onClick={() => setLanguage(rtl ? "en" : "ar")}>
            {chrome.switchLabel}
          </button>
        </nav>
      </header>

      <article className="legal-article">
        <p className="legal-eyebrow">{siteContent.companyName} · LDG Social Command Center</p>
        <h1>{doc.title}</h1>
        <p className="legal-updated">
          {doc.updated}: <time dateTime={LEGAL_UPDATED}>{LEGAL_UPDATED}</time>
        </p>
        <p className="legal-intro">{doc.intro}</p>

        {doc.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.items ? (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section>
          <h2>{chrome.contactTitle}</h2>
          {hasContact ? (
            <ul className="legal-contact">
              {siteContent.email ? (
                <li>
                  <a href={`mailto:${siteContent.email}`} dir="ltr">
                    {siteContent.email}
                  </a>
                </li>
              ) : null}
              {siteContent.phone ? (
                <li>
                  <a href={`tel:${siteContent.phone.replace(/\s+/g, "")}`} dir="ltr">
                    {siteContent.phone}
                  </a>
                </li>
              ) : null}
              {address ? <li>{address}</li> : null}
              {linkedin ? (
                <li>
                  <a href={linkedin} rel="noopener noreferrer" target="_blank" dir="ltr">
                    LinkedIn
                  </a>
                </li>
              ) : null}
            </ul>
          ) : (
            <p>
              {chrome.contactFallback}{" "}
              <a href={`${base}/#contact`}>liliandata.com</a>
            </p>
          )}
          {kind === "privacy" ? (
            <p className="legal-deletion">
              {chrome.deletionLabel}:{" "}
              <code dir="ltr">{DATA_DELETION_URL}</code>
            </p>
          ) : null}
        </section>
      </article>
    </main>
  );
}
