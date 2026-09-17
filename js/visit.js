// 최초 방문 시 (탭 기준)
function getQueryParams(queryString) {
    const params = new URLSearchParams(queryString);

    const object = {};
    for (const [key, value] of params.entries()) {
        object[key.toLowerCase()] = value;
    }

    return object;
}

// 대용량 데이터 처리 관련 찾아보기.
function getSessionStorage(key) {

    if (key.length < 1) return false;

    if (sessionStorage.getItem(key)) {
        return JSON.parse(sessionStorage.getItem(key));
    } else {
        return {}
    }
}

function getBrowserChannel(referrerHost) {

    if (/NAVER/i.test(referrerHost)) {
        if (/BLOG/i.test(referrerHost)) {
            return "NAVER.BLOG";
        } else if (/SHOPPING/i.test(referrerHost)) {
            return "NAVER.SHOPPING";
        } else {
            return "NAVER";
        }
    } else if (/GOOGLE/i.test(referrerHost)) {
        return "GOOGLE";
    } else if (/DAUM/i.test(referrerHost)) {
        return "DAUM";
    } else if (/TISTORY/i.test(referrerHost)) {
        return "TISTORY";
    } else if (/FACEBOOK|INSTAGRAM/i.test(referrerHost)) {
        return "META";   // FACEBOOK·INSTAGRAM 통합(Meta)
    } else if (/NATE/i.test(referrerHost)) {
        return "NATE";
    } else {
        return "ETC";
    }
}

function getInAppChannel(userAgent) {

    if (/KAKAOTALK/i.test(userAgent)) {
        return "KAKAOTALK";
    } else if (/INSTAGRAM|FACEBOOK|FBAV|FBAN/i.test(userAgent)) {
        return "META";   // FACEBOOK·INSTAGRAM 인앱 통합(Meta)
    } else if (/LINE/i.test(userAgent)) {
        return "LINE";
    } else if (/NATE/i.test(userAgent)) {
        return "NATE";
    } else if (/TELEGRAM/i.test(userAgent)) {
        return "TELEGRAM";
    } else if (/TIKTOK/i.test(userAgent)) {
        return "TIKTOK";
    } else {
        return "ETC";
    }
}

function getInAppChannelAd(entryParams) {
    let inAppChannel = "";

    // 네이버 광고 파라미터 — AdvertisementRegex 와 동기화(media 포함). n_media 만 있어도 NAVER.AD 로 분류
    if (/n_(keyword|campaign|ad|rank|media)/i.test(entryParams)) {
        inAppChannel = "NAVER.AD";
    // utm_source 값 경계(& 또는 끝) 적용 — utm_source=xmas 가 TWITTER.AD 로 오탐되던 문제 제거
    } else if (/utm_source=google(&|$)/i.test(entryParams)) {
        inAppChannel = "GOOGLE.AD";
    // Meta 광고 — utm_source=meta(신규 표준)·facebook·fb·instagram·ig 통합 → META.AD
    } else if (/utm_source=(meta|facebook|fb|instagram|ig)(&|$)/i.test(entryParams)) {
        inAppChannel = "META.AD";
    } else if (/utm_source=(twitter|x)(&|$)/i.test(entryParams)) {
        inAppChannel = "TWITTER.AD";
    } else if (/utm_source=tiktok(&|$)/i.test(entryParams)) {
        inAppChannel = "TIKTOK.AD";
    } else {
        // utm_medium 만 있거나 매칭 안 되는 광고 → 플랫폼 식별 불가로 ETC.AD 유지
        inAppChannel = "ETC.AD";
    }
    return inAppChannel;
}

