// full screen methods

function requestFullScreen(element) {
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {  // Older IE
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function cancelFullScreen(element) {
    var cancelMethod = element.exitFullscreen || element.webkitCancelFullScreen || element.mozCancelFullScreen || element.msExitFullscreen;

    if (cancelMethod) {
        cancelMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {  // Older IE
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}
