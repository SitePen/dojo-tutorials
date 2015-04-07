---
Category:  Working with Data
...

## Data Modeling for MVC Applications

The Model-Viewer-Controller (MVC) is a dominant paradigm for application development. Here we will look at the foundation Dojo provides for MVC-advised applications. We will learn how we can leverage Dojo object stores and Stateful objects for the foundational model, and how we can build modular viewer and controller code on top of the model.


### Data Modeling for MVC Applications

The Model-Viewer-Controller (MVC) is a dominant paradigm for application development. The MVC approach separates key common concerns for organized, manageable application code.
Dojo is heavily based on MVC principles, and provides powerful helpers for MVC-structured applications. The foundation of a well-designed MVC application is a solid data model. Here we will see how we can leverage Dojo object stores and [Stateful objects](/reference-guide/1.10/dojo/Stateful.html) to create a robust model that can be used in the view and controller code.

### Model

The model is the M in MVC. The data model represents the core information that your application is being used to access and manipulate. The model is the center of your application, the viewer and controller serve to connect the user with the data model in a friendly way. The model encapsulates the storage and validation concerns.

The [Dojo object store](../intro_dojo_store/) fulfills the role of model within Dojo applications. The store interface is designed to separate the data concerns from the rest of the application. Different storage mediums may be used without changing the store interface. Stores can be extended to provide far more than just storage capability. Let's look at constructing a basic store. We will use a JsonRest store and cache the items it returns:

```js
require(["dojo/store/JsonRest", "dojo/store/Memory", "dojo/store/Cache", "dojo/store/Observable"],
		function(JsonRest, Memory, Cache, Observable){
	masterStore = new JsonRest({
		target: "/Inventory/"
	});
	cacheStore = new Memory({});
	inventoryStore = new Cache(masterStore, cacheStore);
```


Now our inventoryStore represents our basic data model. We can retrieve data with get(), query with query(), and modify with put(). The store encapsulates the storage of this information, by handling the server interaction.

Our viewer can be connected to query results:

```js
results = inventoryStore.query("some-query");
viewResults(results);

// pass the results on to the view
function viewResults(results){
	var container = dom.byId("container");

	// results object provides a forEach method for iteration
	results.forEach(addRow);

	function addRow(item){
		var row = domConstruct.create("div",{
			innerHTML: item.name + " quantity: " + item.quantity
		}, container);
	}
}
```


Now our `viewResults` function acts as a viewer for the data model. We could also leverage `dojo/string`'s `substitute` function to do simple templating:

```js
	function addRow(item){
		var row = domConstruct.create("div",{
			innerHTML: string.substitute(tmpl, item);
		}, container);
	}
```


### Collection Data Binding

One important aspect of MVC is that viewers should monitor the data model, ready to respond to changes. This allows the controllers to avoid unnecessary couplings to the viewer. The controller should update the model, and then the viewer will observe and respond to this change. We can make the data model observable by using the `dojo/store/Observable` wrapper:

```js
masterStore = new Observable(masterStore);
...
inventoryStore = new Cache(masterStore, cacheStore);
```


Now our view can monitor query results using the observe method.

```js
function viewResults(results){
	var container = dom.byId("container");
	var rows = [];

	results.forEach(insertRow);

	results.observe(function(item, removedIndex, insertedIndex){
		// this will be called any time a item is added, removed, and updated
		if(removedIndex > -1){
			removeRow(removedIndex);
		}
		if(insertedIndex > -1){
			insertRow(item, insertedIndex);
		}
	}, true); // we can indicate to be notified of object updates as well

	function insertRow(item, i){
		var row = domConstruct.create("div", {
			innerHTML: item.name + " quantity: " + item.quantity
		});
		rows.splice(i, 0, container.insertBefore(row, rows[i] || null));
	}

	function removeRow(i){
		domConstruct.destroy(rows.splice(i, 1)[0]);
	}
}
```

[View Demo](demo/demo.html)

We now have a view that can respond directly to model changes and our controller code can make changes to the data in the store in response to user interaction. The controller could `put()`, `add()`, and `remove()` methods to affect changes. Typically controller code is concerned with handling events, so for example, we can create a new data object when a user clicks on the add button:

```js
on(addButton, "click", function(){
	inventoryStore.add({
		name: "Shoes",
		category: "Clothing",
		quantity: 40
	});
});
```

[View Demo](demo/demo.html)

