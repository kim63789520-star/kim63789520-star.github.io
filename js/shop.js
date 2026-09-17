var option_add = false;
var supply_add = false;
var isAndroid = (navigator.userAgent.toLowerCase().indexOf("android") > -1);

$(function() {

    /* 키보드 접근 후 옵션 선택 Enter keydown 이벤트 대응 */
    $(document).on("keydown", "select.it_option", function(e) {
        var sel_count = $("select.it_option").length;
        var idx = $("select.it_option").index($(this));
        var code = e.keyCode;
        var val = $(this).val();

        option_add = false;
        if(code == 13 && sel_count == idx + 1) {
            if(val == "")
                return;

            sel_option_process(true);
        }
    });

    if(isAndroid) {
        $(document).on("click", "select.it_option", function() {
            option_add = true;
        });
    } else {
        $(document).on("click", "select.it_option", function() {
            option_add = true;
        });
    }

    $(document).on("change", "select.it_option", function() {
        var sel_count = $("select.it_option").length;
        var idx = $("select.it_option").index($(this));
        var val = $(this).val();
        var gs_id = $("input[name='gs_id[]']").val();

        // 부모태그체크
        var selParent = $(this).parent("div");

        // 선택값이 없을 경우 하위 옵션은 disabled
        if(val == "") {
            // selectric 사용했을경우 refresh
            if(selParent.hasClass("selectric-hide-select") === true) $("select.it_option").selectric('refresh');

            return;
        }
        option_add = true;

        // 하위주문옵션로드
        if(sel_count > 1 && (idx + 1) < sel_count) {
            var opt_id = "";

            // 상위 옵션의 값을 읽어 옵션id 만듬
            if(idx > 0) {
                $("select.it_option:lt("+idx+")").each(function() {
                    if(!opt_id)
                        opt_id = $(this).val();
                    else
                        opt_id += chr(30)+$(this).val();
                });

                opt_id += chr(30)+val;
            } else if(idx == 0) {
                opt_id = val;
            }
            $.post(
                "/shop/view_option.php",
                { gs_id: gs_id, opt_id: opt_id, idx: idx, sel_count: sel_count },
                function(data) {
                    if (typeof goodsData != 'undefined') {
                        if (goodsData['isopen'] != '1') {
                        }else{
                            $("select.it_option").eq(idx+1).empty().html(data).attr("disabled", false);
                        }
                    }else{
                        $("select.it_option").eq(idx+1).empty().html(data).attr("disabled", false);
                    }

                    // select의 옵션이 변경됐을 경우 하위 옵션 disabled
                    if(idx+1 < sel_count) {
                        var idx2 = idx + 1;
                        // selectric 사용했을경우 refresh
                        if(selParent.hasClass("selectric-hide-select") === true) {}$("select.it_option").selectric('refresh');
                    }
                }
            );

        } else if((idx + 1) == sel_count) { // 주문옵션처리
            if(option_add && val == "")
                return;
            var info = val.split(",");

            if (option_add) {
                sel_option_process(true);
            }
        }
    });

    // 추가옵션
    /* 키보드 접근 후 옵션 선택 Enter keydown 이벤트 대응 */
    $(document).on("keydown", "select.it_supply", function(e) {
        var $el = $(this);
        var code = e.keyCode;
        var val = $(this).val();

        supply_add = false;
        if(code == 13) {
            if(val == "")
                return;

            sel_supply_process($el, true);
        }
    });

    if(isAndroid) {
        $(document).on("click", "select.it_supply", function() {
            supply_add = true;
        });
    } else {
        $(document).on("click", "select.it_supply", function() {
            supply_add = true;
        });
    }

    $(document).on("change", "select.it_supply", function() {
        var $el = $(this);
        var val = $(this).val();

        if(val == "")
            return;

        if(supply_add)
            sel_supply_process($el, true);
    });

    // 수량변경 및 삭제
	$(document).on("click", "#option_set_list li button", function() {
        var mode = $(this).text();
        var this_qty, max_qty = 9999, min_qty = 1;
        var $el_qty = $(this).closest("li").find("input[name^=ct_qty]");
        var stock = parseInt($(this).closest("li").find("input.io_stock").val());

		switch(mode) {
            case "증가":
                this_qty = parseInt($el_qty.val().replace(/[^0-9]/, "")) + 1;
                if(this_qty > stock) {
                    alert("재고수량 보다 많은 수량을 구매할 수 없습니다.");
                    this_qty = stock;
                }

                if(this_qty > max_qty) {
                    this_qty = max_qty;
                    alert("최대 구매수량은 "+number_format(String(max_qty))+" 이하 입니다.");
                }

                $el_qty.val(this_qty);
                price_calculate();
                break;

            case "감소":
                this_qty = parseInt($el_qty.val().replace(/[^0-9]/, "")) - 1;
                if(this_qty < min_qty) {
                    this_qty = min_qty;
                    alert("최소 구매수량은 "+number_format(String(min_qty))+" 이상 입니다.");
                }
                $el_qty.val(this_qty);
                price_calculate();
                break;

            case "삭제":
                if(confirm("선택하신 옵션항목을 삭제하시겠습니까?")) {
                    var $el = $(this).closest("li");
                    var del_exec = true;

                    if($("#option_set_list .sit_opt_list").length > 0) {
                        // 주문옵션이 하나이상인지
                        if($el.hasClass("sit_opt_list")) {
                            if($(".sit_opt_list").length <= 1)
                                del_exec = false;
                        }
                    }

                    if(del_exec) {
                        $el.closest("li").remove();
                        price_calculate();
                    } else {
                        alert("주문옵션은 하나이상이어야 합니다.");
                        return false;
                    }
                }
                break;

            default:
                alert("올바른 방법으로 이용해 주십시오.");
                break;
        }
    });

	// 수량직접입력
	$(document).on("keyup", "input[name^=ct_qty]", function() {
        var val= $(this).val();

        if(val != "") {
            if(val.replace(/[0-9]/g, "").length > 0) {
                alert("수량은 숫자만 입력해 주십시오.");
                $(this).val(1);
            } else {
                var d_val = parseInt(val);
                if(d_val < 1 || d_val > 9999) {
                    alert("수량은 1에서 9999 사이의 값으로 입력해 주십시오.");
                    $(this).val(1);
                } else {
                    var stock = parseInt($(this).closest("li").find("input.io_stock").val());
                    if(d_val > stock) {
                        alert("재고수량 보다 많은 수량을 구매할 수 없습니다.");
                        $(this).val(stock);
                    }
                }
            }

            price_calculate();
        }
    });
});

