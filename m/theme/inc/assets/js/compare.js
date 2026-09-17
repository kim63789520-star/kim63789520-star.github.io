$(function () {

/* ——————————————————————————
 * swiper
/* —————————————————————————— */
    //상품 이미지
    var swiper = new Swiper('.prodView_photo.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 0,
        centeredSlides: true,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.plst-swiper-pagination',
        }
    });

    // 추천상품
    let swiperRecomm = new Swiper('.prd_recomm .prod_list_simple', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        freeMode: true,
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });

    // resize height
    $(window).on('load', function () {
        var element = $(".compare_cont_wrap .swiper-slide-active");
        $(element).closest(".swiper-wrapper").css("height", element.height());
        $(element).find(".compare_cont_tit>h3.ff_NSR").trigger("click");
    });
});


/* ——————————————————————————
 * monglayer
/* —————————————————————————— */
$(function ($) {
    // Data NameSpace
    var dataNameSpace = function (obj) {

        // Data Target
        var dataTarget = $(obj).attr("data-target") ? $(obj).attr("data-target") : "";

        // Default Selector
        var mongLayerBtn = $('.mongLayer_open');
        var mongLayerCloseBtn = $('.mongLayer_close, .layerOverlay');

        // Reset Selector
        var mongLayer = $(dataTarget + ' .mongLayer');
        var mongLayerCont = $(dataTarget + ' .mongLayer_cont');
        var layerOverlay = $(dataTarget + ' .layerOverlay');
        var layer_H = $(dataTarget + ' .mongLayer').outerHeight();
        var head_H = $(dataTarget + ' .mongLayer_head').outerHeight();
        var foot_H = $(dataTarget + ' .mongLayer_foot').outerHeight();

        // Request to Return
        return {
            "dataTarget": dataTarget
            , "mongLayer": mongLayer
            , "mongLayerBtn": mongLayerBtn
            , "mongLayerCloseBtn": mongLayerCloseBtn
            , "mongLayerCont": mongLayerCont
            , "layerOverlay": layerOverlay
            , "layer_H": layer_H
            , "head_H": head_H
            , "foot_H": foot_H
        }
    }
    var dataNames = dataNameSpace(this);

    dataNames.mongLayerCloseBtn.click(function () {

        // Name Space Reset
        var dataNames = dataNameSpace(this);

        TweenLite.to(dataNames.layerOverlay, .4, {
            autoAlpha: 0, onComplete: function () {
                dataNames.layerOverlay.css('display', 'none');
            }
        });
        TweenLite.to(dataNames.mongLayer, .3, {
            bottom: '-100%',
            ease: Power3.easeInOut,
            onComplete: function () {
                dataNames.mongLayer.removeClass('open');

                $('body').css({'overflow': ''});
                $('#wrap').off('scroll touchmove');
            }
        });
    });

    dataNames.mongLayerBtn.click(function (e) {
        e.preventDefault();

        // Name Space Reset
        var dataNames = dataNameSpace(this);

        var dataType = $(this).attr("data-type") ? $(this).attr("data-type") : "";
        var dataValue = $(this).attr("data-value") ? $(this).attr("data-value") : "";
        var dataValueKey = $(this).attr("data-value-key") ? $(this).attr("data-value-key") : "";
        var dataName = $(this).attr("data-name") ? $(this).attr("data-name") : "";
        var valhtml = "";

        if (dataType == "event") {

            var dataContent = dataValue ? eval(dataValue) : "";
            var dataContent = dataValueKey ? goodsData[dataValueKey]['ev_text'] : dataContent;

            $(".mongLayer_cont .inner .scrollwrap").html(dataContent);
        }
        else if (dataName && dataValue) {
            if (eval(dataValue)) {
                var dataSellerCode = $(this).attr("data-seller") ? $(this).attr("data-seller") : "";
                var dataContent = eval(dataValue) ? eval(dataValue) : "";
                if (dataContent) {
                    if (dataSellerCode) {
                        dataContent = '<div style="display:none;text-align:right"><a href="/model/card.php?filter_seller='+dataSellerCode+'" target="_blank">제휴카드 페이지 바로가기</a></div>'
                            + dataContent;
                    }
                    $(".card_sale_pop_wrap > .tbl_CardInfo").html(dataContent);
                    $(dataNames.dataTarget + " .mongLayer_head .ff_NSR").html(dataName + " 제휴카드");
                }
            }
        } else {

            //return false;
        }

        TweenLite.to(dataNames.layerOverlay, .5, {
            autoAlpha: 1, onStart: function () {
                dataNames.layerOverlay.css('display', 'block');
            }
        });
        TweenLite.fromTo(dataNames.mongLayer, .5, {bottom: '-100%'}, {
            bottom: '0',
            ease: Power3.easeInOut,
            onStart: function () {
                dataNames.mongLayer.addClass('open');

                dataNames.mongLayerCont.css({'padding-top': dataNames.head_H, 'padding-bottom': dataNames.foot_H});

                if (dataNames.dataTarget == '#ly_search') {
                    $('.search_bar #keyword').focus();
                }
            }
        });
    });

});



