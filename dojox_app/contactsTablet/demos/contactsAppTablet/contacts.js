// we use 'define' and not 'require' to workaround Dojo build system
// limitation that prevents from making of this file a layer if it
// using 'require'
define(["dojo/sniff", "dojo/json", "dojox/mobile/common",
	"dojo/text!contactsAppTablet/contacts.json", "dojox/app/main"],
	function(has, json, common, config, Application){

	 has.add("html5history", !has("ie") || has("ie") > 9);
	 has.add("phone", ((window.innerWidth ||
		 document.documentElement.clientWidth) <= common.tabletSize));
	 Application(json.parse(config));

});