// W11 3차(F10): 선택된 옵션 키(chr(30)로 이어붙인 io_id)로 optEvent 트리 노드를 직접 조회한다.
// 트리 전역변수 optionEvents 는 compare_001 상세(PC theme/bilrigo_compare_001/view.skin.php ·
// M m/theme/bilrigo_compare_001/view.skin.php)에서만 datas["getOptions"]["optEvent"] 로 대입된다 —
// shop.js 는 수백 개 스킨이 공유하므로 트리가 없는 페이지에서는 무조건 null 을 돌려 호출부가 기존
// 동작(CSV 토큰만) 그대로 남게 한다(바이트 동일). 탐색 방식은 compare.skin.php 의 hasEventData()와 동일.
function w11OptionEventNode(id) {
    if (typeof optionEvents === 'undefined' || !optionEvents) {
        return null;
    }

    var keys = String(id).split(chr(30));
    var node = optionEvents;
    for (var i = 0; i < keys.length; i++) {
        if (!node || typeof node !== 'object' || !node.hasOwnProperty(keys[i])) {
            return null;
        }
        node = node[keys[i]];
    }

    return (node && typeof node === 'object') ? node : null;
}

// 주문옵션 추가처리
function sel_option_process(add_exec) {

    var id = "";
    var value, info, sel_opt, item, price, stock, amt, link, run_error = false, combine_price, event_price, event_date, event_month_from, mb_id, option_id;
    var event_title, event_flags, event_schedule, event_extra_count, event_node;
    var option = sep = "";

    info = $("select.it_option:last").val().split(",");
    option_id = $("select.it_option:last").find("option:selected").data("option-id") || "";

    $("select.it_option").each(function(index) {
        value = $(this).val();
        item = $(this).closest(".vi_txt_li dl").find("dt label").text();

        if(!value) {
            run_error = true;
            return false;
        }

        // 옵션선택정보
        sel_opt = value.split(",")[0];

        if(id == "") {
            id = sel_opt;
        } else {
            id += chr(30)+sel_opt;
            sep = " / ";
        }

        option += sep + item + ":" + sel_opt;
    });

    if(run_error) {
        alert(item+"을(를) 선택해 주십시오.");
        return false;
    }

    price = info[1];
    stock = info[2];
	amt = info[3];
	link = ($('input[name=external_link]').val()) ? $('input[name=external_link]').val() : (typeof info[4] !== '0') ? info[4] : '0';
    combine_price = info[5];

    mb_id = ($('input[name=mb_id]').val()) ? $('input[name=mb_id]').val() : '';

    event_price = (info[6]) ? info[6] : '';
    event_date = (info[7]) ? info[7] : '';
    // W6-F 결정ⓑ: 상세 안내문 시작 회차 반영용(get_item_options() CSV의 신규 8번째 토큰)
    event_month_from = (info[8]) ? info[8] : '';

    // W11 3차(F10): 다축(2축 이상) 상세는 view.skin.php 의 `$("select.it_option").length > 1` 분기 때문에
    // optEvent 트리 직독 경로가 아니라 이 CSV 경로로 떨어진다 — 그 바람에 event_title·flags·schedule·
    // extra_count 가 통째로 유실돼 딱지가 항상 1개(자동 라벨)로만 나오고 관리자 문구·W11 안내문도 미적용,
    // 중첩 스케줄 안내문도 틀린 금액으로 나왔다. CSV 프로토콜(D-W6-F, 하네스 w2_snapshot/w6_t4 가 바이트를
    // 고정한다)은 손대지 않고, 페이지에 이미 인라인으로 실려 있는 optEvent 트리를 선택 키로 조회해 채운다.
    // ev_price/ev_date 는 CSV(info[6]/info[7])를 계속 쓴다 — 트리와 CSV 가 어긋날 때 기존 계약(CSV 가
    // 대표 토큰 정본)을 깨지 않기 위해서다. event_month_from 만 단일축 경로와 동일하게 트리 값을 우선한다.
    // 트리에 없는 키는 undefined 로 남겨 add_sel_option 의 기존 폴백이 그대로 살아있게 한다.
    event_node = w11OptionEventNode(id);
    if (event_node) {
        if (typeof event_node['ev_title'] !== 'undefined') {
            event_title = event_node['ev_title'];
        }
        if (typeof event_node['ev_month_from'] !== 'undefined') {
            event_month_from = event_node['ev_month_from'];
        }
        if (typeof event_node['flags'] !== 'undefined') {
            event_flags = event_node['flags'];
        }
        if (typeof event_node['schedule'] !== 'undefined') {
            event_schedule = event_node['schedule'];
        }
        if (typeof event_node['extra_count'] !== 'undefined') {
            event_extra_count = event_node['extra_count'];
        }
    }

    if(add_exec) {
        if(same_option_check(option))
            return;

        add_sel_option(0, id, option, price, stock, amt, link, combine_price, event_price, event_date, mb_id, option_id, event_title, event_month_from, event_flags, event_schedule, event_extra_count);
    }
}

