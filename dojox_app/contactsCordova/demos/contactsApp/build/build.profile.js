require(["dojox/app/build/buildControlApp"], function(){
});

var profile = {
	// relative to this file
	basePath: "../..",
	// relative to base path
	releaseDir: "./contactsApp-release",
	action: "release",
	cssOptimize: "comments",
	mini: true,
	packages:[{
		name: "dojo",
		location: "{path-to-dojo}/dojo"
	},{
		name: "dijit",
		location: "{path-to-dijit}/dijit"
	},{
		name: "contactsApp",
		location: "./contactsApp"
	},{
		name: "dojox",
		location: "{path-to-dojox}/dojox"
	}],
	selectorEngine: "acme",
	layers: {
		"dojo/dojo": {
			boot: true,
			customBase: true
		},
		"contactsApp/contacts": {
			include: ["contactsApp/contacts"]
		}
	}
};



