---
Category:  Modules
...

## Advanced AMD Usage

Dojo now supports modules written in the Asynchronous Module Definition (AMD) format, which makes code easier to author and debug. In this tutorial, we learn all about this new module format, and explore how to write an application using it.

<!-- protip -->
> This tutorial is a follow-up to the [Introduction to AMD](../modules/), so make sure you understand the basics of AMD first.

Throughout this tutorial, we will be referring to a hypothetical application with a filesystem structure that looks like this:

```
/
    index.html
    js/
        lib/
            dojo/
            dijit/
            dojox/
        my/
        util/
```

As you can see, this structure is different from what we discussed in the [previous tutorial](../modules/), so we will explain how to configure the loader to make this work. But first let's revisit `require` and `define` with a few more details...

### Delving Deeper into `require`

The `require` function accepts the following parameters:

1.  _configuration_ (optional, default=undefined): an object with loader configuration options - this allows you to reconfigure the loader at run-time.
2.  _dependencies_ (optional, default=[]): an array of module identifiers. If specified, these modules will be resolved before your code is evaluated. They will be loaded in the order they are listed and passed as parameters to your callback function, also in order.
3.  _callback_: a function containing the code you want to run that depends on the modules in `dependencies`. You need to wrap your code in a callback function in order to support asynchronous loading and to be able to use non-global references to the modules.

<!-- protip -->
> The _configuration_ parameter can simply be omitted, no empty placeholder value is necessary.

We'll cover configuring the loader in more detail below; for now here's an example of using the _configuration_ parameter of `require`:

```js
require({
    baseUrl: "/js/",
    packages: [
        { name: "dojo", location: "//ajax.googleapis.com/ajax/libs/dojo/1.10.3/" },
        { name: "my", location: "my" }
    ]
}, [ "my/app" ]);
```

Here, we’ve changed the configuration slightly to point the `dojo` package to the Google CDN. Cross-domain loading support is implicit in the AMD format.

<!-- protip -->
> Note that not all configuration options can be set at runtime. In particular, `async`, `tlmSiblingOfDojo`, and pre-existing `has` tests cannot be changed once the loader is loaded. Additionally, most configuration data is shallow copied, which means that you couldn’t use this mechanism to, for example, add more keys to a custom configuration object—the object would be overwritten.

### Delving Deeper into `define`

The `define` function accepts the following parameters:

1.  _moduleId_ (optional, default=undefined): a module identifier. This parameter is largely a historical artifact of early AMD loaders or to support pre-AMD Dojo, and **should not be provided**.
2.  _dependencies_ (optional, default=[]): an array of module identifiers that are dependencies of your module. If specified, these modules will be resolved before your module is evaluated and they will be passed as parameters to your factory function, in order.
3.  _factory_: the value of your module, or a "factory" function that will return the value

It's important to remember that when defining a module, the factory function is only ever invoked _once_—the returned value is cached by the loader. On a practical level, this means that modules can very easily share objects (similar to _static_ properties in other languages) by loading the same module.

When defining a module, the value can be given as a plain object:

```js
// in "my/nls/common.js"
define({
	greeting: "Hello!",
	howAreYou: "How are you?"
});
```

Keep in mind that if you do define a module without using a factory function, you won’t be able to reference any dependencies, so this type of definition is rare and usually only gets used by [i18n](../i18n/) bundles or simple configuration objects.

### How does the loader work?

When you call `require` to load some modules, the loader has to find the code for the module and then pass it as a parameter to your callback function so you can use it.

1.  First the loader has to _resolve_ the module identifier you passed. This involves putting together the `baseUrl` with the module identifier itself, plus taking into account any modifications required by other configuration options, such as `map` (discussed later in more detail).
2.  At this point the loader has a URL for the module and can load the actual file by creating a new `script` element on the page and setting the `src` attribute to the module's URL.
3.  Once the file is loaded and evaluated, its result is set as the value of the module.
4.  The loader maintains a reference to each module, so the next time the module is requested the loader will return the existing reference.

When an AMD module is loaded, the code is inserted into a new `script` element on the page which results in the `define` function being called. The same process as above happens to load any dependencies passed to `define`, then the loader's reference to your module is set to the value returned by the factory function you passed to `define`. (If you passed a value, rather than a function to `define`, then the loader's reference to your module is set to that value.)

### Configuring the loader

For legacy compatibility reasons, Dojo's loader runs by default in synchronous mode. To put the "A" in "AMD", we need to explicitly configure the loader to run asynchronously. This is done by setting the `async` configuration property to `true`:

