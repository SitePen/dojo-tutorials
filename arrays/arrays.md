---
Category:  Fundamentals
...

## Arrays

In this tutorial, you'll learn about Dojo's cross-platform solution for easily working with arrays in JavaScript: `dojo/_base/array`.

### Getting Started

Data access and manipulation is a very important aspect of development that you will encounter when building your web application. The implementors of JavaScript knew this, and have added some methods on array instances to aid in working more easily with them. Sadly, not all browsers and environments have adopted these new methods. The good news is that Dojo provides array helper methods along the lines of the new methods, so no matter what environment you're running in, you'll be able to easily work with arrays.

### Searching

One operation you will need to use when working with arrays is finding an item within an array. Dojo provides two functions within the `dojo/_base/array` resource: `indexOf` and `lastIndexOf`. The `indexOf` method searches through an array from lowest index to highest, and `lastIndexOf` searches from highest to lowest. Both take the same arguments: an array to search, an item to search for, and an optional index to start from. Let's look at some examples:

```js
require(["dojo/_base/array"], function(arrayUtil) {
	var arr1 = [1,2,3,4,3,2,1,2,3,4,3,2,1];
	arrayUtil.indexOf(arr1, 2); // returns 1
	arrayUtil.indexOf(arr1, 2, 2); // returns 5
	arrayUtil.lastIndexOf(arr1, 2); // returns 11
});
```

If an item is not found, both functions will return `-1`. One thing to note is internally, both functions use strict comparison (`===`) so you can search for more than just primitive values:

```js
var obj1 = { id: 1 },
	arr2 = [{ id: 0 }, obj1, { id: 2 }, { id: 3 }];

// This search returns 1, as obj1 is the second item
// in the array.
arrayUtil.indexOf(arr2, obj1);

// This search returns -1. While the objects may look similar,
// they are entirely different objects, and so this object
// isn't found in the array.
arrayUtil.indexOf(arr2, { id: 1 });
```

[View Demo](demo/searching.html)

### Looping

Another frequent operation is looping over the items of an array. Usually, this is done with something similar to the following:

```js
var item;
for(var i = 0; i &lt; arr.length; i++){
	item = arr[i];
	// do something with item
}
```

One disadvantage of setting loops up like this is that if you access `item` from within an event handler, it won't be the item you'll be expecting; instead, it will be the last item of the array for all of the event handlers. The `forEach` it gives us a standard way to set up loops like this while also preserving the item for you during scope chain lookups. It conforms to `Array.prototype.forEach` with two exceptions:

* It will iterate over indices that are unassigned that are found between assigned indices. What this means is that if you have an undefined value somewhere in your array, it will still execute your function for that index, as opposed to just skipping it.
* The looping is done over the array itself. When using the native `forEach` method in supported browsers, it loops over a copy of the array, and not the array itself. That means that any changes you make to the base array in the function are visible to later executions of that function.

In fact, these two differences are true for all of the methods discussed in this tutorial. Let's take a look at an example:

```js
var arr = ["one", "two", "three", "four"],
	// dom is from dojo/dom
	list1 = dom.byId("list1");

// Skip over index 4, leaving it undefined
arr[5] = "six";

arrayUtil.forEach(arr, function(item, index){
	// This function is called for every item in the array
	if(index == 3){
		// this changes the original array,
		// which changes the item passed to
		// the sixth invocation of this function
		arr[5] = "seven";
	}

	// domConstruct is available at dojo/dom-construct
	domConstruct.create("li", {
		innerHTML: item + " (" + index + ")"
	}, list1);
});
```

The `arrayUtil.forEach` method accepts three (3) arguments: an array to iterate over, a function (or callback) to call for each item of the array (including unassigned indexes between assigned ones, as described above), and an optional object to use as the scope in which to call the callback.

The callback that you provide will be called for each index in the array, up to and including the last assigned index, and will be called with three (3) parameters: the object or value found at the current index, the current index itself, and a reference to the array being iterated over. The callback will also be called in the scope of the third parameter to `arrayUtil.forEach`, or the global object (`window` in the case of a browser) if the third parameter is not provided. Let's take a look at the scope parameter:

