// Dojo Mobile tutorial | Flickrview | Part IV
define([
	"dojo/_base/declare",
	"dojox/mobile/ScrollableView",
	"dijit/registry",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/date/locale",
	"dojo/dom-class",
	"dojox/mobile/ProgressIndicator",
	"dojo/request/script",
	"dojox/mobile/ListItem"
], function(declare, ScrollableView, registry, lang, array, locale, domClass, ProgressIndicator, scriptRequest, ListItem){
	return declare([ScrollableView], {
		refreshButton: null,
		feedList: null,
		feedHeading: null,
		progressIndicator: null,
		detailsContainer:null,
		detailsHeading:null,
		// Create a template string for a photo ListItem
		flickrviewItemTemplateString:
			'<img src="${photo}" width="80px" height="80px" alt="${title}" style="float:left;"/>' +
			'<div class="photoSummary">' +
				'<div class="photoTitle">${title}</div>' +
				'<div class="publishedTime">${published}</div>' +
				'<div class="author troncatedText">${author}</div>' +
			'</div><div class="summaryClear"></div>',
		// Flickr public feed URL to pull recent photo uploads from
		requestUrl: "http://api.flickr.com/services/feeds/photos_public.gne",
		// JSONP request options and query parameters
		requestOptions: {
			jsonp: "jsoncallback",
			preventCache: true,
			timeout: 10000,
			query: null
		},
		// init variables and handlers
		startup: function() {
			this.inherited(arguments);
			// retain widgets references
			this.refreshButton = registry.byId("refreshButton");
			this.feedList = registry.byId("feedList");
			this.feedHeading = registry.byId("feedHeading");
			this.detailsContainer = registry.byId("detailsContainer");
			this.detailsHeading = registry.byId("detailsHeading");
			this.progressIndicator = ProgressIndicator.getInstance();
			// add click handler to the button that call refresh
			this.refreshButton.on("click", lang.hitch(this, this.refresh) );
		},
		// refresh view with content from Flickr
		refresh: function() {
			// remove all list items
			this.feedList.destroyDescendants();
			// reset scroll to make sur progress indicator is visible
			this.scrollTo({x:0,y:0});
			// add progress indicator
			this.feedHeading.set('label',"loading...");
			this.feedList.domNode.appendChild(this.progressIndicator.domNode);
			this.progressIndicator.start();
			// request feed from Flickr
			this.requestOptions.query = flickrview.QUERY;
			scriptRequest.get(this.requestUrl, this.requestOptions).then(lang.hitch(this, this.onFlickrResponse), lang.hitch(this, this.onFlickrError));
		},
		// error handler
		onFlickrError: function(error) {
			// remove progress indicator
			this.progressIndicator.stop();
			this.feedList.destroyDescendants();
			// display error message
			this.feedHeading.set('label',error);
			alert(error);
		},
		//  response handler
		onFlickrResponse: function(result) {
			// remove progress indicator
			this.progressIndicator.stop();
			this.feedList.destroyDescendants();
			// restore the title
			this.feedHeading.set('label','Feed');
			// populate the list
			array.forEach(result.items, lang.hitch(this, function (resultItem) {
				// Create a new ListItem at the end of the list
				var listItem = new ListItem({}).placeAt(this.feedList, "last");
				// set custom style
				domClass.add(listItem.domNode, "photoListItem");
				// create and insert content from template and JSON response
				listItem.containerNode.innerHTML = this.substitute(this.flickrviewItemTemplateString, {
					photo: resultItem.media.m,
					title: resultItem.title,
					published: locale.format(new Date(resultItem.published), {locale:flickrview.QUERY.lang}),
					author: resultItem.author
				});
				listItem.onClick = lang.hitch(this, function(){
					// update details view before transitioning to it
					this.detailsContainer.domNode.innerHTML = resultItem.description.replace(/href=/ig,"target=\"_blank\" href=");
					listItem.set("transition","slide");
					listItem.transitionTo("details");
				});
				listItem.set("moveTo","#");
			}));
		},
		// Pushes data into a template - primitive
		substitute: function(template,obj) {
			return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(match,key){
				return obj[key];
			});
		}
	});
});