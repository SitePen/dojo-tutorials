## Getting Started with TweetView:  Tweets and Mentions

In the previous post, [Introduction to TweetView](/documentation/tutorials/1.10/mobile/tweetview/intro_tweetview/), we introduced the mobile application we will be building with `dojox/mobile`: TweetView. We built the general layout template for our application and now it's time to make TweetView work. This tutorial will focus specifically on the "Tweets" and "Mentions" views of our application. Before we begin coding our application, let's set up our application file structure and review a few mobile app development concepts.

### Setting Up the Project File Structure

![TweetView File Structure](../app/images/StartFileStructure.png)

TweetView will use the same project structure used for most Dojo-powered projects: the application HTML at the root level and TweetView's various JavaScript classes, imagery, and stylesheets living in our namespaced-named directory within the js and resources directories respectively.

<!-- protip -->
> TweetView uses very few custom images to cut down on download time. To make image resources as small as possible, use a utility like [Pngcrush](http://pmt.sourceforge.net/pngcrush/) to optimally compress each image. The CSS file can be compressed during the Dojo build process.

### Before We Start Coding: Mobile Development Guidelines

Hold up! Before we jet off into coding TweetView, there are a few things we need to remember about `dojox/mobile` and mobile web development in general:

*   **Size Matters**
    Every byte counts when it comes to creating mobile applications, so taking shortcuts you wouldn't otherwise take in a standard web app is acceptable. Remember that every dependency (in the form of Dojo classes, base or otherwise) you add increases download time to your users.
*   **Best Practices: Mobile != Web**
    JavaScript - and any JavaScript toolkit - dictates certain best practices. A few examples include not extending natives, not using global variables, and creating very flexible/generic classes. These best practices can cost you lots of extra code, so you may have to loosen your rules to create an efficient mobile app.
*   **Keep It Simple**
    Creating an overly complex mobile application with a million custom styles and widgets and layouts will get you in trouble quickly. Creating a simple layout, then adding to it, is the optimal way to code mobile web applications.

<!-- protip -->
> We **will not** be throwing all best practices out the door with TweetView. We will, however, find a solid balance of size savings vs. strict Dojo best practices.

With these ideas in mind, there's one last pre-code task to complete: preventing caching.

### Mobile Devices and Caching

Most mobile devices rely heavily on caching to ease the burden of data transfer. That's great for production apps but we're in the initial development phase so caching will be nothing short of frustrating when testing the application. Let's add a few cache-preventing META tags to our HTML page before developing the Settings view:

```html
<!-- prevent cache -->
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="pragma" content="no-cache">
```

These META tags will be hugely helpful during development. They will need to be removed once TweetView goes into production.

### The Tweets and Mentions View

[![Tweets View](../app/images/TweetsSmall.jpg)](../app/images/Tweets.jpg)

The "Tweets" and "Mentions" views are the most complex of the three views. They are very similar in look and functionality, so we'll focus on creating one class that accommodates both uses. In looking at the mockup, we know we'll need the following widgets:

*   `dojox/mobile/ScrollableView` - The entire view itself
*   `dojox/mobile/Heading` - The main "Tweets" heading
*   `dojox/mobile/RoundRectList` - The account list holder
*   `dojox/mobile/ListItem` - The account list items

The mockup also makes clear that we'll be interacting with Twitter to get user information (avatars, tweets, times, etc.), so we'll need a few more Dojo resources:

*   `dojo/io/script` - JSONP solution to get information from Twitter
*   `dojo/DeferredList` - Allows handling of multiple Twitter requests once all information is received

The bottom bar was added and completed in [the previous tutorial](../intro_tweetview/).

### Developing TweetView

Ready to get your hands dirty? Great! Let's develop one piece at a time.

#### Adding Resources to the Page

We'll need to add our stylesheet, TweetView.css, to the app.html page:

```html
<link href="js/tweetview/resources/TweetView.css" rel="stylesheet" />
```

This stylesheet will contain every style used within the entire app — not just the Tweets view.

#### The Tweets and Mentions View Templates

We created the basic Tweets and Mentions template view in [the previous tutorial](../intro_tweetview):

```html
<!-- tweets view -->
<div id="tweets" data-dojo-type="dojox.mobile.ScrollableView" data-dojo-props="selected: true">
    <h1 data-dojo-type="dojox.mobile.Heading" data-dojo-props="fixed: 'top'">
        <!-- the refresh button -->
        <div data-dojo-type="dojox.mobile.ToolBarButton" class="mblDomButton tweetviewRefresh"
                    style="float:right;" data-dojo-props="icon:'images/refresh.png'" ></div>
        Tweets
    </h1>
    <ul data-dojo-type="dojox.mobile.RoundRectList">
        <li data-dojo-type="dojox.mobile.ListItem">
            Tweet item here
        </li>
    </ul>
</div>

<!-- mentions view -->
<div id="mentions" data-dojo-type="dojox.mobile.ScrollableView">
    <h1 data-dojo-type="dojox.mobile.Heading" data-dojo-props="fixed: 'top'">
        <!-- the refresh button -->
        <div data-dojo-type="dojox.mobile.ToolBarButton" class="mblDomButton tweetviewRefresh"
                    style="float:right;" data-dojo-props="icon:'images/refresh.png'"></div>
        Mentions
    </h1>
    <ul data-dojo-type="dojox.mobile.RoundRectList">
        <li data-dojo-type="dojox.mobile.ListItem">
            Mention tweet item here
        </li>
    </ul>
</div>
```

This template will need to be updated once our new widget is complete, but we'll keep this HTML layout in mind when creating the Tweets and Mentions view JavaScript.

#### New Class: tweetview._ViewMixin

When looking at all three views (Tweets, Mentions, and Settings), it's apparent that each view will need access to the `dojox/mobile/RoundRectList` widget's `domNode`. To avoid duplicate code across each view class we create, I've created `_ViewMixin` which will provide a method for gaining a reference to that list node and subsequently allow us to show and hide it at will. `_ViewMixin` also features a substitute method, which acts as a very primitive templating system, and a `getElements` method to retrieve elements by CSS class name.

```js
// Define the resource
define(["dojo/_base/declare", "dojo/_base/window", "dojo/dom-class"],
	function(declare, win, domClass) {

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
				return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(match, key){
					return obj[key];
				});
			},
			// Get elements by CSS class name
			getElements: function(cssClass,rootNode) {
				return (rootNode || win.body()).getElementsByClassName(cssClass);
			}
		});
});
```

These methods will come in handy along the entire course of the project.

<!-- protip -->
> Take a moment to [look at each mockup](../intro_tweetview/) and you'll see the need for shared list widget access, templating, and header movement amongst each view. Don't fear if you don't see the uses for the `_ViewMixin` methods yet — we'll rehash them when creating each view.

Also note that `getElements` acts as an alternative to `dojo/query`. The `dojo/query` resource is a large piece of code and we simply need to access classes by className, so avoiding `dojo/query` as a dependency will boost our application's loading time.

#### New Class: tweetview.TweetView

Since the Tweets and Mentions views are going to be very specific in content, we're going to create a new class called `tweetview.TweetView`. This class will extend from `ScrollableView` and `_ViewMixin`, and will "oversee" all functionality and content within the view itself:

```js
// Include basic Dojo, mobile, XHR dependencies along with
define(["dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/i18n", "dojo/dom-class",
             "dojo/dom-attr", "dojox/mobile/ScrollableView", "dojox/mobile/ListItem", "dojo/DeferredList",
             "dojo/io/script", "tweetview/_ViewMixin", "dijit/registry"],
	function(declare, arrayUtil, lang, i18n, domClass, domAttr, ScrollableView, ListItem, DeferredList,
	               ioScript, _ViewMixin, registry) {
		// Return the declared class!
		return declare("tweetview.TweetView", [ScrollableView, _ViewMixin], {

			// Options and methods will go here...

		});
	}
);
```

The additional dependencies we identified in the "The Tweets and Mentions View" section above have been required within the new class. We've also required localization classes so that our time labels (i.e. "hour", "minute", "day") will display the proper verbiage.

#### TweetView Properties

With the TweetView class created, and its use for both Tweets and Mentions, we must now think of what's different between the two, and create class properties from them. Right away, we know that the URL format for retrieving tweets and mentions will be different, so that must become a class property. We'll use the tweet format as the default:

```js
// URL to pull tweets from; simple template included
serviceUrl: "http://twitter.com/statuses/user_timeline/${account}.json?since_id=${since_id}",
```

<!-- protip -->
> Note the `${account}` and `${since_id}` snippets in the `serviceUrl`. Remember `_ViewMixin` we created above? The URL will go through our substitute method each time a user's information is requested.

Looking at the mockup, you'll also see that the tweet list items must be specially formatted to include the user's name, avatar, tweet text, and time since the tweet was posted. Let's create a property which will accommodate a tweet template:

```js
// Create a template string for tweets:
tweetTemplateString: '<img src="${avatar}" alt="${name}" class="tweetviewAvatar" />' +
'<div class="tweetviewTime" data-dojo-time="${created_at}">${time}</div>' +
'<div class="tweetviewContent"> ' +
'<div class="tweetviewUser">${user}</div>' +
'<div class="tweetviewText">${text}</div>' +
'</div><div class="tweetviewClear"></div>',
```

The last custom property we'll need is the path to the "refresh" GIF which will spin when tweets are being requested:

```js
// Icon for loading...
iconLoading: require.toUrl("tweetview/resources/images/loading.gif"),
```

<!-- protip -->
> By using `require.toUrl`, we avoided a hardcoded path. This approach allows for greater flexibility when referencing in any resources — you can't always assume that you know where your module's code will be source from!

Now that we have our class and options defined, we have to update our HTML template to use the new `TweetView` class and provide any custom options for the specific view.

#### Implementing TweetView

As is the case when using any Dijit widget, you must require its resource within the `app.html` file:

```js
require(["dojox/mobile/parser", "dijit/registry", "dojox/mobile/deviceTheme", "dojox/mobile",
             "tweetview/TweetView", "tweetview/SettingsView", "dojox/mobile/TabBar", "dojox/mobile/compat"],
      function(parser, registry) {

		// Widget parsing will happen here

      }
);
```

With the module required in the page, it's time to update the HTML template for the two views:

```html
<!-- tweets view -->
<div id="tweets" data-dojo-type="tweetview.TweetView" data-dojo-config="selected: true">
    <h1 data-dojo-type="dojox.mobile.Heading" data-dojo-props="fixed: 'top'">
        <!-- the refresh button -->
        <div data-dojo-type="dojox.mobile.ToolBarButton"
                 data-dojo-props="icon:'../../app/js/tweetview/resources/images/refresh.png'"
                 class="mblDomButton tweetviewRefresh"></div>
        Tweets
    </h1>
    <ul data-dojo-type="dojox.mobile.RoundRectList" class="tweetviewList"></ul>
</div>

<!-- mentions view -->
<div id="mentions" data-dojo-type="tweetview.TweetView"
           data-dojo-props="serviceUrl: 'http://search.twitter.com/search.json?q=@${account}&since_id=${since_id}'">
    <h1 data-dojo-type="dojox.mobile.Heading" data-dojo-props="fixed: 'top'">
        <!-- the refresh button -->
        <div data-dojo-type="dojox.mobile.ToolBarButton"
                 data-dojo-props="icon:'../../app/js/tweetview/resources/images/refresh.png'"
                 class="mblDomButton tweetviewRefresh"></div>
        Mentions
    </h1>
    <ul data-dojo-type="dojox.mobile.RoundRectList" class="tweetviewList"></ul>
</div>
```

Note the changes we've made to the template:

*   Each view has been changed from a `dojox/mobile/ScrollableView` to a `tweetview/TweetView`
*   The mentions widget features a custom `serviceUrl` attribute for retrieving tweets
*   `data-dojo-props="fixed: 'top'"` has been added to the headings so that they stay glued to the top of each view
*   `"float:right;"` has been removed from the refresh buttons — that style directive will be moved to the stylesheet we will create later in the tutorial
*   The `tweetviewList` CSS class has been added to the child RoundRectList widgets for the sake of styling and node retrieval from within its parent TweetView widget.

<!-- protip -->
> Note that we're using Twitter's_search_ API to pull in the set of mentions. Twitter requires OAuth authentication for their mentions API, and implementing OAuth is well out of scope for this application. If you do choose to implement OAuth, all you would then need to do is change the serviceUrl parameter and you'll be set!

#### Handling Twitter Accounts

Each view within TweetView (Tweets, Mention, and Settings) relies on a single list of account information. That means that the account information has to be available to all TweetView widgets. We_could_ create a "controller" widget which oversees all TweetView widgets and manages account state, but that's extra overhead that we don't need just yet. Instead, we'll pin the account listing onto the `tweetview` namespace:

```js
// Set accounts for tweetview directly on the namespace
tweetview.ACCOUNTS = {
	dojo: { enabled: true },
	sitepen: { enabled: true }
};
```

The `ACCOUNTS` object contains a series of objects representing account names and their enabled state. More properties will be added to each account's object, but none of them need to be initialized.

#### TweetView startup

With the accounts defined, HTML templates complete, and base widget code in place, it's time to add the widget's `startup` method. Let's go through it line by line.

Retain the widget's native `startup` method functionality:

```js
// When the widgets have started....
startup: function() {
	// Retain functionality of startup in dojox/mobile/ScrollableView
	this.inherited(arguments);
```

Get a reference to this widget's refresh button and save the original image path (for when we change it back from the refresh icon after it's clicked):

```js
// Get the refresh button and image
this.refreshButton = registry.byId(this.getElements("tweetviewRefresh", this.domNode)[0].id);
this.iconNode = this.refreshButton.iconNode.childNodes[0];
this.iconImage = this.iconNode.src;
```

Add a click event to the refresh button which refreshed tweets on the widget:

```js
// Add a click handler to the button that calls refresh
this.refreshButton.on("click", lang.hitch(this, "refresh"), true);
```

Immediately load tweets by calling the `refresh` method:

```js
// Grab tweets right away!
this.refresh();
```

<!-- protip -->
> This `refresh` call will be removed once the Settings view is completed, but its presence is required during this class' development.

Add the `tweetviewPane` CSS class to the widget for styling purposes:

```js
// Add CSS class for styling
domClass.add(this.domNode, "tweetviewPane");
```

Get reference to the child `RoundRectList` widget for later use. Hide it, as it has no content from Twitter yet:

```js
// Get the list widget
this.listNode = this.getListNode();
// Hide the list because it's not populated with list items yet
this.showListNode(false);
```

Create an interval that fires every minute to update tweet ages:

```js
// Get localization for tweet times
this.l10n = i18n.getLocalization("dojo.cldr", "gregorian");

// Every 60 seconds, update the times
setInterval(lang.hitch(this, function() {
	arrayUtil.forEach(this.getElements("tweetviewTime", this.domNode), function() {
		timeNode.innerHTML = this.formatTime(domAttr.get(timeNode, "data-dojo-time"));
	}, this);
}), 60000);
```

That's the TweetView `startup` method that sets all of the wheels into motion. We still need to create the `refresh` method to update the tweet list so let's do it!

#### TweetView refresh

The `refresh` method is charged with pulling tweets from Twitter. Since we cannot pull multiple users' tweets in one request to Twitter, we'll need to fire a separate request for every account and then reconcile them once they are all returned. This means we'll create separate `dojo/io/script` calls and handle them within one `dojo/DeferredList` callback:

```js
// Contacts twitter to receive tweets
refresh: function() {
	// Set the refresh icon
	var refreshButton = this.refreshButton;
	this.iconNode.src = this.iconLoading;
	refreshButton.select();

	// For every account, add the deferred to the list
	var defs = [], accounts = tweetview.ACCOUNTS;
	for(var account in accounts) {
		// If the account is enabled...
		if(accounts[account].enabled) {
			// Get tweets!
			defs.push(ioScript.get({
				callbackParamName: "callback",
				preventCache: true,
				timeout: 3000,
				// "substitute" comes from _ViewMixin
				url: this.substitute(this.serviceUrl, { account: account, since_id: accounts[account].since || 1 })
			}));
		}
	}

	// Create a dojo/Deferredlist to handle when all tweets are returned
	// Add this.onTweetsReceived as the callback
	new DeferredList(defs).then(lang.hitch(this, this.onTweetsReceived));
},
```

