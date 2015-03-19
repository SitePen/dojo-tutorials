## Using Declarative Syntax

One of the quickest ways to start using Dojo, especially with widgets like Dijit, is to leverage the `dojo/parser` and declarative syntax.  This tutorial will help you get the most out of this style of programming.

### Getting Started

There are two main styles of coding when using Dojo.  The first is called _programmatic_ and the second is called _declarative_.  Programmatic refers to using just JavaScript to instantiate your objects and all of your behavior code is expressed in JavaScript.  Declarative refers to using the `dojo/parser` to read the DOM and parse out nodes that have been decorated with special attributes as well as interpreting certain `<script>` tags to extend the behavior of widgets.

Each of these styles have advantages and disadvantages and sometimes you will see developers combining the two.  This tutorial though focuses providing an understanding of all the possible features of the declarative syntax.  If you are considering using the declarative syntax in your project, some things you might consider:

*   The declarative syntax is very easy to use and doesn't require an in-depth knowledge of JavaScript.  It has become quite feature rich and you can almost do everything you can do in JavaScript, but there will always be limitations to what it can do.
*   Because of the nature of how it works, it will always be less performant than just the programmatic style.  This is because the `dojo/parser` has to parse the DOM looking for nodes that it needs to handle.
*   While it is great for prototyping UIs quite quickly, you may find it challenging managing everything in a production application.

This tutorial is specifically written to take full advantage of Dojo 1.10.  Many of the examples in this tutorial will only work with Dojo 1.8+.

### Instantiating Objects

The most common way the declarative syntax is used is to instantiate widgets.  The way this is accomplished is by adding a special attribute to your markup (`data-dojo-type`) and then having the `dojo/parser` read the document and instantiate the widgets.  For example this markup would create a Dijit button:

```html
<button type="button" data-dojo-type="dijit/form/Button">
	<span>Click Me!</span>
</button>
```


In the above snippet, we are supplying the Module ID (MID) that represents the Dojo "type", which will instruct the `dojo/parser` to instantiate a `dijit/form/Button` rooted in the location where this node appears in the DOM.

This is great, but if we need to do something in the future with our button, we need to obtain a reference to the widget.  With Dijit based widgets, when they are instantiated, they will look at the node they are "replacing" and if they see the `id` attribute, they will register themselves in the `dijit/registry` under that ID so we can obtain a reference to them in the future.  So to make this more useful, we should change it to:

```html
<button type="button" id="myButton" data-dojo-type="dijit/form/Button">
	<span>Click Me!</span>
</button>
```


When selecting the tag as a place holder for a Dijit, you should use the native HTML tag that is closest to the widget you are using.  In this case `dijit/form/Button` is a button, so we used the `<button>` tag.  This way your application could degrade better and it avoids some issues in trying to replace the node in certain browsers.  Also, you should follow best practices in HTML, which in this case means you should always assign an attribute of `type` to a button.

Now, what we need to do is invoke the `dojo/parser`.  Before the adoption of AMD in Dojo 1.7 you could safely use a Dojo configuration option of `parseOnLoad: true`.  Now though, there are a few edge cases where you could run into unexpected results if you use that, therefore it is now recommended to invoke the parser directly in your JavaScript code.  So to run the parser, you would want to do something like this:

```html
<script type="text/javascript" src="lib/dojo/dojo.js"
	data-dojo-config="async: true"></script>
<script type="text/javascript">
	require(["dojo/parser", "dijit/form/Button", "dojo/domReady!"],
	function(parser){
		parser.parse();
	});
</script>
```


[View Demo](demo/button.php)

Notice how we required in the `dijit/form/Button` but omitted it from the `require` callback.  That is because we weren't directly referring to it in our codeblock, but we wanted to make sure the module was loaded before we invoked the `dojo/parser`.  While the parser is capable of auto-requiring modules, which we will talk about later, it is best to be explicit about your requirements.

### Configuring Objects

Having the `dojo/parser` instantiate objects is great, but if you can't configure the widget, it would quickly become useless.  Therefore you need a mechanism to pass in some sort of configuration information upon instantiation.

