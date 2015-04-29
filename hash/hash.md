---
Category:  Fundamentals
...

## Using dojo/hash and dojo/router

In JavaScript applications, modifying the URL hash is a great way to provide bookmarkable, history-enabled page states.
With dojo/hash, adding this functionality is easy. Coupled with dojo/router, dojo/hash can be a powerful tool for
creating robust and interactive applications.

### Getting started

When writing a JavaScript-based web site or application, it is important to ensure that standard browser controls—like
back/forward buttons and bookmarks—continue to work correctly, even if the browser hasn’t navigated to an entirely new
page. Using the [`dojo/hash`](../hash/) module, it is possible to provide bookmarkable,
history-enabled page states across all browsers.

### Changing the hash

Let’s say we are creating a simple page that uses Ajax to load new content into the body of the page:

```html
	<!DOCTYPE html>
	<html>
		<head>
			<title>Welcome</title>
			<link rel="stylesheet" href="style.css">
		</head>
		<body>
			<ul id="menu">
				<li><a href="index.html">Home</a></li>
				<li><a href="about.html">About us</a></li>
			</ul>
			<div id="content">Welcome to the home page!</div>
			<!-- load dojo and provide config via data attribute -->
			<script src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js" data-dojo-config="isDebug: 1, async: 1, parseOnLoad: 1"></script>
			<script>
				require([
					"dojo/dom",
					"dojo/dom-attr",
					"dojo/on",
					"dojo/request",
					"dojo/query"
				], function(dom, domAttr, on, request){
					var contentNode = dom.byId("content");

					on(dom.byId("menu"), "a:click", function(event){
						// prevent loading a new page - we're doing a single page app
						event.preventDefault();
						var page = domAttr.get(this, "href").replace(".html", "");
						loadPage(page);
					});

					function loadPage(page){
						// get the page content using an Ajax GET
						request(page + ".json", {
							handleAs: "json"
						}).then(function (data) {
							// update the page title and content
							document.title = data.title;
							contentNode.innerHTML = data.content;
						});
					}
				});
			</script>
		</body>
	</html>
```

<a href="demos/demo1" class="button">View Demo</a>

This code updates the content and title of the page using JavaScript. It doesn’t actually change the browser’s history or the URL at all. This means that if someone bookmarks the page, or tries to navigate using the browser’s back and forward controls, they will find that it simply doesn’t work—there are no pages to go back to, and the bookmarked page will always start at whatever page was first loaded. With two small modifications, we can get a URL that is updated when new content is requested:

```js
	require([
		"dojo/dom",
		"dojo/dom-attr",
		"dojo/hash",
		"dojo/on",
		"dojo/request",
		"dojo/query" // for dojo/on event delegation
	], function(dom, domAttr, hash, on, request){
		var contentNode = dom.byId("content");

		on(dom.byId("menu"), "a:click", function(event){
			// prevent loading a new page - we're doing a single page app
			event.preventDefault();
			var page = domAttr.get(this, "href").replace(".html", "");
			loadPage(page);
		});

		function loadPage(page){
			hash(page);

			// get the page content using an Ajax GET
			request(page + ".json", {
				handleAs: "json"
			}).then(function (data) {
				// update the page title and content
				document.title = data.title;
				contentNode.innerHTML = data.content;
			});
		}
	});
```

<a href="demos/demo2" class="button">View Demo</a>

By calling `dojo/hash`, the page’s URL is updated to reflect its new state, and entries are added to the browser’s
history. However, when users try to use the back/forward buttons, while the URL now changes, nothing else happens. In
order to make this all work, we have to add code to respond to changes to the hash. Luckily, this is just as easy.

### Responding to hash changes: [dojo/topic](/reference-guide/1.10/dojo/topic.html)

In order to listen for hash changes, all we need to do is subscribe to the `/dojo/hashchange` topic:

```js
	topic.subscribe("/dojo/hashchange", function(hash){
		loadPage(hash);
	});
```
Now, whenever the hash of the page changes, our code will receive a notification containing the new hash value. This
message is only ever published when the hash actually changes, so we don’t have to worry about getting stuck in a loop
or doing a bunch of unnecessary work if the hash gets set to an identical value later. (That said, in our example, due
to the circular logic between the `/dojo/hashchange` subscriber and the `loadPage` function, we store the last page
requested in order to avoid making a second redundant request to the server when the hash is updated by `loadPage`.)

The one last thing that we need to do in order to complete state management is to ensure that we are paying attention
to what the initial value of the hash is when the page loads. There are a couple of ways this can be done, but the
simplest is just to call `dojo/hash` with the hash of the page when it first loads, if one exists:

```js
	hash(location.hash || lastPage, true);
```

