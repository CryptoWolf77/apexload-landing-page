const env = import.meta.env;

function optionalUrl(value) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export const siteConfig = Object.freeze({
  siteUrl: optionalUrl(env.VITE_SITE_URL) || "https://apexload.org",
  androidUrl: optionalUrl(env.VITE_ANDROID_URL),
  iosUrl: optionalUrl(env.VITE_IOS_URL),
  premiumUrl: optionalUrl(env.VITE_PREMIUM_URL),
  supportUrl: optionalUrl(env.VITE_SUPPORT_URL) || "mailto:support@apexload.org",
  privacyUrl: optionalUrl(env.VITE_PRIVACY_URL) || "/privacy",
  termsUrl: optionalUrl(env.VITE_TERMS_URL) || "/terms",
});

export function getPrimaryDownloadUrl() {
  return siteConfig.androidUrl || siteConfig.iosUrl;
}