if (!sessionStorage.getItem("visit_info")) {

    const deviceRegex = /MOBILE|IP(HONE|OD)|ANDROID|BLACKBERRY|IEMOBILE|SILK|Opera Mini|Windows Phone/i;
    const inAppRegex = /KAKAOTALK|INSTAGRAM|FACEBOOK|FBAV|FBAN|LINE|NATE|TELEGRAM|TIKTOK|DaumApps/i;
    const AdvertisementRegex = /(utm_source|utm_medium|n_(keyword|campaign|ad|rank|media))/i;
    const userAgent = navigator.userAgent.toUpperCase();

    // 잘못된 % 시퀀스가 포함된 referrer 에서 decodeURIComponent 가 URIError 를 던지면
    // visit_info 가 통째로 미수집되므로, 실패 시 원본 referrer 로 폴백한다.
    let referrerOrigin;
    try {
        referrerOrigin = decodeURIComponent(document.referrer) || "";
    } catch (e) {
        referrerOrigin = document.referrer || "";
    }
    const referrer = referrerOrigin.split("?");
    const referrerHost = referrer[0] || "";
    let referrerParams = referrer[1] || ""; // undefined 시 빈 문자열로 반환
    const entryParams = window.location.search.toLowerCase();
    const inflowDevice = deviceRegex.test(userAgent) ? "MOBILE" : "DESKTOP";
    const isInApp =  inAppRegex.test(userAgent) ? "Y" : "N" // 인앱 유무
    let inAppChannel = (isInApp === "Y") ? getInAppChannel(userAgent) : getBrowserChannel(referrerHost);
    const isAdvertisement = AdvertisementRegex.test(entryParams) ? "Y" : "N"; // 광고 유무
    let paramsObject = getQueryParams(referrerParams);
    let referrerKeyword = paramsObject["query"]
        || paramsObject["q"]
        || paramsObject["search"]
        || paramsObject["s"]
        || paramsObject["keyword"]
        || "";

    /* 광고일 경우 */
    if (isAdvertisement === "Y") {
        inAppChannel = getInAppChannelAd(entryParams);
        referrerParams = window.location.search;
        paramsObject = getQueryParams(referrerParams);
        referrerKeyword = paramsObject["n_keyword"]      // 네이버
            || paramsObject["utm_term"]    // 구글/메타
            || paramsObject["keyword"]     // 기타
            || "";
    }

    // 파라미터 분리
    const data = {
        "originalReferrer": document.referrer,
        "inflowDevice": inflowDevice,
        "inflowReferrer": referrerOrigin,
        "inflowReferrerHost": referrerHost,
        "inflowReferrerParams": referrerParams,
        "inflowIsAdvertisement": isAdvertisement,
        "inflowIsInApp": isInApp,
        "inflowInAppChannel": inAppChannel,
        "inflowParamsObject": paramsObject,
        "inflowReferrerKeyword": referrerKeyword,
    }

    sessionStorage.setItem("visit_info", JSON.stringify(data));
}

/* ── 유입 어트리뷰션 전송 헬퍼 (request_quick / request_order 전환 폼용) ──
 * visit_info(세션) 8필드를 전송 방식별로 실어준다. 세션키 inflowIsInApp → POST키 inflowInApp 변환을 여기 1곳에 집약한다.
 * getSessionStorage 는 미설정 시 {} 를 돌려주므로, 항상 세팅되는 inflowDevice 로 유효 세션 여부를 판정한다.
 * 세션이 없거나 유효하지 않으면 null / '' / [] 을 반환 → 호출부는 필드를 붙이지 않는다(정본 fallback). */
function brgInflowObject() {
    var d = getSessionStorage('visit_info');
    if (!d || typeof d !== 'object' || !d.inflowDevice) return null;
    return {
        inflowDevice:          d.inflowDevice,
        inflowReferrer:        d.inflowReferrer,
        inflowReferrerHost:    d.inflowReferrerHost,
        inflowReferrerParams:  d.inflowReferrerParams,
        inflowReferrerKeyword: d.inflowReferrerKeyword,
        inflowIsAdvertisement: d.inflowIsAdvertisement,
        inflowInApp:           d.inflowIsInApp,   // 세션키 inflowIsInApp → POST키 inflowInApp
        inflowInAppChannel:    d.inflowInAppChannel
    };
}

// urlencoded 방식(serialize / ReqParameters 배열)용 — ["k=v", ...] (값 인코딩). 세션 없으면 [].
function brgInflowParamArray() {
    var o = brgInflowObject();
    if (!o) return [];
    return Object.keys(o).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(o[k] == null ? '' : o[k]);
    });
}

// serialize() 방식용 — "k=v&k=v" 조각 반환(앞에 & 없음, 호출부에서 '&'로 결합). 세션 없으면 ''.
function brgInflowQueryString() {
    return brgInflowParamArray().join('&');
}
