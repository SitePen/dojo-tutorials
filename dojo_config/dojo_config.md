---
Category:  Getting Started
...

## Configuring Dojo with dojoConfig

The `dojoConfig` object (formerly `djConfig`) allows you to set options and default behavior for various aspects of the toolkit.  In this tutorial we'll explore what's possible and how you can put dojoConfig to use in your code.

### Introduction

The `dojoConfig` object (known as `djConfig` prior to
Dojo 1.6) is the primary mechanism for configuring Dojo in a web page or application.
It is referenced by the module loader, as well as Dojo components with global
options.  It can further be used as a configuration point for custom applications, if desired.

The old object name of `djConfig` is deprecated, but any existing code using it will
continue to work up until 2.0. At the time of writing, most documentation still
uses `djConfig`; the two names are directly equivalent, but we'll
adopt and encourage use of the new `dojoConfig` name from here on.

### Getting Started

Let's run through some quick examples to see how `dojoConfig` works in practice.
First, a programmatic example of setting `dojoConfig` directly:

```html

<!-- set Dojo configuration, load Dojo -->
<script>
	dojoConfig= {
		has: {
			"dojo-firebug": true
		},
		parseOnLoad: false,
		foo: "bar",
		async: true
	};
</script>
<script src=&quot;//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js&quot;></script>

<script>
// Require the registry, parser, Dialog, and wait for domReady
require(["dijit/registry", "dojo/parser", "dojo/json", "dojo/_base/config", "dijit/Dialog", "dojo/domReady!"]
, function(registry, parser, JSON, config) {
	// Explicitly parse the page
	parser.parse();
	// Find the dialog
	var dialog = registry.byId("dialog");
	// Set the content equal to what dojo.config is
	dialog.set("content", "<pre>" + JSON.stringify(config, null, "\t") + "```");
	// Show the dialog
	dialog.show();
});
</script>

<!-- and later in the page -->
<div id="dialog" data-dojo-type="dijit/Dialog" data-dojo-props="title: 'dojoConfig / dojo/_base/config'"></div>

```

<a href="demo/dojoConfig.html" class="button">View Demo</a>

Notice that `dojoConfig` is defined in a script block
_before_ dojo.js is loaded.  This is of paramount
importance&mdash;if reversed, the configuration properties will be ignored.

In this example, we have set three flags: `parseOnLoad: false`, `has` (`dojo-firebug` sub-property), and `async: true`.
Additionally, a custom property has been specified: `foo: "bar"`.
For this demo, a `dijit/Dialog` has been placed in the page. Code that runs from within the `require` callback converts the value of `dojo.config` to JSON and places it into the dialog for review.
Among the results are our properties: `parseOnLoad`, `has`, and `foo`.
But there are also a few others, which are related to the fact that the demo page uses the
cross-domain, Google-CDN-hosted version of Dojo 1.10.

It is important to note the distinction between `dojoConfig` and `dojo/_base/config`.
`dojoConfig` is purely for input purposes&mdash;this is how we
communicate configuration parameters to the loader and modules.
During the bootstrap process, `dojo/_base/config` is populated from these
parameters for later lookup by module code.

Here's the same example written declaratively:

```html
<script src=&quot;//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js&quot;
		data-dojo-config=&quot;has:{'dojo-firebug': true}, parseOnLoad: false, foo: &#x27;bar&#x27;, async: 1&quot;>
</script>
```

<a href="demo/data-dojo-config.html" class="button">View Demo</a>

In this case, we use the same `data-dojo-config` attribute
on the Dojo `script` element that you've seen in other tutorials and examples.
This is entirely functionally equivalent to the previous example.
In both cases, the config options we provide are ultimately mixed into the
`dojo/_base/config` object, where they can be retrieved immediately after
the bootstrapping process that takes place as `dojo.js` loads.

You can confirm this by setting some new values in `dojoConfig`,
and checking the `dojo.config` object in the console.
So, `dojoConfig` is a generic configuration property-bag for Dojo.
Lets see what options there are and how we can use them.

### has() Configuration

One of the major features added in Dojo 1.7+ was the use of the has() pattern for feature detection. We can specify features for the has() feature set in `dojoConfig`, by including an object hash of features as the value of the `has` property. This feature set is now used for determining certain supported capabilities in Dojo. For example, we could disable the amd factory scan (scanning the module for CommonJS require(module) statements to load as deps) with:

```html
<script>
	dojoConfig = {
		has: {
			"dojo-amd-factory-scan": false
		}
	};