```js
var list2 = dom.byId("list2"),
	myObject = {
		prefix: "ITEM: ",
		formatItem: function(item, index){
			return this.prefix + item + " (" + index + ")";
		},
		outputItems: function(arr, node){
			arrayUtil.forEach(arr, function(item, index){
				domConstruct.create("li", {
					innerHTML: this.formatItem(item, index)
				}, node);
			}, this);
		}
	};

myObject.outputItems(arr, list2);
```

This is probably one of the most-used patterns for the scope parameter: passing `this` so the callback function will be called in the same scope as the method calling it. This pattern is very useful when you're working with widgets, so store it away for later use.

[View Demo](demo/looping.html)

### Manipulating

Dojo makes looping quite easy, but often you'll want to take data in an array and do something with it that results in a new array. Let's say we have an array of strings that we want to transform into objects with their "name" property set to the string. Given what we know, we might do something similar to this:

```js
var original = ["one", "two", "three", "four", "five"],
	transformed = [];

arrayUtil.forEach(original, function(item, index){
	transformed.push({
		id: index * 100,
		text: item
	});
}); // [ { id: 0, text: "one" }, { id: 100, text: "two" }, ... ]
```

This is not an incorrect solution, but it is also something that has been handled in new versions of JavaScript and for which Dojo has an equivalent: `arrayUtil.map`. Let's take a look:

```js
var mapped = arrayUtil.map(original, function(item, index){
	return {
		id: index * 100,
		text: item
	};
}); // [ { id: 0, text: "one" }, { id: 100, text: "two" }, ... ]
```

The arguments for `map` are the same as `forEach`. The difference is that the return value of the callback will be stored in a new array at the same index as the item originally received by the callback. The new array is returned from `map`.

Another common transformation from newer versions of JavaScript that is covered by Dojo is `filter`. The idea behind `filter` is that you have an array and you may want to just select certain items out of it based on some sort of conditional. Again, this could be done using `forEach`, but using `filter` helps simplify the pattern greatly.

The arguments don't change from `map`, but in `filter`, the return value of the callback is evaluated and if it is truthy, the item is appended to the array returned from `filter`. Let's look at another example:

```js
var filtered = arrayUtil.filter(mapped, function(item, index){
	return item.id &gt; 50 && item.id &lt; 350;
}); // [ { id: 100, text: "two" }, { id: 200, text: "three" },
    //   { id: 300, text: "four" } ]
```
[View Demo](demo/manipulating.html)

### Matching

Sometimes you'll want to know if the items in an array match a certain condition: perhaps you want to know if some objects have an error property on them, or you want to be sure that all objects have a text property. This is where `some` and `every` come in handy. The function signature is exactly like `filter` (including what the callback should return), but rather than return an array, a boolean is returned: `every` will return `true` if the callback returns `true` for every item in the array, and `some` will return `true` if the callback returns `true` for at least one item in the array. The following examples should make this clear:

```js
var arr1 = [1,2,3,4,5],
	arr2 = [1,1,1,1,1];

arrayUtil.every(arr1, function(item){ return item == 1; }); // returns false
arrayUtil.some(arr1, function(item){ return item == 1; });  // returns true

arrayUtil.every(arr2, function(item){ return item == 1; }); // returns true
arrayUtil.some(arr2, function(item){ return item == 1; });  // returns true

arrayUtil.every(arr2, function(item){ return item == 2; }); // returns false
arrayUtil.some(arr2, function(item){ return item == 2; });  // returns false
```

An easy way to think of these two functions is that `every` is like using the `&&` operator in an `if` statement, and `some` is like using the `||` operator.

[View Demo](demo/matching.html)

### Conclusion

The JavaScript specification has given us quite a few powerful methods of arrays, but not all browsers and environments support them. Dojo's `dojo/_base/array` module bridges this gap between new and old with its array methods, so that you can quickly and efficiently do more with less code.