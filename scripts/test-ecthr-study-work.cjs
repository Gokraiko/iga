const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({window:{finalSeoMetadata:{}},location:{pathname:'/en/'}});
vm.runInContext(fs.readFileSync('attorney-profile.js','utf8'),context);
const profile=context.window.irmakProfile,registry=JSON.parse(fs.readFileSync('internal/professional-entities.json','utf8'));
const person=registry.people.find(p=>p.id===profile.personId);let checks=0;function check(v,m){assert(v,m);checks++;}
const config=JSON.parse(fs.readFileSync('seo-config.json','utf8'));
for(const lang of ['en','tr','zh','ar']){
 const d=profile.copy[lang],route=profile.path(lang),html=fs.readFileSync('dist'+route+'index.html','utf8');
 check(!d.sections[0].paragraphs.some(x=>x.includes('Study Work')||x.includes('2018')),'Background avoids repeated experience');
 check((html.match(/Study Work/g)||[]).length===3,'Two visible mentions and one schema description');
 const fields=[d.intro[2],d.facts[3][1],d.timeline[0]];
 for(const text of fields){check(text&&text.includes('Study Work'),'Approved designation in every experience section');check(!/internship|traineeship|study visit|staj|ziyaret|学习访问|实习|زيارة دراسية|تدريب/i.test(text),'No outdated or misleading designation');}
 check(d.facts[3][1].includes('2017'),'Year 2017');check(html.includes('Study Work'),'Visible initial HTML');
 check(d.timeline[1].includes('2018')||html.includes('<strong>2018</strong>'),'Separate professional practice year preserved');check(html.includes('2022'),'Firm founding preserved');
 const graph=config[route].structuredData['@graph'],entity=graph.find(e=>e['@id']===profile.personId);
 check(entity.description.endsWith(d.facts[3][1]),'Schema mirrors visible experience');check(graph.filter(e=>e['@id']===profile.personId).length===1,'Existing Person identity only');
 const experience=person.localized[lang].professionalExperience[0];check(experience.nature==='Study Work'&&experience.year===2017,'Internal registry nature/year');check(experience.description===d.facts[3][1],'Registry derives the same source');
}
check(profile.copy.en.facts[3][1]==='European Court of Human Rights (ECtHR) — Study Work, Strasbourg, France (2017).','Exact owner-approved English description');
check(!registry.unresolved.some(s=>s.includes('ECtHR')),'Resolved conflict removed');
console.log(JSON.stringify({checks,passed:checks}));
