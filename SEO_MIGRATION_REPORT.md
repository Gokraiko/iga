# IGA Law Firm — Legacy URL migration cleanup

Date: 2026-10-15. Scope: deployed to production with user authorization on 2026-10-15. Source release: `9b2546d`. WWW domain configuration updated to Production; project-level 301 redirects are active.

## Architecture and audit findings

- Plain JavaScript + Node.js VM-based static prerenderer (`generate-static.js`); no Next.js, React/Vite, package.json, package lint runner or framework router.
- Vercel serves `dist`; `vercel.json` controls native HTTP redirects. `app.js` defines page paths; the build writes the complete body and SEO head into each HTML document.
- 208 canonical pages: 15 base pages + 37 articles in EN/TR/ZH/AR. Existing current routes are preserved, including valid `/en/igalawlegalconsultancy/` and other similarly named service routes.
- Existing canonical domain is `https://igalawfirm.com`. HTML canonical, title, description, OG, hreflang and JSON-LD already render at build time.
- Existing redirects covered 13 unprefixed pages and used an unsafe `/post/:slug/` wildcard. Localized legacy aliases were missing. Global `trailingSlash: true` added a hop before legacy redirects.
- Real HTTP baseline: all 208 current canonical pages returned **200 with the expected canonical**, without redirect hops. 579 start URLs checked; 329 failed the new acceptance criteria before deployment (missing localized redirects, redirect chains, and unknown-post redirects). See `SEO_MIGRATION_LIVE_BASELINE.json` for every status and Location header. These are pre-change production observations, not evidence of post-change deployment.
- `/tr/igalawpracticeareas/` currently returns 404. `/igalawpracticeareas` currently adds a slash, then redirects to `/en/services/`.
- WWW currently returns 308 to apex **preserving path and query**. It is not serving an independent Wix page in the HTTP checks. Search retrieval still contains cached Wix pages and an old Chinese address; cached search snippets must not be confused with current origin responses.

## Implemented changes

- `legacy-url-map.json`: 182 explicit legacy path entries (including protective language variants and encoded/decoded localized slugs); every destination is a verified current canonical page. Slash and no-slash forms are handled independently, giving **364 legacy 301 rules**.
- `scripts/generate-redirects.js`: generates native Vercel redirects from the map and canonical manifest. `vercel.json` now contains **783 rules**: 364 legacy rules, 416 current-page slash/index.html normalization rules, one root index.html rule, one temporary root language entry, and one WWW host rule.
- Removed the wildcard `/post/*` redirect. Only individually mapped articles redirect. Unknown posts and unmapped routes fall through to a real **404**; no homepage dumping or SPA fallback.
- Removed automatic trailing-slash normalization. Explicit no-slash aliases for actual canonical pages preserve the existing URL structure while avoiding the extra slash hop for old paths.
- Absolute redirect destinations go directly to final apex canonical URLs. Vercel's high-level redirects preserve query strings. WWW host matching captures the entire path, including trailing slash. See domain prerequisite below.
- `generate-static.js`: creates a simple `404.html` with `noindex,follow`, without changing any current page layout. The root fallback HTML no longer has meta refresh/JS redirect. Actual `/` routing remains native HTTP 307 to `/en/`, as before.
- Existing hash-link compatibility in `app.js` remains. URL fragments are never sent to the server; that browser-only compatibility is not used for any legacy HTTP SEO redirect.
- `app.js`: adds the existing Bebek PostalAddress to the single `#organization` LegalService/Organization entity. Adds explicit canonical `url` and `@id` to BlogPosting. Regenerated `seo-config.json`; only structuredData fields changed.

## Canonical, hreflang, sitemap, robots and internal links

- No current canonical changes required. All 208 pages self-canonicalize to apex; no current canonical `/post/` articles exist in the manifest or sitemap.
- All pages retain reciprocal EN/TR/zh-CN/AR and English x-default links. Every alternate points directly to a canonical generated page. Arabic remains `dir="rtl"`.
- Sitemap retains exactly the 208 canonical pages, without duplicate/legacy/redirect URLs. `robots.txt` remains `Allow: /` with the apex sitemap reference. Legacy paths are not blocked.
- Rendered anchor audit found **zero** legacy, redirected, WWW or missing internal page targets. No internal navigation changes were necessary. The 25 `source` fields in imported `blog-posts-data.js` are historical provenance, not rendered links; preserved intentionally.
- Source, active HTML and WPBakery export search found no Esentepe, Büyükdere, Ferko Signature or Şişli address. Current visible address already uses Bebek across all languages. Missing structured-data address was corrected; historical records were not rewritten.
- No legal content, translations, imagery, visible design, read counter API or contact forms changed.

## 404 / 410 policy

- No evidence-backed deletion candidate was found that justifies 410. No existing current content was deleted.
- Unknown URLs now retain native Vercel 404 with the custom error body. In particular, nonexistent `/post/<slug>` no longer redirects to another nonexistent URL.
- Example synthetic acceptance probes: `/post/iga-migration-missing-article`, `/post/iga-migration-missing-article/`, `/tr/iga-migration-missing-page/`. These are tests, not claimed historical URLs.

## Production verification — completed

After release `9b2546d` and the WWW setting update, the full live audit completed with **579 checks and zero deviations**: all 208 current URLs return direct HTTP 200 with the expected canonical; all mapped old path variants return one permanent redirect to the correct canonical 200 page; missing routes return direct 404; WWW path and query preservation passes. `SEO_MIGRATION_LIVE_RESULTS.json` contains all observed hops. The reader API also returns 200; the live Chinese homepage has five head hreflang links and the Bebek structured address, with no old address.

## Verification and release workflow

```sh
node generate-static.js
python3 scripts/audit-migration.py
# After an authorized deployment, run against that deployment / production:
python3 scripts/audit-migration.py --live https://igalawfirm.com
```

Local audit passed: 208 complete HTML pages; canonical/hreflang reciprocity; language/RTL; address/entity uniqueness; article canonical schema URL; internal anchors; sitemap membership; robots access; every migration destination; no redirect graph cycles or chains; preserved language intent. JavaScript syntax checks and `git diff --check` are also run. No package-based lint suite exists.

The HTTP audit uses GET without JavaScript, never submits forms and does not increment reader counts. It records initial status, every Location hop, final status/URL, and canonical for current pages. The local audit validates build/configuration, **not Vercel edge execution**. New HTTP redirects and unknown-page behavior must pass the live mode after deployment.

Always run the build locally and include the resulting `vercel.json` when publishing: Vercel reads project configuration before the remote build. The generator is also invoked by the build to keep future canonical routes in sync. The generator fails if a legacy source becomes a current page or a destination disappears.

