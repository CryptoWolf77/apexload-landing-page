import { Download, Globe2, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";

export function BrandLink({ ariaLabel, onClick, to = "/" }) {
  return (
    <Link to={to} className="brand-mark" aria-label={ariaLabel} onClick={onClick}>
      <span className="brand-symbol"><Download size={18} aria-hidden="true" /></span>
      <span>ApexLoad</span>
    </Link>
  );
}

export function LanguageSwitcher({ t, language, setLanguage, onChange, tabIndex }) {
  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    onChange?.();
  };

  return (
    <div className="language-switcher" role="group" aria-label={t.language.switchLabel}>
      <Globe2 size={16} aria-hidden="true" />
      <button
        type="button"
        tabIndex={tabIndex}
        className={language === "en" ? "is-active" : ""}
        aria-label={t.language.english}
        aria-pressed={language === "en"}
        onClick={() => changeLanguage("en")}
      >
        EN
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        tabIndex={tabIndex}
        className={language === "ar" ? "is-active" : ""}
        aria-label={t.language.arabic}
        aria-pressed={language === "ar"}
        onClick={() => changeLanguage("ar")}
      >
        AR
      </button>
    </div>
  );
}

export function ThemeToggle({ theme, setTheme, label, tabIndex }) {
  const nextTheme = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      className="theme-toggle"
      type="button"
      tabIndex={tabIndex}
      aria-label={label}
      title={label}
      onClick={() => setTheme(nextTheme)}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}
