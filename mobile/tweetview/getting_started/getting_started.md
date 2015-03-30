## Getting Started with dojox/mobile

Content on the web is evolving at a rapid pace, and the path is quickly moving towards mobile devices. As with many other problems on the web, the Dojo Toolkit has the solution:`dojox/mobile`.`dojox/mobile` is a framework of controllers, CSS3-based themes, and device-like widgets that will allow you to effortlessly create intelligent, flexible, and cross-device-compatible mobile web applications. This is the introductory post in a series of posts exploring`dojox/mobile`. Throughout the series, we will create a powerful Twitter-based web application called TweetView. Before we can get to that, we'll need to learn about why and how to use`dojox/mobile`.

### Introduction to dojox/mobile

`dojox/mobile` is the Dojo Toolkit's answer to your mobile web application needs. This collection of classes has been architected to be lightweight, flexible, and extendable.`dojox/mobile` has also been created to mimic the interface of iOS and Android devices so that your web application is seamless to your user. Key features of`dojox/mobile` include:

*   Lightweight, minimal dependencies
*   Provides CSS themes for iOS, Android, and Blackberry-based devices
*   Provides iOS, Android, and Blackberry-style controls and widgets
*   Uses CSS3-based animation where possible
*   Provides a small,`dojox/mobile/compat` resource for JavaScript animation when clients don't support CSS3 animations
*   Responds to both orientations as well as orientation changes
*   `dojox/mobile` is a complete mobile widget framework -- no need to collect widgets from multiple sources
*   **New in Dojo 1.7:** A`deviceTheme` resource which detects and loads the theme for the user's device.
*   **New in Dojo 1.7:** New controls including Tooltip, Overlay, Opener, ComboBox, ExpandingTextarea, PageIndicator, SpinWheel, and Slider.
*   **New in Dojo 1.8:** More new controls including Accordion, Badge, ScrollablePane, SearchBox, SimpleDialog, ProgressBar, Rating, ValuePicker, DatePicker, TimePicker, Audio, Video, and many more!
*   **New in Dojo 1.9:** Support for new platforms: IE10 on Windows 8 / Windows Phone 8, BlackBerry 10, a new Android 4 ("Holodark") theme, a new Windows theme, new list features (filtered lists, better performances on very long lists), a new FormLayout container, support for templates in mobile widgets, bidirectional languages support, accessibility enhancements, and more.

<!-- protip -->
> Read the [Dojo 1.10 Release Notes](/reference-guide/1.10/releasenotes/1.10.html) to see a complete list of`dojox/mobile` additions and enhancements.

Check out a few quick examples of`dojox/mobile` in action:

