/*
 * ------------------------------------------------------------------------------------------------
 * Author        : tteongi
 * Creation Date : 2019-09-27
 * Description   : common
 * Location      : /assets/js/mongtree.common.js
 * ------------------------------------------------------------------------------------------------
 */


/* Common Handler -----------------------------------------------------------------------------
-------------------------------------------------------------------------------------------- */
$(function () {

    // Common NameSpace
    commonNameSpace = function () {

        // Common Names...
        var ajaxStartWrap = "#loadingWrap";
        var ajaxStartLayer = "";

        // Request to Return
        return {
            "ajaxStartWrap": ajaxStartWrap
            , "ajaxStartLayer": ajaxStartLayer
        }
    }

    // NameSapce Initialize
    commonNames = commonNameSpace();

    // ajax Start Function
    $(document).ajaxStart(function () {
        $(commonNames.ajaxStartWrap).addClass("active");
    });
    // ajax Stop Function
    $(document).ajaxStop(function () {
        $(commonNames.ajaxStartWrap).removeClass("active");
    });

});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Ajax Load
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function AjaxLoad(AjaxUrl, AjaxParameter, AjaxType, AjaxDataType, AjaxAsync, AjaxSuccess, AjaxError, AjaxComplete, AjaxGlobal) {

    if (AjaxGlobal !== true) AjaxGlobal = false;

    //
    var ErrorHandle = "";
    if (typeof AjaxError === "undefined" || AjaxError == "") {
        ErrorHandle = ErrorHandling;
    } else {
        ErrorHandle = AjaxError;
    }

    $.ajax({
        timeout: 30000,
        url: AjaxUrl,
        data: AjaxParameter,
        type: AjaxType,
        dataType: AjaxDataType,
        async: AjaxAsync,
        success: AjaxSuccess,
        complete: AjaxComplete,
        global: AjaxGlobal,
        error: ErrorHandle
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Ajax Load
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function AjaxLoadAni(AjaxUrl, AjaxParameter, AjaxType, AjaxDataType, AjaxAsync, AjaxSuccess, AjaxError, AjaxComplete, AjaxGlobal) {

    if (AjaxGlobal !== true) AjaxGlobal = false;

    //
    var ErrorHandle = "";
    if (typeof AjaxError === "undefined" || AjaxError == "") {
        ErrorHandle = ErrorHandling;
    } else {
        ErrorHandle = AjaxError;
    }

    $.ajax({
        timeout: 30000,
        url: AjaxUrl,
        data: AjaxParameter,
        type: AjaxType,
        dataType: AjaxDataType,
        async: true,
        success: AjaxSuccess,
        //complete:AjaxComplete,
        global: AjaxGlobal,
        error: ErrorHandle,
        beforeSend: function () {
            $('.loader_Wrap').show();
        },
        complete: function () {
            $('.loader_Wrap').hide();
        }
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Error Handling
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ErrorHandling(data) {

    //AlertMsg(data.responseText);
    //사용예) Method||Message||Url
    var LayerId = "#DefaultAlertLayer";
    var Response = data.responseText.split("||");
    var Method = Response[0];
    var Message = Response[1];
    var ReturnUrl = Response[2];

    if (Method == "Redirect") {

        //LayerId : 레이어아이디, LayerTitle : 레이어타이틀, LayerSubTitle : 레이어서브타이틀, LayerContents : 레이어 콘텐츠, LayerFooter : 레이어푸터
        AlertLayer(LayerId, 'Error', '', Message, '');
        $(LayerId).modal();
        ProgressCtrl(LayerId, 100, 2000, ReturnUrl);
    } else {
        if (data.status == 500) {
            if (data.responseJSON) {
                var responseJson = data.responseJSON;
                if (responseJson.code) {
                    AlertMsg(responseJson.code + " - " + responseJson.message);
                } else {
                    AlertMsg(responseJson.message);
                }
                return;
            } else {
                AlertMsg(data.responseText);
                return;
            }
        }
        if (data.statusText === 'timeout') {
            AlertMsg("[ERR-S01] 요청 시간이 초과되었습니다. 잠시후 다시 시도 해주세요.");
            return;
        }
        AlertMsg("error");
    }

    /*if (jqXHR.status === 0) {
        //$("#desc").text('Not connect.\n Verify Network.');
        AlertMsg("'Not connect.\n Verify Network.");
    } else if (jqXHR.status == 404) {
        //$("#desc").text('Requested page not found. [404]');
        AlertMsg("Requested page not found. [404]");
    } else if (jqXHR.status == 500) {
        //$("#desc").text('Internal Server Error [500].' + jqXHR.responseText);
        AlertMsg("Internal Server Error [500]." + jqXHR.responseText)
    } else if (exception === 'parsererror') {
        //$("#desc").text('Requested JSON parse failed.' + jqXHR.responseText);
        AlertMsg("Requested JSON parse failed." + jqXHR.responseText);
    } else if (exception === 'timeout') {
        //$("#desc").text('Time out error.');
        AlertMsg("Time out error.");
    } else if (exception === 'abort') {
        //$("#desc").text('Ajax request aborted.');
        AlertMsg("Ajax request aborted.");
    } else {
        //$("#desc").text('Uncaught Error.\n' + jqXHR.responseText);
        AlertMsg("Uncaught Error.\n" + jqXHR.responseText);
    }*/
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DropBoxInit(목록, "셀렉트박스 아이디", "기본 value", "기본 text", "옵션에 추가될 value 필드명", "옵션에 추가될 text 필드명");
// DropBoxInit(Array(array('optVal'=>'1', 'optText'=>'일'), array('optVal'=>'2', 'optText'=>'이')), "#OptID", "", "선택해주세요.", "optVal", "optText");
// { lists, selObj, defaultVal, defaultText, optVal, optText }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DropBoxInit(data) {

    //Select Box Reset
    $(data.selObj).html("");

    //Select Box Default Option
    if (data.defaultText) {
        $("<option />").val(data.defaultVal).text(data.defaultText).appendTo($(data.selObj));
    }

    if (data.lists) {

        //Select Box Option Append
        $.each(data.lists, function (key, val) {

            if (val[data.optVal]) {

                if (data.selectedVal == val[data.optVal]) {
                    $("<option />").val(val[data.optVal]).text(val[data.optText]).appendTo($(data.selObj)).attr("selected", "selected");
                } else {
                    $("<option />").val(val[data.optVal]).text(val[data.optText]).appendTo($(data.selObj));
                }
            }
        });
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Multiple Select
// { lists, selObj, defaultVal, defaultText, optVal, optTexts, textSeparator }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DropBoxInitMultiText(data) {

    //Select Box Reset
    $(data.selObj).html("");

    //Select Box Default Option
    if (data.defaultText) {
        $("<option />").val(data.defaultVal).text(data.defaultText).appendTo($(data.selObj));
    }

    if (data.lists) {

        //Select Box Option Append
        $.each(data.lists, function (key, val) {

            if (val[data.optVal]) {

                var optText = new Array();
                for (var i = 0; i < data.optTexts.length; i++) {
                    optText[i] = val[data.optTexts[i]];
                }

                $("<option />").val(val[data.optVal]).text(optText.join(data.textSeparator)).appendTo($(data.selObj));
            }
        });
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Alert
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function AlertMsg(Msg) {
    alert(Msg);
}

function AlertReload(Msg) {
    alert(Msg);
    location.reload();
}

function AlertLocation(Msg, Url) {
    alert(Msg);
    location.href = Url;
}


$(function () {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 클립보드에 저장 : 동일경로의 clipboard.min.js 파일이 꼭 필요함.
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var clipboard = new ClipboardJS('.clipBtn', {
        text: function (e) {
            var dataClipValue = $(e).attr("data-clip-value");
            alert("클립보드에 복사되었습니다.");
            return dataClipValue;
        }
    });

    clipboard.on('success', function (e) {
        console.log(e);
    });

    clipboard.on('error', function (e) {
        console.log(e);
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 전화번호 하이픈 자동삽입 : input 의 maxlength = 14
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $(".phoneNumber,#cust_tel,#apply_tel").on("keyup", function () {

        $(this).val($(this).val().replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, "$1-$2-$3").replace("--", "-"));
    });
})