<!-- protip -->
> Be sure to add a `timeout` parameter to `dojo/io/script.get` calls to ensure your error callback will properly fire.

A few notes about our `refresh` method:

*   The refresh image is changed to the spinning GIF when the method is called.
*   An account's tweets are only requested if the user's account is enabled.
*   Notice the `since` property of the account being appended to the URL. That property will be initialized after the first pull so that the same tweets aren't being pulled repeatedly.

The DeferredList's callback is the `onTweetsReceived` method. Let's create it!

#### TweetView `onTweetsReceived` and `sortTweets`

The `onTweetsReceived` method receives the results of all of the `dojo/Deferred`s created by the `dojo/io/script` calls. Now that we have the tweets from each account, we have a few problems:

*   The tweets are separated by user — we'll need to join them into one array. This is an easy problem to solve.
*   All tweets need to be sorted by tweet date when merged.

Before we can output tweets to the widget's list, we must sort them. The first part is joining the tweets into one array:

```js
// Merges tweets into one array, sorts them by date
sortTweets: function(deflist) {
	// Create an array for our tweets
	var allTweets = [];

	// For each def list result...
	arrayUtil.forEach(deflist, function(def) {
		// Define which property to check
		// Tweet is just "def[1]", Mentions is def[1].results
		var tweets = (def[1].results ? def[1].results : def[1]);

		// If we received any results in this array....
		if(tweets.length) {
			// Get the username and update the since
			var username = !tweets[0].user ? def[1].query.replace("%40","") : tweets[0].user.screen_name;

			// Update the since for this user
			tweetview.ACCOUNTS[username].since = tweets[0].id_str;

			// If this is a search, we need to add the username to the tweet
			if(def[1].query) {
				arrayUtil.forEach(tweets, function(tweet) { tweet.searchUser = username; });
			}

			// Join into one big array
			allTweets = allTweets.concat(tweets);
		}
	},this);
```

