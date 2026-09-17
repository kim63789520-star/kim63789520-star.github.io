// 전역 변수
var errmsg = "";
var errfld = null;

// 필드 검사
function check_field(fld, msg) {
    if ((fld.value = trim(fld.value)) == "")
        error_field(fld, msg);
    else
        clear_field(fld);
    return;
}

// 필드 오류 표시
function error_field(fld, msg) {
    if (msg != "")
        errmsg += msg + "\n";
    if (!errfld) errfld = fld;
    fld.style.background = "#FFE4E1";
}

// 필드를 깨끗하게
function clear_field(fld) {
    fld.style.background = "#FFFFFF";
}

// 팝업 중앙에 띄우기
var pwin = null;

function win_open(url, name, w, h, scroll) {
    LeftPosition = (screen.width) ? (screen.width - w) / 2 : 0;
    TopPosition = (screen.height) ? (screen.height - h) / 2 : 0;
    settings = 'height=' + h + ',width=' + w + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=' + scroll + ',resizable=no'
    pwin = window.open(url, name, settings)
}

// 5자리 우편번호 도로명 우편번호 창
function win_zip(frm_name, frm_zip, frm_addr1, frm_addr2, frm_addr3, frm_jibeon) {
    var url = mt_bbs_url + "/zip.php?frm_name=" + frm_name + "&frm_zip=" + frm_zip + "&frm_addr1=" + frm_addr1 + "&frm_addr2=" + frm_addr2 + "&frm_addr3=" + frm_addr3 + "&frm_jibeon=" + frm_jibeon;
    win_open(url, "winZip", "483", "600", "yes");
}

// 쿠키 입력
function set_cookie(name, value, expirehours, domain) {
    var today = new Date();
    today.setTime(today.getTime() + (60 * 60 * 1000 * expirehours));
    document.cookie = name + "=" + escape(value) + "; path=/; expires=" + today.toGMTString() + ";";
    if (domain) {
        document.cookie += "domain=" + domain + ";";
    }
}

// 쿠키 얻음
function get_cookie(name) {
    var find_sw = false;
    var start, end;
    var i = 0;

    for (i = 0; i <= document.cookie.length; i++) {
        start = i;
        end = start + name.length;

        if (document.cookie.substring(start, end) == name) {
            find_sw = true
            break
        }
    }

    if (find_sw == true) {
        start = end + 1;
        end = document.cookie.indexOf(";", start);

        if (end < start)
            end = document.cookie.length;

        return unescape(document.cookie.substring(start, end));
    }
    return "";
}

/*Left menu구현*/
var old = '';

function menu(name) {
    submenu = eval("submenu_" + name + ".style");
    if (old != submenu) {
        if (old != '') {
            old.display = 'none';
        }
        submenu.display = 'block';
        old = submenu;
    } else {
        submenu.display = 'none';
        old = '';
    }
}

function MM_swapImgRestore() { //v3.0
    var i, x, a = document.MM_sr;
    for (i = 0; a && i < a.length && (x = a[i]) && x.oSrc; i++) x.src = x.oSrc;
}

function MM_preloadImages() { //v3.0
    var d = document;
    if (d.images) {
        if (!d.MM_p) d.MM_p = new Array();
        var i, j = d.MM_p.length, a = MM_preloadImages.arguments;
        for (i = 0; i < a.length; i++)
            if (a[i].indexOf("#") != 0) {
                d.MM_p[j] = new Image;
                d.MM_p[j++].src = a[i];
            }
    }
}

function MM_swapImage() { //v3.0
    var i, j = 0, x, a = MM_swapImage.arguments;
    document.MM_sr = new Array;
    for (i = 0; i < (a.length - 2); i += 3)
        if ((x = MM_findObj(a[i])) != null) {
            document.MM_sr[j++] = x;
            if (!x.oSrc) x.oSrc = x.src;
            x.src = a[i + 2];
        }
}

function MM_reloadPage(init) {  //reloads the window if Nav4 resized
    if (init == true) with (navigator) {
        if ((appName == "Netscape") && (parseInt(appVersion) == 4)) {
            document.MM_pgW = innerWidth;
            document.MM_pgH = innerHeight;
            onresize = MM_reloadPage;
        }
    }
    else if (innerWidth != document.MM_pgW || innerHeight != document.MM_pgH) location.reload();
}

MM_reloadPage(true);


function MM_findObj(n, d) { //v4.01
    var p, i, x;
    if (!d) d = document;
    if ((p = n.indexOf("?")) > 0 && parent.frames.length) {
        d = parent.frames[n.substring(p + 1)].document;
        n = n.substring(0, p);
    }
    if (!(x = d[n]) && d.all) x = d.all[n];
    for (i = 0; !x && i < d.forms.length; i++) x = d.forms[i][n];
    for (i = 0; !x && d.layers && i < d.layers.length; i++) x = MM_findObj(n, d.layers[i].document);
    if (!x && d.getElementById) x = d.getElementById(n);
    return x;
}

function MM_showHideLayers() { //v6.0
    var i, p, v, obj, args = MM_showHideLayers.arguments;
    for (i = 0; i < (args.length - 2); i += 3) if ((obj = MM_findObj(args[i])) != null) {
        v = args[i + 2];
        if (obj.style) {
            obj = obj.style;
            v = (v == 'show') ? 'visible' : (v == 'hide') ? 'hidden' : v;
        }
        obj.visibility = v;
    }
}

var jumin_field_length = 0;

function TabNext(obj, event, len, next_field) {
    if (event == "down") {
        jumin_field_length = obj.value.length;
    } else if (event == "up") {
        if (obj.value.length != jumin_field_length) {
            jumin_field_length = obj.value.length;
            if (jumin_field_length == len) {
                next_field.focus();
            }
        }
    }
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.stripspace = function () {
    return this.replace(/ /g, "");
}

String.prototype.replaceAll = function (a, b) {
    var s = this;
    var n1, n2, s1, s2;

    while (true) {
        if (s == "" || a == "") break;
        n1 = s.indexOf(a);
        if (n1 < 0) break;
        n2 = n1 + a.length;
        if (n1 == 0) {
            s1 = b;
        } else {
            s1 = s.substring(0, n1) + b;
        }
        if (n2 >= s.length) {
            s2 = "";
        } else {
            s2 = s.substring(n2, s.length);
        }
        s = s1 + s2;
    }
    return s;
}

// Event 추가 ##################################################
function addEvent(obj, evt, exec) {
    if (window.attachEvent) obj.attachEvent('on' + evt, exec);
    else if (window.addEventListener) obj.addEventListener(evt, exec, false);
    else obj['on' + evt] = exec;
}

// 팝업 ##################################################
function openPopup(theURL, winName, width, height, remFeatures) {
    var features = "";
    if (typeof winName == "undefined") winName = "";
    if (typeof width != "undefined") features += ((features) ? "," : "") + "width=" + width;
    if (typeof height != "undefined") features += ((features) ? "," : "") + "height=" + height;
    if (typeof remFeatures != "undefined") features += ((features) ? "," : "") + remFeatures;
    if (features.indexOf("status") < 0) features += ",status=yes";

    var popup = window.open(theURL, winName, features);
    popup.focus();

    return popup;
}

// 팝업 - 팝업창 화면중앙 오픈 ##################################################
function openPopupCenter(theURL, winName, width, height, remFeatures) {
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.availHeight / 2) - (height / 2);
    var features = "left=" + left + ",top=" + top + ",width=" + width + ",height=" + height;
    if (typeof winName == "undefined") winName = "";
    if (typeof remFeatures != "undefined") features += "," + remFeatures;
    if (features.indexOf("status") < 0) features += ",status=yes";

    var popup = window.open(theURL, winName, features);
    popup.focus();

    return popup;
}

// 팝업 - 팝업창 사이즈 조정 ##################################################
function resizePopupWindow(width, height) {
    var strAgent = navigator.userAgent.toLowerCase();
    var isIE7 = (strAgent.indexOf('msie 7.0') != -1);
    var isMoz = (strAgent.indexOf('gecko') != -1);
    window.resizeTo(width + 10, height + (isIE7 ? 71 : (isMoz ? 81 : 49)));
}

