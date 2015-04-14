---
Category:  Fundamentals
...

## Ajax with dojo/request

[dojo/request](http://dojotoolkit.org/reference-guide/1.10/dojo/request.html) is a new API (introduced in Dojo 1.8) for making requests to a server from the client.  This tutorial introduces the `dojo/request` API:  you'll learn how to request a text file from the server, handle errors if they occur, post information to the server, take advantage of the notify API, and use the registry to use the same code to request data from different locations.


### Getting Started

`dojo/request` allows you to send and receive data to and from the server without reloading the page
(commonly known as AJAX).  The new features introduced make written code more compact and the execution lightning
fast. This tutorial mentions `dojo/promise` and `dojo/Deferred`, which
 `dojo/request` uses for asynchronous programming. Because it's impossible to learn everything at
once, just keep in mind that promises and Deferreds allow for easier programming of non-blocking asynchronous code.
After this tutorial, you'll want to check out those tutorials.

### Introducing dojo/request

Let's take a look at a simple example:

```js
require(["dojo/request"], function(request){
	request("helloworld.txt").then(
		function(text){
			console.log("The file's content is: " + text);
		},
		function(error){
			console.log("An error occurred: " + error);
		}
	);
});
```


In a browser, the code above will execute an HTTP GET request using an `XMLHttpRequest` to
`helloworld.txt` and return a
[`dojo/promise/Promise`](/reference-guide/1.10/dojo/promise/Promise.html)
. If the request is successful, the
first function passed to `then()` is executed with the text of the file as its only argument; if the
request fails, the second function passed to `then()` will execute with an error object as its only
argument. But what if there is form data to send to the server? Or the response is JSON or XML? No problem &mdash;
the `dojo/request` API allows for request customization.

### The dojo/request API

Every request needs one thing: an end-point. Because of this, `dojo/request`'s first parameter is
the URL to request.

Web developers need flexibility in their tools in order to adapt them for their applications and for multiple
environments. The `dojo/request` API takes this into account: the first, non-optional, parameter to
`dojo/request` is the URL to request. A second parameter can be specified to customize a request using
an `Object`. Some of the most-used options available are:

*   **method** - An uppercase string representing the HTTP method to use to make the request.
		Several helper functions are provided to make specifying this option easier (`request.get`,
		`request.post`, `request.put`, `request.del`).
*   **sync** - A boolean that, if true, causes the request to block until the server has
		responded or the request has timed out.
*   **query** - A string or key-value object containing query parameters to append to
		the URL.
*   **data** - A string, key-value object, or `FormData` object containing data to
		transfer to the server.
*   **timeout** - Time in milliseconds before considering the request a failure and triggering
		the error handler.
*   **handleAs** - A string representing how to convert the text payload of the response before
		passing the converted data to the success handler. Possible formats are "text" (the default), "json",
		"javascript", and "xml".
*   **headers** - A key-value object containing extra headers to send with the request.

Let's take a look at an example using some of these options:

```js
require(["dojo/request"], function(request){
	request.post("post-content.php", {
		data: {
			color: "blue",
			answer: 42
		},
		headers: {
			"X-Something": "A value"
		}
	}).then(function(text){
		console.log("The server returned: ", text);
	});
});
```


This example executes an HTTP POST request to `post-content.php`; a simple object (`data`)
is also serialized and sent as POST data with the request as well as an "X-Something" header. When the server
responds, the payload is used as the value of the promise returned from `request.post`.

### Examples: request.get and request.post

The following are some common uses of `dojo/request`.

#### Display the contents of a text file on a page

This example uses `dojo/request.get` to request a text file.  A good use of this approach would be to provide text for terms and conditions or privacy for a site, because the text files would only be sent to the client if they were specifically requested, and it is easier to maintain text in a file than in code.

```js
require(["dojo/dom", "dojo/on", "dojo/request", "dojo/domReady!"],
	function(dom, on, request){
		// Results will be displayed in resultDiv
		var resultDiv = dom.byId("resultDiv");

		// Attach the onclick event handler to the textButton
		on(dom.byId("textButton"), "click", function(evt){
			// Request the text file
			request.get("../resources/text/psalm_of_life.txt").then(
				function(response){
					// Display the text file content
					resultDiv.innerHTML = "<pre>"+response+"</pre>";
				},
				function(error){
					// Display the error returned
					resultDiv.innerHTML = "<div class=\"error\">"+error+"<div>";
				}
			);
		});
	}
);
```

[View Demo](demo/dojo-request-xhr.html)

#### Login demo

In the example below, a POST request is used to send the username and password to the server and the result from the server is displayed.

```js

require(["dojo/dom", "dojo/on", "dojo/request", "dojo/dom-form"],
	function(dom, on, request, domForm){

		var form = dom.byId('formNode');

		// Attach the onsubmit event handler of the form
		on(form, "submit", function(evt){

			// prevent the page from navigating after submit
			evt.stopPropagation();
			evt.preventDefault();

			// Post the data to the server
			request.post("../resources/php/login-demo.php", {
				// Send the username and password
				data: domForm.toObject("formNode"),
				// Wait 2 seconds for a response
				timeout: 2000

			}).then(function(response){
				dom.byId('svrMessage').innerHTML = response;
			});
		});
	}
);

```

#### Headers demo

In the example below, a POST request is used as above, and the Auth-Token header is accessed.

To access the headers, use the `promise.response.getHeader` method of the
original `Promise` (The `Promise` returned from the `XHR` will
**not** have this property).
Additionally, when using `promise.response.then`, the response will not be the data,
but an object with a data property.

```js

require(["dojo/dom", "dojo/on", "dojo/request", "dojo/dom-form"],
	function(dom, on, request, domForm){
		// Results will be displayed in resultDiv

		var form = dom.byId('formNode');

		// Attach the onsubmit event handler of the form
		on(form, "submit", function(evt){

			// prevent the page from navigating after submit
			evt.stopPropagation();
			evt.preventDefault();

			// Post the data to the server
			var promise = request.post("../resources/php/login-demo.php", {
				// Send the username and password
				data: domForm.toObject("formNode"),
				// Wait 2 seconds for a response
				timeout: 2000
			});

			// Use promise.response.then, NOT promise.then
			promise.response.then(function(response){

				// get the message from the data property
				var message = response.data;

				// Access the 'Auth-Token' header
				var token = response.getHeader('Auth-Token');

				dom.byId('svrMessage').innerHTML = message;
				dom.byId('svrToken').innerHTML = token;
			});
		});
	}
);

```

### JSON (JavaScript Object Notation)

[JSON](http://json.org) is a very common way to encode data for AJAX requests, because it is easy to read, easy to work with, and very compact.  JSON can be used to encode any type of data: JSON support is included in or available for many languages, including [PHP](http://www.php.net/manual/en/ref.json.html), [Java](http://www.json.org/java/), [Perl](http://search.cpan.org/~makamaka/JSON-2.53/lib/JSON.pm), [Python](http://docs.python.org/library/json.html), [Ruby](http://flori.github.com/json/), and [ASP](http://code.google.com/p/aspjson/).

**JSON encoded object**

```json
{
	"title":"JSON Sample Data",
	"items":[{
		"name":"text",
		"value":"text data"
	},{
		"name":"integer",
		"value":100
	},{
		"name":"float",
		"value":5.65
	},{
		"name":"boolean",
		"value":false
	}]
}```


When `handleAs` is set to `"json"`, `dojo/request` treats the response payload
as JSON data and parses it into a JavaScript object.

```js
require(["dojo/dom", "dojo/request", "dojo/json",
		"dojo/_base/array", "dojo/domReady!"],
	function(dom, request, JSON, arrayUtil){
		// Results will be displayed in resultDiv
		var resultDiv = dom.byId("resultDiv");

		// Request the JSON data from the server
		request.get("../resources/data/sample.json.php", {
			// Parse data from JSON to a JavaScript object
			handleAs: "json"
		}).then(function(data){
			// Display the data sent from the server
			var html = "<h2>JSON Data</h2>" +
				"<p>JSON encoded data:</p>" +
				"<p><code>" + JSON.stringify(data) + "</code></p>"+
				"<h3>Accessing the JSON data</h3>" +
				"<p><strong>title</strong> " + data.title + "</p>" +
				"<p><strong>items</strong> An array of items." +
				"Each item has a name and a value.  The type of " +
				"the value is shown in parentheses.</p><dl>";

			arrayUtil.forEach(data.items, function(item,i){
				html += "<dt>" + item.name +
					"</dt><dd>" + item.value +
					" (" + (typeof item.value) + ")</dd>";
			});
			html += "</dl>";

			resultDiv.innerHTML = html;
		},
		function(error){
			// Display the error returned
			resultDiv.innerHTML = error;
		});
	}
);
```


In addition to the encoding the data as JSON in the response, set the [Content-Type](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17) header to _application/json_, either using server configuration such as [Apache's AddType](http://httpd.apache.org/docs/2.0/mod/mod_mime.html#addtype) or adding it to the header with the server side code.

[View Demo](demo/dojo-request-json.html)

### JSONP (Javascript Object Notation with Padding)

AJAX requests are restricted to the current domain.  If you need to request data from a different domain, you can use [JSONP](http://json-p.org).  When using JSONP, a script tag is inserted in the current page, the _src_ file is requested, the server wraps the data in a callback function, and when the response is interpreted, the callback is called with the data as its first argument.  JSONP requests are made with [dojo/request/script](/reference-guide/1.10/dojo/request/script.html).

Let's take a look at a few examples:

#### Using JSONP to request data from a server and handling the response

```js
require(["dojo/dom", "dojo/on", "dojo/request/script",
		"dojo/json", "dojo/domReady!"
], function(dom, on, script, JSON){
	// Results will be displayed in resultDiv
	var resultDiv = dom.byId("resultDiv");

	// Attach the onclick event handler to the makeRequest button
	on(dom.byId('makeRequest'),"click", function(evt){

		// When the makeRequest button is clicked, send the current
		// date and time to the server in a JSONP request
		var d = new Date(),
			dateNow = d.toString();
		script.get("../resources/php/jsonp-demo.php",{
			// Tell the server that the callback name to
			// use is in the "callback" query parameter
			jsonp: "callback",
			// Send the date and time
			query: {
				clienttime: dateNow
			}
		}).then(function(data){
			// Display the result
			resultDiv.innerHTML = JSON.stringify(data);
		});
	});
});
```


Since the response is JavaScript, not JSON, the **Content-Type** header on the response should be _application/javascript_.

#### Using JSONP to request Dojo pull requests from the GitHub API

```js
require(["dojo/dom", "dojo/on", "dojo/request/script",
		"dojo/dom-construct", "dojo/_base/array",
		"dojo/domReady!"
], function(dom, on, script, domConstruct, arrayUtil){
	var pullsNode = dom.byId("pullrequests");

	// Attach the onclick event handler to tweetButton
	on(dom.byId("pullrequestsButton"), "click", function(evt){
		// Request the open pull requests from Dojo's GitHub repo
		script.get("https://api.github.com/repos/dojo/dojo/pulls", {
			// Use the "callback" query parameter to tell
			// GitHub's services the name of the function
			// to wrap the data in
			jsonp: "callback"
		}).then(function(response){
			// Empty the tweets node
			domConstruct.empty(pullsNode);

			// Create a document fragment to keep from
			// doing live DOM manipulation
			var fragment = document.createDocumentFragment();

			// Loop through each pull request and create a list item
			// for it
			arrayUtil.forEach(response.data, function(pull){
				var li = domConstruct.create("li", {}, fragment);
				var link = domConstruct.create("a", {href: pull.url, innerHTML: pull.title}, li);
			});

			// Append the document fragment to the list
			domConstruct.place(fragment, pullsNode);
		});
	});
});
```

[View Demo](demo/dojo-request-script-pulls.html)

### Reporting Status

[dojo/request/notify](/reference-guide/1.10/dojo/request/notify.html) provides a mechanism to report the status of requests made with `dojo/request` (or any provider within `dojo/request`).  Requiring `dojo/request/notify` will allow the providers to emit events which can be listened to and used to report the status of requests. To listen for an event, call the return value of the `dojo/request/notify` module with two parameters: an event name and a listener function. The following are the events that `dojo/request` providers emit:

#### Supported dojo/request/notify events

*   **start** - Emitted when the first in-flight request starts
*   **send** - Emitted prior to a provider sending a request
*   **load** - Emitted when a provider receives a successful response
*   **error** - Emitted when a provider receives an error
*   **done** - Emitted when a provider finishes a request, regardless of success or failure
*   **stop** - Emitted when all in-flight requests have finished

Listeners of `"start"` and `"stop"` receive no arguments. Listeners of `"send"` receive two arguments: an object representing the request and a cancel function. Calling the cancel function will cancel the request before it begins. Listeners of `"load"`, `"error"`, and `"done"` receive one argument: an object representing the response from the server. Let's take a look at an example of this in action:

#### Using dojo/request/notify to monitor the progress of requests

```js
require(["dojo/dom", "dojo/request", "dojo/request/notify",
		"dojo/on", "dojo/dom-construct", "dojo/query",
		"dojo/domReady!"],
	function(dom, request, notify, on, domConstruct){
		// Listen for events from request providers
		notify("start", function(){
			domConstruct.place("<p>Start</p>","divStatus");
		});
		notify("send", function(data, cancel){
			domConstruct.place("<p>Sent request</p>","divStatus");
		});
		notify("load", function(data){
			domConstruct.place("<p>Load (response received)</p>","divStatus");
		});
		notify("error", function(error){
			domConstruct.place("<p class=\"error\">Error</p>","divStatus");
		});
		notify("done", function(data){
			domConstruct.place("<p>Done (response processed)</p>","divStatus");
			if(data instanceof Error){
				domConstruct.place("<p class=\"error\">Error</p>","divStatus");
			}else{
				domConstruct.place("<p class=\"success\">Success</p>","divStatus");
			}
		});
		notify("stop", function(){
			domConstruct.place("<p>Stop</p>","divStatus");
			domConstruct.place("<p class=\"ready\">Ready</p>", "divStatus");
		});

		// Use event delegation to only listen for clicks that
		// come from nodes with a class of "action"
		on(dom.byId("buttonContainer"), ".action:click", function(evt){
			domConstruct.empty("divStatus");
			request.get("../resources/php/notify-demo.php", {
				query: {
					success: this.id === "successBtn"
				},
				handleAs: "json"
			});
		});
	}
);
```

### dojo/request/registry

[dojo/request/registry](/reference-guide/1.10/dojo/request/registry.html) provides a mechanism to route requests based on the URL requested.  Common uses of the registry are to assign a provider based on whether the request will be made to the current domain using _JSON_, or to a different domain using _JSONP_.  You may also use this approach if the URLs can vary based on the operations in progress.

#### dojo/request/registry syntax

```js
request.register(url, provider, first);
```


#### dojo/request/registry parameters

*	**url** - The url may be a string, regEx, or function.

	*	**string** - If the url is a string, the provider will be used if the url is an exact match.
    *	**regExp** - If the url is regular expression, the provider will be used if the regular expression matches the requested URL.
    *	**function** - If the url is a function, the function will be passed the URL and options object of the request. If the function returns a [truthy](http://www.sitepoint.com/javascript-truthy-falsy/) value, the provider will be used for the request
*	**provider** - The provider to use to handle the request.
*	**first** - An optional boolean parameter. If truthy, registers the provider before other already registered providers.

Let's take a look at one final example:

#### Using dojo/request/registry to assign the provider based on the URL of requests

```js
require(["dojo/request/registry", "dojo/request/script", "dojo/dom",
		"dojo/dom-construct", "dojo/on", "dojo/domReady!"],
	function(request, script, dom, domConstuct, on){
		// Registers anything that starts with "http://"
		// to be sent to the script provider,
		// requests for a local search will use xhr
		request.register(/^https?:\/\//i, script);

		// When the search button is clicked
		on(dom.byId("searchButton"), "click", function(){
			// First send a request to twitter for all tweets
			// tagged with the search string
			request("http://search.twitter.com/search.json", {
				query: {
					q:"#" + dom.byId("searchText").value,
					result_type:"mixed",
					lang:"en"
				},
				jsonp: "callback"
			}).then(function(data){
				// If the tweets node exists, destroy it
				if (dom.byId("tweets")){
					domConstuct.destroy("tweets");
				}
				// If at least one result was returned
				if (data.results.length > 0) {
					// Create a new tweet list
					domConstuct.create("ul", {id: "tweets"},"twitterDiv");
					// Add each tweet as an li
					while (data.results.length>0){
						domConstuct.create("li", {innerHTML: data.results.shift().text},"tweets");
					}
				}else{
					// No results returned
					domConstuct.create("p", {id:"tweets",innerHTML:"None"},"twitterDiv");
				}
			});
			// Next send a request to the local search
			request("../resources/php/search.php", {
				query: {
					q: dom.byId("searchText").value
				},
				handleAs: "json"
			}).then(
				function(data){
					dom.byId('localResourceDiv').innerHTML =
						"<p><strong>" + data.name + "</strong><br />" +
						"<a href=\"" + data.url + "\">" + data.url + "</a><br />";
				},
				function(error){
					// If no results are found, the local search returns a 404
					dom.byId('localResourceDiv').innerHTML = "<p>None</p>";
				}
			);
		});
	}
);
```

### Best Practices

Best practices for using `dojo/request` include:

*   Careful choice of request method.  Generally, _GET_ is used for simple requests of data without security considerations.  _GET_ is often faster than _POST_.  _POST_ is usually used to send form data and when the data should not be passed on the URL.
*   Use of HTTPS for data which should be protected and on HTTPS pages.
*   Since AJAX requests don't refresh the page, most users appreciate status updates, from _Loading ..._ to _Done_.
*   Error callbacks should be used for graceful detection and recovery of request failures.
*   Use available developer tools to resolve problems more quickly.
*   Test your code carefully with as many browsers as possible.

### Conclusion

`dojo/request` provides a cross-browser compliant AJAX interface for requests to the current domain and others, including graceful error handling, support for notification, and request routing based on URL.  The promise returned by `dojo/request` is a [promise](/reference-guide/1.10/dojo/promise/Promise.html), allowing a series of requests to be issued and the responses processed asynchronously.  Pages can include content from multiple sources and use the data from each request as soon as it is available.  Turbocharge your pages with `dojo/request`!

### Resources

*   [dojo/request Documentation](/reference-guide/1.10/dojo/request.html)
*   [JSONP Tutorial](../jsonp)
*   [Getting Started with Deferreds Tutorial](../deferreds)
*   [Dojo Deferreds and Promises Tutorial](../promises)
*   [JSON](http://json.org/) Introducing JSON
*   [JSONP](http://json-p.org/) JSON-P Documentation
*   [Comparison of GET and POST](http://www.diffen.com/difference/Get_vs_Post)
*   [Future and Promises](http://en.wikipedia.org/wiki/Futures_and_promises) Wikipedia article