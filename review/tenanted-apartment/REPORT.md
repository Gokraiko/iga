# Tenanted apartment article — approved publication

User explicitly approved publishing and the previously proposed author-support change. Publication date: 2026-11-13. No attorney legal-review attribution or date is claimed.

## Scope

New English and Simplified Chinese article using the approved common slug. Existing English/Chinese archives each gain one card. All 235 other existing page HTML files and all 237 existing SEO records remain byte/structure identical to the prior release. Existing archive cards retain their content and order.

New URLs:
- https://igalawfirm.com/en/blog/buying-tenanted-apartment-istanbul-foreign-buyers/
- https://igalawfirm.com/zh/blog/buying-tenanted-apartment-istanbul-foreign-buyers/

## Metadata

EN H1: Buying an Apartment in Istanbul with a Tenant: What Foreign Buyers Must Know Before Purchasing

EN title: Buying a Tenanted Apartment in Istanbul | IGA Law

EN description: Buying a tenanted apartment in Istanbul? Learn about tenant rights, eviction rules, rental income and legal checks with IGA Law Firm.

ZH H1: 在伊斯坦布尔购买带租客的公寓：外国买家购房前必须了解的法律问题

ZH title: 伊斯坦布尔购买带租客的房产｜租客权利与法律风险｜IGA律师事务所

ZH description: 想在伊斯坦布尔购买已有租客的公寓？了解土耳其租客保护、房屋出售后的租约、租金收入及购房法律审查。IGA律师事务所为外国投资者提供法律支持。

## Implementation

- tenanted-apartment-post.js: new article data only, complete EN and ZH bodies.
- app.js: conditional registration of the new article only; existing template source unchanged.
- index.html and generate-static.js: load new data only on the two new article pages and EN/ZH archives; include it in the existing build/sitemap pipeline. Chinese paragraph grouping differs naturally; the dedicated validator checks its full page, metadata, 10 FAQs and links.
- schema-content.js: approved editorial Organization author branch restricted to this slug; existing author behavior unchanged.
- blog-slugs.json, seo-config.json, article-content-history.json: generated additions for the new article; all existing records unchanged.
- No styling, navigation, translations of existing articles, existing redirects, robots or service-page changes.

Comparison table content is presented as five labeled comparison list items using the existing supported blog blocks; no renderer/template change. Both versions include all ten FAQs, source links, citizenship distinction and contextual CTAs. FAQPage schema is disabled for these articles; BlogPosting author is the editorial organization.

## Legal source verification

Checked 2026-11-13 against official sources:
- https://mevzuat.adalet.gov.tr/mevzuat/103273?query=6098 — indexed official text supports Articles 310, 351 and 352. Sale continues the tenancy; new-owner need routes require statutory conditions; one-month notice/six-month lawsuit route and alternative term-end route are distinguished. No automatic eviction guarantee. Articles 350 and 342 are identified as relevant provisions without adding an unverified detailed rule.
- https://www.resmigazete.gov.tr/eskiler/2023/04/20230405-3.htm — Law 7445 adds Law 6325 Article 18/B pre-action mediation, with the non-judgment enforcement eviction exception. Both versions include this qualification.
- https://www.invest.gov.tr/en/InvestmentGuide/Pages/acquiring-property-and-citizenship.aspx — USD 400,000 minimum and three-year restriction; authority assessment and individual transaction requirements remain explicit.

The check is editorial source verification, not an attorney's individual review or a comprehensive legal amendment audit. User instructed publication after that limitation was disclosed. No fabricated attorney approval appears in visible text or schema.

## Validation

239-page production-mode static build passed. Existing 237 SEO records and sitemap entries preserved; exactly two new entries. Only /en/blog/ and /zh/blog/ changed among existing HTML pages. Existing content-history records, styles, redirects and robots unchanged.

Desktop (1440px) and mobile (390px) browser checks passed in both languages: one H1, no horizontal overflow, at least 15px article inset, hidden counters, correct language URLs, functioning archive links. Six contextual destination URLs returned HTTP 200 without redirection. Sixteen existing routes across four languages passed smoke checks.

An existing runtime error, "Missing related guide tr", was reproduced on the unchanged baseline. It originates in the previous property-eligibility module; this release introduces no new runtime error. It was left untouched to respect the user's strict scope. This is not a claim of an error-free existing site.

No title/H1/metadata screening match for the same tenant-occupied purchase intent. Existing due diligence and citizenship content is linked, not rewritten. No search-ranking or AI-citation guarantee.

## Approval and rollback

Explicit user instruction: “canlıya al olmazsa ben sana kaldır diyeceğim”.
Previous production commit: 88083dbf8edc3d550cbc86fe44adeb99cf7b4f44.
Revert the single implementation commit for this release to remove both new articles and archive cards, preserving earlier hidden counters and property form changes. Never force-reset unrelated later changes.
