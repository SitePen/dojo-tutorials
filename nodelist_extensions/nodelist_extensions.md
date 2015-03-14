## NodeList Extensions

Dojo includes a range of extensions to the `NodeList` collection that is used by `dojo/query`. In this tutorial, we’ll look at what extended functionality is available and how to put it to good use.

*   <span>Difficulty:</span> Beginner
*   <span>Dojo Version:</span> 1.10


### Getting Started

In the earlier [tutorial](../using_query/) on [`dojo/query`](/reference-guide/1.10/dojo/query.html), we saw how to get a collection of
	nodes matching a query or selector, and how to use the methods on [`dojo/NodeList`](/reference-guide/1.10/dojo/NodeList.html) to work with those nodes.
	Let's quickly recap. Here's the markup we’ll be using for most of the demos (we're going with a fruity theme for
	this tutorial):

The `dojo/NodeList` object is different from the DOM
[`NodeList`](https://developer.mozilla.org/en-US/docs/DOM/NodeList) object.
Dojo's `NodeList` is an actual instance of an array decorated with extra methods.
ES5 iteration methods are guaranteed to be available even in a non-ES5 environment, and as you
will see in this tutorial there are various modules that can extend `dojo/NodeList`
with additional useful methods.

<pre class="brush: html;">
&lt;button type="button" id="btn">Pick out fresh fruits&lt;/button&gt;

&lt;h3&gt;Fresh Fruits&lt;/h3&gt;
&lt;ul id="freshList"&gt;&lt;/ul&gt;

&lt;h3&gt;Fruits&lt;/h3&gt;
&lt;ul&gt;
	&lt;li class="fresh"&gt;Apples&lt;/li&gt;
	&lt;li class="fresh"&gt;Persimmons&lt;/li&gt;
	&lt;li class="fresh"&gt;Grapes&lt;/li&gt;
	&lt;li class="fresh"&gt;Fresh Figs&lt;/li&gt;
	&lt;li class="dried"&gt;Dates&lt;/li&gt;
	&lt;li class="dried"&gt;Raisins&lt;/li&gt;
	&lt;li class="dried"&gt;Prunes&lt;/li&gt;
	&lt;li class="fresh dried"&gt;Apricots&lt;/li&gt;
	&lt;li class="fresh"&gt;Peaches&lt;/li&gt;
	&lt;li class="fresh"&gt;Bananas&lt;/li&gt;
	&lt;li class="fresh"&gt;Cherries&lt;/li&gt;
&lt;/ul&gt;
</pre>


To demonstrate `dojo/query`, a click handler is created for the button:

<pre class="brush: js;">
require(["dojo/query", "dojo/domReady!"], function(query){
	query("#btn").on("click", function(){
		var nodes = query("li.fresh");
		nodes.on("click", function(){
			alert("I love fresh " + this.innerHTML);
		});
	});
});
</pre>


The `query("li.fresh")` call returns a `NodeList`, which is a standard JavaScript array
	decorated with additional methods that let us work more easily with a collection of DOM nodes. Because each
	`query` call returns a `NodeList`, we can make this even simpler by chaining method calls (
	instead of typing `var nodes` over and over again):

<pre class="brush: js;">
require(["dojo/query", "dojo/domReady!"], function(query){
	query("#btn").on("click", function(){
		query("li.fresh").on("click", function(event){
			alert("I love fresh " + event.target.innerHTML);
		});
	});
});
</pre>


[View Demo](demo/nodelist_extensions-queryRecap.php)

Troubleshooting chains of method calls can be difficult, as there is nowhere to add logging
	statements or breakpoints in the debugger. Break apart the chain into discrete steps to inspect what each method
	returns.

### Doing More with `NodeList`

This pattern of _getting some nodes and doing something with them_ is pervasive enough that many potential
	features of `NodeList` end up conflicting with the modular nature of Dojo and a focus on providing
	"composable" functionality. As a result, in Dojo and DojoX, there are a variety of NodeList extension modules that
	can be loaded to add new functionality to `NodeList` as necessary. Let's take a look at
	them now.

### A Note on Documentation

In the API viewer, the [NodeList](/api/1.10/dojo/NodeList.html) object is displayed with all the
	extensions to it that are declared in all the extension modules from both Dojo and DojoX.  Although the source
	module is identified, it is rather "complex".  In addition the individual modules which extend the object are
	essentially "blank".  In the reference guide though, each module has its own page (e.g. the
	[`dojo/NodeList-data`](/reference-guide/1.10/dojo/NodeList-data.html) page)
	which makes it clearer what methods are provided by that module.

### Working with Styles and DOM

Prior to Dojo 1.7, the base `NodeList` featured DOM methods such as `addClass`,
	`removeClass`, `attr`, `style`, `empty`, and `place`.  With
	the advent of AMD and Dojo 1.7+, these methods have been moved to [`dojo/NodeList-dom`](/reference-guide/1.10/dojo/NodeList-dom.html).  Here's an
	example of how you use that module:

<pre class="brush: js;">
require(["dojo/query", "dojo/NodeList-dom"], function(query){
	query("li.fresh")
		.addClass("fresher")
		.attr("title", "freshened")
		.style("background", "lightblue")
		.on("click", function(){
			alert("I love fresh " + this.innerHTML);
		});
});
</pre>


Simply loading the `dojo/NodeList-dom` module adds these methods to `NodeList`.
They act exactly as they do with `dojo/dom` and related modules.

### Animating Elements

The [`dojo/NodeList-fx`](/reference-guide/1.10/dojo/NodeList-fx.html) module
	augments `NodeList` with a series of methods that allow you to apply effects from Dojo's effects system
	to a collection of nodes. These methods function identically to their non-NodeList counterparts, so take a look at
	the [Dojo Effects](../effects/) and [Animation](../animation/) tutorials if you aren't
	familiar with them.

In this demo, we’ll use the same fruity list, and a button that executes the following code when clicked:

<pre class="brush: js;">
require(["dojo/query", "dojo/NodeList-fx", "dojo/domReady!"], function(query){
	query("#btn").on("click", function(){
		query("li.fresh")
			.slideTo({
				left: 200, auto: true
			})
			.animateProperty({
				properties: {
					backgroundColor: { start: "#fff", end: "#ffc" }
				}
			})
			.play();
	});
});
</pre>


[View Demo](demo/nodelist_extensions-fx.php)

Unlike most `NodeList` methods, **`NodeList-fx` methods return an
	animation object by default**, which conflicts with the normal chaining behavior of `NodeList`.
	This is because Dojo’s animation functions normally return an animation object, and it is up to you to call
	`play` on that object to start the animation. To cause a `NodeList-fx` method to
	automatically play the animation and return a `NodeList` instead, set `auto: true` in the
	object passed to the function, as demonstrated above in the `slideTo` call.

### Associating Data with Elements

The [`dojo/NodeList-data`](/reference-guide/1.10/dojo/NodeList-data.html)
	module adds a mechanism for attaching arbitrary data to elements via the `data` method. Here is an
	example that stashes a `Date` object on an element each time it is clicked:

<pre class="brush: js;">
require(["dojo/query", "dojo/NodeList-data", "dojo/domReady!"], function(query, NodeList){
	function mark(){
		var nodeList = new NodeList(this);		// make a new NodeList from the clicked element
		nodeList.data("updated", new Date());	// update the 'updated' key for this element via the NodeList
	}

	query("li")							// get all list items
		.data("updated", new Date())	// set the initial data for each matching element
		.on("click", mark);				// add the event handler

	query("#btn").on("click", function(){
		query("li").data("updated").forEach(function(date){
			console.log(date.getTime());
		});
	});
});
</pre>


[View Demo](demo/nodelist_extensions-data.php)

Here, we’re doing three things:

*   Associating an initial `Date` object with each element.
*   Setting up a `click` handler to call the `mark()` function
*   Setting up a button that allows us to view the data for each item.

Inside the click handler, we still need a `NodeList` to get at the data properties for the clicked
	element, so we create a new one from the element that was clicked. The existing `Date` object on the clicked element is then replaced with a new one.

With `NodeList-data`, it is **extremely important** that you call
	`removeData` on the `NodeList` when removing elements from the DOM. If this is not done,
	your application **will leak memory**, since the data is not actually stored on the element itself
	and will not be garbage collected even if the node itself is.

### Moving Around the DOM

The [`dojo/NodeList-traverse`
	](/reference-guide/1.10/dojo/NodeList-traverse.html) module adds methods to NodeList that allow you to easily move around the DOM to find parents, siblings, and
	children of reference nodes.

To illustrate, we’ll use a longer, categorized list of fruit. Some fruits have been marked as tasty (with the class
	of `yum`), and we want to be able to:

1.  Highlight them.
2.  Indicate in the header for that list that there’s goodness inside.

Using the methods provided by `NodeList`, `dojo/NodeList-traverse` and
	`dojo/NodeList-dom`, here is one quick way to do that:

<pre class="brush: js;">
require(["dojo/query", "dojo/NodeList-traverse", "dojo/NodeList-dom",
		"dojo/domReady!"], function(query){
	query("li.yum")				// get LI elements with the class 'yum'
		.addClass("highlight")	// add a 'highlight' class to those LI elements
		.closest(".fruitList")	// find the closest parent elements of those LIs with the class 'fruitList'
		.prev()					// get the previous sibling (headings in this case) of each of those fruitList elements
		.addClass("happy")		// add a 'happy' class to those headings
		.style({backgroundPosition: "left", paddingLeft: "20px"}); // add some style properties to those headings
});
</pre>


[View Demo](demo/nodelist_extensions-traverse.php)

The chain here starts with an initial query to find the list nodes we're interested in, then uses traversal methods
	to move up and sideways to find the heading elements associated with the lists that contain those list nodes.

The important thing to understand with the traversal methods is that each call returns a _new_ NodeList
	containing the results of your traversal. Methods like `closest()`, `prev()`, and
	`next()` are essentially sub-queries, with the nodes in the current NodeList being used as a reference
	point for the next sub-query. Most of these methods function identically to traversal methods in jQuery and should
	feel very familiar to users of that library.

### Manipulating Elements

The [`dojo/NodeList-manipulate
	`](/reference-guide/1.10/dojo/NodeList-manipulate.html) extension module complements the traverse module by adding some methods for manipulating the nodes in
	a `NodeList`. This module adds methods mirroring jQuery's manipulation methods.

The following example puts some of these capabilities to use. Using the same categorized list of fruits, it builds
	two new lists of yummy and yucky fruits:

<pre class="brush: js;">
require(["dojo/query", "dojo/NodeList-manipulate", "dojo/domReady!"],
function(query){
	query(".yum") // get elements with the class 'yum'
		.clone() // create a new NodeList containing cloned copies of each element
		.prepend('<span class="emoticon happy"></span>') // inject a span inside each of the cloned elements
		.appendTo("#likes"); // insert the clones into the element with id 'likes'

	query(".yuck")
		.clone()
		.append('<span class="emoticon sad"></span>')
		.appendTo("#dontLikes");
});
</pre>


[View Demo](demo/nodelist_extensions-manip.php)

The key to this demo is the use of the `clone` method to create duplicates of the original elements. As
	with the `NodeList-traverse` methods, `clone` returns a new NodeList containing all newly
	cloned elements which are then modified and appended to the DOM. If clones were not created, the original elements
	would have been modified and moved instead.

### Advanced Content Injection

The [`dojo/NodeList-html`](/reference-guide/1.10/dojo/NodeList-html.html) module brings the
	advanced capabilities of [`dojo/html::set()`](/reference-guide/1.10/dojo/html.html) to
	`NodeList`. Here's a simple example of its use, in which we turn a simple list into a checkbox list
	using `dijit/form/CheckBox` widgets:

<pre class="brush: js;">
require(["dojo/query", "dojo/_base/lang", "dijit/form/CheckBox", "dojo/NodeList-html", "dojo/domReady!"],
function(query, lang){
	var demo = {
		addCheckboxes: function(q) {
			query(q).html('&lt;input name="fruit" value="" data-dojo-type="dijit/form/CheckBox"&gt;', {
				onBegin: function(){
					var label = lang.trim(this.node.innerHTML),
						cont = this.content + label;
					cont = cont.replace('value=""', 'value="'+lang.trim(this.node.innerHTML) + '"');

					this.content = cont;
					return this.inherited("onBegin", arguments);
				},
				parseContent: true
			});
		}
	}

	query("#btn").on("click", lang.hitch(demo, "addCheckboxes", "li.alkaline"));
});
</pre>


[View Demo](demo/nodelist_extensions-htmlSet.php)

With the rich capabilities offered by other NodeList methods, especially those in `NodeList-manipulate`,
	the `NodeList-html` module is probably not one you will use very often, if at all. It is mentioned here
	nonetheless because it can still be useful as a specialized tool to solve a certain class of problems that would
	be much more difficult to solve in other ways.

### Conclusion

`NodeList` modules extend the existing `NodeList` API without bloating your code with
	features you won't use. By using some of these extensions in your code, you will be able to work with the DOM much
	more effectively and efficiently.