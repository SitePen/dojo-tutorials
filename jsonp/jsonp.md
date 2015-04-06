---
Category:  Fundamentals
...

## JSONP with dojo/request

JSON with Padding (JSONP) has become a common technique for accessing cross-domain resources from the browser.  In this tutorial you learn what JSONP is and how you can use it to retrieve data from cross-domain sources.


### Getting Started

Dojo's baked-in Ajax capabilities provide a simple, yet powerful interface to access resources dynamically.  However, cross-domain security restrictions in the browser prevent you from making XHR requests to another domain.  What to do?  More modern browsers provide the ability to make cross-domain requests following the [Cross-Origin Resource Sharing](http://www.w3.org/TR/cors) specification from the W3C.  However, this is not yet available in all browsers (of course!), and there are a plethora of existing services that don't yet take advantage of this specification.

The answer to cross-domain communication is JSON with Padding, or JSONP.  Bob Ippolito [originally introduced the JSONP technique](http://bob.pythonmac.org/archives/2005/12/05/remote-json-jsonp/) way back in 2005, and today many existing services from Google, GitHub, Facebook (to name a few) all offer API access to their services.  Dojo's `dojo/request/script` module (introduced in 1.8, replacing `dojo/io/script`) provides seamless access to JSONP resources, without some of the messy setup details.

What is this JSONP technique anyway?  Unlike XHR, the browser doesn't prevent scripts from being loaded across domains.  JSONP works by dynamically inserting a `<script>` element onto the page with its source set to the cross-domain URL we want to query. By passing relevant parameters on the URL's query string,
it can return a dynamic response in the format of JavaScript representing the data we requested. For example, a request may go to `endpoint?q=dojo&callback=callme`, and its response will look like:

```html
callme({id: "dojo", some: "parameter"})
```


When the browser then evaluates the code in the script, it will call the `callme()` method&mdash;passing its data along. The local application, having defined the `callme` method, will then receive it.  Note that this is essentially executing script from a third party; because you are executing script from a third party service, it is implied that you are trusting the third party service with your application.  This is not to imply that JSONP is bad or should be avoided, only that its use should be limited to communication with trusted parties.

	Using cross-domain resources with JSONP also reduces contention for connections to your applications' webservers.  Browsers limit the number of requests that can be made to the server at one time. In the worst case, this is two concurrent connections on IE6.   This defaults to 6-8 connections in newer browsers.  When accessing a cross-domain resource, it does not count against the total number of connections to your server.

`dojo/request/script` automates the creation of the script element and callback methods, and provides you the familiar [`Deferred`](../deferreds/) interface you are accustomed to from Dojo.

```js
//include the script modules
require(["dojo/request/script"], "dojo/dom-construct", "dojo/dom", "dojo/_base/array", "dojo/domReady!"
], function(script, domConstruct, dom, arrayUtil){
		// wait for the page and modules to be ready...
		// Make a request to GitHub API for dojo pull requests
			script.get("https://api.github.com/repos/dojo/dojo/pulls", {
				jsonp: "callback"
		});
});
```


This code follows the same basic pattern that you typically see with `dojo/request/xhr`.  The only real addition you'll notice is `jsonp`; this property tells Dojo which parameter the endpoint expects you to specify the callback function's name on (not the callback function name itself). This tends to vary a bit from service to service.  From this point on, you can treat it like you would any other response.  This code retrieves the most recent set of pull requests on the Dojo GitHub repo.  Let's flesh out the example a bit more, and show those results:

```js
//first do the io script request
script.get("https://api.github.com/repos/dojo/dojo/pulls", {
	jsonp: "callback"
}).then(function(response){
	return response.data;
}).then(function(results){
	// Iterate through the response results and add them to the DOM
	var fragment = document.createDocumentFragment();
	arrayUtil.forEach(results, function(pull){
		var li = domConstruct.create("li", {}, fragment);
		var link = domConstruct.create("a", {href: pull.url, innerHTML: pull.title}, li);
	});
	domConstruct.place(fragment, dom.byId("pullrequests"));
});
```


[View Demo](demo/demo.php)

<!-- pro-tip blocks -->
<p class="proTip">
The mechanism which drives JSONP (dynamically inserting a `<script>` tag) is unable to handle errors in the same way a standard Ajax request would. The browser never signals to the application when the script that is loading fails with an HTTP error (404, 500, etc.), and so the `dojo/request/script` callback never receives any signal for this either.  To allow your application to proceed instead of waiting on this script to return forever, you can set a `timeout` property for the `dojo/request/script` request.  If the callback hasn't been completed before the timeout is triggered, the `Deferred` will be rejected so your application can take appropriate action.

<!-- tutorials end with a "Conclusion" block -->

### Conclusion

JSONP gives you access to a rich set of resources which you can creatively mash-up with your own applications to create effective and interesting interfaces with ease.  Most major web service providers provide some amount of access to their services using JSONP.  Even within a single organization, accessing services via JSONP on a different subdomain can reduce contention for the limited number of concurrent connections some browsers allow to the server.  Following the same patterns you are already used to with standard `dojo/request`, you should now be able to consume a cross-domain resource.

If you are looking for practice, you could try to access the Flickr JSON API and display the resulting images. To help you get started, here is a Flickr URL which will return Dojo Toolkit-tagged images: [http://api.flickr.com/services/feeds/photos_public.gne?tags=dojotoolkit&amp;lang=en-us&amp;format=json](http://api.flickr.com/services/feeds/photos_public.gne?tags=dojotoolkit&lang=en-us&format=json)

### For further reading

*   [Tutorial: Ajax with Dojo](../ajax/)
*   [Dojo Toolkit Reference Guide: dojo/request/script](/reference-guide/1.10/dojo/request/script.html)
*   [Dojo Toolkit API Documentation: dojo/request/script](/api/?qs=1.10/dojo/request/script)
*   [Overcome security threats for Ajax applications](http://www.ibm.com/developerworks/xml/library/x-ajaxsecurity.html)