// 팝업 - 팝업창 위치 조정 ##################################################
function movePopupWindow(left, top) {
    window.moveTo(left, top);
}

// 모달 ##################################################
function MM_openModal(theURL, obj, features) {
    window.showModalDialog(theURL, obj, features);
}

// 키 관련 함수 ##################################################
function blockKey(e) {
    var e = window.event || e;
    if (window.event) {
        e.returnValue = false;
    } else {
        if (e.which != 8) e.preventDefault(); // 8 : Back Space
    }
}

function blockEnter(e) {
    var e = window.event || e;
    if (window.event) {
        if (e.keyCode == 13) e.returnValue = false;
    } else {
        if (e.which == 13) e.preventDefault();
    }
}

function blockNotNumber(e) {
    var e = window.event || e;
    if (window.event) {
        if (e.keyCode < 48 || e.keyCode > 57) e.returnValue = false;
    } else {
        if (e.which != 8 && (e.which < 48 || e.which > 57)) e.preventDefault(); // 8 : Back Space
    }
}

function onEnter(e, exec) {
    var e = window.event || e;
    var keyCode = (window.event) ? e.keyCode : e.which;
    if (keyCode == 13) eval(exec);
}

// 즐겨찾기 추가
function addFavorites(title, url) {
    // Google Chrome
    if (window.chrome) {
        alert("Ctrl+D키를 누르시면 즐겨찾기에 추가하실 수 있습니다.");
    }
    // Firefox
    else if (window.sidebar) {
        window.sidebar.addPanel(title, url, "");
    }
    // Opera
    else if (window.opera && window.print) {
        var elem = document.createElement('a');
        elem.setAttribute('href', url);
        elem.setAttribute('title', title);
        elem.setAttribute('rel', 'sidebar');
        elem.click();
    }
    // Internet Explorer
    else if (window.external && ('AddFavorite' in window.external)) {
        window.external.AddFavorite(url, title);
    }
}

// 시작페이지 설정 ##################################################
// 예) <a href="javascript:;" onClick="setStartPage(this, 'http://www.homepage.com');">시작페이지로</a>
function setStartPage(obj, url) {
    if (document.all && window.external) { // IE
        obj.style.behavior = "url(#default#homepage)";
        obj.setHomePage(url);
    } else { // Firefox, Opera, Safari ...
        alert("현재 브라우져에서는 이용할 수 없습니다.");
        return;
    }
}

// 페이지 이동 ##################################################
function gotoUrl(url) {
    if (url.stripspace() != "") {
        location.href = url;
    }
}

// 페이지 최상단으로 ##################################################
function goTop() {
    window.scrollTo(0, 0);
}

// 이미지 미리보기 ##################################################
function previewImage(obj, imgId) {
    var objImg = document.getElementById(imgId);

    if (obj.value.stripspace() == "") return;

    var ext = getFileExt(obj.value).toUpperCase();

    if (ext == 'JPG' || ext == 'GIF' || ext == 'BMP' || ext == 'PNG') objImg.src = obj.value;
}

// 이미지 사이즈 줄이기 ##################################################
function resizeImage(objImg, limitId) {
    if (typeof (objImg) != "object") objImg = document.getElementById(objImg);
    var objParent = objImg.parentNode;
    var imgWidth = parseInt(objImg.width, 10);
    var fixWidth = imgWidth;

    if (typeof limitId == 'undefined') return;

    while (objParent) {
        if (objParent && objParent.id == limitId) {
            fixWidth = objParent.clientWidth;
            break;
        }
        objParent = objParent.offsetParent;
    }

    if (imgWidth > fixWidth) {
        objImg.width = fixWidth;
    }
}

function resizeImageAll(limitId) {
    var objLimit = document.getElementById(limitId);
    if (objLimit) {
        var fixWidth = objLimit.clientWidth;
        var arrImgs = objLimit.getElementsByTagName("IMG");
        for (var i = 0, len = arrImgs.length; i < len; i++) {
            if (parseInt(arrImgs[i].width, 10) > fixWidth) {
                arrImgs[i].width = fixWidth;
            }
        }
    }
}

// IFRAME RESIZE 함수 ##################################################
function resizeFrame(iframeWindow, minWidth, minHeight, fixWidth, fixHeight) {
    if (!iframeWindow.name) return false;

    var iframeElement = document.getElementById(iframeWindow.name);
    var resizeWidth = 0;
    var resizeHeight = 0;

    minWidth = (typeof minWidth != 'undefined') ? parseInt(minWidth, 10) : 0;
    minHeight = (typeof minHeight != 'undefined') ? parseInt(minHeight, 10) : 0;
    fixWidth = (typeof fixWidth != 'undefined') ? parseInt(fixWidth, 10) : 0;
    fixHeight = (typeof fixHeight != 'undefined') ? parseInt(fixHeight, 10) : 0;

    if (document.all) { // ie
        if (iframeWindow.document.compatMode && iframeWindow.document.compatMode != 'BackCompat') {
            resizeWidth = iframeWindow.document.documentElement.scrollWidth;
            resizeHeight = iframeWindow.document.documentElement.scrollHeight;
        } else {
            resizeWidth = iframeWindow.document.body.scrollWidth;
            resizeHeight = iframeWindow.document.body.scrollHeight;
        }
    } else {
        resizeWidth = iframeWindow.document.body.scrollWidth;
        resizeHeight = iframeWindow.document.body.scrollHeight;
    }

    if (minWidth > 0 && resizeWidth < minWidth) resizeWidth = minWidth;			// 최소 폭
    if (minHeight > 0 && resizeHeight < minHeight) resizeHeight = minHeight;		// 최소 높이

    if (fixWidth > 0) resizeWidth = fixWidth;		// 고정 폭
    if (fixHeight > 0) resizeHeight = fixHeight;	// 고정 높이

    if (fixWidth > -1) iframeElement.style.width = resizeWidth + 'px';
    if (fixHeight > -1) iframeElement.style.height = resizeHeight + 'px';
}

// 현재 이벤트객체 Index 가져오기 ##################################################
function getDisObjIdx(obj) {
    var i = 0;
    var result = 0;

    var arrTag = document.getElementsByTagName('*');

    if (obj.sourceIndex) {
        while (arrTag[i].sourceIndex < obj.sourceIndex) {
            if (arrTag[i].id == obj.id) ++result;
            ++i;
        }
    } else if (obj.compareDocumentPosition) {
        while ((arrTag[i].compareDocumentPosition(obj) & 6) - 3 > 0) {
            if (arrTag[i].id == obj.id) ++result;
            ++i;
        }
    }

    return result;
}

// 체크박스 전체선택 ##################################################
function checkCbAll(cbList, isChecked) {
    if (cbList) {
        if (typeof (cbList.length) == "undefined") {
            if (!cbList.disabled) cbList.checked = isChecked;
        } else {
            for (var i = 0; i < cbList.length; i++) {
                if (cbList[i].type.toUpperCase() == 'CHECKBOX') {
                    if (cbList[i].value.stripspace() != "" && !cbList[i].disabled) {
                        cbList[i].checked = isChecked;
                    }
                }
            }
        }
    }
}

// 텍스트 길이 확인 (일반) ##################################################
function checkTextLen(obj, mLen) {
    if (obj.value.length > mLen) {
        alert("1~" + mLen + "자까지 입력이 가능합니다.");
        obj.value = obj.value.substring(0, mLen);
        obj.focus();
        return false;
    }

    return true;
}

// 텍스트 길이 확인 (Byte) ##################################################
function checkTextLenByte(obj, mLen) {
    var i, len;
    var byteLen = 0;
    var value = obj.value;

    for (i = 0, len = value.length; i < len; i++) {
        ++byteLen;

        if ((value.charCodeAt(i) < 0) || (value.charCodeAt(i) > 127)) ++byteLen;

        if (byteLen > mLen) {
            alert("1~" + (mLen / 2) + "자의 한글, 또는 2~" + mLen + "자의 영문, 숫자, 문장기호로 입력이 가능합니다.");
            obj.value = value.substring(0, i);
            obj.focus();
            return false;
        }
    }

    return true;
}

