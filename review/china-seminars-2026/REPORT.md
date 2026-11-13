## Follow-up: visible links and founding year

User requested underlined clickable links and the 2022 founding date in the Irmak Gürer Aksöz section. All six body anchors in each seminar article are underlined with article-local inline styling; their existing valid destinations remain unchanged. IGA Law Firm's 2022 founding year is added to both language versions, separately from the attorney's professional work since 2018. Only the two seminar page HTML outputs change; 239 other pages and all sitemap entries remain identical. The two article modification timestamps update through the existing content-history mechanism. No global CSS change.

# Approved China seminar release — 2026-11-13

The user explicitly authorized adding the two articles and supplied photographs to the live site for review, with removal on request. This supersedes the draft-only state below. Implementation was confined to the two new pages, their EN/ZH archive cards and necessary scoped registrations. No unrelated content was edited.

## Release validation

- 241-page build passed.
- 237 existing page HTML files remain byte-for-byte identical; only /en/blog/ and /zh/blog/ gain cards. Existing archive cards retain content and order.
- All 239 existing SEO records, sitemap entries and content-history records preserved.
- CSS, robots, redirects, global image manifest and existing images unchanged.
- Four original JPEG hashes match the supplied ZIP. Three smaller WebP derivatives are served where appropriate; original dimensions and aspect ratios retained.
- Both article languages passed desktop 1440px/mobile 390px checks, image decoding, ratios, loading, hidden read counters, archive links and actual EN/Chinese language-menu navigation.
- Six FAQs per language, four confirmed city names in introduction and dedicated section, organization author and actual publication date 2026-11-13.
- Existing runtime error "Missing related guide tr" remains as documented on the previous release; no new runtime errors.

## Scoped shared-source changes

app.js: conditional article registration, body rendering delegation and localized slug mapping for this article only.
index.html/generate-static.js: new module loaded only on new article pages and EN/ZH archives; two new generated SEO/sitemap records.
schema-content.js: include this article in the existing editorial-author allowlist.
china-seminars-post.js: complete bilingual content, image placements and new-image metadata, using the existing image helper.
blog-slugs.json, article-content-history.json, seo-config.json: additive generated records only.
public/assets: four supplied JPEGs and three WebP derivatives; no existing asset overwritten.

## Rollback

Previous production commit: 2c8ca87f8663698ee9df215aaace7fb44e1b8b2f.
Revert only this seminar release's implementation commit, preserving the tenanted-apartment release, hidden counters and property inquiry changes. Do not force-reset any later unrelated work.

---

## Original draft review record (historical, superseded by approval above)

# China seminars 2026 — bilingual draft report

Status: COMPLETE DRAFT PACKAGE, NOT INTEGRATED, NOT PUBLISHED.

The direct user update takes precedence over the older attachment: Shanghai, Hangzhou, Shenzhen and Beijing are confirmed seminar cities. Both introductions and dedicated sections use all four cities. Exact dates, venues and organizers are not inferred. Photo-specific cities are unconfirmed and are absent from filenames, alt text and captions.

No prior seminar draft was found in the active project (excluding historical audit trees). The two drafts were prepared from the supplied full English article and the confirmed-city update. The Chinese article is a complete localization, including all six FAQs and the same commercial sections. The 2025 Chinese-delegation visit to Istanbul remains a distinct, untouched article.

## Proposed URLs and metadata — not live routes

### EN

Proposed URL: https://igalawfirm.com/en/blog/iga-law-firm-china-turkish-citizenship-investment-seminars-2026/

H1: IGA Law Firm in China: Turkish Citizenship Investment Seminars in Four Major Cities

Meta title: IGA Law Firm China Seminars 2026 | Citizenship & Property

Meta description: IGA Law Firm held Turkish citizenship investment seminars in Shanghai, Hangzhou, Shenzhen and Beijing, helping Chinese investors understand property-related legal matters.

### ZH

Proposed URL: https://igalawfirm.com/zh/blog/iga-law-firm-china-turkey-property-citizenship-seminars-2026/

H1: IGA律师事务所走进中国四大城市：土耳其购房投资与入籍法律讲座

Meta title: IGA律师事务所中国四城讲座｜土耳其购房与投资入籍

Meta description: IGA律师事务所创始律师Irmak Gürer Aksöz赴上海、杭州、深圳和北京举办土耳其购房投资与入籍法律讲座，为中国投资者介绍房产交易及相关法律问题。

The attachment proposes different EN/ZH slugs. They remain proposals in this draft package; the production router has not been changed. Publication date is unset and must be the actual date of publication, not the event period. Preview pages explicitly use noindex,nofollow and are not included in the sitemap.

## Images and placement

Four original JPEGs were read successfully from the supplied ZIP, visually inspected, and copied without recompression. SHA-256 hashes confirm the preserved originals and draft JPEGs match the ZIP exactly. No photograph was generated, retouched, cropped or assigned an unverified city.

