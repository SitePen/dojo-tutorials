---
Category:  Modules
...

## CDN

From time to time, it can be useful to load Dojo modules from a CDN. Doing so and using local modules at the same time can seem impossible, however. This tutorial demonstrates how it can be done.

### Introduction

From time to time, it is useful to load Dojo modules from a content delivery network—for example, to create a simple test case that works anywhere, or to offer example code that is easy to distribute and run. Unfortunately, using Dojo from a CDN with custom modules isn't a terribly intuitive process due to the way that module paths are resolved. In order to use a CDN with custom, local modules, some additional configuration needs to occur.

Studies of library CDN usage (such as the article [Should You Use JavaScript Library CDNs?](http://zoompf.com/blog/2010/01/should-you-use-javascript-library-cdns)) show that using CDNs usually offers _worse_ performance than locally hosted scripts, especially since local scripts can be built into layers to significantly reduce HTTP round trips. If you’re trying to use library CDNs to increase the performance of your application, you may want to weigh the decision more carefully.

### Loading our Modules

To use a CDN, start with a simple HTML page that includes the Dojo loader from a CDN:

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Demo</title>
	</head>
	<body>
		<script data-dojo-config="async: 1"
			src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js"></script>
	</body>
</html>
```

This code ensures the AMD-enabled Dojo loader is available to make `require` calls to load other modules.

Prior to Dojo 1.7, the cross-domain Dojo loader script was named `dojo.xd.js`. Due to AMD’s native support for cross-domain loading, this special version is no longer necessary. Also, note that there is no `http:` in the script URL; this means that the same protocol will be used to load from the CDN as is used for the current page (i.e. if the current page loads over HTTPS, so will the code from the CDN).

Next, we need to make sure that Dojo has access to a local copy of the `dojo/resources/blank.html` file, which is used by certain modules (like `dojo/hash`) to enable functionality across domains, by setting the `dojoBlankHtmlUrl` configuration property:

```html
<script data-dojo-config="async: 1, dojoBlankHtmlUrl: '/path/to/blank.html'"
	src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js"></script>
```

Finally, we need to define the location of our local module package(s):

```html
<script data-dojo-config="async: 1, dojoBlankHtmlUrl: '/blank.html',
		packages: [ {
			name: 'custom',
			location: location.pathname.replace(/\/[^/]+$/, '') + '/js/custom'
		} ]"
	src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js"></script>
```

Note that the local package location is using a little JavaScript trickery to create an absolute path that is derived from the path of the current HTML file. Using absolute paths is necessary for the Dojo 1.10 loader to resolve local modules correctly. This same trickery can be used for the `dojoBlankHtmlUrl` key as well, if necessary.

Now that we’ve defined the package that contains our local modules, we’re done! We can simply require them like normal modules:

```js
require([ 'custom/thinger' ], function(thinger){ … });
```

<a href="demo/index.html" class="button">View Demo</a>

### Caveats

Unlike the old Dojo loader, nothing different needs to be done when using built modules from CDN. However, there is an issue that you may run into when using Dojo loaded from CDN:

* Attempting to load unbuilt, _remote_ AMD modules that use the `dojo/text` plugin will fail due to cross-origin security restrictions. (Built versions of AMD modules are unaffected because the calls to `dojo/text` are eliminated by the build system.)

### Conclusion

CDN-based versions of Dojo can be useful in some circumstances.  By making a few simple configuration changes, it is possible to use custom local modules while loading Dojo from a CDN, thanks to the new AMD-based module system.

### Links

* [Dojo configuration reference guide](http://dojotoolkit.org/reference-guide/1.10/dojo/_base/config.html)
* More information on the library CDNs that Dojo uses: [Google CDN](http://code.google.com/apis/libraries/devguide.html) and [Yandex CDN](http://api.yandex.ru/jslibs/).