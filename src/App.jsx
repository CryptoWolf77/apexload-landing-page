import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Crown,
  Download,
  Facebook,
  FileAudio,
  FileImage,
  Film,
  FolderDown,
  Globe2,
  Image,
  Layers3,
  Library,
  Link as LinkIcon,
  Menu,
  Music,
  Play,
  ShieldCheck,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { AnimatedSection } from "./components/AnimatedSection.jsx";
import { MotionCard } from "./components/MotionCard.jsx";
import { getPrimaryDownloadUrl, siteConfig } from "./config/siteConfig.js";
import translations from "./i18n/translations.js";
import {
  cardItem,
  chipEntrance,
  fadeIn,
  fadeUp,
  heroItem,
  heroSequence,
  heroVisual,
  navbarDrop,
  scaleIn,
  staggerContainer,
} from "./lib/motion.js";

const assets = {
  home: "/assets/apexload-home.jpeg",
  homeSmall: "/assets/apexload-home-360.jpeg",
  quickEditor: "/assets/apexload-quick-editor.jpeg",
  settings: "/assets/apexload-settings.jpeg",
  premiumOverview: "/assets/apexload-premium-overview.jpeg",
  premiumDownloads: "/assets/apexload-premium-downloads.jpeg",
  premiumTools: "/assets/apexload-premium-tools.jpeg",
  premiumPlans: "/assets/apexload-premium-plans.jpeg",
  yahyazlabLogo: "/assets/yahyazlab-logo-compact.png",
};

const navItems = [
  { key: "features", href: "#features" },
  { key: "howItWorks", href: "#how-it-works" },
  { key: "premium", href: "#premium" },
  { key: "faq", href: "#faq" },
];

const featureIcons = {
  links: LinkIcon,
  quality: Film,
  audio: FileAudio,
  detect: Layers3,
  thumbnail: Image,
  batch: FolderDown,
  whatsapp: BadgeCheck,
  editor: Wand2,
  library: Library,
  premium: Crown,
};

const previewMeta = [
  { src: assets.home, variant: "leftTilt" },
  { src: assets.quickEditor, variant: "center" },
  { src: assets.premiumOverview, variant: "rightTilt" },
  { src: assets.settings, variant: "small" },
  { src: assets.premiumDownloads, variant: "small" },
  { src: assets.premiumTools, variant: "small" },
  { src: assets.premiumPlans, variant: "small" },
];

function getInitialLanguage() {
  try {
    return window.localStorage.getItem("apexload-language") === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

function getCurrentPage() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path === "/privacy") return "privacy";
  if (path === "/terms") return "terms";
  return "home";
}

function App() {
  const [language, setLanguage] = useState(getInitialLanguage);
  const prefersReducedMotion = useReducedMotion();
  const t = translations[language];
  const isRtl = language === "ar";
  const page = getCurrentPage();

  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.body.dataset.lang = language;

    try {
      window.localStorage.setItem("apexload-language", language);
    } catch {
      // Language persistence is optional in strict privacy modes.
    }
  }, [language, isRtl]);

  useEffect(() => {
    const pageUrl = page === "home" ? `${siteConfig.siteUrl}/` : `${siteConfig.siteUrl}/${page}`;
    const canonical = document.querySelector('link[rel="canonical"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const description = document.querySelector('meta[name="description"]');

    if (canonical) canonical.setAttribute("href", pageUrl);
    if (ogUrl) ogUrl.setAttribute("content", pageUrl);

    if (page === "home") {
      document.title = "ApexLoad — Social Media Video, Image and Audio Downloader";
      return;
    }

    document.title = `${t.legal[page].title} | ApexLoad`;
    if (description) description.setAttribute("content", t.legal[page].intro);
  }, [page, t]);

  return (
    <div
      className="site-shell min-h-screen"
      lang={language}
      dir={isRtl ? "rtl" : "ltr"}
      data-language={language}
      data-reduced-motion={prefersReducedMotion ? "true" : "false"}
    >
      {page === "home" ? (
        <LandingPage t={t} language={language} setLanguage={setLanguage} />
      ) : (
        <LegalPage page={page} t={t} language={language} setLanguage={setLanguage} />
      )}
    </div>
  );
}