</script>
```

### Debug/Firebug Lite Configuration

You may be familiar by now with the `isDebug` config flag from other tutorials or usage of Dojo in versions prior to Dojo 1.7, to explicitly enable debug information. In Dojo 1.7+, this is now also specified with a has() feature at a higher level of granularity. To enable debugging assistance with Firebug Lite for older versions of Internet Explorer, we can set the dojo-firebug feature (isDebug can still be used to load this, but using the feature will load earlier in the loading cycle in async mode). If you have Firebug or another console available and open, it does nothing. But if you don't have a console, it will load Dojo's version of Firebug Lite, and create the console UI at the bottom of the page. This can be handy when debugging in earlier versions of IE or other browsers without nice developer tools.

To enable debugging messages for deprecated and experimental features, we can set dojo-debug-messages to true (this defaults to false, unless you have set isDebug). if this feature is set to `false`, these warnings will be suppressed. For example, to enable a developer console (browser provided or use Firebug Lite) and log debugging messages:

```html
<script>
	dojoConfig = {
		has: {
			"dojo-firebug": true,
			"dojo-debug-messages": true
		}
	};
</script>
```

To disable a guaranteed console object, we can set dojo-guarantee-console feature to false. This feature defaults to true and will create a dummy
`console` object if necessary so that any `console.*` logging statements in your code safely and quietly execute without throwing exceptions.

The following additional options are available to further configure this in-page console:

*   **`debugContainerId`:** specify a particular element to contain the console UI
*   **`popup`:** use a popup window rather than rendering the console into the current window

### Loader Configuration

Dojo received a new loader in Dojo 1.7 to accommodate for the toolkit's new AMD module format.  This new loader added a few new configuration options that are crucial to defining packages, maps, and more.  For details on the loader, see the [Advanced AMD Usage tutorial](../modules_advanced/). Important loader configuration parameters include:

*   **`baseUrl`**: The base URL prepended to a module identifier when converting it to a path or URL.

```js
	baseUrl: "/js"
```

*   **`packages`**: An array of objects which provide the package name and location:

```js
	packages: [{
		name: "myapp",
		location: "/js/myapp"
	}]
```

*   **`map`**: Allows you to map paths in module identifiers to different paths:

```js
	map: {
		dijit16: {
			dojo: "dojo16"
		}
	}
```

*   **`paths`**: a map of module id fragments to file paths:

```js
var dojoConfig = {
	packages: [
		"package1",
		"package2"
	],
	paths: {
		package1: "../lib/package1",
		package2: "/js/package2"
	}
};

	// ...is equivalent to:
var dojoConfig = {
	packages: [
		{ name: "package1", location: "../lib/package1" },
		{ name: "package2", location: "/js/package2" }
	]
};

```
*   **`async`**: Defines if Dojo core should be loaded asynchronously.  Values can be `true`, `false` or `legacyAsync`, which puts the loader permanently in legacy cross-domain mode.

```js
	async: true
```

*   **`parseOnLoad`**: If true, parses the page with `dojo/parser` when the DOM and all initial dependencies (including those in the `dojoConfig.deps` array) have loaded.

```js
	parseOnLoad: true
```

>	It is recommended that `parseOnLoad` be left at false (it defaults to false, so you can simply omit this property), and that developers explicitly require `dojo/parser` and call `parser.parse()`.

*   **`deps`**: An array of resource paths which should load immediately once Dojo has loaded:

```js
	deps: ["dojo/parser"]
```

*   **`callback`**: The callback to execute once `deps` have been retrieved:

```js
	callback: function(parser) {
		// Use the resources provided here
	}
```

*   **`waitSeconds`**: Amount of time to wait before signaling load timeout for a module; defaults to 0 (wait forever):</strong>

```js
	waitSeconds: 5
```

*   **`cacheBust`**: If true, appends the time as a querystring to each module URL to avoid module caching:

```js
	cacheBust: true
