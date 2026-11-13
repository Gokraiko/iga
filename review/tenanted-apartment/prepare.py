from pathlib import Path
import re,json
root=Path(__file__).resolve().parents[2]
folder=Path(__file__).parent
slug='buying-tenanted-apartment-istanbul-foreign-buyers'
meta={
'en':{'title':'Buying an Apartment in Istanbul with a Tenant: What Foreign Buyers Must Know Before Purchasing','seoTitle':'Buying a Tenanted Apartment in Istanbul | IGA Law','metaDescription':'Buying a tenanted apartment in Istanbul? Learn about tenant rights, eviction rules, rental income and legal checks with IGA Law Firm.'},
'zh':{'title':'在伊斯坦布尔购买带租客的公寓：外国买家购房前必须了解的法律问题','seoTitle':'伊斯坦布尔购买带租客的房产｜租客权利与法律风险｜IGA律师事务所','metaDescription':'想在伊斯坦布尔购买已有租客的公寓？了解土耳其租客保护、房屋出售后的租约、租金收入及购房法律审查。IGA律师事务所为外国投资者提供法律支持。'}}
def inline(s):
 out=[];pos=0
 for m in re.finditer(r'\*\*(.+?)\*\*',s):
  if m.start()>pos:out.append({'text':s[pos:m.start()]})
  out.append({'type':'strong','text':m[1]});pos=m.end()
 if pos<len(s):out.append({'text':s[pos:]})
 return out
for lang in ['en','zh']:
 s=(folder/(lang+'.md')).read_text()
 if lang=='en':
  s=s.replace('**Review status:** Draft awaiting attorney legal review and publication approval.','**Published:** 13 November 2026.')
  s=s.replace('**Legal review date:** Pending; an actual date must be recorded before publication.','**Editorial source check:** 13 November 2026. This date records source verification, not an individual attorney review.')
  s=s.replace('## Author and Legal Review','## Author and Sources')
 else:
  s=s.replace('**审阅状态：**草稿，尚待律师法律审阅和发布批准。正式发布前须填写真实的法律审阅日期。','**发布日期：**2026年11月13日。\n\n**编辑资料核查日期：**2026年11月13日。该日期记录资料核查，不代表个别律师已完成法律审阅。')
  s=s.replace('## 编写与法律审阅','## 编写与资料核查')
 (folder/(lang+'.md')).write_text(s)
 blocks=[]
 for chunk in re.split(r'\n\s*\n',s.strip()):
  if chunk.startswith('# ') or chunk=='---':continue
  if chunk.startswith('|'):
   rows=[x.strip().strip('|').split('|') for x in chunk.splitlines()]
   heads=[x.strip() for x in rows[0]]
   for cells in rows[2:]:
    cells=[x.strip() for x in cells]
    blocks.append({'type':'list','text':f'{cells[0]} — {heads[1]}: {cells[1]}; {heads[2]}: {cells[2]}.'})
   continue
  if chunk.startswith('- ') or re.match(r'1\. ',chunk):
   for line in chunk.splitlines():blocks.append({'type':'list','text':re.sub(r'^(?:- |\d+\. )','',line)})
   continue
  m=re.match(r'^(#{2,4}) (.*)$',chunk)
  if m:blocks.append({'type':'heading','level':len(m[1]),'text':m[2]});continue
  m=re.fullmatch(r'\[(.*?)\]\((https://[^)]+)\)',chunk)
  if m:
   label,url=m.groups()
   if url.startswith('https://igalawfirm.com/'):
    seg=url.split('/')[4:];page=seg[0];sub=seg[1] if len(seg)>1 else ''
    if page=='blog':page='journal'
    if page in ['turkish-citizenship-by-investment-lawyer','tuerqi-touzi-ruji-lushi']:page='igaturkishcitizenshipbyinvestment'
    blocks.append({'type':'paragraph','text':label,'inline':[{'type':'link','text':label,'page':page,'slug':sub}]})
   else:blocks.append({'type':'source','text':label,'url':url})
   continue
  if re.fullmatch(r'https://\S+',chunk):blocks.append({'type':'source','text':'Turkish Code of Obligations — official text','url':chunk});continue
  blocks.append({'type':'paragraph','text':re.sub(r'\*\*(.*?)\*\*',r'\1',chunk),'inline':inline(chunk)})
 meta[lang]['blocks']=blocks
article={'slug':slug,**{k:v for k,v in meta['en'].items() if k!='blocks'},'date':'2026','publishedAt':'2026-11-13','updatedAt':'2026-11-13','publicationStatus':'published','availableLanguages':['en','zh'],'category':'Real estate','author':{'type':'Organization','name':'IGA Law Firm Editorial Team'},'faqSchema':False}
js='// New EN/ZH article only; existing templates, styles and page content are reused.\n{\n const slug='+json.dumps(slug)+';\n const copy='+json.dumps(meta,ensure_ascii=False,indent=2)+';\n window.tenantedApartmentArticle='+json.dumps(article,ensure_ascii=False)+';\n window.blogPostContent[slug]=copy.en;\n window.blogPostTranslations=window.blogPostTranslations||{};\n window.blogPostTranslations.zh=window.blogPostTranslations.zh||{};\n window.blogPostTranslations.zh[slug]=copy.zh;\n window.finalSeoMetadata=window.finalSeoMetadata||{};\n for(const lang of ["en","zh"])window.finalSeoMetadata["/"+lang+"/blog/"+slug+"/"]={title:copy[lang].seoTitle,description:copy[lang].metaDescription};\n}\n'
(root/'tenanted-apartment-post.js').write_text(js)
(folder/'metadata.json').write_text(json.dumps({k:{a:b for a,b in v.items() if a!='blocks'} for k,v in meta.items()},ensure_ascii=False,indent=2)+'\n')
print({l:len(v['blocks']) for l,v in meta.items()})
