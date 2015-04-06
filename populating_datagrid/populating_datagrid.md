---
Category:  Working with Data
...

## Populating your Grid using dojo/data

The `DataGrid` is the central component of many applications due to its effective and usable presentation of tabular data. In this tutorial we will look at how to populate a grid and manipulate data in a grid.

### dgrid

<!-- protip -->
> This tutorial covers the `dojox/grid/DataGrid` in depth. Beginning with Dojo 1.7, you should use the [dgrid](http://dgrid.io/), a next-generation grid component that takes full advantage of modern browsers and object stores. Visit the dgrid site for a collection of [dgrid tutorials](http://dgrid.io#tutorials).

### Getting Started

Although displaying your data in the right order and in a manner that makes sense to the user is important, it might not always be enough. Sometimes the data you get won't be formatted for optimum display, and will need to be tailored to make it more readable. `dojox/grid/DataGrid` can help with this...but first, let's take a look at a point we glossed over in the first tutorial: how to get data into your grid.

### Retrieving Data From a Store

The first thing we'll be doing is creating a store. We'll be using `dojo/store/Memory`, and wrapping it with `dojo/data/ObjectStore` to provide the Dojo data API to the grid, but really, any store conforming to Dojo's data API will work. Since the [data API](../dojo_data) and the [store API](../intro_dojo_store/) were discussed in earlier tutorials we won't be covering them here, except to say that the hall of fame batting statistics we used from our last tutorial are fetched from our JSON file using `dojo/request` and loaded into our `Memory` store.

<!-- protip -->
> Dojo 1.6 introduced the new data store API called Dojo Object Store. This API is based on the [HTML5 IndexedDB object store API](http://www.w3.org/TR/IndexedDB/#object-store-sync) and is designed to greatly simplify and ease the interaction with and construction of Dojo stores.  While `dojo/data/ItemFileReadStore`, `dojo/data/ItemFileWriteStore`, and other dojo/data APIs can still be used with the Dojo Grid, it is highly recommended that you use the dojo/store APIs, both for a more performant store, and for coding best practices.

At this point, there are two ways to access the data in the store; the first is letting the DataGrid query the store for you. To do this, we can pass three parameters to the `DataGrid` constructor:

*   `store`: The data store.
*   `query`: The query to pass to the store. The syntax will depend on the store being used.
*   `queryOptions`: Options to pass to the store during querying. The options will depend on the store being used, and is not required.

Since we want every record, we'll pass `{ id: "*" }`:

```js
require([
	"dojox/grid/DataGrid",
	"dojo/store/Memory",
	"dojo/data/ObjectStore",
	"dojo/request",
	"dojo/domReady!"
], function(DataGrid, Memory, ObjectStore, request){
	var grid,  dataStore;
	request.get("hof-batting.json",{
		handleAs: "json"
	}).then(function(data){
		dataStore = new ObjectStore({ objectStore:new Memory({ data: data.items }) });

		grid = new DataGrid({
			store: dataStore,
			query: { id: "*" },
			queryOptions: {},
			structure: [
				{ name: "First Name", field: "first", width: "25%" },
				{ name: "Last Name", field: "last", width: "25%" },
				{ name: "G", field: "totalG", width: "10%" },
				{ name: "AB", field: "totalAB", width: "10%" },
				{ name: "R", field: "totalR", width: "10%" },
				{ name: "H", field: "totalH", width: "10%" },
				{ name: "RBI", field: "totalRBI", width: "10%" }
			]
		}, "grid");
		grid.startup();
	});
});
```

[View Demo](demo/datagrid.html)

Another way to populate your grid is to manually fetch the data you want from the store. Instead of giving the `DataGrid` a `query` parameter, you would pass it the array of items from the store as an `items` parameter:

```js
require([
	"dojox/grid/DataGrid",
	"dojo/store/Memory",
	"dojo/data/ObjectStore",
	"dojo/request",
	"dojo/domReady!"
], function(DataGrid, Memory, ObjectStore, request){
	var grid, dataStore;
	request.get("hof-batting.json", {
		handleAs: "json"
	}).then(function(data){
		dataStore = new ObjectStore({ objectStore:new Memory({ data: data.items }) });

		grid = new DataGrid({
			store: dataStore,
			items:data.items,
			structure: [
				{ name: "First Name", field: "first", width: "25%" },
				{ name: "Last Name", field: "last", width: "25%" },
				{ name: "G", field: "totalG", width: "10%" },
				{ name: "AB", field: "totalAB", width: "10%" },
				{ name: "R", field: "totalR", width: "10%" },
				{ name: "H", field: "totalH", width: "10%" },
				{ name: "RBI", field: "totalRBI", width: "10%" }
			]
		}, "grid");
		grid.startup();
	});
});
```

[View Demo](demo/datagrid-items.html)

<!-- protip -->
> Each population method has its advantages: using a `query` will allow the grid to use the store's sorting, but using `items` will provide faster rendering since the store isn't queried for each page of data. It's up to you to decide which method fits your application the best.

### Formatting Data

Now that we have data in our grid, we need to format some of it. Besides the class and style properties talked about in the last tutorial, there are two more properties for formatting data: `formatter` and `get`. `formatter` takes a function that will be called with 3 arguments: the data from the field specified for this cell, the row index, and the reference to the cell definition object. The return value of this function will be used as the data for the cell:

```js
{
	name: "G", field: "totalG", width: "10%",
	formatter: function(games){
		return games + " _games_";
	}
},
```

Another way to format your data is using the `fields` property of a cell definition to pass data from multiple fields as an array to your formatter function. This can be used, for instance, to concatenate a player's first and last names:

```js
{
	name: "Name", fields: ["first", "last"], width: "30%",
	formatter: function(fields){
		var first = fields[0],
			last = fields[1];

		return last + ", " + first;
	}
},
```

If you need access to multiple values of a record, another option is to pass the string `"_item"` to the cell definition's `field` property. This will tell the `DataGrid` to pass the data object associated with the record for the row as the first argument of your formatter function:

```js
{
	name: "Batting Average", field: "_item", width: "10%",
	formatter: function(item, rowIndex, cell){
		var store = cell.grid.store,
			ba = store.getValue(item, "totalH") / store.getValue(item, "totalAB");

		// round to three digits
		return mathRound(ba, 3);
	}
},
```

One last approach to formatting data is to separate the calculation from the formatting. By passing a function to the `get` property of the cell definition, the `DataGrid` will call this function in order to fetch the data out of the item. The `DataGrid` will pass the `get` function 2 arguments: the row index of the record and the data item associated with the record. For large calculations, this is the preferred option:

```js
{
	name: "Slugging %", width: "10%",
	get: function(rowIndex, item){
		if(!item){
			return;
		}
		// |this| is the cell object
		var store = this.grid.store,
			hits = store.getValue(item, "totalH"),
			doubles = store.getValue(item, "total2B"),
			triples = store.getValue(item, "total3B"),
			homeruns = store.getValue(item, "totalHR"),
			total_bases = hits + doubles + (triples * 2) + (homeruns * 3),
			at_bats = store.getValue(item, "totalAB");

		return total_bases / at_bats;
	},
	formatter: function(slugging){
		// round to three digits
		return mathRound(slugging, 3);
	}
}
```

[View Demo](demo/datagrid-formatting.html)

<!-- protip -->
> By using `get`, `fields`, or `field` set to `"_item"`, the `DataGrid` will not be able to sort your data. If you need sorting and advanced calculations client-side, you will need to transform the data before it gets to your store.</code>

### DataGrid as a View

<p>One very important point should be made before concluding this tutorial: the `DataGrid` is simply a _view_ of a `dojo/data` store. This means the `DataGrid` will react to changes in the store (row addition or deletion, and record field updates) if the store supports the notification API of `dojo/data`, and it will sort the data according to the rules of the store you're using. However, it is not designed to do sorting apart from the store. This means that if formatting your data will change the sort order, the `DataGrid` won't notice the formatted changes.

### Conclusion

Formatting data is a big key to the puzzle of displaying tabular data so a user can easily use your grid. By providing formatting functions to your cell definitions, you will have even more control over how your data will appear in your grid. In the next tutorial, we will look at how the `DataGrid` exposes methods and events for controlling how users can interact with your grid.