// W6 리뷰픽스 I2 보강: event_title(관리자 자유입력, ADMIN 소스)이 이 함수를 거쳐 .html()로 들어갈 수
// 있게 되면서 새로 생긴 XSS 싱크 — I1(shared-rules §4)과 동일한 이유로 이스케이프한다.
function w6EscapeHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// 선택된 옵션 출력
// W6 리뷰픽스 I2: event_title 을 맨 끝 신규(선택) 인자로 추가 — 기존 호출부(수십 곳, sel_option_process
// 포함)는 이 인자를 넘기지 않으므로 undefined 로 들어와 optionEventLabel 폴백(자동 라벨)이 그대로
// 유지된다. view.skin.php(단일옵션 상세, optEvent 트리 직독 경로)만 실제 title 을 넘긴다.
// W6-F 결정ⓑ: event_month_from 을 event_title 뒤 신규(선택) 인자로 추가 — 마찬가지로 안 넘기는
// 호출부는 undefined 로 들어와 기본값 1(기존 "1개월부터" 문구, no-op)로 폴백한다.
// W9 Task3: event_flags(optEvent 트리 flags[])·event_schedule(schedule[])을 맨 끝에 추가 — 역시
// 선택 인자라 안 넘기는 호출부는 undefined 로 들어와 기존 단일 딱지/단일 안내문 동작 그대로 유지된다.
// view.skin.php(compare, 단일옵션 상세)만 실제 배열을 넘긴다.
// 리뷰 픽스 I2(2026-09-03): event_extra_count(optEvent 트리 extra_count) 를 맨 끝에 추가 — "+N" 배지용.
function add_sel_option(type, id, option, price, stock, amt, link, combine_price, event_price, event_date, mb_id, option_id, event_title, event_month_from, event_flags, event_schedule, event_extra_count)
{
    var item_code = $("input[name='gs_id[]']").val();
    var opt = "";
    var li_class = "sit_opt_list";
    if(type)
        li_class = "sit_spl_list";

    var opt_prc;
	var pamt = parseInt(price) + parseInt(amt);
    if(parseInt(pamt) >= 0)
        opt_prc = "+"+number_format(String(pamt))+"원";
    else
        opt_prc = number_format(String(pamt))+"원";

    opt += "<li class=\""+li_class+" vi_txt_li\">\n";
	opt += "<dl>\n";
    opt += "<input type=\"hidden\" name=\"io_type["+item_code+"][]\" value=\""+type+"\">\n";
    opt += "<input type=\"hidden\" name=\"io_id["+item_code+"][]\" value=\""+id+"\">\n";
    if (option_id) {
        opt += "<input type=\"hidden\" name=\"io_option_id["+item_code+"][]\" value=\""+option_id+"\">\n";
    }
    opt += "<input type=\"hidden\" name=\"io_value["+item_code+"][]\" value=\""+option+"\">\n";
    if (link) {
        opt += "<input type=\"hidden\" name=\"io_link["+item_code+"][]\" value=\""+link+"\">\n";
    }
    opt += "<input type=\"hidden\" class=\"io_price\" value=\""+price+"\">\n";
    opt += "<input type=\"hidden\" class=\"io_combine_price\" value=\""+combine_price+"\">\n";

    if(event_price){
        opt += "<input type=\"hidden\" name=\"io_event_price\" class=\"io_event_price\" value=\""+event_price+"\">\n";
    }
    if(event_date){
        opt += "<input type=\"hidden\" name=\"io_event_date\" class=\"io_event_date\" value=\""+event_date+"\">\n";
    }

    opt += "<input type=\"hidden\" class=\"io_stock\" value=\""+stock+"\">\n";
		opt += "<dt class=\"op_vi_tit\"><span class=\"sit_opt_subj\">"+option+"</span></dt>\n";
		opt += "<dd class=\"op_vi_txt\">\n";
			opt += "<button type=\"button\" class=\"defbtn_minus\">감소</button>";
			opt += "<input type=\"text\" name=\"ct_qty["+item_code+"][]\" value=\"1\" class=\"inp_opt\" size=\"2\">";
			opt += "<button type=\"button\" class=\"defbtn_plus\">증가</button>";
			opt += "<span class=\"sit_opt_prc\">"+opt_prc+"</span>\n";
			opt += "<button type=\"button\" class=\"defbtn_delete\">삭제</button>\n";
		opt += "</dd>\n";
	opt += "</dl>\n";
    opt += "</li>\n";

    if($("#option_set_list > ul").length < 1){ // 옵션이 하나도 없을 때
        $("#option_set_list").html("<ul id=\"option_set_added\"></ul>");
        $("#option_set_added").html(opt);
    }
    else{ // 기본옵션,추가옵션 상관없이 1개라도 있을 때
        if($("#option_set_added").length < 1){ // 추가옵션은 있고 기본옵션은 선택 안한 경우
            $("#option_set_list > ul").before("<ul id=\"option_set_added\"></ul>");
            $("#option_set_added").html(opt);
        }else{
            if($("#option_set_list .sit_opt_list").length > 0){
                $("#option_set_list .sit_opt_list:last").html(opt);
            }else{
                $("#option_set_added").html(opt);
            }
        }
    }

    var evt = "";
    var not = "";
    var copy = "";
    let nextMonth = Number(event_date) + 1;
    // 2026-09-08: 할인가(#event_price)를 꽂을 자리. 본몰은 `.box_wrap.ad .smmr_prc`(PC) / `.prod_prc_wrap`(M)
    // 인데 bilrigo_multiple_001 엔 그 래퍼가 둘 다 없어서 선택자가 빈 집합이 됐고, totPrice.after() 가
    // 조용히 아무 일도 안 했다 — 딱지는 뜨는데 가격만 정가로 남던 원인. 안내문과 같은 스킨 앵커
    // (`.event_notice_anchor`, 가격 요약 블록에 붙어 있다)를 추가로 받는다. PC·M 마크업이 같은 구조라 한 줄로 둘 다 잡힌다.
    let totPrice = $('.box_wrap.ad .smmr_prc dl dd #sit_tot_price, .event_notice_anchor dl dd #sit_tot_price');
    let moTotPrice = $('.prod_prc_wrap dl dd #sit_tot_price');
    /* 2026-09-08: 이전 옵션에서 꽂아둔 할인가·안내문을 **매번 먼저 지운다**.
       본몰은 스킨이 4곳에서 지우지만(theme/bilrigo_compare_001/view.skin.php:1471·1485·1504·1811)
       그 코드가 없는 테마(bilrigo_multiple_001)는 옵션을 바꿀 때마다 #event_price 가 쌓여
       "11,95013,45013,950…" 처럼 붙어 나왔고, 프로모션 없는 옵션으로 바꿔도 지워지지 않았다.
       여기서 지우면 스킨이 이미 지운 테마에선 no-op 이라 기존 동작은 바이트 동일하다.
       지우는 대상은 전부 이 함수가 만든 것뿐이다(#event_price·#event_notice·.optEventPrice·discount 클래스). */
    $('#event_price, #event_notice, #itemBrief .optEventPrice').remove();
    totPrice.removeClass('discount');
    moTotPrice.removeClass('discount');
    // W9 Task3: 딱지 전부(최대 3, 우선순위 순) — .flag_discount_wrap 안의 전용 슬롯(.event_flag_slot)을
    // 인덱스로 채운다. 기존 'span:not(.model)' 전체 매칭 + .html() 은 슬롯이 여러 개면 전부에 같은
    // 내용이 중복 렌더되므로 슬롯 전용 선택자로 교체.
    let flagSlots = $('.flag_discount_wrap .event_flag_slot');
    // W11 5차(F15): 슬롯은 옵션을 바꿀 때마다 재사용된다 — 이전 옵션에서 붙은 프리셋 색 클래스를 지우지 않으면
    // 색 없는 프로모션으로 바꿔도 옛 색이 남는다. 화이트리스트는 js/option_event.js 가 정본이라 그대로 파생해 쓰고,
    // 그 파일이 안 실려 있으면 프리셋을 붙이는 경로 자체가 없으므로 빈 문자열(현행과 동일)이면 된다.
    let flagPresetClasses = (typeof OPTION_EVENT_BADGE_COLORS !== 'undefined')
        ? OPTION_EVENT_BADGE_COLORS.map(function (c) { return 'flag-preset-' + c; }).join(' ')
        : '';
    // W11 10차: 관리자가 고르는 색이 자유 색상(hex)이 되면서 CSS 클래스로는 표현할 수 없어 인라인으로 칠한다.
    // 위 프리셋 클래스와 같은 이유로 **지우는 쪽이 더 중요하다** — 슬롯은 옵션 전환마다 재사용되므로 색 없는
    // 프로모션으로 바꿀 때 인라인 색을 비워야 이전 옵션 색이 남지 않는다.
    let applyFlagColor = function ($el, color) {
        let hex = (typeof optionEventBadgeHex === 'function') ? optionEventBadgeHex(color || '') : '';
        if (hex === '') { $el.css({ background: '', borderColor: '', color: '' }); return; }
        // 형제 지점과 같이 명시 가드 — 두 함수는 같은 커밋에서 생겼지만 위 hex==='' 분기에만 기대면 나중에 깨진다(부분배포 감사 지적).
        var fg = (typeof optionEventBadgeTextColor === 'function') ? optionEventBadgeTextColor(hex) : '';
        $el.css({ background: hex, borderColor: hex, color: fg });
    };

    // W6-F 결정ⓑ: 프로모션 시작 회차(month_from) 반영 — 값 없음/1이면 기존 "1개월부터" 문구 그대로(no-op)
    let promoMonthFrom = parseInt(event_month_from, 10) || 1;
    let evt_txt = promoMonthFrom + '개월부터 ';
    // 전자구독, 세스코인 경우(특정 회원 하드코딩 — month_from 반영보다 우선)
    if(mb_id == 'AP-100010' && event_date == 6 || mb_id == 'AP-100042'){
        evt_txt = '2개월부터 ';
        nextMonth = nextMonth + 1;
    }

    if(event_price){
        evt += "<em id='event_price' class='ff_Play event'>" + number_format(event_price) + "</em>";

        // 정액(N개월/X원 고정가) 프로모션 판정 — js/option_event.js가 이 페이지에 로드된 경우만 활성화.
        // 미로드 페이지(shop.js 로더 다수 — option_event.js 미배치)는 아래 폴백으로 기존 "N개월 반값" 문구 그대로 유지.
        var isFlatEvent = (typeof optionEventIsFlat === 'function') && optionEventIsFlat(event_price, price);
        var eventAmountTxt = isFlatEvent ? optionEventAmountText(event_price) : '';

        // W9 Task3: 상세 안내문 스케줄 — optEvent 트리 schedule[](2개 구간 이상, 프로모션 중첩)이 있으면
        // "1~10개월 8,500원 · 11~12개월 8,883원 · 그 외 정가" 형태로 교체한다. schedule 이 1구간뿐이면
        // (기존 단일 프로모션·MIGRATED no-op) 기존 문구 그대로(바이트 동일) — event_schedule 을 안 넘기는
        // 호출부(CSV 경로)도 이 분기로 떨어져 동일하게 유지된다.
        // 리뷰 픽스 M5(2026-09-03): base(정가) 구간은 나열에서 제외 — non-base 구간만 "N~M개월 X원"으로
        // 나열하고 "그 외 정가"를 고정 접미로 붙인다(구간 중간에 정가로 되돌아가는 gap 이 있어도
        // "X~Y개월 {정가}원"으로 노출되지 않는다).
        // W11 3차(F10) 리뷰픽스: 두 값의 타입이 달라 M5 의 base 제외가 무력화돼 있었다 — schedule[].price 는
        // promotion_stack_schedule() 이 만든 PHP int 라 json_encode 를 거쳐 숫자로 오고(실측 148685: 10000),
        // price 는 optEvent 형제인 temp 트리 leaf(io_price 문자열 '18900')이거나 CSV info[1] 이라 항상 문자열이다.
        // `!==` 로 비교하면 모든 구간이 non-base 로 집계돼 정가 구간까지 "N~M개월 {정가}원"으로 나열된다.
        // 같은 로직의 다른 사본(theme/bilrigo_compare_001/compare.skin.php 의 nonBaseSegments)은 이미
        // Number() 정규화를 쓰고 있어 두 사본이 어긋나 있었다 — 그쪽에 맞춘다.
        var subNotiText;
        var nonBaseSegments = [];
        if (event_schedule) {
            for (var si = 0; si < event_schedule.length; si++) {
                if (Number(event_schedule[si].price) !== Number(price)) {
                    nonBaseSegments.push(event_schedule[si]);
                }
            }
        }
        if (nonBaseSegments.length > 1) {
            var scheduleParts = [];
            for (var pi = 0; pi < nonBaseSegments.length; pi++) {
                scheduleParts.push(nonBaseSegments[pi].from + '~' + nonBaseSegments[pi].to + '개월 ' + number_format(nonBaseSegments[pi].price) + '원');
            }
            scheduleParts.push('그 외 정가');
            subNotiText = "&#8251; " + scheduleParts.join(' · ');
        } else {
            subNotiText = "&#8251; 렌탈료 납부 " + evt_txt + event_date + "개월간 청구되는 렌탈료이며, <em>" + nextMonth + "개월차부터</em> 기본 약정 할인 렌탈료 <em>월 " + number_format(price) + "원</em>이 청구됩니다.";
        }

        // W11 F5: 관리자 안내문(프로모션 정의의 안내 강조문/본문 → flags[].notice_title/notice_text) —
        // js/option_event.js 의 optionEventNoticeRender 가 로드돼 있고 값이 있을 때만 위 자동 문구를 대체한다
        // (플레이스홀더 치환·이스케이프는 렌더 함수 책임). 미로드·NULL·event_flags 미전달(CSV 경로)이면
        // 현행 문구 그대로(바이트 동일). copy(itemBrief)는 무변경.
        // W11 4차(F14): flags[0] 하나가 아니라 "문구가 있는 활성 프로모션 전부"를 우선순위 순으로 나열한다
        // (스펙 §10-1, theme/bilrigo_compare_001/compare.skin.php·orderform.skin.php 와 동일 계약).
        // 각 문구의 플레이스홀더는 그 flag 자신의 값으로 치환한다 — {개월}=month_to, {시작}=month_from,
        // {다음개월}=month_to+1(특례 보정 포함), {할인가}=effective_value(단독 적용가), {기본가}=옵션 정가.
        // flags[0] 값을 다른 문구에 재사용하지 않는다(딱지가 자기 값으로 계산되는 것과 같은 원칙 — 리뷰픽스 I1).
        // 강조문·본문이 둘 다 비었거나 렌더 결과가 빈 프로모션은 건너뛴다. 하나도 남지 않으면(렌더 함수
        // 미로드·event_flags 미전달(CSV 경로)·전부 빈 값) 자동 문구 1벌로 폴백한다(바이트 동일).
        // 4차 리뷰픽스: 한쪽만 채운 프로모션은 3차까지 "강조문 + 자동 문장" 이었으나 4차부터는 가진 쪽만
        //   나온다 — 문구가 하나라도 렌더되면 자동 문장은 폴백하지 않는다(§10-1 "전부 비면" + 형제 2본 동치).
        //   가려진 프로모션의 강조문 밑에 승자 기준 자동 문장이 짝처럼 붙는 오표시를 막는다.
        // 특례(AP-100010 6개월/AP-100042 '2개월부터')는 폴백 문장(evt_txt/nextMonth)에 그대로 남기고,
        //   관리자 문구에서는 스펙 §7 대로 {다음개월} 값에만 같은 조건으로 반영한다.
        var autoNotiTitleHTML = isFlatEvent
            ? "<p><strong>" + event_date + "개월 월 " + eventAmountTxt + " 할인</strong> 프로모션 진행 중!</p>"
            : "<p><strong>" + event_date + "개월 렌탈료 반값 할인</strong> 프로모션 진행 중!</p>";
        var noticeReady = (typeof optionEventNoticeRender === 'function');
        var noticeHtml = '';
        if (noticeReady && event_flags && event_flags.length) {
            for (var nki = 0; nki < event_flags.length; nki++) {
                var kf = event_flags[nki];
                if (!kf) continue;
                var kfMonthTo = (typeof kf.month_to !== 'undefined' && kf.month_to !== null) ? kf.month_to : event_date;
                // 다음개월 = 그 프로모션 자신의 끝 회차 + 1. 전자구독·세스코 특례는 위 폴백 문장(nextMonth)과
                // 같은 조건으로 1 더한다.
                var kfNextMonth = Number(kfMonthTo) + 1;
                if (mb_id == 'AP-100010' && Number(kfMonthTo) === 6 || mb_id == 'AP-100042') {
                    kfNextMonth = kfNextMonth + 1;
                }
                var kfVars = {
                    // 2026-09-07 — 적용 기간(종료 - 시작 + 1). "…{개월}개월간" 이라 종료 회차가 아니다.
                    '개월': String(Math.max(0, Number(kfMonthTo) - Number((typeof kf.month_from !== 'undefined' && kf.month_from !== null) ? kf.month_from : promoMonthFrom) + 1)),
                    '시작': String((typeof kf.month_from !== 'undefined' && kf.month_from !== null) ? kf.month_from : promoMonthFrom),
                    '다음개월': String(kfNextMonth),
                    '할인가': number_format((typeof kf.effective_value !== 'undefined' && kf.effective_value !== null) ? kf.effective_value : event_price),
                    '기본가': number_format(price)
                };
                // 렌더 결과로 다시 빈값을 검사한다 — 후보 선별(진위값)과 렌더 함수의 공백 판정(JS trim 은
                // 전각공백 U+3000·U+00A0 도 지운다)이 어긋나면 빈 <strong> 이 렌더되고 폴백도 막힌다.
                // 2026-09-07 — 숨김 토큰 {없음} 은 **칸마다 따로** 먹는다("강조문은 쓰고 본문만 없애기").
                // 원본으로 판정한다 — render() 가 토큰을 <em> 로 감싸면 못 알아본다.
                var kfHidF = (typeof optionEventNoticeHiddenField === 'function') ? optionEventNoticeHiddenField : function(){ return false; };
                var kfHidTit = kfHidF(kf.notice_title);
                var kfHidTxt = kfHidF(kf.notice_text);
                var kfTit = (!kfHidTit && kf.notice_title) ? optionEventNoticeRender(kf.notice_title, kfVars) : '';
                var kfTxt = (!kfHidTxt && kf.notice_text) ? optionEventNoticeRender(kf.notice_text, kfVars) : '';

                // W11 13차(사용자 요청 "딱지 3개면 안내문도 3개"): 관리자 문구가 없는 프로모션(반값처럼
                // notice 가 NULL)도 건너뛰지 않고 **자기 값으로 만든 자동 문구**를 낸다. 4차(F14)에서 건너뛰게
                // 했던 이유(승자 기준 자동 문장이 남의 강조문 밑에 붙는 오표시)는 이제 없다 — 아래 인자가
                // 전부 그 flag 자신의 값이다. 마크업은 아래 폴백 블록의 자동 문구와 **글자 그대로 같게** 둔다
                // (반값 1건짜리 상품 = 운영 대부분이 여기로 오므로 출력 바이트가 바뀌면 안 된다).
                var kfAuto = false;
                // 한 칸이라도 {없음} 이면 "관리자가 지정한 것" — 자동 문구가 끼어들면 안 된다.
                // 아래 출력 블록은 그대로 타므로 남은 칸(예: 강조문만)은 정상 출력된다.
                if (kfTit === '' && kfTxt === '' && !(kfHidTit || kfHidTxt)) {
                    if (typeof optionEventNoticeAuto !== 'function') continue; // 미배포 → 종전대로 건너뜀
                    // W11 13·14차: 스케줄을 같이 넘긴다 — 끝난 다음 구간이 정가가 아니면(중첩) 그 구간의
                    // 범위·금액을 사실대로 쓰기 위해서다("N개월차부터 정가"는 거짓이 될 수 있다).
                    var kfAutoParts = optionEventNoticeAuto(
                        (typeof kf.month_from !== 'undefined' && kf.month_from !== null) ? kf.month_from : promoMonthFrom,
                        kfMonthTo,
                        (typeof kf.effective_value !== 'undefined' && kf.effective_value !== null) ? kf.effective_value : event_price,
                        price,
                        mb_id,
                        event_schedule
                    );
                    kfTit = kfAutoParts.tit;
                    kfTxt = kfAutoParts.txt;
                    kfAuto = true;
                }
                if (kfTit !== '') {
                    noticeHtml +=  "<div class='main_noti'>";
                    // 자동 문구는 폴백 블록(autoNotiTitleHTML)과 같은 "…<strong>제목</strong> 프로모션 진행 중!" 형태.
                    noticeHtml +=  kfAuto
                        ? ("<p><strong>" + kfTit + "</strong> 프로모션 진행 중!</p>")
                        : ("<p><strong>" + kfTit + "</strong></p>");
                    noticeHtml +=  "</div>";
                }
                if (kfTxt !== '') {
                    noticeHtml +=  "<p class='sub_noti'>" + kfTxt + "</p>";
                }
            }
        }
        // 2026-09-07 — 관리자가 {없음} 으로 일부러 숨긴 경우엔 옛 자동 문구 폴백도 내지 않는다.
        // 그냥 비어 있는 것(구 API·부분배포)과 구분해야 해서 flags[].noticeHidden 을 본다.
        // 접수 텍스트(copy) 는 아래에서 따로 만들며 여기 영향을 받지 않는다 — 표시만 끈다.
        // flags 는 경로에 따라 키 이름이 다르다: 상세 인라인(lib/common.lib.php 가 promotion_stack_schedule 결과를
        // 그대로 심는다)은 **원본** notice_title/notice_text 를 들고 오고, api/v3 를 거친 목록·파트너 테마는
        // 이미 판정된 noticeHidden 을 들고 온다. 둘 다 본다.
        var kfHiddenAny = false;
        if (event_flags && event_flags.length) {
            for (var kh = 0; kh < event_flags.length; kh++) {
                var khf = event_flags[kh];
                if (!khf) continue;
                if (khf.noticeHidden) { kfHiddenAny = true; break; }
                if (typeof optionEventNoticeHidden === 'function'
                    && optionEventNoticeHidden(khf.notice_title, khf.notice_text)) { kfHiddenAny = true; break; }
            }
        }
        if (noticeHtml === '' && !kfHiddenAny) {
            noticeHtml =  "<div class='main_noti'>";
            noticeHtml +=  autoNotiTitleHTML;
            noticeHtml +=  "</div>";
            noticeHtml +=  "<p class='sub_noti'>" + subNotiText + "</p>";
        }

        not += "<div id='event_notice'>";
        not += noticeHtml;
        not += "</div>";

        if (isFlatEvent) {
            copy += "● 할인 : " + event_date + "개월(월 " + eventAmountTxt + ")";
        } else {
            copy += "● 반값할인 : " + event_date + "개월";
        }

        // W9 Task3: 딱지 전부(최대 3, 우선순위 순) — event_flags(optEvent 트리 flags[])가 있으면 슬롯별로
        // 렌더한다. W6: sel_option_process() 호출(다축 선택, view_option.php CSV 프로토콜)은 event_title·
        // event_flags 를 넘기지 않아 undefined → flags[0] 1개짜리 목록으로 폴백해 기존 동작(바이트 동일)을
        // 유지한다. view.skin.php(단일옵션 상세, optEvent 트리 직독 경로)만 실제 배열을 넘긴다(리뷰픽스 I2
        // 연장).
        // W11 5차(F15): 상세도 색상은 관리자 지정대로 — shape 인자는 'circle' 고정(모양 현행 유지)이고 color 만
        // 그 flag 자신의 badge_color 를 넘긴다(flags[0] 색을 전부에 재사용하지 않는다). badge_color 가 없는
        // 프로모션·CSV 폴백 항목은 빈 문자열이라 클래스가 안 붙어 기존 출력과 동일. '+N' 초과분 배지는 자기 색이
        // 없으므로 현행(색 없음) 유지.
        // 리뷰 픽스 I1(2026-09-03): 각 딱지는 공용 event_date/event_price(첫 구간 기준)가 아니라 자기
        // 자신의 month_to/effective_value 로 라벨·클래스를 계산한다 — 안 그러면 반값(1~12) 딱지가 다른
        // rule 의 구간월/가를 빌려 "10개월 반값"으로 오표시된다(148685 실측 정답: [10개월 1만원][12개월
        // 반값]). event_flags 를 안 넘기는 호출부(CSV 경로)의 합성 폴백 항목은 month_to/effective_value
        // 가 없어 기존 event_date/event_price 로 그대로 폴백(바이트 동일).
        var flagsToRender = (event_flags && event_flags.length) ? event_flags : [{ title: event_title || '', month_to: event_date, effective_value: event_price }];
        var eventExtraCount = parseInt(event_extra_count, 10) || 0;
        flagSlots.each(function (i) {
            var $slot = $(this);
            var f = flagsToRender[i];
            if (f) {
                var flagMonthTo = (typeof f.month_to !== 'undefined' && f.month_to !== null) ? f.month_to : event_date;
                var flagEffectiveValue = (typeof f.effective_value !== 'undefined' && f.effective_value !== null) ? f.effective_value : event_price;
                var flagClass = (typeof optionEventFlagClass === 'function') ? optionEventFlagClass(flagEffectiveValue, price, 'circle', f.badge_color || '') : 'flag-ioPriceEvent-date';
                var slotLabel = w6EscapeHtml((typeof optionEventLabel === 'function') ? optionEventLabel(f.title || '', flagMonthTo, flagEffectiveValue, price, (typeof f.month_from !== 'undefined' && f.month_from !== null) ? f.month_from : 1) : (event_date + "개월 반값"));
                $slot.removeClass('flag-ioPriceEvent-date flag-ioPriceEvent-flat ' + flagPresetClasses).addClass('flag ' + flagClass).html(slotLabel);
                applyFlagColor($slot, f.badge_color || ''); // W11 10차: 자유 색상(hex) — 색 없으면 인라인을 비워 셀러 CI색으로
                return;
            }
            // 리뷰 픽스 I2: flags 채운 바로 다음 슬롯에 3개 초과분 "+N" 배지(신규 CSS 없이 기존
            // flag-ioPriceEvent-date 스타일 재사용).
            if (i === flagsToRender.length && eventExtraCount > 0) {
                $slot.removeClass('flag-ioPriceEvent-date flag-ioPriceEvent-flat ' + flagPresetClasses).addClass('flag flag-ioPriceEvent-date').html('+' + eventExtraCount);
                applyFlagColor($slot, ''); // '+N' 초과분은 자기 색이 없다 — 이전 옵션 색을 반드시 지운다
                return;
            }
            $slot.removeClass('flag flag-ioPriceEvent-date flag-ioPriceEvent-flat ' + flagPresetClasses).empty();
            applyFlagColor($slot, ''); // 빈 슬롯 — 인라인 색 잔상 제거
        });

        // pc
        totPrice.after(evt);
        totPrice.addClass('discount');
        // W12(2026-09-07): 본몰은 `.box_wrap.ad .smmr_prc`, 그 래퍼가 없는 테마(bilrigo_multiple_001)는
        // 스킨이 직접 단 `.event_notice_anchor`. 같은 엘리먼트가 둘 다 맞아도 jQuery 가 중복을 제거해 한 번만 꽂는다.
        $('.box_wrap.ad .smmr_prc, .event_notice_anchor').after(not);

        if ($("#itemBrief .optEventPrice").length < 1) {
            $('#itemBrief').append([
                $('<i>', {class: 'optEventPrice', text: copy})
            ]);
        } else {
            $("#itemBrief > .optEventPrice").empty().html(copy);
        }

        // mobile
        moTotPrice.after(evt);
        moTotPrice.addClass('discount');
        $('.prod_prc_wrap').after(not);


    }

    price_calculate();
}

