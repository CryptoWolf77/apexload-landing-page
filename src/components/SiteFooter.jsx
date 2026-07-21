import { Link } from "react-router-dom";
import { BrandLink } from "./SiteControls.jsx";

const logo = "/assets/yahyazlab-logo-compact.png";

export function SiteFooter({ t, legalT }) {
  const policyLinks = [
    ["/privacy", legalT.footer.privacy],
    ["/terms", legalT.footer.terms],
    ["/acceptable-use", legalT.footer.acceptableUse],
    ["/copyright", legalT.footer.copyright],
    ["/takedown", legalT.footer.takedown],
    ["/support", legalT.footer.support],
    ["/legal", legalT.footer.legal],
  ];

  return (
    <footer className="footer section-frame">
      <div className="footer-main">
        <div>
          <BrandLink ariaLabel={t.nav.homeAria} to="/#top" />
          <p>{t.footer.description}</p>
          <div className="made-by">
            <span>{t.footer.madeBy}</span>
            <img src={logo} alt="YahyazLab" loading="lazy" width="154" height="75" />
          </div>
        </div>
        <nav className="footer-links" aria-label={legalT.common.policies}>
          <Link to="/#features">{t.nav.features}</Link>
          <Link to="/#premium">{t.nav.premium}</Link>
          <Link to="/#faq">{t.nav.faq}</Link>
          {policyLinks.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
        </nav>
      </div>
      <div className="footer-legal">
        <span>{t.footer.copyright}</span>
        <p>{t.footer.disclaimer}</p>
      </div>
    </footer>
  );
}
