/**
 * Build profile for the Dojo Mobile "TweetView" tutorial.
 * 
 * To run the build:
 * - copy the dojo, dijit, dojox and util directories from a Dojo source distribution into this directory
 * - go to util/buildscripts
 * - run 'build.[bat|sh] profile=../../tweetview.profile.js'
 * 
 * The result of the build will be in 'tweetview-release/dojo'.
 */
var profile = {
	
	"action" : "release",
	
	"releaseDir" : "tweetview-release/dojo",
	
	"selectorEngine" : "acme",
	"stripConsole" : "normal",
	"copyTests" : false,
	"cssOptimize" : "comments.keepLines",
	"mini" : true,
	"webkitMobile" : true,
	
	localeList: "en-us",
	
	layers: {
		"dojo/dojo": {
			customBase: true,
			include: [
				"dojo/_base/declare",
				"dojo/_base/lang",
				"dojo/_base/array",
				"dojo/_base/window",
				"dojo/_base/event",
				"dojo/_base/connect",
				"dojo/_base/html",
				"dojo/io/script",
				"dojo/Deferred",
				"dojo/DeferredList",
				"dojo/i18n",
				"dojo/date",
				"dijit/_WidgetBase",
				"dijit/_base/manager",
				"dojox/mobile",
				"dojox/mobile/parser",
				"dojox/mobile/deviceTheme",
				"dojox/mobile/ScrollableView",
				"dojox/mobile/TabBar",
				"dojox/mobile/TabBarButton",
				"dojox/mobile/ToolBarButton"
			]
		},
		"tweetview/tweetview-app": {
			include: [
				"tweetview/TweetView",
				"tweetview/SettingsView"
			]
		}
	},

	staticHasFeatures: {
		"dom-addeventlistener": true,
		"dom-qsa": true,
		"json-stringify": true,
		"json-parse": true,
		"bug-for-in-skips-shadowed": false,
		"dom-matches-selector": true,
		"native-xhr": true,
		"array-extensible": true,
		"ie": undefined,
		"quirks": false,
		"webkit": true
	},

	packages: [
		{ name:"dojo", location:"dojo" },
		{ name:"dijit", location:"dijit" },
		{ name:"dojox", location:"dojox" },
		{ name:"tweetview", location:"tweetview" }
	]
};
