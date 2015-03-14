## Dojo Object Store

Separation of concerns is a fundamental aspect of good programming. Keeping presentation distinct from the data model is a key separation to employ. The Dojo object store architecture establishes a consistent interface for data interaction inspired by the HTML5 object store API.

*   <span>Difficulty:</span> Intermediate
*   <span>Dojo Version:</span> 1.10

### Why Dojo Object Store?

Separation of concerns is a fundamental aspect of organized, manageable programming, and an essential separation in web applications is that of data modeling from the user interface (where a user interface is typically defined as a view and controller in model-view-controller (MVC) architecture). The Dojo object store architecture establishes a consistent interface for data interaction inspired by the HTML5 object store API. This API was developed to facilitate loosely coupled development where different widgets and user interfaces could interact with data from a variety of sources in a consistent manner.

The Dojo Object Store interface allows you to develop and use well-encapsulated components that can be easily connected to various data providers. Dojo Object Store is an API, and has multiple implementations called stores. Stores include a simple in-memory store, a JSON/REST store, legacy `dojo.data` stores, and store wrappers that provide additional functionality.

### Getting Started

The easiest store to get started with is `dojo/store/Memory`. We can simply provide an array of objects to the constructor, and we can start interacting with it. Once the store is created, we can query it with the `query` method. An easy way to query is to provide an object with name/value pairs that indicate the required values of matched objects. The `query` method always returns an object or array with a `forEach` method (as well as `map` and `filter`):

<pre class="brush: js;">
require(["dojo/store/Memory"],
	function(Memory){

		var employees = [
			{name:"Jim", department:"accounting"},
			{name:"Bill", department:"engineering"},
			{name:"Mike", department:"sales"},
			{name:"John", department:"sales"}
		];
		var employeeStore = new Memory({data:employees, idProperty: "name"});
		employeeStore.query({department:"sales"}).forEach(function(employee){
			// this is called for each employee in the sales department
			alert(employee.name);
		});

});
</pre>


This will call an alert with the name of each employee in the sales department.

[View Demo](demo/demo.php)

We could go on to create new objects in the store, and delete objects:

<pre class="brush: js;">
// add a new employee
employeeStore.add({name:"George", department:"accounting"});
// remove Bill
employeeStore.remove("Bill");
</pre>


We can retrieve objects and update them. Objects in the store are simple plain JavaScript objects, so we can directly access and modify the properties (when you modify properties, make sure you do a put() to save the changes):

<pre class="brush: js;">
// retrieve object with the name "Jim"
var jim = employeeStore.get("Jim");
// show the department property
console.log("Jim's department is " + jim.department);
// iterate through all the properties of jim:
for(var i in jim){
	console.log(i, "=", jim[i]);
}
// update his department
jim.department = "engineering";
// and store the change
employeeStore.put(jim);
</pre>


Going back to querying, we can add additional parameters to a query. These additional parameters allow us to limit the query to a specific number of objects, or to sort the objects, using the second argument to the `query` method. This second argument can be an object with `start` and `count` properties that define the limit on the number of objects returned. Limiting the result set can be critical for large-scale data sets that are used by paging-capable widgets (like the grid), where new pages of data are requested on demand. The second argument can also include a `sort` property, to specify the property and direction to sort on in the query:

<pre class="brush: js;">
employeeStore.query({department:"sales"}, {
	// the results should be sorted by department
	sort:[{attribute:"department", descending: false}],
	// starting at an offset of 0
	start: 0,
	// with a limit of 10 objects
	count: 10
}).map(function(employee){
	// return just the name, mapping to an array of names
	return employee.name;
}).forEach(function(employeeName){
	console.log(employeeName);
});
</pre>


The Memory store is a synchronous store, which means it directly returns the results of an action (`get` returns the object).

### dojo/store/JsonRest

Another highly useful store is the `JsonRest` store, which delegates the various store actions to your server using standards-based HTTP/REST with JSON. The store actions map intuitively to HTTP GET, PUT, POST, and DELETE methods. The server-side interaction is described in more detail in the [JsonRest documentation](/reference-guide/1.10/dojo/store/JsonRest.html).

This is also an example of an asynchronous store. The methods on an asynchronous store return [promises](../promises/). We can use a promise by providing a callback to the returned promise:

<pre class="brush: js;">
require(["dojo/store/JsonRest"],
	function(JsonRest){
            employeeStore = new JsonRest({target:"/Employee/"});
            employeeStore.get("Bill").then(function(bill){
				// called once Bill was retrieved
            });
});
</pre>


We can also use `Deferred.when()` (as exposed via the `dojo/_base/Deferred` module) to work with methods that may be synchronous or asynchronous, for consistent behavior regardless of implementation.

These examples demonstrate how to interact with stores. We can now start building widgets and components that interact with stores in a way that is free from dependence on a particular implementation. We can also plug our stores into existing components that use stores.

For example, the StoreSeries adapter allows us to use a store as the data source for a chart. Most components that use a store require that you provide the query that the component should use to query the store:

<pre class="brush: js;">
// Note that while the Default plot2d module is not used explicitly, it needs to
// be loaded to be able to create a Chart when no other plot is specified.
require(["dojox/charting/Chart", "dojox/charting/StoreSeries" /*, other deps */,
		"dojox/charting/plot2d/Default"],
	function(Chart, StoreSeries /*, other deps */){
		/* create stockStore here... */

		new Chart("lines").
			/* any other config of chart */
			// now use a data series from my store
			addSeries("Price", new StoreSeries(
				stockStore, {query: {sector:"technology"}}, "price")).
			render();

});
</pre>


Another important concept in the Dojo store architecture is composing functionality by layering store wrappers. Dojo comes with a few store wrappers that add functionality, including a caching wrapper, and an observable wrapper that fires events for data changes.

### Local storage

Dojo 1.10 has added local storage dojo/store providers in dojox, with support for IndexedDB and WebSQL.

### dstore: The future of dojo/store

The new [dstore](https://github.com/sitepen/dstore) package is the successor to dojo/store, and works with Dojo 1.8+, and is the planned API for Dojo 2. If you are just getting started with Dojo, we recommend taking a look at dstore.

### Conclusion

The Dojo Object Store implementation available since 1.6 is a useful tool available to us to help us keep a clean separation of concerns between our data and our user interfaces. It provides a straight-forward API, allowing for easy development of custom stores. Review the reference guide and post below for more information.

### Additional Resources

*   [JsonRest Reference Guide](/reference-guide/1.10/dojo/store/JsonRest.html)
*   [SitePen blog post on Dojo Object Stores](https://www.sitepen.com/blog/2011/02/15/dojo-object-stores/)