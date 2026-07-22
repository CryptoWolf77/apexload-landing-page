const REQUEST_TIMEOUT_MS = 15000;
const MAX_REQUEST_BYTES = 24000;

/**
 * @typedef {Object} TakedownReport
 * @property {string} fullName
 * @property {string} companyName
 * @property {string} email
 * @property {string} reportType
 * @property {string} originalWorkReference
 * @property {string} reportedReference
 * @property {string} explanation
 * @property {boolean} goodFaithAccepted
 * @property {boolean} accuracyAuthorityAccepted
 * @property {string} electronicSignature
 * @property {boolean} contactConsent
 * @property {"en"|"ar"} language
 * @property {string} website Honeypot field.
 * @property {string} formStartedAt ISO timestamp captured when the form opens.
 */

export class TakedownRequestError extends Error {
  constructor(code) {
    super(code);
    this.name = "TakedownRequestError";
    this.code = code;
  }
}

function normalizeText(value) {
  return String(value ?? "").replace(/\r\n?/g, "\n").replace(/[\t ]+/g, " ").trim();
}

/** @param {TakedownReport} report */
export function normalizeTakedownReport(report) {
  return {
    fullName: normalizeText(report.fullName),
    companyName: normalizeText(report.companyName),
    email: normalizeText(report.email).toLowerCase(),
    reportType: normalizeText(report.reportType),
    originalWorkReference: normalizeText(report.originalWorkReference),
    reportedReference: normalizeText(report.reportedReference),
    explanation: normalizeText(report.explanation),
    goodFaithAccepted: report.goodFaithAccepted === true,
    accuracyAuthorityAccepted: report.accuracyAuthorityAccepted === true,
    electronicSignature: normalizeText(report.electronicSignature),
    contactConsent: report.contactConsent === true,
    language: report.language === "ar" ? "ar" : "en",
    website: normalizeText(report.website),
    formStartedAt: normalizeText(report.formStartedAt),
  };
}

/**
 * Submit a report only to an explicitly configured HTTPS endpoint.
 * @param {string} endpoint
 * @param {TakedownReport} report
 * @returns {Promise<{reference: string}>}
 */
export async function submitTakedownReport(endpoint, report) {
  if (!endpoint) throw new TakedownRequestError("endpointUnavailable");

  let parsedEndpoint;
  try {
    parsedEndpoint = new URL(endpoint);
  } catch {
    throw new TakedownRequestError("endpointUnavailable");
  }
  if (parsedEndpoint.protocol !== "https:") throw new TakedownRequestError("endpointUnavailable");

  const payload = JSON.stringify(normalizeTakedownReport(report));
  if (new TextEncoder().encode(payload).length > MAX_REQUEST_BYTES) {
    throw new TakedownRequestError("requestTooLarge");
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(parsedEndpoint.href, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: payload,
      signal: controller.signal,
      credentials: "omit",
      mode: "cors",
      referrerPolicy: "strict-origin-when-cross-origin",
    });

    if (!response.ok) throw new TakedownRequestError("requestFailed");
    const result = await response.json().catch(() => ({}));
    if (!result || typeof result.reference !== "string" || !result.reference.trim()) {
      throw new TakedownRequestError("invalidResponse");
    }
    return { reference: result.reference.trim().slice(0, 120) };
  } catch (error) {
    if (error instanceof TakedownRequestError) throw error;
    if (error?.name === "AbortError") throw new TakedownRequestError("timeout");
    throw new TakedownRequestError("networkError");
  } finally {
    window.clearTimeout(timeout);
  }
}
