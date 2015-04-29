---
Category:  Working with Data
...

## Connecting a Store to a DataGrid

The DataGrid is the central component of many applications due to its effective and usable presentation of tabular data. In this tutorial we will look at how to connect the grid to a store for quick and efficient data retrieval and updating.

### dgrid

<!-- protip -->
> This tutorial covers the `dojox/grid/DataGrid` in depth. Beginning with Dojo 1.7, you should use the [dgrid](http://dgrid.io/), a next-generation grid component that takes full advantage of modern browsers and object stores. Visit the dgrid site for a collection of [dgrid tutorials](http://dgrid.io#tutorials).

### DataGrid and Stores

The `DataGrid` is the central component of many applications due to its effective and usable presentation of tabular
data. Let's look at how to connect the grid to a store for quick and efficient data retrieval and updating.

First, we will create the store. In this example, we will create a `JsonRest` store that will act as a connector between the grid and our server, communicating with JSON REST HTTP. Let's create the store:

```js
require(["dojo/store/JsonRest"], function(JsonRest){
	myStore = new JsonRest({target:"MyData/"});
});
```

This indicates that the store will make requests to the provided (relative) URL "MyData/" for data retrieval and
modifications.

<!-- protip -->
> We can easily use other stores, such as the `dojo/store/Memory` store or a custom store, to
drive a grid. However, we will focus on the `JsonRest` store in this tutorial.

Now we can create the `DataGrid`. The 1.7 `DataGrid` is still based on the `dojo.data` API, so we will use the `dojo/data/ObjectStore` adapter to connect our store to the `DataGrid`. The `DataGrid` uses the standard Dojo widget construction pattern, so we can instantiate a `DataGrid` with our store (make sure you include the proper CSS for the `DataGrid` as well):

```js
require([
	"dojox/grid/DataGrid",
	"dojo/data/ObjectStore",
	"dojo/domReady!"
], function(DataGrid, ObjectStore){
	grid = new DataGrid({
		store: dataStore = new ObjectStore({objectStore: myStore}),
		structure: [
			{name:"State Name", field:"name", width: "200px"},
			{name:"Abbreviation", field:"abbreviation", width: "200px"}
		]
	}, "target-node-id"); // make sure you have a target HTML element with this id
	grid.startup();
});
```

And now that we have created a grid, when the grid starts it will call the `query()` method on the store and that will trigger a request to the server for data. Your server can return a JSON array of data as a response back to
the browser, and the grid will render the array. The JSON array response could look like:

```js
[
	{"id":0,"name":"Alabama","abbreviation":"AL","capital":"Montgomery"},
	{"id":1,"name":"Alaska","abbreviation":"AK","capital":"Juneau"}
]
```
<a href="demo/demo.html" class="button">View Demo</a>

Now we should have a functioning grid that is retrieving data from our server. Let's look at other things we can do to
improve our component.

### Paging

One of the more powerful features of the Dojo `DataGrid` is on-demand paging in response to scrolling. This provides a
seamless, intuitive experience for the user viewing large data sets &mdash; as they simply scroll to see more data,
rather than having to futz with paging controls. This on-demand paging is achieved by sending count
limited queries to the store; the grid will call the `query()` method with a second parameter that is an object,
with `start` and `count` properties. The JsonRest store communicates this count limit with the HTTP `Range` header.
This is an important feature for scalability since it allows us to defer loading of out-of-view rows rather than
loading an entire table or query result of data. The first request to our server should look like (it can be
helpful to look at the requests in your debugger):

```html
GET /MyData/ HTTP/1.1
Range: items=0-19
&hellip;
```

Your server can read the `Range` header to determine how many rows to send to the client, which can be translated to
`LIMIT` and `OFFSET` parameters with a MySQL server (for example). With large datasets, when you scroll the grid
the store will trigger subsequent requests with `Range` parameters with higher offsets. The grid's call to the store
would be the equivalent of (you don't have to write this, this is what the grid is doing internally):

```js
myStore.query("", {start: 0, count: 20}).then(/* grid's callback */);
```

### Sorting

The `DataGrid` also supports triggering sorted queries in response to column header clicks. For optimal performance,
the grid delegates sorting to the store, as sorting is often most efficiently performed at the database level.
When a column is clicked, the grid will send a new query to the store with a `sort` parameter in
the second argument to the `query()` method. With the `JsonRest` store, this will trigger a request that will indicate
that the results should be sorted by the associated property (in this case the "name" property):

```
GET /MyData/?sort(+name) HTTP/1.1
Range: items=0-19
&hellip;
```

<!-- protip -->
> If the grid only has a single page of data, it can't accurately sort &mdash; as retrieving the entire database may
be far too expensive.

Internally, the grid's sorting triggers a call to the store like so (and the grid does this for you):

```js
myStore.query("", {start: 0, count: 20, sort:[{attribute:"name"}]}).
		then(/* grid's callback */);
```

One thing that is important to understand about the grid/component interaction with the store is that queries
provide a side-effect free view of the store data. This means that if we directly query the store, it will have
no effect on the grid's view of the data. The grid makes its own queries on the store that are separate from
other queries to the store. You can't sort a store; you can only get a sorted view of a store (which is what
the grid does when you click on a column header).

### Filtering

We can also create a filtered view of our data, by setting the query using the `setQuery()` method. The `DataGrid`
passes queries through to the store (as with sorting and paging, querying is usually most efficiently performed
at the database level). For example, to filter for rows where the abbreviation is "NY", we could do:

```js
grid.setQuery({abbreviation: "NY"});
```

&hellip; which would trigger a request to the server like:

```
GET /MyData/?abbreviation=NY HTTP/1.1
Range: items=0-19
&hellip;
```

&hellip; which can then be translated to the appropriate database query.

Internally, the query passed to the `setQuery()` method is provided as the first argument to the store's `query()` method.
The query value is passed straight through &mdash; and with the JsonRest store, string values can be used, which are
simply post-pended to the URL in the query string.

### Editing in-Grid

The `DataGrid` supports editing data directly in context. This provides a great user experience, since it is
intuitive to simply double click (or click, depending on settings) the grid cell and start editing the data.
The `DataGrid` relies on the uniform data interface to write the changes back to the data store. Once you have
edited a cell, the changes are written back through the Dojo data adapter's `setValue()` method; unsaved changes
are stored in the adapter until you call the `save()` method, like so:

```js
dataStore.save();
```

Once `save()` is called, all the changes are delivered to the object store via `put()` calls.

<!-- protip -->
> The `DataGrid` will frequently retrieve objects by id. To avoid extraneous requests to the server, you can add the
>	`dojo/store/Cache` wrapper to locally cache objects for quick retrieval:
> ```js
	require([
		"dojo/store/JsonRest",
		"dojo/store/Memory",
		"dojo/store/Cache"
	], function(JsonRest, Memory, Cache){
		myStore = new Cache(
			JsonRest({target:"MyData/"}),
			new Memory()
		);
	});
```

### Conclusion

The `DataGrid` is a powerful, full-featured grid with virtually everything you need for scalable rendering of tabular
data, including sorting, filtering, column reordering, selection, editing, keyboard navigation, and more. With the
cohesive integration between the DataGrid and the store, it is easy to configure and design the data handling
necessary to drive the `DataGrid`.