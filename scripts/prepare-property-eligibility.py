#!/usr/bin/env python3
"""Compile reviewed Markdown into the site's dependency-free content module."""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
REVIEW=ROOT/'review/property-eligibility'
SLUG='how-to-check-property-eligibility-turkish-citizenship'

def inline(text):
 parts=[];pos=0
 pattern=r'\[([^\]]+)\]\((https://[^\s)]+)\)|\*\*(.+?)\*\*|\*([^*]+)\*'
 for m in re.finditer(pattern,text):
  if m.start()>pos:parts.append({'type':'text','text':text[pos:m.start()]})
  if m[1]:parts.append({'type':'link','text':m[1],'href':m[2].replace('https://igalawfirm.com','')})
  elif m[3]:parts.append({'type':'strong','text':m[3]})
  else:parts.append({'type':'em','text':m[4]})
  pos=m.end()
 if pos<len(text):parts.append({'type':'text','text':text[pos:]})
 return parts

def parse(md):
 blocks=[];lines=md.strip().splitlines();i=0
 while i<len(lines):
  line=lines[i].strip();i+=1
  if not line or line=='---' or line.startswith('# '):continue
  h=re.match(r'^(#{2,4}) (.+)',line)
  if h:blocks.append({'type':'heading','level':len(h[1]),'text':h[2]});continue
  if line.startswith('|'):
   rows=[line]
   while i<len(lines) and lines[i].strip().startswith('|'):rows.append(lines[i].strip());i+=1
   cells=[[x.strip() for x in r.strip('|').split('|')] for r in rows]
   blocks.append({'type':'table','headers':cells[0],'rows':cells[2:]});continue
  match=re.match(r'^(?:- |\d+\. )(.+)',line)
  if match:
   ordered=bool(re.match(r'\d+\.',line));items=[inline(match[1])]
   while i<len(lines):
    m=re.match(r'^(\d+\. |[-] )(.+)',lines[i].strip())
    if not m or bool(re.match(r'\d+\.',m[1]))!=ordered:break
    items.append(inline(m[2]));i+=1
   blocks.append({'type':'items','ordered':ordered,'items':items});continue
  while i<len(lines) and lines[i].strip() and not re.match(r'^(#|\||- |\d+\. )',lines[i]):line+=' '+lines[i].strip();i+=1
  blocks.append({'type':'paragraph','text':re.sub(r'\*','',line),'inline':inline(line)})
 return blocks

copy={}
for lang in ['en','tr','zh','ar']:
 meta=json.loads((REVIEW/f'{lang}-meta.json').read_text())
 meta['blocks']=parse((REVIEW/f'{lang}.md').read_text());copy[lang]=meta
 # An existing Istanbul image is used; don't describe a legal-document scene that isn't pictured.
 meta['imageAlt']={'en':'Istanbul waterfront and residential buildings accompanying a guide to property eligibility for Turkish citizenship','tr':'Türk vatandaşlığı için taşınmaz uygunluğu rehberine eşlik eden İstanbul kıyısı ve konutlar','zh':'伊斯坦布尔滨水住宅景观，配合土耳其购房入籍资格指南','ar':'واجهة إسطنبول البحرية ومبانٍ سكنية ترافق دليل أهلية العقار للجنسية التركية'}[lang]
 meta['imageTitle']=meta['title']
 meta['imageDescription']=meta['imageAlt']

header='''// Full supplied article and complete EN/TR/ZH/AR translations. Attorney approval confirmed by the user.
// Publication date set to 2026-11-06 at the user’s explicit request; first deployed 2026-11-10.
{
 const publicationDate='2026-11-06';
 const legalReviewDate='2026-11-06';
 const slug='''+json.dumps(SLUG)+''';
 const copy='''+json.dumps(copy,ensure_ascii=False,indent=2)+''';
'''
footer=(ROOT/'review/property-eligibility/runtime.js').read_text()
(ROOT/'property-eligibility-post.js').write_text(header+footer)
print('Compiled', {l:len(c['blocks']) for l,c in copy.items()})
