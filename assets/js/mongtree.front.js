/*
 * ------------------------------------------------------------------------------------------------
 * Author        : tteongi
 * Creation Date : 2019-11-13
 * Description   : front
 * Location      : /assets/js/mongtree.front.js
 * ------------------------------------------------------------------------------------------------
 */
$(function () {

    // Wish
    $('.prod_heart, .btn_heart').click(function () {

        $(this).toggleClass('on');

        var section = $(this).attr("data-value");
        itemlistwish($(this).val(), section);
    });

    // Wish -> HEART EVENT : 모바일에만 적용
    $('.prod_heart.mobile, .btn_heart.mobile').click(function () {
        /*if ($(this).hasClass('on')){
            $(this).removeClass('on');
            $(this).find('i').removeClass('animated heartBeat');
            //$(this).find('i').removeClass('icon-heart-fill animated heartBeat').addClass('icon-heart');
            //alert('나의 하트 리스트에서 삭제되었습니다.');
        } else {
            $(this).addClass('on');
            $(this).find('i').addClass('animated heartBeat');
            //$(this).find('i').removeClass('icon-heart').addClass('icon-heart-fill animated heartBeat');
            //alert('나의 하트 리스트에 추가되었습니다.');
        }*/

        if ($(this).hasClass('on')) {
            $(this).find('i').addClass('animated heartBeat');
        } else {
            $(this).find('i').removeClass('animated heartBeat');
        }

    });
    $(".kind_info").click(function () {
        $(".card_kind_pop_wrap").fadeIn("fast");
        $(".bg_mask").fadeIn("fast");
        $("body").css("overflow-y", "hidden");
    });
    $(".card_kind_pop_wrap .icon-x").click(function () {
        $(".card_kind_pop_wrap").fadeOut("fast");
        $(".bg_mask").fadeOut("fast");
        $("body").css("overflow-y", "auto");
    });
    if ($('.hd_scroll_menu li.active').length) {
        $('.hd_scroll_menu').animate({scrollLeft: $('.hd_scroll_menu').find('.active').position().left - 50}, 0);
    }
});