```html
<script data-dojo-config="async: true" src="js/lib/dojo/dojo.js"></script>
```

You should get in the habit of enabling this as a standard practice - only disable it when you know you need synchronous behavior. The next thing we need to do is configure the loader with information about where our modules are located:

```js
var dojoConfig = {
	baseUrl: "/js/",
	tlmSiblingOfDojo: false,
	packages: [
		{ name: "dojo", location: "lib/dojo" },
		{ name: "dijit", location: "lib/dijit" },
		{ name: "dojox", location: "lib/dojox" },
		{ name: "my", location: "my", main: "app" }
	]
};
```

<!-- protip -->
> Keep in mind you must set the `dojoConfig` variable before loading `dojo.js`. Read the [Configuring Dojo tutorial](../dojo_config) if you haven't already.

Let's examine the configuration options we're using:

*   `baseUrl` (default = _the path of the folder dojo.js was loaded from_): defines the base URL for loading packages. For example, if you try to load the module "my/widget/Person", the loader will try to load it from:

		/js/my/widget/Person.js

	This allows us to place our files wherever is most convenient in the filesystem (in this case, the "js" folder) and still use only the relevant parts of the path in module ids - we don't need to `require(["js/my/widget/Person"])`, we can simply `require(["my/widget/Person"])` because we have configured the loader to use "/js/" as a base to prepend to all module ids when actually loading the source file.

*   `tlmSiblingOfDojo` (default = _true_): by default, the loader expects to find modules in folders that are siblings of the folder the loader was loaded from (remember, with Dojo the loader is loaded when your script element loads `dojo.js`). If your file structure is like this:

		/
			js/
				dojo/
				dijit/
				dojox/
				my/
				util/

	Then you don't need to configure `baseUrl` or `tlmSiblingOfDojo` &mdash; your top-level modules _are_ siblings of the folder `dojo.js` was loaded from, so `tlmSiblingOfDojo` is true.

