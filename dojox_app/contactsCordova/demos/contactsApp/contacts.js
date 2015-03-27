// we use 'define' and not 'require' to workaround Dojo build system
// limitation that prevents from making of this file a layer if it
// using 'require'
define(["dojo/sniff", "dojo/request", "dojo/json", "dojox/mobile/common",
	"dojo/text!contactsApp/contacts.json", "dojox/app/main"],
	function(has, request, json, common, config, Application){

	// trick to know if cordova optional project is here or not
	var init = function(){
		// populate has flag on whether html5 history is correctly supported or not
	 	has.add("html5history", !has("ie") || has("ie") > 9);
	 	has.add("phone", ((window.innerWidth ||
		 	document.documentElement.clientWidth) <= common.tabletSize));
	 	Application(json.parse(config));
	};
	// check if cordova project's here
	request("../dcordova/sniff.js").then(function(){
		// cordova project is here, sniff cordova features and load the app
		require(["dcordova/sniff"], function(){
			init();
		});
	}, function(){
		// cordova project is not here, directly load the app
		init();
	});
});