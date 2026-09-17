$(document).ready(function(){

    /* slick */
    $(".visual_main").slick({
        autoplay: true,
        autoplaySpeed: 5000,
        dots: true
    });

    /* 아이템리스트 슬라이드 */
    $(".item_slide_list").slick({
        slidesToShow:2.3,
        slidesToScroll:2.3,
        infinite:false
    });

    /* 뷰 페이지 슬라이드 */
    $(".item_img_big").slick({
        dots:true,
        infinite:false
    });

    /* 더보기 버튼 클릭시 */
    $(".more_btn").click(function(){
        if( !$(this).hasClass("active") ) {
            $(".prd_info").css("height","100%");
            $(".more_btn button").html("접기");
            $(this).addClass("active");
        }else {
            $(".prd_info").css("height","208px");
            $(".more_btn button").html("더보기");
            $(this).removeClass("active");
        }

    });

    /* 상세페이지 슬라이드 */
    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        asNavFor: '.slider-nav'
    });

    $('.slider-nav').slick({
        slidesToShow: 3,
        slidesToScroll: 3,
        asNavFor: '.slider-for',
        centerMode: true,
        focusOnSelect: true,
        draggable: false,
        infinite: false,
    });

    /* 기획전 탭 */
    $(".plan_tabs_wrap .plan_tabs li a").click(function(){
        $(".plan_tabs_wrap .plan_tabs li a").removeClass("act");
        $(this).addClass("act");
    });

    /* 제휴카드 탭 */
    $(".card_tabs ul li").click(function(){
        $(".card_tabs ul li").removeClass("act");
        $(this).addClass("act");
    });

    /* 모바일 네비게이션 햄버거메뉴 */
    $(".mo_hamIcon").click(function () {
        if (!$(this).parents(".ham_wrap").hasClass("active_ham")) {
            $(this).parents(".ham_wrap").addClass("active_ham");
            $(".mo_nav").css("transform","translateX(100%)");
            $("body").css("overflow-y","hidden");
        } else {
            $(this).parents(".ham_wrap").removeClass("active_ham");
            $(".mo_nav").css("transform","translateX(0)");
            $("body").css("overflow-y","visible");
        }
    });

    $(".ham_icon").click(function () {
        if (!$(".ham_wrap").hasClass("active_ham")) {
            $(".ham_wrap").addClass("active_ham");
            $(".mo_nav").css("transform","translateX(100%)");
            $("body").css("overflow-y","hidden");

        } else {
            $(".ham_wrap").removeClass("active_ham");
            $(".mo_nav").css("transform","translateX(0)");
            $("body").css("overflow-y","visible");
        }
    });


    $(".all_menus .dept1 li").click(function() {
        $(this).addClass("active").siblings().removeClass("active");
        var dataValue = $(this).attr("data-value");
        $(".dept2").hide();
        $(dataValue).show();
    });

    /* 팝업 닫기 */
    $(".close_btn").click(function(){
        $(".main_write_form").slideUp();
        $(".top_fix_cs").removeClass("active");
        $(".dim").fadeOut();
        $(".move_top").show();
        $(".mo_nav").css("transform","translateX(0)");
        $(".ham_wrap").removeClass("active_ham");
        $(".ch_opt_pop").fadeOut();
        $(".card_sale_pop_wrap").fadeOut("fast");
        $(".bg_mask").fadeOut("fast");
        $("body").css("overflow-y","auto");
    });

    /* 장바구니 옵션 변경 버튼 */
    $(".opt_change_btn").click(function(){
        $(".ch_opt_pop").fadeIn();
        $(".dim").fadeIn();
    });

    $(".opt_ok_btn").click(function(){
        $(".ch_opt_pop").fadeOut();
    });

    /* 보기 타입 버튼 */
    $(".prd_list_btn").click(function(){
        if($(".prd_list_btn span").hasClass("icon-grid")){
            $(".prd_list_btn span").addClass("icon-list").removeClass("icon-grid");
            $(".list_type1").hide();
            $(".list_type2").show();
        }else{
            $(".prd_list_btn span").addClass("icon-grid").removeClass("icon-list");
            $(".list_type1").show();
            $(".list_type2").hide();
        }
    });

    /* 개인정보 수집 이용동의 팝업 */
    $(".chk_wrap .checks .arrow_btn").click(function(){
        if(!$(".chk_wrap .checks .arrow_btn").hasClass("active")){
            $(this).addClass("active");
            $(".policy_pop").stop().slideDown();
        }else{
            $(this).removeClass("active");
            $(".policy_pop").stop().slideUp();
        }
    });

    /* 이지렌탈 사업자정보 */
    $(".detail_btn").click(function(){
        if(!$(this).hasClass("active")){
            $(".easyR_info").stop().slideDown();
            $(".foot_conts p span").addClass("active");
            $(this).addClass("active");
        }else{
            $(".easyR_info").stop().slideUp();
            $(this).removeClass("active");
            $(".foot_conts p span").removeClass("active");
        }
    });

    /* 빠른상담신청 클릭시 팝업 */
    $(".cs_cont .btns a").click(function(){
        $(".main_write_form").stop().slideDown();
        $("body").css("overflow-y","hidden");
        $(".bg_mask").fadeIn();
        $(".move_top").hide();
    });

    /* 상세페이지 탭메뉴 */
    $(".item_detail_tabs li").click(function(){
        var activeTab = $(this).attr('data-tab');
        $("ul.tabs li").removeClass("act");
        $(".detail_box").removeClass("act");
        $(this).addClass("act");
        $("."+activeTab).addClass("act");
    });

    /* pager */
    $(".pager").click(function () {
        if (!$(this).hasClass("pager-active")) {
            $(this).addClass("pager-active").siblings().removeClass("pager-active");
        } else {
            $(this).addClass("pager-active").siblings().removeClass("pager-active");
        }
    });

    /* 렌탈사 탭 스크롤 */
    if($("body").hasClass(".compare_tabs")) {
        var com_tabs = $(".compare_tabs").offset();
        $(window).scroll(function(){
            if($(document).scrollTop() > com_tabs.top) {
                $(".compare_tabs").addClass("fixed");
            }else {
                $(".compare_tabs").removeClass("fixed");
            }
        });
    }

    /* 제휴카드 설명 팝업 */
    $(".info_bar").click(function(){
        $(".card_sale_pop_wrap").fadeIn("fast");
        $(".bg_mask").fadeIn("fast");
        $("body").css("overflow-y","hidden");
    });

    $(".bg_mask, .mongLayer_close").click(function(){
        $(".card_sale_pop_wrap").fadeOut("fast");
        $(".bg_mask").fadeOut("fast");
        $("body").css("overflow-y","auto");
        $(".main_write_form").fadeOut("fast");
    });

    /* 찜하기, 소셜버튼 */
    $(".social_btn_wrap .social_btns ul li").click(function(){
        if(!$(this).hasClass("act")){
            $(this).addClass("act");
        }else{
            $(this).removeClass("act");
        }
    });

    $(".social_icon").click(function(){
        if(!$(".social_pop").hasClass("act")){
            $(".social_pop").addClass("act");
        }else{
            $(".social_pop").removeClass("act");
        }
    });

    /* 뒤로가기 버튼 */
    $(".back_btn a").click(function(){
        window.history.back();
    });

    /* selectric */
    $(".selectric").click(function(){
        if( !$(".selectric").hasClass("act") ) {
            $(".selectric").removeClass("act");

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
    $("#search_form").click(function(e){
        e.stopPropagation();
        $(".recent_box").show();
        $(".dim").show();
    });

    $(".btn_close").click(function(){
        $(".recent_box").hide();
        $(".dim").hide();
    });

    $(".bg_mask").click(function(){
        $(this).hide();
        $(".recent_box").hide();
        $(".main_write_form").stop().slideUp();
        $("body").css("overflow-y","auto");
        $(".move_top").show();
        $(".ch_opt_pop").fadeOut();
    });

    /* 기획전 탭 고정 */
    $(function () {
        var planTabsWrap = $(".plan_tabs_wrap").scrollTop() - 90;

        $(window).scroll(function(){
            if($(document).scrollTop() > planTabsWrap) {
                $(".plan_tabs_wrap").addClass("fixed");
            }else {
                $(".plan_tabs_wrap").removeClass("fixed");
            }
        });
    });

    /* 탑으로 이동 */
    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 300) {
                $('.quick_menu').fadeIn('fast').addClass("act");
            } else {
                $('.quick_menu').fadeOut('fast').removeClass("act");
            }
        });

        $(".move_top").click(function () {
            $('html, body').animate({
                scrollTop: 0
            }, 400);
            return false;
        });
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
    /* 전체메뉴 */

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

    /* 검색창 클릭시 팝업 */
    $(".searchButton").click(function(){
            $(".search_input_wrap").css("bottom","0");
            $("body").css("overflow-y","hidden");
    });

    $(".search_close").click(function (){
        $(".search_input_wrap").css("bottom","-100%");
        $("body").css("overflow-y","visible");
    });

});


