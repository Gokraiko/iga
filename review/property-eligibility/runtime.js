 const heroImage='/public/assets/turkish-citizenship-real-estate-2025.jpg';
 const service={en:'/en/turkish-citizenship-by-investment-lawyer/',tr:'/tr/yatirim-yoluyla-turk-vatandasligi-avukati/',zh:'/zh/tuerqi-touzi-ruji-lushi/',ar:'/ar/turkish-citizenship-by-investment-lawyer/'};
 const cta={
  en:['Buying Property for Turkish Citizenship? Request a Legal Review Before You Commit.','Already selected an apartment or received an offer from a developer? Contact IGA Law Firm to discuss the legal documents and eligibility checks relevant to your proposed investment.','Request a Property Legal Review'],
  tr:['Türk Vatandaşlığı İçin Taşınmaz mı Alıyorsunuz? Taahhütte Bulunmadan Önce Hukuki İnceleme Talep Edin.','Bir daire seçtiniz veya bir müteahhitten teklif aldınız mı? Planladığınız yatırıma ilişkin hukuki belgeleri ve uygunluk kontrollerini görüşmek için IGA Hukuk Bürosu ile iletişime geçin.','Taşınmaz İçin Hukuki İnceleme Talep Edin'],
  zh:['准备购房取得土耳其国籍？作出承诺前，请先进行法律审查。','已选定公寓或收到开发商报价？请联系IGA律师事务所，讨论拟投资交易所需的法律文件及资格核查。','申请房产法律审查'],
  ar:['هل تشتري عقارًا للحصول على الجنسية التركية؟ اطلب مراجعة قانونية قبل الالتزام.','هل اخترت شقة أو تلقيت عرضًا من مطوّر عقاري؟ تواصل مع مكتب IGA لمناقشة المستندات القانونية والتحقق من الأهلية المتعلقة باستثمارك المقترح.','اطلب مراجعة قانونية للعقار']
 };
 const sourceLabels={
  en:['Official investment and citizenship requirements','TKGM: investment amount confirmation (TTB)','TKGM: 29 September 2026 amendment notice — read with Circular 2024/4','Ministry of Culture and Tourism: tourist rental permit applications'],
  tr:['Resmî yatırım ve vatandaşlık koşulları','TKGM: yatırım tutarının TTB ile teyidi','TKGM: 29 Eylül 2026 değişiklik duyurusu — 2024/4 sayılı Genelge ile birlikte okunmalıdır','Kültür ve Turizm Bakanlığı: turizm amaçlı konut kiralama başvuruları'],
  zh:['官方投资及入籍条件','TKGM：投资金额确认文件（TTB）','TKGM：2026年9月29日修订公告——请与2024/4号通函一并阅读','文化和旅游部：旅游短租许可申请'],
  ar:['الشروط الرسمية للاستثمار والجنسية','TKGM: تأكيد مبلغ الاستثمار بوثيقة TTB','TKGM: إعلان التعديل بتاريخ 29 سبتمبر 2026 — يُقرأ مع التعميم 2024/4','وزارة الثقافة والسياحة: طلبات تصريح التأجير السياحي']
 };
 const sourceUrls=['https://www.invest.gov.tr/en/investmentguide/pages/acquiring-property-and-citizenship.aspx','https://tkgm.gov.tr/yabanci-isler-dairesi-baskanligi/haberler/turk-vatandasligi-kanunu-uygulama-yonetmeligi-hk-20244-sayili-genelge','https://www.tkgm.gov.tr/duyurular/20244-sayili-genelge-degisikligi-hakkinda-duyuru','https://yigm.ktb.gov.tr/TR-436391/turizm-amacli-konut-kiralama-basvurulari.html'];
 function render(lang,esc,pathFor,imageMarkup){
  const d=copy[lang];
  const safeHref=href=>/^(?:https:\/\/|\/(?!\/))/.test(href||'')?href:'#';
  const inline=parts=>parts.map(p=>p.type==='strong'?`<strong>${esc(p.text)}</strong>`:p.type==='em'?`<em>${esc(p.text)}</em>`:p.type==='link'?`<a href="${esc(safeHref(p.href))}"${p.href.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':''}>${esc(p.text)}</a>`:esc(p.text)).join('');
  const citation=n=>`<p class="article-source"><a href="${sourceUrls[n]}" target="_blank" rel="noopener noreferrer">${esc(sourceLabels[lang][n])}</a></p>`;
  let section=0,citedQuick=false,citedValue=false,citedRent=false,ctaDone=false;
  const body=d.blocks.map((b,i)=>{
   let html='';
   if(b.type==='heading'){
    if(b.level===2)section++;
    html=`<h${b.level}>${esc(b.text)}</h${b.level}>`;
   }else if(b.type==='items'){
    const tag=b.ordered?'ol':'ul';html=`<${tag}>${b.items.map(x=>`<li>${inline(x)}</li>`).join('')}</${tag}>`;
   }else if(b.type==='table'){
    html=`<section class="seo-comparison"><div class="seo-table-scroll"><table><thead><tr>${b.headers.map(x=>`<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(row=>`<tr><th scope="row">${esc(row[0])}</th>${row.slice(1).map((x,j)=>`<td data-country="${esc(b.headers[j+1])}">${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
   }else{
    const parts=b.inline||[{type:'text',text:b.text}];
    // Promote the supplied standalone consultation link into the existing button/CTA design.
    if(!ctaDone && section===12 && parts.length===1 && parts[0].type==='link' && parts[0].href===service[lang]){
     const c=cta[lang];html=`<aside class="property-eligibility-cta"><h3>${esc(c[0])}</h3><p>${esc(c[1])}</p><a class="button" href="${service[lang]}">${esc(c[2])} ↗</a></aside>`;ctaDone=true;
    }else html=`<p>${inline(parts)}</p>`;
    if(section===1 && !citedQuick){html+=citation(0);citedQuick=true;}
    if(!citedValue&&b.text?.includes('TTB')){html+=citation(1)+citation(2);citedValue=true;}
    if(!citedRent&&b.text?.includes('Airbnb')){html+=citation(3);citedRent=true;}
   }
   // Keep the immediate answer ahead of the decorative cover.
   if(i===3)html+=`<figure class="article-cover">${imageMarkup(heroImage,d.imageAlt,d.imageTitle,true)}</figure>`;
   return html;
  }).join('');
  return `<div class="article-content property-eligibility-content" lang="${lang==='zh'?'zh-CN':lang}" dir="${lang==='ar'?'rtl':'ltr'}">${body}</div>`;
 }
 window.blogPostContent=window.blogPostContent||{};
 window.blogPostContent[slug]={...copy.en,heroImage,heroAlt:copy.en.imageAlt};
 window.blogPostTranslations=window.blogPostTranslations||{};
 window.finalSeoMetadata=window.finalSeoMetadata||{};
 for(const lang of ['en','tr','zh','ar']){
  if(lang!=='en'){window.blogPostTranslations[lang]=window.blogPostTranslations[lang]||{};window.blogPostTranslations[lang][slug]=copy[lang];}
  window.finalSeoMetadata['/'+lang+'/blog/'+slug+'/']={title:copy[lang].seoTitle,description:copy[lang].metaDescription};
 }
 window.propertyEligibilityArticle={slug,title:copy.en.title,seoTitle:copy.en.seoTitle,metaDescription:copy.en.metaDescription,date:publicationDate?.slice(0,4)||'',publishedAt:publicationDate,updatedAt:publicationDate,legalReviewDate,publicationStatus:publicationDate?'published':'draft',category:'Real estate',author:'Irmak Gürer Aksöz',authorPresentation:'profile-card',faqSchema:false};
 window.propertyEligibilityPost={slug,render};
 // A single contextual cross-link; preserve the existing guide's wording and route.
 const guide='turkish-citizenship-by-real-estate-investment-2025-complete-guide';
 const context={en:['Before committing to a property, use our ','seven-check property eligibility guide',' to review the title, seller, value and payment evidence.'],tr:['Bir taşınmaz için taahhütte bulunmadan önce tapu, satıcı, değer ve ödeme belgelerini değerlendirmek üzere ','yedi adımda taşınmaz uygunluğu rehberimizi',' inceleyin.'],zh:['在作出购房承诺前，请参阅我们的','房产资格七项核查指南','，检查产权、卖方、价值及付款证明。'],ar:['قبل الالتزام بشراء عقار، راجع ','دليل التحقق من أهلية العقار في سبع خطوات',' لتقييم سند الملكية والبائع والقيمة ومستندات الدفع.']};
 for(const lang of ['en','tr','zh','ar']){
  const post=lang==='en'?window.blogPostContent[guide]:window.blogPostTranslations?.[lang]?.[guide];
  const c=context[lang];if(!post)throw Error('Missing related guide '+lang);
  const block={type:'paragraph',text:c.join(''),inline:[{type:'text',text:c[0]},{type:'link',text:c[1],page:'journal',slug},{type:'text',text:c[2]}]};
  const index=post.blocks.findIndex(b=>b.type==='heading'&&/400/.test(b.text));
  post.blocks.splice(index<0?post.blocks.length:index,0,block);
 }
}
