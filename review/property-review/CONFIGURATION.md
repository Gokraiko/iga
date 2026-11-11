# Review status and required configuration

Publication authorized by the user on 2026-11-11 for live review with rollback available. No new provider, database, CRM or paid service was introduced.

## Existing server infrastructure

The new `/api/property-review` handler uses the same approved Resend sender and recipient as `/api/contact`, and the existing Upstash/Redis integration already used by `/api/article-views`.

Required server-only environment variables:
- `RESEND_API_KEY`
- `LEAD_EMAIL_FROM`
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, or existing `KV_REST_API_URL` / `KV_REST_API_TOKEN` aliases.

Do not put these values in frontend files, chat, source control or screenshots. Production configuration was documented by the earlier form setup, but this development environment does not have the credentials. No current real delivery has been asserted.

When those existing secrets are securely available in the local development process environment, run:

```sh
node scripts/test-property-review-delivery.cjs --send-real-test-emails
```

This authorized test sends exactly five fictional test leads to info@igalawfirm.com. Then verify each provider ID in the existing Resend dashboard and confirm receipt in the destination mailbox. API acceptance alone is not inbox delivery. The user explicitly authorized live review before these remaining checks; verify production acceptance after deployment. Inbox delivery and the privacy/consent review remain separately tracked.

## Privacy review still required

The visible notice in the development form is a draft summary, not an approved KVKK notice. The firm's existing notice/policy was requested in chat and was not supplied. Before publication, confirm the legal identity of the data controller, applicable processing grounds, recipients/processors and any international-transfer arrangements, the actual retention periods, and the rights/contact procedure. Update all four source translations to match the approved text. The acknowledgement is not marketing consent or blanket consent to processing.

Technical retention added here: rate-limit HMAC keys expire after 10 minutes; receipt digests and server timestamps expire after 23 hours. No lead bodies, names, email addresses, phone numbers, listing URLs or messages are stored in Redis. Email provider/mailbox retention is governed by the firm's existing policy and has not been invented or changed.

## Analytics

Existing GTM and GA infrastructure is reused. New events are suppressed unless the existing consent manager exposes `window.igaConsent.analytics === true`. No consent manager or verified consent signal was found in the repository, so new events remain OFF until this is connected to the actual approved consent state. No new tracking service was added.

Allowed event dimensions: service, purpose, budget, language. No personal fields, listing URLs, messages or full page URLs are included. The full form carries `data-clarity-mask` for the existing Clarity recording integration. Review existing GTM auto-capture rules before enabling new events; existing global trackers were not reconfigured by this task.

## Operational handling

Success appears only after Resend returns an email ID. On a timeout or failure the form keeps its data and provides retry and direct-contact instructions. Stable signed challenges, Redis receipt reservations and Resend idempotency keys prevent duplicate processing of unchanged retries. Edited requests use a new challenge. No unsent inquiry is falsely marked successful; unaccepted requests are not queued in a new database.

Provider failures log only an event name and random submission ID. Existing Resend delivery logs and mailbox handling are the mechanism for investigating bounces/delays. The team should regularly review failed delivery states and use existing provider retry/resend controls. No new notification forwarding or third-party access was configured.

## Legal wording

New copy distinguishes legal due diligence, valuation coordination and preliminary eligibility assessment. It does not promise a valuation amount, price, completion time, investment outcome or citizenship. Attorney approval remains required for the final website wording under the firm's professional obligations.

Reference sources:
- https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-
- https://www.kvkk.gov.tr/Icerik/6765/AYDINLATMA-YUKUMLULUGUNUN-YERINE-GETIRILMESI-HAKKINDA-KAMUOYU-DUYURUSU
- https://www.barobirlik.org.tr/Haberler/tbb-reklam-yasagi-yonetmeligi-nde-onemli-degisiklikler-84947
- https://resend.com/docs/dashboard/emails/idempotency-keys
- https://resend.com/docs/dashboard/emails/introduction
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking
