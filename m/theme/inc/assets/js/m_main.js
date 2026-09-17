$(document).ready(function () {
    let hdHeight = $("#header").outerHeight();
    let scrHdHeight = $("#header .inner").outerHeight();
    let topAdHeight = hdHeight - $("#header .nav").outerHeight(); // 최상단 배너가 있을 경우
    let moNavHeight = $(".top_nav .nav_box").outerHeight();

    $(".mo_nav").css("margin-top", moNavHeight);
    $("#container").css("padding-top", hdHeight);

    $(window).on("scroll", function () {
        var _scrTop = $(window).scrollTop();

        if ($("#header div").hasClass("top_ad")) {
            // 최상단 배너가 있을 경우
            if (_scrTop >= 1) {
                $("#header").css("top", -topAdHeight);
                $("#container").css("padding-top", topAdHeight);
                $(".mo_nav").css("margin-top", scrHdHeight);
                $(".foot_fix_cs").addClass("fixed");
            } else {
                $("#header").css("top", 0);
                $("#container").css("padding-top", hdHeight);
                $(".mo_nav").css("margin-top", moNavHeight);
                $(".foot_fix_cs").removeClass("fixed");
            }
        } else {
            // 최상단 배너가 없을 경우
            if (_scrTop >= 1) {
                $("#header").css("top", -scrHdHeight);
                $(".mo_nav").css("margin-top", scrHdHeight);
                $(".foot_fix_cs").addClass("fixed");
            } else {
                $("#header").css("top", 0);
                $(".mo_nav").css("margin-top", moNavHeight);
                $(".foot_fix_cs").removeClass("fixed");
            }
        }
    });

    // 파트너신청 - 모달창 여닫기
    $(".partner_inquiry_wrap .btn_form").click(function () {
        $(".modal_wrap").show();
    });
    $(".partner_inquiry_wrap .btn_off").click(function () {
        $(".modal_wrap").hide();
    });
    $(".partner_inquiry_wrap .dim").click(function () {
        $(".modal_wrap").hide();
    });

    /* 뒤로가기 버튼 */
    $(".back_btn").click(function(){
        window.history.back();
    });

    /* 검색창 클릭시 레이어 */
    /* todo :: 각테마 동일 소스 삭제 */
    $(".searchButton").click(function(){
        $(".search_input_wrap").css("bottom","0");
        $("body").css("overflow-y","hidden");
    });

    $(".search_close").click(function (){
        $(".search_input_wrap").css("bottom","-100%");
        $("body").css("overflow-y","visible");
    });

    /* 빠른상담신청 클릭시 바텀시트 */
    /* todo :: 각테마 동일 소스 삭제 */
    $(".foot_nav .item_fast_cs").click(function(){
        $(".main_write_form").stop().slideDown();
        $("body").css("overflow-y","hidden");
        $(".bg_mask").fadeIn();
        $(".move_top").hide();
    });
});
