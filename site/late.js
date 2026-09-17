/* 플로우잇고 복제 — 페이지 끝에서 로드. 서버로 가던 폼(빠른상담·렌탈신청·사업자견적·파트너문의)을
 * 텔레그램 알림으로 바꾸고, 서버 없이는 동작하지 않는 기능(회원·장바구니·관심상품)을 안내로 대체한다. */
(function () {
  var $ = window.jQuery;
  var C = window.FLOW_CONFIG || {};
  var TG = C.TELEGRAM || {};
  var FLOW = window.FLOW || {};

  function pageName() {
    var t = document.title || '';
    return t.split('|')[0].trim();
  }
  function digits(s) { return String(s || '').replace(/[^0-9]/g, ''); }
  function validPhone(s) { var d = digits(s); return d.length >= 9 && d.length <= 11; }

  // ---------------------------------------------------------------- 텔레그램 전송
  function sendTelegram(text, ok, fail) {
    if (!TG.token || !TG.chat_id) { fail && fail('no-config'); return; }
    var url = 'https://api.telegram.org/bot' + TG.token + '/sendMessage';
    var body = JSON.stringify({ chat_id: TG.chat_id, text: text, disable_web_page_preview: true });
    if (window.fetch) {
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body })
        .then(function (r) { return r.json(); })
        .then(function (j) { if (j && j.ok) ok && ok(); else fail && fail(j); })
        .catch(function (e) { fail && fail(e); });
    } else {
      var x = new XMLHttpRequest();
      x.open('POST', url, true);
      x.setRequestHeader('Content-Type', 'application/json');
      x.onreadystatechange = function () { if (x.readyState === 4) { if (x.status === 200) ok && ok(); else fail && fail(x.status); } };
      x.send(body);
    }
  }

  function sendLead(kind, fields, afterOk) {
    var lines = ['★' + kind + '★', C.SITE_NAME || '플로우잇고', ''];
    Object.keys(fields).forEach(function (k) { if (fields[k]) lines.push(k + ' : ' + fields[k]); });
    lines.push('', '페이지 : ' + location.href, '시각 : ' + new Date().toLocaleString('ko-KR'));
    var text = lines.join('\n');
    sendTelegram(text, function () {
      alert('상담 신청이 접수되었습니다.\n확인 후 빠르게 연락드리겠습니다.');
      afterOk && afterOk();
    }, function (err) {
      console.error('lead send failed', err);
      if (confirm('접수에 실패했습니다. 카카오톡 상담으로 연결할까요?')) window.open(C.KAKAO_URL || 'http://pf.kakao.com/_xowzxhX/chat', '_blank');
    });
  }
  FLOW.sendLead = sendLead;

  // ---------------------------------------------------------------- 빠른 렌탈상담 (하단 고정 바)
  window.customerRequests = function (obj) {
    var f = (obj && obj.form) || document.easyCallFrm || document.forms['f'] || document.getElementById('quickForm');
    if (!f) return false;
    var name = f.cust_name && f.cust_name.value.trim();
    var tel = f.cust_tel && f.cust_tel.value.trim();
    if (!name) { alert('이름을 입력해 주세요'); f.cust_name.focus(); return false; }
    if (!tel) { alert('연락처를 입력해 주세요'); f.cust_tel.focus(); return false; }
    if (!validPhone(tel)) { alert('연락처를 숫자만 정확히 입력해 주세요.'); f.cust_tel.focus(); return false; }
    if (f.chk_agree && !f.chk_agree.checked) { alert('[개인정보 수집동의] 체크를 해주셔야 상담신청이 가능합니다.'); f.chk_agree.focus(); return false; }
    sendLead('빠른상담', { '이름': name, '연락처': digits(tel) }, function () {
      f.cust_name.value = ''; f.cust_tel.value = '';
      if (f.chk_agree) f.chk_agree.checked = false;
      $('.fixed_cs, .quick_cs_wrap').removeClass('on');
    });
    return false;
  };

  // ---------------------------------------------------------------- 사업자 렌탈 견적
  window.b2bRequestSubmit = function () {
    var f = document.b2bReqeustForm;
    if (!f) return false;
    var company = f.cust_company.value.trim(), name = f.cust_name.value.trim(), tel = f.cust_tel.value.trim();
    if (!company) { alert('회사/업체명을 입력해 주세요.'); f.cust_company.focus(); return false; }
    if (!name) { alert('담당자명을 입력해 주세요.'); f.cust_name.focus(); return false; }
    if (!validPhone(tel)) { alert('연락처를 숫자만 정확히 입력해 주세요.'); f.cust_tel.focus(); return false; }
    if (f.chk_agree_b2b && !f.chk_agree_b2b.checked) { alert('[개인정보 수집 이용 동의] 체크를 해주셔야 신청이 가능합니다.'); return false; }
    var email = (f.cust_email_1 && f.cust_email_1.value.trim()) ? f.cust_email_1.value.trim() + '@' + (f.cust_email_2 ? f.cust_email_2.value.trim() : '') : '';
    sendLead('사업자 렌탈 견적문의', { '회사/업체명': company, '담당자명': name, '연락처': digits(tel), '이메일': email, '문의내용': f.message ? f.message.value.trim() : '' }, function () { f.reset(); });
    return false;
  };

  // ---------------------------------------------------------------- 파트너 신청 문의
  window.ptInquireSubmit = function () {
    var f = document.ptInquireForm;
    if (!f) return false;
    var name = f.cust_name.value.trim(), tel = f.cust_tel.value.trim();
    if (!name) { alert('담당자명을 입력해 주세요.'); f.cust_name.focus(); return false; }
    if (!validPhone(tel)) { alert('연락처를 숫자만 정확히 입력해 주세요.'); f.cust_tel.focus(); return false; }
    if (f.chk_agree_b2b && !f.chk_agree_b2b.checked) { alert('[개인정보 수집 및 이용 동의] 체크를 해주셔야 상담신청이 가능합니다.'); return false; }
    sendLead('파트너 신청문의', { '회사/업체명': f.cust_company ? f.cust_company.value.trim() : '', '담당자명': name, '연락처': digits(tel), '이메일': f.cust_email ? f.cust_email.value.trim() : '', '상담 요청사항': f.cust_content ? f.cust_content.value.trim() : '' }, function () { f.reset(); });
    return false;
  };

  // ---------------------------------------------------------------- 렌탈 신청 → 상담 신청 창
  var MODAL_CSS = '#flowLead{position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px}' +
    '#flowLead .box{background:#fff;border-radius:12px;width:100%;max-width:440px;padding:26px 24px 22px;font-family:"Noto Sans KR","NanumSquareRound",sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.35);max-height:92vh;overflow:auto}' +
    '#flowLead h3{font-size:20px;font-weight:700;margin:0 0 6px;color:#111}#flowLead .prod{font-size:13px;color:#555;background:#f5f6f8;border-radius:8px;padding:10px 12px;margin:10px 0 14px;line-height:1.5;word-break:break-all}' +
    '#flowLead label{display:block;font-size:13px;color:#333;margin:10px 0 4px;font-weight:500}#flowLead input,#flowLead textarea{width:100%;box-sizing:border-box;border:1px solid #d5d8de;border-radius:6px;padding:11px 12px;font-size:15px;font-family:inherit}' +
    '#flowLead textarea{height:74px;resize:vertical}#flowLead .agree{display:flex;align-items:center;gap:6px;font-size:12px;color:#555;margin-top:12px}#flowLead .agree input{width:auto}' +
    '#flowLead .btns{display:flex;gap:8px;margin-top:16px}#flowLead button{flex:1;border:0;border-radius:6px;padding:13px 0;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit}' +
    '#flowLead .ok{background:#1a1f2c;color:#fff}#flowLead .kakao{background:#fae100;color:#3c1e1e}#flowLead .cancel{background:#eef0f3;color:#333;flex:0 0 90px}';

  function productSummary() {
    var parts = [];
    var name = pageName();
    if (name) parts.push(name);
    var modal = $('#order_step1, #ly_orderStpe1').filter(':visible').first();
    if (modal.length) {
      var t = modal.find('.info, .prod_info_wrap').first().text().replace(/\s+/g, ' ').trim();
      if (t) parts.push(t.slice(0, 160));
    }
    var opts = [];
    $('select.it_option, select.it_supply').each(function () {
      var v = $(this).val(); if (v) opts.push(String(v).split(',')[0]);
    });
    $('#option_set_added .io_value, #optionLists .opt_name').each(function () { var t = $(this).text().trim(); if (t) opts.push(t); });
    if (opts.length) parts.push('옵션 : ' + opts.join(' / '));
    var price = $('#sit_tot_price, #order_step1 .order_prodPrc strong, #ly_orderStpe1 .prc_wrap strong').filter(':visible').first().text().trim();
    if (price && price !== '0') parts.push('월 ' + price + '원');
    return parts.join('\n');
  }

  function openLeadModal(kind, summary) {
    $('#flowLead').remove();
    if (!$('#flowLeadCss').length) $('<style id="flowLeadCss">' + MODAL_CSS + '</style>').appendTo('head');
    var box = $('<div id="flowLead"><div class="box"><h3>' + kind + '</h3>' +
      '<div class="prod">' + $('<div>').text(summary || pageName()).html().replace(/\n/g, '<br>') + '</div>' +
      '<label>이름</label><input type="text" name="lead_name" maxlength="20" placeholder="이름">' +
      '<label>연락처</label><input type="tel" name="lead_tel" maxlength="13" placeholder="숫자만 입력">' +
      '<label>요청사항 (선택)</label><textarea name="lead_memo" placeholder="희망 약정기간, 설치 희망일 등"></textarea>' +
      '<label class="agree"><input type="checkbox" name="lead_agree"> 개인정보 수집·이용 동의 (상담 목적, 상담 완료 후 파기)</label>' +
      '<div class="btns"><button type="button" class="cancel">닫기</button><button type="button" class="kakao">카카오톡</button><button type="button" class="ok">상담 신청</button></div>' +
      '</div></div>').appendTo('body');
    box.on('click', function (e) { if (e.target === this) box.remove(); });
    box.find('.cancel').on('click', function () { box.remove(); });
    box.find('.kakao').on('click', function () { window.open(C.KAKAO_URL || 'http://pf.kakao.com/_xowzxhX/chat', '_blank'); });
    box.find('.ok').on('click', function () {
      var name = box.find('[name=lead_name]').val().trim(), tel = box.find('[name=lead_tel]').val().trim();
      if (!name) { alert('이름을 입력해 주세요.'); return; }
      if (!validPhone(tel)) { alert('연락처를 숫자만 정확히 입력해 주세요.'); return; }
      if (!box.find('[name=lead_agree]').prop('checked')) { alert('개인정보 수집·이용에 동의해 주세요.'); return; }
      box.find('.ok').prop('disabled', true).text('접수중…');
      sendLead(kind, { '상품': summary || pageName(), '이름': name, '연락처': digits(tel), '요청사항': box.find('[name=lead_memo]').val().trim() }, function () {
        box.remove();
        $('#order_step1, #ly_orderStpe1').each(function () { try { $(this).modal && $(this).modal('hide'); } catch (e) {} $(this).hide(); });
        $('.mongLayer_wrap, .modal-backdrop').hide();
      });
      setTimeout(function () { box.find('.ok').prop('disabled', false).text('상담 신청'); }, 4000);
    });
    setTimeout(function () { box.find('[name=lead_name]').focus(); }, 50);
  }
  FLOW.openLeadModal = openLeadModal;

  window.fbuyform_submit = function (mode) {
    openLeadModal(mode === 'cart' ? '상담 신청' : '렌탈 신청 상담', productSummary());
    return false;
  };
  window.item_wish = function () { alert('관심상품 기능은 제공하지 않습니다.\n카카오톡 상담을 이용해 주세요.'); return false; };
  window.flogin_submit = function () { alert('회원 로그인은 제공하지 않습니다.'); return false; };
  window.fsubmit_check = window.fsubmit_check || function () { return true; };

  // 원본 스크립트가 늦게 fbuyform_submit 을 재정의해도 우리 것이 이기도록
  var ours = window.fbuyform_submit;
  setInterval(function () { if (window.fbuyform_submit !== ours) window.fbuyform_submit = ours; }, 500);

  // ---------------------------------------------------------------- 서버 기능 링크 정리
  $(function () {
    if (C.HIDE_MEMBER_LINKS !== false) {
      $('a[href$="/bbs/login.html"], a[href$="/model/cart.html"]').closest('li').hide();
      $('a[href$="/bbs/login.html"], a[href$="/model/cart.html"]').not('li a').hide();
      $('.item_cart').attr('href', C.KAKAO_URL || '#').attr('target', '_blank').find('span').text('카톡상담');
      $('.item_cart .cnt').remove();
    }
    // 장바구니/관심 버튼 → 상담
    $('a.cart_btn').text('상담 신청');
    // 검색 폼: 원본 fsearch_submit 없이도 동작
    $('form[name=fsearch], form[action$="/model/search.html"]').off('submit').on('submit', function () {
      var v = $(this).find('[name=ss_tx]').val();
      if (!v || !v.trim()) { alert('검색어를 입력해 주세요.'); return false; }
      return true;
    });
    // 모바일: PC 화면 링크가 있으면 pc=1 유지
    $('a[href="/"]').filter(function () { return $(this).text().indexOf('PC') >= 0; }).attr('href', '/?pc=1');
  });
})();
