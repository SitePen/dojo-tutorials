## Feature Detection and Device Optimized Builds

Dojo now uses the popular `has()` pattern for feature detection in
combination with a `has()`-aware build system. While it is easy enough
to write feature detection tests with ad-hoc JavaScript expressions, the
`has()` pattern defines a specific syntax such that the build system
can detect these feature-based branches, and one can create application builds
that are highly optimized for specific devices, with known feature shims factored out.

### Getting Started

<!-- protip -->
> Make sure you have reviewed the concepts presented in the [Creating Builds tutorial](../build).

The mobile device revolution has placed new demands on web applications. Mobile devices generally have lower bandwidth and lower CPU capacity, forcing us to avoid large complex code. Fortunately, the mobile space has a greater percentage of users running modern browsers than on desktops, so it is feasible to write similar applications with much less code when targeting mobile browsers. However, dealing with the multitude of different platforms is non-trivial, and creating appropriately small packages of code for mobile devices, while still providing sufficient capability for older desktop browsers can be challenging. While there are different ways to deal with platform discrepancies, the hard lessons of the last decade have shown that feature detection is **the** mechanism for branching.

Fortunately, Dojo 1.7+ has evolved with a powerful new feature detection infrastructure. Dojo now uses the popular [`has()`](https://github.com/phiggins42/has.js) pattern for feature detection in combination with a `has()`-aware build system. While it is easy enough to write feature detection tests with ad-hoc JavaScript expressions, the `has()` pattern defines a specific syntax such that the build system can detect these feature-based branches, and one can create application builds that are highly optimized for specific devices, with known feature shims factored out.

Since Dojo's codebase in 1.8 has already been significantly refactored to use the `has()` pattern, we can instantly start making platform-optimized builds without even using `has()` in our own code. Certainly the most common and likely target for an optimized build is the modern WebKit platform used on the majority of mobile devices. Now there are some small variations between different WebKit versions used in the mobile world, but there a significant number of important known features that we can rely on to create builds for WebKit browsers and mobile devices. To specify the known features, we include an object with the features in the `staticHasFeatures` property of a build profile file. Here is a sample start to a build profile that covers the major features that Dojo uses:

```js
var profile = {
	// ...
	action: "release",
	layerOptimize: "closure",

	staticHasFeatures: {
		"dom-addeventlistener": true,
		"dom-qsa": true,
		"json-stringify": true,
		"json-parse": true,
		"bug-for-in-skips-shadowed": false,
		"dom-matches-selector": true,
		"native-xhr": true,
		"array-extensible": true,
		"quirks": false,
		"dom-quirks": false
	},
	// ...
```

With this profile, the build system will find any feature branches in the code, and substitute the known features (or bugs) provided.

<!-- protip -->
> Note `layerOptimize: "closure"` in the profile above.  Use of the closure compiler is key for build profiles that include `staticHasFeatures`, as it is capable of performing dead code removal &mdash; that is, removing code blocks that won't ever be used due to the known conditional branches.

After running a build, we now have a built version of Dojo (or our application) without any of the extra code that compensates for a lack of a standard W3C `addEventListener()`, `querySelectorAll()`, and other standard features that are missing in earlier versions of Internet Explorer. When this optimized build is run on base dojo.js, it will save us about 9KB compared to the version of Dojo equipped for running on all supported browsers. This 9KB can be an important savings for size-sensitive applications. We can use this build for a mobile version of our application, or choose this build when we detect a WebKit browser. The former option is simply a matter of pointing to this build for the mobile pages.

When using device-specific builds, we generally will need to run separate builds for each set of features (the build system doesn't support different static features within a single build run). For example, we could create a script:

```
# run build with webkit static features
./build.sh --profile /path/to/webkit-profile.js --releaseDir /target/dojo-webkit
# run build without any features, to work on any other browser
./build.sh --profile /path/to/standard-profile.js --releaseDir /target/dojo-standard
```

If we want to create a page that actually selects the appropriate build at run-time based on the host browser, we can do that with some simple browser detection. While there are a number of different ways we could do this, this is perhaps the simplest:

```html
<script>
    // choose the appropriate dojo script based on the user agent;
    // will match FF, Safari, Chrome, mobile browsers, not IE
    var dojoScript = /Gecko/.test(navigator.userAgent) ?
        "dojo-webkit/dojo/dojo.js" : "dojo-standard/dojo/dojo.js";
    // now create and append a script element to load it:
    var head = document.getElementsByTagName("head")[0],
        element = document.createElement("script");

    element.async=true;

    // configure Dojo for async mode
    var dojoConfig = {
        async: true
    };
    element.src = "path/to/dojo/" + dojoScript;
    // insert the script so it will load
    head.insertBefore(element, head.firstChild);
</script>
```

The script above will asynchronously load Dojo, which will allow your page to load quicker. However, if you need to load Dojo synchronously, you could use document.write instead:

```html
<script>
    // choose the appropriate dojo script based on the user agent
    // will match FF, Safari, Chrome, mobile browsers, not IE
    var dojoScript = /Gecko/.test(navigator.userAgent) ?
        "dojo-webkit/dojo/dojo.js" : "dojo-standard/dojo/dojo.js";
    document.write('<script src="path/to/dojo/' + dojoScript + '"></s' + 'cript>');
</script>
```

<!-- protip -->
> You may have noticed that we used browser sniffing in this example, despite the fact that we advocate feature detection. In general, using feature detection in your source code is definitely preferred because it makes your code robust and agnostic to browser platforms. However, using code based on user agents like the example above avoids the expense of running multiple feature detections (they can be expensive in time and space) at run-time, and can be a valuable optimization. When doing this, make sure the optimization remains distinct from the code that will be using feature detection so there is a clean separation of purposes. Placing this in the HTML, separate from modules, can be a good way to achieve this organization.

Because the build system is based on feature sets, we could go further and create even more platform-specific builds. We could define additional features and make specific builds for different versions of IE (newer versions of IE include more features of course), and separate out Firefox and Opera from WebKit. The feature set based builds allow for limitless permutations of device specific optimizations.

Another build setting that we can also define to create lighter weight builds is the query selector engine. By default, Dojo is built with the "acme" engine that has long been a part of Dojo. However, 1.7 introduced an alternate selector engine called "lite". The "lite" engine leans much more heavily on the native `querySelectorAll` capabilities of modern browsers, and does not have full CSS3 support for older browsers. However, it does support the core CSS2 features that are the workhorse queries predominantly used for most applications (see the [dojo/query documentation](/reference-guide/1.10/dojo/query.html) for more information about the lite engine capabilities). You can choose to use the lite engine if you are targeting modern browsers or if your application does not need to use any fancy CSS3 queries. Select the lite engine in your build profile like this:

```js
var profile = {
	selectorEngine:"lite",
	...
};
```

The lite engine will trim another 6KB from dojo.js.

<!-- protip -->
> Note that at runtime (before a build), the lite engine is the default in async mode, and the acme engine is the default in sync mode. If you specify a selector engine in the build, this will be used in the built application. If you want to ensure that you are using the same selector engine in development as in your build application, you can explicitly choose the lite engine in the dojo config in your page:

```js
var dojoConfig = {
	async: true,
	selectorEngine:"lite"
}
```

## Using has()

In running a build with known features, so far we have simply been taking advantage of the existing feature detection branching in the Dojo code base. However, we may want to use `has()` in our own application. While Dojo normalizes most of the major discrepancies between browsers, there may still be situations where your application needs to detect a feature or bug in the browser and respond accordingly. We can use the `dojo/has` module to access the `has()` function. If we are using an existing feature that Dojo detects, this is very simple:

```js
require(["dojo/has"], function(has){
	if(has("touch")){
		// show our touch interface
	}else{
		// show our mouse-driven interface
	}
});
```

A list of the features that Dojo detects and provides are available on the [dojo/has reference page](/reference-guide/1.10/dojo/has.html). If the Dojo tested features are not sufficient, you can also easily create your own feature detect tests, by calling `has.add()`:

```js
require(["dojo/has"], function(has){
	// test if we have video
	has.add('html5-video', !!document.createElement('video').canPlayType);
	if(has('html5-video')){
		// show our video with a &lt;video&gt; element
	}else{
		// use flash or something
	}
});
```

Both of these examples use the `has()` pattern so the build system can properly identify these feature branches, and you can create builds with known features to eliminate unused branches for specific browsers.

### Conclusion

The new feature detection infrastructure and integration with the build system helps modernize Dojo, using the latest and most advanced techniques for cross-browser web application development and highly optimized mobile web applications.

<!-- resources -->

### Dojo Build Resources

Looking for more detail about builds?  Check out these great resources:

*   [Creating Builds tutorial](../build)
*   [The Dojo Build System](/reference-guide/1.10/build/index.html)