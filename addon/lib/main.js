var data = require("self").data;

var workers = [];
/* Ensure our worker is detached when the tab is closed. */
function detachWorker(worker, workerArray) {
  var index = workerArray.indexOf(worker);
  if(index != -1) {
    workerArray.splice(index, 1);
  }
}

var tabs = require("tabs");

/* 

TODO:
* Request? URL Shortener?
* log bug for panel scrolling...
* do something visible on context menu click.
*/

var shorten = function(url, callback) {    
    let requestJSON = JSON.stringify({longUrl: url});
    let googlRequest = require("request").Request({
        url: 'https://www.googleapis.com/urlshortener/v1/url',
        content: requestJSON,
        contentType: 'application/json',
        onComplete: function(response) {
          callback(response.json);
        }
    });
    googlRequest.post();
}

var xPanel = require("panel").Panel({
    height: 340,
    width: 600,
    contentURL: 'http://www.reddit.com/r/programming/.compact'
});

var mod = require("page-mod").PageMod({
  include: ['http://aer.local:8080/fsoss*', 'http://talks.canuckistani.ca/fsoss*'],
  contentScriptFile: [data.url("jquery.min.js"), data.url('pagemod.js')],
  onAttach: function(worker) {
    workers.push(worker);
    worker.on('detach', function () {
      detachWorker(this, workers);
    });

    /*  make a request */
    worker.port.on('requestify', function(m) {
      shorten(tabs.activeTab.url, function(json) {
        worker.port.emit('alert', 'before: ' + tabs.activeTab.url + "\nafter: "+json.id);
      });
    });
    
    /* pop up the panel */
    worker.port.on('panelify', function(m) {
      xPanel.show();
    });
    
    /* do a notification */
    worker.port.on('notify', function(m) {
      require("notifications").notify({
        title:  "hello from Growl!",
        text:   "of course, you need Growl installed for this to work...",
        iconUrl: "http://www.mozilla.org/favicon.ico"
      });
    });
  }
});

require("widget").Widget({
    id: "mozilla-icon",
    label: "This is the widget demo!",
    contentURL: "http://www.mozilla.org/favicon.ico",
    panel: xPanel
});

var cm = require("context-menu");

cm.Item({
  label: "Context Menu Test",
  context: cm.URLContext('http://aer.local:8080/fsoss*'),
  contentScript: 'self.on("click", function (node, data) {' +
                 '  alert("Click on context menu!"); ' +
                 '});',
  onMessage: function() {
    tabs.activeTab
  }
});