/* ——————————————————————————
 * order
/* —————————————————————————— */

function fsubmit_check(f) {
    // 판매가격이 0 보다 작다면
    if (document.getElementById("it_price").value < 0) {
        alert("전화로 문의해 주시면 감사하겠습니다.");
        return false;
    }

    if ($(".sit_opt_list").size() < 1) {
        alert("주문옵션을 선택해주시기 바랍니다.");
        return false;
    }

    var val, io_type, result = true;
    var sum_qty = 0;
    var min_qty = parseInt('<?php echo $odr_min; ?>');
    var max_qty = parseInt('<?php echo $odr_max; ?>');
    var $el_type = $("input[name^=io_type]");

    $("input[name^=ct_qty]").each(function (index) {
        val = $(this).val();

        if (val.length < 1) {
            alert("수량을 입력해 주십시오.");
            result = false;
            return false;
        }

        if (val.replace(/[0-9]/g, "").length > 0) {
            alert("수량은 숫자로 입력해 주십시오.");
            result = false;
            return false;
        }

        if (parseInt(val.replace(/[^0-9]/g, "")) < 1) {
            alert("수량은 1이상 입력해 주십시오.");
            result = false;
            return false;
        }

        io_type = $el_type.eq(index).val();
        if (io_type == "0")
            sum_qty += parseInt(val);
    });

    if (!result) {
        return false;
    }

    if (min_qty > 0 && sum_qty < min_qty) {
        alert("주문옵션 개수 총합 " + number_format(String(min_qty)) + "개 이상 주문해 주세요.");
        return false;
    }

    if (max_qty > 0 && sum_qty > max_qty) {
        alert("주문옵션 개수 총합 " + number_format(String(max_qty)) + "개 이하로 주문해 주세요.");
        return false;
    }

    return true;
}

function fbuyform_submit(sw_direct) {
    var f = document.fbuyform;
    f.sw_direct.value = sw_direct;

    if (sw_direct == "cart") {
        f.sw_direct.value = 0;
    } else { // 바로구매
        f.sw_direct.value = 1;
    }


    var optId = [];
    var optValue = [];
    $("input[name^=gs_id], input[name^=optionSelector_], select[name^=optionSelector_]").each(function (idx, val) {


        if ($(this).is(":checked") == true) {

            optId.push($(this).val());
            optValue.push($(this).attr("data-value") + " : " + $(this).val());
        } else if ($(this).find("option").is(":selected") == true) {

            optId.push($(this).val());
            optValue.push($(this).attr("data-value") + " : " + $(this).val());
        } else {

            var opts = $("input:radio[name='option_" + $(this).val() + "']:checked");

            if (opts.val() !== undefined) {
                optId.push(opts.val());
                optValue.push(opts.attr("data-value") + " : " + opts.val());
            }
        }

    });

    $("input[name^=io_id]").val(optId.join(""));
    $("input[name^=io_value]").val(optValue.join(" / "));

    var val, io_type, result = true;
    var sum_qty = 0;
    var min_qty = parseInt('<?php echo $odr_min; ?>');
    var max_qty = parseInt('<?php echo $odr_max; ?>');
    var $el_type = $("input[name^=io_type]");

    $("input[name^=ct_qty]").each(function (index) {
        val = $(this).val();

        if (val.length < 1) {
            alert("수량을 입력해 주세요.");
            result = false;
            return;
        }

        if (val.replace(/[0-9]/g, "").length > 0) {
            alert("수량은 숫자로 입력해 주세요.");
            result = false;
            return;
        }

        if (parseInt(val.replace(/[^0-9]/g, "")) < 1) {
            alert("수량은 1이상 입력해 주세요.");
            result = false;
            return;
        }

        io_type = $el_type.eq(index).val();
        if (io_type == "0")
            sum_qty += parseInt(val);
    });

    if (!result) {
        return;
    }

    if (min_qty > 0 && sum_qty < min_qty) {
        alert("주문옵션 개수 총합 " + number_format(String(min_qty)) + "개 이상 주문해 주세요.");
        return;
    }

    if (max_qty > 0 && sum_qty > max_qty) {
        alert("주문옵션 개수 총합 " + number_format(String(max_qty)) + "개 이하로 주문해 주세요.");
        return;
    }

    f.action = "./cartupdate.php";
    f.submit();
}