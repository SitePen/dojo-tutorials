---
Category:  Mobile
...

## Part 3 - FlickrView: Implementing FeedView

In the previous part, [Developing a Dojo Mobile Application](../part2),
we built the general layout template and came up with a mockup of the application. This part will focus on updating the
mockup to dynamically get data and display feeds from Flickr. You will learn how to initiate, get response and handle
error from a JSON request, use a progress indicator while waiting for the server to respond, dynamically populate a
list with ListItems, use a basic HTML template to create ListItems and format a date according to a specific locale.
Are you ready? Let's go!

### Application data structure

Our application needs to manage data to build a JSON request and to update its views with data from the JSON
response. We will use a basic data structure declare in the global scope in our HTML file. This object will:

*   contain the query parameters to build the JSON request used by the Feed view
*   be updated by user inputs from the Settings view

```js
require([
	//...
	], function (parser) {
		flickrview = {};
		flickrview.QUERY = {
			tags: "famous,bridges",
			tagmode: "all",
			format: "json",
			lang: "en-us"
		};
		//...
	});
```

That’s being done, any component is able to set and get `flickrview.QUERY`.

### FeedView properties

The Feed view will be in charge of getting and displaying a list of the most recent photos uploaded to Flickr.
We’ll need a url and some options to pass to the JSONP request in order to contact Flickr public service:

```js
// Flickr public feed URL to pull recent photo uploads from
requestUrl: "http://api.flickr.com/services/feeds/photos_public.gne",

// JSONP request options and query parameters
requestOptions: {
	jsonp: "jsoncallback",
	preventCache: true,
	timeout: 10000,
	query: null
},
```

