## Dojo Deferreds and Promises

Deferreds are a wonderful and powerful thing, but they're really an implementation of something greater - a promise. In this tutorial, we'll cover what that means, as well as some additional pieces of Dojo's API to work with both promises and regular values in a uniform way.

### Getting Started

Now that you've learned about [`dojo/request`](../ajax/), [`dojo/Deferred`](../deferreds/), and the basic concepts related to these APIs, we're going to introduce you to one that's a bit more abstract: promises. A promise is an object that represents the eventual value returned from the completion of an operation. The `dojo/promise`API received a significant upgrade and refactor for 1.8 A promise has the following characteristics:

*   Can be in one of three states: unfulfilled, resolved, rejected
*   May only change from unfulfilled to resolved or unfulfilled to rejected
*   Implements a `then` method for registering callbacks for notification of state change
*   Callbacks cannot change the value produced by the promise
*   A promise's `then` method returns a new promise, to provide chaining while keeping the original promise's value unchanged

With this knowledge, let's discover how Dojo implements promises.

### Deferred as a Promise

If a promise sounds a lot like a `Deferred`, then you've been paying attention. In fact, the `dojo/Deferred` module is Dojo's main implementation of the promise API. Let's look at the chaining example from the last tutorial in the context that `Deferred` is a promise:

```js
require(["dojo/request"],
	function(request){

		// original is a Deferred
		var original = request.get("users-mangled.json", {
			handleAs: "json"
		});

});
```