In earlier versions of Dojo, we used to just add attribute after attribute to the tag, even if they weren't valid for the tag.  With the introduction of HTML5, the specification allows the use of custom attributes that are prefaced with `data-` and still allow the document to be strictly valid.  So we have dedicated the `data-dojo-props` attribute to contain any configuration that needs to be passed to the constructor upon instantiation.

So let's say we want to create a TabContainer with a single tab that contains a button.  We might have done this in the programmatic style:

```js
require([
	"dijit/form/Button",
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane",
	"dojo/domReady!"
], function(Button, TabContainer, ContentPane){
	var tc = new TabContainer({
			style: {
				height: "200px",
				width: "400px"
			},
			id: "tc"
		}),
		atab = new ContentPane({
			title: "A Tab",
			closable: false,
			id: "atab"
		}),
		myButton = new Button({
			label: "Click Me!",
			id: "myButton"
		});
	atab.addChild(myButton);
	tc.addChild(atab);
	tc.startup();
});
```


In declarative our markup would look something like this:

```html
<div id="tc" data-dojo-type="dijit/layout/TabContainer"
		data-dojo-props="style: { height: '200px', width: '400px' }">
	<div id="atab" data-dojo-type="dijit/layout/ContentPane"
			data-dojo-props="title: 'A Tab', closable: false">
		<button type="button" id="myButton"
				data-dojo-type="dijit/form/Button">
			<span>Click Me!</span>
		</button>
	</div>
</div>
```


[View Demo](demo/tab.php)

By convention, the value of the `data-dojo-props` attribute is a JavaScript object literal, just without the outer braces (`{}`).</code>

### Non-Widgets

While the `dojo/parser` is generally used to instantiate visual elements in markup (like Dijit widgets) it can also be used to instantiate other non-visual objects.  The `dojo/parser` does assume a constructor though that takes its configuration as the first argument and will always pass the node reference as the second argument.  This works perfectly fine with non-visual objects that are based on `dojo/_base/declare`.

The one "challenge" is that regular objects don't have a registry like Dijit based widgets do, therefore in order to be able to reference them after you instantiate them, you have to create a reference to them in the global scope.  The `dojo/parser` accomplishes this by looking for the `data-dojo-id` attribute.  Whatever value is in there will be set in the global scope.  For example if I wanted to create a memory store, I would do something like this:

```html
<div data-dojo-id="myStore" data-dojo-type="dojo/store/Memory"></div>
```


So for example, let's say we wanted to create a memory store to feed a drop down list.  We could do all of that in markup like this:

```html
<div data-dojo-id="myStore" data-dojo-type="dojo/store/Memory"
	data-dojo-props="data: [
		{ name: 'Alabama', id: 'AL' },
		{ name: 'Alaska', id: 'AK' },
		{ name: 'Arizona', id: 'AZ' },
		{ name: 'California', id: 'CA' },
		{ name: 'Colorado', id: 'CO' },
		{ name: 'Connecticut', id: 'CT' },
		{ name: 'New York', id: 'NY' }
	]"></div>
<select id="mySelect" name="state" value="CA"
	data-dojo-type="dijit/form/FilteringSelect"
	data-dojo-props="searchAttr: 'name', store: myStore"></select>
```


[View Demo](demo/nonwidget.php)

One thing to be aware of, because there is no registry for these non-visual objects, and the reference is used in the global scope, garbage collection will not happen, even when the DOM node that "created" the object is no longer in memory.  This could be perceived as a memory leak in a large application.  You should ensure you remove this variables from the global scope when no longer needed.

### Modifying Behavior

In order to modify the behavior of widgets we usually need to set some code to execute when an event happens.  For example to display a dialog when a button is clicked, we might do something like this in JavaScript:

```js
require(["dijit/form/Button", "dijit/Dialog"], function(Button, Dialog){
	var myButton = new Button({
			label: "Click Me!",
			id: "myButton"
		}, "myButton"),
		someDialog = new Dialog({
			title: "Hello World!",
			content: "<p>I am a dialog. That makes me happy.</p>"
		}, "someDialog");

	myButton.on("click", function(){
		someDialog.show();
	});

	myButton.startup();
	someDialog.startup();
});
```


