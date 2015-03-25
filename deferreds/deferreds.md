## Deferreds

In this tutorial, you'll learn the basics of using Dojo's Deferred implementation, which are a way to easily work with asynchronous actions, such as Ajax calls.

### Getting Started

When you hear the term "Deferred" for the first time, it might sound like a mystical object, when in fact it is a powerful tool for working with asynchronous operations, such as Ajax. In its simplest form, a Deferred waits until a later time to perform an action; essentially, you're deferring the action until a prior action is completed. Ajax is one such situation: We don't want to take some actions until we know that the server has successfully sent information back to us. Being able to wait for that returned value is key. For this tutorial, we will be combining our knowledge from the [Ajax tutorial](../ajax/) and discovering how to use Deferreds to improve our interactions with all things asynchronous.

### dojo/Deferred

Dojo's implementation of a deferred object is `dojo/Deferred` (and has been around since version 0.3), and was refactored for Dojo 1.8. After instantiating a `Deferred`, an action, or callback as we will refer to it from now on, can be registered by passing a function to the `then` method, which will be called when the `Deferred` is resolved (a success). The `then` method also takes a second argument: a function that will be called if the `Deferred` is rejected (an error), often referred to as the `errback`. Let's take a look at an example to gain a better understanding:

```js
require(["dojo/Deferred", "dojo/request", "dojo/_base/array", "dojo/dom-construct", "dojo/dom", "dojo/domReady!"],
	function(Deferred, request, arrayUtil, domConstruct, dom) {

		// Create a deferred and get the user list
		var deferred = new Deferred(),
			userlist = dom.byId("userlist");

		// Set up the callback and errback for the deferred
		deferred.then(function(res){
			arrayUtil.forEach(res, function(user){
				domConstruct.create("li", {
					id: user.id,
					innerHTML: user.username + ": " + user.name
				}, userlist);
			});
		},function(err){
			domConstruct.create("li", {
				innerHTML: "Error: " + err
			}, userlist);
		});

		// Send an HTTP request
		request.get("users.json", {
			handleAs: "json"}).then(
			function(response){
				// Resolve when content is received
				deferred.resolve(response);
			},
			function(error){
				// Reject on error
				deferred.reject(error);
			}
		);
});
```

[View Demo](demo/deferred.html)

In this example, we create a `Deferred` and register a callback and an errback. We also call `request.get`, an asynchronous operation, to fetch "users.json". If our fetch succeeds, it will resolve the deferred and our callback will be called; if our fetch fails, it will reject the deferred and our errback will be called.

You might be asking yourself, "Do I really have to set up `dojo/Deferred` like this every time?" The answer is, "No." All of Dojo's Ajax methods return `dojo/promise/Promise`'s that resolve on success and get rejected on error:

```js
require(["dojo/request", "dojo/_base/array", "dojo/dom-construct", "dojo/dom", "dojo/domReady!"],
	function(request, arrayUtil, domConstruct, dom) {

		var deferred = request.get("users.json", {
			handleAs: "json"
		});

		deferred.then(function(res){
			var userlist = dom.byId("userlist");

			arrayUtil.forEach(res, function(user){
				domConstruct.create("li", {
					id: user.id,
					innerHTML: user.username + ": " + user.name
				}, userlist);
			});
		},function(err){
			// This shouldn't occur, but it's defined just in case
			alert("An error occurred: " + err);
		});

});
```

[View Demo](demo/xhr.html)

We're registering a callback with `then`. If the Ajax call succeeds, the Deferred is resolved and the first argument that would normally be passed to the `load` function is passed to the callback. If the Ajax call fails, the Deferred is rejected and the error is passed to the errback.

Within our callback, we loop through the users returned from the server and create a list item for each one, just like we might if it were set up as the `load` property. However, by using a Deferred, we're now able to decouple the retrieval action (the Ajax call) from the actions that we take with that data. This decoupling of actions is a very powerful aspect of Deferreds.

### Chaining

