'use strict';

function signin() {
    $('#user-id').removeClass('is-invalid');
    userId = $('#user-id').val();
    gender = $("input[name='gender']:checked").val();
    if (userId != 'short' && (!userId.startsWith('ucla') || isNaN(userId.substring(4)))) {
        // error checking
        $('#user-id').addClass('is-invalid');
        return;
    }
    $('#info').hide();
    $('#instr').show();
    get_browser();
}

function checkbox_onchange() {
    var agree2all = $('.agreement:checked').length == 2;
    if (agree2all) {
        $('#agree-next').removeClass('disabled');
    } else {
        $('#agree-next').addClass('disabled');
    }
}

function key_input_onchange(item) {
    var jqueryItem = $('#' + item.id);
    var userInput = jqueryItem.val().trim();
    if ( (item.id == 'positive-key' && (userInput == 'k' || userInput == 'K')) ||
         (item.id == 'negative-key' && (userInput == 'd' || userInput == 'D')) ) {
        // correct
        jqueryItem.removeClass('is-invalid');
        jqueryItem.addClass('is-valid');
    } else {
        // incorrect
        jqueryItem.removeClass('is-valid');
        jqueryItem.addClass('is-invalid');
        jqueryItem.addClass('disabled');
    }
    if ($('#negative-key').hasClass('is-valid') && $('#positive-key').hasClass('is-valid')) {
        $('#key-next').removeClass('disabled');
    } else {
        $('#key-next').addClass('disabled');
    }
}

// page flipping
$('#sound-ok').click(function() {
    $('#safari-sound').hide();
    $('#page-1').show();
}

$('.next').click(function() {
    if ($(this).hasClass('disabled')) {
        return;
    }
    instrPages[currentPage].hide();
    ++currentPage;
    if (currentPage == instrPages.length) {
        // start experiment
        var expPage = 'experiment.html?id=' + userId + '&g=' + gender;
        if (environment) {
            expPage += '&b=' + encodeURIComponent(environment.browser) +
                       '&os=' + encodeURIComponent(environment.os);
        }
        window.location.href = expPage;
    } else {
        instrPages[currentPage].show();
    }
});

$('.prev').click(function() {
    if ($(this).hasClass('disabled')) {
        return;
    }
    instrPages[currentPage].hide();
    --currentPage;
    instrPages[currentPage].show();
});

// browser detection
function get_browser() {
    var iframe = document.getElementById('whichbrowser');
    var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    if (iframeDocument) {
        var iframeContent = iframeDocument.getElementById('container');
        var text = $(iframeContent).html();
        var env = text.split(/<br>/)[0].substring(14).split(/ on /)
        environment = {
            browser: env[0],
            os: env[1],
            browser_ver: env[0].match(/[.\d]+/)[0]
        };
        console.log(environment);
        if (environment.browser.search(/safari/i) != -1) {  // safari
            if (parseFloat(environment.browser_ver) < 11) {
                $('#incompatible').show()
            } else {
                $('#safari-sound').show();
            }
            $('#page-1').hide();
        } else if (environment.browser.search(/chrome/i) == -1) {
            // not safari or chrome
            $('#incompatible').show();
            $('#page-1').hide();
        }
    }
}

$.getJSON("https://allorigins.me/get?url=https://whichbrowser.net/", function(data) {
    var iframe = $("#whichbrowser")[0];
    var doc = iframe.document;
    if(iframe.contentDocument) {
        doc = iframe.contentDocument;
    } else if(iframe.contentWindow) {
        doc = iframe.contentWindow.document;
    }
    doc.open();
    doc.writeln(data.contents);
    doc.close();
});

// variables
var userId, gender;
var instrPages = [$('#page-1'), $('#page-2'), $('#page-3')];
var currentPage = 0;
var environment = null;