```

Now let's create a simple demo that puts the basic parameters to use.  One very common scenario is using Dojo Toolkit from CDN with local modules.  Let's say we use Google CDN with modules in the `/documentation/tutorials/1.10/dojo_config/demo` space:

```html
<!-- Configure Dojo first -->
<script>
	dojoConfig = {
		has: {
			"dojo-firebug": true,
			"dojo-debug-messages": true
		},
		// Don't attempt to parse the page for widgets
		parseOnLoad: false,
		packages: [
			// Any references to a "demo" resource should load modules locally, *not* from CDN
			{
				name: "demo",
				location: "/documentation/tutorials/1.10/dojo_config/demo"
			}
		],
		// Timeout after 10 seconds
		waitSeconds: 10,
		map: {
			// Instead of having to type "dojo/domReady!", we just want "ready!" instead
			"*": {
				ready: "dojo/domReady"
			}
		},
		// Get "fresh" resources
		cacheBust: true
	};
</script>

<!-- Load Dojo, Dijit, and DojoX resources from Google CDN -->
<script src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js"></script>

<!-- Load a "demo" module -->

<script>
	require(["demo/AuthoredDialog", "dojo/parser", "ready!"], function(AuthoredDialog, parser) {
		// Parse the page
		parser.parse();

		// Do something with demo/AuthoredDialog...
	});
