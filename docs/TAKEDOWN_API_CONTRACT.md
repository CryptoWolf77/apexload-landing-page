# ApexLoad Takedown API Contract

The website form is a client only. It must not be described as operational until a separately deployed backend has been reviewed and tested.

## Preferred Endpoint

`POST https://api.apexload.org/v1/public/takedown`

Configure the public URL at build time with:

```env
VITE_TAKEDOWN_ENDPOINT=https://api.apexload.org/v1/public/takedown
```

Leave the variable empty until the endpoint is ready. The browser must never contain email-provider, CAPTCHA, or other server secrets.

## Request

Content type: `application/json`

```json
{
  "fullName": "",
  "companyName": "",
  "email": "",
  "reportType": "copyright",
  "originalWorkReference": "",
  "reportedReference": "",
  "explanation": "",
  "goodFaithAccepted": true,
  "accuracyAuthorityAccepted": true,
  "electronicSignature": "",
  "contactConsent": true,
  "language": "en",
  "website": ""
}
```

`website` is the honeypot field. Supported report types are `copyright`, `privacy`, `impersonation`, and `other`.

## Successful Response

Return HTTP `200` or `201` with a non-sensitive reference:

```json
{
  "reference": "APL-LEGAL-2026-000001"
}
```

The frontend reports success only after an HTTPS response with a non-empty `reference` value.

## Required Server Behavior

- Validate and normalize every field again on the server.
- Reject the honeypot, malformed requests, oversized bodies, and excessive submissions.
- Apply IP and abuse-aware rate limits without placing sensitive report content in routine logs.
- Restrict CORS to approved ApexLoad origins and validate the request origin.
- Verify Cloudflare Turnstile server-side only if production credentials are configured.
- Deliver the report to `copyright@apexload.org` through a server-side provider.
- Send a safe acknowledgment only when email delivery is configured and appropriate.
- Return generic public errors without credentials, provider details, stack traces, or sensitive contents.
- Store and delete reports under a documented retention and access-control policy.
- Generate references that reveal no personal information or internal infrastructure.

## Public Errors

Use a generic JSON error body and an appropriate HTTP status such as `400`, `413`, `429`, or `503`. The frontend intentionally does not display backend error details.

## Verification Before Release

1. Confirm production/staging ownership, TLS, CORS, request limits, and rate limits.
2. Submit a controlled test report approved by the owner.
3. Verify delivery, acknowledgment behavior, reference generation, safe logging, and deletion/retention handling.
4. Set `VITE_TAKEDOWN_ENDPOINT` only after the test passes.
