function page_back(){
    history.go(-1)();
}
/* ——————————————————————————
 * form group interactions
/* —————————————————————————— */
$(function()
{
    // selectric
    $('.selectric_js select').selectric();
    $('.slt_sort select').selectric();
    $('.slt_path select').selectric({
        nativeOnMobile: false,
    });


    // checkbox
    $('.checks label').on('click' ,function()
    {
        var checkboxId = $(this).attr('for');

        if($('#' + checkboxId).is(':checked') == false)
        {
            $(this).parents('.checks').addClass('on');
        }
        else if($('#' + checkboxId).is(':checked') == true)
        {
            $(this).parents('.checks').removeClass('on');
        }
    });

    // input text
    $('[class*="inputType_"] input').focusin(function(){
        if ($(this).attr('readonly') == 'readonly') {
            $(this).parents('[class*="inputType_"]').removeClass('focus');
        } else {
            $(this).parents('[class*="inputType_"]').addClass('focus');
        }
    });
    $('[class*="inputType_"] input').focusout(function(){
        $(this).parents('[class*="inputType_"]').removeClass('focus');
    });

    $('[class*="inputType_"] input').on('keyup',function(){
        if($(this).val().length > 0) {
            $(this).parents('[class*="inputType_"]').addClass('not_empty');
        } else {
            $(this).parents('[class*="inputType_"]').removeClass('not_empty');
        }
    });

    $("input.phoneFormat").keyup(function () {
        $('input.phoneFormat').inputmask({
            mask: '9{3,4}-9{4}',
            placeholder: '',
            showMaskOnHover: false,
            showMaskOnFocus: false,
        });
    });

    // textarea text
    $('[class*="textareaType_"] textarea').focusin(function(){
        $(this).parents('[class*="textareaType_"]').addClass('focus');
    });
    $('[class*="textareaType_"] textarea').focusout(function(){
        $(this).parents('[class*="textareaType_"]').removeClass('focus');
    });

    //글자수 카운트
    $('.wdCount').keyup(function (e){
        var content = $(this).val();
        $('.wdCounter em').html(""+content.length+"");

        if (content.length > 5000){
            alert("최대 5,000자까지 입력 가능합니다.");
            $(this).val(content.substring(0, 5000));
            $('.wdCounter em').html("5,000");
        }
    });
});

/* ——————————————————————————
 * 스크롤 컨트롤
/* —————————————————————————— */
$(function(){

    //상단으로 스크롤
    $('.toTop').click(function(){
        $( 'html, body' ).animate({"scrollTop": "0"},500);
    });

    $(window).scroll(function() {
        var _scrTop = $(window).scrollTop();
        var _scrHeight = $(window).height();
        var _footHeight = $('#footer').height();

        if (_scrTop >= 1) {
            $("body").addClass("scrolled");
        } else {
            $("body").removeClass("scrolled");
        } if (_scrTop >= $(document).height() - $(window).height() - _footHeight) {
            $("body").addClass("lastScroll");
        } else {
            $("body").removeClass("lastScroll");
        }
    });


    var lastScrollTop = 0, delta = 28;

    $(window).scroll(function(e){
        var st = $(this).scrollTop();

        if(Math.abs(lastScrollTop - st) <= delta)
        return;

        if ((st > lastScrollTop) && (lastScrollTop>0)) {
            // scroll down
            $("body").addClass("down").removeClass('up');
        } else {
            // scroll up
            $("body").addClass("up").removeClass('down');
        }
        lastScrollTop = st;
    });
});