The query parameter will be dynamically set before the JSON call. For more information on Dojo request options, you
can have a look to the [Dojo request Reference Guide](http://dojotoolkit.org/reference-guide/dojo/request/script.html).

Looking at the mockup, you'll also see that the photo list items must be specially formatted to include a photo with
its title, published time and author information. Let's create a property which will accommodate a photo feed template:

```js
// Create a template string for a photo ListItem
flickrviewItemTemplateString:
	'<img src="${photo}" width="80px" height="80px" alt="${title}" style="float:left;"/>' +
	'<div class="photoSummary">' +
		'<div class="photoTitle">${title}</div>' +
		'<div class="publishedTime">${published}</div>' +
		'<div class="author truncatedText">${author}</div>' +
	'</div><div class="summaryClear"></div>',
```

Let’s also define a companion method to substitute the template variables:

```js
substitute: function(template,obj) {
	return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(match,key){
		return obj[key];
	});
}
```

We will also keep record of the widgets references with which we will work on. Initialization will be done in the
startup method

```js
//...
refreshButton: null,
feedList: null,
feedHeading: null,
progressIndicator: null,
detailsContainer: null,
detailsHeading: null,
//...
```
### FeedView startup

Dojo widget startup method is called once, after parsing and creation of any child widgets has completed. Let's go
through it line by line:

```js
startup: function() {
	this.inherited(arguments);
```

The startup method is inherited from **dojox/mobile/ScrollableView**, which in turn is inherited from
**dijit/_WidgetBase**. This is why we call `this.inherited(arguments)`.

Startup is part of Dojo widgets lifecycle. You can find more information on Dojo widget lifecycle in
[dijit/_WidgetBase Reference Guide](http://dojotoolkit.org/reference-guide/dijit/_WidgetBase.html).

The method `byId` from **dijit/registry** is used to retrieve widgets references:

```js
// retain widgets references
this.refreshButton = registry.byId("refreshButton");
this.feedList = registry.byId("feedList");
this.feedHeading = registry.byId("feedHeading");
this.detailsContainer = registry.byId("detailsContainer");
this.detailsHeading = registry.byId("detailsHeading");
```

**ProgressIndicator** is a round spinning graphical representation which indicates that the current task is
on-going. We will show this while the user waits for the view to refresh its content:

```js
this.progressIndicator = ProgressIndicator.getInstance();
```

While it is simple to use it, you can find more information on how to use and customize the ProgressIndicator in the
[Reference Guide](http://dojotoolkit.org/reference-guide/dojox/mobile/ProgressIndicator.html).

We add a click event to the refresh button. `this.refresh` the reference to the refresh method we will define in the
next chapter. Note the use of [lang.hitch](http://dojotoolkit.org/reference-guide/dojo/_base/lang.html#hitch) method
to make sure our callback method `this.refresh` will be called in the context of the widget instance:

```js
// add click handler to the button that call refresh
this.refreshButton.on("click", lang.hitch(this, this.refresh));
```
### FeedView refresh

The refresh method is charged to get photo feed from Flickr and update the view with the result. First, we remove
any existing content from the list to show up our progress indicator:

```js
   // remove all list items
   this.feedList.destroyDescendants();
   // reset scroll to make sur progress indicator is visible
   this.scrollTo({x:0,y:0});
   // add progress indicator
   this.feedHeading.set('label',"loading...");
   this.feedList.domNode.appendChild(this.progressIndicator.domNode);
   this.progressIndicator.start();
```

Now we send a JSON request to Flickr:

```js
// request feed from Flickr
this.requestOptions.query = flickrview.QUERY;
scriptRequest.get(this.requestUrl, this.requestOptions)
	.then(lang.hitch(this, this.onFlickrResponse), lang.hitch(this, this.onFlickrError));
```

The actual work to update the list from the response is done in our 2 callback methods `onFlickrResponse`
(successful response) and `onFlickrError` (error).

You can type this request in your browser to get an oversight of the data contain in the response:
[http://api.flickr.com/services/feeds/photos_public.gne?tags=famous,bridge&lang=en-us&format=json](http://api.flickr.com/services/feeds/photos_public.gne?tags=famous,bridge&lang=en-us&format=json)

#### Handling JSON response

Successful response is handled in `onFlickrResponse`. Let's go through it line by line. First thing to do is to
stop/remove the progress indicator and update the Heading:

```js
// remove progress indicator
this.progressIndicator.stop();
this.feedList.destroyDescendants();
// restore the title
this.feedHeading.set('label','Feeds');
```

Now we can iterate through the result items:

```js
// populate the list
array.forEach(result.items, lang.hitch(this, function (resultItem)
```

For each item we create a **dojox/mobile/ListItem** and put it at the end of the list:

```js
// Create a new ListItem at the end of the list
var listItem = new ListItem({}).placeAt(this.feedList, "last");
```

We set the style and use our simple HTML template to inject the content of the ListItem:

```js
// set custom style
domClass.add(listItem.domNode, "photoListItem");
// create and insert content from template and JSON response
listItem.containerNode.innerHTML = this.substitute(this.flickrviewItemTemplateString, {
	photo: resultItem.media.m,
	title: resultItem.title,
	published: locale.format(new Date(resultItem.published), {locale:flickrview.QUERY.lang}),
	author: resultItem.author
});
```

Do not worry about the way we format the`published` attribute, we will get into this in detail later when we’ll talk
about localization.

Clicking on an Item should trigger a transition to the Details view. Before transitioning we have to update the
content of the details view. In order to do this we add a click handler on the ListItem:

```js
listItem.onClick = lang.hitch(this, function(){
	// update details view before transitioning to it
	this.detailsContainer.domNode.innerHTML = resultItem.description.replace(/href=/ig,"target=\"_blank\" href=");
	listItem.set("transition","slide");
	listItem.transitionTo("details");
});
```

Note that we inject a`target` attribute to force all links to open in a new browser tab. This is a best practice
when a link points to another site.

Because we programmatically trigger the transition, we set the `moveTo` property to **#** to tell the widget not to handle the transition.

```js
listItem.set("moveTo","#");
```

The error handling is straightforward: we stop the progress indicator, display the error message in the Heading and alert the user.

```js
FlickrError: function(error) {
	// remove progress indicator
	this.progressIndicator.stop();
	this.feedList.destroyDescendants();
	// display error message
	this.feedHeading.set('label',error);
	alert(error);
}
```

We are almost ready to test our first “working release” of the application! We just need to configure the application
for localization to format the published date.

#### Formatting the date using a specific locale

In the JSON request we specify the locale to be applied in the response data. However, the date we receive is
not formatted (it is a raw representation which looks like this: `2013-09-15T07:57:04Z`). Dojo provides a lot of features
to localize your application. Here we use one method to format the date with the same locale used to get the feed data:

```js
published: locale.format(new Date(resultItem.published), {locale:flickrview.QUERY.lang}),
```

Because we force the locale (by default, Dojo uses the browser default locale), we have to specify the list of
locales Dojo must load in the configuration (`dojoConfig` in_flickrview.html_). To do so, we use the `config` parameter
**extraLocale**:

```js
dojoConfig = {
	async: true,
	baseUrl: './',
	parseOnLoad: false,
	mblHideAddressBar: true,
	extraLocale: ["en-us", "fr-fr", "de-de", "it-it", "ko-kr", "pt-br", "es-us", "zh-hk"],
	packages: [{
		name: "flickrview",
		location: "js"
	}]
};
```

That is it! Our refresh button is working. One last thing to add in our HTML file for the application to automatically
refresh at startup:

```js
// Parse the page for widgets
parser.parse();
// refresh at startup
registry.byId("feed").refresh();
```

We are all set. FeedView now get its content from Flickr! Click on the demo link to see the result and browse the full
code. In the next part we will implement the Settings view to allow users to change the request options.

[View Demo](demo/flickrview.html)

### Download The Source

Download [Part 3 - FlickrView: Implementing FeedView](resources/DojoMobilePart3.zip).

### Resources & references

*   [Dojo Mobile Reference Guide](http://dojotoolkit.org/reference-guide/dojox/mobile.html)
*   [The Dojo Toolkit API](http://dojotoolkit.org/api)
*   [dijit/_WidgetBase](http://dojotoolkit.org/reference-guide/dijit/_WidgetBase.html) (Reference Guide)
*   [dojox/mobile ProgressIndicator](http://dojotoolkit.org/reference-guide/dojox/mobile/ProgressIndicator.html) (Reference Guide)
*   [Dojo lang.hitch](http://dojotoolkit.org/reference-guide/dojo/_base/lang.html#hitch) (Reference Guide)

### The FlickrView Series

* [Part 1 - Getting Started with Dojo Mobile](../part1/)
* [Part 2 - Developing a Dojo Mobile Application: FlickrView](../part2/)
* [Part 3 - FlickrView: Implementing FeedView](../part3/)
* [Part 4 - FlickrView: Implementing SettingsView](../part4/)
* [Part 5 - Build FlickrView for production](../part5/)