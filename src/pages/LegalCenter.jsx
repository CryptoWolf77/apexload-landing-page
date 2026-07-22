import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  ChevronDown,
  Copyright,
  FileCheck2,
  Gavel,
  Headphones,
  Mail,
  Scale,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { PageSEO } from "../components/PageSEO.jsx";
import { SiteFooter } from "../components/SiteFooter.jsx";
import { BrandLink, LanguageSwitcher, ThemeToggle } from "../components/SiteControls.jsx";
import {
  COPYRIGHT_EMAIL,
  formatLegalDate,
  LEGAL_LAST_UPDATED,
  LEGAL_ROUTE_MAP,
  LEGAL_ROUTES,
  SUPPORT_EMAIL,
} from "../config/legalConfig.js";
import legalTranslations from "../i18n/legalTranslations.js";

const routeIcons = {
  privacy: ShieldCheck,
  terms: FileCheck2,
  acceptableUse: Scale,
  copyright: Copyright,
  takedown: Gavel,
  support: Headphones,
  legal: BookOpen,
};

function LegalHeader({ marketingT, legalT, language, setLanguage, theme, setTheme }) {
  return (
    <header className="legal-header">
      <nav className="section-frame legal-nav" aria-label={marketingT.nav.label}>
        <BrandLink ariaLabel={marketingT.nav.homeAria} />
        <div className="legal-nav-actions">
          <Link className="legal-nav-link" to="/support">{legalT.footer.support}</Link>
          <Link className="legal-nav-link" to="/legal">{legalT.footer.legal}</Link>
          <ThemeToggle
            theme={theme}
            setTheme={setTheme}
            label={theme === "dark" ? legalT.common.themeToLight : legalT.common.themeToDark}
          />
          <LanguageSwitcher t={marketingT} language={language} setLanguage={setLanguage} />
        </div>
      </nav>
    </header>
  );
}

function Breadcrumbs({ legalT, title }) {
  return (
    <nav className="breadcrumbs" aria-label={legalT.common.breadcrumbsLabel}>
      <ol>
        <li><Link to="/">{legalT.common.home}</Link></li>
        <li><Link to="/legal">{legalT.common.policies}</Link></li>
        <li aria-current="page">{title}</li>
      </ol>
    </nav>
  );
}

