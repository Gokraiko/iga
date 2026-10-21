const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const origin = 'https://igalawfirm.com';
const languages = ['en', 'tr', 'zh', 'ar'];
const template = fs.readFileSync('index.html', 'utf8');
const out = path.join(__dirname, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'public'), { recursive: true });
for (const file of ['seo-final-metadata.js', 'seo-optimizations.js', 'app.js', 'article-views.js', 'blog-posts-data.js', 'new-blog-posts-data.js', 'valuation-exemption-post.js', 'bank-deposit-guide-update.js', 'renunciation-post.js', 'citizenship-approvals-update.js', 'real-estate-2025-post.js', 'turkish-parent-work-permit-post.js', 'company-owner-work-permit-2025-post.js', 'bes-citizenship-funds-guide-post.js', 'military-service-abroad-guide-post.js', 'office-news-update.js', 'citizenship-content.js', 'citizenship-lawyer-process.js', 'practice-area-copy.js', 'litigation-content.js', 'work-permit-content.js', 'residence-permit-content.js', 'corporate-content.js', 'property-due-diligence-content.js', 'legal-consultancy-content.js', 'documentation-services-content.js', 'arabic-content.js', 'styles.css']) {
  fs.copyFileSync(file, path.join(out, file));
}
fs.cpSync('public/assets', path.join(out, 'public/assets'), { recursive: true });
fs.copyFileSync('google3d5df3fe239ec586.html', path.join(out, 'google3d5df3fe239ec586.html'));

const emptyNode = () => ({ addEventListener() {}, querySelector: emptyNode, querySelectorAll: () => [] });
function createDocument() {
  const headItems = [];
  const app = { innerHTML: '' };
  return {
    app,
    headItems,
    title: '',
    documentElement: { lang: 'en' },
    head: { appendChild(node) { headItems.push(node); } },
    createElement(tag) { return { tag, setAttribute(name, value) { this[name] = value; } }; },
    getElementById(id) { return id === 'app' ? app : id === 'language' ? emptyNode() : null; },
    querySelector(selector) { return selector === '.menu-toggle' ? emptyNode() : null; }
  };
}

