$(document).ready(function () {
    const $navBtn = $(".img_nav > .price > ul > li");
    const $form = $("form[name=b2bReqeustForm]");
    const $tabNav = $(".img_nav");
    const $tpsBtn = $(".tps_inquiry_btn");

    $("#b2b_phone").on("keyup", function () {
        $(this).val(
            $(this)
                .val()
                .replace(/[^0-9]/g, "")
                .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, "$1-$2-$3")
                .replace("--", "-"),
        );
    });

    //상단으로 스크롤
    $(".goTop").click(function () {
        $("html, body").animate({ scrollTop: "0" }, 600);
    });

    $(window).scroll(function () {
        let height = $(window).scrollTop();
        let gnbNavHeight = $(".gnb_nav").outerHeight();
        let navHeight = $tabNav.outerHeight();
        let offsetHeight = gnbNavHeight + navHeight;
        let lgNav = $("#lg").offset().top - offsetHeight - 1;
        let ktNav = $("#kt").offset().top - offsetHeight - 1;
        let skNav = $("#sk").offset().top - offsetHeight - 1;
        let bizHeight = $(".tps_inquiry").offset().top - offsetHeight - 1;

        if (height >= $(".tps_contents_top").height() + gnbNavHeight) {
            $tabNav.addClass("scrolled").css({ top: gnbNavHeight });
            // $(".tps_inquiry_btn").addClass("scrolled");
            $(".img_cont").css({ "padding-top": navHeight });
        } else {
            $tabNav.removeClass("scrolled").css({ top: 0 });
            // $(".tps_inquiry_btn").removeClass("scrolled");
            $(".img_cont").css({ "padding-top": 0 });
        }

        if (height >= ktNav) {
            $(".img_nav > .price > ul > li").removeClass("active");
            $(".img_nav > .price > ul > li:nth-child(1)").addClass("active");
            if (height >= lgNav) {
                $(".img_nav > .price > ul > li").removeClass("active");
                $(".img_nav > .price > ul > li:nth-child(2)").addClass("active");
                if (height >= skNav) {
                    $(".img_nav > .price > ul > li").removeClass("active");
                    $(".img_nav > .price > ul > li:nth-child(3)").addClass("active");
                }
            }
        }

        // if (height >= bizHeight) {
        //     $tabNav.css("display", "none");
        //     $(".tps_inquiry_btn .btn_biz").css("display", "none");
        // } else {
        //     $tabNav.css("display", "block");
        //     $(".tps_inquiry_btn .btn_biz").css("display", "block");
        // }
    });

    $tpsBtn.find("a").on("click", function (e) {
        let gnbNavHeight = $(".gnb_nav").outerHeight();
        $("#tps_inquiry").css({ "padding-top": gnbNavHeight });
    });

    $navBtn.find("a").on("click", function (e) {
        e.preventDefault();
        let gnbNavHeight = $(".gnb_nav").outerHeight();
        let navHeight = $tabNav.outerHeight();
        let offsetHeight = gnbNavHeight + navHeight;
        var target = this.hash;
        var $target = $(target);

        $("html, body")
            .stop()
            .animate(
                {
                    scrollTop: $target.offset().top - offsetHeight,
                },
                500,
                "swing",
            );
        return false;
    });

    $form.submit(function (e) {
        e.preventDefault();
        const btnSubmit = $(this).find("button");
        const txtSubmit = btnSubmit.text();

        btnSubmit.find("span").text("상담신청 중...");
        btnSubmit.css({ background: "#a5a5a5" });
        btnSubmit.prop("disabled", true);

        fetch("./process.php", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                site: window.location.href,
                referer: $("input[name=referer]").val(),
                cust_name: $("input[name=cust_name]").val(),
                cust_tel: $("input[name=cust_tel]").val(),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    alert("상담신청이 완료되었습니다.");
                    btnSubmit.find("span").text("신청완료");
                    btnSubmit.css({ background: "#a5a5a5" });
                    btnSubmit.prop("disabled", true);
                } else {
                    alert("시스템 장애\n관리자에게 문의주세요.");
                    btnSubmit.find("span").text(txtSubmit);
                    btnSubmit.css({ background: "#fa6c39" });
                    btnSubmit.prop("disabled", false);
                }
            })
            .catch((error) => {
                alert("시스템 장애\n관리자에게 문의주세요.");
                btnSubmit.find("span").text(txtSubmit);
                btnSubmit.css({ background: "#fa6c39" });
                btnSubmit.prop("disabled", false);
                console.error("Error:", error);
            });
    });
});