/* ——————————————————————————
 * monglayer
/* —————————————————————————— */
$(function($) {

    // Data NameSpace
    var dataNameSpace = function(obj) {

        // Data Target
        var dataTarget = $(obj).attr("data-target") ? $(obj).attr("data-target") : "";

        // Default Selector
        var mongLayerBtn      = $('.mongLayer_open');
        var mongLayerCloseBtn = $('.mongLayer_close, .layerOverlay');

        // Reset Selector
        var mongLayer         = $(dataTarget + ' .mongLayer');
        var mongLayerCont     = $(dataTarget + ' .mongLayer_cont');
        var layerOverlay      = $(dataTarget + ' .layerOverlay');
        var layer_H           = $(dataTarget + ' .mongLayer').outerHeight();
        var head_H            = $(dataTarget + ' .mongLayer_head').outerHeight();
        var foot_H            = $(dataTarget + ' .mongLayer_foot').outerHeight();

        // Request to Return
        return {
            "dataTarget"          : dataTarget
            , "mongLayer"         : mongLayer
            , "mongLayerBtn"      : mongLayerBtn
            , "mongLayerCloseBtn" : mongLayerCloseBtn
            , "mongLayerCont"     : mongLayerCont
            , "layerOverlay"      : layerOverlay
            , "layer_H"           : layer_H
            , "head_H"            : head_H
            , "foot_H"            : foot_H
        }
    }
    var dataNames = dataNameSpace(this);

    //
    dataNames.mongLayerCloseBtn.click(function(){

        // Name Space Reset
        var dataNames = dataNameSpace(this);

        TweenLite.to(dataNames.layerOverlay, .6, {autoAlpha: 0, onComplete: function() {dataNames.layerOverlay.css('display', 'none');}});
        TweenLite.to(dataNames.mongLayer, .5, {
            bottom: '-100%',
            ease: Power3.easeInOut,
            onComplete: function() {
                dataNames.mongLayer.removeClass('open');

                $('html, body').css({'overflow' : ''});
                $('#wrap').off('scroll touchmove mousewheel');
            }
        });
    });

    //
    dataNames.mongLayerBtn.click(function(e){
        e.preventDefault();

        // Name Space Reset
        var dataNames = dataNameSpace(this);

        var dataTarget_select  = $(this).attr("data-target") ? $(this).attr("data-target") : "";
        var dataType     = $(this).attr("data-type")      ? $(this).attr("data-type")      : "";
        var dataValue    = $(this).attr("data-value")     ? $(this).attr("data-value")     : "";
        var dataValueKey = $(this).attr("data-value-key") ? $(this).attr("data-value-key") : "";
        var dataName     = $(this).attr("data-name")      ? $(this).attr("data-name")      : "";
        var valhtml      = "";
        const subMessage1 = dataValue.substring(13, 14);

        if(dataType == "event") {

            var dataContent  = dataValue    ? eval(dataValue) : "";
            var dataContent  = dataValueKey ? goodsData[dataValueKey]['ev_text'] : dataContent;

            $(".mongLayer_cont .inner .scrollwrap").html(dataContent);
        }
        else if(dataType == "plan-multi") {
            let cardArr = dataValue.split(',');
            $(dataNames.dataTarget + " .mongLayer_head .ff_NSR").html("제휴카드");
            $(dataNames.dataTarget + " .mongLayer_cont .scrollwrap>.tbl_CardInfo").empty();

            for (var i = 0; i < cardArr.length; i++) {
                $(dataNames.dataTarget + " .mongLayer_cont .scrollwrap>.tbl_CardInfo").append(allianceData[cardArr[i]].al_content);
            }
        }
        else if(dataType !== "image" && dataName && dataValue && dataTarget_select != "#ly_card_m" ) {
            $(dataNames.dataTarget + " .mongLayer_cont .scrollwrap>.tbl_CardInfo").html(eval(dataValue));
            $(dataNames.dataTarget + " .mongLayer_cont .scrollwrap").removeClass('pd0')
            $(dataNames.dataTarget + " .mongLayer_head .ff_NSR").html(dataName + " 제휴카드");
        }
        else if(dataType !== "image" && dataName && dataValue && dataTarget_select == "#ly_card_m" ) {
            for (var i = subMessage1; i > 1; i--) {
                $(dataNames.dataTarget + " .mongLayer_cont .scrollwrap>.tbl_CardInfo").append(allianceData[i]['al_content']);
            }

            $(dataNames.dataTarget + " .mongLayer_cont .scrollwrap").removeClass('pd0')
            $(dataNames.dataTarget + " .mongLayer_head .ff_NSR").html(" 제휴카드 할인 안내");
        }

        else if(dataType === "image") {
            $(dataNames.dataTarget + " .mongLayer_head .ff_NSR").html(dataName);
            $(dataNames.dataTarget + " .mongLayer_cont .scrollwrap").addClass('pd0')
            $(dataNames.dataTarget + " .mongLayer_cont .scrollwrap>.tbl_CardInfo").html($('<img>',{
                style:"width:100%;",
                src:dataValue,
            }));
        }

        TweenLite.to(dataNames.layerOverlay, .6, {autoAlpha: 1, onStart: function() {dataNames.layerOverlay.css('display', 'block');}});
        TweenLite.fromTo(dataNames.mongLayer, .6, {bottom: '-100%'}, {
            bottom: '0',
            ease: Power3.easeInOut,
            onStart: function() {
                dataNames.mongLayer.addClass('open');

                dataNames.mongLayerCont.css({'padding-top' : dataNames.head_H, 'padding-bottom' : dataNames.foot_H});

                $('html, body').css({'overflow' : 'hidden'});
                $('#wrap').on('scroll', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });

                if (dataNames.dataTarget == '#ly_search') {
                    $('.search_bar #keyword').focus();
                }
            }
        });
    });
});



