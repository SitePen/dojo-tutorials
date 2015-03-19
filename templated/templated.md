## Creating Template-based Widgets

In this tutorial, you'll learn about the importance of Dijit's `_TemplatedMixin` mixin, and how to use templates to quickly create your own custom widgets.

### Getting Started

If you are not already familiar with the basics of creating widgets with Dijit you will want to
first read the [Understanding _WidgetBase tutorial](../understanding_widgetbase/). The
[Creating a custom widget tutorial](../recipes/custom_widget) and [Writing Your Own Widget
guide](/reference-guide/1.10/quickstart/writingWidgets.html) will also help you learn to create widgets.

Dijit's `_WidgetBase` provides a fantastic foundation for creating widgets, but the
	`_TemplatedMixin` mixin is where Dijit really shines.  With `_TemplatedMixin` and
	`_WidgetsInTemplateMixin`, you can quickly create widgets that are highly maintainable, quickly
	modifiable and easy to manipulate.

The basic concept of `_TemplatedMixin` is simple enough: it allows a developer to create a small HTML
	file that has a few small extensions, and loads this HTML file as a string at run-time (or inlined during the
	build process) for re-use by all instances of the templated widget.

Let's walk through what `_TemplatedMixin` defines (and why), and then build a simple widget from scratch
	using its functionality.

Note that `_TemplatedMixin` is intended to be used as a _mixin_, and not directly
	inherited from.  In class-based parlance, that means that is more like an interface than a class (although with
	JavaScript, the difference between the two is muddied).  See the [Dojo Declare Tutorial](../declare/) for
	more information on how classes work in Dojo.

### What `_TemplatedMixin` Provides

For the working developer, mixing `_TemplatedMixin` into a widget definition provides you with the
	following additional properties on your widget:

```js
templateString		//	a string representing the HTML of the template
```

This property is deceptively simple &mdash; after all, how can so much power come from so little?  The
	answer lies in what else `_TemplatedMixin` adds to your widget's definition.

A small note: `templatePath` is also added, but no longer used for template loading. It
	is still there for backwards-compatibility.  We'll show you later on how to use `dojo/text!` to load a
	widget's template.

#### Overridden Methods

In addition to the property above, `_TemplatedMixin` overrides two methods defined in Dijit's widget
	architecture: `buildRendering` and `destroyRendering`.  These two methods handle the parsing
	and filling out of the template (`buildRendering`) and destroying the widget's DOM correctly
	(`destroyRendering`).

Because both methods are critical to the templating process, if you override either of these methods
	in your custom code &mdash; make sure that you include a call to the parent version by adding
	`this.inherited(arguments)` in your overridden method.  See the [
	Understanding _WidgetBase Tutorial](../understanding_widgetbase/) for more information on the widget lifecycle.

#### Using `_TemplatedMixin`

To make your custom widget "templatable", all you need to do is add `dijit/_TemplatedMixin` as the
	second or subsequent argument in the array of class declarations for your widget.  For example, a SomeWidget
	widget might be declared like so:

```js
define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/SomeWidget.html"
], function(declare, _WidgetBase, _TemplatedMixin, template) {

	return declare([_WidgetBase, _TemplatedMixin], {
		templateString: template
	});

});
```

Dijit adheres to a standard of creating a separate directory called `templates` in the folder containing the widget module &mdash; a standard we'd advise you follow in your own code.

Notice that in our bare-bones declaration above, we used the `templateString` property in conjunction
	with a template loaded via `dojo/text!{path}`.  This is the recommended way of setting up references to
	your template files, as it ensures that the files can be loaded asynchronously and properly integrated when
	creating a build of the Dojo Toolkit.

Now that we've set up our widget declaration to be template-based, let's write a template and talk about some of
	the special hooks in them that are available.

### Writing Templates

A template is an HTML document fragment in which you define a DOM structure, along with any special "hooks" to tie
	things back into your widget declaration.  Let's look at a quick example before diving into each of these hooks,
	and how variable substitution takes place in a template.  Here's a hypothetical template for our SomeWidget,
	above:

```js
<div class="${baseClass}">
	<div class="${baseClass}Title" data-dojo-attach-point="titleNode"
			data-dojo-attach-event="onclick:_onClick"></div>
</div>
```

While simple, this template demonstrates three of the most important aspects of the Dijit template system: variable
	substitution, attach points, and event attachments.

