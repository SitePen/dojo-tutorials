## Dojo DOM Functions

In this tutorial, you'll learn about how to use Dojo to manipulate the DOM in a simple, cross-browser way. Using basic DOM knowledge and only a few Dojo functions, you will be able to efficiently create, read, update and delete elements in the page on the fly.

### Getting Started

As far as browser-based JavaScript is concerned, the Document Object Model (DOM) is the glass that we paint on to put content and user interface in front of our users. If we want to augment, replace or add to the HTML once loaded into the browser, JavaScript and the DOM is how it's done. Dojo aims to make working with the DOM easy and efficient by providing a handful of convenience functions that fill some awkward cross-browser incompatibilities and make common operations simpler and less verbose.

To explore those functions we will be manipulating a simple page containing an unordered list with five elements in it:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Demo: DOM Functions</title>
        <script src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js"
            data-dojo-config="async: true">
        </script>
        <script>
            require(["dojo/domReady!"], function() {

            });
        </script>
    </head>
    <body>
        <ul id="list">
            <li id="one">One</li>
            <li id="two">Two</li>
            <li id="three">Three</li>
            <li id="four">Four</li>
            <li id="five">Five</li>
        </ul>
    </body>
</html>
```

The page already has the Dojo script tag, and you should recognize the `require` block. All code that manipulates the DOM must wait until the DOM is ready before it can be executed.

### Retrieval

First things first: We need to know how to get elements from the DOM, in order to work with them. The easiest way to do that is by using the `dojo/dom` resource's `byId` method. When you pass an ID to `dom.byId`, you will receive the DOM node object with that ID.  If no matching node is found, a null value will be returned.

This is the equivalent of using `document.getElementById`, but with two advantages: it is shorter to type, and it works around some browsers' buggy implementations of `getElementById`. Another nice feature of `dom.byId` is that when it is passed a DOM node, it immediately returns that node. This helps to create APIs that take both strings and DOM nodes. Let's look at an example:

```js
// Require the DOM resource
require(["dojo/dom", "dojo/domReady!"], function(dom) {

	function setText(node, text){
		node = dom.byId(node);
		node.innerHTML = text;
	}

	var one = dom.byId("one");
	setText(one, "One has been set");
	setText("two", "Two has been set as well");

});
```

[View Demo](demo/byid.html)

The `setText` function sets the text of a node, but since it passes the `node` argument to `dom.byId` it will take either a node ID as a string or a DOM node.

### Creation

Another thing you will be doing often is creating elements. Dojo doesn't prevent you from using the native `document.createElement` method to create elements, but creating the element and setting all the necessary attributes and properties on it can be verbose.
Furthermore, there are enough cross-browser quirks to attribute setting to make `dojo/dom-construct`'s `create` method a more convenient and reliable option.

The arguments to `domConstruct.create` are as follows: node name as a string, properties of the node as an object, an optional parent or sibling node, and an optional position in reference to the parent or sibling node (which defaults to "last").
It returns the new DOM element node. Let's take a look at an example:

```js
require(["dojo/dom", "dojo/dom-construct", "dojo/domReady!"],
	function(dom, domConstruct) {

		var list = dom.byId("list"),
			three = dom.byId("three");

		domConstruct.create("li", {
			innerHTML: "Six"
		}, list);

		domConstruct.create("li", {
			innerHTML: "Seven",
			className: "seven",
			style: {
				fontWeight: "bold"
			}
		}, list);

		domConstruct.create("li", {
			innerHTML: "Three and a half"
		}, three, "after");
});
```

[View Demo](demo/create.html)

A simple list item is created with the content of "Six" and appended to the list. Next, another list item is created with the content of "Seven", its `className` property is set to "seven", it's styled so it has a bold font, and then appended to the list. Finally, a list item is created with the contents "Three and a half" and is inserted after the list item with the ID "three".

When would you create elements explicitly like this, versus setting a container element's `innerHTML` property? If you already have your content as a string of HTML, setting the `innerHTML` property will always be faster. However, `domConstruct.create` comes into its own when you want to create elements but not immediately place them in the DOM, or when you want to insert or append a new element without disturbing the sibling nodes around it.

### Placement

If you already have a node and want to place that node, you will need to use `domConstruct.place`. The arguments are as follows: a DOM node or string ID of a node to place, a DOM node or string ID of a node to use as a reference, and an optional position as a string which defaults to "last" if not provided. This is very similar to what we saw in `domConstruct.create` and, in fact, `domConstruct.create` uses `domConstruct.place` under the hood. For our example, we have added a few buttons to the page:

```html
<button id="moveFirst">The first item</button>
<button id="moveBeforeTwo">Before Two</button>
<button id="moveAfterFour">After Four</button>
<button id="moveLast">The last item</button>
```

The example defines functions which move the third node around the list using `domConstruct.place`:

```js
require(["dojo/dom", "dojo/dom-construct", "dojo/on", "dojo/domReady!"],
	function(dom, domConstruct, on){

		function moveFirst(){
			var list = dom.byId("list"),
				three = dom.byId("three");

			domConstruct.place(three, list, "first");
		}

		function moveBeforeTwo(){
			var two = dom.byId("two"),
				three = dom.byId("three");

			domConstruct.place(three, two, "before");
		}

		function moveAfterFour(){
			var four = dom.byId("four"),
				three = dom.byId("three");

			domConstruct.place(three, four, "after");
		}

		function moveLast(){
			var list = dom.byId("list"),
				three = dom.byId("three");

			domConstruct.place(three, list);
		}

		// Connect the buttons
		on(dom.byId("moveFirst"), "click", moveFirst);
		on(dom.byId("moveBeforeTwo"), "click", moveBeforeTwo);
		on(dom.byId("moveAfterFour"), "click", moveAfterFour);
		on(dom.byId("moveLast"), "click", moveLast);
});
```

[View Demo](demo/place.html)

The possible values for the placement argument are "before", "after", "replace", "only", "first", and "last". Please see the [reference guide for domConstruct.place](/reference-guide/1.10/dojo/dom-construct.html#dojo-dom-construct-place) for more details as to what each placement option does, though the names are decently intuitive.

In the simple case, domConstruct.place does little more than the native `parentNode.appendChild(node)` might do. Its value is in being able to easily specify position, whether it is in reference to a parent or sibling node - with one consistent API.

### Destruction

Most often you'll be creating nodes, but occasionally, you'll want to remove nodes as well. There are two ways to do this in Dojo: `domConstruct.destroy` which will destroy a node and all of its children, while `domConstruct.empty` will only destroy the children of a given node. Both take a DOM node or a string ID of a node as their only argument. We're going to add two more buttons to our page:

```html
<button id="destroyFirst">Destroy the first list item</button>
<button id="destroyAll">Destroy all list items</button>
```

```js
function destroyFirst(){
	var list = dom.byId("list"),
		items = list.getElementsByTagName("li");

	if(items.length){
		domConstruct.destroy(items[0]);
	}
}
function destroyAll(){
	domConstruct.empty("list");
}

// Connect buttons to destroy elements
on(dom.byId("destroyFirst"), "click", destroyFirst);
on(dom.byId("destroyAll"), "click", destroyAll);
```

[View Demo](demo/destroy.html)

The first button will destroy the first item in the list on each click. The second empties the list entirely.

### Conclusion

So far, we have a pretty comprehensive set of tools that we can use to do simple DOM manipulation, from creating nodes, to moving them about, to getting rid of them -- but they all work on only one node at a time. What if the nodes you want to work with don't have IDs? The next tutorial will cover `dojo/query`, which allows us to search for and work with nodes based on CSS selectors!