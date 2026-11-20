import pathlib,json,subprocess,copy,collections
from lxml import html,etree
r=pathlib.Path(__file__).resolve().parents[2];base=pathlib.Path('/private/tmp/iga-profile-baseline');seo=json.loads((r/'seo-config.json').read_text());old=json.loads(subprocess.check_output(['git','show','HEAD:seo-config.json'],cwd=r));person='https://igalawfirm.com/#irmak-gurer-aksoz';li='https://www.linkedin.com/in/irmak-g%C3%BCrer-aks%C3%B6z-509148155/';checks=[]
assert len(seo)==257 and len(old)==253
for url,previous in old.items():
 current=copy.deepcopy(seo[url]);previous=copy.deepcopy(previous)
 for config in [current,previous]:
  for n in config['structuredData']['@graph']:
   if n.get('@id')==person:n.pop('url',None)
 assert current==previous,('Unexpected existing metadata/schema change',url)
 a=html.parse(str(base/url.strip('/')/'index.html'));b=html.parse(str(r/'dist'/url.strip('/')/'index.html'))
 assert a.xpath('//h1')[0].text_content()==b.xpath('//h1')[0].text_content(),url
 for aa,bb in zip(a.xpath('//article[contains(@class,"article-full")]'),b.xpath('//article[contains(@class,"article-full")]')):assert etree.tostring(aa)==etree.tostring(bb),('Article changed',url)
 for author in b.xpath('//a[@rel="author"]'):
  if 'Irmak' in author.text_content():assert author.get('href')=='/'+url.split('/')[1]+'/team/irmak-gurer-aksoz/'
assert (r/'article-content-history.json').read_bytes()==subprocess.check_output(['git','show','HEAD:article-content-history.json'],cwd=r)
for file in ['vercel.json','blog-slugs.json','styles.css','china-seminars-post.js']:
 assert (r/file).read_bytes()==subprocess.check_output(['git','show','HEAD:'+file],cwd=r),file
profiles=[];internal=set()
for lang in ['en','tr','zh','ar']:
 path='/'+lang+'/team/irmak-gurer-aksoz/';d=html.parse(str(r/'dist'/path.strip('/')/'index.html'));c=seo[path];g=c['structuredData']['@graph'];p=next(n for n in g if n['@type']=='ProfilePage');entity=next(n for n in g if n['@id']==person)
 assert p['mainEntity']=={'@id':person};assert entity['sameAs']==[li];assert entity['identifier']['value']=='14900';assert entity['knowsLanguage']==['tr','en'];assert entity['worksFor']=={'@id':'https://igalawfirm.com/#organization'}
 assert len({n['@id'] for n in g})==len(g)
 assert len(d.xpath('//h1'))==1;assert d.xpath('//html/@lang')==['zh-CN' if lang=='zh' else lang];assert d.xpath('//link[@rel="canonical"]/@href')==['https://igalawfirm.com'+path];assert len(d.xpath('//link[@rel="alternate"]'))==5
 assert c['openGraph']['image']=='https://igalawfirm.com/public/assets/media/b7935952b6d8df3c.jpg';assert c['robots']=='index,follow'
 link=d.xpath('//a[@href=$href]',href=li)[0];assert link.get('target')=='_blank' and set(link.get('rel').split())=={'noopener','noreferrer'}
 pic=d.xpath('//img[@class="irmak-portrait"]')[0];assert pic.get('width')=='386' and pic.get('height')=='440'
 assert len(d.xpath('//ol[@class="irmak-timeline"]/li'))==4
 assert len(d.xpath('//div[contains(@class,"irmak-body")]/section'))==8
 for a in d.xpath('//main//a[@href]'):
  h=a.get('href')
  if h.startswith('/'):
   assert h in seo,h;internal.add(h)
 profiles.append({'path':path,'title':c['title'],'description':c['description'],'canonical':c['canonical'],'hreflang':c['alternates']})
 # home/team/about contain canonical profile link, old fragment retained
 for parent in ['/','/team/','/about/']:
  q=html.parse(str(r/'dist'/lang/parent.strip('/')/'index.html'));assert q.xpath('//a[@href=$p]',p=path);assert q.xpath('//*[@id="irmak-gurer-aksoz"]')
# Sitemap existing entries completely unchanged.
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
def sm(p):return {x.find('s:loc',ns).text:etree.tostring(x) for x in etree.parse(str(p)).getroot()}
a=sm(base/'sitemap.xml');b=sm(r/'dist/sitemap.xml');assert len(b)==257;assert all(b[k]==v for k,v in a.items());assert (base/'robots.txt').read_bytes()==(r/'dist/robots.txt').read_bytes()
result={'profiles':profiles,'existingPagesChecked':253,'existingMetadataUnchangedExceptFounderProfileUrl':True,'articleBodiesAndDatesUnchanged':True,'existingSitemapEntriesAndRedirectsUnchanged':True,'internalLinks':sorted(internal)}
(r/'review/irmak-profile-20261121/validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print('PASS: 4 profiles, 253 existing pages, article bodies/dates, metadata, sitemap, redirects, Person identity, internal links')