function mongLayer_rebind() {

    // Data NameSpace
    var dataNameSpace = function(obj) {

        // Data Target
        var dataTarget = $(obj).attr("data-target") ? $(obj).attr("data-target") : "";

        // Default Selector
        var mongLayerBtn      = $('.mongLayer_open');
        var mongLayerCloseBtn = $('.mongLayer_close, .layerOverlay');

        // Reset Selector
        var mongLayer         = $(dataTarget + ' .mongLayer');
        var mongLayerCont     = $(dataTarget + ' .mongLayer_cont');
        var layerOverlay      = $(dataTarget + ' .layerOverlay');
        var layer_H           = $(dataTarget + ' .mongLayer').outerHeight();
        var head_H            = $(dataTarget + ' .mongLayer_head').outerHeight();
        var foot_H            = $(dataTarget + ' .mongLayer_foot').outerHeight();

        // Request to Return
        return {
            "dataTarget"          : dataTarget
            , "mongLayer"         : mongLayer
            , "mongLayerBtn"      : mongLayerBtn
            , "mongLayerCloseBtn" : mongLayerCloseBtn
            , "mongLayerCont"     : mongLayerCont
            , "layerOverlay"      : layerOverlay
            , "layer_H"           : layer_H
            , "head_H"            : head_H
            , "foot_H"            : foot_H
        }
    }
    var dataNames = dataNameSpace(this);

    //
    dataNames.mongLayerCloseBtn.click(function(){

        // Name Space Reset
        var dataNames = dataNameSpace(this);

        TweenLite.to(dataNames.layerOverlay, .6, {autoAlpha: 0, onComplete: function() {dataNames.layerOverlay.css('display', 'none');}});
        TweenLite.to(dataNames.mongLayer, .5, {
            bottom: '-100%',
            ease: Power3.easeInOut,
            onComplete: function() {
                dataNames.mongLayer.removeClass('open');

                $('html, body').css({'overflow' : ''});
                $('#wrap').off('scroll touchmove mousewheel');
            }
        });
    });

    //
    dataNames.mongLayerBtn.click(function(e){
        e.preventDefault();

        // Name Space Reset
        var dataNames = dataNameSpace(this);

        TweenLite.to(dataNames.layerOverlay, .6, {autoAlpha: 1, onStart: function() {dataNames.layerOverlay.css('display', 'block');}});
        TweenLite.fromTo(dataNames.mongLayer, .6, {bottom: '-100%'}, {
            bottom: '0',
            ease: Power3.easeInOut,
            onStart: function() {
                dataNames.mongLayer.addClass('open');

                dataNames.mongLayerCont.css({'padding-top' : dataNames.head_H, 'padding-bottom' : dataNames.foot_H});

                $('html, body').css({'overflow' : 'hidden'});
                $('#wrap').on('scroll touchmove mousewheel', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });

                if (dataNames.dataTarget == '#ly_search') {
                    $('.search_bar #keyword').focus();
                }
            }
        });
    });
}




