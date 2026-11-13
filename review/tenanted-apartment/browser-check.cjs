const {chromium}=require('/Users/sinanaksoz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const reports=[],errors=[];
 const slug='buying-tenanted-apartment-istanbul-foreign-buyers';
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900}});
  await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  for(const lang of ['en','zh']){
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   const resp=await page.goto(`http://127.0.0.1:4178/${lang}/blog/${slug}/`,{waitUntil:'networkidle'});assert.equal(resp.status(),200);
   const check=await page.evaluate(()=>({title:document.title,h1:document.querySelector('h1').textContent,h1Count:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth,articleLength:document.querySelector('.article-content').textContent.length,author:document.querySelector('.article-author-line').textContent,counterHidden:getComputedStyle(document.querySelector('.article-view-count')).display==='none',languageLinks:[...document.querySelectorAll('.language-menu a')].map(a=>({lang:a.hreflang,path:new URL(a.href).pathname})),padding:document.querySelector('.article-full').getBoundingClientRect().left}));
   assert.equal(check.h1Count,1);assert.equal(check.overflow,false);assert.equal(check.counterHidden,true);assert.ok(check.articleLength>(lang==='en'?10000:3000));assert.ok(check.padding>=15);
   assert.equal(check.languageLinks.find(a=>a.lang==='en').path,`/en/blog/${slug}/`);assert.equal(check.languageLinks.find(a=>a.lang==='zh-CN').path,`/zh/blog/${slug}/`);assert.equal(check.languageLinks.find(a=>a.lang==='tr').path,'/tr/blog/');assert.equal(check.languageLinks.find(a=>a.lang==='ar').path,'/ar/blog/');
   await page.screenshot({path:`audits/tenanted-apartment/${lang}-${width}.png`});reports.push({lang,width,...check});
   await page.goto(`http://127.0.0.1:4178/${lang}/blog/`,{waitUntil:'networkidle'});assert.equal(await page.locator(`.blog-card a[href="/${lang}/blog/${slug}/"]`).count(),1);await page.locator(`.blog-card a[href="/${lang}/blog/${slug}/"]`).click();await page.waitForLoadState('networkidle');assert.equal(await page.locator('h1').textContent(),check.h1);
   await page.close();
  }
  await context.close();
 }
 const context=await browser.newContext();await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const lang of ['en','tr','zh','ar'])for(const suffix of ['', 'blog/','igalawrealestateduediligence/','blog/how-to-check-property-eligibility-turkish-citizenship/']){
  const resp=await page.goto(`http://127.0.0.1:4178/${lang}/${suffix}`,{waitUntil:'networkidle'});assert.equal(resp.status(),200);assert.equal(await page.locator('h1').count(),1);
 }
 const baselineErrors=[];const baseline=await context.newPage();baseline.on('pageerror',e=>baselineErrors.push(e.message));await baseline.goto('http://127.0.0.1:4179/en/',{waitUntil:'networkidle'});assert.ok(baselineErrors.length>0);assert.deepEqual([...new Set(errors)].sort(),[...new Set(baselineErrors)].sort());fs.writeFileSync('audits/tenanted-apartment/browser-checks.json',JSON.stringify({reports,existingRouteSmokeChecks:16,errors,baselineErrors,newRuntimeErrors:[]},null,2));await browser.close();console.log('4 new-page desktop/mobile checks, archive navigation and 16 existing route smoke checks passed');
})().catch(e=>{console.error(e);process.exit(1)});
