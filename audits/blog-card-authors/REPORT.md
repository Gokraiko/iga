# Blog archive author cards — 2026-11-14

Each blog listing card now displays its existing author identity above the title. Team authors use the existing team photo; editorial authors use the IGA logo, rendered with contain to preserve the logo. Localized Author labels are included in EN/TR/ZH/AR. Links retain the existing author profile/about destination.

Only app.js and scoped .blog-card CSS changed. No article content, article headers, existing author assignment, metadata, structured data, canonical, hreflang, sitemap, redirects or navigation changes.

Validation: 241-page build passed; only /en/blog/, /tr/blog/, /zh/blog/, /ar/blog/ HTML changed. Other 237 pages and all 241 SEO records are identical. Archive cards: EN 47, TR 44, ZH 46, AR 44. All four languages passed browser checks at 1440px and 390px: 36×36 images, correct logo/portrait and labels, authors above titles, no horizontal overflow, read counters remain hidden. No new runtime error; the previously documented property-module error remains outside scope.

Rollback baseline: 41fc91e0a204cf0476fab6494f785ec66b9fd3aa. Revert only this author-card implementation commit, preserving later unrelated changes.
