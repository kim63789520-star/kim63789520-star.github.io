/* 플로우잇고 복제 — 서버 API 에뮬레이션 (jQuery 직후 로드)
 *  /api/v2/models        → /data/cat/<top>.json · /data/home.json · /data/search_index.json 에서 계산
 *  /shop/view_option.php → /data/options/<gs_id>.json
 *  목록/상세 조각 로드   → FLOW.writeFragment('list'|'detail')
 */
(function () {
  var $ = window.jQuery;
  var C = window.FLOW_CONFIG || {};
  var FLOW = window.FLOW = {
    mobile: !!window.FLOW_MOBILE,
    cache: {},
    meta: null,
    cfg: C
  };
  var pending = {}; // url -> callbacks (async 중복 요청 합치기)

  // ---------------------------------------------------------------- 로더
  function getSync(url) {
    try {
      var x = new XMLHttpRequest();
      x.open('GET', url, false);
      x.send(null);
      if (x.status >= 200 && x.status < 300) return x.responseText;
    } catch (e) {}
    return null;
  }
  FLOW.getSync = getSync;

  function loadJSON(url, sync, cb) {
    if (FLOW.cache[url] !== undefined) { cb(FLOW.cache[url]); return; }
    if (sync) {
      var t = getSync(url);
      var v = null;
      try { v = t ? JSON.parse(t) : null; } catch (e) { v = null; }
      FLOW.cache[url] = v; cb(v); return;
    }
    if (pending[url]) { pending[url].push(cb); return; }
    pending[url] = [cb];
    var x = new XMLHttpRequest();
    x.open('GET', url, true);
    x.onreadystatechange = function () {
      if (x.readyState !== 4) return;
      var v = null;
      if (x.status >= 200 && x.status < 300) { try { v = JSON.parse(x.responseText); } catch (e) { v = null; } }
      FLOW.cache[url] = v;
      var cbs = pending[url]; delete pending[url];
      for (var i = 0; i < cbs.length; i++) { try { cbs[i](v); } catch (e) { console.error(e); } }
    };
    x.send(null);
  }
  FLOW.loadJSON = loadJSON;

  // ---------------------------------------------------------------- 파라미터
  function parseParams(data) {
    var list = [];
    function add(k, v) {
      k = decodeURIComponent(String(k).replace(/\+/g, ' '));
      v = decodeURIComponent(String(v == null ? '' : v).replace(/\+/g, ' '));
      list.push([k, v]);
    }
    if (typeof data === 'string') {
      data.split('&').forEach(function (kv) {
        if (!kv) return;
        var i = kv.indexOf('=');
        if (i < 0) add(kv, ''); else add(kv.slice(0, i), kv.slice(i + 1));
      });
    } else if (data && typeof data === 'object') {
      Object.keys(data).forEach(function (k) {
        var v = data[k];
        if (Array.isArray(v)) v.forEach(function (x) { add(k.indexOf('[]') > 0 ? k : k + '[]', x); });
        else add(k, v);
      });
    }
    return {
      get: function (k) { for (var i = 0; i < list.length; i++) if (list[i][0] === k) return list[i][1]; return null; },
      all: function (k) { var r = []; for (var i = 0; i < list.length; i++) if (list[i][0] === k) r.push(list[i][1]); return r; },
      list: list
    };
  }
  FLOW.parseParams = parseParams;

  // ---------------------------------------------------------------- 상품 목록 계산
  function bySort(ids, cat, sort, odr) {
    if (!sort) return ids;
    var key = sort + '_' + (odr || 'ASC').toUpperCase();
    var order = cat.sort && cat.sort[key];
    if (order) {
      var pos = {};
      for (var i = 0; i < order.length; i++) pos[order[i]] = i;
      return ids.slice().sort(function (a, b) { return (pos[a] === undefined ? 1e9 : pos[a]) - (pos[b] === undefined ? 1e9 : pos[b]); });
    }
    var desc = (odr || 'ASC').toUpperCase() === 'DESC';
    function val(i) { var m = cat.models[i] || {}; return sort === 'model_idx' ? i : (parseInt(m[sort]) || 0); }
    return ids.slice().sort(function (a, b) { return desc ? val(b) - val(a) : val(a) - val(b); });
  }

  function computeList(cat, P) {
    var ca = P.get('ca_id') || cat.ca_id;
    var ids, fl = cat.FilterList || [];
    if (ca.length > 3) {
      if (cat.subs && cat.subs[ca]) { ids = cat.subs[ca].ids; fl = cat.subs[ca].FilterList || fl; }
      else ids = cat.ids.filter(function (i) { return (cat.models[i] || {}).primary_category_code === ca; });
    } else ids = cat.ids;
    var fc = P.all('filter_catecode[]');
    if (fc.length) {
      var acc = {};
      fc.forEach(function (v) {
        var k = ca + '|' + v, arr;
        if (cat.subs && cat.subs[k]) arr = cat.subs[k].ids;
        else if (cat.subs && cat.subs[v]) arr = cat.subs[v].ids;
        else arr = cat.ids.filter(function (i) { return String((cat.models[i] || {}).primary_category_code || '').indexOf(v) === 0; });
        arr.forEach(function (i) { acc[i] = 1; });
      });
      ids = ids.filter(function (i) { return acc[i]; });
      if (fc.length === 1 && cat.subs && cat.subs[ca + '|' + fc[0]]) fl = cat.subs[ca + '|' + fc[0]].FilterList || fl;
    }
    ['seller', 'ftid', 'icon', 'ftval'].forEach(function (p) {
      var vals = P.all('filter_' + p + '[]');
      if (!vals.length) return;
      var set = {};
      vals.forEach(function (v) { ((cat.filters && cat.filters[p] && cat.filters[p][v]) || []).forEach(function (i) { set[i] = 1; }); });
      ids = ids.filter(function (i) { return set[i]; });
    });
    var brands = P.all('filter_brand[]');
    if (brands.length) {
      var bs = {};
      brands.forEach(function (b) { bs[String(b).replace(/^b/, '')] = 1; });
      ids = ids.filter(function (i) { return bs[String((cat.models[i] || {}).brand_uid)]; });
    }
    ids = bySort(ids, cat, P.get('sort'), P.get('sortodr'));
    var rows = parseInt(P.get('page_rows')) || 1000;
    var page = parseInt(P.get('page')) || 1;
    var total = ids.length;
    var start = (page - 1) * rows;
    var Lists = ids.slice(start, start + rows).map(function (i) { return cat.models[i]; }).filter(Boolean);
    return {
      Counts: total, Lists: Lists, page: page, StartNum: start, ListSize: rows,
      pageTotal: Math.max(1, Math.ceil(total / rows)), section: P.get('section') || null,
      FilterList: fl, Banners: null, Paginations: null, ca_id: ca
    };
  }

  function computeSearch(P, sync, done) {
    var term = (P.get('ss_tx') || '').trim().toLowerCase();
    var words = term ? term.split(/\s+/) : [];
    var fsection = P.get('fsection') || 'rental';
    loadJSON('/data/search_index.json', sync, function (idx) {
      idx = idx || [];
      var hits = idx.filter(function (it) {
        var isF = it.t === 'F';
        if (fsection === 'sangjo' ? !isF : isF) return false;
        var hay = (it.n + ' ' + it.m).toLowerCase();
        for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) < 0) return false;
        return words.length > 0;
      });
      var tops = {};
      hits.forEach(function (h) { tops[(h.c && h.c[0]) || '000'] = 1; });
      var keys = Object.keys(tops), left = keys.length;
      var cats = {};
      function finish() {
        var Lists = [];
        hits.forEach(function (h) {
          var top = (h.c && h.c[0]) || '';
          var m = cats[top] && cats[top].models && cats[top].models[h.i];
          if (m) Lists.push(m);
        });
        var sort = P.get('sort'), odr = (P.get('sortodr') || 'ASC').toUpperCase();
        if (sort) {
          Lists.sort(function (a, b) {
            var va = sort === 'model_idx' ? a.model_idx : (parseInt(a[sort]) || 0);
            var vb = sort === 'model_idx' ? b.model_idx : (parseInt(b[sort]) || 0);
            return odr === 'DESC' ? vb - va : va - vb;
          });
        }
        var rows = parseInt(P.get('page_rows')) || 1000, page = parseInt(P.get('page')) || 1, start = (page - 1) * rows;
        done({ Counts: Lists.length, Lists: Lists.slice(start, start + rows), page: page, StartNum: start, ListSize: rows,
          pageTotal: Math.max(1, Math.ceil(Lists.length / rows)), section: P.get('section') || null,
          FilterList: [], Banners: null, Paginations: null, ca_id: P.get('ca_id') || '' });
      }
      if (!left) { finish(); return; }
      keys.forEach(function (top) {
        loadJSON('/data/cat/' + top + '.json', sync, function (c) { cats[top] = c; if (--left === 0) finish(); });
      });
    });
  }

  function handleModels(P, sync, done) {
    if (P.get('ss_tx') !== null) return computeSearch(P, sync, done);
    var ca = P.get('ca_id') || '';
    var top = ca.slice(0, 3);
    var isHome = /^\/(m\/)?(index\.html)?$/.test(location.pathname);
    if (isHome && ca.length === 3 && !P.get('section')) {
      loadJSON('/data/home.json', sync, function (home) {
        var h = home && home[ca];
        if (h) {
          var rows = parseInt(P.get('page_rows')) || 8;
          done({ Counts: h.Counts, Lists: h.Lists.slice(0, rows), page: 1, StartNum: 0, ListSize: rows, pageTotal: Math.ceil(h.Counts / rows), section: null, FilterList: [], Banners: null, ca_id: ca });
        } else done({ Counts: 0, Lists: [], page: 1, StartNum: 0, ListSize: 8, pageTotal: 0, section: null, FilterList: [], Banners: null, ca_id: ca });
      });
      return;
    }
    loadJSON('/data/cat/' + top + '.json', sync, function (cat) {
      if (!cat) { done({ Counts: 0, Lists: [], page: 1, StartNum: 0, ListSize: 1000, pageTotal: 0, section: P.get('section'), FilterList: [], Banners: null, Paginations: null, ca_id: ca }); return; }
      done(computeList(cat, P));
    });
  }

  function handleOptions(data, sync, done) {
    var d = (typeof data === 'string') ? (function () { var P = parseParams(data); return { gs_id: P.get('gs_id'), opt_id: P.get('opt_id') }; })() : (data || {});
    loadJSON('/data/options/' + d.gs_id + '.json', sync, function (tree) {
      var html = tree && tree[d.opt_id];
      done(html || '<option value="">(필수) 선택하세요</option>');
    });
  }

  // ---------------------------------------------------------------- $.ajax 가로채기
  function fakeXhr(opts, run) {
    var dfd = $.Deferred();
    var jq = dfd.promise();
    jq.success = jq.done; jq.error = jq.fail; jq.complete = jq.always;
    jq.abort = function () {}; jq.getResponseHeader = function () { return null; }; jq.status = 200;
    function go() {
      try { if (opts.beforeSend) opts.beforeSend(jq, opts); } catch (e) { console.error(e); }
      run(function (data) {
        try { if (opts.success) opts.success(data, 'success', jq); } catch (e) { console.error(e); }
        try { dfd.resolve(data, 'success', jq); } catch (e) { console.error(e); }
        try { if (opts.complete) opts.complete(jq, 'success'); } catch (e) { console.error(e); }
        try { FLOW.afterList && FLOW.afterList(data); } catch (e) { console.error(e); }
      });
    }
    if (opts.async === false) go(); else setTimeout(go, 0);
    return jq;
  }

  if ($ && $.ajax) {
    var _ajax = $.ajax;
    $.ajax = function (url, opts) {
      if (typeof url === 'object') { opts = url; url = opts.url; }
      opts = opts || {};
      url = url || opts.url || '';
      var sync = opts.async === false;
      if (/\/api\/v2\/models/.test(url)) {
        var q = url.indexOf('?') > 0 ? url.slice(url.indexOf('?') + 1) : '';
        var P = parseParams(q ? q + (typeof opts.data === 'string' && opts.data ? '&' + opts.data : '') : opts.data);
        if (q && opts.data && typeof opts.data === 'object') { var P2 = parseParams(opts.data); P.list.push.apply(P.list, P2.list); }
        return fakeXhr(opts, function (done) { handleModels(P, sync, done); });
      }
      if (/view_option\.php/.test(url)) return fakeXhr(opts, function (done) { handleOptions(opts.data, sync, done); });
      if (/ajax\.wishupdate|ajax\.hd_banner|request_push|cartupdate|wishupdate|orderinquiryview|login_check/.test(url)) {
        return fakeXhr(opts, function (done) { done(''); });
      }
      return _ajax.apply(this, arguments);
    };
    $.ajaxSetup && $.ajaxSetup({ cache: true });
  }

  // ---------------------------------------------------------------- 조각 로드 (셸 페이지)
  function parseMeta(html) {
    var m = html.match(/^<!--FLOWMETA (.*?)-->/);
    if (!m) return null;
    try { return JSON.parse(m[1]); } catch (e) { return null; }
  }
  function setMeta(name, attr, content) {
    var el = document.querySelector('meta[' + attr + '="' + name + '"]');
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
    el.setAttribute('content', content);
  }
  FLOW.indexMap = function () {
    var v; loadJSON('/data/index_map.json', true, function (x) { v = x; }); return v || {};
  };
  FLOW.writeFragment = function (kind) {
    var q = new URLSearchParams(location.search);
    var base = FLOW.mobile ? '/data/m' : '/data/';
    var url, alt = null;
    if (kind === 'list') {
      var ca = q.get('ca_id') || '';
      var fc = q.getAll('filter_catecode[]'), fb = q.getAll('filter_brand[]');
      var dir = base + 'list/';
      if (ca === '035' && fc.length) url = dir + 'ca_id-035_filter_catecode-' + fc[0] + '.html';
      else if (ca === '006003' && fb[0] === 'b1') url = dir + 'ca_id-006003_filter_brand-b1.html';
      else url = dir + 'ca_id-' + ca + '.html';
      alt = dir + 'ca_id-' + ca.slice(0, 3) + '.html';
    } else {
      var idx = q.get('model_idx');
      if (!idx) { var ino = q.get('index_no'); idx = FLOW.indexMap()[ino]; }
      url = base + 'detail/' + idx + '.html';
    }
    var html = url ? getSync(url) : null;
    if (html == null && alt) html = getSync(alt);
    if (html == null) {
      html = '<div id="container"><div id="contents"><div class="inner" style="max-width:720px;margin:0 auto;padding:110px 20px 140px;text-align:center;line-height:1.7"><h2 style="font-size:24px;font-weight:700">상품을 찾을 수 없습니다</h2><p style="color:#666;margin-top:10px">판매가 종료되었거나 주소가 잘못되었습니다.</p><p style="margin-top:28px"><a href="' + (FLOW.mobile ? '/m/' : '/') + '" style="display:inline-block;padding:12px 26px;background:#1a1f2c;color:#fff;border-radius:6px;text-decoration:none">홈으로</a></p></div></div></div>';
    }
    var meta = parseMeta(html);
    FLOW.meta = meta;
    if (meta) {
      if (meta.title) { document.title = meta.title; setMeta('og:title', 'property', meta.title); }
      if (meta.description) { setMeta('description', 'name', meta.description); setMeta('og:description', 'property', meta.description); }
      if (meta.og_image) setMeta('og:image', 'property', meta.og_image);
      setMeta('og:url', 'property', location.href);
      if (meta.goods_types === 'F' && C.HIDE_CARD_DISCOUNT_SANGJO !== false) {
        document.write('<style id="flow-hide-card">.card_sale_box,.card_btn_box,.card_total,.card_sale_wrap,.card_prc,.card_sale_pop_wrap,a[href="#card_sale_wrap"],.pr_comp_box .card_prc,.l_price .card_prc{display:none!important}</style>');
      }
    }
    document.write(html);
  };

  // ---------------------------------------------------------------- 상조가전 카드할인 숨김 (목록)
  FLOW.afterList = function (data) {
    if (C.HIDE_CARD_DISCOUNT_SANGJO === false || !data || !data.Lists) return;
    var f = {};
    data.Lists.forEach(function (m) { if (m && m.goods_types === 'F') { f[m.model_idx] = 1; } });
    if (!Object.keys(f).length) return;
    setTimeout(function () {
      $('.item_list_cont li a[href*="model_idx="], .item_list_cont li a[href*="index_no="], .list_best_item a[href*="model_idx="]').each(function () {
        var href = $(this).attr('href') || '';
        var m = href.match(/model_idx=(\d+)/);
        var idx = m ? parseInt(m[1]) : null;
        if (idx && f[idx]) $(this).closest('li').find('.card_prc, .card_total').hide();
      });
    }, 0);
  };
})();
