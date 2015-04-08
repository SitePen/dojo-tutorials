---
Category:  Modules
...

## Introduction to AMD Modules

Dojo supports modules written in the Asynchronous Module Definition (AMD) format, which makes code easier to author and debug. In this tutorial, we explain the basics of understanding and using AMD.


If you are migrating from a version of Dojo lower than 1.7, you may find the [1.8 version](../../1.8/modules/) of this tutorial useful as it provides some guidance on migrating from Dojo's old module system to AMD. This tutorial will focus strictly on AMD.

### Overview

The Asynchronous Module Definition (AMD) format is the module format that Dojo adopted starting with Dojo 1.7. It provides many enhancements over the legacy Dojo module style, including fully asynchronous operation, true package portability, better dependency management, and improved debugging support. It is also a community-driven standard, which means that modules written to the AMD specification can be used with any other AMD-compliant loader or library. In this tutorial, we’ll explain AMD and show you how to use it.

### What is a module?

A module is a value that can be accessed by a single reference. If you have multiple pieces of data or functions that you want to expose in a module, they have to be properties on a single object that represents the module. Practically speaking, it's overkill to create a module for a simple value like `var tinyModule = 'simple value';`, but it would be valid. Modules start to make a lot more sense for _modularizing_ your code - splitting it up into logical subsets for handling specific functionality. If you want to represent a person with information like name and address, perhaps even add some methods to your person, it starts to make sense to put all that code in a single location. A module is stored in your file system in a single file.

### How do I create a module?

With AMD, you create a module by _registering_ it with the loader.

