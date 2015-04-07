define(["dojo/_base/declare", "dijit/Dialog"], function(declare, Dialog) {
	
	return declare("demo.AuthoredDialog", Dialog, {
		authorNode: null,
		authorAvatarSrc: "",
		authorName: "",
		templateString: dojo.cache("demo", "AuthoredDialogTemplate.html"),
		postMixInProperties: function() {
			this.inherited(arguments);

			if(!this.hasOwnProperty("authorName") && dojo.config.authorName) {
				this.authorName = dojo.config.authorName;
			}
			if(!this.hasOwnProperty("authorAvatarSrc") && dojo.config.authorAvatarSrc) {
				this.authorAvatarSrc = dojo.config.authorAvatarSrc;
			}
		}
	});
	
});