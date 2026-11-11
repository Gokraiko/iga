// Opt-in integration test using the EXISTING server environment. Sends five clearly marked
// fictional notifications to info@igalawfirm.com. Never prints or writes credentials.
const fs=require('node:fs');const {setTimeout:wait}=require('node:timers/promises');
if(!process.argv.includes('--send-real-test-emails'))throw Error('Use --send-real-test-emails only for the authorized mailbox delivery test.');
for(const name of ['RESEND_API_KEY','LEAD_EMAIL_FROM'])if(!process.env[name])throw Error(`Missing server-only ${name}`);
if(!(process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL)||!(process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN))throw Error('Configure the existing Redis environment first.');
const handler=require('../api/property-review');const originalFetch=global.fetch;const ids=[];
global.fetch=async(url,opts)=>{const r=await originalFetch(url,opts);if(url==='https://api.resend.com/emails'&&r.ok){const copy=await r.clone().json();if(copy.id)ids.push(copy.id);}return r;};
async function call(body){let status,result;const req={method:'POST',headers:{host:'127.0.0.1:4178',origin:'http://127.0.0.1:4178','content-type':'application/json'},socket:{remoteAddress:'127.0.0.1'},body};const res={setHeader(){},status(n){status=n;return res},json(v){result=v}};await handler(req,res);return {status,result};}
(async()=>{const results=[];for(const service of ['valuation','diligence','citizenship','existing','consultation']){
 const c=await call({action:'challenge'});if(c.status!==200)throw Error(`Challenge failed: ${c.status}`);await wait(2100);
 const b={challenge:c.result.challenge,submissionId:c.result.challenge.submissionId,startedAt:c.result.challenge.receivedAt,website:'',privacyAcknowledged:true,language:'zh',sourcePage:'/zh/igalawrealestateduediligence/',service,purpose:'citizenship',status:'selected',budget:'400to500',name:`TEST ONLY — ${service} — 张伟 اختبار`,email:'example@example.com',phone:'+86 138 0000 0000',country:'CN',wechat:'fictional_test_only',noWechat:false,preferredContact:'wechat',location:'Istanbul, Beyoğlu',listingUrl:'',message:'FICTIONAL TEST DATA. Not a real client inquiry. 中文 / العربية / Türkçe. Please disregard after verifying delivery.',valuationPurpose:'purchase'};
 const r=await call(b);results.push({service,status:r.status,accepted:r.result.ok===true,emailId:ids.at(-1)||null,delivery:'NOT YET VERIFIED — check existing Resend delivery dashboard and destination mailbox'});
 if(r.status!==200)break;
 }
 fs.writeFileSync('audits/property-review-2026-11-11/real-delivery-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1});
