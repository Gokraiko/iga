// Local tests only. This never sends email or contacts Redis.
module.exports = function createMock() {
 const records=new Map(),counts=new Map(),sent=[];let failEmail=false,failRedis=false;
 process.env.RESEND_API_KEY='local-test-only';process.env.LEAD_EMAIL_FROM='IGA test <website@example.com>';
 process.env.UPSTASH_REDIS_REST_URL='https://redis.example.test';process.env.UPSTASH_REDIS_REST_TOKEN='local-test-only';
 const fetch=async(url,opts)=>{
  if(url==='https://redis.example.test'){
   if(failRedis)throw Error('mock storage failure');const c=JSON.parse(opts.body);let result;
   if(c[1].includes("'INCR'")){const n=(counts.get(c[3])||0)+1;counts.set(c[3],n);result=n;}
   else {if(!records.has(c[3]))records.set(c[3],c[4]);result=records.get(c[3]);}
   return {ok:true,json:async()=>({result})};
  }
  if(url!=='https://api.resend.com/emails')throw Error('Unexpected network request');
  const body=JSON.parse(opts.body);
  if(failEmail||body.text.includes('[simulate failure]'))throw Error('mock email failure');
  sent.push({body,headers:opts.headers});return {ok:true,json:async()=>({id:'mock-only-not-sent'})};
 };
 return {fetch,sent,records,counts,setFailEmail:v=>{failEmail=v},setFailRedis:v=>{failRedis=v}};
};
