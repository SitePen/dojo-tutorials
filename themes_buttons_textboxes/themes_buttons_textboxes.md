---
Category:  Widgets
...

## Dijit Themes, Buttons, and Textboxes

In this tutorial, we will show you the basics of creating and using simple form elements using
Dijit&mdash;including how to set up a Dijit theme for your web application.

### Introduction

Dijit, the Dojo Toolkit's UI framework, contains a comprehensive set of widgets to help you rapidly
develop web applications.  Central to most web applications are _form elements_&mdash;simple
widgets that allow for user input, usually to be transmitted to a server for additional handling.
Dijit has quite a few form-based widgets for you to work with, including
buttons, textboxes, validating textboxes, select-based elements, sliders and more.

In addition, Dijit includes a _theming framework_ that allows a user to
define&mdash;in detail, if needed&mdash;the visual aspects of all Dijits.
This theming is simple to use, and Dijit includes four themes to choose from:
**Claro**, **Tundra**, **Soria**, and **Nihilo**.

### Using a Dijit theme

To use a Dijit theme, two things are needed: a reference to the main theme CSS file, and the setting of a
CSS class on the `body` element of your page, like so:

<!-- highlight: [7, 10] -->
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Hello Dijit!</title>
    <!-- load Dojo -->
    <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dijit/themes/claro/claro.css">
</head>
<!-- set the claro class on our body element -->
<body class="claro">
    <h1 id="greeting">Hello</h1>
