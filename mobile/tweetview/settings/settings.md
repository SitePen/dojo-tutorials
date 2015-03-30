## TweetView: Creating the Settings View

In the previous post, [Getting Started with TweetView: Tweets and Mentions](/documentation/tutorials/1.10/mobile/tweetview/starting_tweetview/), we solidified our mobile application's file structure, reviewed TweetView's goals, and created the Tweets and Mentions views by coding `tweetview/_ViewMixin` and `tweetview/TweetView`. This tutorial will focus specifically on the "Settings" view of our application: dependencies for the class, how the Settings view ties into the Tweet and Mention views, and coding the Settings view itself.

### "Settings" View Dependencies

[![Tweets View](../app/images/SettingsSmall.jpg)](../app/images/Settings.jpg)

The Settings view is the most simple of the three views. This view contains two headings (the main heading and a subheading), and a list of Twitter accounts, each with a switch to represent if the account should display within the other views. In looking at the mockup, we know we'll need the following widgets:

*   `dojox/mobile/ScrollableView` - The entire view itself
*   `dojox/mobile/Heading` - The main "Settings" heading
*   `dojox/mobile/RoundRectCategory` - The "Show" subheading
*   `dojox/mobile/RoundRectList` - The account list holder
*   `dojox/mobile/ListItem` - The account list items
*   `dojox/mobile/Switch` - The switch widget

The mockup also makes clear that we'll be interacting with Twitter to get user information (avatars), so we'll need a few more Dojo resources:

*   `dojo/io/script` - JSONP solution to get information from Twitter
*   `dojo/DeferredList` - Allows handling of multiple Twitter requests once all information is received

These resources will allow us to complete the Settings view. Much like we did with the Tweets and Mentions views, we will create a custom class for Settings: `SettingsView`.

<!-- protip -->
> If we weren't displaying the user's avatar in the Settings view, we wouldn't need `dojo/io/script` and `dojo.DeferredList` for this view. We could hard-code the image paths, but then we'd need to manually update them if the user changed their avatar. The good news is that our prior TweetView code already includes both of those resources, so using them in the Settings view does not cause code bloat -- the classes are already available!

### Developing SettingsView

Our `SettingsView` class will be very much like `TweetView` in that it will inherit from `dojox/mobile/ScrollableView` and `tweetview/_ViewMixin`. One important point to remember with `SettingsView` is that this class will simply act as a wrapper for the `tweetview.ACCOUNTS` object that the application gets its account information from. With that in mind, let's dig into the Settings view!

#### New Class: SettingsView

Our new class will be called `SettingsView` and will be setup, at least initially, like TweetView was:

```js
// Require Settings dependencies
define(["dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojox/mobile/Switch",
              "dojox/mobile/ListItem", "dojox/mobile/ScrollableView", "dojo/DeferredList", "dojo/io/script",
              "tweetview/_ViewMixin", "dojo/date", "dijit/registry"],

    function(declare, arrayUtil, lang, Switch, ListItem, ScrollableView, DeferredList, ioScript, _ViewMixin, date, registry) {

		// Return the resource
		return declare("tweetview.SettingsView", [ScrollableView, _ViewMixin], {

			// Methods and properties will go here

	});
});
```

Dependencies are required and the new class is provided and declared.

<!-- protip -->
> This class will be created within the following directory alongside the `TweetView` and `_ViewMixin` classes, which currently lives in `js/tweetview`.

#### SettingsView Properties

Three custom properties will be given to `SettingsView`. The first setting is called `accountTemplateString`; a string of HTML representing the layout of each list item within the account list:

```js
// Create a template string for tweets:
accountTemplateString: '<img src="${avatar}" alt="${user}" class="tweetviewAvatar" />' +
'<div class="tweetviewContent">' +
'<div class="tweetviewUser">${user}</div>' +
'</div><div class="tweetviewClear"></div>',
```

The next property is called "views" which represents the `TweetView` instances. Why does `SettingsView` need to know the IDs of our `TweetView` instances? Because this new class will need to adjust the tweets in the `TweetView` instances when accounts are enabled and disabled. The `views` property accepts a comma-separated list of widget IDs:

```js
// Views that this widget should have reference to
views: "",
```

The last custom property is `serviceUrl`:

```js
// URL to pull user information from; simple template included
serviceUrl: "http://api.twitter.com/1/users/show/${account}.json",
```

The `serviceURL` property represents the URL of the Twitter service which we can pull user account information from. For this class, we only need to pull the user's avatar.

#### Implementing SettingsView

