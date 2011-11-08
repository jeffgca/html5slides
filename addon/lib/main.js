const widgets = require("widget");
const data = require("self").data;
const _ = require("l10n").get;
const tabs = require("tabs");

tabs.on('ready', function(tab) {
  var worker = tab.attach({
    contentScriptFile: data.url('alertbot.js')
  });
  
  console.log(_("str_hello_world"));
});