This will trigger an update in the view, we don't need to directly interact with the view at all. This controller code is solely concerned with responding to user actions and controlling the model. The model's data storage and the view's rendering are completely separated from this code.

### Richer Data Models

The store that we have used so far is very simple, and doesn't include any logic besides simple object storage (although the server side may have extra logic and validation). We can add further functionality here without affecting the other components in our application.

#### Validation

One of the first extensions to the store we might want to add is validation. This is very simple with the `JsonRest` store because all updates go through the `put()` method (`add()` `calls put()`). We can simply extend the inventoryStore by adding a `put` method in the constructor call:

```js
var oldPut = inventoryStore.put;
inventoryStore.put = function(object, options){
	if(object.quantity < 0){
		throw new Error("quantity must not be negative");
	}
	// now call the original
	oldPut.call(this, object, options);
};
```


Now updates will be checked by our validation logic:

```js
inventoryStore.put({
	name: "Donuts",
	category: "Food",
	quantity: -1
});
```

[View Demo](demo/demo.html)
</p>
This should correctly throw an error to reject this change.
</p>

#### Hierarchy

<p>As we add logic to our data model, we are adding meaning to our raw data. One of the meanings we can add to our model is the exposure of hierarchy. The object store defines a `getChildren()` method that we can implement to make parent-child relationships visible. There are different ways we can store these relationships.

Stored objects can hold an array of references to children. This can be a good design where small ordered lists are needed. Alternatively, objects can keep track of their parent. The latter is a more scalable design.

To implement the latter approach, we can simply add a `getChildren()` method. In this example our hierarchy will come from having category objects that have individual items as children. We will create a `getChildren()` method that will find all objects whose category property matches the name of the parent object, therefore having the child/parent relationship defined as a property of the child:

```js
inventoryStore.getChildren = function(parent, options){
	return this.query({
		category: parent.id
	}, options);
};
```


Now, hierarchical viewers can call `getChildren()` to get a list of children for an object without needing to understand the structure of the data. Retrieval of children might look like:

```js
require(["dojo/_base/Deferred"], function(Deferred){
	Deferred.when(inventoryStore.get("Food"), function(foodCategory){
		// retrieved the food category object, now get it's children
		inventoryStore.getChildren(foodCategory).forEach(function(food){
			// handle each item in the food category
		});
	});
});
```


We can get the children of an object, now let's look at how to alter the collection of children of an object. When working with the inventoryStore we know that hierarchy is defined by the category property. If we want to move an item to be a child of a different category, we can simply change the category property:

```js
donut.category = "Junk Food";
inventoryStore.put(donut);
```


One of the key concepts with Dojo stores is to provide a consistent interface between data models and other components. If we want our hierarchy to be defined in such a way that components can set the parent of an object without knowledge of the internal structure of the objects, we can use the `parent` property of the `options` parameter to the `put()` method:

```js
inventoryStore.put = function(object, options){
	if(options.parent){
		object.category = options.parent;
	}
	// ...
};
```


Now we could change the parent:

```js
inventoryStore.put(donut, {parent: "Junk Food"});
```


#### Ordered Store

By default, a store represents an unordered collections of objects. However, we can easily implement ordering to the store if there is a preserved implicit order to the items. The first need of an ordered store is to return the objects in order from `query()` calls (when an alternate sort order is not defined). This doesn't really require an extension to the store as long you are already properly responding to queries with the correct ordering of items.

Ordered stores may also wish to provide an interface for objects to be moved to different points in the order. The application may wish to provide a means for moving objects up, down, to the top, or to the bottom. This is done by using the `before` property in the `put()`'s options argument:

```js
inventoryStore.put = function(object, options){
	if(options.before){
		// we set the reference object's name in the object's "insertBefore"
		// so the server can put the object in the right order
		object.insertBefore = options.before.id;
	}
	// ...
};
```


Our server can respond to the insertBefore property to properly order the objects now. Our controller code could now move objects around like this (we will use event delegation and assume we've set the node's `itemIdentity` and `beforeId` properties have been set during creation):

```js
require(["dojo/on"],
		function(on){
	on(moveUpButton, ".move-up:click", function(){
		// |this| in event delegation is the node
		// matching the given selector
		inventoryStore.put(inventoryStore.get(this.itemId), {
			before: inventoryStore.get(this.beforeId)
		});
	});
```


#### Transactional

