$(document).ready(function(){

    /* slick */
    $(".visual_main").slick({
        autoplay: true,
        autoplaySpeed: 5000,
        dots:true
    });

    /* 상세페이지 슬라이드 */
    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        asNavFor: '.slider-nav'
    });

    $('.slider-nav').slick({
        slidesToShow: 5,
        slidesToScroll: 5,
        asNavFor: '.slider-for',
        focusOnSelect: true,
        draggable: false,
        infinite: false,
    });

    /* 제휴카드 탭 */
    $('.card_tabs ul li').on('click',function(){
        
        $('.card_tabs ul li').removeClass('act');
        $(this).addClass('act')
        
        var idx = $('.card_tabs > ul > li').index(this);
        
        $('.tab_box').hide();
        $('.tab_box').eq(idx).show();
    });

    $(".price_compare_detail .pr_comp_list .card_btn").click(function(){
        $(".card_sale_pop_wrap").fadeIn("fast");
        $(".bg_mask").fadeIn("fast");
        $("body").css("overflow-y","hidden");
    });

    $(".bg_mask").click(function(){
        $(".card_sale_pop_wrap").fadeOut("fast");
        $(".modal.lpOrder").fadeOut("fast");
        $(".bg_mask").fadeOut("fast");
        $("body").css("overflow-y","auto");
    });

    $(".close_btn").click(function(){
        $(".card_sale_pop_wrap").fadeOut("fast");
        $(".modal.lpOrder").fadeOut("fast");
        $(".bg_mask").fadeOut("fast");
        $("body").css("overflow-y","auto");
    });

    /* 빠른 렌탈신청 */
    $(".order_btn").click(function(){
        $("#order_step1").fadeIn("fast");
        $(".bg_mask").fadeIn("fast");
    });

    $(".radioType_1.org label").click(function(){
        $(".radioType_1.org label").removeClass("on");
        $(this).addClass("on");
    });

    /* 사은품 자세히보기 팝업 */
    $(".event_btn").click(function(){
        $(".event_pop_wrap").fadeIn("fast");
        $(".bg_mask").fadeIn("fast");
        $("body").css("overflow-y","hidden");
    });

    $(".bg_mask").click(function(){
        $(".event_pop_wrap").fadeOut("fast");
        $(".bg_mask").fadeOut("fast");
        $("body").css("overflow-y","auto");
    });

    $(".event_pop_wrap .tit .close_btn img").click(function(){
        $(".event_pop_wrap").fadeOut("fast");
        $(".bg_mask").fadeOut("fast");
        $("body").css("overflow-y","auto");
    });

    /* selectric */
    $(".selectric").click(function(){
        if( !$(".selectric").hasClass("act") ) {
            $(".selectric").removeClass("act");
            $(this).addClass("act");
        } else {
            if( $(this).hasClass("act") ) {
                $(".selectric").removeClass("act");
            }else {
                $(".selectric").removeClass("act");
                $(this).addClass("act");
            }
        }
    });

    $(".selectric-items li").click(function(){
        $(".selectric").removeClass("act");
    });

    $("body").click(function(){
        $(".selectric").removeClass("act");
    });

    /* 정렬 클릭 */
    $(".sort_wrap .sort_left ul li.sort_btn").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
    });

    /* 최근 검색어 */
    $(".btn_close").click(function(){
        $(".recent_box").hide();
        $(".dim").hide();
    });

    $(".dim").click(function(){
        $(this).hide();
        $(".recent_box").hide();
    });

    /* 헤더 높이만큼 콘텐츠 상단 여백 확보 (배너 유무·리사이즈 대응) */
    function setHeaderOffset() {

        var _hdHeight = $("#header").outerHeight();

        if($('body').hasClass('index')) {
            $('.visual_main').css("padding-top", _hdHeight + "px");
        }else {
            $("#container").css("padding-top", _hdHeight + "px");
        }
    }

    setHeaderOffset();

    /* 네비 고정: 배너 상태(있음/닫힘/없음)별로 헤더 슬라이드 + 콘텐츠 여백을 각각 조정 */
    $(window).scroll(function () {
        var _scrTop       = $(this).scrollTop();
        var $header       = $("#header");
        var $hdBanner     = $("#hd_banner");

        var _hdHeight     = $header.outerHeight();
        var _hdBanHeight  = $hdBanner.outerHeight() || 0;        // 미렌더/빈 셋이면 0 (NaN 방지)
        var _hdWrapHeight = $(".header_wrap").outerHeight();
        var _hdTopNav     = $(".header_wrap .top_nav").outerHeight() || 0;

        if (_scrTop < 1) {
            $header.css("top", "0");
            setHeaderOffset();
            return;
        }

        if ($hdBanner.length === 0) {
            // 배너 미렌더
            $header.css("top", "-" + _hdTopNav + "px");
            $('.visual_main').css("padding-top", _hdWrapHeight + "px");
        } else if ($hdBanner.is(":hidden")) {
            // 배너 닫힘
            $header.css("top", "-" + _hdTopNav + "px");
            $('.visual_main, body:not(.index) #container').css("padding-top", _hdHeight + "px");
        } else {
            // 배너 있음(보임)
            $header.css("top", "-" + (_hdBanHeight + _hdTopNav) + "px");
            $('.visual_main, body:not(.index) #container').css("padding-top", _hdWrapHeight + "px");
        }
    });

    /* 리사이즈 시 여백 재계산 */
    $(window).resize(setHeaderOffset);

    /* 상단 배너 닫을 때: slideUp 진행에 맞춰 매 프레임 여백 재계산 (지연/튐 없이) */
    $("#hd_close").on('click', function () {
        var _t0 = Date.now();
        var _iv = setInterval(function () {
            setHeaderOffset();
            if (Date.now() - _t0 > 300) { clearInterval(_iv); setHeaderOffset(); }
        }, 16);
    });

    /* 네비게이션 */
    $(".gnb_nav .nav > li").mouseover(function () {
        $(this).children("ul").stop().slideDown("fast");
        $(".gnb_nav .nav li ul.dept1:after").css("width", "198px");
    });

    $(".gnb_nav .nav > li").mouseleave(function () {
        $(this).children("ul").stop().hide();
        $(".gnb_nav .nav li ul.dept1:after").css("width", "0");
    });

    /* 탑으로 이동 */
    $(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.move_top').fadeIn('fast').addClass("act");
        } else {
            $('.move_top').fadeOut('fast').removeClass("act");
        }
    });

    $(".move_top").click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 400);
        return false;
    });    
});

    /* pager */

    $(".pager").click(function () {
        if (!$(this).hasClass("pager-active")) {
            $(this).addClass("pager-active").siblings().removeClass("pager-active");
        } else {
            $(this).addClass("pager-active").siblings().removeClass("pager-active");
        }
    });

    /* 하단 고정 렌탈상담 */
    $(".foot_fix_cs > .cs_btn").click(function(){
        if(!$(this).parents(".foot_fix_cs").hasClass("act")){
            $(this).parents(".foot_fix_cs").addClass("act");
            $("#footer_wrap").addClass("act");
        }else{
            $(this).parents(".foot_fix_cs").removeClass("act");
            $("#footer_wrap").removeClass("act");
        }
        
    });

    /* 전체선택 */
    function allCheckFunc( obj ) {
    $("[name=chk]").prop("checked", $(obj).prop("checked") );
}

