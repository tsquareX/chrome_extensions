
var edit_database = {};

function db_delete_entry(tab_id) {
    for(k in edit_database) {
        var i = edit_database[k].indexOf(tab_id);
        if(i >= 0) {
            edit_database[k].splice(i,1);
        }

        if(edit_database[k].length == 0) {
            delete edit_database[k];
        }
    }
}

/**
 * Sends an alert to the user.  Right now this is just a modal dialog in order to
 * maximize annoyance. 
 *
 * TODO: Maybe have a nice dropdown or overlay for this on each tab being editted.
 *
 * @param tab The tab object being editted.
 */
function send_alert(tab) {
    console.log('Confluence page "' + tab.title + '" already being editted!');
    window.alert('Confluence page "' + tab.title + '" already being editted!');
}

/**
 * Helper function to print the edit database.  Useful for diagnostic only.
 */
function print_db() {
    var i=0;

    for(k in edit_database) {
        console.log('[' + i + '] ' + k + ' : ' + edit_database[k]);
        ++i;
    }
}

/**
 * Adds a message listener that listens for events sent from the content watcher.
 * If  confluence edit session is detected a reference to the tab ID editting it is
 * added to the database.  Once publish/cancel is complete, the modal reference is deleted.
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        /*
         * Handle edit start
         */
        if(request.edit == "edit-start") {
            if(! edit_database[sender.tab.title]) {
                /*
                 * Start new edit session.
                 */
                edit_database[sender.tab.title] = new Array();
                edit_database[sender.tab.title].push(sender.tab.id);
            } else {
                /*
                 * Pre-existing edit session detected.  
                 * Add the current tab to the list and send warning alert to
                 * both tabs being editted.
                 */
                edit_database[sender.tab.title].push(sender.tab.id);
                send_alert(sender.tab);
            }
        /*
         * Handle edit end.
         */
        } else if(request.edit == "edit-cancel" || 
                  request.edit == "edit-publish" || 
                  request.edit == "edit-unload") {

            var exit_id = sender.tab.id;

            db_delete_entry(sender.tab.id);

            print_db();

        } else {
            console.log("Unhandled edit request. " + request.edit);
        }
});

/**
 * Add listener to watch for tab closure, and cleanup if needed.
 */
chrome.tabs.onRemoved.addListener(
    /*
     * Delete entry on tab closure if we need to.  If not,
     * this is a no-op.
     */
    function(tabId, removeInfo) {
        db_delete_entry(tabId);
    }
);