Transactions are a critical part of many applications, and application logic often needs to define what operations need to be combined atomically. One approach to transactions is to collect all the operations during a transaction and send them all inside a single request when the transaction is committed. Here is an example of how we can do that:

```js
require(["dojo/_base/lang"],
		function(lang){
	lang.mixin(inventoryStore, {
		transaction: function(){
			// start a transaction, create a new array of operations
			this.operations = [];
			var store = this;
			return {
				commit: function(){
					// commit the transaction, sending all the operations in a single request
					return xhr.post({
						url:"/Inventory/",
						// send all the operations in the body
						postData: JSON.stringify(store.operations)
					});
				},
				abort: function(){
					store.operations = [];
				}
			};
		},
		put: function(object, options){
			// ... any other logic ...

			// add it to the queue of operations
			this.operations.push({action:"put", object:object});
		},
		remove: function(id){
			// add it to the queue of operations
			this.operations.push({action:"remove", id:id});
		}
	});
```


And we could then create our custom operation that makes use of the transactions:

```js
	removeCategory: function(category){
		// atomically remove entire category and the items within the category
		var transaction = this.transaction();

		var store = this;
		this.getChildren(category).forEach(function(item){
			// remove each child
			store.remove(item.id);
		}, this).then(function(){
			// now remove the category
			store.remove(category.id);
			// all done, commit the changes
			transaction.commit();
		});
	}
```


### Object Data Binding: dojo/Stateful

Dojo makes a clear delineation between the collection level concerns and the entity level concerns of the data model. Dojo store provides the collection level architecture. Now we will look at the modeling of individual objects. Dojo uses the same concept of a consistent uniform interface for modeling individual objects. Here we can use the `dojo/Stateful` interface to interact with objects. The interface is very simple, there are three key methods:

*   `get(name)` - Retrieves the value of the given named property.
*   `set(name, value)` - Sets the value of the given named property.
*   `watch(name, listener)` - Registers a callback for changes in the given property (first parameter can be omitted to listen for any changes).

This interface affords the same opportunity as the store for viewers to be given data so they can render it and react to changes in the data. Let's create a viewer that binds a simple HTML form to an object. First, our HTML, which could look like this:

```html
<form id="itemForm">
	Name: <input type="text" name="name" />
	Quantity: <input type="text" name="quantity" />
</form>

```


And then we could bind to the HTML:

```js
function viewInForm(object, form){
	// copy initial values into form inputs
	for(var i in object){
		updateInput(i, null, object.get(i));
	}
	// watch for any future changes in the object
	object.watch(updateInput);
	function updateInput(name, oldValue, newValue){
		var input = query("input[name=" + name + "]", form)[0];
		if(input){
			input.value = newValue;
		}
	}
}
```


Now we can initiate this from within an object from the store:

```js
require(["dojo/Stateful", "dojo/_base/Deferred"],
		function(Stateful, Deferred){
	Deferred.when(store.get("Donut"), function(item){
		item = new Stateful(item); // wrap with stateful
		viewInForm(item, dom.byId("itemForm"));
	});
```

[View Demo](demo/demo.html)

And now controller code could modify this object, and the viewer will respond instantly:

```js
item.set("quantity", 4);
```


In the case of a form, we may also want to add `onchange` event listeners that would update the object when the input changes, so as to make the data binding bidirectional (changes to the object are reflected in the form, and changes in the form are reflected in the object). Dojo also offers much more advanced form interaction functionality with the [form manager](../form_manager/).

Also remember that the wrapped object can and should be `put()` back to the store when changes are ready to be committed. We could also have controller code:

```js
on(saveButton, "click", function(){
	inventoryStore.put(currentItem); // save the current state of the Stateful item
});
```

[View Demo](demo/demo.html)

### dstore: The future of dojo/store

The new [dstore](https://github.com/sitepen/dstore) package is the successor to dojo/store, and works with Dojo 1.8+, and is the planned API for Dojo 2. If you are just getting started with Dojo, we recommend taking a look at dstore. Note that it also includes support for collections and data modelling.

### Summary

By using the Dojo store architecture and the stateful interfaces, we have a solid data model foundation to build our MVC applications. Viewers can render data models and directly monitor and respond to changes in the data. Controllers can interact with data in a consistent manner without coupling to specific data structures, and without explicitly manipulating viewers. Collection and entity interfaces are clearly distinguished. All of this comes together to help you build organized, manageable applications with clean separation of concerns that can rapidly evolve.