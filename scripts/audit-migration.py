#!/usr/bin/env python3
"""Build first. Local: python3 scripts/audit-migration.py
Live baseline: ... --live https://igalawfirm.com --baseline
Post-deploy acceptance: ... --live https://igalawfirm.com
Uses GET, never submits forms or increments the read-count API.
"""
import argparse, concurrent.futures, json, pathlib, re, sys
import urllib.error, urllib.parse, urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parents[1]
ORIGIN = 'https://igalawfirm.com'
seo = json.loads((ROOT / 'seo-config.json').read_text())
mapping = json.loads((ROOT / 'legacy-url-map.json').read_text())
config = json.loads((ROOT / 'vercel.json').read_text())
errors = []
def check(ok, message):
    if not ok: errors.append(message)

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.canonical=[]; self.alternates={}; self.links=[]; self.jsonld=[]; self.record=False; self.buf=''; self.lang=''; self.dir=''; self.noindex=False
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='html': self.lang=a.get('lang'); self.dir=a.get('dir')
        if tag=='meta' and a.get('name')=='robots': self.noindex='noindex' in a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical.append(a.get('href'))
        if tag=='link' and a.get('rel')=='alternate': self.alternates[a.get('hreflang')]=a.get('href')
        if tag=='a': self.links.append(a.get('href',''))
        if tag=='script' and a.get('type')=='application/ld+json': self.record=True; self.buf=''
    def handle_data(self, text):
        if self.record: self.buf+=text
    def handle_endtag(self, tag):
        if tag=='script' and self.record: self.jsonld.append(json.loads(self.buf)); self.record=False

redirects = {r['source']:r for r in config['redirects'] if not r.get('has')}
check('trailingSlash' not in config, 'Automatic slash redirect creates legacy chains')
check(len(redirects)==len([r for r in config['redirects'] if not r.get('has')]), 'Duplicate redirect')
check(not any('/post/:' in r['source'] for r in config['redirects']), 'Wildcard post redirect')
for row in mapping:
    for source in [row['old'],row['old'].rstrip('/')]:
        r=redirects.get(source,{})
        check(r.get('statusCode')==301 and r.get('destination')==ORIGIN+row['new'], 'Wrong mapping '+source)
    check(row['new'] in seo, 'Missing destination '+row['new'])
for source,r in redirects.items():
    dest=urllib.parse.urlsplit(r['destination']).path
    check(dest in seo, 'Noncanonical redirect target '+source)
    check(dest not in redirects, 'Chain/loop '+source)
    check(source not in seo, 'Current canonical redirected '+source)
    oldlang=source.split('/')[1]
    if oldlang in ['en','tr','zh','ar']: check(dest.split('/')[1]==oldlang,'Language conflict '+source)

for path,meta in seo.items():
    text=(ROOT/'dist'/path.lstrip('/')/'index.html').read_text()
    page=Page(text)
    check(page.canonical==[ORIGIN+path], 'Canonical '+path)
    check(not page.noindex, 'Unexpected noindex '+path)
    check(page.lang==meta['language'], 'HTML language '+path)
    if page.lang=='ar': check(page.dir=='rtl','RTL '+path)
    expected={x['hreflang']:x['href'] for x in meta['alternates']}
    check(page.alternates==expected and len(expected)==5, 'Hreflang '+path)
    for lang,href in expected.items():
        target=href.removeprefix(ORIGIN)
        check(target in seo and target not in redirects,'Alternate target '+path)
        if target in seo: check(any(x['href']==ORIGIN+path for x in seo[target]['alternates']), 'Reciprocal hreflang '+path)
    check(not re.search(r'Esentepe|Büyükdere|Ferko Signature|Şişli',text,re.I), 'Old address '+path)
    check('Bebek Mahallesi' in text,'Missing current address '+path)
    graph=[n for block in page.jsonld for n in block.get('@graph',[])]
    org=[n for n in graph if n.get('@id')==ORIGIN+'/#organization']
    check(len(org)==1 and 'Bebek' in str(org[0].get('address','')), 'Organization/address '+path)
    for n in graph:
        if n.get('@type')=='BlogPosting': check(n.get('url')==ORIGIN+path, 'Article URL '+path)
    for href in page.links:
        url=urllib.parse.urlsplit(urllib.parse.urljoin(ORIGIN+path,href))
        if url.netloc in ['igalawfirm.com','www.igalawfirm.com']:
            check(url.netloc=='igalawfirm.com', 'WWW internal link '+path+' '+href)
            check(url.path in seo, 'Noncanonical internal link '+path+' '+href)