A quick aside here &mdash; loader? What's a loader? The loader is the code (yes, it's just JavaScript!) that handles the logic behind defining and loading modules. When you load `dojo.js` or [`require.js`](http://requirejs.org), you get an AMD loader. The loader defines functions for interacting with it - _require_ and _define_..

The global function `define` allows you to register a module with the loader. Let's look at a few examples:
```js
define(5);
```

Not very sophisticated, but valid - the value of this module is the number 5.

```js
define({
	library: 'dojo',
	version: 1.10
});
```

Getting a little more interesting - when this module is loaded, we get an object with 2 properties.

```js
define(function(){
	var privateValue = 0;
	return {
		increment: function(){
			privateValue++;
		},

		decrement: function(){
			privateValue--;
		},

		getValue: function(){
			return privateValue;
		}
	};
});
```

In this case, we've passed a function to `define`. The function is evaluated and its result is stored by the loader as the module. This code uses a closure to create a private value that is not directly accessible by external code, but can be examined and manipulated by methods provided on the object that is returned as the module's value.

### How do I load a module?

For starters, we need to understand how modules are identified. In order to load a module, you need some way of identifying it. Similar to the module/package systems of other programming languages, an AMD module is identified by its path and file name. Let's save the code from the above example in a folder:

```
app/counter.js

```


Let's also add a loader (Dojo of course!) and an index.html - the entry-point for our application. This gives us the following file structure:

```
/
	index.html
	/dojo/
	/app/
		counter.js
```


The index page will look like this:

```html
<html>
	<body>
		<script src=&quot;dojo/dojo.js&quot; data-dojo-config="async: true"></script>
		<script>
			require([
				&quot;app/counter&quot;
			], function(counter){
				log(counter.getValue());
				counter.increment();
				log(counter.getValue());
				counter.decrement();
				log(counter.getValue());
			});
		</script>
	</body>
</html>
```


[View Demo](demo/demo.php)

Let's review what's going on here:

1.  In `app/counter.js`, we call `define` to register a module with the loader. Note that the module we have defined is a reference to an object, not a constructor function - this means that every bit of code that loads this module will get a reference to the exact same object. Generally, modules return constructors, but in some cases it is appropriate to return a singleton object.
2.  By locating our module in the file system in a sub-folder below the folder containing `index.html`, and in a sibling folder of our AMD loader (`dojo/dojo.js`), we don't have to do any extra configuration for the loader to know that the module id "app/counter" indicates that the loader should load the file `app/counter.js` and use its return value as the module.
3.  In our `index.html`, we call `require` to load the "app/counter" module. You can load a module simply with `require(["app/counter"])`. If the code in the module has side-effects (like augmenting other modules), you may not need a reference to the module at all. However, if you need a reference to the module, you need to supply a callback function. The loader will ensure the module has been loaded, and once it has, it will call your callback function passing any modules to it as parameters. As with any other function, you are free to name your parameters whatever you want - there's no requirement that parameter names have any relationship to the module name. That said, it _is_ good practice to use similar names to the module name.

### Modules Loading Modules

Our examples so far have shown very simple usage of the `define` function. When an application is composed of well-organized modules, there is naturally a lot of dependency between modules. The `define` function can automatically load dependencies for your module. The dependency list is passed to `define` before the module value.

```js
define([
	"dojo/_base/declare",
	"dojo/dom",
	"app/dateFormatter"
], function(declare, dom, dateFormatter){
	return declare(null, {
		showDate: function(id, date){
			dom.byId(id).innerHTML = dateFormatter.format(date);
		}
	});
});
```


This example demonstrates some more typical features of AMD applications:

1.  Multiple dependencies - both the "dojo/dom" and (hypothetical) "app/dateFormatter" modules are specified in the dependency list
2.  Returns a constructor - an appropriate name for a module like this would be something like "app/DateManager". Code that uses it would look something like this:
```js
	require([
		"app/DateManager"
	], function(DateManager){
		var dm = new DateManager();
		dm.showDate('dateElementId', new Date());
	});
```


While AMD is one of the first topics you should familiarize yourself with before developing with Dojo, `declare` is another vital function - if you're not already familiar with `dojo/_base/declare`, go read its [tutorial](../declare/) next!

### Using plugins

In addition to regular modules, the AMD loader also features a new type of module called a plugin. Plugins are used to extend the loader with new features beyond simply loading an AMD module. Plugins are loaded more or less the same way as a regular module, but use a special character "!" at the end of the module identifier to identify the request as a plugin request. Data after the "!" is passed directly to the plugin for processing. This will become clearer as we look at a few examples. Dojo comes with several plugins by default; the four most important are `dojo/text`, `dojo/i18n`, `dojo/has` and `dojo/domReady`. Let’s take a look at how they’re used.

#### [dojo/text](/reference-guide/1.10/dojo/text.html)

`dojo/text` is used when you need to load a string from a file (like an HTML template). The value will be cached, so subsequent calls to load the same file will not result in additional network requests. The builder will inline strings loaded using `dojo/text`. So, for example, to load a template for a templated widget, you would define your module like this:

```js
// in "my/widget/NavBar.js"
define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/NavBar.html"
], function(declare, _WidgetBase, _TemplatedMixin, template){
	return declare([_WidgetBase, _TemplatedMixin], {
		// template contains the content of the file "my/widget/templates/NavBar.html"
		templateString: template
	});
});```


#### [dojo/i18n](/reference-guide/1.10/dojo/i18n.html)

`dojo/i18n` loads language resource bundles according to the web browser's user locale. Its usage looks like this:

```js
// in "my/widget/Dialog.js"
define([
	"dojo/_base/declare",
	"dijit/Dialog",
	"dojo/i18n!./nls/common"
], function(declare, Dialog, i18n){
	return declare(Dialog, {
		title: i18n.dialogTitle
	});
});```


Read the [internationalization tutorial](../i18n/) for more information on how to use `i18n`.

#### [dojo/has](/reference-guide/1.10/dojo/has.html)

Dojo’s loader includes an implementation of the [has.js](https://github.com/phiggins42/has.js) feature detection API; the `dojo/has` plugin leverages this functionality for requiring modules conditionally. Its usage looks like this:

```js
// in "my/events.js"
define([
	"dojo/dom",
	"dojo/has!dom-addeventlistener?./events/w3c:./events/ie"
], function(dom, events){
	// events is "my/events/w3c" if the "dom-addeventlistener" test was true, "my/events/ie" otherwise
	events.addEvent(dom.byId("foo"), "click", function(){
		console.log("Foo clicked!");
	});
});```


#### [dojo/domReady](/reference-guide/1.10/dojo/domReady.html)

dojo/domReady is the replacement for `dojo.ready`. It is a module that simply doesn’t resolve until the DOM is ready. Its usage looks like this:

```js
// in "my/app.js"
define(["dojo/dom", "dojo/domReady!"], function(dom){
	// This function does not execute until the DOM is ready
	dom.byId("someElement");
});```


Note that we aren't defining a parameter in our callback function for any return value of dojo/domReady. This is because its return value is worthless—we are simply using it to defer the callback. Required modules or plugins with unused return values should be included at the end of your list of required dependencies, since the order between the modules and their local variable names depends on order.

Even though no data is being passed to the plugin, the exclamation point is still required. Without it, you will just load the dojo/domReady module as a dependency instead of activating its special plugin features.

### Conclusion

The basic understanding of AMD provided in this tutorial will get you started with Dojo development, but you will soon find yourself running into more complicated scenarios. Read the [Advanced AMD Usage](../modules_advanced/) tutorial to learn how to deal with:

*   Configuring the loader so that it works when the loader and packages are in different locations, even different servers
*   Creating packages of portable modules
*   Loading multiple versions of the same module or library
*   Loading non-AMD code

### Resources

*   [AMD Specification](https://github.com/amdjs/amdjs-api/wiki/AMD)