<!-- protip -->
> Note the `def[1]` handling, username retrieval, and def.query check. The search API returns a different JSON structure than the user timeline API. We could have created a different subclass for mentions handling but that's overhead we don't need in our mobile application, so we'll accommodate for both in TweetView.

With the tweets in one big array, it's time to sort them by time and return them to the `onTweetsReceived` method:

```js
  	// Sort them by date tweeted
	allTweets.sort(function(a, b) {
		var atime = new Date(a.created_at),
			btime = new Date(b.created_at);

		// Common sorting algorithms like this would return b - a, not a - b.
		// However, we want larger times to be prioritized, not smaller times,
		// so we're doing A's time minus B's time.
		return atime - btime;
	});
	// Return the tweets
	return allTweets;
}

```

With the tweets in sorted order, it's time to stop our refresh widget from spinning and to send the tweets to our `updateContent` method for incorporation on the page:

```js
  // Event for when content is loaded from Twitter
onTweetsReceived: function(rawTweetData) {
	// Sort tweets
	tweetData = this.sortTweets(rawTweetData);

	// Set the refresh icon back
	var refreshButton = this.refreshButton;
	this.iconNode.src = this.iconImage;
	refreshButton.select(true);

	// If we receive new tweets...
	if(tweetData.length) {
		// Update content
		this.updateContent(tweetData);
	}
},
```