Although Deferreds are a fairly simple concept once you get the hang of it, `dojo/Deferred` contains some powerful features. One of those features is chaining: the result of a `then` call acts like a new Deferred, but for the value returned by the callback. This might sound confusing at first, so let's set up an example.

Let's say that instead of returning objects for users, the server is returning lists of values for each user. This isn't very practical, so we register a callback to transform the list into something a bit more usable. Each successive callback registered against the result of the first `then` call will now have the list of usable users passed to it.

```js
require(["dojo/request", "dojo/_base/array", "dojo/json", "dojo/dom-construct", "dojo/dom", "dojo/domReady!"],
	function(request, arrayUtil, JSON, domConstruct, dom) {

		var original = request.get("users-mangled.json", {
			handleAs: "json"
		});

		var result = original.then(function(res){
			var userlist = dom.byId("userlist1");

			return arrayUtil.map(res, function(user){
				domConstruct.create("li", {
					innerHTML: JSON.stringify(user)
				}, userlist);

				return {
					id: user[0],
					username: user[1],
					name: user[2]
				};
			});
		});

		// Our result object has a `then` method that accepts a callback,
		// like our original object -- but the value handed to the callback
		// we're registering here is *NOT* the data from the Ajax call,
		// but the return value from the callback above!
		result.then(function(objs){
			var userlist = dom.byId("userlist2");

			arrayUtil.forEach(objs, function(user){
				domConstruct.create("li", {
					innerHTML: JSON.stringify(user)
				}, userlist);
			});
		});
});
```

The returned value from the `then` method is known more specifically as a promise, which implements a specific API. You can head to [the promises tutorial](../promises/) to get more details, but for now, know that a promise offers up a `then` method which is identical to `then` for Deferreds.

One important thing to note: The original Deferred is untouched by this chaining, and the server's list remains intact if a callback is registered with the original Deferred:

```js
original.then(function(res){
	var userlist = dom.byId("userlist3");

	arrayUtil.forEach(res, function(user){
		domConstruct.create("li", {
			innerHTML: JSON.stringify(user)
		}, userlist);
	});
});
```

[View Demo](demo/chaining.html)

This example is fairly arbitrary, but chaining can be used to modify data for your application's consumption. In the case of the example, something like the following could have been done:

```js
require(["dojo/request", "dojo/_base/array", "dojo/dom-construct", "dojo/dom", "dojo/domReady!"],
	function(request, arrayUtil, domConstruct, dom) {

		function getUserList(){
			return request.get("users-mangled.json", {
				handleAs: "json"
			}).then(function(response){
				return arrayUtil.map(response, function(user){
					return {
						id: user[0],
						username: user[1],
						name: user[2]
					};
				});
			});
		}

		getUserList().then(function(users){
			var userlist = dom.byId("userlist");
			arrayUtil.forEach(users, function(user){
				domConstruct.create("li", {
					id: user.id,
					innerHTML: user.username + ": " + user.name
				}, userlist);
			});
		});
});
```

[View Demo](demo/chaining-practical.html)

Now any code that uses `getUserList` will always get a list of user objects.

### Lists of Deferreds

Sometimes you'll need to fetch data from multiple sources in parallel, and want to be notified when all requests are complete. You could likely set up some sort of Deferreds calling Deferreds system, with counts of returns etc etc, but like the first example in this tutorial, you don't have to do it manually.  Prior to Dojo 1.8, this was handled with `Dojo/DeferredList`. As of 1.8, this is handled with `dojo/promise/all` and `dojo/promise/first`, which are now covered in the [promises tutorial](../promises).

### Conclusion

Since most JavaScript applications work with Ajax, a simple and elegant solution for registering actions is needed, and `dojo/Deferred` gives us just that. While being simple, it adds power with chaining.

### Resources

* [dojo/Deferred Reference Guide](/reference-guide/1.10/dojo/Deferred.html)
* [dojo/Deferred API](/api/1.10/dojo/Deferred.html)
* [Ajax with dojo/request Tutorial](../ajax)
* [Dojo Deferreds and Promises Tutorial](../promises)
* [Future and Promises](http://en.wikipedia.org/wiki/Futures_and_promises) Wikipedia article