function LandingPage({ t, language, setLanguage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Navbar
        t={t}
        language={language}
        setLanguage={setLanguage}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main>
        <Hero t={t} />
        <PlatformStrip t={t} />
        <Features t={t} />
        <HowItWorks t={t} />
        <Premium t={t} />
        <AppPreview t={t} />
        <WhyApexLoad t={t} />
        <FAQ t={t} />
        <FinalCTA t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}

function Navbar({ t, language, setLanguage, menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 820px)").matches);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 18);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [setMenuOpen]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 820px)");
    const syncMobileState = () => {
      setIsMobile(mobileQuery.matches);
      if (!mobileQuery.matches) setMenuOpen(false);
    };

    syncMobileState();
    mobileQuery.addEventListener("change", syncMobileState);
    return () => mobileQuery.removeEventListener("change", syncMobileState);
  }, [setMenuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const mobileMenuClosed = isMobile && !menuOpen;
  const closedMenuTabIndex = mobileMenuClosed ? -1 : undefined;
  const redirectClosedMenuFocus = (event) => {
    if (!mobileMenuClosed) return;
    event.preventDefault();
    menuButtonRef.current?.focus();
  };

  return (
    <motion.header
      className={`navbar-wrap ${scrolled ? "is-scrolled" : ""}`}
      initial="hidden"
      animate="visible"
      variants={navbarDrop}
    >
      <nav className="navbar section-frame" aria-label={t.nav.label}>
        <a href="#top" className="brand-mark" aria-label={t.nav.homeAria} onClick={closeMenu}>
          <span className="brand-symbol"><Download size={18} /></span>
          <span>ApexLoad</span>
        </a>

        <div
          id="mobile-navigation"
          className="nav-links"
          data-open={menuOpen}
          aria-label={t.nav.menuId}
          aria-hidden={mobileMenuClosed || undefined}
          inert={mobileMenuClosed || undefined}
          onFocusCapture={redirectClosedMenuFocus}
        >
          {navItems.map((item) => (
            <a key={item.key} href={item.href} tabIndex={closedMenuTabIndex} onClick={closeMenu}>{t.nav[item.key]}</a>
          ))}
          <div className="mobile-language">
            <LanguageSwitcher
              t={t}
              language={language}
              setLanguage={setLanguage}
              onChange={closeMenu}
              tabIndex={closedMenuTabIndex}
            />
          </div>
          <DownloadAction className="nav-download mobile-download" t={t} onClick={closeMenu} tabIndex={closedMenuTabIndex} />
        </div>

        <div className="nav-actions">
          <LanguageSwitcher t={t} language={language} setLanguage={setLanguage} />
          <DownloadAction className="nav-download" t={t} />
        </div>

        <button
          className="icon-button menu-button"
          type="button"
          ref={menuButtonRef}
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
    </motion.header>
  );
}

function LanguageSwitcher({ t, language, setLanguage, onChange, tabIndex }) {
  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    onChange?.();
  };

  return (
    <div className="language-switcher" role="group" aria-label={t.language.switchLabel}>
      <Globe2 size={16} aria-hidden="true" />
      <button type="button" tabIndex={tabIndex} className={language === "en" ? "is-active" : ""} aria-pressed={language === "en"} onClick={() => changeLanguage("en")}>
        EN
      </button>
      <span aria-hidden="true">/</span>
      <button type="button" tabIndex={tabIndex} className={language === "ar" ? "is-active" : ""} aria-pressed={language === "ar"} onClick={() => changeLanguage("ar")}>
        AR
      </button>
    </div>
  );
}

