import { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Copyright,
  FileCheck2,
  FileText,
  Gavel,
  Headphones,
  Mail,
  Scale,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { submitTakedownReport } from "../api/takedownClient.js";
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
import { siteConfig } from "../config/siteConfig.js";
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

const emptyReport = {
  fullName: "",
  companyName: "",
  email: "",
  reportType: "",
  originalWorkReference: "",
  reportedReference: "",
  explanation: "",
  goodFaithAccepted: false,
  accuracyAuthorityAccepted: false,
  electronicSignature: "",
  contactConsent: false,
  website: "",
};

function normalizeForCompare(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function isValidReference(value) {
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed)) return trimmed.length >= 8;
  try {
    return new URL(trimmed).protocol === "https:";
  } catch {
    return false;
  }
}

function validateReport(report, messages) {
  const errors = {};
  const textRule = (name, min, max) => {
    const value = report[name].trim();
    if (!value) errors[name] = messages.required;
    else if (value.length < min) errors[name] = messages.min;
    else if (value.length > max) errors[name] = messages.max;
  };

  textRule("fullName", 2, 120);
  if (report.companyName.trim().length > 160) errors.companyName = messages.max;
  if (!report.email.trim()) errors.email = messages.required;
  else if (!isValidEmail(report.email.trim())) errors.email = messages.email;
  if (!report.reportType) errors.reportType = messages.required;
  textRule("originalWorkReference", 8, 2000);
  textRule("reportedReference", 4, 2000);
  if (!errors.originalWorkReference && !isValidReference(report.originalWorkReference)) errors.originalWorkReference = messages.reference;
  if (!errors.reportedReference && !isValidReference(report.reportedReference)) errors.reportedReference = messages.reference;
  textRule("explanation", 40, 5000);
  textRule("electronicSignature", 2, 120);
  if (!errors.electronicSignature && normalizeForCompare(report.electronicSignature) !== normalizeForCompare(report.fullName)) {
    errors.electronicSignature = messages.signature;
  }
  ["goodFaithAccepted", "accuracyAuthorityAccepted", "contactConsent"].forEach((name) => {
    if (!report[name]) errors[name] = messages.declaration;
  });
  return errors;
}

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

function FormField({ name, label, hint, error, required, children }) {
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;
  return (
    <div className="form-field" data-invalid={Boolean(error)}>
      <label htmlFor={name}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      {children}
      <small id={hintId}>{hint}</small>
      {error && <p className="field-error" id={errorId}><AlertCircle size={15} aria-hidden="true" />{error}</p>}
    </div>
  );
}

function FormStatus({ status, formT, statusRef }) {
  if (!status) return null;
  const isSuccess = status.type === "success";
  const message = isSuccess ? `${formT.status.success} ${status.reference}` : formT.status[status.code];
  return (
    <div className={`form-status ${isSuccess ? "is-success" : "is-error"}`} role={isSuccess ? "status" : "alert"} tabIndex="-1" ref={statusRef}>
      {isSuccess ? <CheckCircle2 size={21} aria-hidden="true" /> : <AlertCircle size={21} aria-hidden="true" />}
      <p>{message}</p>
    </div>
  );
}