// 객체 Offset 가져오기 ##################################################
function getOffset(obj) {
    var objOffset = {left: 0, top: 0};
    var objOffsetParent = obj.offsetParent;

    objOffset.left = parseInt(obj.offsetLeft, 10);
    objOffset.top = parseInt(obj.offsetTop, 10);

    while (objOffsetParent) {
        objOffset.left += parseInt(objOffsetParent.offsetLeft, 10);
        objOffset.top += parseInt(objOffsetParent.offsetTop, 10);

        objOffsetParent = objOffsetParent.offsetParent;
    }

    return objOffset;
}

// 텍스트 Byte 길이 가져오기 ##################################################
function getTextByte(value) {
    var i, len;
    var byteLen = 0;

    for (i = 0, len = value.length; i < len; i++) {
        if (escape(value.charAt(i)).length >= 4) {
            byteLen += 2;
        } else if (escape(value.charAt(i)) != "%0D") {
            ++byteLen;
        }
    }

    return byteLen;
}

// 입력 문자길이 확인후 다음항목으로 포커스 옮기기 ##################################################
function goNextFocus(obj, len, next_item) {
    if (obj.value.stripspace().length == len) {
        next_item.focus();
    }
}

// 영문 문자열 확인 ##################################################
function strEngCheck(value) {
    var i;

    for (i = 0; i < value.length - 1; i++) {
        // 한글 체크 (한글 ASCII코드 : 12593부터)
        if (value.charCodeAt(i) > 12592) return false;
        // 공백 체크
        if (value.charAt(i) == " ") return false;
    }
    return true;
}

// 파일명 확인 ##################################################
function checkFileName(obj) {
    var result = false;

    if (obj.value.stripspace() != "") {
        var fidx = obj.value.lastIndexOf("\\") + 1;
        var filename = obj.value.substr(fidx, obj.value.length);
        result = strEngCheck(filename);
    }

    if (!result) {
        alert("파일명을 반드시 영문 또는 숫자로 해주세요.");
        obj.focus();
        return false;
    }
    return true;
}

// 파일 확장자 ##################################################
function getFileExt(value) {
    if (value != "") {
        var fidx = value.lastIndexOf("\\") + 1;
        var filename = value.substr(fidx, value.length);
        var eidx = filename.lastIndexOf(".") + 1;

        return filename.substr(eidx, filename.length);
    }
}

// 파일확장자 확인 ##################################################
function checkFileExt(obj, exts, errMsg) {
    var arrExt = exts.toLowerCase().split(",");
    var result = false;

    if (obj.value.stripspace() != "") {
        var ext = getFileExt(obj.value).toLowerCase();

        for (var i = 0; i < arrExt.length; i++) {
            if (arrExt[i].trim() == ext) result = true;
        }
    }

    if (!result) {
        alert(errMsg);
        obj.focus();
        return false;
    }
    return true;
}

// 영문/숫자 혼용 확인 ##################################################
function checkEngNum(str) {
    var RegExpE = /[a-zA-Z]/i;
    var RegExpN = /[0-9]/;

    return (RegExpE.test(str) && RegExpN.test(str)) ? true : false;
}

// 특수문자 확인 ##################################################
function checkSpecialChar(value) {
    var specialChar = "`~!@#$%^&*_+=|\\[]{}:;,<.>/?'\"";
    for (var i = 0, len = specialChar.length; i < len; i++) {
        if (value.indexOf(specialChar.substr(i, 1)) != -1) return true;
    }
    return false;
}

// 아이디 확인 ##################################################
function checkID(value, min, max) {
    var RegExp = /^[a-zA-Z0-9_]*$/i;
    var returnVal = RegExp.test(value) ? true : false;
    if (typeof (min) != "undefined" && value.length < min) returnVal = false;
    if (typeof (max) != "undefined" && value.length > max) returnVal = false;
    return returnVal;
}

// 비밀번호 확인 ##################################################
function checkPass(value, min, max) {
    var RegExp = /^[a-zA-Z0-9]*$/i;
    var returnVal = RegExp.test(value) ? true : false;
    if (typeof (min) != "undefined" && value.length < min) returnVal = false;
    if (typeof (max) != "undefined" && value.length > max) returnVal = false;
    return returnVal;
}

// 숫자 확인 ##################################################
function checkNum(value, isDec) {
    var RegExp;

    if (!isDec) isDec = false;
    RegExp = (isDec) ? /^-?[\d\.]*$/ : /^-?[\d]*$/;

    return RegExp.test(value) ? true : false;
}

// 이메일 확인 ##################################################
function checkEmail(email) {
    if (email.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) {
        return true;
    } else {
        return false;
    }
}

// URL 확인 ##################################################
function checkUrl(url) {
    var exp = new RegExp("^(http|https)\:\/\/");
    if (exp.test(url.toLowerCase())) {
        return true;
    } else {
        return false;
    }
}

// 공백 확인 ##################################################
function checkEmpty(obj) {
    if (obj.value.stripspace() == "") {
        return true;
    } else {
        return false;
    }
}

// Radio(CheckBox) 설정값 가져오기 ##################################################
function getRadioVal(obj) {
    var i, value = "";

    if (obj) {
        if (typeof (obj.length) == "undefined") {
            if (obj.checked) {
                value = obj.value;
            }
        } else {
            for (i = 0; i < obj.length; i++) {
                if (obj[i].checked) {
                    value = obj[i].value;
                    break;
                }
            }
        }
    }
    return value;
}

// Radio 설정하기 ##################################################
function setRadioVal(obj, value) {
    var i;

    if (obj) {
        if (typeof (obj.length) == "undefined") {
            if (obj.value == value) {
                obj.checked = true;
            }
        } else {
            for (i = 0; i < obj.length; i++) {
                if (obj[i].value == value) {
                    obj[i].checked = true;
                    break;
                }
            }
        }
    }
}

// Radio Disabled 설정하기 ##################################################
function setRadioDisabled(obj, value, disabled) {
    var i;

    if (obj) {
        if (typeof (obj.length) == "undefined") {
            if (obj.value == value) {
                obj.disabled = disabled;
            }
        } else {
            for (i = 0; i < obj.length; i++) {
                if (obj[i].value == value) {
                    obj[i].disabled = disabled;
                    break;
                }
            }
        }
    }
}

// Form Disabled 전체 설정하기 ##################################################
function setRadioDisabledAll(obj, disabled) {
    var i;

    if (obj) {
        if (typeof (obj.length) == "undefined") {
            obj.disabled = disabled;
        } else {
            for (i = 0; i < obj.length; i++) {
                obj[i].disabled = disabled;
            }
        }
    }
}

// Select 설정값 가져오기 ##################################################
function getSelectVal(obj) {
    var value = "";
    var idx = obj.selectedIndex;

    if (idx >= 0) {
        value = obj.options[idx].value;
    }

    return value;
}

// Select Option 추가 ##################################################
function selectAddList(obj, text, value) {
    var newOpt = document.createElement("OPTION");
    newOpt.text = text;
    newOpt.value = value;
    obj.options.add(newOpt);
}

// Select Option 전체삭제 ##################################################
function selectRemoveAll(obj) {
    for (var i = obj.length - 1; i >= 0; i--) {
        selectRemoveList(obj, i);
    }
}

// Select Option 삭제 ##################################################
function selectRemoveList(obj, i) {
    obj.remove(i);
}

// Hidden 추가 ##################################################
function addHidden(f, name, value) {
    var input = document.createElement('INPUT');
    input.type = 'HIDDEN';
    input.name = name;
    input.value = value;
    f.appendChild(input);
}

// 숫자 문자열에서 문자열 제거 ##################################################
function stripCharFromNum(value, isDec) {
    var i;
    var minus = "-";
    var nums = "1234567890" + ((isDec) ? "." : "");
    var result = "";

    for (i = 0; i < value.length; i++) {
        numChk = value.charAt(i);
        if (i == 0 && numChk == minus) {
            result += minus;
        } else {
            for (j = 0; j < nums.length; j++) {
                if (numChk == nums.charAt(j)) {
                    result += nums.charAt(j);
                    break;
                }
            }
        }
    }
    return result;
}

// 콤마(,) 제거 ##################################################
function stripComma(str) {
    var re = /,/g;
    return str.replace(re, "");
}