function ActionLink({ url, label, unavailableLabel, className = "primary-button", icon: Icon = Download, onClick, tabIndex }) {
  if (!url) {
    return (
      <button className={`${className} is-disabled`} type="button" tabIndex={tabIndex} disabled aria-disabled="true">
        <span>{label}</span>
        <small>{unavailableLabel}</small>
      </button>
    );
  }

  const external = /^https?:\/\//i.test(url);
  return (
    <a className={className} href={url} tabIndex={tabIndex} onClick={onClick} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
      <span>{label}</span>
      <Icon size={18} aria-hidden="true" />
    </a>
  );
}

function DownloadAction({ className, t, onClick, tabIndex }) {
  return (
    <ActionLink
      url={getPrimaryDownloadUrl()}
      label={t.nav.download}
      unavailableLabel={t.common.comingSoon}
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
    />
  );
}

function Hero({ t }) {
  return (
    <motion.section id="top" className="hero-section section-frame" initial="hidden" animate="visible">
      <motion.div className="ambient-grid" aria-hidden="true" variants={fadeIn} />
      <motion.div className="hero-copy" variants={heroSequence}>
        <motion.div className="maker-badge" variants={heroItem}>
          <span>{t.hero.makerPrefix}</span>
          <img src={assets.yahyazlabLogo} alt="YahyazLab" width="154" height="75" />
        </motion.div>
        <motion.div className="eyebrow" variants={heroItem}><Sparkles size={16} />{t.hero.eyebrow}</motion.div>
        <motion.h1 variants={heroItem}>{t.hero.title}</motion.h1>
        <motion.p variants={heroItem}>{t.hero.subtitle}</motion.p>
        <motion.div className="hero-actions" variants={heroItem}>
          <ActionLink url={getPrimaryDownloadUrl()} label={t.hero.download} unavailableLabel={t.common.comingSoon} />
          <a className="secondary-button" href="#features">{t.hero.explore}<ArrowRight size={18} /></a>
        </motion.div>
        <motion.div className="hero-proof" aria-label={t.hero.proofLabel} variants={staggerContainer}>
          {t.hero.proof.map((item) => <motion.span key={item} variants={scaleIn}>{item}</motion.span>)}
        </motion.div>
      </motion.div>

      <motion.div className="hero-visual" variants={heroVisual}>
        <FloatingIcon className="float-video" icon={Film} label={t.hero.floating.video} delay={0.44} />
        <FloatingIcon className="float-music" icon={Music} label={t.hero.floating.audio} delay={0.56} />
        <FloatingIcon className="float-image" icon={Image} label={t.hero.floating.image} delay={0.68} />
        <FloatingIcon className="float-cloud" icon={FileImage} label={t.hero.floating.thumbnail} delay={0.8} />
        <motion.div className="hero-chip chip-mp4" variants={chipEntrance} custom={0.48}>{t.hero.chips.mp4}</motion.div>
        <motion.div className="hero-chip chip-mp3" variants={chipEntrance} custom={0.62}>{t.hero.chips.mp3}</motion.div>
        <motion.div className="hero-chip chip-paste" variants={chipEntrance} custom={0.74}>{t.hero.chips.paste}</motion.div>
        <motion.div className="hero-chip chip-fast" variants={chipEntrance} custom={0.86}><span className="zap-dot"><Layers3 size={13} /></span>{t.hero.chips.fast}</motion.div>
        <PhoneMockup src={assets.home} srcSet={`${assets.homeSmall} 360w, ${assets.home} 738w`} sizes="(max-width: 560px) 78vw, 330px" alt={t.hero.phoneAlt} label={t.hero.phoneLabel} variant="hero" />
      </motion.div>
    </motion.section>
  );
}

function FloatingIcon({ className, icon: Icon, label, delay }) {
  return <motion.div className={`floating-icon ${className}`} aria-label={label} variants={chipEntrance} custom={delay}><Icon size={22} /></motion.div>;
}