// 추가옵션 추가처리
function sel_supply_process(ele, add_exec){
    var id = "";
    var value, info, sel_opt, item, price, stock, amt, run_error = false;
    var option = "";

    value = $(ele).val(); // 옵션값
    item = $(ele).closest(".vi_txt_li dl").find("dt label").text(); // 옵션명

    if(!value){
        run_error = true;
        return false;
    }

    // 옵션 값을 변경하는 경우 동일한 옵션만 변경
    $("#supply_set_added .sit_spl_list").find("input").each(function (){
        if ($(this).val().indexOf(item) > -1) {
            $(this).closest('.sit_spl_list').remove();
            return false;
        }
    });

    // 선택옵션 정보
    info = value.split(",");
    sel_opt = value.split(",")[0];

    if(id == ""){
        id = sel_opt;
    }else{
        id += chr(30) + sel_opt;
    }

    option += item + ":" + sel_opt;

    price = info[1];
    stock = info[2];
    amt = info[3];

    add_spl_option(1, id, option, price, stock, amt);

}

// 선택된 추가옵션 출력
function add_spl_option(type, id, option, price, stock, amt){

    var item_code = $("input[name='gs_id[]']").val();
    var opt = "";
    var opt_prc = "";
    var pamt = parseInt(price) + parseInt(amt);

    if(parseInt(pamt) > 0){
        opt_prc = "+" + number_format(String(pamt)) + "원";
    }

    opt += "<li class=\"sit_spl_list vi_txt_li\">";
    opt += "<dl>";
    opt += "<input type=\"hidden\" name=\"io_type[" + item_code + "][]\" value=\"" + type + "\">\n";
    opt += "<input type=\"hidden\" name=\"io_id[" + item_code + "][]\" value=\"" + id + "\">\n";
    opt += "<input type=\"hidden\" name=\"io_value[" + item_code + "][]\" value=\"" + option + "\">\n";
    opt += "<input type=\"hidden\" class=\"io_price\" value=\"" + price + "\">\n";
    opt += "<input type=\"hidden\" class=\"io_stock\" value=\"" + stock + "\">\n";
    opt += "<dt class=\"op_vi_tit\"><span class=\"sit_opt_subj\">" + option + "</span></dt>\n";
    opt += "<dd class=\"op_vi_txt\">\n";
    opt += "<button type=\"button\" class=\"defbtn_minus\">감소</button>";
    opt += "<input type=\"text\" name=\"ct_qty[" + item_code + "][]\" value=\"1\" class=\"inp_opt\" size=\"2\">";
    opt += "<button type=\"button\" class=\"defbtn_plus\">증가</button>";
    opt += "<span class=\"sit_opt_prc\">" + opt_prc + "</span>\n";
    opt += "<button type=\"button\" class=\"defbtn_delete\">삭제</button>\n";
    opt += "</dd>\n";
    opt += "</dl>\n";
    opt += "</li>";

    if($("#option_set_list > ul").length < 1){ // 옵션이 하나도 없을 때
        $("#option_set_list").html("<ul id=\"supply_set_added\"></ul>");
        $("#supply_set_added").html(opt);
    }
    else{ // 기본옵션,추가옵션 상관없이 1개라도 있을 때
        if($("#supply_set_added").length < 1){ // 추가옵션은 있고 기본옵션은 선택 안한 경우
            $("#option_set_list > ul").after("<ul id=\"supply_set_added\"></ul>");
            $("#supply_set_added").html(opt);
        }else{
            if($("#option_set_list .sit_spl_list").length > 0){
                $("#option_set_list .sit_spl_list:last").after(opt);
            }else{
                $("#supply_set_added").html(opt);
            }
        }
    }

    price_calculate();

}

