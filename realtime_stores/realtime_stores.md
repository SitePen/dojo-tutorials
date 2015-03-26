## Real-time Stores

Web applications based on real-time stores give users a level of immediacy not possible with traditional web applications, allowing them to see data as it changes. The Dojo object store interface, which is the data model foundation of Dojo applications, was designed to support real-time data updates. In this tutorial we will see how to leverage the notification system to interact with real-time widgets.

### Getting Started

In this tutorial we are going to build on what we learned in the
[introduction to Dojo object stores](../intro_dojo_store/) and the [data modeling tutorial](../data_modeling/).
In the data modeling tutorial we saw how to create a view renderer
for query results that used the `observe()` method to monitor data
changes. We can call the `query()` method on a store and get a query
result set back; from there, we can call `forEach` on the query
result set to iterate through the result set. We can also call
`observe()` on the result set to listen for changes.
This is the example implementation:

```js
require(["dojo/dom", "dojo/dom-construct"],
	function(dom, domConstruct){
function viewResults(results){
	var container = dom.byId("container");
	var rows = [];

	// functions called within observe callback below
	function addRow(market, i){
		// insert row into DOM, and also into our internal array
		rows.splice(i, 0, domConstruct.create("div", {
			innerHTML: market.name + " index: " + market.index.toFixed(2) + " at: " + market.date.toLocaleTimeString()
		}, container, i));
	}
	function removeRow(i){
		// remove row from DOM and array (splice returns the removed items)
		domConstruct.destroy(rows.splice(i, 1)[0]);
	}

	// add initial items, and handle future changes
	results.forEach(addRow);
	results.observe(function(market, removedFrom, insertedInto){
		// this will be called any time a market is added, removed, or updated
		if(removedFrom &gt; -1){
			removeRow(removedFrom);
		}
		if(insertedInto &gt; -1){
			addRow(market, insertedInto);
		}
	}, true); // we can indicate to be notified of object updates as well
}

var results = marketStore.query({});
viewResults(results);
```

The essential entry point to monitoring data from a store is the
**observe()** method, which is a method of the query results.
The callback passed to `observe()` takes three arguments:

*   **`object`:** The object that was modified
*   **`removedFrom`:** The index in the result set where the removed or
modified object existed before. A value of -1 for `removedFrom`
indicates the object was added to the result set.
*   **`insertedInto`:** The index in the result set where the new or
modified object should now exist. A value of -1 for `insertedInto`
indicates the object was removed from the result set.

The `observe()` method belongs to the result set because the meaning
of notifications is contextualized to the result set. A notification that
indicates an addition to the result set does not necessarily imply that the
object was just created; it could have been created or updated in such a way
that it now belongs to the result set. The same is true of a removal;
the object may have been updated or deleted to trigger removal from a query result set.

<!-- protip -->
> Note that the `insertedInto` index applies to
the result set after the `removedFrom` index position has been removed
(and the array may be shifted).

This functionality&mdash;providing notification of changes to the underlying
data&mdash;is available in any store that provides an `observe()`
method on its result sets.  The easiest way to add this functionality to a store
is to wrap it with the **Observable** method of `dojo/store`.
As an example, we will create a data set, instantiate a new Memory store and
wrap it using `dojo/store/Observable`:

```js
require(["dojo/store/Memory", "dojo/store/Observable"],
		function(Memory, Observable){
	var data = [
		{"name": "Dow Jones", "index": 12197.88, "date": new Date()},
		{"name": "Nasdaq", "index": 2730.68, "date": new Date()},
		{"name": "S&P 500", "index": 1310.19, "date": new Date()}
	];
	// create the store with the data
	marketStore = new Memory({data: data, idProperty: "name"});
	// wrap the store with Observable to make it possible to monitor:
	marketStore = Observable(marketStore);
});
```

[View Demo](demo/demo.html)

Now whenever we locally initiate a modification to data via
`put()`, `add()`, or `remove()` calls,
notification will be delivered to the view renderer so it can automatically
update the view.

### Remotely-Initiated Notifications

