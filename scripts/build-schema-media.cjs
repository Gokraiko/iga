// Read intrinsic dimensions directly from local files; no remote fetch or image manipulation.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function imageSize(file){
 const b=fs.readFileSync(file);
 if(b.subarray(1,4).toString()==='PNG')return {width:b.readUInt32BE(16),height:b.readUInt32BE(20)};
 if(b.subarray(0,4).toString()==='RIFF'&&b.subarray(8,12).toString()==='WEBP'){
  const type=b.subarray(12,16).toString();
  if(type==='VP8X')return {width:1+b.readUIntLE(24,3),height:1+b.readUIntLE(27,3)};
  if(type==='VP8L'){const bits=b.readUInt32LE(21);return {width:(bits&0x3fff)+1,height:((bits>>>14)&0x3fff)+1};}
  if(type==='VP8 ')return {width:b.readUInt16LE(26)&0x3fff,height:b.readUInt16LE(28)&0x3fff};
 }
 if(b[0]===0xff&&b[1]===0xd8){
  let i=2;
  while(i+8<b.length){
   if(b[i++]!==0xff)continue;
   while(b[i]===0xff)i++;
   const marker=b[i++];if(marker===0xd8||marker===0xd9||marker===0x01||(marker>=0xd0&&marker<=0xd7))continue;
   const size=b.readUInt16BE(i);
   if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker))return {width:b.readUInt16BE(i+5),height:b.readUInt16BE(i+3)};
   if(size<2)break;i+=size;
  }
 }
 if(b.subarray(4,8).toString()==='ftyp'){
  const i=b.indexOf(Buffer.from('ispe'));
  if(i>=0&&i+16<=b.length)return {width:b.readUInt32BE(i+8),height:b.readUInt32BE(i+12)};
 }
 throw Error('Unsupported image or missing dimensions: '+file);
}
function isoDate(value){
 if(!value)return null;
 if(/^\d{4}-\d{2}-\d{2}$/.test(value))return value+'T09:00:00+03:00';
 if(/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value)&&Number.isFinite(Date.parse(value)))return value;
 throw Error('Unsupported article date: '+value);
}
function createTracker(root){
 const target=path.join(root,'article-content-history.json');
 const history=fs.existsSync(target)?JSON.parse(fs.readFileSync(target,'utf8')):{};
 const initial=JSON.stringify(history);const mediaCache=new Map();
 function enhance(schema,{canonical,language,visibleArticleContent}){
  const graph=schema['@graph'],post=graph.find(n=>n['@type']==='BlogPosting');if(!post)return;
  const page=graph.find(n=>n['@id']===canonical+'#webpage');
  const key=canonical.replace(/^https?:\/\/[^/]+/,'');
  const fingerprint=crypto.createHash('sha256').update(visibleArticleContent).digest('hex');
  const published=isoDate(post.datePublished);if(!published)throw Error('Missing publication date '+canonical);
  const previous=history[key];let modified=isoDate(post.dateModified)||published;
  if(Date.parse(modified)<Date.parse(published))modified=published;
  if(previous){
   if(previous.fingerprint===fingerprint)modified=previous.dateModified;
   else modified=new Date().toISOString();
  }
  history[key]={fingerprint,datePublished:published,dateModified:modified};
  post.datePublished=published;post.dateModified=modified;
  const origin=canonical.match(/^https?:\/\/[^/]+/)[0];
  const visibleSrc=visibleArticleContent.match(/<img\b[^>]*\bsrc="([^"]+)"/)?.[1];
  const src=post.image||visibleSrc;
  // No visible article image: omit ImageObject rather than describe an unseen fallback.
  if(!src)return;
  const rawUrl=typeof src==='string'?src:src.url;
  const url=rawUrl.startsWith('/')?origin+rawUrl:rawUrl;
  if(!url.startsWith(origin+'/'))throw Error('Article image must be local '+url);
  const file=path.resolve(root,decodeURIComponent(url.slice(origin.length+1)));
  if(!file.startsWith(path.resolve(root)+path.sep))throw Error('Invalid image path');
  let dimensions=mediaCache.get(file);if(!dimensions){dimensions=imageSize(file);mediaCache.set(file,dimensions);}
  if(!(dimensions.width>0&&dimensions.height>0))throw Error('Invalid image dimensions '+file);
  const associated=post.associatedMedia;
  const image={'@type':'ImageObject','@id':canonical+'#primaryimage',url,...dimensions};
  if(associated){for(const k of ['name','description','caption','inLanguage'])if(associated[k])image[k]=associated[k];}
  post.image=image;page.primaryImageOfPage={'@id':image['@id']};
  delete post.associatedMedia;
 }
 function save(){
  if(JSON.stringify(history)!==initial)fs.writeFileSync(target,JSON.stringify(history,null,2)+'\n');
 }
 return {enhance,save,history};
}
module.exports={imageSize,isoDate,createTracker};