function PhoneMockup({ src, srcSet, sizes, alt, label, variant = "center" }) {
  const prefersReducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 180, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 180, damping: 24 });
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-3.5, 3.5]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [3, -3]);
  const animationFrame = useRef();
  const isHero = variant === "hero";

  useEffect(() => () => window.cancelAnimationFrame(animationFrame.current), []);

  const handlePointerMove = (event) => {
    if (!isHero || prefersReducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const frame = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - frame.left) / frame.width - 0.5;
    const y = (event.clientY - frame.top) / frame.height - 0.5;
    window.cancelAnimationFrame(animationFrame.current);
    animationFrame.current = window.requestAnimationFrame(() => {
      pointerX.set(x);
      pointerY.set(y);
    });
  };

  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.figure className={`phone-mockup phone-${variant}`} whileHover={prefersReducedMotion ? undefined : { y: -7 }} onPointerMove={handlePointerMove} onPointerLeave={resetTilt}>
      <motion.div className="phone-frame" style={isHero && !prefersReducedMotion ? { rotateX, rotateY } : undefined}>
        <div className="phone-bezel">
          <div className="phone-notch" aria-hidden="true" />
          <img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            loading={isHero ? "eager" : "lazy"}
            fetchPriority={isHero ? "high" : "auto"}
            decoding="async"
            width="738"
            height="1600"
          />
          <span className="screen-shine" aria-hidden="true" />
        </div>
      </motion.div>
      {label && <figcaption>{label}</figcaption>}
    </motion.figure>
  );
}

function PlatformStrip({ t }) {
  return (
    <AnimatedSection className="platform-section section-frame">
      <motion.div className="section-heading slim" variants={fadeUp}><span className="eyebrow">{t.platforms.eyebrow}</span><h2>{t.platforms.title}</h2><p>{t.platforms.subtitle}</p></motion.div>
      <motion.div className="platform-grid" variants={staggerContainer}>
        {t.platforms.items.map((platform) => (
          <MotionCard key={platform.key} as="div" className="platform-card" hover={{ y: -5, scale: 1.015 }}><PlatformGlyph platformKey={platform.key} /><span>{platform.label}</span></MotionCard>
        ))}
      </motion.div>
    </AnimatedSection>
  );
}

function PlatformGlyph({ platformKey }) {
  if (platformKey === "facebook") return <Facebook size={20} />;
  if (platformKey === "youtube") return <Play size={20} fill="currentColor" />;
  if (platformKey === "tiktok") return <Music size={20} />;
  if (platformKey === "instagram") return <Image size={20} />;
  if (platformKey === "x") return <X size={20} />;
  if (platformKey === "whatsapp") return <BadgeCheck size={20} />;
  if (platformKey === "snapchat") return <Sparkles size={20} />;
  return <Layers3 size={20} />;
}