With the basic `SettingsView` class primitively created (it doesn't do anything_yet_), it's time to update our Settings view HTML:

```html
<!-- settings view -->
<div id="settings" data-dojo-type="tweetview.SettingsView" data-dojo-props="views: 'tweets,mentions'">
    <h1 data-dojo-type="dojox.mobile.Heading" data-dojo-props="fixed: 'top'">Settings</h1>
    <h2 data-dojo-type="dojox.mobile.RoundRectCategory">Show</h2>
    <ul data-dojo-type="dojox.mobile.RoundRectList" class="tweetviewList"></ul>
</div>
```

Here's what we changed:

*   The `dojoType` of the widget has been changed to our new module: `tweetview/SettingsView`.
*   Setting the views property to "tweets,mentions"; the IDs of our TweetView instances
*   The RoundRectList's node has been given the `tweetviewList` CSS class so that the widget can identify and gain reference to the list.

And of course we'll need to require the `tweetview/SettingsView` class at the top of our app.html page:

```js
require(["dojox/mobile/parser", "dijit/registry", "dojox/mobile/deviceTheme", "dojox/mobile",
			   "tweetview/TweetView", "tweetview/SettingsView", "dojox/mobile/TabBar", "dojox/mobile/compat"],
	function(parser, registry) {

		// Set accounts for tweetview directly on the namespace
		tweetview.ACCOUNTS = {
			dojo: { enabled: true },
			sitepen: { enabled: true }
		};

		// Parse the page
		parser.parse();
	}
);
```

With SettingsView added to the app.html page, it's time to create the JavaScript to populate the widget.

#### SettingsView startup()

The startup method of the `SettingsView` class will be `SettingsView's` real worker. Let's build the class task by task to make it simple. Start by calling the parent class' (`dojox/mobile/ScrollableView`) `startup` method to retain its original functionality:

```js
// Retain functionality of startup in dojox/mobile/ScrollableView
this.inherited(arguments);
```

Get reference to the list widget within the view and hide it until list items are added to it:

```js
// Get the list child widget
this.listNode = this.getListNode();
// Hide the list because it's not populated with list items yet
this.showListNode(false);
```

Create an array of accounts and sort them so that they will be in alphabetical order within the list:

```js
// Sort the accounts
var accounts = [];
for(var account in tweetview.ACCOUNTS) {
	accounts.push(account);
}
accounts.sort();
```

Create an array of Deferreds created by requesting each user's information from Twitter:

```js
// Create an array to hold our deferreds
var defs = [];
// For every account....
arrayUtil.forEach(accounts, function(account){
	// Make a request to Twitter to get user information
	defs.push(ioScript.get({
		callbackParamName: "callback",
		timeout: 3000,
		// "substitute" comes from _ViewMixin
		url: this.substitute(this.serviceUrl, { account: account })
	}));
},this);
```

<!-- protip -->
> You'll see the URL is being generated from our `serviceUrl` parameter and an object containing the account name. The `substitute` method was provided by `_ViewMixin`, a class that `SettingsView` inherited from.

With the requests to Twitter fired, grab reference to the TweetView widgets:

```js
// Get view widgets if we don't have them already
this.viewWidgets = arrayUtil.map(this.views.split(","), function(id) {
	return registry.byId(id);
});
```

The remaining functionality takes place in the dojo.DeferredList callback, after all user information has been retrieved. For every account we receive information for, if the account was found and the user is not protected:

```js
// Create a deferred list to add a callback for user formatting
new DeferredList(defs).then(lang.hitch(this, function(results) {

	// For every returned user array...
	arrayUtil.forEach(results, function(def,i) {

		// If the deferred failed, the user account isn't available or doesn't exist
		if(!def[0]) {
			// Remove the account from the list to prevent further problems
			// Also remove from our "local" sorted accounts list
			delete tweetview.ACCOUNTS[accounts[i]];
			delete accounts[i];
			return;
		}

		// Grab the user array
		var user = def[1];

		// If the user exists and isn't suspended or protected...
		if(user.id &amp;&amp; !user["protected"]) { // Protected is a reserved word

			// Subsequent code will be here

		}

	},this);

}));
```

Create a new `dojox/mobile/ListItem` and populate its HTML with our templated user information:

```js
// Create a new list item for the user, including a switch
var item = new ListItem({}).placeAt(this.listNode, "last");

// Update the list item's content using our template for tweets
item.containerNode.innerHTML = this.substitute(this.accountTemplateString, {
	user: user.screen_name,
	avatar: user.profile_image_url,
	user_id: user.id
});
```

Create and inject a `dojox/mobile/Switch` widget into the list item, taking into account if the account is enabled or disabled:

```js
// Create the switch
var userSwitch = new Switch({
	"class": "tweetviewSwitch",
	value: tweetview.ACCOUNTS[user.screen_name].enabled ? "on" : "off"
}).placeAt(item.containerNode, "first");
```

Add an `onStateChange` event to the `Switch` widget which updates the `tweetview.ACCOUNTS` object with the new enabled state for the given account. Additionally, notify each TweetView instance that the account has been enabled or disabled:

```js
// Add change event to the switch
userSwitch.on("StateChanged", lang.hitch(this, function(newState) {
	// get a true/false value
	var isOn = newState == "on";

	// Update our ACCOUNTS hash
	tweetview.ACCOUNTS[user.screen_name].enabled = isOn;

	// For each Pane widget, call the onUserChange method
	arrayUtil.forEach(this.viewWidgets, function(viewWidget) {
		viewWidget.onUserChange(user.screen_name,isOn);
	});
}), true);
```

Lastly, if we received any valid accounts, show the Settings list node (because now it has content) and "refresh" each view now that the accounts are verified as available:

```js
// If we have any valid accounts...
if(accounts.length) {
	// Show the list now that we have content for it
	this.showListNode(true);
	// Trigger a refresh of each view
	arrayUtil.forEach(this.viewWidgets, function(view) {
		view.refresh();
	});
}
```

That concludes the JavaScript code for `tweetview/Setting` -- the widget will now work beautifully. We aren't done with all of the JavaScript code yet though! We still need to implement the `onUserChange` method on the `TweetView` class.

#### TweetView Updates: onUserChange and Removing refresh() from startup()

The reason we called `refresh` on each view within the `SettingsView` class is because we didn't want to send a request for tweets from a user we weren't sure existed yet. Unfortunately the`refresh` call within the`TweetView``startup` is doing just that. Let's remove it:

```js
// Grab tweets right away!
//this.refresh();
```

The `SettingsView` instance will call the view's refresh method when an account has been verified to exist.

The `onUserChange` method gets called by the `SettingsView` class when an account gets enabled or disabled. We have a few options for how to handle enables and disables:

*   **Refresh the entire widget** - A waste of resources and Twitter API rate usage
*   **Destroy ListItem widgets, recreate them** - A waste of processing, and what if the user is enabled again right away? That would require a refresh to get all of the user's tweets. Doing so would also break our "since" functionality.
*   **Simply show/hide ListItems using CSS** - Bingo! Very little processing and we already have the data so no more requests to re-fetch them are needed!

Let's implement the new method within the `TweetView` class:

```js
// Updates a tweet's display property by user account.enable change
onUserChange: function(account,isOn) {
	arrayUtil.forEach(this.getElements("user-" + account,this.domNode), function(node){
		domClass[(isOn ? "remove" : "add")](node, "tweetviewHidden");
	});
}
```

Remember the `user-{screenName}` CSS class we assigned to list items in the `tweetview/TweetView` widget? We'll leverage that CSS class to find tweets from the user to be enabled/disabled, and remove/add a new `tweetviewHidden` CSS class which changes a list item to `display:none` or `display:block`.

#### Styling SettingsView

With the HTML and JavaScript for `SettingsView` done, it's time to add a few CSS classes to our stylesheet to make the list items match the mockup:

```css
/* float the switch to the right */
.tweetviewSwitch {
	right:10px;
	top:10px;
	float:right;
}

/* define class that of a tweet for a disabled user or any other hidden node/widget */
.tweetviewHidden {
	display:none;
}
```

### TweetView Complete!

With `tweetview/TweetView` completed in the previous tutorial, and the `tweetview/SettingsView` created within this tutorial, our working widget is complete [Click here](./demo/) to see the widget in action!

In the final tutorial in this series, we'll use Dojo's build process to squeeze the most out of TweetView's JavaScript, HTML, and CSS compression to make the widget as compact as possible!

### Download The Source

Download [TweetView](resources/TweetView_Settings.zip). The archive will work as soon as you unzip the file!

### The TweetView Series

1.  [Getting Started with dojox/mobile](/documentation/tutorials/1.10/mobile/tweetview/getting_started/)
2.  [Introduction to TweetView](/documentation/tutorials/1.10/mobile/tweetview/intro_tweetview/)
3.  [Getting Started with TweetView: Tweets and Mentions](/documentation/tutorials/1.10/mobile/tweetview/starting_tweetview/)
4.  [Creating the Settings View](/documentation/tutorials/1.10/mobile/tweetview/settings/)
5.  [Android, Packaging, and Review](/documentation/tutorials/1.10/mobile/tweetview/packaging/)