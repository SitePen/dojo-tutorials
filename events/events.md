---
Category:  DOM Basics
...

## Events with Dojo

In this tutorial, we will be exploring `dojo/on` and how Dojo makes it easy to connect to DOM events.  We will also explore Dojo's publish/subscribe framework: `dojo/topic`.

### Getting Started

Much of your JavaScript code will be preparing for events: both responding to and generating new events. This means that the key to building responsive, interactive web applications is creating effective event connections. Event connections allow your application to respond to user interaction and wait for actions to happen. Dojo's main DOM event workhorse is `dojo/on`;  let me show you how to use this module!

### DOM Events

You might be asking yourself, “Doesn’t the DOM already provide a mechanism for registering event handlers?” The answer is yes—but not all browsers follow the W3C DOM specification. Between the various DOM implementations from major browser vendors there are three ways to register event handlers: `addEventListener`, `attachEvent`, and DOM 0. Beyond that, there are two different event object implementations and at least one browser engine that [fires registered listeners in random order](http://msdn.microsoft.com/en-us/library/ms536343(v=vs.85).aspx) and [leaks memory](http://msdn.microsoft.com/en-us/library/bb250448(VS.85).aspx). Dojo improves the way you work with DOM events by normalizing differences between the various native APIs, preventing memory leaks, and doing it all in a single, straightforward event API called `dojo/on`.

Let’s say we have the following markup:

```html
<button id="myButton">Click me!</button>
<div id="myDiv">Hover over me!</div>
```

Let's also imagine that you want the `div` to change to blue when you click the button, red when you hover over it, and back to white when you're done hovering. `dojo/on` makes that very simple:

```js
require(["dojo/on", "dojo/dom", "dojo/dom-style", "dojo/mouse", "dojo/domReady!"],
	function(on, dom, domStyle, mouse) {
		var myButton = dom.byId("myButton"),
			myDiv = dom.byId("myDiv");

		on(myButton, "click", function(evt){
			domStyle.set(myDiv, "backgroundColor", "blue");
		});
		on(myDiv, mouse.enter, function(evt){
			domStyle.set(myDiv, "backgroundColor", "red");
		});
		on(myDiv, mouse.leave, function(evt){
			domStyle.set(myDiv, "backgroundColor", "");
		});
});
```

<!-- protip -->
> Notice that the `dojo/mouse` resource was also required. Not all browsers natively support `mouseenter` and `mouseleave` events, so `dojo/mouse` adds that support. You can write your own modules like `dojo/mouse` to enable support for other custom event types.

This example illustrates the common pattern:
`on(`_element_`, `_event name_`, `_handler_`)`.
Or, put another way, for this event on this element, connect this handler. This pattern applies to all window, document, node, form, mouse, and keyboard events.

<!-- protip -->
> Note that unlike the older `dojo.connect` API, the "on" event name prefix _must be omitted_ when using the `dojo/on` module.

The `on` method not only normalizes the API to register events, but it also normalizes how event handlers work:

*   Event handlers are always called in the order they are registered.
*   They are always called with an event object as their first parameter.
*   The event object will always be normalized to include common W3C event object properties, including things like a `target` property, a `stopPropagation` method, and a `preventDefault` method.

Much like the DOM API, Dojo also provides a way to remove an event handler: `_handle_.remove`. The return value of `on` is a simple object with a `remove` method, which will remove the event listener when called. For example, if you wanted to have a one-time only event, you could do something like this:

```js
var handle = on(myButton, "click", function(evt){
	// Remove this event using the handle
	handle.remove();

	// Do other stuff here that you only want to happen one time
	alert("This alert will only happen one time.");
});
```

<!-- protip -->
> Incidentally, `dojo/on` includes a convenience method for doing exactly this: `on.once`.  It accepts the same parameters as `on`, but will automatically remove the handler once it is fired.

One last thing to note: by default, `on` will run event handlers in the context of the node passed in the first argument.  The one exception to this is when `on` is used for event delegation, which we will discuss shortly.

However, you can use `lang.hitch` (from the `dojo/_base/lang` module)
to specify the context in which to run the handler.
Hitching is very helpful when working with object methods:

```js
require(["dojo/on", "dojo/dom", "dojo/_base/lang", "dojo/domReady!"],
	function(on, dom, lang) {

		var myScopedButton1 = dom.byId("myScopedButton1"),
			myScopedButton2 = dom.byId("myScopedButton2"),
			myObject = {
				id: "myObject",
				onClick: function(evt){
					alert("The scope of this handler is " + this.id);
				}
			};

		// This will alert "myScopedButton1"
		on(myScopedButton1, "click", myObject.onClick);
		// This will alert "myObject" rather than "myScopedButton2"
		on(myScopedButton2, "click", lang.hitch(myObject, "onClick"));

});
```
[View Demo](demo/on.html)

<!-- protip -->
> Unlike `on`'s predecessor, `dojo.connect`, `on` does not accept the handler scope and method arguments.  You will need to make use of `lang.hitch` for the third argument if you wish to preserve execution context.

### NodeList events

As mentioned in the previous tutorial, `NodeList` provides a way to register events to multiple nodes: the `on` method. This method follows the same pattern as `dojo/on` without the first argument (since the nodes in the `NodeList` are the objects you are connecting to).

<!-- protip -->
> The `on` method is included with `dojo/query`, so you do not have to require the `dojo/on` resource explicitly to use `NodeList.on`.

Let's look at a more advanced example than before:

```html
<button id="button1" class="clickMe">Click me</button>
<button id="button2" class="clickMeAlso">Click me also</button>
<button id="button3" class="clickMe">Click me too</button>
<button id="button4" class="clickMeAlso">Please click me</button>
<script>
require(["dojo/query", "dojo/_base/lang", "dojo/domReady!"],
    function(query, lang) {

        var myObject = {
            id: "myObject",
            onClick: function(evt){
                alert("The scope of this handler is " + this.id);
            }
        };
        query(".clickMe").on("click", myObject.onClick);
        query(".clickMeAlso").on("click", lang.hitch(myObject, "onClick"));

});
</script>
```

<!-- protip -->
> Note that unlike `NodeList.connect`, the `NodeList.on` method does _not_ return the NodeList back for further chaining; instead, it returns an array of `on` handles that can be `remove`d later.  The array also includes a convenient top-level `remove` method, which will remove all of the listeners at once.

[View Demo](demo/query.html)

### Event Delegation

As discussed above, the `on` method of `NodeList` makes it easy
to hook up the same handler to the same event of multiple DOM nodes.  `dojo/on` also
makes this achievable through a more efficient means known as _event delegation_.

The idea behind event delegation is that instead of attaching a listener to an event on
each individual node of interest, you attach a single listener to a node at a higher level,
which will check the target of events it catches to see whether they bubbled from an actual
node of interest; if so, the handler's logic will be performed.

Previously, this was (and still is) achievable through the `dojox/NodeList/delegate`
extension to `NodeList`.  In 1.10, it is also possible using the `dojo/on`
module, using the syntax `on(`_parent element_`,
"`_selector_`:`_event name_`", `_handler_`)`.

To better illustrate this, let's look at another example, based on the same premise as the
previous one:

```html
<div id="parentDiv">
    <button id="button1" class="clickMe">Click me</button>
    <button id="button2" class="clickMe">Click me also</button>
    <button id="button3" class="clickMe">Click me too</button>
    <button id="button4" class="clickMe">Please click me</button>
</div>
<script>
require(["dojo/on", "dojo/dom", "dojo/query", "dojo/domReady!"],
    function(on, dom){

        var myObject = {
            id: "myObject",
            onClick: function(evt){
                alert("The scope of this handler is " + this.id);
            }
        };
        var div = dom.byId("parentDiv");
        on(div, ".clickMe:click", myObject.onClick);

});
</script>
```

<!-- protip -->
> Notice that we also required the `dojo/query` module, although we don't use it
directly.  This is because `dojo/on` needs a selector engine exposed by
`dojo/query` in order to be able to match selectors used for event delegation.
This is not pulled in automatically by `dojo/on` in order to reduce its footprint
and avoid "penalizing" developers for a feature that might not always be used.

[View Demo](demo/delegation.html)

When running the above demo, notice how `this` still refers to the
actual node we are interested in, not the `parentDiv` node.
This is an important distinction to note when using `on` for event delegation:
`this` no longer refers to the node passed as the first argument,
but rather to the node which the selector matched.  This can actually be quite useful,
once you know to expect it.

### Object Methods

`dojo/on`'s predecessor, `dojo.connect`, was also responsible for function-to-function event connections.  This functionality has been broken out into its own resource called `dojo/aspect`.  Look forward to seeing a `dojo/aspect` tutorial very soon!

### Publish/Subscribe

All of the examples up until this point have used an existing object as an event producer that you register with to know when something happens. But what do you do if you don't have a handle to a node or don't know if an object has been created? This is where Dojo's publish and subscribe (pub/sub) framework comes in, exposed via the `dojo/topic` module in 1.10. Pub/sub allows you to register a handler for (subscribe to) a "topic" (which is a fancy name for an event that can have multiple sources, represented as a string) which will be called when the topic is published to.

Let's imagine that in an application that we're developing, we want certain buttons to alert the user of an action; we don't want to write the routine to do the alerting more than once, but we also don't want to make a wrapping object that will register this small routine with the button. Pub/sub can be used for this:

```html
<button id="alertButton">Alert the user</button>
<button id="createAlert">Create another alert button</button>

<script>
require(["dojo/on", "dojo/topic", "dojo/dom-construct", "dojo/dom", "dojo/domReady!"],
    function(on, topic, domConstruct, dom) {

        var alertButton = dom.byId("alertButton"),
            createAlert = dom.byId("createAlert");

        on(alertButton, "click", function() {
            // When this button is clicked,
            // publish to the "alertUser" topic
            topic.publish("alertUser", "I am alerting you.");
        });

        on(createAlert, "click", function(evt){
            // Create another button
            var anotherButton = domConstruct.create("button", {
                innerHTML: "Another alert button"
            }, createAlert, "after");

            // When the other button is clicked,
            // publish to the "alertUser" topic
            on(anotherButton, "click", function(evt){
                topic.publish("alertUser", "I am also alerting you.");
            });
        });

        // Register the alerting routine with the "alertUser" topic.
        topic.subscribe("alertUser", function(text){
            alert(text);
        });

});
</script>
```

[View Demo](demo/pubsub.html)

One useful advantage to this pattern of events is that now our alerting routine can be tested in a unit test without the need to create any DOM objects: the routine is decoupled from the event producer.

If you ever wish to stop receiving notifications of a topic, `topic.subscribe` returns an object with a `remove` method that can be used to remove the respective handler (much like `on`).

<!-- protip -->
> Note that unlike `dojo.publish`, `topic.publish` does _not_ expect published arguments to be passed in an array.  For instance, `topic.publish("someTopic", "foo", "bar")` is equivalent to `dojo.publish("someTopic", ["foo", "bar"])`.

### Conclusion

Dojo's event system is quite powerful, while being fairly simple to use. The `on` method normalizes DOM event inconsistencies between browsers. Dojo's pub/sub framework, `dojo/topic`, gives developers a way to easily decouple event handlers from the event producers. Take time to familiarize yourself with these tools &mdash; they will be a valuable asset in creating web applications.