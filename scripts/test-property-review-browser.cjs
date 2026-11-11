const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const code=fs.readFileSync('property-review-forms.js','utf8');let count=0;
for(const lang of ['en','tr','zh','ar'])for(const consent of [undefined,false,true]){
 const events={},sent=[],navigations=[];
 const fields={pr_service:'valuation',pr_status:'selected',pr_source:'home',name:'PRIVATE',email:'private@example.com',phone:'+8613800000000',wechat:'PRIVATE',listingUrl:'https://private.example',message:'PRIVATE'};
 const form={action:`https://igalawfirm.com/${lang}/igalawrealestateduediligence/#property-legal-review`,elements:{namedItem:n=>({value:fields[n]||''})},addEventListener:(n,fn)=>{events[n]=fn}};
 // Actual short form only has non-personal fields. Full-form extras model hostile accidental additions.
 class FD{constructor(){return Object.entries(fields).filter(([k])=>k.startsWith('pr_'))[Symbol.iterator]();}}
 const ctx={document:{documentElement:{lang},querySelector:q=>q==='[data-property-start]'?form:null},window:{propertyReviewCopy:{[lang]:JSON.parse(fs.readFileSync(`review/property-review/${lang}.json`))},igaConsent:consent===undefined?undefined:{analytics:consent},gtag:(...a)=>sent.push(a)},location:{assign:u=>navigations.push(u)},URL,FormData:FD,encodeURIComponent};
 vm.runInNewContext(code,ctx);events.change();events.change();events.submit({preventDefault(){}});
 assert.equal(sent.length,consent===true?2:0);count++;
 for(const event of sent){assert.ok(!JSON.stringify(event).includes('PRIVATE'));assert.deepEqual(Object.keys(event[2]).sort(),['language','service']);count++;}
 assert.ok(navigations[0].includes('pr_service=valuation')&&navigations[0].includes('pr_status=selected'));assert.ok(!navigations[0].includes('private'));count++;
}
console.log(`${count} browser-flow/consent assertions passed; no personal analytics payloads.`);
