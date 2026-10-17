# 고객 추천 목록(/m/model/pick.html)용 상품 색인 생성
# 사용: python3 tools/build_pick_index.py  → data/pick_index.json
import json, re, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
idx = json.load(open(os.path.join(ROOT, 'data/search_index.json')))
out = []
for x in idx:
    path = os.path.join(ROOT, 'data/mdetail/%d.html' % x['i'])
    if not os.path.exists(path):
        continue
    html = open(path, encoding='utf-8').read()
    meta = {}
    m = re.search(r'<!--FLOWMETA (.*?)-->', html)
    if m:
        try: meta = json.loads(m.group(1))
        except ValueError: pass
    parts = [s.strip() for s in meta.get('title', '').split('|')]
    sup = parts[1] if len(parts) > 2 and parts[1] not in ('플로우잇고',) and not parts[1].startswith('상조') else ''
    terms = [int(t) for t in re.findall(r'\d+-(\d+)회', html)]
    item = {'i': x['i'], 'n': x['n'], 'm': x['m'], 'p': x['p'], 't': x['t'], 'c': x['c'],
            'img': meta.get('og_image', '')}
    if sup: item['s'] = sup
    if terms: item['e'] = max(terms)
    out.append(item)
json.dump(out, open(os.path.join(ROOT, 'data/pick_index.json'), 'w', encoding='utf-8'),
          ensure_ascii=False, separators=(',', ':'))
print(len(out), 'items')
