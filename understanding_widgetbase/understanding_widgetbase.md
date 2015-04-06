---
Category:  Widgets
...

## Understanding _WidgetBase

In this tutorial, you'll learn what Dijit's `_WidgetBase` module is, and how it serves as the foundation for all widgets in the Dojo Toolkit.

### Getting Started

The foundation of Dijit, and the ability to create your own widgets, relies primarily on one base class, defined in the `dijit/_WidgetBase` module.
While there are a few other key pieces commonly relied upon for developing web applications with the Dojo Toolkit (such as the [Dojo parser](/reference-guide/1.10/dojo/parser.html) and the [Dijit templating system](/reference-guide/1.10/dijit/_TemplatedMixin.html)), this module is the key to creating any kind of custom widget using the Dojo Toolkit.
In this tutorial, you'll learn how Dijit's widget infrastructure works.

<!-- protip -->
> If you are coming from a previous version of Dojo, you may be familiar with the `dijit/_Widget` module.
While `dijit/_Widget` still exists and inherits from `dijit/_WidgetBase`,
it is currently recommended to inherit from `dijit/_WidgetBase` directly when defining your own custom widgets from the ground up.
`dijit/_Widget` is likely to be phased out by Dojo 2.0.

The most important thing to understand about Dijit's system is the lifecycle of a widget.  This lifecycle is primarily concerned with the inception of a widget&mdash;in other
words, from when a widget is conceived to when it is fully usable by your application&mdash;through the destruction of a widget and its associated DOM elements.

<!-- protip -->
> If you are wondering why "_" is in front of both "Widget" and "WidgetBase", it is because neither module is intended to be instantiated directly; instead, they are intended
to be used as base classes using the Dojo Toolkit's `declare` mechanism.

To accomplish this, `dijit/_WidgetBase` defines two concept lines: a set of methods that are called in succession during the process of creation, and a way of getting/setting fields
with minimal data binding while the widget lives in the application.  Let us take a look at the first mechanism: Dijit's widget lifecycle.

### The Dijit Lifecycle

Each widget declared with `_WidgetBase` as its base will run through several methods during instantiation.
They are listed here, organized according to the sequence in which they are called:

*   `constructor` (common to all prototypes, called when instantiated)
*   `postscript` (common to all prototypes built using `declare`)
	*   `create`
		* `postMixInProperties`
		* `buildRendering`
		* `postCreate`
*   `startup`

[View Demo](demo/lifecycle.html)

These methods exist to handle a number of things:

*   initialize widget data from both default and run-time values
*   generate the DOM structure for the widget's visual representation
*   place the widget's DOM structure within the page
*   handle logic that is dependent on the DOM structure being present in the document (such as DOM element dimensions)

#### postCreate()

By far, the most important method to keep in mind when creating your own widgets is the `postCreate` method.
This is fired after all properties of a widget are
defined, and the document fragment representing the widget is created&mdash;but **before** the fragment itself is added to the main document.
The reason why this method is so important is because it is the main place where you, the developer, get a chance to perform any last-minute
modifications before the widget is presented to the user, including setting any kind of custom attributes, and so on.
When developing a custom widget, most (if not all) of your customization will occur here.

#### startup()

Probably the second-most important method in the Dijit lifecycle is the `startup` method.  This method is designed to handle processing _after_ any DOM fragments
have been actually added to the document; it is not fired until after any potential child widgets have been created and started as well.  This is especially useful for
composite widgets and layout widgets.

<!-- protip -->
> When instantiating a widget programmatically, **always** call the widget's `startup()` method after placing it in the document.
It's a common error to create widgets programmatically and then forget to call `startup`, leaving you scratching your head as to why your widget isn't showing up properly.

#### Tear-down methods

In addition to the instantiation methods, `dijit/_WidgetBase` also defines a number of destruction methods (again listed in the order they are called):

*   `destroyRecursive`
	*   `destroyDescendants`
	*   `destroy`
		*   `uninitialize`
		*   `destroyRendering`

