export const LEGAL_LAST_UPDATED = "2026-07-15";

export const LEGAL_ROUTES = Object.freeze([
  { key: "privacy", path: "/privacy", indexable: true },
  { key: "terms", path: "/terms", indexable: true },
  { key: "acceptableUse", path: "/acceptable-use", indexable: true },
  { key: "copyright", path: "/copyright", indexable: true },
  { key: "takedown", path: "/takedown", indexable: true },
  { key: "support", path: "/support", indexable: true },
  { key: "dataDeletion", path: "/data-deletion", indexable: true, updated: "2026-08-08" },
  { key: "legal", path: "/legal", indexable: true },
]);

export const LEGAL_ROUTE_MAP = Object.freeze(
  Object.fromEntries(LEGAL_ROUTES.map((route) => [route.path, route])),
);

export const SUPPORT_EMAIL = "support@apexload.org";
export const COPYRIGHT_EMAIL = "copyright@apexload.org";

export function formatLegalDate(language, date = LEGAL_LAST_UPDATED) {
  return new Intl.DateTimeFormat(language === "ar" ? "ar-OM" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