</script>
```

By using the `packages` configuration, we've made all references to `demo/*` point to our local `/documentation/tutorials/1.10/dojo_config/demo/` directory, while allowing any references to `dojo`, `dijit`, and `dojox` to come from Google CDN.  Had the `demo` package not been defined, the request for `demo/AuthoredDialog` would have gone to `//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/demo/AuthoredDialog.js`.  We also used alias, by associating `ready` with `dojo/domReady`.

<a href="demo/packages.html" class="button">View Demo</a>

Extensive [documentation about the new loader](/reference-guide/1.10/loader/amd.html) provides even more details.

>	The new loader also supports the legacy `dojo.require()` resource loading and configuration properties like `modulePaths` covered in this [same tutorial for Dojo 1.6](../../1.6/dojo_config), thus allowing developers to safely upgrade existing applications easily and without worry.

### Locale and Internationalization

Dojo's i18n system is documented in its own right, and worthy of its own tutorial,
but we'll touch on it here just to show `dojoConfig` at work again.

You can configure the locale to use for any widgets or localized content
using Dojo's i18n infrastructure from `dojoConfig`.
The `locale` option lets you override the default provided to Dojo
by your browser. A simple demo shows it at work:

```html
<script>
	var dojoConfig = {
		has: {
			"dojo-firebug": true,
			"dojo-debug-messages": true
		},
		parseOnLoad: true,
		// look for a locale=xx query string param, else default to &#x27;en-us&#x27;
		locale: location.search.match(/locale=([\w\-]+)/) ? RegExp.$1 : &quot;en-us&quot;
	};
</script>
<script src=&quot;//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js&quot;></script>
<script>
	require(["dojo/date/locale", "dijit/Dialog", "dojo/json", "dojo/_base/config",
	"dojo/_base/window", "dojo/i18n", "dojo/domReady!"]
	, function(locale, Dialog, JSON, config, win) {
		var now = new Date();
		var dialog = new Dialog({
			id: "dialog",
			// set a title on the dialog of today's date,
			// using a localized date format
			title: "Today: " + locale.format(now, {
					formatLength:"full",
					selector:"date"
			})
		}).placeAt(win.body());
		dialog.startup();

		dialog.set("content", "<pre>" + JSON.stringify(config, null, "\t") + "```");
		dialog.show();
	});
</script>
```

[Demo with dojo.config.locale ='zh' (Chinese)](demo/localeConfig.html?locale=zh)

In the demo, where we define the `locale` property of the
`dojoConfig` object, we look for a `locale=xx` parameter
from the query string.
That's a demo artifact; typically you might hard-code the locale.
Setting the locale ahead of any module loading ensures that the
correct localized message bundle dependencies are loaded where necessary.
In this case, we use the `dojo/date/locale` module to format a
date object to a localized string for the Dialog title.

>	For multi-lingual pages, you will need to load bundles for the other locales
	as well as the one specified by your browser or the
	`dojoConfig.locale` property. In this case, use the
	`extraLocale` config property, with an array of string locale names.

>	When using the `dojo/parser`, the `lang=` setting on an ancestor DOMNode overrides the `dojoConfig.locale` setting. This behavior will change in Dojo 2.0. You can also specify the `lang `for individual widgets, overriding the `dojoConfig.locale` setting for only that widget.

### Custom Properties

Because `dojo.config` is always known to exist, and is the
logical place to provide for page-scoped configuration, several other
modules in Dojo use it for their own particular configuration properties.
We see this in Dijit, and especially in DojoX, where module flags and behavior can be set:

<dl>
	<dt>Dijit Editor</dt>
	<dd>allowXdRichTextSave</dd>
	<dt>dojox GFX</dt>
	<dd>dojoxGfxSvgProxyFrameUrl, forceGfxRenderer, gfxRenderer</dd>
	<dt>dojox.html metrics</dt>
	<dd>fontSizeWatch</dd>
	<dt>dojox.io transports and plugins</dt>
	<dd>xipClientUrl, dojoCallbackUrl</dd>
	<dt>dojox.image</dt>
	<dd>preloadImages</dd>
	<dt>dojox.analytics plugins</dt>
	<dd>sendInterval, inTransitRetry, analyticsUrl, sendMethod, maxRequestSize, idleTime, watchMouseOver, sampleDelay, targetProps, windowConnects, urchin</dd>
	<dt>dojox.cometd</dt>
	<dd>cometdRoot</dd>
	<dt>dojox.form.FileUploader</dt>
	<dd>uploaderPath</dd>
	<dt>dojox.mobile</dt>
	<dd>mblApplyPageStyles, mblHideAddressBar, mblAlwaysHideAddressBar, mobileAnim, mblLoadCompatCssFiles</dd>
</dl>

What works for dojox modules also works for your own applications and modules.
`dojoConfig` is an ideal place to provide configuration for
behavior and page- or application-wide properties. Consider the following:

```html
<script>
	dojoConfig = {
		has: {
			"dojo-firebug": true
		},
		app: {
			userName: &quot;Anonymous&quot;
		}
	};
</script>
<script src=&quot;//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js&quot;></script>
<script>
	require(["dijit/Dialog", "dijit/registry", "dojo/parser", "dojo/_base/lang",
	"dojo/json", "dojo/_base/config", "dojo/io-query", "dojo/domReady!"]
	, function(Dialog, registry, parser, lang, JSON, config, ioQuery) {

		// pull configuration from the query string
		// and mix it into our app config
		var queryParams = ioQuery.queryToObject(location.search.substring(1));
		lang.mixin(config.app, queryParams);

		// Create a dialog
		var dialog = new Dialog({
			title: "Welcome back " + config.app.userName,
			content: "<pre>" + JSON.stringify(config, null, "\t") + "```"
		});

		// Draw on the app config to put up a personalized message
		dialog.show();

	});
</script>
```

<a href="demo/appConfig.html" class="button">View Application Config Demo</a>

In this example, we've tacked on an "`app`"
`dojoConfig` property, which we later reference via `dojo.config`
to put up a personalized greeting in the Dialog.
There are many ways to approach populating `dojoConfig.app`.
It can be pre-populated with reasonable defaults and mixed-in with specific values later.
In production, the `dojoConfig` script block might get
written out on the server-side. Alternatively, you could populate it from a cookie with
JSON-formatted configuration values, or&mdash;as in our earlier example&mdash;you
could extract configuration data straight from the query string.
In development and test mode, you could use a template that provides dummy values,
or load a script or module that populates it.

### Conclusion

In this tutorial, we've covered many common ways in which
`dojo.config` can be populated&mdash;via `dojoConfig` or
`data-dojo-config`&mdash;and how its values influence behavior and
supply properties to Dojo modules.

The well-defined position and role `dojo.config` has in the
Dojo bootstrap and lifecycle means that the same concept applies neatly to
Dojo modules and even your own modules and applications.

### Colophon

*   [dojoConfig (djConfig) documentation](/reference-guide/1.10/dojo/_base/config.html)
*   [Dojo AMD loader configuration reference](/reference-guide/1.10/loader/amd.html#loader-amd-configuration)
*   [i18n docs](/reference-guide/1.10/dojo/i18n.html)