---
Category:  Mobile
...

## Part 1 - Getting Started with Dojo Mobile

Content on the web is evolving at a rapid pace, and the path is quickly moving towards mobile devices. As with many
other problems on the web, the Dojo Toolkit has the solution: Dojo Mobile. Dojo Mobile is a framework that allow you
to effortlessly create cross-device-compatible mobile web applications. This is the introductory post in a series of
posts exploring Dojo Mobile. Throughout the series, we will create a Dojo Mobile application called FlickrView. Before
we can get to that, we'll need to learn about why and how to use Dojo Mobile.

### Introduction to Dojo Mobile

Dojo Mobile is the Dojo Toolkit's answer to your mobile web application needs. It is a collection of classes has been architected to be lightweight, flexible, and extendable. Dojo Mobile has also been created to mimic the interface of the most commonly used devices: Android, iOS, BlackBerry, WindowsPhone so that your web application is seamless to your user.

**Key features of Dojo Mobile include:**
*   Complete and consistent mobile widget library (dojox/mobile) -- no need to collect widgets from multiple sources
*   Lightweight, minimal dependencies
*   Native style controls and widgets
*   Same functional behavior on desktop and mobile devices
*   Responds to both orientations as well orientation changes
*   CSS themes for most commonly used device
*   Uses CSS3-based animation where possible

**Check out a few quick examples of Dojo Mobile in action:**