// 숫자 3자리수마다 콤마(,) 찍기 ##################################################
function formatComma(num, pos) {
    if (!pos) pos = 0;  //소숫점 이하 자리수
    var re = /(-?\d+)(\d{3}[,.])/;

    var strNum = stripComma(num.toString());
    var arrNum = strNum.split(".");

    arrNum[0] += ".";

    while (re.test(arrNum[0])) {
        arrNum[0] = arrNum[0].replace(re, "$1,$2");
    }

    if (arrNum.length > 1) {
        if (arrNum[1].length > pos) {
            arrNum[1] = arrNum[1].substr(0, pos);
        }
        return arrNum.join("");
    } else {
        return arrNum[0].split(".")[0];
    }
}

// 강제 소수점 이하 0채우기 ##################################################
// num: 대상숫자, pos: 출력을 원하는 소수점자리수
function setRoundZero(num, pos) {
    var strNum = stripComma(num.toString());
    var arrNum = strNum.split(".");

    if (arrNum.length <= 1) {
        num = arrNum[0] + ".";
        for (var i = 0; i < pos; i++) {
            num += "0";
        }
    } else {
        num = setRound(num, pos);
    }
    return num;
}

// 소수점 이하 반올림 ##################################################
// num: 대상숫자, pos:출력을 원하는 소수점자리수
function setRound(num, pos) {
    if (!pos) pos = 0;
    return Math.round(num * Math.pow(10, pos)) / Math.pow(10, pos);
}

// 소수점 이하 자름
// num: 대상숫자, pos:출력을 원하는 소수점자리수
function setFloor(num, pos) {
    if (!pos) pos = 0;
    return Math.floor(num * Math.pow(10, pos)) / Math.pow(10, pos);
}

// 금액 절사
// num: 대상숫자, pos:절사 자릿수 (Default 10원단위 절사)
function setCutting(num, pos) {
    if (!pos) pos = 10;
    return Math.floor(num / pos) * pos;
}

// 소수점 이하 자리수 확인 ##################################################
// num: 대상숫자, pos: 희망 소수점 이하자리수
function checkRound(num, len) {
    var strNum = stripComma(num.toString());
    var arrNum = strNum.split(".");

    if (arrNum.length > 1 && arrNum[1].length > len) return false;
    else return true;
}

// 통화형태로 변환 ##################################################
function toCurrency(obj) {
    if (obj.disabled) return false;

    var num = obj.value.stripspace();
    if (num == "") return false;

    if (!checkNum(stripComma(num))) {
        //alert ("숫자만 입력해주세요.");
        num = stripCharFromNum(num, false);
        obj.blur();
        obj.focus();
    }
    num = stripCharFromNum(stripComma(num), false);
    num = removePreZero(num);
    obj.value = formatComma(num);
}

// 숫자입력 확인 ##################################################
function numberOnly(obj, isDec) {
    if (!isDec) isDec = false;
    if (obj.disabled) return false;

    var num = obj.value.stripspace();
    if (num == "") return false;

    if (!checkNum(num, isDec)) {
        alert("숫자만 입력해주세요.");
        num = stripCharFromNum(num, isDec);
        obj.blur();
        obj.focus();
    }
    num = stripCharFromNum(stripComma(num), isDec);

    var arrNum = num.split(".");
    if (arrNum.length > 1) {
        obj.value = arrNum[0] + "." + arrNum[1];
    } else {
        obj.value = arrNum[0];
    }
}

// 숫자 증감 처리 ##################################################
function controllNum(obj, mode, isminus) {
    var num = obj.value;
    if (!isminus) isminus = 0;

    num = (num.stripspace() == "") ? 0 : num;
    num = (isNaN(num)) ? 0 : parseInt(num, 10);

    if (mode == '+') ++num;
    else --num;

    if (isminus != 1 && num < 0) num = 0;

    obj.value = num;
}

// 자바스크립트로 PHP의 number_format 흉내를 냄
// 숫자에 , 를 출력
function number_format(num, pos) {
    if (!pos) pos = 0;  //소숫점 이하 자리수
    var re = /(-?\d+)(\d{3}[,.])/;

    var strNum = no_comma(num.toString());
    var arrNum = strNum.split(".");

    arrNum[0] += ".";

    while (re.test(arrNum[0])) {
        arrNum[0] = arrNum[0].replace(re, "$1,$2");
    }

    if (arrNum.length > 1) {
        if (arrNum[1].length > pos) {
            arrNum[1] = arrNum[1].substr(0, pos);
        }
        return arrNum.join("");
    } else {
        return arrNum[0].split(".")[0];
    }
}

// , 를 없앤다.
function no_comma(data) {
    var tmp = '';
    var comma = ',';
    var i;

    for (i = 0; i < data.length; i++) {
        if (data.charAt(i) != comma)
            tmp += data.charAt(i);
    }
    return tmp;
}

function getPosition(e) {
    try {
        var mouseX = e.pageX ? e.pageX : document.documentElement.scrollLeft + event.clientX;
        var mouseY = e.pageX ? e.pageX : document.documentElement.scrollLeft + event.clientY;
    } catch (e) {
        var mouseX = document.body.offsetWidth - 350;
        var mouseY = document.body.offsetHeight - 400;
    }

    return {x: mouseX, y: mouseY};
}

/**
 * 필드 자동 포커스이동
 * obj 체크할 필드, toID 이동할 필드의 ID, maxLen 이동될 문자열길이
 */
function fieldLengthFocus(obj, toID, maxLen) {
    if (toID == null || maxLen == null) {
        return false;
    }

    if (obj.value.length >= maxLen) {
        document.getElementById(toID).focus();
    }
}

// 양쪽 공백 없애기
function trim(sVal) {
    var pattern = /(^\s*)|(\s*$)/g; // \s 문자열 시작부분과 문자열 끝나는 부분의 공백, 탭을 모두 찾는다.
    sReturnVal = sVal.replace(pattern, "");
    return sReturnVal;
}

// Sub ID		: getRadioValue
// Description	: 체크된 라디오버튼 값
// Param		: obj	- RadioButton object
// Return		: 체크된 라디오버튼 값
function getRadioValue(obj) {
    if (obj) {
        if (obj.length) {
            for (i = 0; i < obj.length; i++) {
                if (obj[i].checked == true) {
                    return obj[i].value;
                }
            }

        } else {
            return obj.value;
        }
    } else {
        return false;
    }
}

// 이미지맵 위치로 이동
function pg_anchor(uid) {
    location.hash = uid;
}

// 숫자 3자리 마다 콤마를 삽입
function commaStr(n) {
    var reg = /(^[+-]?\d+)(\d{3})/;
    n += "";

    while (reg.test(n))
        n = n.replace(reg, "$1" + "," + "$2");
    return n;
}

// 콤마제거
function deCommaStr(obj) {
    num = obj.value + "";
    if (obj.value != "") {
        obj.value = obj.value.replace(/,/g, "");
    }
}

// 입력폼에 숫자 3자리 마다 콤마를 삽입
function addComma(obj, fLen) {
    if (event.keyCode == 37 || event.keyCode == 39) {
        return;
    }

    var fLen = fLen || 2;
    var strValue = obj.value.replace(/,|\s+/g, '');
    var strBeforeValue = (strValue.indexOf('.') != -1) ? strValue.substring(0, strValue.indexOf('.')) : strValue;
    var strAfterValue = (strValue.indexOf('.') != -1) ? strValue.substr(strValue.indexOf('.'), fLen + 1) : '';

    if (isNaN(strValue)) {
        alert(strValue.concat(' -> 특수문자/영문/한글은 입력할 수 없습니다.'));
        return false;
    }

    var intLast = strBeforeValue.length - 1;
    var arrValue = new Array;
    var strComma = '';

    for (var i = intLast, j = 0; i >= 0; i--, j++) {
        if (j != 0 && j % 3 == 0) {
            strComma = ',';
        } else {
            strComma = '';
        }

        arrValue[arrValue.length] = strBeforeValue.charAt(i) + strComma;
    }

    obj.value = arrValue.reverse().join('') + strAfterValue;
}

