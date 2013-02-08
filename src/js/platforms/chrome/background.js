/*global chrome:true */
// Proxy background events.

(function(L) {
    'use strict';

    $(window).one('beforeunload', function() {
        L.gvent.trigger('sys:quit');
    });

    // I can't find the memory leak so, for now, shred stuff.
    var shred = function(o) {
      for (var k in o) {
        try {
          delete o[k];
        } catch (e) {}
      }
    };

    L.gvent.on('sys:window-closed', function(win) {
      _.defer(function() {
        // Remove reference to background.
        delete win['background'];
        // Shred attached objects
        for (var k in win) {
          shred(win[k]);
        }
        // Shred window
        shred(win);
      });
    });
    L.chrome = {
      views: {},
      models: {}
    };
    L.lvent.once('models:setup', function(L) {
      L.chrome.omnibox = new L.models.FilterableNoteCollection();
      L.chrome.omniboxView = new L.chrome.views.ChromeOmniboxView({collection: L.chrome.omnibox});

      L.chrome.contextMenu = new L.chrome.ContextMenu();
    });
})(ListIt);
