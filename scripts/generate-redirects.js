// Run after generate-static.js, before Vercel reads project configuration.
const fs = require('node:fs');
const origin = 'https://igalawfirm.com';
function generateRedirects(seo) {
  const map = JSON.parse(fs.readFileSync('legacy-url-map.json', 'utf8'));
  const redirects = [{ source: '/', destination: origin + '/en/', statusCode: 307 }];
  const seen = new Set(['/']);
  const add = (source, destination) => {
    if (seen.has(source)) throw new Error(`Duplicate redirect: ${source}`);
    seen.add(source);
    redirects.push({ source, destination: origin + destination, statusCode: 301 });
  };
  for (const row of map) {
    if (!seo[row.new] || seo[row.old]) throw new Error(`Unsafe migration: ${row.old}`);
    add(row.old.slice(0, -1), row.new);
    add(row.old, row.new);
  }
  // Normalize only actual pages. Unknown URLs remain real 404s.
  for (const pathname of Object.keys(seo)) {
    add(pathname.slice(0, -1), pathname);
    add(pathname + 'index.html', pathname);
  }
  add('/index.html', '/en/');
  redirects.push({ source: '/:path(.*)', has: [{ type: 'host', value: 'www.igalawfirm.com' }], destination: origin + '/:path', statusCode: 301 });
  if (redirects.length > 1024) throw new Error('Vercel redirect limit exceeded');
  const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  // Automatic slash normalization runs before custom redirects and creates chains.
  // Explicit canonical-page redirects above retain the existing trailing-slash URLs.
  delete config.trailingSlash;
  config.redirects = redirects;
  fs.writeFileSync('vercel.json', JSON.stringify(config, null, 2) + '\n');
  return redirects.length;
}
module.exports = generateRedirects;
if (require.main === module) console.log(`Generated ${generateRedirects(JSON.parse(fs.readFileSync('seo-config.json', 'utf8')))} redirects`);