*   `packages`: an array of package configuration objects. At the most fundamental level, packages are simply collections of modules. `dojo`, `dijit`, and `dojox` are all examples of packages. Unlike a simple collection of modules in a directory, however, packages are imbued with some extra features that significantly enhance module portability and ease-of-use. A portable package is self-contained and also can be installed through tools like [cpm](https://github.com/kriszyp/cpm). A package configuration allows you to specify:
    *   _name_: the name of the package. This should match the name of the folder that contains the modules.
    *   _location_: the location of the package; can either be a path relative to `baseUrl` _or_ an absolute path. We would like to be able to load modules from the dojo package as "dojo/dom" rather than "lib/dojo/dom" (take another look at the file structure at the beginning of this tutorial), so we specify the `location` property of the dojo package to be "lib/dojo". This informs the loader that an attempt to load the "dojo/dom" module should load the file "/js/lib/dojo/dom.js" (remember, because of `baseUrl` "js" will be prepended).
    *   _main_ (optional, default = _main.js_): used to discover the correct module to load if someone tries to require the package itself. For example, if you were to try to require "dojo", the actual file that would be loaded is "/js/dojo/main.js". Since we’ve overridden this property for the "my" package, if someone required "my", they would actually load "/js/my/app.js".
		> If we tried to require "util", which is _not_ a defined package, the loader would try to load "/js/util.js". You should always define all of your packages in the loader configuration.

### Using portable modules

One of the most important features of the new AMD loader is the ability to create fully portable packages. For instance, if you had an application that needed to use modules from two different versions of Dojo, the new loader makes this very easy.

Suppose you have an application built on an older version of Dojo and you want to update to the latest and greatest 1.10 release, but there are some updates to Dojo that render your older code non-functional. You can still update to the current release of Dojo for new code, while using a legacy release of Dojo for you older code. This can be accomplished with the `map` configuration property:

```js
dojoConfig = {
	packages: [
		{ name: "dojo16", location: "lib/dojo16" },
		{ name: "dijit16", location: "lib/dijit16" },
		{ name: "dojox16", location: "lib/dojox16" },
		{ name: "dojo", location: "lib/dojo" },
		{ name: "dijit", location: "lib/dijit" },
		{ name: "dojox", location: "lib/dojox" },
		{ name: "myOldApp", location: "myOldApp" },
		{ name: "my", location: "my" }
	],
	map: {
		myOldApp: {
			dojo: "dojo16",
			dijit: "dijit16",
			dojox: "dojox16"
		}
	}
};
```

_What's going on here?_

*   (lines 3-5) First we define 3 packages that point to folders containing a legacy release of Dojo
*   (lines 6-8) Next we define 3 packages for the current release of Dojo
*   (lines 9-10) We define packages for our old and current code
*   (lines 12-18) We define a `map` configuration: it applies to the "myOldApp" module, and maps requests for modules from the "dojo", "dijit", and "dojox" packages to "dojo16", "dijit16", and "dojox16", respectively.
*   Modules from the "my" package that load modules from dojo, dijit, dojox will get modules from the current Dojo release.

You can refer to the [AMD Configuration documentation](https://github.com/amdjs/amdjs-api/wiki/Common-Config#map-) for more information about `map`.

If you are already familiar with the loader, specifically the `packageMap` property, it is deprecated - `map` is the configuration option to use moving forward.

### Writing portable modules

You can (and _should_) ensure that modules within packages you create always load files from within the same package by specifying dependencies with _relative_ module identifiers. Given the following code in a module in the "my" package:

```js
// in "my/widget/NavBar.js"
define([
	"dojo/dom",
	"my/otherModule",
	"my/widget/InfoBox"
], function(dom, otherModule, InfoBox){
	// …
});
```

Instead of explicitly requesting modules from the `my` package, use relative module identifiers instead:

```js
// in "my/widget/NavBar.js"
define([
	"dojo/dom",
	"../otherModule",
	"./InfoBox"
], function(dom, otherModule, InfoBox){
	// …
});
```

Relative to "my/widget/NavBar":

*   "dojo/dom" is in a separate package, so we use the full identifier
*   "my/otherModule" is one directory up, so we use "../"
*   "my/widget/InfoBox" is in the same directory, so we use "./"
<!-- protip -->
	> If you just specify "InfoBox" it is interpreted as a package name, so you must start the identifier with "./".

<!-- protip -->
> Keep in mind that relative identifiers can only be used to refer to modules _within the same package_. Relative module ids are also only valid when defining a module - they do _not_ work in the dependency list passed to `require`.

Given the same-package restriction of relative identifiers, look back up at the `map` example &mdash; do you notice something wrong? For simplicity's sake, we focused on the aspects of the configuration that enabled one part of your app to use an old release of Dojo and other parts of your app to use a current release. However, we left out something important - Dijit depends on Dojo, and DojoX depends on both Dojo and Dijit. The configuration below will ensure that those dependencies are resolved correctly. For safety's sake, we've also mapped the Dojo packages to themselves (`map: { dojo16: { dojo: "dojo16" } }`) in case any of the modules failed to use relative identifiers.

```js
var map16 = {
	dojo: "dojo16",
	dijit: "dijit16",
	dojox: "dojox16"
};

dojoConfig = {
	packages: [
		{ name: "dojo16", location: "lib/dojo16" },
		{ name: "dijit16", location: "lib/dijit16" },
		{ name: "dojox16", location: "lib/dojox16" },
		{ name: "dojo", location: "lib/dojo" },
		{ name: "dijit", location: "lib/dijit" },
		{ name: "dojox", location: "lib/dojox" },
		{ name: "myOldApp", location: "myOldApp" },
		{ name: "my", location: "my" }
	],
	map: {
		dojo16: map16,
		dijit16: map16,
		dojox16: map16,
		myOldApp: map16
	}
};
```

### Conditionally requiring modules

Sometimes, you may want to require a module conditionally in response to some condition. For example, you may want defer loading an optional module until an event occurs. This is pretty simple if you’re using explicit module definitions:

```js
define([
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/on"
], function(dom, domConstruct, on){
	on(dom.byId("debugButton"), "click", function(){
		require([ "my/debug/console" ], function(console){
			domConstruct.place(console, document.body);
		});
	});
});
```

Unfortunately, to be completely portable, that "my/debug/console" needs to be turned into a relative identifier. Just changing it doesn’t work, however, because the context of the original module is lost by the time `require` is called. In order to resolve this problem, the Dojo loader offers something called a **context-sensitive require**. In order to use one of these, pass the special module identifier "require" as a dependency in your initial `define` call:

```js
// in "my/debug.js"
define([
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/on",
	"require"
], function(dom, domConstruct, on, require){
	on(dom.byId("debugButton"), "click", function(){
		require([ "./debug/console" ], function(console){
			domConstruct.place(console, document.body);
		});
	});
});
```

Now, the inner `require` call uses the locally bound, context-sensitive `require` function, so we can safely require modules relative to "my/debug".

<!-- protip -->
> _How was_ `require's` _context lost?_

> Remember that `require` is a globally defined function. When the handler for the "click" event executes, the only context it gets from the module it was defined in is the scope. It doesn't know what module it was defined in. There's no "require" in the local scope, so the "require" defined in the global scope is called. Recalling the file system structure referenced throughout this tutorial, if we pass "./debug/console" to `require`, it will attempt to load the file "/js/debug/console.js", which does not exist.
> By using the context-sensitive `require`, we have a local reference to a modified `require` function that maintains the context of the module, so it correctly loads "/js/my/debug/console.js".

Context-sensitive `require` is also very useful for loading resources (images, templates, CSS) for a module. Given the following file system structure:

```
/
    js/
	    my/
		    widget/
			    InfoBox.js
				    images/
						info.png
```

Within `InfoBox.js` we can call `require.toUrl` to get a complete URL referencing "info.png" that can be set as the `src` property on an `img` element.

```js
// in my/widget/InfoBox.js
define([
	"dojo/dom",
	"require"
], function(dom, require){
	// assume DOM structure where #infoBoxImage is an img element
	dom.byId("infoBoxImage").src = require.toUrl("./images/info.png");
});
```

### Handling circular dependencies

When you’re writing code, you may occasionally come across cases where you have two modules that need to refer to each other, and this reference creates a circular dependency. In order to resolve a circular dependency like this, the loader immediately resolves the module that recurses first. For example, given the following example:

```js
// in "my/moduleA.js"
define([ "./moduleB" ], function(moduleB){
	return {
		getValue: function(){
			return "oranges";
		},

		print: function(){
			// dependency on moduleB
			log(moduleB.getValue());
		}
	};
});

// in "my/moduleB.js"
define([ "./moduleA" ], function(moduleA){
	return {
		getValue: function(){
			// dependency on moduleA
			return "apples and " + moduleA.getValue();
		}
	};
});

// in "index.html"
require([
	"my/moduleA"
], function(moduleA) {
	moduleA.print();
});
```

[View Demo](demo/circular.html)

This looks like it should print "apples and oranges", but instead you get an error in `moduleB`: `Object has no method 'getValue'`.
Let's take a look at what the loader will do when you load and run "index.html":

1.  Resolve the dependencies passed to `require` (in `index.html`): `moduleA`
2.  Resolve `moduleA's` dependencies: `moduleB`
3.  Resolve `moduleB's` dependencies: `moduleA`
4.  Detect that it is currently in the process of trying to resolve `moduleA`
5.  Break out of the circular dependency by temporarily resolving `moduleA` as an empty object.
6.  Resume resolving `moduleB` by calling its factory function; the empty object will be passed to the factory function as `moduleA`.
7.  Set the loader's reference to `moduleB` to the return value of the factory function.
8.  Resume resolving `moduleA` by calling its factory function.
9.  Set the loader's reference to `moduleA` to the return value of the factory function &mdash; while the loader now refers to the valid value; **`moduleB` is left still referring to the empty object**.
10.  Execute `moduleA.print` &mdash; since `moduleB` has a bad reference to `moduleA`, when it calls `moduleA.getValue` an error is thrown.

To solve this problem, the loader provides a special "exports" module identifier. When used, this module will return a reference to a persistent object representing the module being defined &mdash; the object will initially be empty, but any modules involved in circular reference resolution will be passed a reference to it. The same reference will be passed into the module that has listed "exports" in its dependencies. With the reference to this persistent object, we can define our properties directly on the object. The sequence of events here can be a little difficult to follow, so take a look at the updated code below and the explanation that follows.

<!-- highlight [2, 3, 7] -->
```js
// in "my/moduleA.js"
define([ "./moduleB", "exports" ], function(moduleB, exports){
	exports.getValue = function(){
		return "oranges";
	};

	exports.print = function(){
		log(moduleB.getValue());
	};
});

// in "my/moduleB.js"
define([ "./moduleA" ], function(moduleA){
	return {
		getValue: function(){
			return "apples and " + moduleA.getValue();
		}
	};
});

// in "index.html"
require([
	"my/moduleA"
], function(moduleA) {
	moduleA.print();
});
```

[View Demo](demo/exports.html)

What happens now when you load and run "index.html":

1.  Resolve the dependencies passed to `require` (in `index.html`): `moduleA`
2.  Resolve `moduleA's` dependencies: `moduleB`
3.  Resolve `moduleB's` dependencies: `moduleA`
4.  Detect that it is currently in the process of trying to resolve `moduleA`.
5.  Break out of the circular dependency by temporarily resolving `moduleA` as an empty object.
6.  Resume resolving `moduleB` by calling its factory function; the empty object will be passed to the factory function as `moduleA`.
7.  Set the loader's reference to `moduleB` to the return value of the factory function.
8.  Resume resolving `moduleA` by calling its factory function &mdash; the empty object that has been created as a placeholder for `moduleA` will be passed to the factory function as the `exports` parameter.
9.  After resolving a module that has listed "exports" as a dependency, the loader's reference to the module is _not_ set to the factory function's return value. Rather, the loader assumes the module set any necessary properties on the empty object that was created as a placeholder and passed to the factory function as the `exports` parameter.
10.  Execute `moduleA.print` &mdash; since `moduleB` has a valid reference to the object that was eventually populated by `moduleA`, when it calls `moduleA.getValue` it works as expected.

It is important to keep in mind that although using exports provides a reference that is eventually valid, it's still just an empty object at the time the dependent module (moduleB) is resolved. When your factory function (for moduleB) is executed, it receives a reference to an empty object (for moduleA). It is only after the circular dependency has been fully resolved (moduleA is temporarily resolved as {}, moduleB is resolved, then moduleA is fully resolved) that the object is updated with the module's (moduleA) methods and properties, which will then be available to functions defined in your factory function (for moduleB), but called later. The following code demonstrates this distinction:

```js
// in "my/moduleA.js"
define([ "./moduleB", "exports" ], function(moduleB, exports){
	exports.isValid = true;

	exports.getValue = function(){
		return "oranges";
	};

	exports.print = function(){
		// dependency on moduleB
		log(moduleB.getValue());
	}
});

// in "my/moduleB.js"
define([ "./moduleA" ], function(moduleA){
	// this code will run at resolution time, when the reference to
	// moduleA is an empty object, so moduleA.isValid will be undefined
	if(moduleA.isValid){
		return {
			getValue: function(){
				return "won't happen";
			}
		};
	}

	// this code returns an object with a method that references moduleA
	// the "getValue" method won't be called until after moduleA has
	// actually been resolved, and since it uses exports, the "getValue"
	// method will be available
	return {
		getValue: function(){
			return "apples and " + moduleA.getValue();
		}
	};
});

// in "index.html"
require([
	"my/moduleA"
], function(moduleA) {
	moduleA.print();
});
```

[View Demo](demo/exports2.html)

### Loading non-AMD code

As mentioned in the section on module identifiers, the AMD loader can also be used to load non-AMD code by passing an identifier that is actually a path to a JavaScript file. The loader identifies these special identifiers in one of three ways:

*   The identifier starts with a “/”
*   The identifier starts with a protocol (e.g. “http:”, “https:”)
*   The identifier ends with “.js”

When arbitrary code is loaded as a module, the module’s resolved value is `undefined`; you will need to directly access whatever code was defined globally by the script.

One feature exclusive to the Dojo loader is the ability to mix-and-match legacy Dojo modules with AMD-style modules. This makes it possible to slowly and methodically transition from a legacy codebase to an AMD codebase instead of needing to convert everything immediately. This works both when the loader is in sync mode _and_ when it is in async mode. When in async mode, the resolved value of a legacy module is whatever object exists in the global scope that matches the file’s first `dojo.provide` call once the script is done being evaluated. For example:

```js
// in "my/legacyModule.js"
dojo.provide("my.legacyModule");
my.legacyModule = {
	isLegacy: true
};
```

When loading this code via the AMD loader through a call to `require(["my/legacyModule"])`, the resolved value of this module will be the object assigned to `my.legacyModule`.

### Server-side JavaScript

One final feature of the new AMD loader is the ability to load JavaScript on the server using either [node.js](http://nodejs.org) or [Rhino](https://www.mozilla.org/rhino/). Loading Dojo via command-line looks like this:

```
# node.js:
node path/to/dojo.js load=my/serverConfig load=my/app

# rhino:
java -jar rhino.jar path/to/dojo.js load=my/serverConfig load=my/app
```

See the [Dojo and Node.js](../node) tutorial for more details.

Each `load=` arguments add modules to a dependency list that is automatically resolved once the loader is ready. In a browser, the equivalent code would look like this:

```html
<script data-dojo-config="async: true" src="path/to/dojo.js"></script>
<script>require(["my/serverConfig", "my/app"]);</script>
```

### Conclusion

The new AMD format brings many exciting new features and capabilities to Dojo; despite its length, this tutorial gives only a very brief overview of everything that the new loader has to offer. To learn more details about all of the new features of the AMD loader, be sure to check out the [Dojo loader reference guide](/reference-guide/1.10/loader/).

### Resources

*   [AMD Specification](https://github.com/amdjs/amdjs-api/wiki/AMD)