<!-- protip -->
> Tweets are sorted oldest to newest — that ensures that the newest tweets will be pushed to the top of the list. Also note that `updateContent` is called**only if** we received new tweets from Twitter.

#### TweetView `updateContent`

The `updateContent` method receives the sorted tweets, creates `dojox/mobile/ListItem` widgets for each of them, and then pushes them to the top of the list. Before we create `updateContent`, we'll need a few utility methods to format tweet times and tweet text:

```js
  // Adds the proper tweet linkification to a string
formatTweet: function(tweetText) {
	return tweetText.
	replace(/(https?:\/\/\S+)/gi,'&lt;a href="$1"&gt;$1&lt;/a&gt;').
	replace(/(^|\s)@(\w+)/g,'$1&lt;a href="http://twitter.com/$2"&gt;@$2&lt;/a&gt;').
	replace(/(^|\s)#(\w+)/g,'$1&lt;a href="http://search.twitter.com/search?q=%23$2"&gt;#$2&lt;/a&gt;');
},

// Formats the time as received by Twitter
formatTime: function(date) {
	// Get now
	var now = new Date();

	// Push string date into an Date object
	var tweetDate = new Date(date);

	// Time measurement: seconds
	var secondsDifferent = Math.floor((now - tweetDate) / 1000);
	if(secondsDifferent &lt; 60) {
	return secondsDifferent + " " + (this.l10n["field-second"]) + (secondsDifferent &gt; 1 ? "s" : "");
	}

	// Time measurement: Minutes
	var minutesDifferent = Math.floor(secondsDifferent / 60);
	if(minutesDifferent &lt; 60) {
		return minutesDifferent + " " + this.l10n["field-minute"] + (minutesDifferent &gt; 1 ? "s" : "");
	}

	// Time measurement: Hours
	var hoursDifferent = Math.floor(minutesDifferent / 60);
	if(hoursDifferent &lt; 24) {
		return hoursDifferent + " " + this.l10n["field-hour"] + (hoursDifferent &gt; 1 ? "s" : "");
	}

	// Time measurement: Days
	var daysDifferent = Math.floor(hoursDifferent / 24);
	return daysDifferent + " " + this.l10n["field-day"] + (daysDifferent &gt; 1 ? "s" : "");
},
```

With these methods in place, we can create our `updateContent` method:

```js
  // Fires when tweets are received from the controller
updateContent: function(rawTweetData) {

	// For every tweet received....
	arrayUtil.forEach(rawTweetData, function(tweet) {
		// Get the user's screen name
		var screenName = tweet.searchUser || tweet.user.screen_name;

		// Create a new list item, inject into list
		var item = new ListItem({
			"class": "tweetviewListItem user-" + screenName
		}).placeAt(this.listNode, "first");

		// Update the list item's content using our template for tweets
		item.containerNode.innerHTML = this.substitute(this.tweetTemplateString, {
			text: this.formatTweet(tweet.text),
			user: tweet.from_user || screenName,
			name: tweet.from_user || tweet.user.name,
			avatar: tweet.profile_image_url || tweet.user.profile_image_url,
			time: this.formatTime(tweet.created_at),
			created_at: tweet.created_at,
			id: tweet.id
		});
	},this);

	// Show the list now that we have content for it
	this.showListNode(true);
},
```