Note that when you define a template, it can only have **one** root node definition (
	just like with XML documents). Multiple nodes at the top level is not allowed.

#### Variable Substitution

A template can have values set on DOM rendering though the use of a simple variable placeholder syntax, which looks
	like this:

```js
${property}
```

The variable name is any property or field defined in your widget declaration; the example above used the property
	`baseClass` (available with any widget), but custom fields work just as fine &mdash; for instance, if
	we'd defined a property called `foo` in our SomeWidget, we would simply use `${foo}` in our
	template.  If the property in question happens to be a reference to an object, and you want to use the value of a
	property in that object, you may easily do so via normal object reference notation:

```js
${propertyObject.property}
```

To prevent `_TemplatedMixin` from escaping quotations within a string, place a "!" before the full
	variable name, like so:

```js
	${!property}
```

Variable substitution in a template is only recommended _for values that will not be changed
	during the lifetime of the widget_.  In other words, if you expect to be able to set the value of a property
	in a widget during the lifetime of your application programmatically, we recommend instead using your widget's
	`postCreate` method to set any variables programmatically through your widget's `set()` method.

#### Attach Points

Dijit's template system has a special attribute it will look for in your templates called an
	**attach point** &mdash; implemented using HTML5's data attribute syntax.  An attach point tells the
	template renderer that when a DOM element is created with a `data-dojo-attach-point` attribute defined,
	to set the value of that attribute as a property of your widget to be a reference to the DOM element created.  For
	example, the template for SomeWidget (above) defines two DOM elements.  The main element (the outer
	`div`) can be referenced in your code through the property `domNode`, and the inner
	`div` element can be referenced in your code through the property `titleNode`.

Normally, the root node of your template becomes the `domNode` property of your widget,
	so you wouldn't normally include an attach point attribute in your definition.  However, sometimes this is done in
	the template to allow the root node to also function with other subsystems, such as Dijit's focus manager.

#### The `containerNode` Attach Point

Dijit also defines a "magical" attach point called a _containerNode_. The basic concept of a container node
	is to provide some place for any additional markup to go if a widget is created declaratively.  For example, given
	the template for SomeWidget:

```html
<div class="${baseClass}">
	<div class="${baseClass}Title" data-dojo-attach-point="titleNode"
			data-dojo-attach-event="ondijitclick:_onClick"></div>
	<!-- And our container: -->
	<div class="${baseClass}Container"
			data-dojo-attach-point="containerNode"></div>
</div>
```

<p>We might use it in declarative markup like so:

```html
<div data-dojo-type="demo/SomeWidget"
		data-dojo-props="title: 'Our Some Widget'">
	<p>This is arbitrary content!</p>
	<p>More arbitrary content!</p>
</div>
```

When the Dojo parser traverses the document, it will find our example widget and instantiate it &mdash; and as part
	of that instantiation, _any markup inside the widget will be appended to the containerNode_.  So when the
	widget is finished with its startup, the resulting DOM will look like this:

```html
<div id="demo_SomeWidget_0" class="someWidgetBase">
	<div class="someWidgetTitle">Our Some Widget</div>
	<div class="someWidgetContainer">
		<p>This is arbitrary content!</p>
		<p>More arbitrary content!</p>
	</div>
</div>
```

Note that we removed some of the custom attributes for brevity; Dijit does not remove them
	when rendering templates.

Also be aware that if you embed other widget definitions in the main markup, and your widget has a
	`containerNode` attach point, any widgets will be instantiated inside the container node.  For example,
	the following is a typical scenario when assembling an application:

```html
<div data-dojo-type="demo/SomeWidget">
	<p>This is arbitrary content!</p>
	<div data-dojo-type="dijit/form/Button">My Button</div>
	<p>More arbitrary content!</p>
</div>
```

#### Event Attachments

In addition to attach points, the Dijit template system gives you a way of attaching native DOM events to methods
	in your custom widget.  It does this through the use of the HTML5 data attribute
	`data-dojo-attach-event`. This is a comma-delimited string of key/value pairs (separated by colon); the
	key is the native DOM event to attach a handler to, and the value is the name of your widget's method to execute
	when that event is fired.  If only a single event needs to be handled, omit a trailing comma.  For example, here's
	the `dojo-data-attach-event` attribute defined on Dijit's MenuBarItem:

