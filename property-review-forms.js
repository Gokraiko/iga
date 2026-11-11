// No personal form data is stored in browser storage or passed to analytics.
(() => {
 const lang=(document.documentElement.lang||'en').split('-')[0];
 const d=window.propertyReviewCopy?.[lang]||window.propertyReviewCopy?.en;
 if(!d)return;
 const allowed={service:Object.keys(d.services),purpose:Object.keys(d.purposes),budget:Object.keys(d.budgets)};
 function track(event, form){
  // Existing GTM/GA is reused only after an explicit consent signal from the site's consent manager.
  if(window.igaConsent?.analytics!==true || typeof window.gtag!=='function')return;
  const dimensions={language:lang};
  for(const [key,values] of Object.entries(allowed)){const value=form?.elements.namedItem(key)?.value||form?.elements.namedItem('pr_'+key)?.value;if(values.includes(value))dimensions[key]=value;}
  window.gtag('event',event,dimensions);
 }
 const short=document.querySelector('[data-property-start]');
 if(short){let started=false;short.addEventListener('change',()=>{if(!started){started=true;track('property_review_home_start',short);}});short.addEventListener('submit',event=>{event.preventDefault();track('property_review_continue',short);const url=new URL(short.action);for(const [k,v] of new FormData(short))if(['pr_service','pr_status','pr_source'].includes(k)&&v)url.searchParams.set(k,v);location.assign(url.href);});}
 const form=document.querySelector('[data-property-inquiry]');if(!form)return;
 form.noValidate=true;
 const get=name=>form.elements.namedItem(name);
 const note=form.querySelector('[data-property-status]');
 const submit=form.querySelector('button[type="submit"]');
 const submitLabel=submit.innerHTML;
 let busy=false,accepted=false,challenge=null,challengeTask=null,fingerprint=null,started=false;
 const parameters=new URLSearchParams(location.search);
 for(const name of ['service','status','purpose']){const val=parameters.get('pr_'+name);if(val&&[...get(name).options].some(o=>o.value===val))get(name).value=val;}
 get('preferredContact').value='email';
 const propertyPath=`/${lang}/igalawrealestateduediligence/`;
 const lawyer={en:'turkish-citizenship-by-investment-lawyer',tr:'yatirim-yoluyla-turk-vatandasligi-avukati',zh:'tuerqi-touzi-ruji-lushi',ar:'turkish-citizenship-by-investment-lawyer'};
 const sourcePage=parameters.get('pr_source')==='home'?`/${lang}/`:parameters.get('pr_source')==='citizenship'?`/${lang}/${lawyer[lang]}/`:propertyPath;
 function requirement(name,required){get(name).required=required;const marker=form.querySelector(`[data-field="${name}"] [data-required-marker]`);if(marker)marker.textContent=required?'*':'';}
 function conditions(){
  const valuation=get('service').value==='valuation';
  form.querySelectorAll('[data-valuation]').forEach(el=>{el.hidden=!valuation;});
  get('valuationPurpose').disabled=!valuation;requirement('valuationPurpose',valuation);
  requirement('location',valuation);requirement('phone',valuation||['phone','whatsapp'].includes(get('preferredContact').value));
  const noWechat=get('noWechat').checked;
  if(noWechat)get('wechat').value='';get('wechat').disabled=noWechat;
  form.querySelector('[data-wechat]').classList.toggle('property-wechat-emphasis',valuation||get('country').value==='CN');
  requirement('wechat',!noWechat&&(valuation||get('preferredContact').value==='wechat'));
 }
 async function request(data){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),16000);try{const response=await fetch('/api/property-review',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:controller.signal});return {status:response.status,result:await response.json()};}finally{clearTimeout(timer);}}
 async function obtainChallenge(){
  if(challenge&&Date.now()-Date.parse(challenge.receivedAt)<23*60*60*1000)return challenge;
  if(!challengeTask)challengeTask=request({action:'challenge'}).then(({status,result})=>{if(status!==200||!result.challenge)throw new Error(status===429?'rate':'unavailable');challenge=result.challenge;return challenge;}).finally(()=>{challengeTask=null;});
  return challengeTask;
 }
 form.addEventListener('focusin',()=>{if(!started){started=true;track('property_review_form_start',form);obtainChallenge().catch(()=>{});}});
 form.addEventListener('change',event=>{conditions();if(event.target.name==='country'&&!get('phone').value){const prefix={CN:'+86',TR:'+90',US:'+1',CA:'+1',GB:'+44',AE:'+971',SA:'+966',RU:'+7',DE:'+49',FR:'+33'}[get('country').value];if(prefix)get('phone').placeholder=prefix+' …';}});
 form.addEventListener('input',event=>{if(event.target.setCustomValidity)event.target.setCustomValidity('');event.target.removeAttribute('aria-invalid');const error=form.querySelector(`[data-error-for="${event.target.name}"]`);if(error)error.textContent='';});
 function validate(){
  conditions();let first=null;
  for(const el of form.elements){if(!el.name||el.disabled||typeof el.setCustomValidity!=='function')continue;el.setCustomValidity('');let error='';
   if(el.required&&((el.type==='checkbox'&&!el.checked)||(el.type!=='checkbox'&&!el.value.trim())))error=d.requiredError;
   if(!error&&el.name==='email'&&el.value&&!/^[^\s<>@,;\r\n]+@[^\s<>@,;\r\n]+\.[^\s<>@,;\r\n]+$/.test(el.value.trim()))error=d.emailError;
   if(!error&&el.name==='phone'&&el.value){const normalized=el.value.replace(/[\s().-]/g,'').replace(/^00/,'+');if(!/^\+[1-9]\d{7,14}$/.test(normalized))error=d.phoneError;}
   if(el.name==='wechat'&&get('service').value==='valuation'&&!el.value.trim()&&!get('noWechat').checked)error=d.wechatError;
   if(el.name==='preferredContact'&&el.value==='wechat'&&(!get('wechat').value.trim()||get('noWechat').checked))error=d.contactError;
   if(el.name==='listingUrl'&&el.value){try{const url=new URL(el.value);if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw Error();}catch{error=d.urlError;}}
   if(!error&&!el.validity.valid)error=d.invalid;
   el.setCustomValidity(error);el.setAttribute('aria-invalid',String(Boolean(error)));const message=form.querySelector(`[data-error-for="${el.name}"]`);if(message)message.textContent=error;if(error&&!first)first=el;
  }
  if(first){first.focus();note.textContent=d.invalid;return false;}return true;
 }
 function payload(){const data={};for(const [key,value] of new FormData(form))data[key]=value.trim();data.noWechat=get('noWechat').checked;data.privacyAcknowledged=get('privacyAcknowledged').checked;data.wechat=get('wechat').disabled?'':get('wechat').value.trim();data.language=lang;data.sourcePage=sourcePage;return data;}
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy||accepted)return;if(!validate())return;
  busy=true;submit.disabled=true;submit.textContent=d.sending;form.setAttribute('aria-busy','true');note.textContent=d.sending;
  try{
   const data=payload();const nextFingerprint=JSON.stringify(data);
   if(fingerprint&&fingerprint!==nextFingerprint)challenge=null;
   fingerprint=nextFingerprint;const c=await obtainChallenge();
   const wait=2100-(Date.now()-Date.parse(c.receivedAt));if(wait>0)await new Promise(resolve=>setTimeout(resolve,Math.min(wait,2200)));
   const {status,result}=await request({...data,challenge:c,submissionId:c.submissionId,startedAt:c.receivedAt});
   if(status!==200||result.ok!==true){note.textContent=status===429?d.rate:status===400?d.invalid:d.error;track('property_review_submit_error',form);return;}
   track('property_review_submit_success',form);accepted=true;note.textContent=d.success;note.focus();form.querySelectorAll('input,select,textarea').forEach(el=>{el.disabled=true;});form.querySelector('[data-new-request]').hidden=false;
  }catch(error){note.textContent=error.message==='rate'?d.rate:d.error;track('property_review_submit_error',form);}
  finally{busy=false;form.removeAttribute('aria-busy');submit.disabled=accepted;submit.innerHTML=submitLabel;}
 });
 form.querySelector('[data-new-request]').addEventListener('click',()=>{form.reset();form.querySelectorAll('input,select,textarea').forEach(el=>{el.disabled=false;el.setCustomValidity('');el.removeAttribute('aria-invalid');});form.querySelectorAll('.property-error').forEach(el=>{el.textContent='';});accepted=false;challenge=null;fingerprint=null;note.textContent='';submit.disabled=false;get('preferredContact').value='email';form.querySelector('[data-new-request]').hidden=true;conditions();get('service').focus();obtainChallenge().catch(()=>{});});
 conditions();
})();