// 동일주문옵션있는지
function same_option_check(val)
{
    var result = false;
    $("input[name^=io_value]").each(function() {
        if(val == $(this).val()) {
            result = true;
            return false;
        }
    });

    return result;
}

// 가격계산
function price_calculate(){
    var it_price = 0;
    var alPrice = parseInt($("input#alPrice").val());

    if(isNaN(it_price))
        return;

    // 필수옵션
    var $el_prc = $("#option_set_added input.io_price");
    var $el_com_prc = $("#option_set_added input.io_combine_price");
    var $el_evt_prc = $("#option_set_added input.io_event_price");
    var $el_qty = $("#option_set_added input[name^=ct_qty]");
    var $el_type = $("#option_set_added input[name^=io_type]");
    var $el_id = $("#option_set_added input[name^=io_id]");
    var $el_link = $("#option_set_added input[name^=io_link]");
    var $el_external_link = $("#option_set_added input[name=external_link]");
    var ids, price, type, qty, link, total = 0, combine_price, diff_combine_price, event_price;

    $el_prc.each(function(index) {

        price = parseInt($(this).val());
        combine_price = (parseInt($el_com_prc.val()) === 0) ? price : parseInt($el_com_prc.val());
        event_price = $el_evt_prc.val();
        diff_combine_price = (combine_price === 0) ? 0 : (price - combine_price);
        qty   = parseInt($el_qty.eq(index).val());
        type  = $el_type.eq(index).val();
        ids   = $el_id.eq(index).val();
        link   = ($el_external_link.val()) ? $el_external_link.val() : $el_link.eq(index).val();
        if(type == "0") { // 주문옵션
            total += (it_price + price) * qty;
        } else { // 추가옵션
            total += price * qty;
        }
    });

    // 추가옵션을 먼저 선택한 경우
    if(typeof  combine_price === 'undefined' || typeof diff_combine_price === 'undefined'){
        combine_price = 0;
        diff_combine_price = 0;
    }

    totalSum = (typeof event_price !== 'undefined') ? event_price - alPrice : total - alPrice;
    totalSum = totalSum > 0 ? totalSum : 0;

	$("#sit_tot_views").show();
    $("#sit_tot_price").empty().html(number_format(String(total)));
    $("#sale_tot_price").empty().html(number_format(String(totalSum)));
    $("#sale_tot_combine_price").empty().html(number_format(String(combine_price)));
    $("#sale_tot_diff_combine_price").empty().html(number_format(String(diff_combine_price)));

    // 상품간략정보 복사: io_id 는 다축 주문옵션을 chr(30)으로 이어붙인 값이라 그대로 넣으면
    // 구분자가 안 보여 "월 35,900원 / 6년 의무방문관리(12개월 라이트)"처럼 2축부터가 렌탈료 문구에
    // 들러붙는다. 1축만 렌탈료 줄에 두고, 2축부터는 축 이름(관리주기 등)을 붙여 별도 ● 줄로 뺀다.
    var brief_opts = String(ids).split(chr(30));
    var brief_subj = [];
    $("select.it_option").each(function() {
        brief_subj.push($.trim($(this).closest(".vi_txt_li dl").find("dt label").text()));
    });

    $("#itemBrief > .itemBriefPrice").empty().html(number_format(String(total)));
    $("#itemBrief > .itemBriefCombinePrice").empty().html(number_format(String(combine_price)));
    $("#itemBrief > .itemBriefDiffCombinePrice").empty().html(number_format(String(diff_combine_price)));
    $("#itemBrief > .itemBriefOption").empty().html(number_format(String(brief_opts[0])));
    $("#itemBrief > .itemBriefCombineOption").empty().html(number_format(String(brief_opts[0])));

    // 2축 이후를 렌탈료 줄 바로 다음에 한 줄씩 끼워넣는다(주문URL·추가옵션은 아래에서 뒤에 붙는다).
    $("#itemBrief > .itemBriefSubOption").remove();
    var $brief_anchor = $("#itemBrief > .itemBriefOption").last();
    for (var brief_idx = brief_opts.length - 1; brief_idx > 0; brief_idx--) {
        var brief_name = brief_subj[brief_idx] ? brief_subj[brief_idx] : "옵션";
        var $brief_line = $('<i>', {class:'itemBriefSubOption', text:'\n● ' + brief_name + ' : ' + brief_opts[brief_idx]});

        if ($brief_anchor.length) {
            $brief_anchor.after($brief_line);
        } else {
            $('#itemBrief').append($brief_line);
        }
    }

    let el_partner_shop_name = encodeURIComponent($("input[name^='partner_shop_name']").val());
    let el_partner_id =  encodeURIComponent($("input[name^='partner_id']").val());

    if (link && link != '0') {
        $('#itemBrief > .itemBriefLink').remove();

        if (el_partner_id && el_partner_id != 'undefined') {
            $('#itemBrief').append([
                $('<i>',{class:'itemBriefLink',text:'● 주문URL : ' + link + '&managerKey=' + el_partner_shop_name + '_' + el_partner_id})
            ]);
        } else {
            $('#itemBrief').append([
                $('<i>',{class:'itemBriefLink',text:'● 주문URL : ' + link})
            ]);
        }
    }

    // 추가옵션
    if($("#supply_set_added").length > 0) {
        var spl_id = [];
        $(".sit_spl_list input[name^=io_value]").each(function () {
            var item = $(this).val();
            spl_id.push(item);
        });

        spl_id = '● ' + spl_id.join(" / ");

        if ($("#itemBrief .itemSupplyOption").length < 1) {
            $('#itemBrief').append([
                $('<i>', {class: 'itemSupplyOption', text: spl_id})
            ]);
        } else {
            $("#itemBrief > .itemSupplyOption").empty().html(spl_id);
        }
    }
}

// php chr() 대응
function chr(code)
{
    return String.fromCharCode(code);
}

/* product info copy modified */
function rf_copyToClipboard(element) {

    if($(".sit_opt_list").length < 1) {
        alert("주문 옵션을 선택해 주시기 바랍니다.");
        return;
    }

    var it_supply = $("select.it_supply").length;

    if($(".sit_spl_list").length < it_supply){
        alert("주문 옵션을 선택해 주시기 바랍니다.");
        return;
    }

    // 1. 앞 뒤 공백 제거
    var trimElement = $.trim($(element).text());

    // 2. 특정 문자열로 짜르고 배열로 담기
    var arrElement = trimElement.split("●");
    var copyElements = "";
    for (let i = 1; i < arrElement.length; i++) {
        copyElements += "● " + $.trim(arrElement[i]) + "\n";
    }

    // copy logic
    var $temp = $("<textarea>");
    $("body").append($temp);
    $temp.val(copyElements).select();
    document.execCommand("copy");
    $temp.remove();

    $(".alert_box").fadeIn(300).delay(1600).fadeOut(400);
}
