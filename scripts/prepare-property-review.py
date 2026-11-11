from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
data={lang:json.loads((root/f'review/property-review/{lang}.json').read_text()) for lang in ['en','tr','zh','ar']}
def shape(v):return {k:shape(x) for k,x in v.items()} if isinstance(v,dict) else type(v).__name__
assert all(shape(v)==shape(data['en']) for v in data.values())
(root/'property-review-content.js').write_text('// Generated from review/property-review/*.json; edit source translations.\nwindow.propertyReviewCopy='+json.dumps(data,ensure_ascii=False,indent=2)+';\n'+(root/'review/property-review/render.js').read_text())