*   [Browse all dojox/mobile Tests (1.10.3)](http://download.dojotoolkit.org/release-1.10.3/dojo-release-1.10.3/dojox/mobile/tests/)

These mobile interfaces also perform well in desktop browser clients, but take the time to use your iOS and Android-powered devices to browse each test. You'll be impressed by**Dojo Mobile's widgets and CSS themes**!

### Structuring Your Mobile Page

Consider this template to start your mobile application with:

```html
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
		<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"/>
		<meta name="apple-mobile-web-app-capable" content="yes"/>
		<title>Your Application Name</title>
		<!-- stylesheet will go here -->
		<!-- dojo/javascript will go here -->
	</head>
	<body>
		<!-- application will go here -->
	</body>
</html>
```

Adding Dojo Mobile to your page requires:

* **A theme**<br>There are multiple
[predefined themes](http://dojotoolkit.org/reference-guide/dojox/mobile.html#themes-currently-available)
: iPhone, iPad, Android 2.x, Android Holodark, BlackBerry, Windows Phone and a generic custom theme.

* **Dojo bootstrap and configuration**<br>The JavaScript to use dojo mobile.
* **One or more views**<br>Views will act as "pages" of your application.

Let's set up each one of these pieces separately, discussing details about each piece as we go along.

#### The Theme

Dojo Mobile is able to **dynamically apply a visual theme** to your application in order to give it a native
look depending on the browser user agent. To apply a native theme (that is, a theme that makes your application
look like a native application on the mobile device on which it is displayed), you just need to include the
following statement in your HTML pages:

```html
<script type="text/javascript"
	src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojox/mobile/deviceTheme.js"></script>
```
#### Dojo bootstrap and configuration

Including Dojo happens per the traditional `script` tag:

```html
<script type="text/javascript"
	src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js"></script>
```

Dojo configuration can be specified like this:

```html
<script type="text/javascript">
	dojoConfig = {
		async: true,
		parseOnLoad: false
	};
</script>
```
*   **async: true**<br>
Configures the loader in asynchronous mode.
*   **parseOnLoad: false**<br>
Lets developers explicitly require `dojox/mobile/parser` and call `parser.parse()`.

Now, the `require` part:

*   We explicitly require `dojox/mobile/parser` and call `parser.parse()`. The parser will analyze the dojo
HTML tags (widgets) that we will define in the next part.
*   The compatibility module `dojox/mobile/compat` is required to ensure functional compatibility when the
client is not WebKit-based, such as non-CSS3 desktop PC browsers.
*   The `dojo/domReady!` is a special kind of AMD module (called a loader_plugin_noticeable by the
trailing ‘**!**’ character) and is required to ensure our function that runs the parser is called once the DOM is ready.

```js
require([
	"dojox/mobile/parser",
	"dojox/mobile/compat",
	"dojo/domReady!"
], function (parser) {
	// now parse the page for widgets
	parser.parse();
});
```

Requiring `dojox/mobile/compat` is not necessary but is certainly best practice and it does not degrade the
performance of mobile browsers.

#### Dojo Mobile template

Putting all together gives the following template for your Dojo Mobile application:

```html
<html>
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"/>
	<meta name="apple-mobile-web-app-capable" content="yes"/>
	<title>Your Application Name</title>
	<!-- application stylesheet will go here -->
	<!-- dynamically apply native visual theme according to the browser user agent -->
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojox/mobile/deviceTheme.js"></script>
	<!-- dojo configuration options -->
	<script type="text/javascript">
		dojoConfig = {
			async: true,
			parseOnLoad: false
		};
	</script>
	<!-- dojo bootstrap -->
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js"></script>
	<!-- dojo application code -->
	<script type="text/javascript">
		require([
			"dojox/mobile/parser",
			"dojox/mobile/compat",
			"dojo/domReady!"
		], function (parser) {
			// now parse the page for widgets
			parser.parse();
		});
	</script>
</head>
<body style="visibility:hidden;">
	<!-- application will go here -->
</body>
</html>
```

Did you notice the style `visibility=hidden` in the &lt;body&gt;? This will ensure the page is displayed only when all Dojo mobile widgets are rendered.

Now we can add some widgets to the page!

### Creating Views and Widgets

As you've seen, there are minimal requirements to create a Dojo Mobile-ready page; adding widgets to the page is no different. Before we start creating widgets, let's review a few of the widgets Dojo Mobile provides:

*   **View** - A view is a virtual "page" within a mobile app.
*   **ScrollableView** - Allows for a header and/or footer to be anchored to the top or bottom allowing the middle content portion to be scrolled
*   **Button** - A simple button
*   **Switch** - An on/off toggling switch
*   **Heading** - A simple heading
*   **ListItem** - A basic list item
*   **TabBar & TabBarButton** - Tabbed content management
*   ...and more!

Remember that all widgets are styled to look like the device's OS. Also remember that you will likely want to
make your icons and widgets work and look like each device you intend to support.

Now that you're acquainted with some of the widgets baked into Dojo Mobile, let's create a basic view with
a **Heading**, a few **ListItems**, and a **Switch:**

```html
<!-- the view or "page"; select it as the "home" screen -->
<div id="settings" data-dojo-type="dojox/mobile/View" data-dojo-props="selected:true">
<!-- a sample heading -->
<h1 data-dojo-type="dojox/mobile/Heading">"Homepage" View</h1>
<!-- a rounded rectangle list container -->
<ul data-dojo-type="dojox/mobile/RoundRectList">
	<!-- list item with an icon containing a switch -->
	<li data-dojo-type="dojox/mobile/ListItem" data-dojo-props="icon:'images/icon-1.png'">Airplane Mode
		<!-- the switch -->
		<div data-dojo-type="dojox/mobile/Switch"></div>
	</li>
	<!-- list item with an icon that slides this view away and then loads another page -->
	<li data-dojo-type="dojox/mobile/ListItem"
	    data-dojo-props="icon:'images/icon-2.png', rightText:'mac'">Wi-Fi</li>
	<!-- list item with an icon that slides to a view called "general" -->
	<li data-dojo-type="dojox/mobile/ListItem"
	    data-dojo-props="icon:'images/icon-3.png', rightText:'AcmePhone', moveTo:'general'">Carrier</li>
</ul>
</div>
```

Note the custom attributes used within the widgets. A complete listing of custom options/attributes is available within
the [dojox/mobile API docs](/api/dojox/mobile.html) for each widget. Note in particular
`data-dojo-props="selected:true"`: It tells Dojo Mobile to display this view by default. Also note that the markup
provides for search engine friendly content strategies!

To make this work you’ll need to require the widgets used by the application:

```js
require([
	//...
	"dojox/mobile/View",
	"dojox/mobile/Heading",
	"dojox/mobile/RoundRectList",
	"dojox/mobile/ListItem",
	"dojox/mobile/Switch"
], function (parser) {
	//...
});
```

Let see the result:

[View Demo](demo/sample1.html)

Above we created one simple view. Of course most mobile applications will want more than one view so let's create the
**General** view we reference in the sample above, as well as a basic **About** view:

```html
<!-- The "General" sub-page -->
<div id="general" data-dojo-type="dojox/mobile/View">
	<!-- a sample heading -->
	<h1 data-dojo-type="dojox/mobile/Heading" data-dojo-props="back:'Settings', moveTo:'settings'">General View</h1>
	<!-- a rounded rectangle list container -->
	<ul data-dojo-type="dojox/mobile/RoundRectList">
		<li data-dojo-type="dojox/mobile/ListItem" data-dojo-props="moveTo:'about'">About</li>
		<li data-dojo-type="dojox/mobile/ListItem" data-dojo-props="rightText:'2h 40m', moveTo:'about'">Usage</li>
	</ul>
</div>
<!-- And let's add another view "About" -->
<div id="about" data-dojo-type="dojox/mobile/View">
	<!-- Main view heading -->
	<h1 data-dojo-type="dojox/mobile/Heading" data-dojo-props="back:'General', moveTo:'general'">About</h1>
	<!-- subheading -->
	<h2 data-dojo-type="dojox/mobile/RoundRectCategory">Generic Mobile Device</h2>
	<!-- a rounded rectangle list container -->
	<ul data-dojo-type="dojox/mobile/RoundRectList">
		<li data-dojo-type="dojox/mobile/ListItem" data-dojo-props="rightText:'AcmePhone'">Network</li>
		<li data-dojo-type="dojox/mobile/ListItem" data-dojo-props="rightText:'AcmePhone'">Line</li>
		<li data-dojo-type="dojox/mobile/ListItem" data-dojo-props="rightText:'1024'">Songs</li>
		<li data-dojo-type="dojox/mobile/ListItem" data-dojo-props="rightText:'10'">Videos</li>
	</ul>
</div>
```

As usual, you must require the new widget `dojox/mobile/RoundRectCategory` you just declare in your HTML.

**Congratulations**, you've just created your first Dojo Mobile application!

[View Demo](demo/sample2.html)

Dojo Mobile makes creating the basic elements of a mobile application a breeze! While your mobile application will
be more complex than our sample above, it's important to note that Dojo Mobile provides the basic themes, widgets,
methodology for creating multi-view web applications.

### Keep Going!

Now that we've covered the basics of the using Dojo Mobile, the next series of posts will focus on creating
a dynamic, data-driven mobile application called **FlickrView**. It will feature numerous Dojo Mobile widgets and work
with Android, iOS-based, BlackBerry or WindowsPhone devices.

### Download The Source

Download [Part 1 - Getting Started with Dojo Mobile](resources/DojoMobilePart1.zip).

### Resources & references

*   [Dojo Mobile Reference Guide](http://dojotoolkit.org/reference-guide/dojox/mobile.html)
*   [The Dojo Toolkit API](http://dojotoolkit.org/api)
*   [dojox/mobile deviceTheme](http://dojotoolkit.org/reference-guide/dojox/mobile/deviceTheme.html) (Reference Guide)
*   [Themes currently available](http://dojotoolkit.org/reference-guide/dojox/mobile.html#themes-currently-available) (Reference Guide)
*   [Configuring Dojo](http://dojotoolkit.org/documentation/tutorials/1.10/dojo_config/) (Tutorial)
*   [Dojo HTML5 Data-Attribute Support](http://dojotoolkit.org/features/1.6/html5data-attributes) (Feature)

### The FlickrView Series

* [Part 1 - Getting Started with Dojo Mobile](../part1/)
* [Part 2 - Developing a Dojo Mobile Application: FlickrView](../part2/)
* [Part 3 - FlickrView: Implementing FeedView](../part3/)
* [Part 4 - FlickrView: Implementing SettingsView](../part4/)
* [Part 5 - Build FlickrView for production](../part5/)
