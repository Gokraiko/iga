// Read-only snapshot for prerendered homepage links. Live browsers refresh the same API.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const target=path.join(root,'article-popularity.js');
const slugs=JSON.parse(fs.readFileSync(path.join(root,'blog-slugs.json'),'utf8'));
(async()=>{
 try{
  const response=await fetch('https://igalawfirm.com/api/article-views/',{signal:AbortSignal.timeout(7000),headers:{Accept:'application/json'}});
  if(!response.ok)throw Error(`HTTP ${response.status}`);
  const {counts}=await response.json();
  if(!counts||!slugs.every(slug=>Number.isSafeInteger(counts[slug])&&counts[slug]>=0))throw Error('Incomplete or invalid counter data');
  const data={updatedAt:new Date().toISOString(),counts:Object.fromEntries(slugs.map(slug=>[slug,counts[slug]]))};
  fs.writeFileSync(target,'// Confirmed API snapshot; counts are refreshed in the browser.\nwindow.articlePopularity='+JSON.stringify(data,null,2)+';\n');
  console.log('Updated confirmed article popularity snapshot');
 }catch(error){
  if(!fs.existsSync(target)){console.error('No confirmed popularity snapshot available:',error.message);process.exitCode=1;return;}
  console.warn('Counter unavailable; preserving last confirmed popularity snapshot:',error.message);
 }
})();