In order to do this all in markup, we will need to use something called "declarative scripting", which allows the `dojo/parser` to take snippets of inline code and attach them for us as it instantiates the object.  So our example above would look something like this:

```html
<div id="someDialog" data-dojo-type="dijit/Dialog"
		data-dojo-props="title: 'Hello World!'">
	<p>I am a dialog. That makes me happy.</p>
</div>
<button type="button" id="myButton" data-dojo-type="dijit/form/Button">
	<span>Click Me!</span>
	<script type="dojo/on" data-dojo-event="click">
		var registry = require("dijit/registry");
		registry.byId("someDialog").show();
	</script>
</button>
```


[View Demo](demo/scripting.php)

All declarative scripts run in their own scope, so they only have access to the global scope, which is why we had to do the "trick" with the `require("dijit/registry");` in order to get a reference to the module.  There is a way to declaratively add modules to the global scope which we will talk about later.

You can see in the above example that it is quite easy to modify the behavior of widgets by using declarative scripting.  It becomes even more powerful when coupled with widgets that can dynamically load their content, like `dijit/layout/ContentPane`, because they can pass the loaded content through the `dojo/parser` and not only instantiate more widget, but also set the behavior as well.

For example, if I had the following in a file named `content.html`:

```html
<button type="button" id="myButton" data-dojo-type="dijit/form/Button">
	<span>Click Me!</span>
	<script type="dojo/on" data-dojo-event="click">
		console.log("I was clicked!");
	</script>
</button>
```


And I wanted to dynamically load that into a tab, I would do something like this:

```html
<div id="tc" data-dojo-type="dijit/layout/TabContainer"
		data-dojo-props="style: { height: '200px', width: '400px' }">
	<div id="atab" data-dojo-type="dijit/layout/ContentPane"
		data-dojo-props="title: 'A Tab', href: 'content.html'"></div>
</div>
```


[View Demo](demo/href.php)

There are several `<script type="dojo/*">` that are supported by the parser:

<dl>
	<dt>`dojo/on`</dt>
	<dd>Used for setting an event handler.  This is equivalent to calling `object.on()` where the event is supplied in the attribute `data-dojo-event` and any naming of the arguments passed is passed as comma separated list in `data-dojo-args`.  Usually this is just the variable you want to name the normlalized event (e.g. `data-dojo-args="e"`).</dd>
	<dt>`dojo/aspect`</dt>
	<dd>Used for modifying a method handlers.  This is equivalent to using `dojo/aspect` module.  The particular "advice" of the method being dealt with is supplied in the `data-dojo-advice`.  Typically this is `after` but the `dojo/parser` also supports `before` and `around`.  The method is supplied in `data-dojo-event` and any argument variables that you need named that are passed to the method are supplied as a comma delineated list in `data-dojo-args`.</dd>
	<dt>`dojo/watch`</dt>
	<dd>Used to execute a handler that executes when a property changes.  The property is specified in the `data-dojo-prop` attribute and just like the `watch()` on Dijits and objects based off of `dojo/Stateful`, the handler will be passed three arguments that represent the property name, the old value and the new value which can be named in the `data-dojo-args` attribute as a comma delineated list.</dd>
	<dt>`dojo/method`</dt>
	<dd>Used to either execute code on instantiation or to override a method.  If there is no `data-dojo-event` attribute specified, then the code block will be executed once the object has been instantiated.  If a method is specified, then any existing function will be replaced by the code block.</dd>
	<dt>`dojo/connect`</dt>
	<dd>This is now _deprecated_ in lieu of either `dojo/on` or `dojo/aspect`, but it essentially performs the same function in connecting a function to another function.</dd>
</dl>