function LegalTableOfContents({ sections, title }) {
  return (
    <nav className="legal-toc" aria-label={title}>
      <strong>{title}</strong>
      <ol>
        {sections.map((section, index) => (
          <li key={section.id}>
            <a href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function PolicyNotice({ children, tone = "info" }) {
  if (!children) return null;
  return (
    <aside className={`policy-notice policy-notice-${tone}`}>
      <AlertCircle size={20} aria-hidden="true" />
      <p>{children}</p>
    </aside>
  );
}

function LegalSection({ section, index, children }) {
  return (
    <section className="legal-content-section" id={section.id}>
      <div className="section-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
      <div>
        <h2>{section.title}</h2>
        {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {section.bullets.length > 0 && (
          <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
        )}
        {children}
        <PolicyNotice tone={section.id.includes("prohibited") ? "warning" : "info"}>{section.notice}</PolicyNotice>
      </div>
    </section>
  );
}

function LegalContactCard({ legalT, isCopyright = false }) {
  const email = isCopyright ? COPYRIGHT_EMAIL : SUPPORT_EMAIL;
  return (
    <address className="legal-contact-card">
      <div className="legal-contact-icon"><Mail size={22} aria-hidden="true" /></div>
      <div>
        <strong>{legalT.common.contactTitle}</strong>
        <span>{email}</span>
      </div>
      <a className="secondary-button" href={`mailto:${email}`}>
        {isCopyright ? legalT.common.contactCopyright : legalT.common.contactSupport}
        <Send size={17} aria-hidden="true" />
      </a>
    </address>
  );
}

function RelatedPages({ legalT, currentKey }) {
  const preferred = currentKey === "support"
    ? ["privacy", "terms", "legal"]
    : currentKey === "copyright" || currentKey === "takedown"
      ? ["copyright", "takedown", "privacy"]
      : ["legal", "acceptableUse", "support"];
  return (
    <nav className="related-pages" aria-label={legalT.common.relatedTitle}>
      <h2>{legalT.common.relatedTitle}</h2>
      <div>
        {preferred.filter((key) => key !== currentKey).map((key) => {
          const route = LEGAL_ROUTES.find((item) => item.key === key);
          return <Link key={key} to={route.path}>{legalT.routes[key].title}<ArrowRight size={16} aria-hidden="true" /></Link>;
        })}
      </div>
    </nav>
  );
}

function PlatformList({ platforms }) {
  return (
    <ul className="support-platforms">
      {platforms.map((platform) => <li key={platform.key}>{platform.label}</li>)}
    </ul>
  );
}

function SupportFaq({ items }) {
  const [openId, setOpenId] = useState("");
  return (
    <div className="support-faq">
      {items.map((item) => {
        const open = openId === item.id;
        const buttonId = `support-faq-${item.id}`;
        const panelId = `${buttonId}-panel`;
        return (
          <div className="support-faq-item" key={item.id} data-open={open}>
            <h3>
              <button id={buttonId} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpenId(open ? "" : item.id)}>
                <span>{item.question}</span><ChevronDown size={19} aria-hidden="true" />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open}><p>{item.answer}</p></div>
          </div>
        );
      })}
    </div>
  );
}

function TakedownEmailPanel({ legalT }) {
  const emailT = legalT.emailReport;
  const mailto = `mailto:${COPYRIGHT_EMAIL}?subject=${encodeURIComponent(emailT.subject)}`;

  return (
    <section className="takedown-email-panel" aria-labelledby="email-report-title">
      <header className="email-panel-header">
        <span className="email-panel-icon"><Mail size={24} aria-hidden="true" /></span>
        <div>
          <span className="email-panel-badge">{emailT.badge}</span>
          <h3 id="email-report-title">{emailT.title}</h3>
        </div>
      </header>

      <p className="email-panel-intro">{emailT.description}</p>

      <div className="email-channel-row">
        <a className="primary-button email-report-button" href={mailto}>
          {emailT.cta}<Send size={18} aria-hidden="true" />
        </a>
        <div className="email-address-block">
          <span>{emailT.emailLabel}</span>
          <a href={`mailto:${COPYRIGHT_EMAIL}`}>{COPYRIGHT_EMAIL}</a>
        </div>
      </div>

      <div className="email-report-checklist">
        <h4>{emailT.checklistTitle}</h4>
        <ol>
          {emailT.checklist.map((item) => <li key={item}>{item}</li>)}
        </ol>
      </div>

      <aside className="email-safety-note">
        <AlertCircle size={20} aria-hidden="true" />
        <div>
          <strong>{emailT.safetyTitle}</strong>
          <p>{emailT.safetyText}</p>
        </div>
      </aside>

      <div className="email-panel-footer">
        <p><ShieldCheck size={17} aria-hidden="true" /><Link to="/privacy">{emailT.privacyLink}</Link></p>
        <p>{emailT.expectation}</p>
      </div>
    </section>
  );
}

function LegalIndex({ legalT }) {
  const cards = LEGAL_ROUTES.filter((route) => route.key !== "legal");
  return (
    <div className="legal-index-grid">
      {cards.map((route) => {
        const Icon = routeIcons[route.key];
        const card = legalT.legalCards[route.key];
        return (
          <Link className={`legal-index-card ${route.key === "support" ? "is-support" : ""}`} to={route.path} key={route.key}>
            <span className="legal-card-icon"><Icon size={23} aria-hidden="true" /></span>
            <span className="legal-card-type">{route.key === "support" ? legalT.common.supportResource : legalT.common.policyResource}</span>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <span className="legal-card-action" aria-hidden="true"><ArrowRight size={18} /></span>
          </Link>
        );
      })}
    </div>
  );
}

function ContentPage({ route, content, legalT, marketingT, language }) {
  const isSupport = route.key === "support";
  const isTakedown = route.key === "takedown";
  const isCopyright = route.key === "copyright" || isTakedown;
  return (
    <>
      <main id="main-content" className="legal-page section-frame" tabIndex="-1" data-route-focus>
        <Breadcrumbs legalT={legalT} title={content.title} />
        <header className="legal-hero">
          <span className="eyebrow"><ShieldCheck size={16} aria-hidden="true" />{isSupport ? legalT.common.helpEyebrow : legalT.common.pageEyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
          <time dateTime={LEGAL_LAST_UPDATED}>{legalT.common.updatedLabel}: {formatLegalDate(language)}</time>
        </header>

        <div className="legal-reader">
          <aside className="legal-sidebar"><LegalTableOfContents sections={content.sections} title={legalT.common.tocTitle} /></aside>
          <article className="legal-article">
            {content.sections.map((section, index) => (
              <LegalSection section={section} index={index} key={section.id}>
                {isSupport && section.id === "platforms" && <PlatformList platforms={marketingT.platforms.items} />}
                {isSupport && section.id === "faq" && <SupportFaq items={legalT.supportFaq} />}
                {isTakedown && section.id === "email-report" && <TakedownEmailPanel legalT={legalT} />}
              </LegalSection>
            ))}
            {!isTakedown && <LegalContactCard legalT={legalT} isCopyright={isCopyright} />}
            <RelatedPages legalT={legalT} currentKey={route.key} />
            <a className="back-to-top" href="#main-content"><ArrowUp size={17} aria-hidden="true" />{legalT.common.backTop}</a>
          </article>
        </div>
      </main>
    </>
  );
}

function NotFoundPage({ legalT }) {
  const DirectionArrow = document.documentElement.dir === "rtl" ? ArrowLeft : ArrowRight;
  return (
    <main id="main-content" className="not-found-page section-frame" tabIndex="-1" data-route-focus>
      <div className="not-found-code" aria-hidden="true">404</div>
      <span className="eyebrow"><AlertCircle size={16} aria-hidden="true" />{legalT.notFound.eyebrow}</span>
      <h1>{legalT.notFound.title}</h1>
      <p>{legalT.notFound.intro}</p>
      <div className="not-found-actions">
        <Link className="primary-button" to="/">{legalT.notFound.homeAction}<DirectionArrow size={18} aria-hidden="true" /></Link>
        <Link className="secondary-button" to="/legal">{legalT.notFound.legalAction}</Link>
      </div>
    </main>
  );
}

export default function LegalCenter({ language, setLanguage, theme, setTheme, marketingT }) {
  const location = useLocation();
  const legalT = legalTranslations[language];
  const route = LEGAL_ROUTE_MAP[location.pathname.replace(/\/$/, "") || "/"];
  const content = route ? legalT.routes[route.key] : null;
  const seo = useMemo(() => route
    ? { title: content.seoTitle, description: content.seoDescription, path: route.path, indexable: route.indexable }
    : { title: legalT.notFound.seoTitle, description: legalT.notFound.seoDescription, path: location.pathname, indexable: false },
  [content, legalT, location.pathname, route]);

  return (
    <>
      <PageSEO seo={seo} language={language} />
      <LegalHeader marketingT={marketingT} legalT={legalT} language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} />
      {route?.key === "legal" ? (
        <main id="main-content" className="legal-page legal-index-page section-frame" tabIndex="-1" data-route-focus>
          <Breadcrumbs legalT={legalT} title={content.title} />
          <header className="legal-hero">
            <span className="eyebrow"><BookOpen size={16} aria-hidden="true" />{legalT.common.pageEyebrow}</span>
            <h1>{content.title}</h1><p>{content.intro}</p>
            <time dateTime={LEGAL_LAST_UPDATED}>{legalT.common.updatedLabel}: {formatLegalDate(language)}</time>
          </header>
          <LegalIndex legalT={legalT} />
        </main>
      ) : route ? (
        <ContentPage route={route} content={content} legalT={legalT} marketingT={marketingT} language={language} />
      ) : (
        <NotFoundPage legalT={legalT} />
      )}
      <SiteFooter t={marketingT} legalT={legalT} />
    </>
  );
}
