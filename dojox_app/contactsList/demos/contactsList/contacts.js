define(["dojo/json", "dojo/text!contactsList/contacts.json",
	"dojox/app/main"],
	function(json, config, Application){
		Application(json.parse(config));
});