When writing your own widget, any necessary custom tear-down behavior should be defined in the **destroy** method.  (Don't forget to call `this.inherited(arguments)`!)
Dijit itself takes care of node and most object management for you already (using the aforementioned destruction methods),
so you generally don't have to worry about writing custom versions of these methods from scratch.

<!-- protip -->
> Although `destroy` is arguably the central destruction method of any widget, it is advisable to call `destroyRecursive` when explicitly destroying a widget.
This ensures the destruction of not only the widget itself, but any child widgets.

### Node references

A widget is generally some sort of user interface, and it would not be complete without some sort of DOM representation.  `_WidgetBase` defines
a standard property called `domNode`, which is a reference to the overall parent node of the widget itself.  You can always get a reference
to this node programmatically if you need to do something (like move the entire widget around in a document), and it is available by the time the `postCreate`
method is called.

In addition to the `domNode` property, some widgets also define a `containerNode` property.  This is a reference
to a child node in a widget that may contain content or widgets defined _outside_ of your widget definition,
such as within the originating source node of a declaratively-instantiated widget.

<!-- protip -->
> We'll discuss the importance of the `containerNode` property in another tutorial;
for now, be aware that the property exists and may be defined (most notably, it is
defined on all widgets which inherit `dijit/_Container`).

### Getters and Setters

In addition to the startup and tear-down infrastructure, `_WidgetBase` also provides not only a number of pre-defined properties that all widgets need,
but also a way of letting you define custom getters and setters that will work with the standard `get` and `set` methods, pre-defined on all widgets.
This is accomplished by defining custom "private" methods in your code according to the following pattern:

```js
// for the field "foo" in your widget:

// custom getter
_getFooAttr: function(){ /* do something and return a value */ },

// 	custom setter
_setFooAttr: function(value){ /* do something to set a value */ }
```

If you define custom method pairs in this manner, you can then use the standard `get` and `set` methods of `_WidgetBase` on instances of your widget.
For instance, given the above example, you could do this:

```js
// assume that the widget instance is "myWidget":

// get the value of "foo":
var value = myWidget.get("foo");

// set the value of "foo":
myWidget.set("foo", someValue);
```

This standard allows other widgets and controlling code to interact with a widget in a consistent way, while giving you the ability to perform custom logic
when a field is accessed (such as modifications to a DOM fragment, etc.), as well as allowing you to fire off any other methods (such as an event handler or
a notification).  For example, say your widget has a custom `value`, and you want to be able to notify anyone that that value has changed (possibly
via an `onChange` method you've defined):

```js
// assume our field is called "value":

_setValueAttr: function(value){
	this.onChange(this.value, value);
	this._set("value", value);
},

// a function designed to work with dojo/on
onChange: function(oldValue, newValue){ }
```

As you can see, this gives us a convenient way to be able to customize getter and setter behavior within our own widgets.

<!-- protip -->
> When defining your own widgets, you should create custom getter and setter methods whenever you need to define custom logic behind the retrieval or modification of a custom property.
When _using_ your own widgets, you should **always** use the `get()` and `set()` methods for field access,
in order to properly communicate with the custom getters and setters.
In addition, when defining custom setter methods, you should always use the internal `_set` method to update internal values,
in order to interface properly with the `watch` functionality from `dojo/Stateful`, which all widgets inherit.

### Owning handles

The `_WidgetBase` infrastructure provides a method for registering handles as "owned" by
the widget.
This should be used for any handles created by the widget, often listeners to DOMNode events setup in postCreate().

The method for attaching handles to a widget is `.own()`, and its usage is simple:

```js
this.own(
    on(someDomNode, "click", lang.hitch(this, "myOnClickHandler)"),
    aspect.after(someObject, "someFunc", lang.hitch(this, "mySomeFuncHandler)"),
    topic.subscribe("/some/topic", function(){ ... }),
    ...
);
```

The advantage of using `own()` in the widget infrastructure is that internally, the widget
can keep track of all of its handles, and make sure everything is disconnected and/or unsubscribed when the widget
is destroyed&mdash;preventing any kind of memory leaks.

### Pre-defined Properties and Events

Finally, `_WidgetBase` provides a set of pre-defined properties,
with appropriate getters and setters where applicable:

*   **`id`:** a unique string identifying the widget
*   **`lang`:** a rarely-used string that can override the default Dojo locale
*   **`dir`:** useful for bi-directional support
*   **`class`:** the HTML `class` attribute for the widget's `domNode`
*   **`style`:** the HTML `style` attribute for the widget's `domNode`
*   **`title`:** most commonly, the HTML `title` attribute for native tooltips
*   **`baseClass`:** the root CSS class of the widget
*   **`srcNodeRef`:** the original DOM node that existed before it was "widgetified", if one was provided.
	Note that depending on the type of widget (e.g. templated widgets), this may be unset following `postCreate`, as the original node is discarded.

### Conclusion

As you can see, Dijit's `_WidgetBase` infrastructure provides a solid foundation on which to create and use
widgets; all aspects of a widget (lifecycle, DOM node references, getters and setters, pre-defined properties and
events) are covered out of the box.  We've seen how a widget's `postCreate()` method is the most important
lifecycle method when developing custom widgets, and how vital calling `startup()` is when instantiating
widgets programmatically.  We've also covered Dijit's getter/setter infrastructure, as well as the importance of a widget's `domNode` property.

### Resources

*   [Creating a custom widget](../recipes/custom_widget/)
*   [dijit/_WidgetBase on the Dojo Reference Guide](/reference-guide/1.10/dijit/_WidgetBase.html)