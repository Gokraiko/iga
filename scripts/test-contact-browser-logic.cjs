const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { webcrypto } = require('node:crypto');
let checks = 0;
const script = fs.readFileSync(require('node:path').join(__dirname,'../contact-forms.js'),'utf8');
function setup(lang='en') {
 let onSubmit, calls=[], impl=async()=>({ok:true,status:200,json:async()=>({ok:true})});
 const doc={documentElement:{lang},title:'Contact',querySelector:()=>({textContent:'Contact'}),addEventListener(type,fn){assert.equal(type,'submit');onSubmit=fn;},createElement(){return{className:'',textContent:'',setAttribute(){}};}};
 class Form {
  constructor(){this.fields=[['name','Test'],['surname','Visitor'],['email','test@example.com'],['phone',''],['message','Test inquiry'],['_iga_website','']];this.note={textContent:'Original legal note',setAttribute(){}};this.button={disabled:false};this.attrs={};this.resets=0;this.valid=true;}
  hasAttribute(k){return k in this.attrs;}
  reportValidity(){return this.valid;}
  querySelector(){return this.note;}
  querySelectorAll(){return[this.button];}
  setAttribute(k,v){this.attrs[k]=v;}
  removeAttribute(k){delete this.attrs[k];}
  reset(){this.resets++;this.fields=this.fields.map(([k])=>[k,'']);}
  appendChild(v){this.note=v;}
 }
 class FormData {constructor(f){this.form=f;} entries(){return this.form.fields.values();} get(k){return this.form.fields.find(([key])=>key===k)?.[1]??null;}}
 const ctx={document:doc,HTMLFormElement:Form,FormData,crypto:webcrypto,location:{href:'https://igalawfirm.com/'+lang+'/contact/'},Date,WeakMap,JSON,Array,String,AbortController,setTimeout,clearTimeout,fetch:async(u,o)=>{calls.push({url:u,body:JSON.parse(o.body),options:o});return impl(u,o);}};
 vm.runInNewContext(script,ctx);
 return {Form,calls,send:form=>onSubmit({target:form,preventDefault(){}}),fetch(fn){impl=fn;}};
}
(async()=>{
 for(const lang of ['en','tr','zh-CN','ar']) {
  const s=setup(lang),f=new s.Form();let done;
  s.fetch(()=>new Promise(r=>{done=r;}));const pending=s.send(f);assert.equal(f.resets,0);assert.equal(f.button.disabled,true);assert.ok(f.note.textContent);assert.equal(f.attrs['aria-busy'],'true');
  await s.send(f);assert.equal(s.calls.length,1,'double click does not send twice');done({ok:true,status:200,json:async()=>({ok:true})});await pending;assert.equal(f.resets,1);assert.equal(f.button.disabled,false);assert.ok(!('aria-busy'in f.attrs));assert.notEqual(f.note.textContent,'Original legal note');assert.equal(s.calls[0].body.language,lang);assert.equal(s.calls[0].body.website,'');assert.ok(!s.calls[0].body.fields.some(x=>x.name==='_iga_website'));checks++;
  for(const type of ['server-error','network-error','invalid-json','false-success','rate-limit','validation-error']) {
   const s=setup(lang),f=new s.Form();const before=JSON.stringify(f.fields);
   s.fetch(async()=>{if(type==='network-error')throw Error('network');if(type==='invalid-json')return{ok:true,status:200,json:async()=>{throw Error('bad JSON');}};return {ok:type==='false-success',status:type==='rate-limit'?429:type==='validation-error'?400:502,json:async()=>({ok:false})};});
   await s.send(f);assert.equal(f.resets,0);assert.equal(JSON.stringify(f.fields),before);assert.equal(f.button.disabled,false);const error=f.note.textContent;assert.notEqual(error,'Original legal note');assert.ok(error.length>10);
   s.fetch(async()=>({ok:true,status:200,json:async()=>({ok:true})}));await s.send(f);assert.equal(f.resets,1);assert.deepEqual(s.calls[0].body,s.calls[1].body,'unchanged retry payload stable');assert.notEqual(f.note.textContent,error);checks++;
  }
 }
 {const s=setup(),f=new s.Form();f.valid=false;await s.send(f);assert.equal(s.calls.length,0);assert.equal(f.resets,0);checks++;}
 {const s=setup(),f=new s.Form();s.fetch(async()=>({ok:false,status:502,json:async()=>({ok:false})}));await s.send(f);f.fields[4][1]='Updated inquiry';await s.send(f);assert.notEqual(s.calls[0].body.submissionId,s.calls[1].body.submissionId);checks++;}
 {const s=setup(),a=new s.Form(),b=new s.Form();await s.send(a);await s.send(b);assert.equal(s.calls.length,2);assert.notEqual(s.calls[0].body.submissionId,s.calls[1].body.submissionId);checks++;}
 for(const attribute of ['data-property-inquiry','data-property-start']){const s=setup(),f=new s.Form();f.attrs[attribute]='';await s.send(f);assert.equal(s.calls.length,0,'dedicated property forms excluded');checks++;}
 console.log(JSON.stringify({checks,passed:checks,real_emails_sent:0}));
})().catch(e=>{console.error(e);process.exitCode=1;});