<!-- protip -->
> Notice the `user-{screenName}` CSS class added to each item. That CSS class will play a crucial role in enabling and disabling users when we create the Settings view in the next tutorial in this series.

For every tweet we receive, we create a new list item. With the new list item created, we fill its content with the tweet-templated string generated from the tweet template and an object containing tweet data. Each tweet is added to the top of the list so that newest is first.

#### Tweets and Mentions Functionality Complete!

That wraps up the JavaScript functionality for TweetView's `TweetView` class! The Tweets and Mentions views will now load tweets and refresh! Let's review how we did it:

*   Created `_ViewMixin` which will be used by all TweetView widgets
*   Created a `TweetView` class in the `tweetview` namespace
*   Updated the Tweets and Mentions HTML to use the new TweetView widget
*   Set an ACCOUNTS object in the `tweetview` namespace so they are available to all widgets
*   Created methods within `TweetView` to set the widget into motion, retrieve tweets from Twitter, handle the result, and format them into the page

<!-- protip -->
> Now that the functionality is complete, go back and review the startup method again. With all of its utility methods in place, it should be easy to understand what's happening throughout the entire widget lifecycle.

There's just one step left: styling the list items.

#### Styling TweetView And Child Widgets

The styling used to position and format nodes within the list items is the fun part, and probably the easiest. At present, the `ListIte` widget is styled for one-line text, so we'll need to address that within our TweetView.css stylesheet:

```css
.tweetviewHidden { /* we'll use this to hide nodes within TweetView */
	display:none;
}

.tweetviewList &gt; li, .tweetviewList &gt; div { /* min-height to allow size of user avatar */
	min-height: 55px;
	padding-top: 8px;
}

.mblListItem.tweetviewListItem { /* special formatting to allow 2 lines of content */
	line-height: 18px;
	height: auto;
}

```

With the list item ready to receive multiple lines of content, we can leverage the CSS classes created within the tweet item template:

```css
/* provide proper spacing at the bottom of the scrollable views */
.mblScrollableViewContainer {
	padding-bottom:40px !important;
}

/* user's avatar */
.tweetviewAvatar {
	float:left;
}
/* content wrapper for tweets */
.tweetviewContent {
	padding-left:60px;
}

/* username formatting */
.tweetviewUser {
	font-size:80%;
}

/* actual tweet text formatting */
.tweetviewText {
	font-size:70%;
	font-weight:normal;
	padding-right:50px;
	padding-bottom:10px;
}

/* tweet time */
.tweetviewTime {
	float:right;
	color:#777;
	font-size:65%;
	font-weight:normal;
	padding-right:10px;
}

/* clears floats at the end of the list item */
.tweetviewClear {
	clear:both;
}
```

And there you have it: a perfectly styled list item matching the mockup!

[View Demo](demo/)

#### The Hard Part is Over!

As promised at the beginning of this tutorial, the Tweets and Mentions views are the most difficult parts of the project. The next part of the tutorial series will focus on the Settings view which will allow us to enable and disable accounts. Until then, review the demo and code in this tutorial to make sure you have a firm grasp on all of the moving parts!

### Download The Source

Download [Starting TweetView](resources/Starting_TweetView.zip). The archive will work as soon as you unzip the file!

### The TweetView Series

1.  [Getting Started with dojox/mobile](/documentation/tutorials/1.10/mobile/tweetview/getting_started/)
2.  [Introduction to TweetView](/documentation/tutorials/1.10/mobile/tweetview/intro_tweetview/)
3.  [Getting Started with TweetView: Tweets and Mentions](/documentation/tutorials/1.10/mobile/tweetview/starting_tweetview/)
4.  [Creating the Settings View](/documentation/tutorials/1.10/mobile/tweetview/settings/)
5.  [Android, Packaging, and Review](/documentation/tutorials/1.10/mobile/tweetview/packaging/)