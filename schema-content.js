// Shared visible breadcrumb/author content and matching JSON-LD. No routing or metadata changes.
window.igaSchemaContent = (() => {
  const text = value => String(value || '').replace(/<[^>]*>/g, '').replace(/&(?:amp|lt|gt|quot|#39|#x27|nbsp);/g, entity => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&#x27;':"'",'&nbsp;':' '}[entity])).replace(/\s+/g,' ').trim();
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const originOf = canonical => canonical.match(/^https?:\/\/[^/]+/)[0];
  const breadcrumbLabels = {en:'Breadcrumb',tr:'Sayfa yolu',zh:'面包屑导航',ar:'مسار التنقل'};
  function breadcrumbs({route,t,heading,pathFor,isService}) {
    if (route.page === 'home') return [];
    const items = [{name:t.home,path:pathFor(route.lang,'home')}];
    if (isService) items.push({name:t.nav[1],path:pathFor(route.lang,'services')});
    else if (route.page === 'journal' && route.sub) items.push({name:t.nav[5],path:pathFor(route.lang,'journal')});
    const label = {services:t.nav[1],team:t.nav[3],about:t.nav[4],contact:t.nav[6],journal:route.sub?heading:t.nav[5]}[route.page] || heading;
    items.push({name:label,path:pathFor(route.lang,route.page,route.sub)});
    return items;
  }
  function breadcrumbMarkup(items,lang) {
    if (!items.length) return '';
    return `<nav class="crumb site-breadcrumb" aria-label="${breadcrumbLabels[lang]}"><ol>${items.map((item,i)=>`<li>${i?'<span class="breadcrumb-separator" aria-hidden="true">›</span>':''}${i===items.length-1?`<span aria-current="page">${escape(item.name)}</span>`:`<a href="${escape(item.path)}">${escape(item.name)}</a>`}</li>`).join('')}</ol></nav>`;
  }
  function author(post,team,anchors,lang,pathFor) {
    const value=post.author;
    const name=typeof value==='object'?value.name:value;
    const member=team.find(m=>m.name===name || anchors[m.name]===name);
    if (!member) throw new Error(`Unknown article author: ${name}`);
    const founder=member.name==='Irmak Gürer Aksöz';
    const label=founder?{en:'Author: Irmak Gürer Aksöz, Attorney',tr:'Yazar: Av. Irmak Gürer Aksöz',zh:'作者：Irmak Gürer Aksöz 律师',ar:'الكاتبة: المحامية Irmak Gürer Aksöz'}[lang]:`${{en:'Author:',tr:'Yazar:',zh:'作者：',ar:'الكاتب:'}[lang]} ${member.name}`;
    return {member,anchor:anchors[member.name],path:pathFor(lang,'team')+'#'+anchors[member.name],label};
  }
  // Read the same rendered, visible details/summary source as visitors see.
  function detailFaqs(content) {
    return [...content.matchAll(/<details\b[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map(m=>[text(m[1]),text(m[2])]).filter(([q,a])=>q&&a);
  }
  function articleFaqs(content) {
    const start=content.indexOf('<div class="article-content"');
    const article=start<0?null:content.slice(start);
    if (!article) return [];
    const faqTitle=/^(?:frequently asked questions|faqs?|sık(?:ça)? sorulan sorular|常见问题(?:解答)?|الأسئلة الشائعة|الأسئلة المتداولة)(?:\s*[:：（(].*)?$/i;
    const tokens=[...article.matchAll(/<(h[2-4]|p|li)\b[^>]*>([\s\S]*?)<\/\1>/g)];
    const entries=[];let sectionLevel=0,pending=null;
    const finish=()=>{if(pending?.answers.length)entries.push([pending.question,pending.answers.join(' ')]);pending=null;};
    for (const token of tokens) {
      const tag=token[1],value=text(token[2]);
      if(tag.startsWith('h')) {
        const level=Number(tag[1]);
        if(faqTitle.test(value)){finish();sectionLevel=level;continue;}
        if(sectionLevel && (level>sectionLevel || /[?？؟]$/.test(value))){finish();pending={question:value,answers:[],kind:'heading'};}
        else if(sectionLevel && level<=sectionLevel){finish();sectionLevel=0;}
      } else if(sectionLevel && value) {
        if(tag==='p' && /[?？؟]$/.test(value)){finish();pending={question:value,answers:[],kind:'paragraph'};}
        else if(pending?.kind==='paragraph' && pending.answers.length && tag==='p'){finish();sectionLevel=0;}
        else if(pending)pending.answers.push(value);
      }
    }
    finish();return entries;
  }
  function enhance(graph,ctx) {
    const {route,t,heading,content,breadcrumbs:crumbs,canonical,language,team,anchors,services,serviceData,practiceAreaCopy,pathFor,post}=ctx;
    const origin=originOf(canonical),org=graph.find(n=>Array.isArray(n['@type'])&&n['@type'].includes('Organization'));
    const page=graph.find(n=>n['@id']===canonical+'#webpage');
    const personId=member=>origin+'/#'+anchors[member.name];
    const person=member=>({'@type':'Person','@id':personId(member),name:member.name,jobTitle:t[member.role],worksFor:{'@id':org['@id']},url:origin+pathFor(route.lang,'team')+'#'+anchors[member.name]});
    const founder=team.find(m=>m.name==='Irmak Gürer Aksöz');
    org.image=org.logo;org.areaServed={'@type':'Country',name:'Türkiye',identifier:'TR'};
    org.knowsLanguage=['tr','en','zh','ar'];org.founder={'@id':personId(founder)};
    const people=route.page==='team'?team:[founder];
    if(post){const a=author(post,team,anchors,route.lang,pathFor);if(!people.includes(a.member))people.push(a.member);}
    people.forEach(member=>graph.push(person(member)));
    if(route.page==='team'){page['@type']='WebPage';page.mainEntity=team.map(member=>({'@id':personId(member)}));}
    if(route.page==='about'){page['@type']='AboutPage';page.about={'@id':org['@id']};}
    if(route.page==='contact')page['@type']='ContactPage';
    if(route.page==='journal'&&!post)page['@type']='CollectionPage';
    for(let i=graph.length-1;i>=0;i--)if(['BreadcrumbList','FAQPage'].includes(graph[i]['@type']))graph.splice(i,1);
    if(crumbs.length){
      const id=canonical+'#breadcrumb';page.breadcrumb={'@id':id};
      graph.push({'@type':'BreadcrumbList','@id':id,itemListElement:crumbs.map((item,i)=>({'@type':'ListItem',position:i+1,name:item.name,item:origin+item.path}))});
    }
    const service=graph.find(n=>n['@type']==='Service');
    if(service){service.name=heading;service.description=page.description;service.serviceType=serviceData[services.find(s=>s.path===route.page).id].title[route.lang];service.areaServed='TR';service.inLanguage=language;}
    if(route.page==='services'){
      const id=canonical+'#services';page.mainEntity={'@id':id};
      graph.push({'@type':'ItemList','@id':id,itemListElement:services.map((s,i)=>({'@type':'ListItem',position:i+1,name:practiceAreaCopy[route.lang][s.id].title,item:{'@id':origin+pathFor(route.lang,s.path)+'#service'}}))});
    }
    const faqs=post?articleFaqs(content):detailFaqs(content);
    if(faqs.length)graph.push({'@type':'FAQPage','@id':canonical+'#faq',mainEntity:faqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))});
    const article=graph.find(n=>n['@type']==='BlogPosting');
    if(article)article.author={'@id':personId(author(post,team,anchors,route.lang,pathFor).member)};
    return graph;
  }
  return {text,breadcrumbs,breadcrumbMarkup,author,enhance,articleFaqs,detailFaqs};
})();
