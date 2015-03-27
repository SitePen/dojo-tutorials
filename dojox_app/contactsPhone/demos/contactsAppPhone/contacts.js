// we use 'define' and not 'require' to workaround Dojo build system
// limitation that prevents from making of this file a layer if it
// using 'require'
define(["dojo/sniff", "dojo/json",
	"dojo/text!contactsAppPhone/contacts.json", "dojox/app/main"],
	function(has, json, config, Application){

	 has.add("html5history", !has("ie") || has("ie") > 9);
	 Application(json.parse(config));

});