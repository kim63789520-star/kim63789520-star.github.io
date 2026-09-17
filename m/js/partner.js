
function isAjaxStatusCheck() {
    if (isAjaxStatus) {
        return isAjaxStatus;
    } else {
        isAjaxStatus = true;
        return false;
    }
}