## Required manual / release actions

1. **WWW routing completed:** `www.igalawfirm.com` now connects to Production in this same project. The previous dashboard-level 308 redirect was removed. Project rules return a direct 301 to the final apex canonical destination. Both domains show Valid Configuration. DNS was unchanged. Verified `/tr/igalawpracticeareas?migration=1` on WWW returns 301 directly to `https://igalawfirm.com/tr/services/?migration=1`.
2. Source release `9b2546d` is deployed. `SEO_MIGRATION_LIVE_BASELINE.json` remains the historical pre-change snapshot; post-deployment results are recorded separately in `SEO_MIGRATION_LIVE_RESULTS.json`.
3. No authenticated Search Console, backlinks, access logs or complete Wix URL export was available in this task. Inventory covers repository imports, existing redirects and public indexed results; it cannot establish every historical URL or backlink. Add any additional URLs from GSC/Wix to the explicit map after content matching.
4. Public old blog-page-2 snippets mention additional articles (bank deposit vs BES 2025, fastest approvals, REIF/VCIF roadmap and risks). No exact retrievable old URL/body was available for all of these; do not invent URLs or mark them 410. Review against the original Wix export before deciding on mapping/restoration.
5. After successful release, submit the canonical sitemap in Search Console and inspect key old/new pairs. Search engines must recrawl; no immediate deindexing or ranking guarantee is made.

## Sources used for route discovery and implementation

