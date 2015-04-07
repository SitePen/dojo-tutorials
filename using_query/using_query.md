---
Category:  DOM Basics
...

## Using dojo/query

In this tutorial, we will learn about DOM querying and how the `dojo/query` module allows you to easily select nodes and work with them.

### Getting Started

When working with the DOM, it's important to be able to retrieve nodes quickly and efficiently. We've [covered one option](../dom_functions/#byId): `dom.byId`. However, coming up with unique IDs for every interesting node in your application can be a daunting and impractical task. It would also be inefficient to find and operate on multiple nodes by ID alone. Thankfully, there is another solution: `dojo/query`. The `dojo/query` module uses familiar CSS queries (which you use in your stylesheets) to retrieve a list of nodes, including support for advanced CSS3 selectors!

### Queries

To demonstrate some of the most common queries, we'll be using the following HTML, which might be something you would see if you were developing a list of links for a website:

```html
<ul id="list">
	<li class="odd">
		<div class="bold">
			<a class="odd">Odd</a>
		</div>
	</li>
	<li class="even">
		<div class="italic">
			<a class="even">Even</a>
		</div>
	</li>
	<li class="odd">
		<a class="odd">Odd</a>
	</li>
	<li class="even">
		<div class="bold">
			<a class="even">Even</a>
		</div>
	</li>
	<li class="odd">
		<div class="italic">
			<a class="odd">Odd</a>
		</div>
	</li>
	<li class="even">
		<a class="even">Even</a>
	</li>
</ul>

<ul id="list2">
	<li class="odd">Odd</li>
</ul>
```


The first thing you might want to do is get a handle for the entire list. As we've seen before, you can use `dom.byId`, but you can also use `query`. At first glance, this approach isn't that useful, but we'll be building from this example:

```js
// require the query, dom, and domReady modules
require(["dojo/query", "dojo/dom", "dojo/domReady!"], function (query, dom) {
	// retrieve an array of nodes with the ID "list"
	var list = query("#list")[0];
})
```

By prepending an identifier with "#", we are telling `query` to look for nodes with that ID property. This convention should be familiar from CSS. One thing to note: `query` always returns an array. We'll talk more about this array later, but since there is only one (and **should** only be one) node with the ID "list", we fetch that element out of the array.

Fetching nodes by ID is nice, but it's no more powerful than using `dom.byId`. However, `query` allows you to select nodes by class names as well. Let's say we wanted to retrieve only the nodes with the "odd" class name:

```js
// retrieve an array of nodes with the class name "odd"
var odds = query(".odd");
```


By prepending an identifier with ".", we are telling `query` to look for nodes with that identifier in their `className` property. Again, this is exactly like CSS. Using our example markup, `query` will return an array containing 4 `<li>`'s and 3 `<a>`'s.

### Restricting your query

You might have noticed that `odds` in the prior example contains nodes from both lists that are in the DOM. Let's say we only wanted the odd nodes from the first list. There are two ways to do this:

```js
// retrieve an array of nodes with the class name "odd"
// from the first list using a selector
var odds1 = query("#list .odd");

// retrieve an array of nodes with the class name "odd"
// from the first list using a DOM node
var odds2 = query(".odd", dom.byId("list"));
```


Both arrays contain the same elements, but through different methods: the first by using selector syntax and letting the query engine limit the results from all of the DOM; the second by limiting the scope of the query engine to a specific DOM node.

When `query` is executed without a second parameter, it will search the entire DOM structure, going through effectively every node under <html>. When a DOM node is specified as the second argument, it restricts the query to that node and its children.

If your DOM is relatively small, such as in our example, omitting the second argument is acceptable. However, for pages with a larger DOM structure, it's preferable to restrict your `query` calls with the second argument. It makes for more specific selections that execute more quickly than searches across the full document.

For the rest of our examples here, we will be omitting the second scoping argument, but keep the previous paragraph in mind when using `query` yourself &mdash; keeping your searches quick and lean results in faster code and better user experience.

### More advanced selections

Our previous query results contained a mix of `<li>`'s and `<a>`'s, but what if we're only concerned about the `<a>`'s? You can combine tag names with class names:

```js
var oddA = query("a.odd");
```


Instead of separating identifiers (which shows hierarchy), you can combine identifiers to target nodes more specifically; this includes combining class names, which has varying effects in stylesheets cross-browser, but works using `query`.

Another selector that works in `query` across browsers, but isn't supported everywhere in stylesheets, is ">". This will look only immediately below the first selector for the second. For instance:

```js
// Retrieve an array of any a element that has an
// li as its ancestor.
var allA = query("li a");
// Retrieve an array of any a element that has an
// li as its direct parent.
var someA = query("li > a");
```

[View Demo](demo/queries.html)

`allA` will contain a total of 6 `<a>`'s, whereas `someA` will only contain 2 `<a>`'s. Any selector can be on either side of ">", including class selectors. We've only covered a few of the more common selectors here, but `query` is fully CSS3 compliant and accepts [many more selectors](/reference-guide/1.10/dojo/query.html#standard-css3-selectors) which you can experiment with on your own.

### NodeList

As mentioned before, `query` returns an array of nodes that match the selector; this array is actually a [`dojo/NodeList`](/reference-guide/1.10/dojo/NodeList.html) and has methods for interacting with the nodes contained in it. The demo for the previous examples used a couple of these methods, but let's take a look at some of the ones you'll most likely use in your applications. For this set of examples, we'll be using the following markup:

```html
<div id="list">
	<div class="odd">One</div>
	<div class="even">Two</div>
	<div class="odd">Three</div>
	<div class="even">Four</div>
	<div class="odd">Five</div>
	<div class="even">Six</div>
</div>
```


`NodeList` has methods that match the Dojo array helper methods. One such method is `forEach`, which will execute a function for each node in the array:<p>
```js
// Wait for the DOM to be ready before working with it
require(["dojo/query", "dojo/dom-class", "dojo/domReady!"],
	function(query, domClass) {

		query(".odd").forEach(function(node, index, nodelist){
			// for each node in the array returned by query,
			// execute the following code
			domClass.add(node, "red");
		});

});
```

<p>The function passed to `forEach`, also known as a callback, is called for each item in the array with the following arguments: the node it's currently on, the index of the node, and the `NodeList` being iterated over. For most developers, the third argument can be ignored; however, in instances where the array isn't stored in a variable for easy access (such as in this example), the third argument can be useful for getting other items from the array. The `forEach` method also accepts a second argument to specify what scope the callback should be called in.

Other array helper functions that are defined for `NodeList`s are `map`, `filter`, `every`, and `some`. Each of these methods returns a `NodeList` for easy chaining, except for `every` and `some`, which return a boolean.

There are several _extension_ modules that extend `NodeLists` by adding extra methods to them. Class and style helper methods are in the `dojo/NodeList-dom` module.  `dojo/NodeList-dom` provides convenience methods that match various DOM methods in Dojo, so the prior example could be simplified:

```js
require(["dojo/query", "dojo/NodeList-dom", "dojo/domReady!"], function(query) {
	// Add "red" to the className of each node matching
	// the selector ".odd"
	query(".odd").addClass("red");
	// Add "blue" to the className of each node matching
	// the selector ".even"
	query(".even").addClass("blue");
});
```


The DOM methods are executed for each node in the `NodeList` and return a `NodeList` for easy chaining:

```js
// Remove "red" from and add "blue" to the className
// of each node matching the selector ".odd"
query(".odd").removeClass("red").addClass("blue");
```


Other DOM methods that are defined by `dojo/NodeList-dom` are `style`, `toggleClass`, `replaceClass`, `place`, and `empty`. Each of these methods returns a `NodeList` as well:

```js
// Change the font color to "white" and add "italic" to
// the className of each node matching the selector ".even"
query(".even").style("color", "white").addClass("italic");
```

[View Demo](demo/nodelist.html)

### Events

Another convenience method that `NodeList` provides is `on` for connecting to DOM events. Although DOM events are covered in the next tutorial, we'll cover the syntax of using `NodeList`'s `on` method. It should also be noted that even though this is a convenient syntax, this approach should not be used with a `NodeList` that contains a large number of nodes; instead, a technique called _event delegation_ should be used in those instances, which is covered in the [events tutorial](../events/).

```js
<button class="hookUp demoBtn">Click Me!</button>
<button class="hookUp demoBtn">Click Me!</button>
<button class="hookUp demoBtn">Click Me!</button>
<button class="hookUp demoBtn">Click Me!</button>
<script>
	// Wait for the DOM to be ready before working with it
	require(["dojo/query", "dojo/domReady!"], function(query) {
		query(".hookUp").on("click", function(){
			alert("This button is hooked up!");
		});
	});
</script>
```

[View Demo](demo/events.html)

This convenient `on` method attaches to every node returned by the query!

### Conclusion

As you can see, working with DOM nodes in bulk is fairly simple. Using `query`, we can quickly and easily get a collection of the nodes that we want to work with. Being able to adjust styles and change classes in bulk is pretty handy, but where Dojo really starts to shine is adding interaction to a page. We've shown a simple example of how to handle a click event, but in the [next tutorial](../events), we'll dive deeper into handling events with Dojo.