Existing articleImageMarkup was evaluated unchanged to produce the image markup. Existing blog classes and styles are reused. A per-image max-height:none override confined to the draft image HTML prevents the existing shared image height cap from cropping portrait photographs. Global CSS was not changed. All dimensions are intrinsic. The first image is not lazy-loaded; the remaining three are lazy-loaded. No new dependency was installed.

WebP derivatives were prepared with the already installed image tooling at quality 85, without resizing or changing aspect ratio. The preview serves WebP only when smaller than its JPEG. Image 1 remains JPEG because its WebP is larger. The original SEO-friendly JPEG names are retained for all four.

### Image 1

Filename: `iga-law-firm-china-turkish-citizenship-investment-seminar-group-01.jpg`

Dimensions: 1280 × 1707

Placement: After introduction

English alt: Chinese investors and seminar attendees at a Turkish citizenship by investment presentation involving IGA Law Firm.

Chinese alt: IGA律师事务所土耳其投资入籍讲座参会人员合影

English caption: Participants at a seminar during IGA Law Firm’s November 2026 visit to China.

Chinese caption: IGA律师事务所2026年11月访华期间的讲座参会人员合影。

### Image 2

Filename: `irmak-gurer-aksoz-turkish-citizenship-investment-presentation-china.jpg`

Dimensions: 2048 × 1536

Placement: After Connecting Chinese Investors with Turkish Legal Expertise

English alt: Attorney Irmak Gürer Aksöz presenting Turkish citizenship by investment regulations and legal risk management.

Chinese alt: IGA律师事务所创始律师Irmak Gürer Aksöz介绍土耳其投资入籍法律规定

English caption: Irmak Gürer Aksöz presents investment pathways, 2026 regulatory developments and legal risk management in China.

Chinese caption: Irmak Gürer Aksöz在中国介绍投资途径、2026年监管动态及法律风险管理。

### Image 3

Filename: `turkish-citizenship-by-investment-chinese-language-seminar-brochure.jpg`

Dimensions: 1080 × 1920

Placement: After citizenship investment section

English alt: Chinese-language Turkish citizenship by investment seminar brochure displayed at an investment presentation.

Chinese alt: 土耳其投资入籍中文讲座宣传资料

English caption: Chinese-language seminar materials supplied as part of the November 2026 China event photographs.

Chinese caption: 2026年11月中国讲座活动照片中的中文宣传资料。

### Image 4

Filename: `iga-law-firm-chinese-investors-turkey-property-citizenship-seminar-group-02.jpg`

Dimensions: 1707 × 1280

Placement: Before final CTA

English alt: Group photograph from a Turkish property investment and citizenship seminar for Chinese attendees.

Chinese alt: 中国投资者参加土耳其房产投资与入籍法律讲座的集体合影

English caption: Seminar participants during the November 2026 China visit.

Chinese caption: 2026年11月访华讲座的参会人员合影。

## Internal links

All ten destinations returned HTTP 200 without redirection. Each article uses its own language equivalents.

- https://igalawfirm.com/en/about/
- https://igalawfirm.com/en/blog/chinese-investors-transfer-money-turkey-property-citizenship/
- https://igalawfirm.com/en/blog/how-to-check-property-eligibility-turkish-citizenship/
- https://igalawfirm.com/en/igalawrealestateduediligence/
- https://igalawfirm.com/en/turkish-citizenship-by-investment-lawyer/
- https://igalawfirm.com/zh/about/
- https://igalawfirm.com/zh/blog/chinese-investors-transfer-money-turkey-property-citizenship/
- https://igalawfirm.com/zh/blog/how-to-check-property-eligibility-turkish-citizenship/
- https://igalawfirm.com/zh/igalawrealestateduediligence/
- https://igalawfirm.com/zh/tuerqi-touzi-ruji-lushi/

## Facts and source review

- Four cities, November 2026 event period, speaker and association of the four supplied photographs with the series: confirmed by the user. Photo-to-city mapping is not independently established.
- The presentation slide visibly supports the topics of 2026 regulatory developments, investment pathways and legal risk management. It also shows the supplied professional-history and 600+ families claims; the article attributes the family count to the firm rather than presenting it as an independently audited result.
- The article retains the supplied professional-work date of 2018. It does not change the firm's founding date or any existing firm profile.
- The short USD 400,000 / three-year restriction explanation was checked against the Investment Office: https://www.invest.gov.tr/en/InvestmentGuide/Pages/acquiring-property-and-citizenship.aspx. It is qualified by applicable requirements and authority assessment; no automatic citizenship guarantee is made.
- No attendance count, audience quote, government endorsement, organizer, venue or partnership has been invented.

## Checks

