const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const origin = 'https://igalawfirm.com';
const languages = ['en', 'tr', 'zh'];
const template = fs.readFileSync('index.html', 'utf8');
const out = path.join(__dirname, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'public'), { recursive: true });
for (const file of ['app.js', 'blog-posts-data.js', 'citizenship-content.js', 'styles.css']) {
  fs.copyFileSync(file, path.join(out, file));
}
fs.cpSync('public/assets', path.join(out, 'public/assets'), { recursive: true });

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
const window = { addEventListener() {}, blogPostContent: {} };
let location = { pathname: '/', hash: '', replace() {} };
const context = vm.createContext({ window, document, location, console, Date, FormData: class {} });
for (const file of ['blog-posts-data.js', 'citizenship-content.js', 'app.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}
const slugs = vm.runInContext('articles.map(article => article.slug)', context);
const pages = ['home', 'services', 'investment', 'team', 'about', 'journal', 'contact',
  'igaturkishcitizenshipbyinvestment', 'igalawworkpermit', 'igalawcorporatelaw',
  'igalawlegalconsultancy', 'igalawlitigation', 'igalawresidencepermit',
  'igalawrealestateduediligence', 'igalawdocumentation'];
const routes = pages.map(page => ({ page, sub: '' })).concat(slugs.map(sub => ({ page: 'journal', sub })));
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const urlFor = (lang, route) => vm.runInContext(`pathFor(${JSON.stringify(lang)},${JSON.stringify(route.page)},${JSON.stringify(route.sub)})`, context);

const sitemap = [];
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
    const canonical = origin + (route.sub && lang !== 'en' ? urlFor('en', route) : pathname);
    const alternates = route.sub ? '' : languages.map(code => `<link rel="alternate" hreflang="${code === 'zh' ? 'zh-CN' : code}" href="${origin + urlFor(code, route)}" />`).join('\n    ');
    const head = `<link rel="canonical" href="${escapeHtml(canonical)}" />
    ${alternates}
    <meta property="og:type" content="${route.sub ? 'article' : 'website'}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json" id="iga-structured-data">${schema.textContent.replace(/<\//g, '<\\/')}</script>`;
    const html = template
      .replace('<html lang="en">', `<html lang="${lang === 'zh' ? 'zh-CN' : lang}">`)
      .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
      .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace('</head>', `    ${head}\n  </head>`)
      .replace('<div id="app"></div>', `<div id="app">${document.app.innerHTML}</div>`);
    const dir = path.join(out, pathname);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    const hreflang = route.sub ? '' : languages.map(code => `<xhtml:link rel="alternate" hreflang="${code === 'zh' ? 'zh-CN' : code}" href="${escapeHtml(origin + urlFor(code, route))}"/>`).join('');
    if (!route.sub || lang === 'en') sitemap.push(`<url><loc>${escapeHtml(canonical)}</loc>${hreflang}</url>`);
  }
}

fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${sitemap.join('')}</urlset>\n`);
fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
fs.writeFileSync(path.join(out, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/en/"><script>location.replace('/en/'+location.hash)</script></head><body><a href="/en/">IGA Law Firm</a></body></html>`);
console.log(`Generated ${routes.length * languages.length} localized pages and ${sitemap.length} sitemap entries`);