- Repository `blog-posts-data.js`, original `vercel.json`, historical SEO inventories, generated `seo-config.json`.
- Public indexed Wix results: `/igalawpracticeareas`, `/tr/igalawpracticeareas`, `/igalawblog/page/2`, article titles/URLs including localized renunciation and Chinese company-owner work permit.
- [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json): native statusCode, host conditions and undefined trailingSlash behavior.
- [Vercel query preservation](https://vercel.com/kb/guide/how-do-i-perform-vercel-redirects-based-on-query-strings).
- [Vercel routing compiler](https://github.com/vercel/vercel/blob/main/packages/routing-utils/src/superstatic.ts): strict, case-sensitive source matching.

## Migration map

Every row also covers the same path without the trailing slash. Root-level old URLs use English. Localized variants use their corresponding language. Encoded and decoded Unicode spellings are separately listed for explicit coverage. No mapping is justified solely by the URL looking old.

| Old URL | Action | New URL | Reason |
|---|---|---|---|
| `/igainvestment/` | 301 | `/en/turkish-citizenship-by-investment/` | Legacy page / matching language equivalent |
| `/en/igainvestment/` | 301 | `/en/turkish-citizenship-by-investment/` | Legacy page / matching language equivalent |
| `/tr/igainvestment/` | 301 | `/tr/yatirim-yoluyla-turk-vatandasligi/` | Legacy page / matching language equivalent |
| `/zh/igainvestment/` | 301 | `/zh/tuerqi-touzi-ruji/` | Legacy page / matching language equivalent |
| `/ar/igainvestment/` | 301 | `/ar/turkish-citizenship-by-investment/` | Legacy page / matching language equivalent |
| `/igaturkishcitizenshipbyinvestment/` | 301 | `/en/turkish-citizenship-by-investment-lawyer/` | Legacy page / matching language equivalent |
| `/en/igaturkishcitizenshipbyinvestment/` | 301 | `/en/turkish-citizenship-by-investment-lawyer/` | Legacy page / matching language equivalent |
| `/tr/igaturkishcitizenshipbyinvestment/` | 301 | `/tr/yatirim-yoluyla-turk-vatandasligi-avukati/` | Legacy page / matching language equivalent |
| `/zh/igaturkishcitizenshipbyinvestment/` | 301 | `/zh/tuerqi-touzi-ruji-lushi/` | Legacy page / matching language equivalent |
| `/ar/igaturkishcitizenshipbyinvestment/` | 301 | `/ar/turkish-citizenship-by-investment-lawyer/` | Legacy page / matching language equivalent |
| `/igalawpracticeareas/` | 301 | `/en/services/` | Legacy page / matching language equivalent |
| `/en/igalawpracticeareas/` | 301 | `/en/services/` | Legacy page / matching language equivalent |
| `/tr/igalawpracticeareas/` | 301 | `/tr/services/` | Legacy page / matching language equivalent |
| `/zh/igalawpracticeareas/` | 301 | `/zh/services/` | Legacy page / matching language equivalent |
| `/ar/igalawpracticeareas/` | 301 | `/ar/services/` | Legacy page / matching language equivalent |
| `/igalawblog/` | 301 | `/en/blog/` | Legacy page / matching language equivalent |
| `/en/igalawblog/` | 301 | `/en/blog/` | Legacy page / matching language equivalent |
| `/tr/igalawblog/` | 301 | `/tr/blog/` | Legacy page / matching language equivalent |
| `/zh/igalawblog/` | 301 | `/zh/blog/` | Legacy page / matching language equivalent |
| `/ar/igalawblog/` | 301 | `/ar/blog/` | Legacy page / matching language equivalent |
| `/map/` | 301 | `/en/contact/` | Legacy page / matching language equivalent |
| `/en/map/` | 301 | `/en/contact/` | Legacy page / matching language equivalent |
| `/tr/map/` | 301 | `/tr/contact/` | Legacy page / matching language equivalent |
| `/zh/map/` | 301 | `/zh/contact/` | Legacy page / matching language equivalent |
| `/ar/map/` | 301 | `/ar/contact/` | Legacy page / matching language equivalent |
| `/igalawworkpermit/` | 301 | `/en/igalawworkpermit/` | Legacy page / matching language equivalent |
| `/igalawcorporatelaw/` | 301 | `/en/igalawcorporatelaw/` | Legacy page / matching language equivalent |
| `/igalawlegalconsultancy/` | 301 | `/en/igalawlegalconsultancy/` | Legacy page / matching language equivalent |
| `/igalawlitigation/` | 301 | `/en/igalawlitigation/` | Legacy page / matching language equivalent |
| `/igalawresidencepermit/` | 301 | `/en/igalawresidencepermit/` | Legacy page / matching language equivalent |
| `/igalawrealestateduediligence/` | 301 | `/en/igalawrealestateduediligence/` | Legacy page / matching language equivalent |
| `/igalawdocumentation/` | 301 | `/en/igalawdocumentation/` | Legacy page / matching language equivalent |
| `/post/2025-tl-deposit-usd-yield-full-return-analysis-for-foreign-investors-exiting-kkm-in-february-2025/` | 301 | `/en/blog/2025-tl-deposit-usd-yield-full-return-analysis-for-foreign-investors-exiting-kkm-in-february-2025/` | Exact imported article / matching language equivalent |
| `/en/post/2025-tl-deposit-usd-yield-full-return-analysis-for-foreign-investors-exiting-kkm-in-february-2025/` | 301 | `/en/blog/2025-tl-deposit-usd-yield-full-return-analysis-for-foreign-investors-exiting-kkm-in-february-2025/` | Exact imported article / matching language equivalent |
| `/tr/post/2025-tl-deposit-usd-yield-full-return-analysis-for-foreign-investors-exiting-kkm-in-february-2025/` | 301 | `/tr/blog/2025-tl-deposit-usd-yield-full-return-analysis-for-foreign-investors-exiting-kkm-in-february-2025/` | Exact imported article / matching language equivalent |
| `/zh/post/2025-tl-deposit-usd-yield-full-return-analysis-for-foreign-investors-exiting-kkm-in-february-2025/` | 301 | `/zh/blog/2025-tl-deposit-usd-yield-full-return-analysis-for-foreign-investors-exiting-kkm-in-february-2025/` | Exact imported article / matching language equivalent |
| `/ar/post/2025-tl-deposit-usd-yield-full-return-analysis-for-foreign-investors-exiting-kkm-in-february-2025/` | 301 | `/ar/blog/2025-tl-deposit-usd-yield-full-return-analysis-for-foreign-investors-exiting-kkm-in-february-2025/` | Exact imported article / matching language equivalent |
| `/post/bank-deposit-for-turkish-citizenship-how-a-usd-500-000-investment-became-usd-620-640-and-was-safely/` | 301 | `/en/blog/bank-deposit-for-turkish-citizenship-how-a-usd-500-000-investment-became-usd-620-640-and-was-safely/` | Exact imported article / matching language equivalent |
| `/en/post/bank-deposit-for-turkish-citizenship-how-a-usd-500-000-investment-became-usd-620-640-and-was-safely/` | 301 | `/en/blog/bank-deposit-for-turkish-citizenship-how-a-usd-500-000-investment-became-usd-620-640-and-was-safely/` | Exact imported article / matching language equivalent |
| `/tr/post/bank-deposit-for-turkish-citizenship-how-a-usd-500-000-investment-became-usd-620-640-and-was-safely/` | 301 | `/tr/blog/bank-deposit-for-turkish-citizenship-how-a-usd-500-000-investment-became-usd-620-640-and-was-safely/` | Exact imported article / matching language equivalent |
| `/zh/post/bank-deposit-for-turkish-citizenship-how-a-usd-500-000-investment-became-usd-620-640-and-was-safely/` | 301 | `/zh/blog/bank-deposit-for-turkish-citizenship-how-a-usd-500-000-investment-became-usd-620-640-and-was-safely/` | Exact imported article / matching language equivalent |
| `/ar/post/bank-deposit-for-turkish-citizenship-how-a-usd-500-000-investment-became-usd-620-640-and-was-safely/` | 301 | `/ar/blog/bank-deposit-for-turkish-citizenship-how-a-usd-500-000-investment-became-usd-620-640-and-was-safely/` | Exact imported article / matching language equivalent |
| `/post/bes-for-turkish-citizenship-2026-10-key-legal-questions-answered-by-a-lawyer/` | 301 | `/en/blog/bes-for-turkish-citizenship-2026-10-key-legal-questions-answered-by-a-lawyer/` | Exact imported article / matching language equivalent |
| `/en/post/bes-for-turkish-citizenship-2026-10-key-legal-questions-answered-by-a-lawyer/` | 301 | `/en/blog/bes-for-turkish-citizenship-2026-10-key-legal-questions-answered-by-a-lawyer/` | Exact imported article / matching language equivalent |
| `/tr/post/bes-for-turkish-citizenship-2026-10-key-legal-questions-answered-by-a-lawyer/` | 301 | `/tr/blog/bes-for-turkish-citizenship-2026-10-key-legal-questions-answered-by-a-lawyer/` | Exact imported article / matching language equivalent |
| `/zh/post/bes-for-turkish-citizenship-2026-10-key-legal-questions-answered-by-a-lawyer/` | 301 | `/zh/blog/bes-for-turkish-citizenship-2026-10-key-legal-questions-answered-by-a-lawyer/` | Exact imported article / matching language equivalent |
| `/ar/post/bes-for-turkish-citizenship-2026-10-key-legal-questions-answered-by-a-lawyer/` | 301 | `/ar/blog/bes-for-turkish-citizenship-2026-10-key-legal-questions-answered-by-a-lawyer/` | Exact imported article / matching language equivalent |
| `/post/can-you-apply-for-turkish-citizenship-without-a-birth-certificate/` | 301 | `/en/blog/can-you-apply-for-turkish-citizenship-without-a-birth-certificate/` | Exact imported article / matching language equivalent |
| `/en/post/can-you-apply-for-turkish-citizenship-without-a-birth-certificate/` | 301 | `/en/blog/can-you-apply-for-turkish-citizenship-without-a-birth-certificate/` | Exact imported article / matching language equivalent |
| `/tr/post/can-you-apply-for-turkish-citizenship-without-a-birth-certificate/` | 301 | `/tr/blog/can-you-apply-for-turkish-citizenship-without-a-birth-certificate/` | Exact imported article / matching language equivalent |
| `/zh/post/can-you-apply-for-turkish-citizenship-without-a-birth-certificate/` | 301 | `/zh/blog/can-you-apply-for-turkish-citizenship-without-a-birth-certificate/` | Exact imported article / matching language equivalent |
| `/ar/post/can-you-apply-for-turkish-citizenship-without-a-birth-certificate/` | 301 | `/ar/blog/can-you-apply-for-turkish-citizenship-without-a-birth-certificate/` | Exact imported article / matching language equivalent |
| `/post/crs-reporting-in-turkey-turkish-citizenship-by-investment-what-investors-should-know/` | 301 | `/en/blog/crs-reporting-in-turkey-turkish-citizenship-by-investment-what-investors-should-know/` | Exact imported article / matching language equivalent |
| `/en/post/crs-reporting-in-turkey-turkish-citizenship-by-investment-what-investors-should-know/` | 301 | `/en/blog/crs-reporting-in-turkey-turkish-citizenship-by-investment-what-investors-should-know/` | Exact imported article / matching language equivalent |
| `/tr/post/crs-reporting-in-turkey-turkish-citizenship-by-investment-what-investors-should-know/` | 301 | `/tr/blog/crs-reporting-in-turkey-turkish-citizenship-by-investment-what-investors-should-know/` | Exact imported article / matching language equivalent |
| `/zh/post/crs-reporting-in-turkey-turkish-citizenship-by-investment-what-investors-should-know/` | 301 | `/zh/blog/crs-reporting-in-turkey-turkish-citizenship-by-investment-what-investors-should-know/` | Exact imported article / matching language equivalent |
| `/ar/post/crs-reporting-in-turkey-turkish-citizenship-by-investment-what-investors-should-know/` | 301 | `/ar/blog/crs-reporting-in-turkey-turkish-citizenship-by-investment-what-investors-should-know/` | Exact imported article / matching language equivalent |
| `/post/fund-investment-for-turkish-citizenship-legal-structure-of-the-bes-fund-institutional-background/` | 301 | `/en/blog/fund-investment-for-turkish-citizenship-legal-structure-of-the-bes-fund-institutional-background/` | Exact imported article / matching language equivalent |
| `/en/post/fund-investment-for-turkish-citizenship-legal-structure-of-the-bes-fund-institutional-background/` | 301 | `/en/blog/fund-investment-for-turkish-citizenship-legal-structure-of-the-bes-fund-institutional-background/` | Exact imported article / matching language equivalent |
| `/tr/post/fund-investment-for-turkish-citizenship-legal-structure-of-the-bes-fund-institutional-background/` | 301 | `/tr/blog/fund-investment-for-turkish-citizenship-legal-structure-of-the-bes-fund-institutional-background/` | Exact imported article / matching language equivalent |
| `/zh/post/fund-investment-for-turkish-citizenship-legal-structure-of-the-bes-fund-institutional-background/` | 301 | `/zh/blog/fund-investment-for-turkish-citizenship-legal-structure-of-the-bes-fund-institutional-background/` | Exact imported article / matching language equivalent |
| `/ar/post/fund-investment-for-turkish-citizenship-legal-structure-of-the-bes-fund-institutional-background/` | 301 | `/ar/blog/fund-investment-for-turkish-citizenship-legal-structure-of-the-bes-fund-institutional-background/` | Exact imported article / matching language equivalent |
| `/post/iga-law-firm-is-growing-a-new-chapter-at-our-new-office/` | 301 | `/en/blog/iga-law-firm-is-growing-a-new-chapter-at-our-new-office/` | Exact imported article / matching language equivalent |
| `/en/post/iga-law-firm-is-growing-a-new-chapter-at-our-new-office/` | 301 | `/en/blog/iga-law-firm-is-growing-a-new-chapter-at-our-new-office/` | Exact imported article / matching language equivalent |
| `/tr/post/iga-law-firm-is-growing-a-new-chapter-at-our-new-office/` | 301 | `/tr/blog/iga-law-firm-is-growing-a-new-chapter-at-our-new-office/` | Exact imported article / matching language equivalent |
| `/zh/post/iga-law-firm-is-growing-a-new-chapter-at-our-new-office/` | 301 | `/zh/blog/iga-law-firm-is-growing-a-new-chapter-at-our-new-office/` | Exact imported article / matching language equivalent |
| `/ar/post/iga-law-firm-is-growing-a-new-chapter-at-our-new-office/` | 301 | `/ar/blog/iga-law-firm-is-growing-a-new-chapter-at-our-new-office/` | Exact imported article / matching language equivalent |
| `/post/most-preferred-areas-by-real-estate-investors-in-istanbul-2026-iga-law-firm/` | 301 | `/en/blog/most-preferred-areas-by-real-estate-investors-in-istanbul-2026-iga-law-firm/` | Exact imported article / matching language equivalent |
| `/en/post/most-preferred-areas-by-real-estate-investors-in-istanbul-2026-iga-law-firm/` | 301 | `/en/blog/most-preferred-areas-by-real-estate-investors-in-istanbul-2026-iga-law-firm/` | Exact imported article / matching language equivalent |
| `/tr/post/most-preferred-areas-by-real-estate-investors-in-istanbul-2026-iga-law-firm/` | 301 | `/tr/blog/most-preferred-areas-by-real-estate-investors-in-istanbul-2026-iga-law-firm/` | Exact imported article / matching language equivalent |
| `/zh/post/most-preferred-areas-by-real-estate-investors-in-istanbul-2026-iga-law-firm/` | 301 | `/zh/blog/most-preferred-areas-by-real-estate-investors-in-istanbul-2026-iga-law-firm/` | Exact imported article / matching language equivalent |
| `/ar/post/most-preferred-areas-by-real-estate-investors-in-istanbul-2026-iga-law-firm/` | 301 | `/ar/blog/most-preferred-areas-by-real-estate-investors-in-istanbul-2026-iga-law-firm/` | Exact imported article / matching language equivalent |
| `/post/qnb-bank-turkish-citizenship-by-investment-why-investors-choose-qnb-in-2026/` | 301 | `/en/blog/qnb-bank-turkish-citizenship-by-investment-why-investors-choose-qnb-in-2026/` | Exact imported article / matching language equivalent |
| `/en/post/qnb-bank-turkish-citizenship-by-investment-why-investors-choose-qnb-in-2026/` | 301 | `/en/blog/qnb-bank-turkish-citizenship-by-investment-why-investors-choose-qnb-in-2026/` | Exact imported article / matching language equivalent |
| `/tr/post/qnb-bank-turkish-citizenship-by-investment-why-investors-choose-qnb-in-2026/` | 301 | `/tr/blog/qnb-bank-turkish-citizenship-by-investment-why-investors-choose-qnb-in-2026/` | Exact imported article / matching language equivalent |
| `/zh/post/qnb-bank-turkish-citizenship-by-investment-why-investors-choose-qnb-in-2026/` | 301 | `/zh/blog/qnb-bank-turkish-citizenship-by-investment-why-investors-choose-qnb-in-2026/` | Exact imported article / matching language equivalent |
| `/ar/post/qnb-bank-turkish-citizenship-by-investment-why-investors-choose-qnb-in-2026/` | 301 | `/ar/blog/qnb-bank-turkish-citizenship-by-investment-why-investors-choose-qnb-in-2026/` | Exact imported article / matching language equivalent |
| `/post/real-estate-vs-bank-deposit-vs-bes-for-turkish-citizenship-a-legal-and-strategic-comparison-2026/` | 301 | `/en/blog/real-estate-vs-bank-deposit-vs-bes-for-turkish-citizenship-a-legal-and-strategic-comparison-2026/` | Exact imported article / matching language equivalent |
| `/en/post/real-estate-vs-bank-deposit-vs-bes-for-turkish-citizenship-a-legal-and-strategic-comparison-2026/` | 301 | `/en/blog/real-estate-vs-bank-deposit-vs-bes-for-turkish-citizenship-a-legal-and-strategic-comparison-2026/` | Exact imported article / matching language equivalent |
| `/tr/post/real-estate-vs-bank-deposit-vs-bes-for-turkish-citizenship-a-legal-and-strategic-comparison-2026/` | 301 | `/tr/blog/real-estate-vs-bank-deposit-vs-bes-for-turkish-citizenship-a-legal-and-strategic-comparison-2026/` | Exact imported article / matching language equivalent |
| `/zh/post/real-estate-vs-bank-deposit-vs-bes-for-turkish-citizenship-a-legal-and-strategic-comparison-2026/` | 301 | `/zh/blog/real-estate-vs-bank-deposit-vs-bes-for-turkish-citizenship-a-legal-and-strategic-comparison-2026/` | Exact imported article / matching language equivalent |
| `/ar/post/real-estate-vs-bank-deposit-vs-bes-for-turkish-citizenship-a-legal-and-strategic-comparison-2026/` | 301 | `/ar/blog/real-estate-vs-bank-deposit-vs-bes-for-turkish-citizenship-a-legal-and-strategic-comparison-2026/` | Exact imported article / matching language equivalent |
| `/post/step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval/` | 301 | `/en/blog/step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval/` | Exact imported article / matching language equivalent |
| `/en/post/step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval/` | 301 | `/en/blog/step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval/` | Exact imported article / matching language equivalent |
| `/tr/post/step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval/` | 301 | `/tr/blog/step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval/` | Exact imported article / matching language equivalent |
| `/zh/post/step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval/` | 301 | `/zh/blog/step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval/` | Exact imported article / matching language equivalent |
| `/ar/post/step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval/` | 301 | `/ar/blog/step-by-step-guide-turkish-id-card-passport-appointment-after-citizenship-approval/` | Exact imported article / matching language equivalent |
| `/post/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | 301 | `/en/blog/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | Exact imported article / matching language equivalent |
| `/en/post/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | 301 | `/en/blog/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | Exact imported article / matching language equivalent |
| `/tr/post/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | 301 | `/tr/blog/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | Exact imported article / matching language equivalent |
| `/zh/post/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | 301 | `/zh/blog/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | Exact imported article / matching language equivalent |
| `/ar/post/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | 301 | `/ar/blog/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | Exact imported article / matching language equivalent |
| `/post/turkey-20-year-tax-exemption-and-1-inheritance-tax-advantage-for-foreign-investors/` | 301 | `/en/blog/turkey-20-year-tax-exemption-and-1-inheritance-tax-advantage-for-foreign-investors/` | Exact imported article / matching language equivalent |
| `/en/post/turkey-20-year-tax-exemption-and-1-inheritance-tax-advantage-for-foreign-investors/` | 301 | `/en/blog/turkey-20-year-tax-exemption-and-1-inheritance-tax-advantage-for-foreign-investors/` | Exact imported article / matching language equivalent |
| `/tr/post/turkey-20-year-tax-exemption-and-1-inheritance-tax-advantage-for-foreign-investors/` | 301 | `/tr/blog/turkey-20-year-tax-exemption-and-1-inheritance-tax-advantage-for-foreign-investors/` | Exact imported article / matching language equivalent |
| `/zh/post/turkey-20-year-tax-exemption-and-1-inheritance-tax-advantage-for-foreign-investors/` | 301 | `/zh/blog/turkey-20-year-tax-exemption-and-1-inheritance-tax-advantage-for-foreign-investors/` | Exact imported article / matching language equivalent |
| `/ar/post/turkey-20-year-tax-exemption-and-1-inheritance-tax-advantage-for-foreign-investors/` | 301 | `/ar/blog/turkey-20-year-tax-exemption-and-1-inheritance-tax-advantage-for-foreign-investors/` | Exact imported article / matching language equivalent |
| `/post/turkey-china-immigration-investment-cooperation/` | 301 | `/en/blog/turkey-china-immigration-investment-cooperation/` | Exact imported article / matching language equivalent |
| `/en/post/turkey-china-immigration-investment-cooperation/` | 301 | `/en/blog/turkey-china-immigration-investment-cooperation/` | Exact imported article / matching language equivalent |
| `/tr/post/turkey-china-immigration-investment-cooperation/` | 301 | `/tr/blog/turkey-china-immigration-investment-cooperation/` | Exact imported article / matching language equivalent |
| `/zh/post/turkey-china-immigration-investment-cooperation/` | 301 | `/zh/blog/turkey-china-immigration-investment-cooperation/` | Exact imported article / matching language equivalent |
| `/ar/post/turkey-china-immigration-investment-cooperation/` | 301 | `/ar/blog/turkey-china-immigration-investment-cooperation/` | Exact imported article / matching language equivalent |
| `/post/turkey-citizenship-by-investment-bes-fund-route-explained-legal-structure-process-latest-succes/` | 301 | `/en/blog/turkey-citizenship-by-investment-bes-fund-route-explained-legal-structure-process-latest-succes/` | Exact imported article / matching language equivalent |
| `/en/post/turkey-citizenship-by-investment-bes-fund-route-explained-legal-structure-process-latest-succes/` | 301 | `/en/blog/turkey-citizenship-by-investment-bes-fund-route-explained-legal-structure-process-latest-succes/` | Exact imported article / matching language equivalent |
| `/tr/post/turkey-citizenship-by-investment-bes-fund-route-explained-legal-structure-process-latest-succes/` | 301 | `/tr/blog/turkey-citizenship-by-investment-bes-fund-route-explained-legal-structure-process-latest-succes/` | Exact imported article / matching language equivalent |
| `/zh/post/turkey-citizenship-by-investment-bes-fund-route-explained-legal-structure-process-latest-succes/` | 301 | `/zh/blog/turkey-citizenship-by-investment-bes-fund-route-explained-legal-structure-process-latest-succes/` | Exact imported article / matching language equivalent |
| `/ar/post/turkey-citizenship-by-investment-bes-fund-route-explained-legal-structure-process-latest-succes/` | 301 | `/ar/blog/turkey-citizenship-by-investment-bes-fund-route-explained-legal-structure-process-latest-succes/` | Exact imported article / matching language equivalent |
| `/post/turkish-citizenship-by-bank-deposit-2025-complete-and-detailed-process-guide/` | 301 | `/en/blog/turkish-citizenship-by-bank-deposit-2025-complete-and-detailed-process-guide/` | Exact imported article / matching language equivalent |
| `/en/post/turkish-citizenship-by-bank-deposit-2025-complete-and-detailed-process-guide/` | 301 | `/en/blog/turkish-citizenship-by-bank-deposit-2025-complete-and-detailed-process-guide/` | Exact imported article / matching language equivalent |
| `/tr/post/turkish-citizenship-by-bank-deposit-2025-complete-and-detailed-process-guide/` | 301 | `/tr/blog/turkish-citizenship-by-bank-deposit-2025-complete-and-detailed-process-guide/` | Exact imported article / matching language equivalent |
| `/zh/post/turkish-citizenship-by-bank-deposit-2025-complete-and-detailed-process-guide/` | 301 | `/zh/blog/turkish-citizenship-by-bank-deposit-2025-complete-and-detailed-process-guide/` | Exact imported article / matching language equivalent |
| `/ar/post/turkish-citizenship-by-bank-deposit-2025-complete-and-detailed-process-guide/` | 301 | `/ar/blog/turkish-citizenship-by-bank-deposit-2025-complete-and-detailed-process-guide/` | Exact imported article / matching language equivalent |
| `/post/turkish-citizenship-by-bank-deposit-real-case-study-after-3-years-500-000-usd-600-000-usd/` | 301 | `/en/blog/turkish-citizenship-by-bank-deposit-real-case-study-after-3-years-500-000-usd-600-000-usd/` | Exact imported article / matching language equivalent |
| `/en/post/turkish-citizenship-by-bank-deposit-real-case-study-after-3-years-500-000-usd-600-000-usd/` | 301 | `/en/blog/turkish-citizenship-by-bank-deposit-real-case-study-after-3-years-500-000-usd-600-000-usd/` | Exact imported article / matching language equivalent |
| `/tr/post/turkish-citizenship-by-bank-deposit-real-case-study-after-3-years-500-000-usd-600-000-usd/` | 301 | `/tr/blog/turkish-citizenship-by-bank-deposit-real-case-study-after-3-years-500-000-usd-600-000-usd/` | Exact imported article / matching language equivalent |
| `/zh/post/turkish-citizenship-by-bank-deposit-real-case-study-after-3-years-500-000-usd-600-000-usd/` | 301 | `/zh/blog/turkish-citizenship-by-bank-deposit-real-case-study-after-3-years-500-000-usd-600-000-usd/` | Exact imported article / matching language equivalent |
| `/ar/post/turkish-citizenship-by-bank-deposit-real-case-study-after-3-years-500-000-usd-600-000-usd/` | 301 | `/ar/blog/turkish-citizenship-by-bank-deposit-real-case-study-after-3-years-500-000-usd-600-000-usd/` | Exact imported article / matching language equivalent |
| `/post/turkish-citizenship-by-investment-2026-legal-process-investment-options/` | 301 | `/en/blog/turkish-citizenship-by-investment-2026-legal-process-investment-options/` | Exact imported article / matching language equivalent |
| `/en/post/turkish-citizenship-by-investment-2026-legal-process-investment-options/` | 301 | `/en/blog/turkish-citizenship-by-investment-2026-legal-process-investment-options/` | Exact imported article / matching language equivalent |
| `/tr/post/turkish-citizenship-by-investment-2026-legal-process-investment-options/` | 301 | `/tr/blog/turkish-citizenship-by-investment-2026-legal-process-investment-options/` | Exact imported article / matching language equivalent |
| `/zh/post/turkish-citizenship-by-investment-2026-legal-process-investment-options/` | 301 | `/zh/blog/turkish-citizenship-by-investment-2026-legal-process-investment-options/` | Exact imported article / matching language equivalent |
| `/ar/post/turkish-citizenship-by-investment-2026-legal-process-investment-options/` | 301 | `/ar/blog/turkish-citizenship-by-investment-2026-legal-process-investment-options/` | Exact imported article / matching language equivalent |
| `/post/turkish-citizenship-by-investment-and-turkish-name-selection-an-overlooked-advantage-for-internatio/` | 301 | `/en/blog/turkish-citizenship-by-investment-and-turkish-name-selection-an-overlooked-advantage-for-internatio/` | Exact imported article / matching language equivalent |
| `/en/post/turkish-citizenship-by-investment-and-turkish-name-selection-an-overlooked-advantage-for-internatio/` | 301 | `/en/blog/turkish-citizenship-by-investment-and-turkish-name-selection-an-overlooked-advantage-for-internatio/` | Exact imported article / matching language equivalent |
| `/tr/post/turkish-citizenship-by-investment-and-turkish-name-selection-an-overlooked-advantage-for-internatio/` | 301 | `/tr/blog/turkish-citizenship-by-investment-and-turkish-name-selection-an-overlooked-advantage-for-internatio/` | Exact imported article / matching language equivalent |
| `/zh/post/turkish-citizenship-by-investment-and-turkish-name-selection-an-overlooked-advantage-for-internatio/` | 301 | `/zh/blog/turkish-citizenship-by-investment-and-turkish-name-selection-an-overlooked-advantage-for-internatio/` | Exact imported article / matching language equivalent |
| `/ar/post/turkish-citizenship-by-investment-and-turkish-name-selection-an-overlooked-advantage-for-internatio/` | 301 | `/ar/blog/turkish-citizenship-by-investment-and-turkish-name-selection-an-overlooked-advantage-for-internatio/` | Exact imported article / matching language equivalent |
| `/post/turkish-citizenship-by-investment-bes-allianz-funds-and-best-portfolio-strategy-2026-guide/` | 301 | `/en/blog/turkish-citizenship-by-investment-bes-allianz-funds-and-best-portfolio-strategy-2026-guide/` | Exact imported article / matching language equivalent |
| `/en/post/turkish-citizenship-by-investment-bes-allianz-funds-and-best-portfolio-strategy-2026-guide/` | 301 | `/en/blog/turkish-citizenship-by-investment-bes-allianz-funds-and-best-portfolio-strategy-2026-guide/` | Exact imported article / matching language equivalent |
| `/tr/post/turkish-citizenship-by-investment-bes-allianz-funds-and-best-portfolio-strategy-2026-guide/` | 301 | `/tr/blog/turkish-citizenship-by-investment-bes-allianz-funds-and-best-portfolio-strategy-2026-guide/` | Exact imported article / matching language equivalent |
| `/zh/post/turkish-citizenship-by-investment-bes-allianz-funds-and-best-portfolio-strategy-2026-guide/` | 301 | `/zh/blog/turkish-citizenship-by-investment-bes-allianz-funds-and-best-portfolio-strategy-2026-guide/` | Exact imported article / matching language equivalent |
| `/ar/post/turkish-citizenship-by-investment-bes-allianz-funds-and-best-portfolio-strategy-2026-guide/` | 301 | `/ar/blog/turkish-citizenship-by-investment-bes-allianz-funds-and-best-portfolio-strategy-2026-guide/` | Exact imported article / matching language equivalent |
| `/post/turkish-citizenship-by-investment-through-real-estate-a-lawyer-s-guide-to-choosing-the-right-proper/` | 301 | `/en/blog/turkish-citizenship-by-investment-through-real-estate-a-lawyer-s-guide-to-choosing-the-right-proper/` | Exact imported article / matching language equivalent |
| `/en/post/turkish-citizenship-by-investment-through-real-estate-a-lawyer-s-guide-to-choosing-the-right-proper/` | 301 | `/en/blog/turkish-citizenship-by-investment-through-real-estate-a-lawyer-s-guide-to-choosing-the-right-proper/` | Exact imported article / matching language equivalent |
| `/tr/post/turkish-citizenship-by-investment-through-real-estate-a-lawyer-s-guide-to-choosing-the-right-proper/` | 301 | `/tr/blog/turkish-citizenship-by-investment-through-real-estate-a-lawyer-s-guide-to-choosing-the-right-proper/` | Exact imported article / matching language equivalent |
| `/zh/post/turkish-citizenship-by-investment-through-real-estate-a-lawyer-s-guide-to-choosing-the-right-proper/` | 301 | `/zh/blog/turkish-citizenship-by-investment-through-real-estate-a-lawyer-s-guide-to-choosing-the-right-proper/` | Exact imported article / matching language equivalent |
| `/ar/post/turkish-citizenship-by-investment-through-real-estate-a-lawyer-s-guide-to-choosing-the-right-proper/` | 301 | `/ar/blog/turkish-citizenship-by-investment-through-real-estate-a-lawyer-s-guide-to-choosing-the-right-proper/` | Exact imported article / matching language equivalent |
| `/post/turkish-citizenship-by-investment-via-allianz-bes-secure-500-000-strategy-with-gold-funds-2026/` | 301 | `/en/blog/turkish-citizenship-by-investment-via-allianz-bes-secure-500-000-strategy-with-gold-funds-2026/` | Exact imported article / matching language equivalent |
| `/en/post/turkish-citizenship-by-investment-via-allianz-bes-secure-500-000-strategy-with-gold-funds-2026/` | 301 | `/en/blog/turkish-citizenship-by-investment-via-allianz-bes-secure-500-000-strategy-with-gold-funds-2026/` | Exact imported article / matching language equivalent |
| `/tr/post/turkish-citizenship-by-investment-via-allianz-bes-secure-500-000-strategy-with-gold-funds-2026/` | 301 | `/tr/blog/turkish-citizenship-by-investment-via-allianz-bes-secure-500-000-strategy-with-gold-funds-2026/` | Exact imported article / matching language equivalent |
| `/zh/post/turkish-citizenship-by-investment-via-allianz-bes-secure-500-000-strategy-with-gold-funds-2026/` | 301 | `/zh/blog/turkish-citizenship-by-investment-via-allianz-bes-secure-500-000-strategy-with-gold-funds-2026/` | Exact imported article / matching language equivalent |
| `/ar/post/turkish-citizenship-by-investment-via-allianz-bes-secure-500-000-strategy-with-gold-funds-2026/` | 301 | `/ar/blog/turkish-citizenship-by-investment-via-allianz-bes-secure-500-000-strategy-with-gold-funds-2026/` | Exact imported article / matching language equivalent |
| `/post/turkish-citizenship-for-chinese-citizens-in-2026-documents-hukou-apostille-family-guide/` | 301 | `/en/blog/turkish-citizenship-for-chinese-citizens-in-2026-documents-hukou-apostille-family-guide/` | Exact imported article / matching language equivalent |
| `/en/post/turkish-citizenship-for-chinese-citizens-in-2026-documents-hukou-apostille-family-guide/` | 301 | `/en/blog/turkish-citizenship-for-chinese-citizens-in-2026-documents-hukou-apostille-family-guide/` | Exact imported article / matching language equivalent |
| `/tr/post/turkish-citizenship-for-chinese-citizens-in-2026-documents-hukou-apostille-family-guide/` | 301 | `/tr/blog/turkish-citizenship-for-chinese-citizens-in-2026-documents-hukou-apostille-family-guide/` | Exact imported article / matching language equivalent |
| `/zh/post/turkish-citizenship-for-chinese-citizens-in-2026-documents-hukou-apostille-family-guide/` | 301 | `/zh/blog/turkish-citizenship-for-chinese-citizens-in-2026-documents-hukou-apostille-family-guide/` | Exact imported article / matching language equivalent |
| `/ar/post/turkish-citizenship-for-chinese-citizens-in-2026-documents-hukou-apostille-family-guide/` | 301 | `/ar/blog/turkish-citizenship-for-chinese-citizens-in-2026-documents-hukou-apostille-family-guide/` | Exact imported article / matching language equivalent |
| `/post/turkish-citizenship-property-sale-after-3-years-how-to-sell-your-property-investment-in-turkey/` | 301 | `/en/blog/turkish-citizenship-property-sale-after-3-years-how-to-sell-your-property-investment-in-turkey/` | Exact imported article / matching language equivalent |
| `/en/post/turkish-citizenship-property-sale-after-3-years-how-to-sell-your-property-investment-in-turkey/` | 301 | `/en/blog/turkish-citizenship-property-sale-after-3-years-how-to-sell-your-property-investment-in-turkey/` | Exact imported article / matching language equivalent |
| `/tr/post/turkish-citizenship-property-sale-after-3-years-how-to-sell-your-property-investment-in-turkey/` | 301 | `/tr/blog/turkish-citizenship-property-sale-after-3-years-how-to-sell-your-property-investment-in-turkey/` | Exact imported article / matching language equivalent |
| `/zh/post/turkish-citizenship-property-sale-after-3-years-how-to-sell-your-property-investment-in-turkey/` | 301 | `/zh/blog/turkish-citizenship-property-sale-after-3-years-how-to-sell-your-property-investment-in-turkey/` | Exact imported article / matching language equivalent |
| `/ar/post/turkish-citizenship-property-sale-after-3-years-how-to-sell-your-property-investment-in-turkey/` | 301 | `/ar/blog/turkish-citizenship-property-sale-after-3-years-how-to-sell-your-property-investment-in-turkey/` | Exact imported article / matching language equivalent |
| `/post/turkish-citizenship-through-bes-a-secure-path-for-foreign-investors/` | 301 | `/en/blog/turkish-citizenship-through-bes-a-secure-path-for-foreign-investors/` | Exact imported article / matching language equivalent |
| `/en/post/turkish-citizenship-through-bes-a-secure-path-for-foreign-investors/` | 301 | `/en/blog/turkish-citizenship-through-bes-a-secure-path-for-foreign-investors/` | Exact imported article / matching language equivalent |
| `/tr/post/turkish-citizenship-through-bes-a-secure-path-for-foreign-investors/` | 301 | `/tr/blog/turkish-citizenship-through-bes-a-secure-path-for-foreign-investors/` | Exact imported article / matching language equivalent |
| `/zh/post/turkish-citizenship-through-bes-a-secure-path-for-foreign-investors/` | 301 | `/zh/blog/turkish-citizenship-through-bes-a-secure-path-for-foreign-investors/` | Exact imported article / matching language equivalent |
| `/ar/post/turkish-citizenship-through-bes-a-secure-path-for-foreign-investors/` | 301 | `/ar/blog/turkish-citizenship-through-bes-a-secure-path-for-foreign-investors/` | Exact imported article / matching language equivalent |
| `/post/celebrating-our-clients-success-turkish-citizenship-approvals-are-in/` | 301 | `/en/blog/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | Exact article match from indexed Wix title and body |
| `/en/post/celebrating-our-clients-success-turkish-citizenship-approvals-are-in/` | 301 | `/en/blog/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | Exact article match from indexed Wix title and body |
| `/tr/post/celebrating-our-clients-success-turkish-citizenship-approvals-are-in/` | 301 | `/tr/blog/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | Exact article match from indexed Wix title and body |
| `/zh/post/celebrating-our-clients-success-turkish-citizenship-approvals-are-in/` | 301 | `/zh/blog/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | Exact article match from indexed Wix title and body |
| `/ar/post/celebrating-our-clients-success-turkish-citizenship-approvals-are-in/` | 301 | `/ar/blog/success-stories-newly-approved-turkish-citizenship-turkish-id-cards/` | Exact article match from indexed Wix title and body |
| `/post/renunciation-of-turkish-citizenship-2025-legal-process-required-documents-and-reapplication/` | 301 | `/en/blog/renunciation-of-turkish-citizenship-2025-process-documents-reapplication/` | Exact article match from indexed Wix title and body |
| `/en/post/renunciation-of-turkish-citizenship-2025-legal-process-required-documents-and-reapplication/` | 301 | `/en/blog/renunciation-of-turkish-citizenship-2025-process-documents-reapplication/` | Exact article match from indexed Wix title and body |
| `/tr/post/renunciation-of-turkish-citizenship-2025-legal-process-required-documents-and-reapplication/` | 301 | `/tr/blog/renunciation-of-turkish-citizenship-2025-process-documents-reapplication/` | Exact article match from indexed Wix title and body |
| `/zh/post/renunciation-of-turkish-citizenship-2025-legal-process-required-documents-and-reapplication/` | 301 | `/zh/blog/renunciation-of-turkish-citizenship-2025-process-documents-reapplication/` | Exact article match from indexed Wix title and body |
| `/ar/post/renunciation-of-turkish-citizenship-2025-legal-process-required-documents-and-reapplication/` | 301 | `/ar/blog/renunciation-of-turkish-citizenship-2025-process-documents-reapplication/` | Exact article match from indexed Wix title and body |
| `/post/turkish-citizenship-by-real-estate-investment-2025-complete-guide/` | 301 | `/en/blog/turkish-citizenship-by-real-estate-investment-2025-complete-guide/` | Exact article match from indexed Wix title and body |
| `/en/post/turkish-citizenship-by-real-estate-investment-2025-complete-guide/` | 301 | `/en/blog/turkish-citizenship-by-real-estate-investment-2025-complete-guide/` | Exact article match from indexed Wix title and body |
| `/tr/post/turkish-citizenship-by-real-estate-investment-2025-complete-guide/` | 301 | `/tr/blog/turkish-citizenship-by-real-estate-investment-2025-complete-guide/` | Exact article match from indexed Wix title and body |
| `/zh/post/turkish-citizenship-by-real-estate-investment-2025-complete-guide/` | 301 | `/zh/blog/turkish-citizenship-by-real-estate-investment-2025-complete-guide/` | Exact article match from indexed Wix title and body |
| `/ar/post/turkish-citizenship-by-real-estate-investment-2025-complete-guide/` | 301 | `/ar/blog/turkish-citizenship-by-real-estate-investment-2025-complete-guide/` | Exact article match from indexed Wix title and body |
| `/tr/post/t%C3%BCrk-vatanda%C5%9Fl%C4%B1%C4%9F%C4%B1ndan-%C3%A7%C4%B1k%C4%B1%C5%9F-2025-%C5%9Fartlar-belgeler-ve-s%C3%BCre%C3%A7-rehberi/` | 301 | `/tr/blog/renunciation-of-turkish-citizenship-2025-process-documents-reapplication/` | Actual localized Wix slug matched to same-language article |
| `/tr/post/türk-vatandaşlığından-çıkış-2025-şartlar-belgeler-ve-süreç-rehberi/` | 301 | `/tr/blog/renunciation-of-turkish-citizenship-2025-process-documents-reapplication/` | Actual localized Wix slug matched to same-language article |
| `/zh/post/%E6%94%BE%E5%BC%83%E5%9C%9F%E8%80%B3%E5%85%B6%E5%9B%BD%E7%B1%8D%E6%8C%87%E5%8D%97%EF%BC%882025%E5%B9%B4%EF%BC%89%EF%BC%9A%E6%B3%95%E5%BE%8B%E7%A8%8B%E5%BA%8F%E3%80%81%E6%89%80%E9%9C%80%E6%96%87%E4%BB%B6%E5%8F%8A%E9%87%8D%E6%96%B0%E5%85%A5%E7%B1%8D%E6%B5%81%E7%A8%8B/` | 301 | `/zh/blog/renunciation-of-turkish-citizenship-2025-process-documents-reapplication/` | Actual localized Wix slug matched to same-language article |
| `/zh/post/放弃土耳其国籍指南（2025年）：法律程序、所需文件及重新入籍流程/` | 301 | `/zh/blog/renunciation-of-turkish-citizenship-2025-process-documents-reapplication/` | Actual localized Wix slug matched to same-language article |
| `/zh/post/work-permit-in-turkey-for-company-owners-zh/` | 301 | `/zh/blog/work-permit-turkey-company-owners-shareholders-2025/` | Actual localized Wix slug matched to same-language article |
| `/igalawblog/page/2/` | 301 | `/en/blog/` | Old paginated blog listing consolidated into full current article list |
| `/en/igalawblog/page/2/` | 301 | `/en/blog/` | Old paginated blog listing consolidated into full current article list |
| `/tr/igalawblog/page/2/` | 301 | `/tr/blog/` | Old paginated blog listing consolidated into full current article list |
| `/zh/igalawblog/page/2/` | 301 | `/zh/blog/` | Old paginated blog listing consolidated into full current article list |
| `/ar/igalawblog/page/2/` | 301 | `/ar/blog/` | Old paginated blog listing consolidated into full current article list |
