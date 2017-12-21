// full screen methods

function requestFullScreen(element) {  // call this function with e.g. document.body
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

function cancelFullScreen() {
    var cancelMethod = document.exitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen;

    if (cancelMethod) {
        cancelMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") {  // Older IE
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}
