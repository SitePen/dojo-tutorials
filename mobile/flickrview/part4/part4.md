---
Category:  Mobile
...

## Part 4 - FlickrView: Implementing SettingsView

In the previous part, [FlickerView: Implementing FeedView](../part3), we implemented the feed view and we are now
able to use data from a JSON request to update our ScrollableView with templated ListItems. This part will focus on the
Settings view to get and set values from various input widgets (TextBox, Switch, RadioButton) and use Transition Events.

### SettingsView properties

We just need to keep some widget references, as well as the language currently selected:

```js
return declare([ScrollableView], {
	feedView: '',
	tagInput: '',
	selectSwitch: '',
	selectedLanguage: '',
//...
```
### SettingsView startup

Same as what we did in FeedView startup method: we call the parent method and initialize our properties:

```js
startup: function () {
	this.inherited(arguments);
	this.feedView = registry.byId("feed");
	this.tagInput = registry.byId("tags");
	this.selectSwitch = registry.byId("select");
	// ...
}
```

We also take the opportunity to add some useful getters and setters to our SettingsView class:

```js
 setTags: function (tags) {
	this.tagInput.set('value', tags);
},
getTags: function () {
	return this.tagInput.get('value');
},
setTagMode: function (tagmode) {
	this.selectSwitch.set('value', (tagmode === "all") ? "on" : "off");
},
getTagMode: function () {
	return (this.selectSwitch.get('value') === "on") ? "all" : "any";
}
```

**dojox/mobile/switch** has 2 states: _on_ or _off_. We arbitrarily choose to map the tag mode **ALL** to the _on_
state and **ANY** to the _off_ state.

Continuing on the startup method, we create a handler to retain the selected language when user clicks on a
radio button. To do that we rely on a powerful feature of
**dojo/on**: [even delegation with selector](http://dojotoolkit.org/reference-guide/dojo/on.html#event-delegation).

```js
// handler to record the selected feed language
this.on("[name=feedLanguage]:click", lang.hitch(this, function (e) {
	this.selectedLanguage = e.target.value;
}));
```
### Is it done?

Add a click handler on the **Done** button, such as:

*   programmatically perform the transition back to the Feed view
*   force a refresh of the view only if the user changed at least one setting

```js
// handler to update search query parameters when done button is selected
registry.byId("doneButton").on("click", lang.hitch(this, function () {
	// we are done with the settings: transition to FeedView
	this.performTransition("feed");
	// check if anything changed in the setting view
	if (this.getTags() !== flickrview.QUERY.tags ||
		this.getTagMode() !== flickrview.QUERY.tagmode ||
		this.selectedLanguage !== flickrview.QUERY.lang) {
		// update QUERY
		flickrview.QUERY.tags = this.getTags();
		flickrview.QUERY.tagmode = this.getTagMode();
		flickrview.QUERY.lang = this.selectedLanguage;
		// force FeedView list refresh
		this.feedView.refresh()
	}
}));
```

As we manually trigger the transition, we have to update our HTML to tell the view not to automatically transition,
with `moveTo:'#'`:

```html
<!-- Settings view -->
<div id="settings"
	data-dojo-type="flickrview/SettingsView">
	<div data-dojo-type="dojox/mobile/Heading"
	data-dojo-props="fixed: 'top', label: 'Settings'">
		<span data-dojo-type="dojox/mobile/ToolBarButton"
			id="doneButton"
			data-dojo-props="label:'Done', moveTo:'#', transition:'none'" style="float:right;"></span>
```

One last step and the implementation will be done!

### Respond to transition events

Dojo Mobile provides a
[set of events related to transitions](http://dojotoolkit.org/reference-guide/dojox/mobile/transition-events.html).
Still in the startup method, we’ll set a handler on the event **beforeTransitionIn** to get notify just before a
transition to the settings view occurs.

```js
// handler to get notified before a transition to the current view starts
this.on("beforeTransitionIn", lang.hitch(this, function () {
	this.setTags(flickrview.QUERY.tags);
	this.setTagMode(flickrview.QUERY.tagmode);
	this.selectedLanguage = flickrview.QUERY.lang;
	registry.byId(this.selectedLanguage).set('checked', true);
}));
```

In this handler we simply update input widgets from the Settings view to reflect the actual values from the QUERY object.

### Clean up your code

In the previous parts of this tutorial we first created a mockup of the application. This is a best practice to start
from here as it gives a fast and easy way to apprehend the user experience before jumping into the hard part.

#### Remove HTML mockup code

Now that our application is done we can remove all the artifacts from the mockup. It will reduce the size and
contribute to a clearer code:

*   **FeedView** - remove the ListItems.
*   **DetailssView** - remove the static description.

#### Remove Cache-Preventing Meta Tags

Remember the META tags we added to prevent caching during development of the widget? Remove those to allow the
application to be cached on the device:

```html
<!-- prevent cache -->
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="pragma" content="no-cache">
```

### You did it!

**Congratulations!** You just developed a complete Dojo Mobile application. The next part will show you how to make
your application ready for production.

<a href="demo/flickrview.html" class="button">View Demo</a>

### Download The Source

Download [Part 4 - FlickrView: Implementing SettingsView](resources/DojoMobilePart4.zip).

### Resources & references

*   [Dojo Mobile Reference Guide](http://dojotoolkit.org/reference-guide/dojox/mobile.html)
*   [The Dojo Toolkit API](http://dojotoolkit.org/api)
*   [dojo/on Event Delegation](http://dojotoolkit.org/reference-guide/dojo/on.html#event-delegation) (Reference Guide)
*   [dojox/mobile Transition Events](http://dojotoolkit.org/reference-guide/dojox/mobile/transition-events.html) (Reference Guide)

### The FlickrView Series

* [Part 1 - Getting Started with Dojo Mobile](../part1/)
* [Part 2 - Developing a Dojo Mobile Application: FlickrView](../part2/)
* [Part 3 - FlickrView: Implementing FeedView](../part3/)
* [Part 4 - FlickrView: Implementing SettingsView](../part4/)
* [Part 5 - Build FlickrView for production](../part5/)