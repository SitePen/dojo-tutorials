// Define the resource
define(["dojo/_base/declare", "dojo/_base/window", "dojo/dom-class"], function(declare, win, domClass) {
	
	// Return the declared resource
	return declare("tweetview._viewMixin", null, {
		// Returns this pane's list
		getListNode: function() {
			return this.getElements("tweetviewList", this.domNode)[0];
		},
		// Updates the list widget's state
		showListNode: function(show) {
			domClass[(show ? "remove" : "add")](this.listNode, "tweetviewHidden");
		},
		// Pushes data into a template - primitive
		substitute: function(template,obj) {
			return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(match,key){
				return obj[key];
			});
		},
		// Get elements by CSS class name
		getElements: function(cssClass,rootNode) {
			return (rootNode || win.body()).getElementsByClassName(cssClass);
		}
	});
	
});