*   [Browse all dojox/mobile Tests](http://download.dojotoolkit.org/release-1.10.3/dojo-release-1.10.3/dojox/mobile/tests/)

Armed with`dojox/mobile`, we will now create a sample mobile web application: TweetView.

<!-- protip -->
> These mobile interfaces also perform well in desktop browser clients, but take the time to use your iOS and Android-powered devices to browse each test. You'll be impressed by`dojox/mobile's` widgets and CSS themes!

### Structuring Your Mobile Page

Like any web application, it's important that the structure of the page is intelligently designed. Luckily`dojox/mobile` requires very little in the way of special structure. It is important, however, to include a few key pieces within the page. These pieces include:

*   The proper DOCTYPE
*   Mobile-specific META tags
*   A BODY element which will contain the views

<!-- protip -->
> Visit the [Mobile Safari Supported Meta Tags](http://developer.apple.com/library/safari/#documentation/appleapplications/reference/SafariHTMLRef/Articles/MetaTags.html) page to learn more about what these META tags mean and the other META tags available for mobile applications.

Consider the following a template to start your mobile application with:

```html
<!DOCTYPE html>
<html>
    <head>
    <meta name="viewport"
            content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"/>
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <title>Your Application Name</title>
    <link href="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojox/mobile/themes/iphone/iphone.css"
            rel="stylesheet"></link>

    <!-- stylesheet will go here -->

    <!-- dojo/javascript will go here -->

    </head>
    <body>

    <!-- application will go here -->

    </body>
</html>
```

With our HTML template defined, we can now add Dojo and`dojox/mobile` to the page!

### Adding `dojox/mobile` to Your Mobile Page

`dojox/mobile` is like a simplified, specialized version of Dijit. Adding `dojox/mobile` to your page requires:

*   **A theme:** There are currently four themes: iPhone, Android, Blackberry, and Common
*   **Dojo JS with dojox/mobile:** The base classes and JavaScript to use them
*   **One or more views:** Views will act as "pages" of your application.

Let's set up each one of these pieces separately, discussing details about each piece as we go along.

#### The Theme

As previously mentioned,`dojox/mobile` provides four themes: iPhone, Android, Blackberry, and Common. The iPhone theme provides stylesheets for both the iPhone/iPod and iPad devices. A compatibility layer is included for the two iOS devices to provide maximum compatibility between the two. A special stylesheet is also available for compat when the user isn't using a WebKit-powered device. Whereas in Dojo 1.6 we needed to explicitly include the theme ourselves, Dojo 1.7 provides a `dojox/mobile/deviceTheme` resource to include theme resources based on User Agent detection. In short, Dojo does the theming for you!

<!-- protip -->
> If you'd prefer to hardcode a theme, that's fine too! Simply include the theme CSS file (located in `dojox/mobile/themes`) and you're set!

#### Implementing Dojo and dojox/mobile

Including Dojo happens per the traditional `SCRIPT` tag. You can use traditional Dojo or Baseless/Async Dojo. TweetView will use baseless Dojo so we include only what we need and keep our mobile application light:

```html
<script src="http://ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js"
    data-dojo-config="async:true"></script>
```

`dojox/mobile` and the `dojox/mobile` parser should be required via a traditional AMD `require` call:

```js
// Load the widget parser and mobile base
require(["dojox/mobile/parser", "dojox/mobile"], function(parser) {

	// Parse the page for widgets!
	parser.parse();

});
```

Remember when I mentioned that `dojox/mobile` is similar to Dijit? Another similarity is that `dojox/mobile` has its own parser to find nodes which should be widgetized. Widgets will use the same `data-dojo-type` and `data-dojo-props` attributes within the markup, just like Dijit widgets do.

The last step in implementing `dojox/mobile` is requiring the `deviceTheme` resource, which in turn detects the user device and loads the proper theme:

```js
// Load the widget parser and mobile base
require(["dojox/mobile/parser", "dojox/mobile/deviceTheme", "dojox/mobile"],
	function(parser, deviceTheme) {

		// Parse the page for widgets!
		parser.parse();

	}
);
```

<!-- protip -->
> `dojox/mobile` now responds to `data-dojo-type` and `data-dojo-props` attributes that are new to widget declaration in Dojo 1.7!

Additionally, we may add the `dojox/mobile/compat` resource which loads additional stylesheets and JavaScript to allow `dojox/mobile` to use Dojo's JavaScript-based animation methods instead of relying on WebKit's advanced CSS3 animations to make widgets work:

```js
// Load the widget parser and mobile base
require(["dojox/mobile/parser", "dojox/mobile/deviceTheme", "dojox/mobile/compat", "dojox/mobile"],
	function(parser, deviceTheme) {

		// Parse the page for widgets!
		parser.parse();
	}
);
```

<!-- protip -->
> Requiring `dojox/mobile/compat` is not necessary but is certainly best practice if your mobile web application should cater to multiple devices. Its functionality is not baked into `dojox/mobile's` base to keep `dojox/mobile` as compact as possible.

Now that we have our theme and `dojox/mobile` resources loaded, let's add some sample widgets to the page.

### Creating Views and Widgets

As you've seen, there are minimal requirements to create a `dojox/mobile`-ready page; adding widgets to the page is no different. Before we start creating widgets, let's review a few of the widgets `dojox/mobile` provides:

*   **View** - A view is a virtual "page" within a mobile app. It scrolls to the left and right and the page can be any number of views deep.
*   **ScrollingView** - Allows for a header and/or footer to be anchored to the top or bottom allowing the middle content portion to be scrolled
*   **Button** - A simple button
*   **Switch** - An on/off toggling switch
*   **Heading** - A simple heading
*   **ListItem** - A basic list item
*   **TabBar & TabBarButton** - Tabbed content management, templated in one of two methods: Segmented Control (blue, usually on the top) or TabBar (black, usually on the bottom)
*   ...and more!

<!-- protip -->
> Remember that all widgets are styled to look like the device's OS (as specified by the stylesheet you provide). Also remember that you will likely want to make your icons and widgets work and look like each device you intend to support.

Now that you're acquainted with some of the widgets baked into `dojox/mobile`, let's create a basic view with a heading, a few list items, and a switch:

```html
<!-- the view or "page"; select it as the "home" screen -->
<div id="settings" data-dojo-type="dojox.mobile.View" data-dojo-props="selected: true">

    <!-- a sample heading -->
    <h1 data-dojo-type="dojox.mobile.Heading">Settings</h1>

    <!-- a rounded rectangle list container -->
    <ul data-dojo-type="dojox.mobile.RoundRectList">

        <!-- list item with an icon containing a switch -->
        <li data-dojo-type="dojox.mobile.ListItem" data-dojo-props="icon:'../../app/images/i-icon-1.png'">
            Airplane Mode
            <!-- the switch -->
            <div class="mblItemSwitch" data-dojo-type="dojox.mobile.Switch"></div>
        </li>
        <li data-dojo-type="dojox.mobile.ListItem"
              data-dojo-props="icon:'../../app/images/i-icon-2.png', rightText:'mac', moveTo: 'general'">
            Wi-Fi
        </li>
        <li data-dojo-type="dojox.mobile.ListItem"
              data-dojo-props="icon:'../../app/images/i-icon-3.png', rightText:'AcmePhone'">
            Carrier
        </li>
    </ul>
</div>
```

<!-- protip -->
> When the user taps the "Carrier" item and is shifted to the "General" view (or anywhere except the home view), an OS-style "back" button displays in the upper left corner by setting the "back" attribute on the subsequent view's Heading widget, so there's no need to add a "Back" button within your view.

Above we created one simple view. Of course most mobile applications will want more than one view so let's create the "general" view we reference in the sample above, as well as an "about" view:

```html
<div id="general" data-dojo-type="dojox.mobile.View">
    <h1 data-dojo-type="dojox.mobile.Heading" data-dojo-props="back:'Settings', moveTo:'settings'">
            General
    </h1>
    <ul data-dojo-type="dojox.mobile.RoundRectList">
        <li data-dojo-type="dojox.mobile.ListItem" data-dojo-props="moveTo:'about'">
            About
        </li>
        <li data-dojo-type="dojox.mobile.ListItem" data-dojo-props="rightText: '2h 40m', moveTo: 'about'">
            Usage
        </li>
    </ul>
</div>

<div id="about" data-dojo-type="dojox.mobile.View">
    <h1 data-dojo-type="dojox.mobile.Heading" data-dojo-props="back:'General', moveTo:'general'">
            About
    </h1>
    <h2 data-dojo-type="dojox.mobile.RoundRectCategory">Generic Mobile Device</h2>
    <ul data-dojo-type="dojox.mobile.RoundRectList">
        <li data-dojo-type="dojox.mobile.ListItem" data-dojo-props="rightText:'AcmePhone'">
            Network
        </li>
        <li data-dojo-type="dojox.mobile.ListItem" data-dojo-props="rightText:'AcmePhone'">
            Line
        </li>
        <li data-dojo-type="dojox.mobile.ListItem" data-dojo-props="rightText:'1024'">
            Songs
        </li>
        <li data-dojo-type="dojox.mobile.ListItem" data-dojo-props="rightText:'10'">
            Videos
        </li>
        <li data-dojo-type="dojox.mobile.ListItem" data-dojo-props="rightText:'96'">
            Photos
        </li>
        <li data-dojo-type="dojox.mobile.ListItem" data-dojo-props="rightText:'2'">
            Applications
        </li>
        <li data-dojo-type="dojox.mobile.ListItem" data-dojo-props="rightText:'29.3 BG'">
            Capacity
        </li>
        <li data-dojo-type="dojox.mobile.ListItem" data-dojo-props="rightText:'28.0 BG'">
            Available
        </li>
        <li data-dojo-type="dojox.mobile.ListItem" data-dojo-props="rightText:'3.0 (7A341)'">
            Version
        </li>
    </ul>
</div>
```

[View Demo](demo/)

<!-- protip -->
> Note the custom attributes used within the widgets. A complete listing of custom options/attributes is available within the [`dojox/mobile` API docs for each widget](/api/?qs=1.10/dojox/mobile). Also note that the markup provides for search engine friendly content strategies!

Congratulations, you've just created your first `dojox/mobile` web application!`dojox/mobile` makes creating the basic elements of a mobile web application a breeze! While your mobile web application will be more complex than our sample above, it's important to note that `dojox/mobile` provides the basic themes, widgets, methodology for creating multi-view web applications.

### dojox/mobile Resources

Here are a few more resources about `dojox/mobile`:

*   [dojox/mobile API](/api/?qs=1.10/dojox/mobile)
*   [dojox/mobile Reference Guide](/reference-guide/1.10/dojox/mobile.html)
*   [dojox/mobile 1.10 Tests](http://download.dojotoolkit.org/release-1.10.3/dojo-release-1.10.3/dojox/mobile/tests/)

### Keep Going!

Now that we've covered the basics of the using `dojox/mobile`, the next series of posts will focus on creating a dynamic, data-driven mobile web application called TweetView. TweetView will feature numerous `dojox/mobile` widgets and work with both Android and iOS-based devices. The web application will pull tweets from Twitter and format them into an elegant and functional user interface.

### The TweetView Series

1.  [Getting Started with dojox/mobile](/documentation/tutorials/1.10/mobile/tweetview/getting_started/)
2.  [Introduction to TweetView](/documentation/tutorials/1.10/mobile/tweetview/intro_tweetview/)
3.  [Getting Started with TweetView: Tweets and Mentions](/documentation/tutorials/1.10/mobile/tweetview/starting_tweetview/)
4.  [Creating the Settings View](/documentation/tutorials/1.10/mobile/tweetview/settings/)
5.  [Android, Packaging, and Review](/documentation/tutorials/1.10/mobile/tweetview/packaging/)