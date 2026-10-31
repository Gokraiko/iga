const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),context=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(path.join(root,'schema-content.js'),'utf8'),context);
const schema=context.window.igaSchemaContent;let checks=0;function check(value){assert(value);checks++;}
const route={lang:'en',page:'igalawworkpermit',sub:''},t={home:'Home',nav:['Home','Practice areas','Investment','Our team','Our vision','Blog','Contact']};
const pathFor=(lang,page='home',sub='')=>'/'+lang+'/'+(page==='home'?'':page==='igalawworkpermit'?'turkey-work-permit/':page==='journal'?'blog/'+(sub?sub+'/':''):page+'/');
const crumbs=schema.breadcrumbs({route,t,heading:'Turkey Work Permit Application',pathFor,isService:true});
check(crumbs.length===3&&crumbs[1].path==='/en/services/'&&crumbs[2].path==='/en/turkey-work-permit/');
check(schema.breadcrumbs({route:{...route,page:'home'},t,heading:'Home',pathFor,isService:false}).length===0);
check(schema.breadcrumbs({route:{...route,page:'investment'},t,heading:'Investment guide',pathFor,isService:false}).length===2);
check(schema.breadcrumbs({route:{...route,page:'journal',sub:'example'},t,heading:'Article title',pathFor,isService:false})[1].path==='/en/blog/');
const team=[{name:'Irmak Gürer Aksöz',role:'founder'},{name:'Dilan Caman',role:'managing'}],anchors={'Irmak Gürer Aksöz':'irmak-gurer-aksoz','Dilan Caman':'dilan-caman'};
check(schema.author({author:'Dilan Caman'},team,anchors,'en',pathFor).path==='/en/team/#dilan-caman');
check(schema.author({author:{name:'Dilan Caman'}},team,anchors,'tr',pathFor).member.name==='Dilan Caman');
assert.throws(()=>schema.author({author:'Unknown'},team,anchors,'en',pathFor));checks++;
for(const lang of ['en','tr','zh','ar'])check(schema.author({author:'Irmak Gürer Aksöz'},team,anchors,lang,pathFor).label.includes('Irmak Gürer Aksöz'));
for(const title of ['Frequently Asked Questions','Sıkça Sorulan Sorular','常见问题','الأسئلة المتداولة']){
 const html='<div class="article-content"><h2>'+title+'</h2><h2>Question?</h2><p>Visible answer.</p><h2>Conclusion</h2><p>Not an answer.</p></div>';
 const rows=schema.articleFaqs(html);check(rows.length===1&&rows[0][0]==='Question?'&&rows[0][1]==='Visible answer.');
}
check(schema.articleFaqs('<div class="article-content"><h2>FAQ</h2><p>Question?</p><p>Answer.</p><p>Contact the firm.</p></div>')[0][1]==='Answer.');
check(schema.articleFaqs('<div class="article-content"><h2>No FAQ here</h2><h3>A question?</h3><p>Answer.</p></div>').length===0);
check(schema.detailFaqs('<details><summary>A question?</summary><p>Visible <a href="/x/">answer</a>.</p></details>')[0][1]==='Visible answer.');
const {isoDate,createTracker}=require('./build-schema-media.cjs');
check(isoDate('2025-01-01')==='2025-01-01T09:00:00+03:00');
check(isoDate('2025-01-01T12:00:00Z')==='2025-01-01T12:00:00Z');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'iga-schema-test-'));
try{
 const canonical='https://igalawfirm.com/en/blog/test/';
 const graph=()=>({'@graph':[{'@type':'WebPage','@id':canonical+'#webpage'},{'@type':'BlogPosting',datePublished:'2025-01-01',dateModified:'2025-01-02'}]});
 let tracker=createTracker(temp),data=graph();tracker.enhance(data,{canonical,language:'en',visibleArticleContent:'Original body'});tracker.save();
 const file=path.join(temp,'article-content-history.json'),first=fs.readFileSync(file,'utf8');
 check(data['@graph'][1].dateModified==='2025-01-02T09:00:00+03:00');
 tracker=createTracker(temp);data=graph();tracker.enhance(data,{canonical,language:'en',visibleArticleContent:'Original body'});tracker.save();
 check(fs.readFileSync(file,'utf8')===first);
 tracker=createTracker(temp);data=graph();tracker.enhance(data,{canonical,language:'en',visibleArticleContent:'Changed body'});tracker.save();
 check(data['@graph'][1].dateModified!=='2025-01-02T09:00:00+03:00');
 check(data['@graph'][1].datePublished==='2025-01-01T09:00:00+03:00');
 check(!data['@graph'][1].image);
}finally{fs.rmSync(temp,{recursive:true,force:true});}
console.log(JSON.stringify({checks,passed:checks,production_changes:0}));
