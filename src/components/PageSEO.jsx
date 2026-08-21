import { useEffect } from "react";
import { siteConfig } from "../config/siteConfig.js";

const HOME_SEO = {
  title: "ApexLoad — Social Media Video, Image and Audio Downloader",
  description: "Download supported social-media videos, images and audio with smart format detection and Premium tools. ApexLoad is available on Google Play for Android.",
  path: "/",
  indexable: true,
};

function setMeta(selector, attribute, value) {
  const element = document.querySelector(selector);
  if (element && value) element.setAttribute(attribute, value);
}

export function PageSEO({ seo = HOME_SEO, language = "en" }) {
  useEffect(() => {
    const canonicalUrl = new URL(seo.path || "/", `${siteConfig.siteUrl}/`).href;
    const imageUrl = new URL(seo.image || "/og-apexload-v2.png", `${siteConfig.siteUrl}/`).href;
    const title = seo.title;
    const description = seo.description;
    const robots = seo.indexable === false ? "noindex, nofollow" : "index, follow, max-image-preview:large";

    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="robots"]', "content", robots);
    setMeta('link[rel="canonical"]', "href", canonicalUrl);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:image"]', "content", imageUrl);
    setMeta('meta[property="og:locale"]', "content", language === "ar" ? "ar_OM" : "en_US");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", imageUrl);

    let structuredData = document.getElementById("route-structured-data");
    if (seo.path && seo.path !== "/" && seo.indexable !== false) {
      if (!structuredData) {
        structuredData = document.createElement("script");
        structuredData.id = "route-structured-data";
        structuredData.type = "application/ld+json";
        document.head.appendChild(structuredData);
      }
      structuredData.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ApexLoad", item: `${siteConfig.siteUrl}/` },
          { "@type": "ListItem", position: 2, name: title.replace(/ \| ApexLoad$/, ""), item: canonicalUrl },
        ],
      });
    } else {
      structuredData?.remove();
    }
  }, [language, seo]);

  return null;
}