- Two complete draft previews at 1440px and 390px: passed.
- All four article images load in both languages; rendered and natural aspect ratios match; no horizontal overflow; article inset at least 15px.
- One H1 per preview, six FAQs per language, all four cities in the introduction and dedicated section.
- Ten internal links: HTTP 200, no redirects.
- Original four JPEG hashes preserved.
- 307 existing source/output files compared: zero changes. This includes 239 existing page HTML files and existing SEO, sitemap and robots files.
- Existing production-mode build in the isolated current release checkout: 239 pages, successful, no tracked diff. This is a baseline build, not a claim that the new drafts are integrated into the production build.
- Candidate BlogPosting JSON checked for headline, description, four absolute image URLs, language, author, existing publisher ID and proposed canonical. Publication/modification dates deliberately absent until publication. No Event or FAQPage schema is proposed.
- Proposed reciprocal EN/zh-CN and x-default references are present only in detached preview files. Existing production canonical/hreflang settings are untouched. New live URL/indexability/sitemap validation must occur after separately approved integration; it has not been claimed here.

## Integration boundary and approvals

Only new files under review/china-seminars-2026/ were created. No shared component, live source, route registry, image manifest, language configuration, metadata or sitemap was edited. No git push or deployment occurred.

Full production integration requires separately approved registration/loading/build changes. The current shared author branch only recognizes the earlier tenanted-apartment article, and the generic body renderer does not place four images among arbitrary paragraphs. Those components were not modified. The two proposed language-specific slugs also require a routing decision; a shared slug could avoid broad route changes. The draft preview demonstrates the desired result without bypassing this approval boundary.

Before publication:
1. Obtain explicit publication approval and confirmation that the firm has the necessary rights/permission or legal basis to publish identifiable people in the supplied photos (required by the supplied brief).
2. Approve the narrow shared-file integration plan and settle the two proposed slugs versus a common slug.
3. Set actual publication date, complete live schema/sitemap/routing checks and repeat before/after regression comparisons.

Exact event days and organizers remain unconfirmed and are not asserted. They are optional additions; retaining November 2026 and unnamed organizers avoids inventing details. Do not assign a city to an individual photograph without independent confirmation.

## Created files

- review/china-seminars-2026/articles.json
- review/china-seminars-2026/assets/iga-law-firm-china-turkish-citizenship-investment-seminar-group-01.jpg
- review/china-seminars-2026/assets/iga-law-firm-china-turkish-citizenship-investment-seminar-group-01.webp
- review/china-seminars-2026/assets/iga-law-firm-chinese-investors-turkey-property-citizenship-seminar-group-02.jpg
- review/china-seminars-2026/assets/iga-law-firm-chinese-investors-turkey-property-citizenship-seminar-group-02.webp
- review/china-seminars-2026/assets/irmak-gurer-aksoz-turkish-citizenship-investment-presentation-china.jpg
- review/china-seminars-2026/assets/irmak-gurer-aksoz-turkish-citizenship-investment-presentation-china.webp
- review/china-seminars-2026/assets/turkish-citizenship-by-investment-chinese-language-seminar-brochure.jpg
- review/china-seminars-2026/assets/turkish-citizenship-by-investment-chinese-language-seminar-brochure.webp
- review/china-seminars-2026/baseline.json
- review/china-seminars-2026/browser-checks.json
- review/china-seminars-2026/build-preview.py
- review/china-seminars-2026/check-browser.cjs
- review/china-seminars-2026/checks.json
- review/china-seminars-2026/en-1440-image-1.png
- review/china-seminars-2026/en-1440-image-3.png
- review/china-seminars-2026/en-1440-top.png
- review/china-seminars-2026/en-390-image-1.png
- review/china-seminars-2026/en-390-image-3.png
- review/china-seminars-2026/en-390-top.png
- review/china-seminars-2026/en.body.html
- review/china-seminars-2026/en.md
- review/china-seminars-2026/en.preview.html
- review/china-seminars-2026/en.schema-draft.json
- review/china-seminars-2026/image-markup.json
- review/china-seminars-2026/images.json
- review/china-seminars-2026/links.json
- review/china-seminars-2026/originals/iga-law-firm-china-turkish-citizenship-investment-seminar-group-01.jpg
- review/china-seminars-2026/originals/iga-law-firm-chinese-investors-turkey-property-citizenship-seminar-group-02.jpg
- review/china-seminars-2026/originals/irmak-gurer-aksoz-turkish-citizenship-investment-presentation-china.jpg
- review/china-seminars-2026/originals/turkish-citizenship-by-investment-chinese-language-seminar-brochure.jpg
- review/china-seminars-2026/prepare-images.cjs
- review/china-seminars-2026/preview-server.cjs
- review/china-seminars-2026/render-images.cjs
- review/china-seminars-2026/zh-1440-image-1.png
- review/china-seminars-2026/zh-1440-image-3.png
- review/china-seminars-2026/zh-1440-top.png
- review/china-seminars-2026/zh-390-image-1.png
- review/china-seminars-2026/zh-390-image-3.png
- review/china-seminars-2026/zh-390-top.png
- review/china-seminars-2026/zh.body.html
- review/china-seminars-2026/zh.md
- review/china-seminars-2026/zh.preview.html
- review/china-seminars-2026/zh.schema-draft.json