/* 체크박스 체크시 전체선택 체크 여부 */
function oneCheckFunc( obj )
{
    var allObj = $("[name=all_chk]");
    var objName = $(obj).attr("name");

    if( $(obj).prop("checked") )
    {
    checkBoxLength = $("[name="+ objName +"]").length;
    checkedLength = $("[name="+ objName +"]:checked").length;

        if( checkBoxLength == checkedLength ) {
            allObj.prop("checked", true);
        } else {
            allObj.prop("checked", false);
        }
    }
    else
    {
        allObj.prop("checked", false);
    }
}

$(function(){
    $("[name=all_chk]").click(function(){
        allCheckFunc( this );
    });
    $("[name=chk]").each(function(){
        $(this).click(function(){
            oneCheckFunc( $(this) );
        });
    });
});

/* pc 네비게이션 햄버거메뉴 */
$("#header .hamIcon a").click(function () {
    if (!$(".ham_wrap").hasClass("active_ham")) {
        $(".ham_wrap").addClass("active_ham");
        $(".all_menu_wrap").fadeIn('fast');
    } else {
        $(".ham_wrap").removeClass("active_ham");
        $(".all_menu_wrap").fadeOut('fast');
    }
});

/* 개인정보 수집 내용보기 */
$(".foot_fix_cs .cs_cont .chk_wrap .agree_btn").hover(function(){
    $(".privacy_tit_pop").fadeIn("fast");
    }, function(){
        $(".privacy_tit_pop").fadeOut("fast");
});

/* 좌우 고정 레이어 */
$(".sticker").stick_in_parent({offset_top:150});

/**
 *  페이지 이름 가져오기
 *  @return pageName 현재 페이지 이름
 */
function getPageName(){
    var pageName = "";

    var tempPageName = window.location.href;
    var strPageName = tempPageName.split("/");
    pageName = strPageName[strPageName.length-1].split("?")[0];

    return pageName;
}

function returnOffset(){
    var pgName = getPageName();

    if (pgName == "index.php" || pgName == "") {
            $(".sticker").addClass("indexStiky");
    } else {
            $(".sticker").addClass("subStiky");
            $(".visual_main").hide();
    }
}

returnOffset();

});