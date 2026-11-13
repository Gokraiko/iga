from pathlib import Path
import json,re,shutil
folder=Path(__file__).parent;root=folder.parents[1]
data=json.loads((folder/'articles.json').read_text());images=json.loads((folder/'images.json').read_text());slug=data['en']['path'].strip('/').split('/')[-1];slugs={lang:a['path'].strip('/').split('/')[-1] for lang,a in data.items()};variants={}
source=Path('/Users/sinanaksoz/Documents/ChatGPT/igalawfirm/review/china-seminars-2026/assets')
for i in images:
 target=root/'public/assets'/i['filename'];assert not target.exists() or target.read_bytes()==(source/i['filename']).read_bytes();shutil.copy2(source/i['filename'],target)
 v={'width':i['width'],'height':i['height']}
 if i['webpBytes']<i['bytes']:
  shutil.copy2(source/i['webp'],root/'public/assets'/i['webp']);v['webp']='/public/assets/'+i['webp']
 variants['/public/assets/'+i['filename']]=v
copy={};body={}
for lang,a in data.items():
 md=folder/(lang+'.md');text=md.read_text().replace('**Publication status:** Unpublished draft. The actual publication date will be set after approval.','**Publication date:** 13 November 2026.').replace('**发布状态：**未发布草稿。批准发布后填写实际发布日期。','**发布日期：**2026年11月13日。');md.write_text(text)
 raw=(folder/(lang+'.body.html')).read_text().replace('<strong>Publication status:</strong> Unpublished draft. The actual publication date will be set after approval.','<strong>Publication date:</strong> 13 November 2026.').replace('<strong>发布状态：</strong>未发布草稿。批准发布后填写实际发布日期。','<strong>发布日期：</strong>2026年11月13日。')
 assert 'Unpublished' not in raw and '未发布' not in raw
 raw=raw.replace('<a href=', '<a style="text-decoration:underline;text-underline-offset:3px" href=')
 counter=[0]
 def replace(m):counter[0]+=1;return '{{IMAGE_'+str(counter[0])+'}}'
 raw=re.sub(r'<figure class="article-inline-image">.*?</figure>',replace,raw,flags=re.S);assert counter[0]==4;body[lang]=raw
 copy[lang]={k:a[k] for k in ['title','seoTitle','metaDescription','blocks']};copy[lang].update(imageAlt=images[0]['alt'][lang],imageDescription=images[0]['caption'][lang],imageTitle=images[0]['alt'][lang]);copy[lang]['blocks']=[dict(b,text=b.get('text',b.get('markdown',''))) for b in a['blocks']]
for lang in copy:
 for block in copy[lang]['blocks']:
  for key in ['text','markdown']:
   if key in block:
    block[key]=block[key].replace('**Publication status:** Unpublished draft. The actual publication date will be set after approval.','**Publication date:** 13 November 2026.').replace('**发布状态：**未发布草稿。批准发布后填写实际发布日期。','**发布日期：**2026年11月13日。')
article={'slug':slug,**{k:copy['en'][k] for k in ['title','seoTitle','metaDescription']},'date':'2026','publishedAt':'2026-11-13','updatedAt':'2026-11-13','publicationStatus':'published','availableLanguages':['en','zh'],'category':'Firm news','author':{'type':'Organization','name':'IGA Law Firm Editorial Team'},'faqSchema':False}
def js(x):return json.dumps(x,ensure_ascii=False,indent=2)
s='// User-confirmed November 2026 China seminar series. New EN/ZH article only.\n{\n const slug='+js(slug)+';\n const slugs='+js(slugs)+';\n const copy='+js(copy)+';\n const bodies='+js(body)+';\n const images='+js(images)+';\n window.chinaSeminarArticle='+js(article)+';\n window.blogPostContent[slug]={...copy.en,heroImage:"/public/assets/"+images[0].filename};\n window.blogPostTranslations=window.blogPostTranslations||{};\n window.blogPostTranslations.zh=window.blogPostTranslations.zh||{};\n window.blogPostTranslations.zh[slug]=copy.zh;\n Object.assign(window.blogImageVariants,'+js(variants)+');\n for(const lang of ["en","zh"])window.finalSeoMetadata["/"+lang+"/blog/"+slugs[lang]+"/"]={title:copy[lang].seoTitle,description:copy[lang].metaDescription};\n window.chinaSeminarPost={slug,slugs,\n  normalize(lang,sub){return sub===slugs[lang]?slug:sub},\n  localized(lang,sub){return sub===slug?(slugs[lang]||sub):sub},\n  render(lang,esc,imageMarkup){return bodies[lang].replace(/\\{\\{IMAGE_(\\d)\\}\\}/g,(_,id)=>{const item=images[Number(id)-1];const image=imageMarkup("/public/assets/"+item.filename,item.alt[lang],"",Number(id)>1).replace("<img ","<img style=\\"max-height:none;height:auto\\" ");return `<figure class="article-inline-image">${image}<figcaption>${esc(item.caption[lang])}</figcaption></figure>`;});}\n };\n}\n'
(root/'china-seminars-post.js').write_text(s)
