# Property Check — minimal update, 12 November 2026

Implemented locally on `codex/property-check-minimal`, based on production commit `2bdd144cdcaa1cc9a2a4a02037adc744e75ae989`. NOT deployed or pushed.

## Requested changes

Removed Property Listing URL from all four localized forms, including label, placeholder, validation, generated content, submitted form data, normalized server lead data and notification email. Obsolete extra fields from an old client are ignored rather than rejecting an otherwise valid new inquiry.

Changed only the English header navigation label to Property Check. Desktop and mobile both retain `/en/igalawrealestateduediligence/`. English desktop text is kept on one line without reducing any font size. Turkish, Chinese and Arabic navigation wording and destinations are unchanged.

No other form fields, requirements, conditional behavior, consent, privacy copy, email recipient, subject mapping, provider configuration or delivery code were changed.

## Verification

- 91 backend assertions passed with the existing approved local mock infrastructure. Includes valuation and diligence requests, recipient info@igalawfirm.com, retained phone/WeChat fields, listing exclusion, failure/retry handling, duplicate prevention and validation.
- 32 browser-flow/consent assertions passed.
- Both valuation and diligence requests completed successfully through the real local handler in browser tests with mocked Resend/Redis. Diligence used email-only contact; valuation retained mandatory telephone and location, optional WeChat account alternative and valuation purpose.
- English navigation measured at 1440px: element height 20.625px equals one line of text. Mobile menu at 390px displays Property Check and preserves the original URL.
- Four language routes loaded; no listing input remained, and no horizontal overflow was observed at 390px.
- All 237 full SEO records are byte-equivalent as JSON values: titles, descriptions, canonicals, hreflang, robots and structured data unchanged. Redirects unchanged; no routes added or removed.
- All generated page HTML is identical to production after normalizing ONLY the requested English header text replacement and removal of the listing field's label/input block. This protects H1, legal content, FAQs, internal links, author information, official references and other service content.
- All localization JSON values are identical after excluding the two removed field/error keys and the requested English nav value. No privacy/consent wording changed.

## Email delivery limit

No real emails were sent for this un-deployed revision, and no clients were contacted. The existing local test infrastructure confirmed notification construction and successful/failed provider responses. Current development environment has no Resend/Redis server credentials, so independent inbox delivery for the changed template cannot be claimed. The previously deployed system's production acceptance tests remain historical evidence only, not proof of this revision's inbox delivery. An actual delivery check requires those existing credentials securely available to the development environment, or a separately approved deployment followed by the authorized fictional test to info@igalawfirm.com.

## Modified files

- `api/property-review.js`
- `property-review-content.js` (generated)
- `property-review-forms.js`
- `property-review.css`
- `review/property-review/render.js`
- `review/property-review/en.json`
- `review/property-review/tr.json`
- `review/property-review/zh.json`
- `review/property-review/ar.json`
- `scripts/test-property-review-api.cjs`
- `scripts/test-property-review-browser.cjs`
- `scripts/test-property-review-delivery.cjs`

Verification artifacts: this report, `checks.json`, `sample-notification.txt`, desktop/mobile screenshots. No unrelated application source files modified.