</body>
</html>
```

The actual CSS class names for each available theme are `claro`, `tundra`, `soria`
and `nihilo`.  A typical setup for a Dijit-based application is to include this class on the `body`
element, so that all Dijits on a page are consistently styled.

<!-- protip -->
> You _can_ restrict the Dijit theme to only small portions of a page; you do this by applying the CSS
class of the theme to a block-level element, such as a `div`.  However, keep in mind that **any**
popup-based widget (or widgets that use popups, such as `dijit/form/ComboButton`, `dijit/form/DropDownButton`, and `dijit/form/Select`) create and place the DOM
structure for the popup as a direct child of the `body` element&mdash;which means that your theme
will not be applied to the popup.

Now that we have a typical Dijit-based page set up, let's go ahead and start including the form widgets we'd like to use.

### Buttons in Dijit

Probably the most basic widget in any toolkit is a button; this type of user input allows a user to trigger an
action, such as submitting a form or resetting the values on a form.  Dijit's implementation is pretty simple:

<div id="example1">
	<div data-dojo-type="dijit/layout/TabContainer"
		data-dojo-props="doLayout:false, 'class':'code-tabs'">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Declarative'">
	<pre class="brush: js; html-script: true">
	&lt;body class="claro"&gt;
		&lt;button id="btn" data-dojo-type="dijit/form/Button"
			data-dojo-props="
				onClick: function(){ console.log('First button was clicked!'); }"&gt;
			Click Me!
		&lt;/button&gt;
		&lt;script&gt;
			// load requirements for declarative widgets in page content
			require(["dijit/form/Button", "dojo/parser", "dojo/domReady!"]);
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Programmatic'">
	<pre class="brush: js; html-script: true;">
	&lt;body class="claro"&gt;
		&lt;button id="btn"&gt;&lt;/button&gt;
		&lt;script&gt;
			require(["dijit/form/Button", "dojo/domReady!"], function(Button) {
				var button = new Button({
					label: "Click Me!",
					onClick: function(){ console.log("First button was clicked!"); }
				}, "btn");
				button.startup();
			});
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	</div>
</div>

<!-- protip -->
> Don't forget: if you are going to define widgets declaratively, make sure you add
`"parseOnLoad: true"` to the `data-dojo-config` attribute
on the script tag that includes `dojo.js` on the page.
Furthermore, it is necessary to explicitly `require(["dojo/parser"])` when you
intend to use it.

As you can see, creating a `dijit/form/Button`
[[ref](/reference-guide/1.10/dijit/form/Button.html)
| [api](/api/?qs=1.10/dijit/form/Button)]
is pretty simple, and behaves very much like a regular HTML `button`
element. Dijit buttons also support using an image or image sprite in
conjunction with a label&mdash;or even the image alone&mdash;like so:

<div id="example2">
	<div data-dojo-type="dijit/layout/TabContainer"
		data-dojo-props="doLayout:false, 'class':'code-tabs'">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Declarative'">
	<pre class="brush: js; html-script: true">
	&lt;body class="claro"&gt;
		&lt;button id="btn2" data-dojo-type="dijit/form/Button"
			data-dojo-props="
				iconClass: 'dijitIconNewTask',
				showLabel: false,
				onClick: function(){ console.log('Second button was clicked!'); }"&gt;
			Click Me!
		&lt;/button&gt;
		&lt;script&gt;
			// load requirements for declarative widgets in page content
			require(["dojo/parser", "dijit/form/Button", "dojo/domReady!"]);
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Programmatic'">
		<pre class="brush: js; html-script: true;">
	&lt;body class="claro"&gt;
		&lt;div&gt;
			&lt;button id="btn2"&gt;&lt;/button&gt;
		&lt;/div&gt;
		&lt;script&gt;
			require(["dijit/form/Button", "dojo/domReady!"], function(Button) {
				var button2 = new Button({
					iconClass: "dijitIconNewTask",
					showLabel: false,
					label: "Click Me!", // analogous to title when showLabel is false
					onClick: function(){ console.log("Second button was clicked!"); }
				}, "btn2");

				button2.startup();
			});
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	</div>
</div>

[View Declarative Demo](demo/Button.html)

[View Programmatic Demo](demo/ProgButton.html)

Several widget properties are employed in the example above:

*   **`iconClass`:** indicates what CSS class to use
	(to apply an image sprite)
*   **`showLabel`:** determines whether to show any text in the button
*   **`title`:** sets the value of the HTML title attribute on
	the rendered DOM node of the widget
*   **`label`:** in programmatic usage, this indicates the
	content of the button label; declaratively, this is specified via the
	content (`innerHTML`) of the element representing the widget

<!-- protip -->
> When using a `dijit/form/Button` inside a form (or perhaps even a
`dijit/form/Form`), you can add `type:"submit"` or
`type:"reset"` to your button's properties (via
`data-dojo-props` declaratively, or in the object passed to the
constructor programmatically) to achieve the same behavior as a native HTML
button of the same type.

<!-- protip -->
> Even in the simplest usages of `dijit/form/Button`,
it is good practice to specify `type:"button"`&mdash;in its absence,
the button would default its type to `submit`.
While this normally wouldn't be a problem outside of a form,
older versions of IE wrap buttons in a form anyway&mdash;which can
ultimately lead to confusing behavior.

Dijit also includes three other button widgets:

*   **`dijit/form/ToggleButton`:** a button that maintains an on/off state
[[ref](/reference-guide/1.10/dijit/form/ToggleButton.html)
| [api](/api/?qs=1.10/dijit/form/ToggleButton)]
*   **`dijit/form/DropDownButton`:** a button designed to show a
popup widget (such as a menu) when clicked
[[ref](/reference-guide/1.10/dijit/form/DropDownButton.html)
| [api](/api/?qs=1.10/dijit/form/DropDownButton)]
*   **`dijit/form/ComboButton`:** like a
`dijit/form/Button` and a `dijit/form/DropDownButton`
combined&mdash;the primary region can perform an action when clicked, and the
drop-down region can show a popup widget
[[ref](/reference-guide/1.10/dijit/form/ComboButton.html)
| [api](/api/?qs=1.10/dijit/form/ComboButton)]

The following example shows these three widgets in action:

<div id="example3">
	<div data-dojo-type="dijit/layout/TabContainer"
		data-dojo-props="doLayout: false, 'class': 'code-tabs'">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title: 'Declarative'">
	<pre class="brush: js; html-script: true">
	&lt;body class="claro"&gt;
		&lt;button id="toggle" data-dojo-type="dijit/form/ToggleButton"
			data-dojo-props="iconClass: 'dijitCheckBoxIcon', checked: true"&gt;
			Toggle
		&lt;/button&gt;

		&lt;div id="combo" data-dojo-type="dijit/form/ComboButton"
			data-dojo-props="
				optionsTitle: 'Save Options',
				iconClass: 'dijitIconFile',
				onClick: function(){ console.log('Clicked ComboButton'); }"&gt;
			&lt;span&gt;Combo&lt;/span&gt;
			&lt;div id="saveMenu" data-dojo-type="dijit/Menu"&gt;
				&lt;div data-dojo-type="dijit/MenuItem"
					data-dojo-props="
						iconClass: 'dijitEditorIcon dijitEditorIconSave',
						onClick: function(){ console.log('Save'); }"&gt;
					Save
				&lt;/div&gt;
				&lt;div data-dojo-type="dijit/MenuItem"
					data-dojo-props="onClick: function(){ console.log('Save As'); }"&gt;
					Save As
				&lt;/div&gt;
			&lt;/div&gt;
		&lt;/div&gt;

		&lt;div id="dropDown" data-dojo-type="dijit/form/DropDownButton"
			data-dojo-props="iconClass: 'dijitIconApplication'"&gt;
			&lt;span&gt;DropDown&lt;/span&gt;
			&lt;div data-dojo-type="dijit/TooltipDialog"&gt;
				This is a TooltipDialog. You could even put a form in here!
			&lt;/div&gt;
		&lt;/div&gt;

		&lt;script&gt;
			// load requirements for declarative widgets in page content
			require(["dijit/form/ToggleButton", "dijit/form/ComboButton", "dijit/Menu", "dijit/MenuItem", "dijit/form/DropDownButton", "dijit/TooltipDialog", "dojo/parser"]);
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Programmatic'">
		<pre class="brush: js; html-script: true;">
	&lt;body class="claro"&gt;
		&lt;button id="toggle"&gt;&lt;/button&gt;
		&lt;button id="combo"&gt;&lt;/button&gt;
		&lt;button id="dropDown"&gt;&lt;/button&gt;
		&lt;script&gt;
			require(["dijit/form/ToggleButton", "dijit/form/ComboButton", "dijit/Menu", "dijit/MenuItem", "dijit/form/DropDownButton", "dijit/TooltipDialog"], function(ToggleButton, ComboButton, Menu, MenuItem, DropDownButton, TooltipDialog) {

				var toggleButton = new ToggleButton({
					iconClass: "dijitCheckBoxIcon",
					label: "Toggle",
					checked: true
				}, "toggle");
				toggleButton.startup();

				var menu = new Menu({
					id: "saveMenu"
				});
				var menuItem1 = new MenuItem({
					label: "Save",
					iconClass: "dijitEditorIcon dijitEditorIconSave",
					onClick: function() { console.log("Save"); }
				});
				var menuItem2 = new MenuItem({
					label: "Save As",
					onClick: function() { console.log("Save As"); }
				});
				menu.addChild(menuItem1);
				menu.addChild(menuItem2);
				var comboButton = new ComboButton({
					optionsTitle: "Save Options",
					iconClass: "dijitIconFile",
					label: "Combo",
					dropDown: menu,
					onClick:function(){ console.log("Clicked ComboButton"); }
				}, "combo");
				comboButton.startup();
				menu.startup(); // this also starts up its child MenuItems

				var tooltip = new TooltipDialog({
					content: "This is a TooltipDialog. You could even put a form in here!"
				});
				var dropDownButton = new DropDownButton({
					iconClass: "dijitIconApplication",
					label: "DropDown",
					dropDown: tooltip
				}, "dropDown");
				dropDownButton.startup();
				tooltip.startup();

			});
		&lt;/script&gt;
	&lt;/body&gt;
		</pre>
	</div>
	</div>
</div>

[View Declarative Demo](demo/MoreButtons.html)

[View Programmatic Demo](demo/ProgMoreButtons.html)

Notice that `dijit/form/ComboButton` and `dijit/form/DropDownButton` cooperate with popup widgets, such as
`dijit/Menu`, `dijit/TooltipDialog`, and `dijit/ColorPalette`.

### The Dijit TextBox Family

No UI toolkit would be complete without some form of basic user input, and Dijit is no exception.
Within the `dijit/form` namespace, there are a number of
textbox-based widgets, each with a specific purpose:

*   **`dijit/form/TextBox`:** a basic textbox
	[[ref](/reference-guide/1.10/dijit/form/TextBox.html)
	| [api](/api/?qs=1.10/dijit/form/TextBox)]*   **`dijit/form/SimpleTextarea`:** a basic textarea, for large text input
	[[ref](/reference-guide/1.10/dijit/form/SimpleTextarea.html)
	| [api](/api/?qs=1.10/dijit/form/SimpleTextarea)]
*   **`dijit/form/ValidationTextBox`:** a textbox with basic validation abilities,
	which can be further customized
	[[ref](/reference-guide/1.10/dijit/form/ValidationTextBox.html)
	| [api](/api/?qs=1.10/dijit/form/ValidationTextBox)]
*   **`dijit/form/NumberTextBox`:** a textbox that ensures the input is numeric
	[[ref](/reference-guide/1.10/dijit/form/NumberTextBox.html)
	| [api](/api/?qs=1.10/dijit/form/NumberTextBox)]
*   **`dijit/form/DateTextBox`:** a textbox that includes a popup calendar
	[[ref](/reference-guide/1.10/dijit/form/DateTextBox.html)
	| [api](/api/?qs=1.10/dijit/form/DateTextBox)]
*   **`dijit/form/TimeTextBox`:** a textbox that includes a popup time-picker
	[[ref](/reference-guide/1.10/dijit/form/TimeTextBox.html)
	| [api](http://dojotoolkit.org/api/?qs=1.10/dijit/form/TimeTextBox)]
*   **`dijit/form/CurrencyTextBox`:** an extension of
	`dijit/form/NumberTextBox` with additional considerations for localized currency
	[[ref](/reference-guide/1.10/dijit/form/CurrencyTextBox.html)
	| [api](/api/?qs=1.10/dijit/form/CurrencyTextBox)]
*   **`dijit/form/NumberSpinner`:** an extension of
	`dijit/form/NumberTextBox` providing buttons and keybindings for
	incrementally changing the value
	[[ref](/reference-guide/1.10/dijit/form/NumberSpinner.html)
	| [api](/api/?qs=1.10/dijit/form/NumberSpinner)]
*   **`dijit/form/Textarea`:** an extension of
	`dijit/form/SimpleTextarea` which dynamically increases or
	decreases its height based on the amount of content inside
	[[ref](/reference-guide/1.10/dijit/form/Textarea.html)
	| [api](/api/?qs=1.10/dijit/form/Textarea)]

<!-- protip -->
> As we mentioned before, you can apply a theme to just portions of your page&mdash;but
if you plan on using either `dijit/form/DateTextBox` or
`dijit/form/TimeTextBox`, you will need to apply your theme CSS class
to the `body` element of the page.

In the next example, we create instances of `dijit/form/TextBox`
and `dijit/form/SimpleTextarea`. This should feel quite familiar
after creating the buttons above.

<div id="example4">
	<div data-dojo-type="dijit/layout/TabContainer"
		data-dojo-props="doLayout:false, 'class':'code-tabs'">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Declarative'">
	<pre class="brush: js; html-script: true;">
	&lt;body class="claro"&gt;
		&lt;div&gt;
			&lt;label for="text"&gt;Name:&lt;/label&gt;
			&lt;input id="text" data-dojo-type="dijit/form/TextBox"
				data-dojo-props="placeHolder: 'Enter text here.'"&gt;
		&lt;/div&gt;
		&lt;div&gt;
			&lt;label for="textarea"&gt;Description:&lt;/label&gt;
			&lt;textarea id="textarea" rows="5" cols="50"
				data-dojo-type="dijit/form/SimpleTextarea"
				data-dojo-props="
					onFocus: function(){ console.log('textarea focus handler') },
					onBlur: function(){ console.log('textarea blur handler') },
					selectOnClick: true
			"&gt;This is a sample SimpleTextarea.&lt;/textarea&gt;
		&lt;/div&gt;
		&lt;script&gt;
			// load requirements for declarative widgets in page content
			require(["dijit/form/TextBox", "dijit/form/SimpleTextarea", "dojo/parser", "dojo/domReady!"]);
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Programmatic'">
		<pre class="brush: js; html-script: true;">
	&lt;body class="claro"&gt;
		&lt;div&gt;
			&lt;label for="text"&gt;Name:&lt;/label&gt;
			&lt;input id="text"&gt;
		&lt;/div&gt;
		&lt;div&gt;
			&lt;label for="textarea"&gt;Description:&lt;/label&gt;
			&lt;textarea id="textarea"&gt;&lt;/textarea&gt;
		&lt;/div&gt;
		&lt;script&gt;
			require(["dijit/form/TextBox", "dijit/form/SimpleTextarea", "dojo/domReady!"], function(TextBox, SimpleTextarea) {

				var textbox = new TextBox({
					placeHolder: "Enter text here."
				}, "text");
				textbox.startup();

				var textarea = new SimpleTextarea({
					rows: 5,
					cols: 50,
					onFocus: function(){ console.log("textarea focus handler"); },
					onBlur: function(){ console.log("textarea blur handler"); },
					selectOnClick: true,
					value: "This is a sample SimpleTextarea."
				}, "textarea");
				textarea.startup();
			});
		&lt;/script&gt;
	&lt;/body&gt;
		</pre>
	</div>
	</div>
</div>

[View Declarative Demo](demo/TextBox.html)

[View Programmatic Demo](demo/ProgTextBox.html)

The following example demonstrates basic functionality of `dijit/form/NumberTextBox`,
`dijit/form/CurrencyTextBox`, `dijit/form/TimeTextBox`, and `dijit/form/DateTextBox`.

<div id="example5">
	<div data-dojo-type="dijit/layout/TabContainer"
		data-dojo-props="doLayout:false, 'class':'code-tabs'">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Declarative'">
	<pre class="brush: js; html-script: true;">
	&lt;body class="claro"&gt;
		&lt;div&gt;
			&lt;label for="number"&gt;Age:&lt;/label&gt;
			&lt;input id="number" type="text" value="54" required="true" data-dojo-type="dijit/form/NumberTextBox"&gt;
		&lt;/div&gt;
		&lt;div&gt;
			&lt;label for="currency"&gt;Annual Salary:&lt;/label&gt;
				&lt;input id="currency" value="54775.53" required="true"
					data-dojo-type="dijit/form/CurrencyTextBox"
					data-dojo-props="
						constraints: {fractional: true},
						currency: 'USD',
						invalidMessage: 'Invalid amount. Cents are mandatory.'"&gt;
		&lt;/div&gt;
		&lt;div&gt;
			&lt;label for="time"&gt;Start Time:&lt;/label&gt;
			&lt;input id="time" required="true"
				data-dojo-type="dijit/form/TimeTextBox"
				data-dojo-props="
					constraints: {
						timePattern: 'HH:mm:ss',
						clickableIncrement: 'T00:15:00',
						visibleIncrement: 'T00:15:00',
						visibleRange: 'T01:00:00'
					},
					invalidMessage: 'Invalid time.'"&gt;
		&lt;/div&gt;
		&lt;div&gt;
			&lt;label for="date"&gt;Start Date:&lt;/label&gt;
				&lt;input id="date" value="2011-09-15" data-dojo-type="dijit/form/DateTextBox"&gt;
		&lt;/div&gt;
		&lt;script&gt;
			// load requirements for declarative widgets in page content
			require(["dijit/form/NumberTextBox", "dijit/form/CurrencyTextBox", "dijit/form/TimeTextBox", "dijit/form/DateTextBox", "dojo/domReady!", "dojo/parser"]);
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Programmatic'">
		<pre class="brush: js; html-script: true;">
	&lt;body class="claro"&gt;
		&lt;div&gt;
			&lt;label for="number"&gt;Age:&lt;/label&gt;
			&lt;input id="number"&gt;
		&lt;/div&gt;
		&lt;div&gt;
			&lt;label for="currency"&gt;Annual Salary:&lt;/label&gt;
			&lt;input id="currency"&gt;
		&lt;/div&gt;
		&lt;div&gt;
			&lt;label for="time"&gt;Start Time:&lt;/label&gt;
			&lt;input id="time"&gt;
		&lt;/div&gt;
		&lt;div&gt;
			&lt;label for="date"&gt;Start Date:&lt;/label&gt;
			&lt;input id="date"&gt;
		&lt;/div&gt;
		&lt;script&gt;
			require(["dijit/form/NumberTextBox", "dijit/form/CurrencyTextBox", "dijit/form/TimeTextBox", "dijit/form/DateTextBox", "dojo/domReady!"], function(NumberTextBox, CurrencyTextBox, TimeTextBox, DateTextBox) {
				var number = new NumberTextBox({
					value: 54,
					required: true
				}, "number");
				number.startup();

				var currency = new CurrencyTextBox({
					value: 54775.53,
					required: true,
					constraints: {fractional:true},
					currency: "USD",
					invalidMessage: "Invalid amount. Cents are mandatory."
				}, "currency");
				currency.startup();

				var time = new TimeTextBox({
					constraints: {
						timePattern: "HH:mm:ss",
						clickableIncrement: "T00:15:00",
						visibleIncrement: "T00:15:00",
						visibleRange: "T01:00:00"
					},
					invalidMessage:"Invalid time."
				},"time");
				time.startup();

				var date = new DateTextBox({
					value: new Date(2011, 8, 15)
				}, "date");
				date.startup();
			});
		&lt;/script&gt;
	&lt;/body&gt;
		</pre>
	</div>
	</div>
</div>

[View Declarative Demo](demo/MoreBox.html)

[View Programmatic Demo](demo/ProgMoreBox.html)

<!--protip -->
> Again, if you are going to define your widgets declaratively, don't forget to
require `dojo/parser`, and add "parseOnLoad: true" to the
`data-dojo-config` attribute on the script tag for
`dojo.js`.

### Conclusion

In this tutorial, we've shown you how Dijit gives you many variations on
two basic input elements for any kind of user interface: buttons and textboxes.
In addition, we've shown you the basics of including a CSS-based theme
so that your user interface is both beautiful and functional.

In addition to the API and Reference Guide documentation, there are test pages
within the Dojo Toolkit SDK distribution which test various configurations of
widgets.  Tests for button and textbox widgets can be found
[online](http://download.dojotoolkit.org/release-1.10.3/dojo-release-1.10.3/dijit/tests/form/),
or in the `dijit/tests/form` folder of your local copy.

<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dijit/themes/claro/claro.css" />
<script src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js" data-dojo-config="isDebug: true, async: true"></script>
<script>
	require(['dojo/parser',
		'dojo/dom-style',
		'dijit/layout/TabContainer',
		'dijit/layout/ContentPane',
		'dojo/domReady!'
	], function(parser, domStyle) {
		for(var i = 1; i < 6; i++) {
			var name = 'example' + i;
			parser.parse(name);
		}
	});
</script>