// 날짜검색
function search_date(fr_date, to_date, today) {
    if (today == "오늘") {
        var obj1 = document.getElementById(fr_date);
        var obj2 = document.getElementById(to_date);
        var mydate = new Date();
        mydate.setDate(mydate.getDate());

        obj1.value = formatDate(mydate);
        if (obj2 != null) {
            obj2.value = obj1.value;
        }
    } else if (today == "어제") {
        var obj1 = document.getElementById(fr_date);
        var obj2 = document.getElementById(to_date);
        var mydate = new Date();
        mydate.setDate(mydate.getDate() - 1);

        obj1.value = formatDate(mydate);
        if (obj2 != null) {
            obj2.value = obj1.value;
        }
    } else if (today == "이번주") {
        var obj1 = document.getElementById(fr_date);
        var obj2 = document.getElementById(to_date);

        var now = new Date();
        var nowDayOfWeek = now.getDay();
        var nowDay = now.getDate();
        var nowMonth = now.getMonth();
        var nowYear = now.getYear();
        nowYear += (nowYear < 2000) ? 1900 : 0;
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));

        obj1.value = formatDate(weekStartDate);
        obj2.value = formatDate(weekEndDate);
    } else if (today == "일주일") {
        var obj1 = document.getElementById(fr_date);
        var obj2 = document.getElementById(to_date);
        var mydate = new Date();

        mydate.setDate(mydate.getDate() - 7);
        obj1.value = formatDate(mydate);
        obj2.value = formatDate(new Date());
    } else if (today == "1개월") {
        var obj1 = document.getElementById(fr_date);
        var obj2 = document.getElementById(to_date);
        var mydate = new Date();
        mydate.setDate(mydate.getDate() - 30);

        obj1.value = formatDate(mydate);
        obj2.value = formatDate(new Date());
    } else if (today == "2개월") {
        var obj1 = document.getElementById(fr_date);
        var obj2 = document.getElementById(to_date);
        var mydate = new Date();
        mydate.setDate(mydate.getDate() - 60);

        obj1.value = formatDate(mydate);
        obj2.value = formatDate(new Date());
    } else if (today == "3개월") {
        var obj1 = document.getElementById(fr_date);
        var obj2 = document.getElementById(to_date);

        var mydate = new Date();
        mydate.setDate(mydate.getDate() - 90);

        obj1.value = formatDate(mydate);
        obj2.value = formatDate(new Date());
    } else if (today == "이번달") {
        var obj1 = document.getElementById(fr_date);
        var obj2 = document.getElementById(to_date);

        var d2, d3;
        var now = new Date();
        var nowYear = now.getYear();
        nowYear += (nowYear < 2000) ? 1900 : 0;

        d2 = new Date(nowYear, now.getMonth());
        d3 = new Date(nowYear, now.getMonth() + 1, "");

        obj1.value = formatDate(d2);
        obj2.value = formatDate(d3);
    } else if (today == "지난달") {
        var obj1 = document.getElementById(fr_date);
        var obj2 = document.getElementById(to_date);

        var d2, d3;
        var now = new Date();
        var nowYear = now.getYear();
        nowYear += (nowYear < 2000) ? 1900 : 0;

        d2 = new Date(nowYear, now.getMonth() - 1);
        d3 = new Date(nowYear, now.getMonth(), "");

        obj1.value = formatDate(d2);
        obj2.value = formatDate(d3);
    } else if (today == "전체") {
        var obj1 = document.getElementById(fr_date);
        var obj2 = document.getElementById(to_date);
        obj1.value = "";
        obj2.value = "";
    }
}

// 날짜계산
function formatDate(date) {
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
    return (date.getFullYear() + "-" + ((mymonth < 10) ? "0" : "") + mymonth + "-" + ((myweekday < 10) ? "0" : "") + myweekday);
}

// SNS
function share_sns(id, url) {
    switch (id) {
        case 'facebook' :
            window.open(url, "win_facebook", "menubar=0,resizable=1,width=600,height=400");
            break;
        case 'twitter' :
            window.open(url, "win_twitter", "menubar=0,resizable=1,width=600,height=400");
            break;
        case 'googleplus' :
            window.open(url, "win_googleplus", "menubar=0,resizable=1,width=600,height=600");
            break;
        case 'naverband' :
            window.open(url, "win_naverband", "menubar=0,resizable=1,width=410,height=540");
            break;
        case 'naver' :
            window.open(url, "win_naver", "menubar=0,resizable=1,width=450,height=540");
            break;
        case 'kakaostory' :
            window.open(url, "win_kakaostory", "menubar=0,resizable=1,width=500,height=500");
            break;
        case 'pinterest' :
            window.open(url, "win_pinterest", "menubar=0,resizable=1,width=600,height=400");
            break;
        case 'tumblr' :
            window.open(url, "win_tumblr", "menubar=0,resizable=1,width=540,height=600");
            break;
    }
    return false;
}

function itemlistwish(gs_id, section) {

    var requestUrl = mt_shop_url + "/ajax.wishupdate.php";
    if (section == "models") requestUrl = mt_model_url + "/ajax.wishupdate.php";

    $.post(
        requestUrl,
        {gs_id: gs_id},
        function (data) {
            if (data == 'INSERT') {
                $("." + gs_id).attr('class', gs_id + ' zzim on');
            } else if (data == 'DELETE') {
                $("." + gs_id).attr('class', gs_id + ' zzim');
            } else {
                alert(data);
            }
        }
    );
}

function saupjaonopen(saupjano) {
    var url = "http://www.ftc.go.kr/info/bizinfo/communicationViewPopup.jsp?wrkr_no=" + saupjano;
    window.open(url, "communicationViewPopup", "width=750, height=700;");
}

$(function () {
    // 최상단 큰배너
    $("#hd_close").on('click', function () {
        $("#hd_banner").slideUp('fast');
        $.post(mt_bbs_url + "/ajax.hd_banner.php", {type: "close"});
    });

  // 중간배너
    if($('.middle_banner').length){
      const middleBanSlider = new Swiper('.middle_banner' , {
        slidesPerView: 1,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
      });
    }
});

/* [select box 포함] : 연락처 자동 하이픈 생성 함수 */
$(function () {
    if ($('.select_phone')) {
        $('#b2b_phone, .phoneFormat').on('keyup', function () {
            $(this).val(
                $(this).val().replace(/[^\d]/g, '').replace(/^(\d{3,4})(\d{4})$/, `$1-$2`)
            );
        });
    }
});

/* 휴대폰 유효성 검증 강화 select box 미포함 */
function isValidPhoneNumberNotIncludeSelectBox(text) {
    /* 1. 집, 휴대폰 번호 정규식 규칙 지정 */
    const regexPhone = /^010-[0-9]{4}-[0-9]{4}$/;
    const regexRegionTel = /^(0505|070|02|0[3-9]{1}[1-9]{1})-[0-9]{3,4}-[0-9]{4}$/;

    /* 2. 번호 앞 2자리가 01로 시작하면 휴대폰 아니면 지역 번호 */
    if (text.substring(0, 2) == "01") {
        if (!regexPhone.test(text)) {
            alert("휴대폰 번호 양식이 잘못되었습니다.");
            return false;
        }
    } else {
        if (!regexRegionTel.test(text)) {
            alert("전화번호 양식이 잘못되었습니다.");
            return false;
        }
    }

    return true;
}


/* 이름 글자수 제한 */
function isValidCustNameChk(text){
    if(text.length > 15){
        alert("15자 이내로 작성해주세요.");
        return false;
    }
    return true;
}

/* 휴대폰 유효성 검증 강화 select box 포함 */
function isValidPhoneNumberIncludeSelectBox(text) {
    // 연락처 select box 존재
    const phoneRegex = /^[\d]{3,4}-[\d]{4}$/;

    if (!phoneRegex.test(text)) {
        alert("연락처 양식이 잘못되었습니다.");
        return false;
    }

    return true;
}

/* select box 포함 미포함에 따른 유효성 검사 분기처리 */
function isValidPhoneNumber(value) {
    // target.length == 존재 여부 체크
    if ($('.select_phone').length) {
        if (!isValidPhoneNumberIncludeSelectBox(value)) {
            return false;
        }
    } else {
        if (!isValidPhoneNumberNotIncludeSelectBox(value)) {
            return false;
        }
    }

    return true;
}