```html
data-dojo-attach-event="onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick"
```

When your widget is instantiated and the DOM fragment is created from your template, the Dijit template system will
	then go through any attached event definitions and "auto-magically" wire these events (using `dojo/on`)
	from the resulting DOM and your widget object &mdash; making it incredibly simple to wire your visual
	representation to your controlling code.  In  addition, when those event handlers are fired, the same arguments
	normally passed by the native DOM event mechanism will be passed along to your widget's handler so that you have
	full access to what the browser is reporting.

Also, we want to use the `dijit/_OnDijitClickMixin` which adds in a modified event that supports more functionality than the standard DOM `onclick` event.  Therefore we need to modify our widget declaration:

```js
define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_OnDijitClickMixin",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/SomeWidget.html"
], function(declare, _WidgetBase, _OnDijitClickMixin, _TemplatedMixin,
		template) {

	return declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin], {
		templateString: template
		//	any custom code goes here
	});

});
```

We also need to modify our widget template:

```html
<div class="${baseClass}">
	<div class="${baseClass}Title"
		data-dojo-attach-point="titleNode"
		data-dojo-attach-event="ondijitclick:_onClick"></div>
	<div>And our container:</div>
	<div class="${baseClass}Container"
		data-dojo-attach-point="containerNode"></div>
</div>
```

[View Demo](demo/templated-demo.php)

<div class="proTip">
Demo files:

*   [`demo/SomeWidget.js`](demo/SomeWidget.js)
*   [`demo/templates/SomeWidget.html`](demo/templates/SomeWidget.html)
</div>

### The `_WidgetsInTemplateMixin` Mixin

Finally, Dijit's template system allows you to create more complex widgets from templates through the use of the
`_WidgetsInTemplateMixin` mixin.  This mixin tells the template system that your template has other widgets
in it and to instantiate them when your widget is instantiated.

For example, let's modify both our declaration to always include a Dijit button:

```js
define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_OnDijitClickMixin",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/form/Button",
	"dojo/text!./templates/SomeWidget.html"
], function(declare, _WidgetBase, _OnDijitClickMixin, _TemplatedMixin,
			_WidgetsInTemplateMixin, Button, template) {

	return declare("example.SomeWidget", [_WidgetBase, _OnDijitClickMixin,
		_TemplatedMixin, _WidgetsInTemplateMixin
	], {
		templateString: template
		//	your custom code goes here
	});

});
```

And then we would create a template like:

```html
<div class="${baseClass}" data-dojo-attach-point="focusNode"
		data-dojo-attach-event="ondijitclick:_onClick"
		role="menuitem" tabIndex="-1">
	<div data-dojo-type="dijit/form/Button"
		data-dojo-attach-point="buttonWidget">
		My Button
	</div>
	<span data-dojo-attach-point="containerNode"></span>
</div>
```

Notice that in our modified template, we've added an attach point called `buttonWidget` along with the
	button's markup.  This is an additional bonus of Dijit's attach point system; because the definition in question
	is to be a widget, the added property to our widget &mdash; `myWidget.buttonWidget` &mdash; will be a
	reference to the actual button widget, and **not** a reference to a DOM element.  This allows you to
	create "uber-widgets" out of simpler building blocks, such as a widget to view a list of emails, a toolbar that
	has preset widgets in it, and a lot more.

Also, notice that you should require in any widgets into the module that are used by the template.  You cannot take
	advantage of the "auto-require" feature of the `dojo/parser` introduced in Dojo 1.8 with widget
	templates because the creation life-cycle is synchronous but the auto-require feature has to run
	asynchronously.

Unless you have an explicit need to define widgets in your templates, don't mixin
	`dijit/_WidgetsInTemplateMixin`. The extra overhead that it incurs can affect the performance of the
	widget, and your application, if overused.

### Conclusion

In this tutorial, we've learned about Dijit's powerful template system as implemented by the mixins
	`_TemplatedMixin` and `_WidgetsInTemplateMixin`, and how you can use this system to quickly
	create your own custom widgets for use in your applications. We've reviewed how the template system's _attach
	points_ and _event attachments_ allow you to quickly bind DOM elements to your code, and how to replace
	values in your template &mdash; as well as how to include other widgets in your widget template to create
	"uber-widgets".

Happy widget building!