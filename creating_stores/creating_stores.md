---
Category:  Working with Data
...

## Creating Stores

In this tutorial, you'll learn the basic APIs all `dojo/store`s follow and how to create your own store - including how to handle query results.

### Getting Started

The new [`dojo/store`](/reference-guide/1.10/dojo/store.html) system is intended as a replacement for the older `dojo.data` system; being
partially based on the new [W3C Object Store API](http://www.w3.org/TR/IndexedDB/#object-store), it
is intended to make creating data storage components as simple as possible.  Creating stores compliant with
`dojo/store` is pretty simple since most methods are optional and only need to be implemented
if you want their functionality.
This tutorial will help you get started and show you the most important parts of the new Dojo Stores.

Basic Dojo Stores only implement part of the IndexedDB API, primarily those methods concerned with getting
data in and out of the store.  Certain aspects of the IndexedDB API (such as indexes and cursors) are not
implemented, mostly because they tend to be unnecessary in a pure JavaScript environment.

### Creating your first store

Before creating your own store implementation, it might be useful to take a look at the simplest store in
the Dojo Toolkit, the [Memory store](/api/?qs=1.10/dojo/store/Memory), which was designed to handle the
most primitive of data management tasks.  Here is the basic API for `dojo/store/Memory`:

```js
define(["../_base/declare", "dojo/store/util/SimpleQueryEngine"],
		function(declare, SimpleQueryEngine) {

	declare("dojo.store.Memory", null, {
		constructor: function(options){ },
		data: null,
		index: null,
		queryEngine: SimpleQueryEngine,

		//	what follows is the actual API signature
		idProperty: "id",
		get: function(id){ },
		getIdentity: function(object){ },
		put: function(object, options){ },
		add: function(object, options){ },
		remove: function(id){ },
		query: function(query, options){ },
		setData: function(data){ }
	});
});
```

As you can see, the signature of `dojo/store/Memory` is pretty simple.  It deals with getting
any kind of data (`get` and `query`), makes sure that identity issues are
addressed (`idProperty` and `getIdentity`), and allows for creating new items, deleting
items, and updating items (`add`, `remove`, and `put`, respectively).  In
addition, it offers a way to set an initial data set (`setData`).

You may have noticed that there are no facilities for sending notification events, such as when data may have
been created, deleted or updated.  We'll cover this in a separate tutorial that talks about applying
`dojo/store/Observable` to an existing Dojo Store.

### Internal data structures

For anyone that has used some sort of JavaScript data structure, you'll probably notice here that a store
**does not** dictate the actual data structure of a set of objects.  This is deliberate with
`dojo/store`, as the structure of your data is usually dependent on the application of that data,
and a store has no business dictating that structure.

That being said, there is one thing you should always implement in a custom store: a unique
identifier for each data object.  The store's `idProperty` property indicates which item property to use
as the unique identifier; by default, it is "id", but it can be anything you want.

You _can_ write a store that handles data without the use of an **idProperty**, but we
strongly recommend against it.  In the end, a store without some sort of unique identifier relies on a lookup
against all of the elements in your data structure every time, which can be very costly from a performance perspective.

### `query`: the most important method in a Store

By far, the most important method in any store is the `query` method.  This is the main way of
getting information out of a store without altering any of the internal data structures. This method must
accept two arguments: a `query` object, and an optional `options` object.

The `query` object contains criteria for the query and is dependent on the underlying query engine.
`dojo/store` comes with a built-in query engine called `dojo/store/util/SimpleQueryEngine`; this
engine handles most basic querying needs but also serves as a template for writing more complex query engines.
Let's take a look at it.

#### Creating a query engine

The `dojo/store/util/SimpleQueryEngine` demonstrates the basic approach to creating a query engine.
The idea is to create and return a function that will do some sort of filtering (and other things, if
needed) on an array of objects using the set of criteria originally passed to the query engine.

To create a query engine, you'd follow the structure of the SimpleQueryEngine by capturing the query parameters
in a closure and returning a function designed to take an array of elements as the sole argument.  A basic example
would look like the following:

```js
require(["dojo/_base/array"],
		function(arrayUtil){
var myEngine = function(query, options){
	var filteringFunction = function(object){
		//	do something here based on the passed query object
	};

	var execute = function(array){
		var results = arrayUtil.filter(array, filteringFunction);
		//	do anything else needed, like sorting and pagination
		return results;
	}
	execute.matches = filteringFunction;
	return execute;
}
```

You can always write your own querying engine, based on the `SimpleQueryEngine`, to handle
any explicit needs you might have.  You can also create something directly in your store's `query`
method if you so desire&mdash;for instance, letting the query method communicate with a remote server, and
letting the server return the results.  We'll see an example with `dojo/store/JsonRest` later on
in this tutorial that does just that.

Making sure you have a query engine that can operate on an array of data is only the first step in creating
the `query` method in your store; the second step is making sure the `query` method wraps the
returned results with `dojo/store/util/QueryResults`.

#### What are QueryResults?

`dojo/store/util/QueryResults` is simply a wrapper function that is applied to the results of a
query. It ensures that standard iteration methods exist on the result set, including `forEach`,
`map` and `filter` (see [Arrays Made Easy](../arrays/) for more information).

Here's where it gets interesting, though: the `results` object you pass to `QueryResults` can be
_either an array or a promise_.  That's right, you can pass a
[**promise** object](../promises/) to the QueryResults function, and the same iterative
methods can still be used!

Let's take a look at the `query` methods in two of Dojo's stores, the Memory store and the JsonRest
store. First up, the Memory store:

```js
define(["dojo/store/util/QueryResults"],
		function(QueryResults){
		....
//	from dojo/store/Memory
query: function(query, options){
	return QueryResults(
		(this.queryEngine(query, options))(this.data)
	);
}
```

The Memory store's internal data structure is an array of objects. by calling `QueryResults`, the
all important iteration methods are added directly to the results object. That means that you'd then call
iteration methods directly, like so:

```js
var results = myMemoryStore.query({ foo: "bar" });
results.forEach(function(item){
	//	do something with the item
});
```

Now let's take a look at the `query` method from the JsonRest store:

```js
//	from dojo/store/JsonRest
query: function(query, options){
	var headers = {Accept: "application/javascript, application/json"};
	options = options || {};

	if(options.start >= 0 || options.count >= 0){
		headers.Range = "items=" + (options.start || '0') + '-' +
			(("count" in options && options.count != Infinity) ?
				(options.count + (options.start || 0) - 1) : '');
	}
	// lang is from dojo/_base/lang
	if(lang.isObject(query)){
		// ioQuery from dojo/io-query
		query = ioQuery.objectToQuery(query);
		query = query ? "?" + query: "";
	}
	if(options && options.sort){
		query += (query ? "&" : "?") + "sort(";
		for(var i = 0; i < options.sort.length; i++) {
			var sort = options.sort[i];
			query += (i > 0 ? "," : "")
				+ (sort.descending ? '-' : '+')
				+ encodeURIComponent(sort.attribute);
		}
		query += ")";
	}
	// request from dojo/request
	var results = request.get(this.target + (query || ""), {
		handleAs: "json",
		headers: headers
	});
	results.total = results.then(function(){
		var range = results.response.getHeaders("Content-Range");
		return range && (range=range.match(/\/(.*)/)) && +range[1];
	});
	return QueryResults(results);
}
```

You'll notice that the JsonRest store doesn't use a query engine; instead, it makes a call to a REST
service using `dojo/request`, which itself returns a promise. The QueryResults
function then ensures that common iterative methods are available on the returned promise, and that
those methods seemingly behave in the proper way.

Internally, `QueryResults` does this using the magic of [`dojo.when`](../promises/),
which we won't go into detail here.  Just keep in mind that when writing your own store, you should
**always** make sure that the `query` function returns an object wrapped by
`dojo/store/util/QueryResults`.

### Let's create a store

Now that we have the basics of a query under our belt, let's go ahead and create a new store.  We'll call
it "Example" for now, and add things as we go.  For simplicity's sake, this store will end up looking exactly
like the Memory store, since we are going to simply keep an internal array of data and operate on it.  Let's
set it up:

```js
define(["dojo/store/util/QueryResults", "dojo/_base/declare", "dojo/_base/lang", "dojo/request", "dojo/store/util/SimpleQueryEngine"],
		function(QueryResults, declare, lang, request, SimpleQueryEngine){

	//	Declare the initial store
	return declare(null, {
		data: [],
		index: {},
		idProperty: "id",
		queryEngine: SimpleQueryEngine,

		constructor: function(options){
			lang.mixin(this, options || {});
			this.setData(this.data || []);
		},
		query: function(query, options){
			return QueryResults(
				(this.queryEngine(query, options))(this.data)
			);
		},
		setData: function(data){
			this.data = data;
			//	index our data
			this.index = {};
			for(var i = 0, l = data.length; i < l; i++){
				var object = data[i];
				this.index[object[this.idProperty]] = object;
			}
		}
	});
});
```

You may have noticed the `lang.mixin` statement in the constructor. This is a common practice which allows
for specification of instance properties via the `options` argument to the constructor; in this case,
it would most commonly be used to set values for `data` and `idProperty`.

#### Add in our getters

Our Example store has the most important methods implemented: a way of setting the store's data, and
a way of querying that data based on the `SimpleQueryEngine`.  We also have an indexing mechanism set
up so that we can quickly return an item via its identity if we want to; let's go ahead and add those
methods now.

```js
//	in our declare from above
get: function(id){
	return this.index[id];
},
getIdentity: function(object){
	return object[this.idProperty];
}
```

These two methods allow for direct data access without having to go through a query, and allows a user
to get the proper unique identity for a given object.  If the purpose of our store were to be (essentially)
read-only, this is all we'd need in our store definition.

#### Add in write capability

Most stores, however, are not read-only. Normally, users will want to modify existing
objects, and add and remove objects from our store.  For this, we'll add three new methods: `put`,
`add` and `remove`.

```js
//	in our declare from above
put: function(object, options){
	var id = options && options.id
		|| object[this.idProperty];
	this.index[id] = object;

	var data = this.data,
		idProperty = this.idProperty;
	for(var i = 0, l = data.length; i < l; i++){
		if(data[i][idProperty] == id){
			data[i] = object;
			return id;
		}
	}
	this.data.push(object);
	return id;
},
add: function(object, options){
	var id = options && options.id
		|| object[this.idProperty];
	if(this.index[id]){
		throw new Error("Object already exists");
	}
	return this.put(object, options);
},
remove: function(id){
	delete this.index[id];
	for(var i = 0, l = this.data.length; i < l; i++){
		if(this.data[i][this.idProperty] == id){
			this.data.splice(i, 1);
			return;
		}
	}
}
```

The concept is that you will use the `put` method any time you make a modification to an object, the
`add` method any time you create a new object and want to add it to the store, and the `remove`
method to delete an object out of the store.  The `put` method is the central one here: you'll want
to use that when altering an object so that the store can manage what it needs to manage when doing UPDATE-like
operations.  The only difference in implementation here between `put` and `add` is that
our `add` method makes sure the object does not exist in our store already.

#### The final implementation

Here's our final store:

```js
define(["dojo/store/util/QueryResults", "dojo/_base/declare", "dojo/_base/lang", "dojo/store/util/SimpleQueryEngine"],
		function(QueryResults, declare, lang, SimpleQueryEngine){

	//	Declare the initial store
	return declare(null, {
		data: [],
		index: {},
		idProperty: "id",
		queryEngine: SimpleQueryEngine,

		constructor: function(options){
			lang.mixin(this, options || {});
			this.setData(this.data || []);
		},
		get: function(id){
			return this.index[id];
		},
		getIdentity: function(object){
			return object[this.idProperty];
		},
		put: function(object, options){
			var id = options && options.id
				|| object[this.idProperty];
			this.index[id] = object;

			var data = this.data,
				idProperty = this.idProperty;
			for(var i = 0, l = data.length; i < l; i++){
				if(data[i][idProperty] == id){
					data[i] = object;
					return id;
				}
			}
			this.data.push(object);
			return id;
		},
		add: function(object, options){
			var id = options && options.id
				|| object[this.idProperty];
			if(this.index[id]){
				throw new Error("Object already exists");
			}
			return this.put(object, options);
		},
		remove: function(id){
			delete this.index[id];
			for(var i = 0, l = this.data.length; i < l; i++){
				if(this.data[i][this.idProperty] == id){
					this.data.splice(i, 1);
					return;
				}
			}
		},
		query: function(query, options){
			return QueryResults(
				(this.queryEngine(query, options))(this.data)
			);
		},
		setData: function(data){
			this.data = data;
			//	index our data
			this.index = {};
			for(var i = 0, l = data.length; i < l; i++){
				var object = data[i];
				this.index[object[this.idProperty]] = object;
			}
		}
	});
});
```

As you can see, creating a basic store using the new Dojo Store APIs is very simple and straight-forward!

### Conclusion

In this tutorial, we've learned some of the history and foundation behind the new Dojo Store APIs, how to
create our own store, and how two central pieces of the Dojo Store API&mdash;query engines and
`dojo/store/util/QueryResults`&mdash;work.  We'd encourage you to explore the stores in the
Dojo Toolkit (found in `dojo/store`), as well as any additional stores you might find in development in
DojoX (found in `dojox/store`).

Coming up next: using `dojo/store/Observable` with any store to handle notification events, as
well as [real-time data handling with the Dojo Store API](../realtime_stores)!
