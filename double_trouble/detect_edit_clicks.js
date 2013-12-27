$('body').on('click', '#editPageLink', function(event) {
    /*
     * Send edit event to background.
     */
    chrome.runtime.sendMessage({edit: "edit-start"});
});

$('body').on('click', '#rte-button-publish', function(event) {
    /*
     * Send edit event to background.
     */
    chrome.runtime.sendMessage({edit: "edit-publish"});

});

$('body').on('click', '#rte-button-cancel', function(event) {
    /*
     * Send edit event to background.
     */
    chrome.runtime.sendMessage({edit: "edit-cancel"});
});

window.onbeforeunload(function(event) {
    /*
     * Send unload event to background.
     */
    chrome.runtime.sendMessage({edit: "edit-unload"});
});