Wrapping a store with `Observable` automates notifications when
data updates are made to the store. However, if you are creating a Comet-style
real-time application, you may also have notifications that have originated
from other users and are being delivered from the server. In this case, it
no longer makes sense to do `put()`, `add()`, and
`remove()` calls&mdash;since these signify operations performed by
the local user, which need to be sent to the server. With server-initiated calls,
we don't want the update operation sent back to the server as the server
already knows about the change, and suppressing these "echoes" can actually be
somewhat challenging to implement on the server. Because of this, the
`Observable` store wrapper provides a **notify()**
method that is designed for notifying the store that a change has taken place
from some other source. The primary different between a `put()` call
and a `notify()` call is that a `put()` is
_requesting a change to take place_, whereas a `notify()` is
indicating _that a change already took place_.

With the `notify()` method, we have a single call target to use for
data change notifications. The `notify()` method takes two arguments:
the first argument is the object that was added or updated, and the
second argument is the identity of the object that was updated or deleted.
If only the first argument is provided, this indicates that a new object was
created. If the first argument is `undefined` or `null`
(and the second argument is included), then this indicates the referenced object
was removed. If both arguments are included, this indicates an update
has occurred. To notify of an updated object, we could call `notify()`
like this:

```js
marketStore.notify(
	{"date": "2008-02-29", "name": "Dow Jones", "index": 12197.88},
            "Dow Jones");
```

For our demonstration, we emulate remote trigger with a simple random `setInterval` function:

```js
setInterval(function(){
	// choose a market randomly
	var market = data[Math.floor(Math.random() * 3)];
	// change it randomly
	market.index += Math.random() - 0.5;
	// update date
	market.date = new Date();
	// notify of the change
	marketStore.notify(market, market.name);
}, 1000); // every second
```

[View Demo](demo/demo.html)

Since the `notify()` method is commonly coupled with
Comet-driven messaging, let's look at how we can use this with
[dojox/socket](http://www.sitepen.com/blog/2010/10/31/dojo-websocket/),
for Comet-style communication based on WebSockets,
with fallback to XHR long-polling. Briefly, `dojox/socket` allows us to
connect to a server using WebSocket or XHR with long-lived connection, and asynchronously
receive messages from a server when they are available. Here we will create a
socket connection and use the messages from the server to notify the store of updates:

```js
require(["dojox/socket"],
	function(Socket){
	var socket = Socket("/comet");
	socket.on("message", function(event){
	  var data = event.data;
	  switch(data.action){
		case "create": store.notify(data.object); break;
		case "update": store.notify(data.object, data.object.id); break;
		case "delete": store.notify(undefined, data.object.id); break;
		default: // some other action
	  }
	});
});
```

### Implementing your own `observe()`

There may be situations where it is more efficient to directly implement your
own `observe()` method. This can be important if you have
specialized caching or notification schemes, or if you have implemented your own
`query()` method. We implement the addition of the
`observe()` method directly in our `query()` method.
The basic implementation pattern would look like:

```js
require(["dojox/socket", "dojo/store/Memory", "dojo/store/util/QueryResults", "dojo/_base/array"],
		function(Socket, Memory, QueryResults, arrayUtil){
	new Memory({
		idProperty: "name",
                data: data,
		query: function(query, options){
			// execute the query and get the results as an array
			var resultsArray = this.queryEngine(query, options)(this.data));

			// create a results object with standard iterative methods
			var results = QueryResults(resultsArray);

			// keep track of listeners
			var listeners = [];

			// add the observe method
			results.observe = function(listener){
				listeners.push(listener);
			};
			socket.on("message", function(event){
				// ... process event
				arrayUtil.forEach(listeners, function(listener){
					listener(object, insertedInto, removedFrom);
				});
			});
		}
	});
});
```

### Conclusion

The observable pattern in the Dojo object store interface provides a
powerful foundation for delivering real-time updates integrated with the
data model. Data viewers can connect to query results without any knowledge of
how the data changes. With a consistent API, viewers can respond to these
data changes regardless of whether they were initiated locally or relayed via
a service as the result of a remote operation.