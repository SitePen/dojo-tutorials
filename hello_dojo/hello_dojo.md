## Hello Dojo!
Welcome to Dojo! In this tutorial, you’ll learn how to load Dojo and begin exploring some of its core functionality. You’ll also learn about Dojo’s AMD-based module architecture, discover how to load additional modules to add extra functionality to your Web site or application, and find out how to get help when things go wrong.

### Getting Started

Getting started with Dojo is as simple as including the `dojo.js` script in a web page, just like any other JavaScript file. Dojo is available on popular [CDNs](http://en.wikipedia.org/wiki/Content_delivery_network "Content Delivery Network"), so to get started enter the following in a file named `hellodojo.html` and open it in your web browser.

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Tutorial: Hello Dojo!</title>
</head>
<body>
	<h1 id="greeting">Hello</h1>
	<!-- load Dojo -->
	<script src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js"
			data-dojo-config="async: true"></script>
</body>
</html>
```

Normally, once you've loaded a library's JavaScript file you have all of its methods available. This was true in the past with Dojo, but with the 1.7 release Dojo adopted the [Asynchronous Module Definition (AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD) format for its source code, allowing completely modular web application development. AMD was chosen because it works with pure JavaScript, allowing source files to work in web browsers, while also supporting a build process for producing optimized resources to enhance application performance in deployment.

So what is available when `dojo.js` has been loaded? Dojo's AMD loader is, and it [defines two global functions](/reference-guide/1.10/loader/amd.html#the-amd-api) for using it - `require` and `define`. AMD is covered in more detail in the [Introduction to AMD tutorial](../modules). For getting started, it is sufficient to understand that `require` enables you to load modules and use them, while `define` allows you to define your own modules. A module is typically a single JavaScript source file.

A few of Dojo's basic modules for HTML DOM manipulation are [dojo/dom](/reference-guide/1.10/dojo/dom.html) and [dojo/dom-construct](/reference-guide/1.10/dojo/dom-construct.html). Let's see how we can load these modules and use the functionality they provide:

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Tutorial: Hello Dojo!</title>
</head>
<body>
	<h1 id="greeting">Hello</h1>
	<!-- load Dojo -->
	<script src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js"
            data-dojo-config="async: true"></script>

	<script>
		require([
			'dojo/dom',
			'dojo/dom-construct'
		], function (dom, domConstruct) {
			var greetingNode = dom.byId('greeting');
			domConstruct.place('_ Dojo!_', greetingNode);
		});
	</script>
</body>
</html>
```

The first parameter to `require` (lines 14-17) is an array of _module ids_ &mdash; identifiers for the modules you want to load. Generally, these map directly to file names, and if you [download the source distribution of Dojo](/download/) and look in the `dojo` directory, you will see `dom.js` and `dom-construct.js` files which define those modules.

AMD loaders operate asynchronously, and in JavaScript asynchronous operation is implemented with callbacks, so the second parameter to `require` (line 17) is a callback function. In this function you provide your code that makes use of the modules. The AMD loader passes the modules as parameters to the callback function (in the same order they were specified in the module id array). You are free to name the parameters to your callback function whatever you like, but for the sake of consistency and readability we recommend using names based on the module id.

On lines 18 and 19 you can see the `dom` and `dom-construct` modules in use to get a reference to a DOM node by its id and manipulate its content.

The AMD loader will automatically load all sub-dependencies for a requested module, so only the modules that you need to use directly should be in your dependency list.

### Defining AMD Modules

At this point you've seen an example of loading and using modules. To define and load your own modules, you'll need to ensure that you are loading your HTML file from an HTTP server (localhost is fine, but you do need an HTTP server since there are security subtleties that will prevent many things from working with the "file:///" protocol). For these examples, you don't need any fancy features in your web server other than the ability to serve files. Add a `demo` directory in the directory that contains your `hellodojo.html` file, and in the `demo` directory create a file named `myModule.js`:

```
demo/
    myModule.js
	hellodojo.html
```

Now enter the following in `myModule.js`:

```js
define([
	// The dojo/dom module is required by this module, so it goes
	// in this list of dependencies.
	'dojo/dom'
], function(dom){
	// Once all modules in the dependency list have loaded, this
	// function is called to define the demo/myModule module.
	//
	// The dojo/dom module is passed as the first argument to this
	// function; additional modules in the dependency list would be
	// passed in as subsequent arguments.

	var oldText = {};

	// This returned object becomes the defined value of this module
	return {
		setText: function (id, text) {
			var node = dom.byId(id);
			oldText[id] = node.innerHTML;
			node.innerHTML = text;
		},

		restoreText: function (id) {
			var node = dom.byId(id);
			node.innerHTML = oldText[id];
			delete oldText[id];
		}
	};
});
```

The AMD `define` function accepts similar parameters to the `require` function - an array of module ids and a callback function. The AMD loader stores the return value of the callback function as the module's value, so any other code that loads the module with `require` (or `define`) will receive a reference to the return value of the defining module.

### CDN Usage

Loading local modules while using Dojo from a CDN requires a little extra configuration (more information on configuring Dojo's AMD loader and using Dojo with a CDN can be found in the [Advanced AMD](../modules_advanced/) and [Using Modules with a CDN](../cdn/) tutorials). Update `hellodojo.html` as follows:

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Tutorial: Hello Dojo!</title>
</head>
<body>
	<h1 id="greeting">Hello</h1>
	<!-- configure Dojo -->
	<script>
		// Instead of using data-dojo-config, we're creating a dojoConfig
		// object *before* we load dojo.js; they're functionally identical,
		// it's just easier to read this approach with a larger configuration.
		var dojoConfig = {
			async: true,
			// This code registers the correct location of the "demo"
			// package so we can load Dojo from the CDN whilst still
			// being able to load local modules
			packages: [{
				name: "demo",
				location: location.pathname.replace(/\/[^/]*$/, '') + '/demo'
			}]
		};
	</script>
	<!-- load Dojo -->
	<script src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js"></script>

	<script>
		require([
			'demo/myModule'
		], function (myModule) {
			myModule.setText('greeting', 'Hello Dojo!');

			setTimeout(function () {
				myModule.restoreText('greeting');
			}, 3000);
		});
	</script>
</body>
</html>
```

In addition to adding configuration for Dojo, we've redefined the main code - now it only loads `demo/myModule`, and utilizes it to accomplish manipulation of the text on the page. As you can see, defining and loading modules is pretty simple. We've also changed the URL to `dojo.js` to omit the protocol (line 26) - this creates a link that uses whatever protocol the page is using (http or https), preventing mixed content which raises security warnings in some browsers.

Organizing code in AMD modules allows you to create modular JavaScript source that is immediately executable in the browser, and easy to debug as well. AMD modules use local scope for variables, avoiding cluttering the global namespace and providing faster name resolution. AMD is a standard specification with multiple implementations, so you are not locked into any single implementation - AMD modules can be used with any AMD loader.

### Waiting for the DOM

One of the common things that you need to accomplish with web applications is to ensure that the browser's DOM is available before executing code.  This is accomplished via a special AMD module called a "plugin".  Plugins can be required like any other module, but their special functionality is only activated by adding an exclamation point (bang) to the end of the module identifier. In the case of the DOM ready event, Dojo provides the `dojo/domReady` plugin. Simply include this plugin as a dependency in any `require` or `define` call and the callback will not be fired until the DOM is ready:


```js
require([
    'dojo/dom',
    'dojo/domReady!'
], function (dom) {
    var greeting = dom.byId('greeting');
    greeting.innerHTML += ' from Dojo!';
});
```

<iframe width="100%" height="300" src="//jsfiddle.net/5nkopbb1/1/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

The example above simply adds some text to the `greeting` element &mdash; something that can only be done reliably once the DOM is loaded (we did not use this in previous code since the `script` element is included at the bottom of the `body` element &mdash; this delays processing of the script until the DOM has loaded). Again, note that the module identifier ends with **!**; without this, the `dojo/domReady` module would simply function like any other module.

In some cases, as with `dojo/domReady`, we only load a module for its side-effects and do not need a reference to it. The AMD loader has no way of knowing this &mdash; it always passes a reference to each module in the dependencies array to the callback function, so any modules for which you do not need to use the return value should be placed at the end of the dependency array, and references to them omitted from the parameter list to the callback function.

More information on DOM manipulation functions can be found in the [Dojo DOM Functions](../dom_functions/) tutorial.

### Adding Visual Effects

Now we can liven up our example by adding some animations. One module we can load to add effects to the page is `dojo/fx`. Let's add a sliding animation to the greeting with `dojo/fx`'s `slideTo` method:

```js
require([
	'dojo/dom',
	'dojo/fx',
	'dojo/domReady!'
], function (dom, fx) {
	// The piece we had before...
	var greeting = dom.byId('greeting');
	greeting.innerHTML += ' from Dojo!';

	// ...but now, with an animation!
	fx.slideTo({
		node: greeting,
		top: 100,
		left: 200
	}).play();
});
```

<iframe width="100%" height="300" src="//jsfiddle.net/5nkopbb1/2/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


As you can see, we've added one more dependency with `dojo/fx`, then used that module to play an animation on our `greeting` element.

<p class="proTip">More information on effects and animations can be found in the [Dojo Effects](../effects/) and [Animations](../animation/) tutorials.

### Using the Dojo Source

CDNs are handy.  We use them in the tutorial examples, because it means you can copy the code directly and don't have to change anything to have them work for you.  They have a few disadvantages though:

*   For performance reasons, they are a "built" version of Dojo, which means that each of the modules is minimized and optimized to be sent efficiently over the Internet.  This means that when you have an issue, they are more difficult to debug.
*   They require your user to have access to the public Internet to use your application.  In a lot of cases that may or may not be practical.
*   It requires more effort to include your own custom modules.
*   If you want to productionize your application, your performance would benefit greatly from a built version of Dojo tailored to your specific application and target browsers, which you can't achieve with a one-size fits all CDN build.

Follow these steps to get starting using the Dojo source, which is generally how you will develop projects using Dojo:

1.  [Download Dojo](/download/) - look near the bottom and download the source release.

    If you are experienced with [git](http://git-scm.com/) and [GitHub](https://github.com/), you can [clone Dojo from GitHub](https://github.com/dojo/). At a minimum, get [dojo](https://github.com/dojo/dojo). You will likely want [dijit](https://github.com/dojo/dijit), [dojox](https://github.com/dojo/dojox), and [util](https://github.com/dojo/util) at some point as well (these are all included in the source download).

2.  Extract the Dojo archive into your project folder, e.g.:
```
demo/
    myModule.js
dojo/
dijit/
dojox/
util/
hellodojo.html

```

3.  Load `dojo.js` locally, rather than from the CDN:

```js
<script src="dojo/dojo.js"></script>
```
4.  Update your package configuration:
```js
var dojoConfig = {
    async: true,
	baseUrl: '.',
    packages: [
	    'dojo',
		'dijit',
		'dojox',
		'demo'
    ]
};
```

### Getting Help

Whenever you get confused or run into a tricky problem, you're not alone! Volunteers are ready to assist via email on the [dojo-interest mailing list](http://mail.dojotoolkit.org/mailman/listinfo/dojo-interest) and via IRC at [#dojo on irc.freenode.net](/chat). If you think you've found an error in our documentation, or read something that's misleading or confusing, the feedback links at the bottom of all documentation pages can be used to let us know.

If you need urgent or confidential help, or have a problem that can't be solved by our team of volunteers, [commercial Dojo support](http://www.sitepen.com/support/) and [training workshops](http://www.sitepen.com/workshops/) are also available through SitePen.

### Where to next?

Getting started with the Dojo Toolkit is as simple as adding a script tag and requiring some modules, but the immense scope and power of Dojo means we've barely scratched the surface of what it can do. Depending upon your needs, there are a few different paths through this tutorial series:

*   If you have used Dojo before and want to get a better understanding of the World of AMD and "baseless" Dojo, plus understand other concepts that have changed, you should take a look at the [Modern Dojo](../modern_dojo/) tutorial.
	* If you are interested in adding some features and effects to an existing static Web page or server-driven Web site, you will want to look next at [Using dojo/query](../using_query/), [Events with Dojo](../events/), and the [effects](../effects/) and [animations](../animation/) tutorials.
*   If you want to add some Ajax to your site, [Ajax with Dojo](../ajax/) is your ticket.
*   If you're looking to integrate a rich widget library with your Web site or application, take a look at the [Creating Template-based Widgets](../templated/) tutorial plus our [tutorial series on Dijit widgets](/documentation/?ver=1.10#widgets).
*   If you're trying to learn more about architecting complex Web applications and leveraging the power of Dojo's utility functions, head over to the [Core Concepts](/documentation/?ver=1.10#coreConcepts) section.
*   If your goal is a mobile application, get up and running with [Getting Started with dojox/mobile](../mobile/flickrview/part1).

No matter your desired outcome, Dojo provides industry-leading open-source tools that can help you get your project done in less time with amazing results. We look forward to seeing what you come up with!