function TakedownForm({ legalT, language }) {
  const formT = legalT.form;
  const [report, setReport] = useState(() => ({
    ...emptyReport,
    formStartedAt: new Date().toISOString(),
  }));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const openedAt = useRef(Date.now());
  const lastSuccessFingerprint = useRef("");
  const statusRef = useRef(null);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setReport((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
    if (status) setStatus(null);
  };

  const describedBy = (name) => `${name}-hint${errors[name] ? ` ${name}-error` : ""}`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateReport(report, formT.errors);
    setErrors(validationErrors);
    setStatus(null);
    const firstError = Object.keys(validationErrors)[0];
    if (firstError) {
      window.requestAnimationFrame(() => document.querySelector(`[name="${firstError}"]`)?.focus());
      return;
    }
    if (report.website) {
      setStatus({ type: "error", code: "botDetected" });
      return;
    }
    if (Date.now() - openedAt.current < 3000) {
      setStatus({ type: "error", code: "tooFast" });
      return;
    }

    const payload = { ...report, language };
    const fingerprint = JSON.stringify(payload);
    if (fingerprint === lastSuccessFingerprint.current) return;
    if (!siteConfig.takedownEndpoint) {
      setStatus({ type: "error", code: "localValidated" });
      window.requestAnimationFrame(() => statusRef.current?.focus());
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitTakedownReport(siteConfig.takedownEndpoint, payload);
      lastSuccessFingerprint.current = fingerprint;
      setStatus({ type: "success", reference: result.reference });
    } catch (error) {
      setStatus({ type: "error", code: formT.status[error.code] ? error.code : "requestFailed" });
    } finally {
      setIsSubmitting(false);
      window.requestAnimationFrame(() => statusRef.current?.focus());
    }
  };

  const inputProps = (name) => ({
    id: name,
    name,
    value: report[name],
    onChange: update,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": describedBy(name),
  });

  return (
    <form className="takedown-form" noValidate onSubmit={handleSubmit}>
      <PolicyNotice tone={siteConfig.takedownEndpoint ? "success" : "warning"}>
        {siteConfig.takedownEndpoint ? formT.endpointReady : formT.endpointNotice}
      </PolicyNotice>
      {Object.keys(errors).length > 0 && <p className="form-error-summary" role="alert">{formT.errors.summary}</p>}

      <div className="form-grid">
        <FormField name="fullName" label={formT.fields.fullName.label} hint={formT.fields.fullName.hint} error={errors.fullName} required>
          <input {...inputProps("fullName")} type="text" autoComplete="name" maxLength="120" required />
        </FormField>
        <FormField name="companyName" label={formT.fields.companyName.label} hint={formT.fields.companyName.hint} error={errors.companyName}>
          <input {...inputProps("companyName")} type="text" autoComplete="organization" maxLength="160" />
        </FormField>
        <FormField name="email" label={formT.fields.email.label} hint={formT.fields.email.hint} error={errors.email} required>
          <input {...inputProps("email")} type="email" inputMode="email" autoComplete="email" maxLength="254" required />
        </FormField>
        <FormField name="reportType" label={formT.fields.reportType.label} hint={formT.fields.reportType.hint} error={errors.reportType} required>
          <select {...inputProps("reportType")} required>
            <option value="">{formT.reportTypes.placeholder}</option>
            <option value="copyright">{formT.reportTypes.copyright}</option>
            <option value="privacy">{formT.reportTypes.privacy}</option>
            <option value="impersonation">{formT.reportTypes.impersonation}</option>
            <option value="other">{formT.reportTypes.other}</option>
          </select>
        </FormField>
      </div>

      <FormField name="originalWorkReference" label={formT.fields.originalWorkReference.label} hint={formT.fields.originalWorkReference.hint} error={errors.originalWorkReference} required>
        <textarea {...inputProps("originalWorkReference")} rows="3" maxLength="2000" required />
      </FormField>
      <FormField name="reportedReference" label={formT.fields.reportedReference.label} hint={formT.fields.reportedReference.hint} error={errors.reportedReference} required>
        <textarea {...inputProps("reportedReference")} rows="3" maxLength="2000" required />
      </FormField>
      <FormField name="explanation" label={formT.fields.explanation.label} hint={formT.fields.explanation.hint} error={errors.explanation} required>
        <textarea {...inputProps("explanation")} rows="7" minLength="40" maxLength="5000" required />
      </FormField>

      <fieldset className="declaration-fieldset">
        <legend>{formT.declarationsLegend}</legend>
        {["goodFaithAccepted", "accuracyAuthorityAccepted", "contactConsent"].map((name) => (
          <div className="declaration-row" data-invalid={Boolean(errors[name])} key={name}>
            <input id={name} name={name} type="checkbox" checked={report[name]} onChange={update} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} />
            <label htmlFor={name}>{formT.declarations[name]}</label>
            {errors[name] && <p className="field-error" id={`${name}-error`}>{errors[name]}</p>}
          </div>
        ))}
      </fieldset>

      <FormField name="electronicSignature" label={formT.fields.electronicSignature.label} hint={formT.fields.electronicSignature.hint} error={errors.electronicSignature} required>
        <input {...inputProps("electronicSignature")} type="text" autoComplete="name" maxLength="120" required />
      </FormField>

      <div className="honeypot-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" value={report.website} onChange={update} tabIndex="-1" autoComplete="off" />
      </div>

      <p className="form-privacy">
        <ShieldCheck size={17} aria-hidden="true" />
        <Link to="/privacy">{formT.privacyText}</Link>
      </p>
      <FormStatus status={status} formT={formT} statusRef={statusRef} />
      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? formT.submitting : formT.submit}<Send size={18} aria-hidden="true" />
        </button>
        <a className="secondary-button" href={`mailto:${COPYRIGHT_EMAIL}`}>{formT.emailFallback}<Mail size={18} aria-hidden="true" /></a>
      </div>
    </form>
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
                {isTakedown && section.id === "report-form" && <TakedownForm legalT={legalT} language={language} />}
              </LegalSection>
            ))}
            <LegalContactCard legalT={legalT} isCopyright={isCopyright} />
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
