## Using Dojo Data

Dojo Data is the legacy data interface used to abstract data consumers (like widgets) from the concerns of data providers. While the new object store interface has superseded the `dojo/data` interface, there are a number of existing data stores that implement this API and is used by quite a few existing widgets. Here we will look at the `dojo/data` interface, see how data providers and widgets connect together, and learn how it can be adapted to the new interface.

### Introduction to Dojo Data

The [Dojo Data API](/reference-guide/1.10/dojo/data.html) is designed to separate the concerns of data modeling from the user interface concerns of rendering views and controlling the data. The philosophy of this separation of concern is preserved in Dojo Data's successor, the object store interface, and the [object store tutorial](../intro_dojo_store/) explains the basics of this design and the [data modeling](../data_modeling/) tutorial goes further into the guiding principles data model separation from viewer and controller (AKA MVC).
We recommend the use of object store interface over the Dojo Data API when possible, for the [numerous improvements it provides](http://www.sitepen.com/blog/2011/02/15/dojo-object-stores/), but since there are existing widgets and implementations of Dojo Data providers, there are certainly situations where Dojo Data can play an important role.

### Dojo Data Basics

The Dojo Data API is composed of four sub-APIs for different aspects of data interaction. Different stores can implement different sub-APIs depending on the capabilities of the store, and different widgets can rely on different sub-APIs. These APIs are:

*   **Read** - This defines the basic methods for querying and retrieving items, and getting attribute values from these items. The defined methods include `fetch` (for querying), `getValue`, `getValues`, `getAttributes`, `hasAttribute`, `containsValue`, `isItem`, `isItemLoaded`, `loadItem`, `getLabel`, and `getLabelAttributes`. This API is fundamental and needed by just about any store.

*   **Write** - This API defines the methods for modifying data in a store. This includes methods `newItem`, `deleteItem`, `setValue`, `setValues`, `unsetAttribute`, `save`, `revert`, and `isDirty`.

*   **Identity** - This API defines the methods getting item's identity and retrieving items by their identity. This defines methods `getIdentity`, `getIdentityAttributes`, and `fetchItemByIdentity`. This API is important for efficient access to individual items.

*   **Notification** - This API defines three events that a store can fire when data is changed. The three events are `onSet`, `onNew`, and `onDelete`. This API allows widgets to respond in real-time to data changes.

One of the key aspects of Dojo Data usage is that all interactions with individual items must go through the store. To retrieve an attribute of an item, you must call `store.getValue(item, attributeName)` and to modify an attribute you must call `store.setValue(item, attributeName, newValue)`.

### Dojo Data Stores in Dojo

There are a healthy collection of Dojo Data stores in Dojo and DojoX. Here are some of the popular ones:

*   [dojo/data/ItemFileReadStore](/reference-guide/1.10/dojo/data/ItemFileReadStore.html#dojo-data-itemfilereadstore) - This is a basic in-memory store that can be constructed from a simple JavaScript array of object, or by giving it a URL to load data from JSON. This implements the Read and Identity APIs.
*   [dojo/data/ItemFileWriteStore](/reference-guide/1.10/dojo/data/ItemFileReadStore.html#dojo-data-itemfilewritestore) - This extends ItemFileReadStore to implement the Write and Notification APIs.
*   [dojox/data/QueryReadStore](/reference-guide/1.10/dojox/data/QueryReadStore.html#dojox-data-queryreadstore) - This is a store designed to communicate with a server using basic HTTP. This implements the Read and Identity APIs.
*   [dojox/data/ServiceStore](/reference-guide/1.10/dojox/data/ServiceStore.html#dojox-data-servicestore) - This store is also built for server side communication, but is based on the pluggable RPC services in dojox/rpc. This implements the Read and Identity APIs.
*   [dojox/data/JsonRestStore](/reference-guide/1.10/dojox/data/JsonRestStore.html#dojox-data-jsonreststore) - This store extends ServiceStore to do full HTTP/REST communication with a server based on the HTTP standards using the full range of GET, PUT, POST, and DELETE methods. This implements all the APIs.
*   [dojox/data/CsvStore](/reference-guide/1.10/dojox/data/CsvStore.html#dojox-data-csvstore) - This stores provides access to CSV formatted data.
*   [dojox/data/WikipediaStore](/reference-guide/1.10/dojox/data/WikipediaStore.html#dojox-data-wikipediastore) - This store provides access to Wikipedia data through their web API.
*   [dojox/data/FlickrStore](/reference-guide/1.10/dojox/data/FlickrStore.html#dojox-data-flickrstore) - This store provides access to Flickr data through their web API.

This just provides a brief intro to some of the data stores. There are a number of other stores that are [available in dojox/data as well](http://archive.dojotoolkit.org/nightly/dojotoolkit/dojox/data/).

These data stores can be used directly in widgets that consume the Dojo Data API. The DataGrid is one such widget, and we will take a look how to use this with a Dojo Data store. In this example, we will use the CSV store to demonstrate a unique Dojo Data store. First we create the store, and then we plug the store into the DataGrid:

```js
require([
	"dojox/data/CsvStore",
	"dojox/grid/DataGrid",
	"dojo/domReady!"
], function(CsvStore, DataGrid){
	var store = new CsvStore({
		url:"data/movies.csv"
	});
	var grid = new DataGrid({
		store: store,
		structure: [
			{name:"Title", field:"Title", width: "150px"},
			{name:"Year", field:"Year"},
			{name:"Producer", field:"Producer"}
		]
	}, "grid");
	grid.startup();
});
```
[View Demo](demo/demo.html)

### Widgets that use Dojo Data

There are several widgets that use Dojo Data. These include:

*   dojox/grid/DataGrid - The DataGrid is a component for tabular display of data, very frequently used widget. There are also subclasses of the DataGrid including the EnhancedGrid and TreeGrid.

*   dijit/Tree - The Tree is a component for hierarchical display of data, complete with full keyboard navigation, accessibility (as are all of the Dijit components) lazy loading, and more.

*   dijit/form/FilteringSelect - This is an autocomplete dropdown input, that uses a Dojo Data store to drive the selectable options.

*   dojox/widget/RollingList - This is widget that displays a list of items and rolls forward to nested lists as you select items for hierarchical drill down.

Naturally, we can plugin the Dojo data stores into these widgets. However, if you want to use the newer, simplified, object store interface, use one of Dojo's object stores or your own object store. You can still do that by using Dojo's dojo/data/ObjectStore adapter. You can simply construct an object store and the ObjectStore class will provide a Dojo Data compliant store that can be used with any of these widgets. For example, let's create a Memory store, to use with the DataGrid

```js
require([
	"dojo/store/Memory",
	"dojo/data/ObjectStore",
	"dojox/grid/DataGrid",
	"dojo/domReady!"
], function(Memory, ObjectStore, DataGrid){
	data = [
		{ abbr:'ec', name:'Ecuador', capital:'Quito' },
		/* array of data */
	];
	var objectStore = new Memory({
		data: data
	});
	grid = new DataGrid({
		store: ObjectStore({objectStore: objectStore}),
		structure: [
			{name:"Country", field:"name", width: "150px"},
			{name:"Abbreviation", field:"abbr"},
			{name:"Capital", field:"capital"}
		]
	}, "grid");
	grid.startup();
});
```

[View Demo](demo/store-adapter.html)

We will be upgrading our components to directly utilize the object store API in the future, to eliminate the need for the adapter, but for now it is still very easy to use the object stores with these components via the adapter.

### Legacy Data Stores with Object Store Based Widget

Dojo also includes an adapter for going the other direction, giving widgets that were built to consume newer simplified object stores, such as the [dgrid](http://dgrid.io/), the ability to use legacy Dojo Data stores. If you build a new widget that is designed to work with object stores, and we wanted to use the CsvStore, we could do so with the `dojo/store/DataStore` adapter:

```js
require([
	"dojo/store/DataStore",
	"dojo/data/CsvStore",
	"my/Widget"
], function(DataStore, CsvStore, Widget){
	// create a data store
	var dataStore = new CsvStore({
		url:"data/movies.csv"
	});
	// adapt it to the object store interface
	var objectStore = DataStore({
		store: dataStore
	});
	new my.Widget({
		store: objectStore
		// ...
	});
});
```

### Conclusion

The new object store interface provides numerous significant advancements and simplifications over the legacy Dojo Data store interface, there are still important data stores and widgets based on the old API, and it is important to understand when and how to use Dojo Data API for these components. The adapters that are included with new object store implementations are also an important part of the bridging the gap between the old and new interface and transitioning into the future of data-centric Dojo applications. To learn more about Dojo Data, check out the [reference documentation](/reference-guide/1.10/dojo/data.html) or the [quick start guide to Dojo Data](/reference-guide/1.10/quickstart/data/usingdatastores.html).