/* ==========================================================================
 * 고객정보 입력 유효성 검증 — 단계적 반영용 (1단계: 추가만)
 *
 * 기존 함수(isValidPhoneNumber·isValidCustNameChk 등)는 **손대지 않는다.**
 * 강화판은 이름 끝에 2 를 붙여 따로 둔다 — 아무도 부르지 않으므로
 * 이 파일을 배포해도 동작은 하나도 바뀌지 않는다.
 *
 * 이후 단계에서 테마 호출부를 몰 분류별로 *2 로 옮기고, 전 구간 확인이
 * 끝나면 기존 함수 본문을 강화판으로 교체한 뒤 *2 는 별칭으로 남긴다.
 * 절차: docs/20260831_고객정보-입력검증-강화/ 반영절차 참조
 * ========================================================================== */

/* 공통 위험 패턴 검사 — 모든 고객정보 필드에 선적용 (true = 안전) */
function isValidSafeInput(text) {
    if (text === undefined || text === null || text === '') return true;
    text = String(text);

    /* 제어문자·제로폭 문자 (개행·탭은 허용) */
    if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028\u2029\uFEFF]/.test(text)) return false;

    /* HTML 태그·속성 주입에 쓰이는 문자 */
    if (/[<>"'`\\;]/.test(text)) return false;

    /* 스크립트 실행 스킴·이벤트 핸들러 */
    if (/(javascript|vbscript|data)\s*:/i.test(text)) return false;
    if (/on\w+\s*=/i.test(text)) return false;

    /* HTML 엔티티·URL 인코딩 우회 */
    if (/&#|&[a-z]{2,8};/i.test(text)) return false;
    if (/%(3c|3e|22|27|60|00|253c)/i.test(text)) return false;

    return true;
}

/* 연락처 정규화 — 대한민국 국가번호(+82 · 0082 · 82)를 제거하고 앞자리 0 을 복원한다.
   모바일 자동완성·해외 로밍 입력에서 국가번호가 붙어 들어오는 경우를 정상 번호로 받는다.
   국가번호가 아니면 숫자만 남겨 그대로 돌려준다. */
function normalizePhoneNumber(value) {
    var digits = String(value === undefined || value === null ? '' : value).replace(/[^0-9]/g, '');
    /* 0082… / 82… 로 시작하면 국가번호로 본다.
       (국내 번호는 0 또는 1 로 시작하므로 82 로 시작하는 정상 번호는 없다)
       국가번호 뒤 자릿수는 8~12 — 0 을 뗀 형태(1012345678)와
       0 을 그대로 둔 형태(01012345678) 가 모두 들어온다 */
    var m = digits.match(/^(?:00)?82([0-9]{8,12})$/);
    if (m) {
        var rest = m[1];
        /* 이미 0 으로 시작하면 그대로, 아니면 0 을 복원한다 */
        return rest.charAt(0) === '0' ? rest : '0' + rest;
    }
    return digits;
}

/* 국내 번호 자릿수 규칙 판정 (알림 없음 · 숫자만 받는다) */
function isKoreanPhoneDigits(digits) {
    return /^01[016789][0-9]{7,8}$/.test(digits)                     /* 휴대폰 */
        || /^02[0-9]{7,8}$/.test(digits)                             /* 서울 */
        || /^0(3[1-3]|4[1-4]|5[1-5]|6[1-4])[0-9]{7,8}$/.test(digits) /* 지역번호 */
        || /^070[0-9]{7,8}$/.test(digits);                           /* 인터넷전화 */
    /* 기업 대표번호(15xx·16xx·18xx)와 안심번호(050X)는 접수 대상이 아니다.
       받는 쪽(영업전산)이 번호를 hp1·hp2·hp3 세 칸으로 나눠 저장하는데
       대표번호는 마디가 2개뿐이라 담기지 않고, 안심번호 12자리는 접수 API 가 거부한다.
       기존 검증도 두 번호를 막고 있었고 프론트 접수 이력도 없다. */
}

/* 국내 번호에 하이픈을 넣는다. 자릿수가 완성된 번호만 처리하고,
   애매한 조합(예: 010 + 7자리)은 건드리지 않는다 — 타이핑 도중 표기가 튀지 않게 하기 위함 */
function formatKoreanPhone(digits) {
    var d = String(digits || '').replace(/[^0-9]/g, '');

    /* 대표번호·안심번호는 접수 대상이 아니므로 하이픈을 넣지 않는다
       — 자동 정리되면 유효한 번호처럼 보여 오해를 준다 (isKoreanPhoneDigits 주석 참조) */

    /* 서울 02 */
    if (/^02[0-9]{8}$/.test(d)) return '02-' + d.slice(2, 6) + '-' + d.slice(6);
    if (/^02[0-9]{7}$/.test(d)) return '02-' + d.slice(2, 5) + '-' + d.slice(5);

    /* 휴대폰 11자리 (010·011·016~019) */
    if (/^01[016789][0-9]{8}$/.test(d)) return d.slice(0, 3) + '-' + d.slice(3, 7) + '-' + d.slice(7);
    /* 구 국번 10자리 (011·016~019 — 010 은 제외해 타이핑 중 표기가 바뀌지 않게 한다) */
    if (/^01[16789][0-9]{7}$/.test(d)) return d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6);

    /* 지역번호·인터넷전화 3자리 국번 */
    if (/^0(3[1-3]|4[1-4]|5[1-5]|6[1-4]|70)[0-9]{8}$/.test(d)) return d.slice(0, 3) + '-' + d.slice(3, 7) + '-' + d.slice(7);
    if (/^0(3[1-3]|4[1-4]|5[1-5]|6[1-4]|70)[0-9]{7}$/.test(d)) return d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6);

    return '';   /* 완성되지 않은 번호 — 건드리지 않는다 */
}

/* 비속어 포함 검사 (알림 없음 · true = 문제 없음)
   기존 isValidBadWordCheck 는 '정확히 같을 때'만 잡아서 '홍시발' 같은 조합을 놓친다.
   언어별로 판정을 달리한다:
     · 한글이 섞인 문자열 → 한글 목록으로 부분 포함 검사 (정상 업체명 오탐 0건 확인)
     · 순수 영문 문자열   → 영문 목록으로 단어 경계 검사
       (부분 포함으로 하면 Cucumber 의 cum, Bassett 의 ass 처럼 정상 이름이 막힌다) */
function isValidBadWordContain(text) {
    if (text === undefined || text === null || text === '') return true;
    /* badword_filter.js 가 없으면 조용히 통과시키지 않고, 최소한 기존 정확일치 검사라도 태운다.
       (광고차단 확장·네트워크 실패로 파일이 안 실릴 때 검증이 통째로 무력화되는 것을 막는다) */
    if (typeof badWordDB !== 'function') {
        if (typeof console !== 'undefined' && console.warn) {
            console.warn('[검증] badword_filter.js 미로드 — 비속어 검사가 축소 동작합니다');
        }
        if (typeof isValidBadWordCheck === 'function') return isValidBadWordCheck(text);
        return true;
    }

    var s = String(text).toLowerCase();
    var hasKo = /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(s);
    var list = badWordDB(hasKo ? 'ko' : 'en');

    /* 사람 이름 칸(minLen=3)은 두 글자 단어를 부분일치에서 뺀다.
       한국 이름 세 글자 안에 두 글자 비속어가 우연히 겹치는 일이 잦다
       — 창남·상년·이년·창년·유두·염병·은년·성교 등. 접수 데이터 실측에서
       이름 비속어 판정 48건이 전부 실명 오탐이었고 진짜 비속어는 0건이었다.
       완전일치는 minLen 과 무관하게 그대로 걸린다. */
    var minLen = (arguments.length > 1 && arguments[1]) ? arguments[1] : 1;

    for (var i = 0; i < list.length; i++) {
        var w = String(list[i] || '').toLowerCase();
        if (!w) continue;

        if (hasKo) {
            if (s === w) return false;
            if (w.length >= minLen && s.indexOf(w) !== -1) return false;
        } else {
            var esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            if (new RegExp('(^|[^a-z0-9])' + esc + '([^a-z0-9]|$)').test(s)) return false;
        }
    }
    return true;
}