let document = createDocument();
const window = { addEventListener() {}, blogPostContent: {}, __BUILD_SEO__: true };
let location = { pathname: '/', hash: '', replace() {} };
const context = vm.createContext({ window, document, location, console, Date, FormData: class {} });
for (const file of ['blog-posts-data.js', 'new-blog-posts-data.js', 'blog-post-translations.js', 'valuation-exemption-post.js', 'bank-deposit-guide-update.js', 'renunciation-post.js', 'citizenship-approvals-update.js', 'real-estate-2025-post.js', 'turkish-parent-work-permit-post.js', 'company-owner-work-permit-2025-post.js', 'bes-citizenship-funds-guide-post.js', 'military-service-abroad-guide-post.js', 'office-news-update.js', 'citizenship-content.js', 'arabic-content.js', 'citizenship-lawyer-process.js', 'practice-area-copy.js', 'litigation-content.js', 'work-permit-content.js', 'residence-permit-content.js', 'corporate-content.js', 'property-due-diligence-content.js', 'legal-consultancy-content.js', 'documentation-services-content.js', 'seo-optimizations.js', 'seo-final-metadata.js', 'app.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}
const slugs = vm.runInContext('articles.map(article => article.slug)', context);
fs.writeFileSync('blog-slugs.json', JSON.stringify(slugs, null, 2) + '\n');
const pages = ['home', 'services', 'investment', 'team', 'about', 'journal', 'contact',
  'igaturkishcitizenshipbyinvestment', 'igalawworkpermit', 'igalawcorporatelaw',
  'igalawlegalconsultancy', 'igalawlitigation', 'igalawresidencepermit',
  'igalawrealestateduediligence', 'igalawdocumentation'];
const routes = pages.map(page => ({ page, sub: '' })).concat(slugs.map(sub => ({ page: 'journal', sub })));
for (const slug of slugs) {
  const source = window.blogPostContent[slug];
  for (const lang of languages.filter(code => code !== 'en')) {
    const translated = window.blogPostTranslations?.[lang]?.[slug];
    if (!source || !translated?.title || !translated?.seoTitle || !translated?.metaDescription || translated.blocks?.length !== source.blocks?.length) {
      throw new Error(`Incomplete ${lang} translation for ${slug}`);
    }
  }
}
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const urlFor = (lang, route) => vm.runInContext(`pathFor(${JSON.stringify(lang)},${JSON.stringify(route.page)},${JSON.stringify(route.sub)})`, context);

const sitemap = [];
const seoConfig = {};
for (const route of routes) {
  for (const lang of languages) {
    const pathname = urlFor(lang, route);
    document = createDocument();
    location = { pathname, hash: '', replace() {} };
    context.document = document;
    context.location = location;
    vm.runInContext('render()', context);
    const meta = document.headItems.find(item => item.name === 'description');
    const schema = document.headItems.find(item => item.id === 'iga-structured-data');
    const title = document.title;
    const description = meta?.content || '';
    if (!title.trim() || !description.trim() || /[…]|\.\.\.$|:$/.test(description)) throw new Error(`Missing or truncated metadata: ${pathname}`);
    const canonical = origin + pathname;
    const alternateEntries = languages.map(code => ({ hreflang: code === 'zh' ? 'zh-CN' : code, href: origin + urlFor(code, route) })).concat({ hreflang: 'x-default', href: origin + urlFor('en', route) });
    const structuredData = JSON.parse(schema?.textContent || '{"@context":"https://schema.org","@graph":[]}');
    const graph = structuredData['@graph'] || [];
    const blogPosting = graph.find(item => item['@type'] === 'BlogPosting');
    const pageType = route.sub ? 'BlogPosting' : ['igaturkishcitizenshipbyinvestment','igalawworkpermit','igalawcorporatelaw','igalawlegalconsultancy','igalawlitigation','igalawresidencepermit','igalawrealestateduediligence','igalawdocumentation'].includes(route.page) ? 'Service' : route.page === 'journal' ? 'Blog' : route.page;
    const languageCode = lang === 'zh' ? 'zh-CN' : lang;
    const ogImage = blogPosting?.image || origin + '/public/assets/bosphorus-editorial.jpg';
    const pageConfig = { path: pathname, language: languageCode, pageType, title, description, canonical, alternates: alternateEntries, robots: 'index,follow', openGraph: { type: route.sub ? 'article' : 'website', locale: lang === 'zh' ? 'zh_CN' : lang === 'ar' ? 'ar_AR' : lang === 'tr' ? 'tr_TR' : 'en_US', url: canonical, title, description, image: ogImage }, structuredData };
    seoConfig[pathname] = pageConfig;
    const alternateHtml = alternateEntries.map(item => `<link rel="alternate" hreflang="${item.hreflang}" href="${escapeHtml(item.href)}" />`).join('\n    ');
    const head = `<link rel="canonical" href="${escapeHtml(pageConfig.canonical)}" />
    ${alternateHtml}
    ${pageConfig.robots === 'noindex,follow' ? '<meta name="robots" content="noindex,follow" />' : ''}
    <meta property="og:type" content="${pageConfig.openGraph.type}" />
    <meta property="og:locale" content="${pageConfig.openGraph.locale}" />
    <meta property="og:url" content="${escapeHtml(pageConfig.openGraph.url)}" />
    <meta property="og:title" content="${escapeHtml(pageConfig.openGraph.title)}" />
    <meta property="og:description" content="${escapeHtml(pageConfig.openGraph.description)}" />
    <meta property="og:image" content="${escapeHtml(pageConfig.openGraph.image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(pageConfig.openGraph.image)}" />
    <script type="application/ld+json" id="iga-structured-data">${JSON.stringify(pageConfig.structuredData).replace(/<\//g, '<\\/')}</script>`;
    const html = template
      .replace('<html lang="en">', `<html lang="${lang === 'zh' ? 'zh-CN' : lang}"${lang === 'ar' ? ' dir="rtl"' : ''}>`)
      .replace(/<meta name="description" content="[^"]*" \/>/, () => `<meta name="description" content="${escapeHtml(description)}" />`)
      .replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
      .replace('</head>', () => `    ${head}\n  </head>`)
      .replace('<div id="app"></div>', () => `<div id="app">${document.app.innerHTML}</div>`);
    const dir = path.join(out, pathname);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    const sitemapAlternates = alternateEntries.map(item => `<xhtml:link rel="alternate" hreflang="${item.hreflang}" href="${escapeHtml(item.href)}"/>`).join('');
    sitemap.push(`<url><loc>${escapeHtml(canonical)}</loc>${sitemapAlternates}</url>`);
  }
}

fs.writeFileSync(path.join(__dirname, 'seo-config.json'), JSON.stringify(seoConfig, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'seo-config.json'), JSON.stringify(seoConfig, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${sitemap.join('')}</urlset>\n`);
fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
fs.writeFileSync(path.join(out, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"></head><body><a href="/en/">IGA Law Firm</a></body></html>`);
fs.writeFileSync(path.join(out, '404.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Page not found | IGA Law Firm</title></head><body><main><h1>Page not found</h1><p>This page is unavailable. Browse our current website:</p><nav><a href="/en/">English</a> · <a href="/tr/">Türkçe</a> · <a href="/zh/">中文</a> · <a href="/ar/">العربية</a></nav></main></body></html>');
fs.copyFileSync('google3d5df3fe239ec586.html', path.join(out, 'en', 'google3d5df3fe239ec586.html'));
// Review builds must preserve the audited routing configuration.
if (!process.argv.includes('--preserve-routing')) require('./scripts/generate-redirects')(seoConfig);
console.log(`Generated ${routes.length * languages.length} localized pages and ${sitemap.length} sitemap entries`);
