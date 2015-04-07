define(["dojo/_base/declare", "dijit/Dialog"], function(declare, Dialog) {
	
	alert("HERE");
	
	if(demo.logSequenceEntry) {
		demo.logSequenceEntry("demo.SpyDialog module loaded");
	}
	
	return declare("demo.SpyDialog", Dialog, {
		startup: function() {
			this.inherited(arguments);
			if(demo.logSequenceEntry) {
				demo.logSequenceEntry("demo.SpyDialog widget created");
			}
		}
	});
	
	
});