tree=ET.parse(ROOT/'dist/sitemap.xml'); ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
locs=[n.text for n in tree.findall('.//s:loc',ns)]
check(len(locs)==len(set(locs)) and set(locs)=={ORIGIN+p for p in seo}, 'Sitemap mismatch')
robots=(ROOT/'dist/robots.txt').read_text()
check('Disallow:' not in robots and 'Sitemap: '+ORIGIN+'/sitemap.xml' in robots, 'Robots blocks crawl')
check('noindex' in (ROOT/'dist/404.html').read_text(),'Missing 404 noindex')

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs): return None
def fetch(url):
    url=urllib.parse.quote(url,safe=':/?=&%+#')
    req=urllib.request.Request(url,headers={'User-Agent':'IGA-Migration-Audit/1.0'})
    try: res=urllib.request.build_opener(NoRedirect).open(req,timeout=25)
    except urllib.error.HTTPError as exc: res=exc
    return res.status, res.headers.get('Location'), res.read().decode('utf-8',errors='replace')
def inspect(item):
    url,kind,target=item; start=url; hops=[]; text=''
    try:
        for _ in range(6):
            status,location,text=fetch(url)
            hops.append({'url':url,'status':status,'location':location})
            if status not in [301,302,303,307,308] or not location: break
            url=urllib.parse.urljoin(url,location)
            if url in [h['url'] for h in hops]: break
        result={'url':start,'kind':kind,'expected':target,'hops':hops}
        if kind=='current':
            result['ok']=len(hops)==1 and status==200 and Page(text).canonical==[ORIGIN+urllib.parse.urlsplit(start).path]
        elif kind=='missing': result['ok']=len(hops)==1 and status in [404,410]
        elif kind=='redirect': result['ok']=len(hops)==2 and hops[0]['status'] in [301,308] and url==target and status==200
        elif kind=='resource': result['ok']=len(hops)==1 and status==200
        return result
    except Exception as exc: return {'url':start,'kind':kind,'ok':False,'error':str(exc)}

parser=argparse.ArgumentParser(); parser.add_argument('--live'); parser.add_argument('--baseline',action='store_true'); parser.add_argument('--resume',action='store_true'); args=parser.parse_args()
print(f'Local audit: {len(seo)} pages, {len(mapping)} legacy paths, {len(config["redirects"])} redirect rules; {len(errors)} errors')
if errors: print('\n'.join(errors[:40]))
if args.live:
    base=args.live.rstrip('/'); jobs=[(base+p,'current',None) for p in seo]
    for row in mapping:
        jobs.extend((base+p,'redirect',ORIGIN+row['new']) for p in [row['old'],row['old'].rstrip('/')])
    jobs.extend((base+p,'missing',None) for p in ['/post/iga-migration-missing-article/','/post/iga-migration-missing-article','/tr/iga-migration-missing-page/'])
    jobs.extend((base+p,'resource',None) for p in ['/robots.txt','/sitemap.xml'])
    jobs.append(('https://www.igalawfirm.com/tr/services/?migration=1','redirect',ORIGIN+'/tr/services/?migration=1'))
    jobs.append(('https://www.igalawfirm.com/tr/igalawpracticeareas?migration=1','redirect',ORIGIN+'/tr/services/?migration=1'))
    outfile=ROOT/('SEO_MIGRATION_LIVE_BASELINE.json' if args.baseline else 'SEO_MIGRATION_LIVE_RESULTS.json')
    results=json.loads(outfile.read_text()) if args.resume and outfile.exists() else []
    done={r['url'] for r in results}
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: results.extend(pool.map(inspect,[j for j in jobs if j[0] not in done]))
    outfile.write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
    failed=[r for r in results if not r['ok']]
    print(f'Live audit: {len(results)} requests, {len(failed)} deviations; {outfile.name}')
    if not args.baseline: errors.extend(r['url'] for r in failed)
sys.exit(bool(errors))