/* ——————————————————————————
 * mongPopup
/* —————————————————————————— */
$(function($) {

    // Data NameSpace
    var dataNameSpace = function(obj) {

        // Data Target
        var dataTarget = $(obj).attr("data-target") ? $(obj).attr("data-target") : "";

        // Default Selector
        var mongPopupBtn      = $('.mongPopup_open');
        var mongPopupCloseBtn = $('.mongPopup_close, .layerOverlay');

        // Reset Selector
        var mongPopup         = $(dataTarget + ' .mongPopup');
        var mongPopupCont     = $(dataTarget + ' .mongPopup_cont');
        var layerOverlay      = $(dataTarget + ' .layerOverlay');

        // Request to Return
        return {
            "dataTarget"          : dataTarget
            , "mongPopup"         : mongPopup
            , "mongPopupBtn"      : mongPopupBtn
            , "mongPopupCloseBtn" : mongPopupCloseBtn
            , "mongPopupCont"     : mongPopupCont
            , "layerOverlay"      : layerOverlay
        }
    }
    var dataNames = dataNameSpace(this);

    //
    dataNames.mongPopupCloseBtn.click(function(){

        // Name Space Reset
        var dataNames = dataNameSpace(this);

        TweenLite.to(dataNames.layerOverlay, .2, {
            autoAlpha: 0,
            onComplete: function() {
                dataNames.layerOverlay.css('display', 'none');
            }
        });

        TweenLite.to(dataNames.mongPopup, .25, {
            opacity: 0,
            scale: 0.7,
            x: '-50%', y: '-50%',
            ease: Power3.easeInOut,
            onComplete: function() {
                dataNames.mongPopup.removeClass('open');

                $('html').css({'overflow' : ''});
                $('#wrap').off('scroll touchmove mousewheel');

                dataNames.mongPopup.parent('.mongPopup_wrap').css({'display' : 'none'});
            }
        });
    });

    //
    dataNames.mongPopupBtn.click(function(e){
        e.preventDefault();

        // Name Space Reset
        var dataNames = dataNameSpace(this);

        var dataType  = $(this).attr("data-type")  ? $(this).attr("data-type")  : "";
        var dataValue = $(this).attr("data-value") ? $(this).attr("data-value") : "";
        var dataValueKey = $(this).attr("data-value-key") ? $(this).attr("data-value-key") : "";
        var valhtml = "";

        if(dataValue == "" && dataValueKey == "") return false;

        if(dataType == "event") {

            var dataContent  = dataValue    ? eval(dataValue) : "";
            var dataContent  = dataValueKey ? goodsData[dataValueKey]['ev_text'] : dataContent;

            $(".mongPopup_head").html($(this).parents(".tit").find(".ff_NSR").html() + " 사은품");
            $(".mongPopup_cont").html(dataContent);
        }
        else if(dataValue) {

            $.each(JSON.parse(dataValue), function(idx, val) {
                valhtml += "<dl><dt>" + idx + "</dt><dd>" + val + "</dd></dl>";
            });

            $(".mongPopup_head").html($(this).parents(".tit").find(".ff_NSR").html() + " 가입조건");
            $(".mongPopup_cont").html("<div class=\"condition_tbl\">" + valhtml + "</div>");
        }

        TweenLite.to(dataNames.layerOverlay, .2, {
            autoAlpha: 1,
            onStart: function() {
                dataNames.layerOverlay.css('display', 'block');
            }
        });

        TweenLite.fromTo(dataNames.mongPopup, .3, {
            opacity: 0,
            scale: 0.7,
            x: '-50%', y: '-50%'
            },
            {
            opacity: 1,
            scale: 1,
            x: '-50%', y: '-50%',
            ease: Power3.easeInOut,
            onStart: function() {
                dataNames.mongPopup.parent('.mongPopup_wrap').css({'display' : 'block'});
                dataNames.mongPopup.addClass('open');

                $('html').css({'overflow' : 'hidden'});
                $('#wrap').on('scroll touchmove mousewheel', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
            }
        });
    });
});


/* ——————————————————————————
 * accordion
/* —————————————————————————— */
jQuery(function($) {

    $('.accd_lst > .tit > a').click(function() {

        var onAccdItem = $(this).parents('.tit').parents('.accd_lst').children('ul');

        if(!onAccdItem.hasClass('active')) {
            onAccdItem.addClass('active');
            onAccdItem.slideDown(300, function() {

                var element = $(this).closest(".swiper-slide");
                $(this).closest(".swiper-wrapper").css("height", element.height());

                //footer 사업자정보 스크롤
                if(onAccdItem.parents('.accd_lst').hasClass('ft_accd')) {
                    scrOffset = $(this).offset();
                    $('body,html').animate({ scrollTop: scrOffset.top - 0 }, 600);
                }

                //스마트필터 스크롤
                if(onAccdItem.parents('.accd_lst').hasClass('filter_accd')) {
                    scrOffset = $(this).parents('li.item').offset();
                    $('#ly_filter .mongLayer_cont .scrollwrap').animate({ scrollTop: scrOffset.top - 100 }, 800);
                }

                //가격비교박스 스크롤
                if(onAccdItem.parents('.accd_lst').hasClass('compare_accd')){
                    scrOffset = $(this).parents('li.item').offset();
                    $('body,html').animate({ scrollTop: scrOffset.top - 150 }, 600);
                }
            });
        }
        else {
            onAccdItem.removeClass('active');
            onAccdItem.slideUp(300, function() {

                var element = $(this).closest(".swiper-slide");
                $(this).closest(".swiper-wrapper").css("height", element.height());
            });
        }

        $(this).text($(this).text() == '접기' ? '펴기' : '접기');
        return false;
    });
});