With this code in place, the page will load, then immediately fetch the correct content for the given hash. Note that
we’ve passed `true` as a second parameter to `dojo/hash`; this simply means that the new page will be _replacing_ the
current page in the browser’s history, rather than being added as a new page. This can also be useful in cases where a
URL is invalidated in response to an action and needs to be removed from the user’s browser history (for instance, in a
content management system, when someone deletes a record).

<a href="demos/demo3" class="button">View Demo</a>

### Responding to hash changes: [dojo/router](/reference-guide/1.10/dojo/router.html)

If the logic you are evaluating in your handler for the `/dojo/hashchange` topic starts to seem excessive, you will may
 want to use `[dojo/router](/reference-guide/1.10/dojo/router.html)` instead. `dojo/router` will automate some of the
 parsing of the hash value and allow you to easily map hash values to handler functions. It also provides
 pattern-matching and parameterization of the hash, so that parts of the hash string can be parsed out and used as
 variables within the handler function.

```js
	router.register("/user/:id", function (event) {
		console.log("Hash change", event.params.id);
	});
```

<a href="demos/demo4" class="button">View Demo</a>

If you are using `dojo/router`, you may also use its `go` method, which is a convenience method for changing the hash.

```js
	router.go("hash");
```

The following demo gives a more in-depth example of a useful implementation of `dojo/router's` pattern-matching:
loading users by id with the hash value pattern `#/user/<id>`.

<a href="demos/router" class="button">View Demo</a>

### Caveats

In the future, it’s likely that `dojo/hash` will be extended or replaced with a mechanism that supports emerging HTML
features like [HTML5 session history and navigation](http://www.w3.org/html/wg/drafts/html/master/browsers.html#history).
For now, though, it operates entirely on the hash part of the URL, which means some caveats apply (though they are less
severe than no state management at all).

The first and most important problem with using the hash for state management is that it creates URLs that are not
indexable by search engines. If you want your content to be indexed, you must either ensure your site gracefully
degrades (as our example does &mdash; the links are to valid endpoints, we simply cancel loading them via URL change
and instead load the data with AJAX), or that you follow the instructions published by Google at
[Making AJAX Applications Crawlable](https://code.google.com/web/ajaxcrawling/docs/getting-started.html).

The second, less important problem with using the hash is that it was originally intended for linking to content
_within_ a page, based on the ID of an element. If you have an element in your page with an ID matching the hash
that you are using, the browser _will_ scroll to it. In this case, prefixing your hashes to ensure they do not match
any element IDs is an easy way to work around the issue. In the above example, this could be done by changing four
lines:

```js
	require([
		"dojo/dom",
		"dojo/dom-attr",
		"dojo/hash",
		"dojo/on",
		"dojo/request",
		"dojo/topic",
		"dojo/query" // for dojo/on event delegation
	], function(dom, domAttr, hash, on, request, topic){
		// find the content element and store a reference
		var contentNode = dom.byId("content"),
			prefix = "!",
			// store the last requested page so we do not make multiple requests for the same content
			lastPage = (/([^\/]+).html$/.exec(location.pathname) || [])[1] || "index";

		on(dom.byId("menu"), "a:click", function(event){
			// prevent loading a new page - we're doing a single page app
			event.preventDefault();
			var page = domAttr.get(this, "href").replace(".html", "");
			loadPage(page);
		});

		topic.subscribe("/dojo/hashchange", function(newHash){
			// parse the plain hash value, e.g. "index" from "!index"
			loadPage(newHash.substr(prefix.length));
		});

		hash(prefix + (location.hash || lastPage), true); // set the default page hash

		function loadPage(page){
			hash(prefix + page);

			// get the page content using an Ajax GET
			request(page + ".json", {
				handleAs: "json"
			}).then(function (data) {
				// update the page title and content
				document.title = data.title;
				contentNode.innerHTML = data.content;
			});
		}
	});
```

Our final demo includes the following important functionality for a user-friendly and web-friendly single-page
application:

*   When a link is clicked, cancel following it (`event.preventDefault`) and set the hash instead
*   Listen for hash changes and update content appropriately
*   Set the hash and page content on initial page load
*   Prefix hashes so they don't conflict with linking to elements within the page

This makes the application bookmarkable, allows natural navigation with the browser’s back and forward controls, and
makes the site easily indexable by search engines. The site is even navigable by clients with JavaScript disabled.

<a href="demo/index.html" class="button">View Demo</a>

### Conclusion

Using `dojo/hash`, it is easy to create applications that are highly responsive while still allowing users to interact
with all of the normal browser features. A few lines of code is all it takes to add complete state management to a
JavaScript-enhanced Web site or application.