You can get more information about declarative scripting, including several working examples, by looking at the [Script Tags section](/reference-guide/1.10/dojo/parser.html#script-tags) of the `dojo/parser` Reference Guide page.

### Requiring Modules Declaratively

The great thing about AMD is that you can be very modular, and you only need to load modules when your code actually requires it.  Of course if you want to fully leverage the declarative syntax, you might find it difficult to get access to modules within your declarative script.  Or you might want to just generate your markup and minimize the amount of JavaScript you need to write.  This is where a feature of the `dojo/parser` called declarative require can help.

If for example, when I clicked one button, I wanted to enable and another button and set its handler for the click event, I would have to do it this way declaratively without this feature:

```html
<button type="button" id="button1" disabled="disabled"
		data-dojo-type="dijit/form/Button">
	<span>I'm disabled</span>
</button>
<button type="button" id="button2" data-dojo-type="dijit/form/Button">
	<span>Click Me!</span>
	<script type="dojo/on" data-dojo-event="click">
		require(["dijit/registry"], function(registry){
			var button1 = registry.byId("button1");
			button1.on("click", function(){
				console.log("I was clicked!");
			});
			button1.set("label", "I'm enabled");
			button1.set("disabled", false);
		});
	</script>
</button>
```


If you were sure you had previously required the `dijit/registry`, you could use have used `var registry = require("dijit/registry");` to get a reference to the module.

Of course though, you could use declarative require.  As mentioned before, all declarative scripts execute only in the global scope, so anything required in declarative require is put into the global scope to be available to any declarative scripts.  The syntax of declarative require is essentially a JavaScript object without the outer braces (`{}`).  The property name is the name of the global variable and the value should be a string that contains the module ID (MID).  In order to require in the `dijit/registry` and map it to a global variable named "registry", we would do the following:

```html
<script type="dojo/require">
	registry: "dijit/registry"
</script>
```


[View Demo](demo/require.php)

If you are concerned about namespace clashes with scoping your modules globally, you can put your modules in their own namespace by using the dot notation for the property name: `"myApp.registry": "dijit/registry"`.  The parser will then deep create the objects needed to allow you then to access the registry as `myApp.registry.byId("someId")` in your code.

### Auto-Require

Another feature that was introduced into the `dojo/parser` in Dojo 1.8 was the ability to "auto-require" modules.  This can make it very easy to throw together a page, because you don't have to worry at all about making sure you have your modules required before you invoke the `dojo/parser`.  If the parser encounters a `data-dojo-type` value that looks like a MID (e.g. it has a `/` in it) and that module is not already loaded, the parser will attempt to require that module prior to starting to instantiate the objects in the page.

Again, while this feature can be very handy, it can have some very negative consequences on your application performance if you aren't careful.  For example, you may a built version of Dojo that you are using on your production site and are expecting the builders to have built all the modules you need into a custom layer.  Well, by default, the builder will not scan your files for any declarative dependencies, and therefore any modules that are auto-required by the `dojo/parser` will be unlikely to be in your layer.  This means for every module required, your application will have to make an individual request of the server, potentially causing a perception your code is running slow.

In order to inform you of this, so you can make a conscious decision about using the feature or not, if you set Dojo into debug mode (`isDebug: true`) then the `dojo/parser` will log to a console when a module is auto-required.

To see it in action, the TabContainer example from above has been re-written to auto-require in all the Dijits it needs.  It is also in debug mode as well, so check out your JavaScript console for the warnings.

[View Demo](demo/autorequire.php)

There is a way to have the builder analyze your static HTML files for dependencies and build those into a layer.  This is covered in the builder transform [depsDeclarative](/reference-guide/1.10/build/transforms/depsDeclarative.html) Reference Guide page.

### Conclusion

Hopefully this tutorial has given you some good information on how to take full advantage of all the features of the declarative syntax and the `dojo/parser`.  It can be very flexible and make it quite easy to code up relatively complex applications very quickly.  Personally, I think the power really comes in when you can strategically combine different aspects of the declarative syntax that meet your needs along side a programmatic style.

Here are a few more resources that you might want to take a look at:

*   [`dojo/parser` Reference Guide](/reference-guide/1.10/dojo/parser.html)
*   [Prototyping with dijit/Declaration Tutorial](../declaration)
*   [Builder Transform `depsDeclarative` Reference Guide](/reference-guide/1.10/build/transforms/depsDeclarative.html)
*   <a href="http://demos.dojotoolkit.org/demos/parserAutoRequire/">The Auto-Require Demonstration Application<a/>