/* 회사/업체명 유효성 검증 — 사업자 표기를 넓게 허용: (주)·㈜·&·,·/ 등 */
function isValidCompanyName(text) {
    text = String(text || '').trim();

    if (!isValidSafeInput(text)) {
        alert("회사/업체명에 사용할 수 없는 문자가 포함되어 있습니다.");
        return false;
    }
    if (text.length < 1 || text.length > 50) {
        alert("회사/업체명은 50자 이내로 작성해주세요.");
        return false;
    }
    if (!/^[가-힣a-zA-Z0-9 ()·.\-&,\/㈜]+$/.test(text)) {
        alert("회사/업체명에 사용할 수 없는 특수문자가 포함되어 있습니다.");
        return false;
    }
    if (!isValidBadWordContain(text)) {
        alert("올바른 회사/업체명을 입력해 주세요.");
        return false;
    }
    return true;
}

/* 문의내용(자유 텍스트) 유효성 검증 — 위험 패턴 차단 + 길이만 */
function isValidTextArea(text) {
    text = String(text || '');
    if (text === '') return true;

    if (!isValidSafeInput(text)) {
        alert("문의 내용에 사용할 수 없는 문자가 포함되어 있습니다.");
        return false;
    }
    if (text.length > 500) {
        alert("문의 내용은 500자 이내로 작성해주세요.");
        return false;
    }
    if (!isValidBadWordContain(text)) {
        alert("문의 내용에 부적절한 표현이 포함되어 있습니다.");
        return false;
    }
    return true;
}

/* 주소 유효성 검증 */
function isValidAddressChk(text) {
    text = String(text || '').trim();
    if (text === '') return true;

    if (!isValidSafeInput(text)) {
        alert("주소에 사용할 수 없는 문자가 포함되어 있습니다.");
        return false;
    }
    if (text.length > 100) {
        alert("주소는 100자 이내로 입력해주세요.");
        return false;
    }
    /* / ~ * ! : 와 한자·로마숫자 허용 — 동/호수(102/203·106*1202), 층 범위(1층~3층),
       아파트명(시티빌Ⅱ·여유로운家), 상호(어!반찬이네·커피마실래?), 부가설명([자택]·[지프매장])이
       실제 접수 주소에 들어온다. 따옴표·꺾쇠는 주입 벡터라 계속 막는다 */
    if (!/^[가-힣a-zA-Z0-9 ,()\-.·#&\/*~!:?\[\]\u3400-\u9FFF\u2160-\u217F\u3131-\u318F]+$/.test(text)) {
        alert("주소에 사용할 수 없는 특수문자가 포함되어 있습니다.");
        return false;
    }
    return true;
}

/*~!:?\[\]\u3400-\u9FFF\u2160-\u217F\u3131-\u318F]+$/.test(text)) {
        alert("주소에 사용할 수 없는 특수문자가 포함되어 있습니다.");
        return false;
    }
    return true;
}

/* 이메일 유효성 검증 (공통화 — 테마 개별 정의와 동일 시그니처: alert 없이 boolean 반환) */
function isValidEmailAddress(email) {
    /* TLD 는 2~24자 — .store·.online 등 신규 도메인도 허용 (기존 {2,3} 은 과차단) */
    const pattern = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,24}$/;
    return pattern.test(email);
}

/* ==========================================================================
 * 고객정보 폼 공통 검증 진입점
 * - 폼에 존재하는 필드만 골라 검사한다. 호출부는 한 줄로 끝난다:
 *       if (!validateCustomerForm(f)) return false;
 * - 검사 순서: 이름 → 회사/업체명 → 연락처 → 문의내용 → 개인정보 동의
 * - opts.skip  : 건너뛸 항목 배열 ('name','company','tel','text','agree')
 * - opts.agree : 동의 체크박스 name (미지정 시 chk_agree* 자동 탐지)
 * - 이미 개별 검증(isValidCustNameChk2 등)을 호출하는 폼은 이 함수를 쓰지 않는다
 *   — 중복 알림을 피하기 위함이며, 강화 로직은 개별 함수 쪽에 이미 반영돼 있다
 * ========================================================================== */
function validateCustomerForm(f, opts) {
    if (!f) return true;
    opts = opts || {};

    /* 폼 요소가 아니라 {cust_name: 엘리먼트, …} 형태로 넘어오는 호출부가 있다.
       그 경우 객체가 가진 엘리먼트들로 목록을 만든다 */
    var els = f.elements;
    if (!els) {
        els = [];
        for (var ek in f) {
            if (!Object.prototype.hasOwnProperty.call(f, ek)) continue;
            var ev = f[ek];
            if (ev && ev.tagName) { if (!ev.name) ev = ev; els.push(ev); }
        }
        if (!els.length) return true;
    }
    var skip = opts.skip || [];
    var need = opts.require || [];      /* 빈값 검사를 할 필드명 (호출부가 알려준다) */

    function want(key) { return skip.indexOf(key) === -1; }
    function required(name) { return need.indexOf(name) !== -1; }
    function blank(el) { return opts.optional && (!el.value || !el.value.length); }

    function fail(el, msg) {
        if (msg) alert(msg);
        if (el && el.focus) { try { el.focus(); } catch (e) {} }
        return false;
    }

    /* 문의내용을 뺀 입력칸의 앞뒤 공백 제거 (제출 시점 정리) */
    for (var t = 0; t < els.length; t++) {
        var te = els[t];
        if (!te || te.tagName !== 'INPUT') continue;
        if (te.type === 'hidden' || te.type === 'checkbox' || te.type === 'radio') continue;
        if (/^(message|cust_content|memo)/.test(te.name || '')) continue;
        if (typeof te.value !== 'string' || !te.value) continue;
        var tv = te.value.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
        if (tv !== te.value) te.value = tv;
    }

    /* ── 칸별 검사 — 한 칸에서 '필수 → 형식 → 내용'을 모두 끝낸다 ──────────
       화면에 보이는 칸 순서를 그대로 따르기 위해 폼의 실제 요소 순서를 훑는다.
       (폼마다 배치가 달라도 경고 순서가 화면과 어긋나지 않는다) */

    function checkCompany(el) {
        if (!want('company')) return true;
        if (!el.value) return required(el.name) ? fail(el, '회사/업체명을 입력해 주세요.') : true;
        return isValidCompanyName(el.value) ? true : fail(el);
    }

    function checkName(el) {
        if (!want('name')) return true;
        if (blank(el)) return true;
        if (!el.value) return required(el.name) ? fail(el, '이름을 입력해 주세요.') : true;
        return isValidCustNameChk2(el.value) ? true : fail(el);
    }

    function checkTel(el) {
        if (!want('tel')) return true;
        if (blank(el)) return true;
        if (!el.value) return required(el.name) ? fail(el, '연락처를 입력해 주세요.') : true;
        /* 국가번호가 붙어 있으면 정규화한 값으로 되써서 그 값이 접수되게 한다 */
        if (typeof normalizePhoneNumber === 'function') {
            var nt = normalizePhoneNumber(el.value);
            if (nt && isKoreanPhoneDigits(nt)) {
                var out = (typeof formatKoreanPhone === 'function' && formatKoreanPhone(nt)) || nt;
                if (out !== el.value) el.value = out;
            }
        }
        /* 유형 판정은 이 폼 안에서 — 페이지에 두 유형이 섞여 있어도 안전하다 */
        return isValidPhoneNumber2(el.value, el) ? true : fail(el);
    }

    function checkEmail(el) {
        if (!want('email')) return true;
        /* 분리형(아이디@도메인)이면 짝을 함께 본다 */
        var e1 = f['cust_email_1'], e2 = f['cust_email_2'];
        if (e1 && e2) {
            var local = String(e1.value || '').trim(), domain = String(e2.value || '').trim();
            if (!local && !domain) return required(e1.name) ? fail(e1, '이메일을 입력해 주세요.') : true;
            if (!local)  return fail(e1, '이메일 아이디를 입력해 주세요.');
            if (!domain) return fail(e2, '이메일 주소를 입력해 주세요.');
            return isValidEmailAddress(local + '@' + domain) ? true : fail(e1, '올바른 이메일 형식이 아닙니다.');
        }
        if (!el.value) return required(el.name) ? fail(el, '이메일을 입력해 주세요.') : true;
        return isValidEmailAddress(el.value) ? true : fail(el, '올바른 이메일 형식이 아닙니다.');
    }

    function checkText(el) {
        if (!want('text')) return true;
        if (!el.value) return required(el.name) ? fail(el, '문의 내용을 입력해 주세요.') : true;
        return isValidTextArea(el.value) ? true : fail(el);
    }

    function checkAddr(el) {
        if (!want('address')) return true;
        if (!el.value) return true;
        return isValidAddressChk(el.value) ? true : fail(el);
    }

    var HANDLER = {
        cust_company: ['company', checkCompany],
        cust_name:    ['name', checkName],
        apply_name:   ['name', checkName],
        name:         ['name', checkName],
        cust_tel:     ['tel', checkTel],
        apply_tel:    ['tel', checkTel],
        cellphone:    ['tel', checkTel],
        telephone:    ['tel', checkTel],
        cust_email:   ['email', checkEmail],
        cust_email_1: ['email', checkEmail],
        cust_email_2: ['email', checkEmail],
        email:        ['email', checkEmail],
        message:      ['text', checkText],
        cust_content: ['text', checkText],
        memo:         ['text', checkText],
        cust_memo:    ['text', checkText],
        apply_msg:    ['text', checkText],
        q_msg:        ['text', checkText],
        addr1:        ['addr', checkAddr],
        addr2:        ['addr', checkAddr],
        address1:     ['addr', checkAddr],
        address2:     ['addr', checkAddr]
    };
    /* 이름 목록은 **실제 폼에서 전수 수집**해 맞춘 것이다 (2026-09-14).
       추측으로 넣으면 그 칸만 조용히 검사에서 빠진다 — apply_msg 가 그래서
       <script src> 를 통과시켰다. 폼에 새 이름이 생기면 여기에 함께 넣는다. */

    var done = {};
    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (!el || !el.name || el.type === 'hidden') continue;
        var h = HANDLER[el.name];
        if (!h) continue;
        if (done[h[0]]) continue;          /* 같은 성격의 칸은 한 번만 */
        done[h[0]] = true;
        if (!h[1](el)) return false;
    }

    /* 개인정보 수집 동의 — 마지막 */
    if (want('agree')) {
        var agree = null;
        if (opts.agree && f[opts.agree]) {
            agree = f[opts.agree];
        } else {
            for (var k = 0; k < els.length; k++) {
                var c = els[k];
                if (c.type === 'checkbox' && c.name && c.name.indexOf('chk_agree') === 0) { agree = c; break; }
            }
        }
        if (agree && !agree.checked) {
            return fail(agree, '[개인정보 수집동의] 체크를 해주셔야 상담신청이 가능합니다.');
        }
    }

    return true;
}