As we said before, `request.get` (and all of Dojo's Ajax helpers) returns a `promise`. You could say that this `promise` represents the eventual value returned from the completion of the request from the server. Initially, it will be in an unfulfilled state and will change to either resolved or rejected depending on the result from the server.

Given the resulting promise from our request call, we can register callbacks via the `then` method. However, we didn't thoroughly cover what `then` returns, but only that the return value has a `then` method. You might have thought that it returns the original promise, but it really returns a simple object that fulfills the promise API. The two commonly used methods on this object are `then` and `cancel` (to indicate that the result is no longer needed). Let's look:

```js
require(["dojo/_base/array", "dojo/dom", "dojo/dom-construct", "dojo/json"],
	function(arrayUtil, dom, domConstruct, JSON){

		// result is a new promise that produces a
		// new value
		var result = original.then(function(response){
			var userlist = dom.byId("userlist1");

			return arrayUtil.map(response, function(user){
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
});
```

This call to `then` produces a promise object whose value will be set by the return value of the callback function. We can see that the value produced by this new promise is different than that of the original `Deferred` by calling the promise's `then` method:

```js
// chaining to the result promise rather than
// the original deferred to get our new value
result.then(function(objs){
	var userlist = dom.byId("userlist2");

	arrayUtil.forEach(objs, function(user){
		domConstruct.create("li", {
			innerHTML: JSON.stringify(user)
		}, userlist);
	});
});
```
<!-- protip -->
> The value of the promise returned from `then` is **always** the return value of the callback &mdash; if you didn't return a value, the promise's value will be `undefined`! If you're seeing a random `undefined` somewhere in your chain, check to make sure that you're providing proper return values in your callbacks. If you don't care about chaining, it's not important to worry about returning a value.

We can also check that the original `Deferred`'s value is unchanged as well:

```js
// creating a list to show that the original
// deferred's value was untouched
original.then(function(response){
	var userlist = dom.byId("userlist3");

	arrayUtil.forEach(response, function(user){
		domConstruct.create("li", {
			innerHTML: JSON.stringify(user)
		}, userlist);
	});
});
```

[View Demo](demo/chaining.html)

As we saw before, chaining is powerful; it's even more powerful when you know that each link in the chain is immutable.

It should also be noted that `Deferred` instances contain another important property: `promise`. This is an object that only implements the promise API, but represents the value that the `Deferred` will produce. The `promise` property allows you to minimize side-effects from consumers of your API by preventing someone from calling `resolve` or `reject` by accident (or on purpose), but will still allow them to get the value of the original `Deferred`.

### dojo/when

Now that we understand what a promise is and why it's useful, let's talk about `dojo/when`. It is a powerful function that Dojo provides that allows you to handle either promises or standard values using a consistent API.

The `dojo/when` function takes up to four arguments: a promise or value, an optional callback, an optional error handler, and an optional progress handler. It takes one of two paths:

*   If the first argument is _not_ a promise and the callback is provided, the callback will be called immediately with the provided value as the first argument, and the result of the callback will be returned. If the callback is not provided, the first argument will be returned immediately.
*   If the first argument _is_ a promise, the callback, error handler, and progress handler are passed to the promise's `then` method, and the resulting promise is returned, setting up your callback to execute when the promise is ready.

Let's revisit our `getUserList` function from [the Deferred tutorial](../deferreds/):

```js
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
```

Let's say that the list of users won't change very often and can be cached on the client instead of fetching them every time this function is called. In this case, because `dojo/when` takes either a value or a promise, `getUserList` could be changed to return either a promise or an array of users, and we can then handle the return value with `dojo/when`:

```js
require(["dojo/_base/array", "dojo/when", "dojo/request",
		"dojo/dom", "dojo/dom-construct", "dojo/json"],
	function(arrayUtil, when, request, dom, domConstruct, JSON){
		var getUserList = (function(){
			var users;
			return function(){
				if(!users){
					return request.get("users-mangled.json", {
						handleAs: "json"
					}).then(function(response){
						// Save the resulting array into the users variable
						users = arrayUtil.map(response, function(user){
							return {
								id: user[0],
								username: user[1],
								name: user[2]
							};
						});

						// Make sure to return users here,
						// for valid chaining
						return users;
					});
			}
			return users;
		};
	})();

	when(getUserList(), function(users){
		// This callback will be run after the request completes

		var userlist = dom.byId("userlist1");
		arrayUtil.forEach(users, function(user){
			domConstruct.create("li", {
				innerHTML: JSON.stringify(user)
			}, userlist);
		});

		when(getUserList(), function(user){
			// This callback will run right away since it's already in cache

			var userlist = dom.byId("userlist2");
			arrayUtil.forEach(users, function(user){
				domConstruct.create("li", {
					innerHTML: JSON.stringify(user)
				}, userlist);
			});
		});
	});
});
```

[View Demo](demo/when.html)

It also could be that you're in charge of the API for creating the user list, and want a clean API for your developers to hand you a list of users from either the server (via a Deferred) or an array. In this case, you might come up with a function similar to the following:

```js
function createUserList(node, users){
	var nodeRef = dom.byId(node);

	return when(
		users,
		function(users){
			arrayUtil.forEach(users, function(user){
				domConstruct.create("li", {
					innerHTML: JSON.stringify(user)
				}, nodeRef);
			});
		},
		function(error){
			domConstruct.create("li", {
				innerHTML: "Error: " + error
			}, nodeRef);
		}
	);
}

var users = request.get("users-mangled.json", {
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

createUserList("userlist1", users);
createUserList("userlist2",
	[{ id: 100, username: "username100", name: "User 100" }]);
```

[View Demo](demo/when-create.html)

As you can see, `dojo/when` allows developers to elegantly handle both synchronous and asynchronous usecases with one API, on both the producer and consumer ends of the spectrum.

### Managing lists of promises with dojo/promise/all

`dojo/promise/all` replaces `dojo/DeferredList` and provides a mechanism to manage multiple asynchronous processes by essentially combining the results of several promises into a single promise.  Sometimes you'll need to fetch data from multiple sources in parallel, and want to be notified when all requests are complete. You could likely set up some sort of Deferreds calling Deferreds system, with counts of returns, but you don't have to do it manually. Dojo takes care of you here with `dojo/promise/all`.

To use `dojo/promise/all`, simply pass an Object or Array of Deferreds to its constructor. The results are either an Object that uses the same keys as supplied in the argument, or an Array in the same order that was originally passed to the constructor. Let's look at an example:

```js
require(["dojo/promise/all", "dojo/Deferred", "dojo/request", "dojo/_base/array", "dojo/dom-construct", "dojo/dom", "dojo/json", "dojo/domReady!"],
function(all, Deferred, request, arrayUtil, domConstruct, dom, JSON){
	var usersDef = request.get("users.json", {
		handleAs: "json"
	}).then(function(response){
		var users = {};

		arrayUtil.forEach(response, function(user){
			users[user.id] = user;
		});

		return users;
	});

	var statusesDef = request.get("statuses.json", {
		handleAs: "json"
	});
	all([usersDef, statusesDef]).then(function(results){
		var users = results[0],
			statuses = results[1],
			statuslist = dom.byId("statuslist");

		if(!results[0] || !results[1]){
			domConstruct.create("li", {
				innerHTML: "An error occurred"
			}, statuslist);
			return;
		}
		arrayUtil.forEach(statuses, function(status){
			var user = users[status.userId];
			domConstruct.create("li", {
				id: status.id,
				innerHTML: user.name + ' said, "' + status.status + '"'
			}, statuslist);
		});
	});
});
```

Here we want to take a list of users from the server and combine it with a list of statuses. After registering a callback that will return a hash of users by ID, we pass both Deferreds to `dojo/promise/all` and register a callback with it. That callback then checks for an error and if it finds none, it iterates through the statuses and matches them up with a user. It doesn't matter which request finishes first, as `dojo/promise/all` will always give us the results in the order in which the Deferreds were passed in.

[View Demo](demo/all.html)

### Conclusion

The addition of the promises API to Dojo allows developers the opportunity to create more powerful applications in two ways: side-effects are avoided because of the guarantee of immutability of promises from functions like `Deferred`, while `dojo/when` provides an API for bridging the gap between promise-based and value-based coding. On top of that, `dojo/promise/all` allows you to handle multiple deferreds/promises using one callback.

### Resources

*   [dojo/promise Reference Guide](/reference-guide/1.10/dojo/promise/Promise.html)
*   [dojo/promise/all Reference Guide](/reference-guide/1.10/dojo/promise/all.html)
*   [dojo/promise/Promise API](/api/?qs=1.10/dojo/promise/Promise)
*   [dojo/promise/all API](/api/?qs=1.10/dojo/promise/all)
*   [Ajax with dojo.request Tutorial](../ajax)
*   [Getting Start with Deferreds Tutorial](../deferreds)
*   [Future and Promises](http://en.wikipedia.org/wiki/Futures_and_promises) Wikipedia article