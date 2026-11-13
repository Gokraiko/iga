from pathlib import Path
import json,re,xml.etree.ElementTree as ET
r=Path(__file__).resolve().parents[2];b=Path('/private/tmp/iga-property-minimal');slug='buying-tenanted-apartment-istanbul-foreign-buyers';allowed=['/en/blog/','/zh/blog/'];newpaths=[f'/{l}/blog/{slug}/' for l in ['en','zh']]
old=json.loads((b/'seo-config.json').read_text());new=json.loads((r/'seo-config.json').read_text());assert set(new)-set(old)==set(newpaths);assert set(old)<=set(new)
assert all(old[k]==new[k] for k in old)
changed=[]
for k in old:
 p=Path('dist')/k.strip('/')/'index.html'
 if (r/p).read_bytes()!=(b/p).read_bytes():changed.append(k)
assert sorted(changed)==sorted(allowed),changed
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
def sitemap(root):return {x.find('s:loc',ns).text:ET.tostring(x) for x in ET.parse(root/'dist/sitemap.xml').getroot()}
x,y=sitemap(b),sitemap(r);assert all(y[k]==v for k,v in x.items());assert set(y)-set(x)=={'https://igalawfirm.com'+p for p in newpaths}
for file in ['styles.css','property-review.css','vercel.json','dist/robots.txt']:
 assert (r/file).read_bytes()==(b/file).read_bytes(),file
history=json.loads((b/'article-content-history.json').read_text());updated=json.loads((r/'article-content-history.json').read_text());assert all(updated[k]==v for k,v in history.items())
for lang,path in zip(['en','zh'],newpaths):
 s=(r/'dist'/path.strip('/')/'index.html').read_text();m=new[path]
 assert s.count('<h1 ')+s.count('<h1>')==1
 assert len(re.findall('<h3>',s))>=10
 assert m['canonical']=='https://igalawfirm.com'+path and m['robots']=='index,follow'
 assert {x['hreflang'] for x in m['alternates']}=={'en','zh-CN','x-default'}
 assert {x['href'] for x in m['alternates']}=={'https://igalawfirm.com'+p for p in newpaths}
 assert 'noindex' not in s and 'Draft awaiting' not in s and '尚待律师' not in s
 graph=m['structuredData']['@graph'];article=next(x for x in graph if x['@type']=='BlogPosting')
 assert article['author']['@type']=='Organization' and article['author']['name']=='IGA Law Firm Editorial Team'
 assert article['datePublished'].startswith('2026-11-13') and article['dateModified'].startswith('2026-11-13')
 assert not any(x['@type']=='FAQPage' for x in graph)
 articlebody=re.search(r'<article class="article article-full">(.*?)</article>',s,re.S).group(1)
 faqs=articlebody.split('Frequently Asked Questions' if lang=='en' else '常见问题',1)[1].split('<h2>',1)[0];assert faqs.count('<h3>')==10
 for url in re.findall(r'href="([^"]+)"',articlebody):
  if url.startswith('/'):
   assert url in new, url
   assert url.startswith('/'+lang+'/'),url
 assert '<strong>' in articlebody and '<ul>' in articlebody
# Screening all rendered article bodies for a substantially overlapping tenant-focused H1.
overlap=[]
for path,m in old.items():
 if m['pageType']=='BlogPosting':
  s=(b/'dist'/path.strip('/')/'index.html').read_text();h=re.search(r'<h1[^>]*>(.*?)</h1>',s,re.S).group(1)
  if re.search('tenant|tenanted|occupied|租客|租赁',h,re.I):overlap.append(path)
assert not overlap,overlap
report={'existingPages':len(old),'unchangedExistingPages':len(old)-len(changed),'changedExistingPages':changed,'newPages':newpaths,'existingSEORecordsUnchanged':True,'existingSitemapEntriesUnchanged':True,'existingContentHistoryUnchanged':True,'stylingRedirectsRobotsUnchanged':True,'newFAQsPerLanguage':10,'newAuthor':'IGA Law Firm Editorial Team','publicationDate':'2026-11-13','attorneyReviewClaimed':False,'overlappingTitles':overlap}
(r/'audits/tenanted-apartment/checks.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n');print(json.dumps(report,indent=2))