/* 휴대폰 유효성 검증 강화 select box 미포함 (하이픈 유무 모두 허용) */
function isValidPhoneNumberNotIncludeSelectBox2(text) {
    text = String(text || '').trim();

    /* 숫자·하이픈·국가번호 표기(+ 공백 괄호) 외 문자 차단 */
    if (!/^[0-9+\-\s()]+$/.test(text)) {
        alert("연락처는 숫자만 입력해 주세요.");
        return false;
    }

    var digits = normalizePhoneNumber(text);

    var ok = isKoreanPhoneDigits(digits);

    if (!ok) {
        if (digits.substring(0, 2) == "01") {
            alert("휴대폰 번호 양식이 잘못되었습니다.");
        } else {
            alert("전화번호 양식이 잘못되었습니다.");
        }
        return false;
    }

    return true;
}

/* 이름 유효성 검증 (글자수 + 허용 문자) */
function isValidCustNameChk2(text) {
    text = String(text || '').trim();

    if (!isValidSafeInput(text)) {
        alert("이름에 사용할 수 없는 문자가 포함되어 있습니다.");
        return false;
    }
    /* 25자 — 사업자·기관은 이름 칸에 상호를 함께 적는다
       (예: 24시수동물메디칼센터(박수형)). 접수 데이터 실측 99.9% 가 22자 이내 */
    if (text.length < 2 || text.length > 25) {
        alert("이름은 2~25자 이내로 작성해주세요.");
        return false;
    }
    /* / & , _ 허용 — 기관명/담당자 표기(통영시종합사회복지관/고민지)가 실제로 들어온다 */
    if (!/^[가-힣a-zA-Z0-9 ()·.\-\/&,_]+$/.test(text)) {
        alert("이름은 한글·영문·숫자만 입력할 수 있습니다.");
        return false;
    }
    if (!isValidBadWordContain(text, 3)) {
        alert("올바른 이름을 입력해 주세요.");
        return false;
    }
    return true;
}

/* 휴대폰 유효성 검증 강화 select box 포함 (하이픈 유무 모두 허용) */
function isValidPhoneNumberIncludeSelectBox2(text) {
    text = String(text || '').trim();

    if (!/^[0-9+\-\s()]+$/.test(text)) {
        alert("연락처는 숫자만 입력해 주세요.");
        return false;
    }

    var digits = normalizePhoneNumber(text);
    if (!/^[0-9]{7,8}$/.test(digits)) {
        alert("연락처 양식이 잘못되었습니다.");
        return false;
    }

    return true;
}

/* 연락처 칸은 두 유형이다.
     전체번호형  cust_tel 한 칸에 전체 번호
     셀렉트형    cust_tel_1(앞자리 select) + cust_tel(뒷자리 7~8)
   scope(입력칸 또는 폼)를 주면 **그 폼 안에서만** 유형을 가른다.
   안 주면 예전처럼 페이지 전체(.select_phone)로 가른다 — 기존 호출부 호환.

   페이지 단위로만 보면, 한 문서에 두 유형이 같이 있을 때(주문폼·상품비교의
   전체번호형 + 레이어로 열리는 셀렉트형 빠른상담 등) 전체번호가 7~8자리 규칙에
   걸려 조용히 반려된다. 실제로 접수가 막히던 구간이라 scope 를 받게 했다. */
function isValidPhoneNumber2(value, scope) {
    var useSelectBox;
    var el = scope;

    /* jQuery 객체로 넘어오는 호출부가 있다 — 첫 엘리먼트를 꺼낸다 */
    if (el && !el.tagName && typeof el.length === 'number') el = el[0];

    var form = null;
    if (el && el.tagName) {
        form = el.tagName === 'FORM' ? el : (el.form || (el.closest && el.closest('form')));
    }

    if (form) {
        useSelectBox = !!form.querySelector('.select_phone');
    } else {
        // target.length == 존재 여부 체크
        useSelectBox = !!$('.select_phone').length;
    }

    if (useSelectBox) {
        if (!isValidPhoneNumberIncludeSelectBox2(value)) {
            return false;
        }
        return true;
    }

    if (!isValidPhoneNumberNotIncludeSelectBox2(value)) {
        return false;
    }

    /* 통과한 값은 입력칸에도 정규화해 다시 쓴다 (+82·0082 제거 + 하이픈).
       검증은 국가번호를 떼고 판정하므로 8201012341234 도 유효로 본다. 그런데 칸을
       그대로 두면 **원문이 그대로 접수되어** 영업전산에 연락 불가 번호가 저장된다.
       실시간 가드가 같은 일을 하지만 폼마다 로드 시점이 달라, 검증기 자신이 책임진다.

       호출부는 대부분 입력칸이 아니라 **폼**을 넘긴다(isValidPhoneNumber2(f.cust_tel.value, f)).
       그래서 폼을 받으면 값이 같은 입력칸을 찾아 쓴다. */
    if (typeof normalizePhoneNumber === 'function') {
        var target = null;
        if (el && el.tagName === 'INPUT') {
            target = el;
        } else if (form) {
            var cands = form.querySelectorAll('input');
            for (var i = 0; i < cands.length; i++) {
                if (cands[i].value === value) { target = cands[i]; break; }
            }
        }
        if (target) {
            var digits = normalizePhoneNumber(value);
            if (isKoreanPhoneDigits(digits)) {
                var formatted = (typeof formatKoreanPhone === 'function' && formatKoreanPhone(digits)) || digits;
                if (formatted && formatted !== target.value) target.value = formatted;
            }
        }
    }

    return true;
}
