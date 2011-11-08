const widgets = require("widget");
const data = require("self").data;
const _ = require("l10n").get;
const tabs = require("tabs");

require("widget").Widget({
  id: 'l10n-widget',
  label: _("str_hello_world"),
  contentURL: "http://www.mozilla.org/favicon.ico",
  onClick: function() {
    
    if (typeof(tabs.activeTab._worker) == "undefined") {
      let worker = tabs.activeTab.attach({
        contentScriptFile: data.url('alertbot.js')
      });
      tabs.activeTab._worker = worker;
    }
    tabs.activeTab._worker.port.emit('alert', _("str_hello_world"));
  }
});

