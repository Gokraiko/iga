from pathlib import Path
import json,re,subprocess
root=Path(__file__).resolve().parents[1]
before=json.loads(subprocess.check_output(['git','show','HEAD:seo-config.json'],cwd=root,text=True));after=json.loads((root/'seo-config.json').read_text())
assert before==after,'SEO metadata/schema/canonical/alternates changed'
assert (root/'vercel.json').read_bytes()==subprocess.check_output(['git','show','HEAD:vercel.json'],cwd=root),'Redirect changes'
results=[]
for lang in ['en','tr','zh','ar']:
 copy=json.loads((root/f'review/property-review/{lang}.json').read_text());home=(root/f'dist/{lang}/index.html').read_text();form=(root/f'dist/{lang}/igalawrealestateduediligence/index.html').read_text()
 assert home.count('data-property-start')==1 and form.count('data-property-inquiry')==1
 assert 'type="file"' not in form and 'data-clarity-mask="true"' in form
 assert copy['nav'] in home and f'/{lang}/igalawrealestateduediligence/' in home
 assert f'/{lang}/about/' in after
 lawyer={'en':'turkish-citizenship-by-investment-lawyer','tr':'yatirim-yoluyla-turk-vatandasligi-avukati','zh':'tuerqi-touzi-ruji-lushi','ar':'turkish-citizenship-by-investment-lawyer'}[lang]
 service=(root/f'dist/{lang}/{lawyer}/index.html').read_text();assert service.count('class="property-eligibility-cta"')==1
 assert 'pr_service=citizenship&amp;pr_purpose=citizenship' in service
 for page in [home,form,service]:assert len(re.findall(r'<h1\b',page))==1 and 'noindex' not in page
 results.append({'language':lang,'homeShortForm':True,'propertyForm':True,'citizenshipCTA':True,'noUploads':True,'privacyMasked':True,'aboutRoutePreserved':True})
report={'seoRecordsCompared':len(before),'seoRecordsChanged':0,'routesAdded':0,'routesRemoved':0,'redirectsChanged':0,'languages':results,'realEmailDelivery':'not tested: existing server credentials unavailable in development environment','publication':'not deployed'}
(root/'audits/property-review-2026-11-11/seo-and-languages.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