function Features({ t }) {
  return (
    <AnimatedSection id="features" className="content-section section-frame">
      <motion.div className="section-heading" variants={fadeUp}><span className="eyebrow">{t.features.eyebrow}</span><h2>{t.features.title}</h2><p>{t.features.subtitle}</p></motion.div>
      <motion.div className="feature-grid" variants={staggerContainer}>
        {t.features.items.map((feature) => <FeatureCard key={feature.key} {...feature} icon={featureIcons[feature.key]} />)}
      </motion.div>
    </AnimatedSection>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return <MotionCard className="feature-card"><div className="card-icon"><Icon size={24} /></div><h3>{title}</h3><p>{description}</p></MotionCard>;
}

function HowItWorks({ t }) {
  return (
    <AnimatedSection id="how-it-works" className="content-section section-frame">
      <motion.div className="section-heading" variants={fadeUp}><span className="eyebrow">{t.how.eyebrow}</span><h2>{t.how.title}</h2></motion.div>
      <motion.div className="steps-grid" variants={staggerContainer}>
        {t.how.steps.map((step, index) => <MotionCard className="step-card" key={step.key}><span className="step-number">{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.text}</p></MotionCard>)}
      </motion.div>
    </AnimatedSection>
  );
}

function Premium({ t }) {
  return (
    <AnimatedSection id="premium" className="premium-section section-frame">
      <motion.div className="premium-copy" variants={fadeUp}>
        <span className="eyebrow premium-eyebrow"><Crown size={16} />{t.premium.eyebrow}</span>
        <h2>{t.premium.title}</h2>
        <p>{t.premium.subtitle}</p>
        <div className="premium-status"><BadgeCheck size={18} /><span>{t.premium.status}</span></div>
        <motion.div className="benefit-grid" variants={staggerContainer}>
          {t.premium.benefits.map((benefit) => (
            <motion.div key={benefit.key} className="benefit-item" variants={cardItem}><Check size={17} /><div><strong>{benefit.title}</strong><span>{benefit.detail}</span></div></motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div className="premium-side" variants={scaleIn}>
        <motion.div className="pricing-grid" variants={staggerContainer}>
          {t.premium.plans.map((plan) => (
            <MotionCard className={`pricing-card ${plan.highlighted ? "highlighted" : ""}`} key={plan.key}>
              {plan.highlighted && <span className="best-value">{t.premium.bestValue}</span>}
              <h3>{plan.name}</h3>
              <div className="price-row"><strong>{plan.price}</strong><span>{plan.cadence}</span></div>
              <p>{t.premium.cardText}</p>
              <ActionLink url={siteConfig.premiumUrl} label={plan.cta} unavailableLabel={t.common.comingSoon} className={plan.highlighted ? "primary-button" : "secondary-button"} icon={ArrowRight} />
            </MotionCard>
          ))}
        </motion.div>
        <motion.div className="premium-device-card" variants={scaleIn}>
          <PhoneMockup src={assets.premiumOverview} alt={t.premium.deviceAlt} label={t.premium.deviceLabel} variant="small" />
        </motion.div>
      </motion.div>
    </AnimatedSection>
  );
}

function AppPreview({ t }) {
  const previews = t.previews.items.map((preview, index) => ({ ...preview, ...previewMeta[index] }));
  return (
    <AnimatedSection className="preview-section section-frame">
      <motion.div className="section-heading" variants={fadeUp}><span className="eyebrow">{t.previews.eyebrow}</span><h2>{t.previews.title}</h2><p>{t.previews.subtitle}</p></motion.div>
      <motion.div className="preview-track" variants={staggerContainer}>
        {previews.map((preview) => (
          <MotionCard as="div" className="preview-card" key={preview.key} hover={{ y: -8, rotateX: 1.2, rotateY: -1 }}>
            <PhoneMockup src={preview.src} alt={preview.alt} label={`${preview.title} — ${preview.label}`} variant={preview.variant} />
          </MotionCard>
        ))}
      </motion.div>
    </AnimatedSection>
  );
}

function WhyApexLoad({ t }) {
  return (
    <AnimatedSection className="why-section section-frame">
      <motion.div className="why-copy" variants={fadeUp}><span className="eyebrow">{t.why.eyebrow}</span><h2>{t.why.title}</h2><p>{t.why.subtitle}</p><motion.div className="reason-list" variants={staggerContainer}>{t.why.reasons.map((reason) => <motion.div key={reason} variants={cardItem}><Check size={17} /><span>{reason}</span></motion.div>)}</motion.div></motion.div>
      <MotionCard as="div" className="real-flow-card" variants={scaleIn} hover={{ y: -8, rotateX: 1, rotateY: -1 }}>
        <PhoneMockup src={assets.settings} alt={t.why.deviceAlt} label={t.why.deviceLabel} variant="rightTilt" />
        <div className="flow-note"><ShieldCheck size={22} /><div><strong>{t.why.flowTitle}</strong><span>{t.why.flowText}</span></div></div>
      </MotionCard>
    </AnimatedSection>
  );
}

function FAQ({ t }) {
  const [openKey, setOpenKey] = useState(t.faq.items[0].key);
  const faqItems = useMemo(() => t.faq.items, [t]);

  useEffect(() => {
    if (openKey && !faqItems.some((item) => item.key === openKey)) setOpenKey(faqItems[0]?.key ?? "");
  }, [faqItems, openKey]);

  return (
    <AnimatedSection id="faq" className="faq-section section-frame">
      <motion.div className="section-heading" variants={fadeUp}><span className="eyebrow">{t.faq.eyebrow}</span><h2>{t.faq.title}</h2></motion.div>
      <motion.div className="faq-list" variants={staggerContainer}>
        {faqItems.map((item) => {
          const isOpen = openKey === item.key;
          const buttonId = `faq-button-${item.key}`;
          const panelId = `faq-panel-${item.key}`;
          return (
            <MotionCard className="faq-item" key={item.key} data-open={isOpen} hover={{ y: -3 }}>
              <button id={buttonId} type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenKey(isOpen ? "" : item.key)}>
                <span>{item.question}</span><ChevronDown size={20} aria-hidden="true" />
              </button>
              <div id={panelId} className="faq-answer" role="region" aria-labelledby={buttonId} aria-hidden={!isOpen}><p>{item.answer}</p></div>
            </MotionCard>
          );
        })}
      </motion.div>
    </AnimatedSection>
  );
}

function FinalCTA({ t }) {
  return (
    <AnimatedSection id="download" className="final-cta section-frame" variants={scaleIn}>
      <div className="cta-grid" aria-hidden="true"><span /><span /><span /></div>
      <div><span className="eyebrow">{t.finalCta.eyebrow}</span><h2>{t.finalCta.title}</h2><p>{t.finalCta.subtitle}</p></div>
      <ActionLink url={getPrimaryDownloadUrl()} label={t.finalCta.button} unavailableLabel={t.common.comingSoon} />
    </AnimatedSection>
  );
}

function Footer({ t }) {
  return (
    <AnimatedSection as="footer" className="footer section-frame" variants={fadeUp}>
      <div className="footer-main">
        <div>
          <a href="#top" className="brand-mark"><span className="brand-symbol"><Download size={18} /></span><span>ApexLoad</span></a>
          <p>{t.footer.description}</p>
          <div className="made-by"><span>{t.footer.madeBy}</span><img src={assets.yahyazlabLogo} alt="YahyazLab" loading="lazy" width="154" height="75" /></div>
        </div>
        <div className="footer-links">
          <a href="#features">{t.nav.features}</a><a href="#premium">{t.nav.premium}</a><a href="#faq">{t.nav.faq}</a>
          <a href={siteConfig.privacyUrl}>{t.footer.privacy}</a><a href={siteConfig.termsUrl}>{t.footer.terms}</a><a href={siteConfig.supportUrl}>{t.footer.contact}</a>
        </div>
      </div>
      <div className="footer-legal"><span>{t.footer.copyright}</span><p>{t.footer.disclaimer}</p></div>
    </AnimatedSection>
  );
}

function LegalPage({ page, t, language, setLanguage }) {
  const content = t.legal[page];
  return (
    <>
      <header className="legal-header">
        <div className="section-frame legal-nav">
          <a href="/" className="brand-mark" aria-label={t.nav.homeAria}><span className="brand-symbol"><Download size={18} /></span><span>ApexLoad</span></a>
          <LanguageSwitcher t={t} language={language} setLanguage={setLanguage} />
        </div>
      </header>
      <main className="legal-page section-frame">
        <a className="legal-back" href="/"><ArrowLeft size={18} />{t.legal.backHome}</a>
        <div className="legal-title"><span className="eyebrow"><ShieldCheck size={16} />ApexLoad</span><h1>{content.title}</h1><p>{content.intro}</p><small>{t.legal.updated}</small></div>
        <div className="legal-sections">
          {content.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}
        </div>
        <div className="legal-disclaimer">{t.footer.disclaimer}</div>
      </main>
    </>
  );
}

export default App;
