var profile = {

	"basePath": "./",
	"action": "release",
	"releaseDir": "../release/js",

	"selectorEngine": "acme",
	"stripConsole": "normal",
	"copyTests": false,
	"cssOptimize": "comments.keepLines",
	"mini": true,
	"optimize": "closure",
	"layerOptimize": "closure",

	"localeList": "en-us",

	layers: {
		"dojo/dojo": {
			customBase: true,
			includeLocales: ["en-us"],
			include: [
				"dojox/mobile/parser",
				"dijit/registry",
				"dojox/mobile/compat",
				"dojox/mobile/ScrollableView",
				"dojox/mobile/ListItem",
				"dojox/mobile/FormLayout",
				"dojox/mobile/TextBox",
				"dojox/mobile/RadioButton",
				"dojox/mobile/Heading",
				"dojox/mobile/EdgeToEdgeList",
				"dojox/mobile/RoundRect",
				"dojox/mobile/Switch",
				"dojo/cldr/nls/de/gregorian",
				"dojo/cldr/nls/fr/gregorian",
				"dojo/cldr/nls/it/gregorian",
				"dojo/cldr/nls/ko/gregorian",
				"dojo/cldr/nls/pt/gregorian",
				"dojo/cldr/nls/es/gregorian",
				"dojo/cldr/nls/zh/gregorian",
				"dojo/cldr/nls/zh-hk/gregorian",
				"flickrview/FeedView",
				"flickrview/SettingsView"
			]
		}
	},

	staticHasFeatures: {
		"dom-addeventlistener": 1,
		"dom-qsa": 1,
		"json-stringify": 1,
		"json-parse": 1,
		"bug-for-in-skips-shadowed": 0,
		"dom-matches-selector": 1,
		"native-xhr": 1,
		"array-extensible": 1,
		"ie": undefined,
		"dijit-legacy-requires": 0,
		"dom-quirks": 0,
		"quirks": 0,
		"dojo-sync-loader": 0,
		"ie-event-behavior": 0,
		"dojo-guarantee-console": 0,
		"dojo-log-api":0
	},

	packages: [
		{ name: "dojo", location: "dojo" },
		{ name: "dijit", location: "dijit" },
		{ name: "dojox", location: "dojox" },
		{ name: "flickrview", location: "flickrview" }
	]
};
