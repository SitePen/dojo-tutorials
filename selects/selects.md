## Getting Selective with Dijit

In this tutorial, we will explore widgets in the `dijit/form` namespace which enhance the user experience of HTML select elements: `Select`, `FilteringSelect`, and `ComboBox`.

### Introduction

Dijit, the Dojo Toolkit's UI framework, contains a comprehensive set of widgets to
help you rapidly develop web applications. As we discussed previously in
[Dijit Themes, Buttons, and TextBoxes](../themes_buttons_textboxes/),
Dijit has many form-based widgets for you to work with, including a wide range
of buttons and textboxes.  As we will see in this tutorial, Dijit also provides
several select-based widgets: `dijit/form/Select`,
`dijit/form/FilteringSelect`, and `dijit/form/ComboBox`.

### Getting Started

Using Dijit solves one of the more vexing problems presented to web application
developers when using HTML select elements&mdash;custom styling.  By using Dijit
theming (as seen in
[previous](../sliders/)
[tutorials](../themes_buttons_textboxes/)),
we can create elements with a uniform look and feel across all supported browsers.
With some simple code examples, we will show you how to replace your
HTML select elements with these elegant, powerful, and easy to use Dijit widgets:

*   **`dijit/form/Select`:**
	A skinnable drop-down select box
	[[ref](/reference-guide/1.10/dijit/form/Select.html)
	| [api](/api/?qs=1.10/dijit/form/Select)]
*   **`dijit/form/FilteringSelect`:**
	A select box with a text field to filter results; the field is marked invalid
	if the text entered does not match a value in the drop-down list
	[[ref](/reference-guide/1.10/dijit/form/FilteringSelect.html)
	| [api](/api/?qs=1.10/dijit/form/FilteringSelect)]
*   **`dijit/form/ComboBox`:**
	A free-form text field that displays suggestions in a drop-down list
	[[ref](/reference-guide/1.10/dijit/form/ComboBox.html)
	| [api](/api/?qs=1.10/dijit/form/ComboBox)]

### dijit/form/Select

`dijit/form/Select` is in many ways similar to HTML's select element,
but Dijit's widget provides useful functionality that can help you customize
the appearance and behavior of this simple drop-down.

Important `dijit/form/Select` properties include:

*   **`displayedValue`:**
	The value presently displayed in the field
*   **`value`:**
	The internal value of the selected option; in the context of a form,
	this is what would be submitted to the server

In the following example, we create a `dijit/form/Select` widget
from standard `select` markup with just a couple of additions:

```html
<body class="claro">
    <select id="stateSelect" data-dojo-type="dijit/form/Select"
        name="stateSelect">
        <option value="" selected="selected">Select a state</option>
        <option value="AL">Alabama</option>
        <option value="AK">Alaska</option>
        <option value="AZ">Arizona</option>
        <option value="AR">Arkansas</option>
        <option value="CA">California</option>
    </select>

    <script>
        require(["dijit/form/Select", "dojo/parser"]);
    </script>
</body>
```

[View Demo](demo/Select.html)

In this simple declarative example, you can see that the only difference between a
standard HTML select and `dijit/form/Select` is indeed a
`data-dojo-type="dijit/form/Select"` attribute in the `select`
tag, and the specification of the input's `name` within `data-dojo-props`.
All other markup is the same, including how to set the selected value.
Using this simple addition to a normal `select` tag and applying the
Claro theme gives you a drop-down that will look great across browsers.

<!-- protip -->
> Don't forget: when creating widgets declaratively, make sure you add
`"parseOnLoad: true"` to the `data-dojo-config` attribute
on the script tag that includes `dojo.js` on the page.
Furthermore, it is necessary to explicitly `require("dojo/parser")` when you
intend to use it.

<!-- protip -->
> Don't forget to include the `class="claro"` attribute in the `body`
tag to apply the claro theme to your page.  In this case, it's important for
it to be in the `body` tag specifically, so that the theme
takes effect not only in the select boxes, but also their associated popup menus.

### dijit/form/FilteringSelect

Like a normal `select`, `dijit/form/FilteringSelect`
allows selection of an option by clicking on the arrow icon and browsing the
list of options.  Additionally, however, it allows a user to type text into an
input field, and will show matching options as he or she types.

Important `dijit/form/FilteringSelect` properties include:

*   **`required`:**
	Whether or not a value must be provided for the field to be considered valid;
	defaults to `true`
*   **`placeHolder`:**
	Text to display in the field when it is blank and unfocused, to indicate
	instruction or purpose
	(this feature is inherited from `dijit/form/TextBox`)
*   **`displayedValue`:**
	The value presently contained in the text field
*   **`value`:**
	The internal value of the selected option; in the context of a form,
	this is what would be submitted to the server

Note that aside from the addition of text input,
`dijit/form/FilteringSelect` essentially behaves like a
`dijit/form/Select`.  To this end, the type-ahead text field is
validated in order to guarantee the integrity of the input.
If the text entered does not ultimately match any option in the list,
the input will be flagged as invalid, and `value` will
report an empty string.

```html
<body class="claro">
    <select id="stateSelect" name="stateSelect" data-dojo-type="dijit/form/FilteringSelect"
        data-dojo-props="
            value: '',
            placeHolder: 'Select a State'">
        <option value="AL">Alabama</option>
        <option value="AK">Alaska</option>
        <option value="AZ">Arizona</option>
        <option value="AR">Arkansas</option>
        <option value="CA">California</option>
    </select>

    <script>
        require(["dijit/form/FilteringSelect", "dojo/parser"]);
    </script>
</body>
```

[View Demo](demo/FilteringSelect.html)

<!-- protip -->
> In combination with `required: true`, you can specify
`value: ""` and placeholder text such as
`placeHolder: "Select an option"` to achieve a common UI
design pattern, executed with style and ease thanks to Dijit and its themes.

### dijit/form/ComboBox

`dijit/form/ComboBox` is a hybrid of a select element and a textbox.
There is often confusion as to the behavior of ComboBox, because it looks like
`dijit/form/FilteringSelect`; the main difference between
the two is that the ComboBox will accept your input even if it does not match
an option in the list.

Important `dijit/form/ComboBox` properties include:

*   **`required`:**
	Whether or not a value must be provided for the field to be considered valid;
	defaults to `false` (note that this default differs from that of
	`dijit/form/FilteringSelect`)
*   **`placeHolder`:**
	Text to display in the field when it is blank and unfocused, to indicate
	instruction or purpose
	(this feature is inherited from `dijit/form/TextBox`)
*   **`value`:**
	The value presently contained in the text field; in the context of a form,
	this is what would be submitted to the server

The behavior of ComboBox's `value` property is a very important
distinction that trips up many developers as well.
Due to its free-form nature, ComboBox only maintains its `value`
based on what is contained in the textbox, and that value is what is sent
upon submission.  Put another way, `dijit/form/ComboBox` has no
`displayedValue` distinction&mdash;its `value` _is_
its "displayed value".

To reinforce this distinction, it may help to think about
`dijit/form/ComboBox` from a different perspective.  While
Select and FilteringSelect are primarily focused on selecting an item from a list,
ComboBox is primarily a text input that also provides a list of suggestions to help
users get started&mdash;much like a feature seen in popular search engines.

```html
<body class="claro">
    <select id="stateSelect" name="stateSelect" data-dojo-type="dijit/form/ComboBox"
        data-dojo-props="
            value: '',
            placeHolder: 'Select a State'">
        <option value="AL">Alabama</option>
        <option value="AK">Alaska</option>
        <option value="AZ">Arizona</option>
        <option value="AR">Arkansas</option>
        <option value="CA">California</option>
    </select>

    <script>
        require(["dijit/form/ComboBox", "dojo/parser"]);
    </script>
</body>
```

[View Demo](demo/ComboBox.html)

<!-- protip -->
> Again, it is very important to remember that `dijit/form/ComboBox`
reports/submits the value contained in its textbox, unlike the previous two
widgets.

### Conclusion

In this tutorial, we've demonstrated that Dijit provides several select widgets
with a consistent look and behavior. These range from
a simple replacement of a normal HTML select element (`dijit/form/Select`)
to more powerful widgets such as `dijit/form/FilteringSelect` and
`dijit/form/ComboBox`, which allow you to type in a value, but differ
in how this value is validated and submitted.

This tutorial focused exclusively on how easy it is to replace standard
HTML select elements with Dijit select widgets using declarative markup.
It is also possible to create these widgets programmatically, in which case
it is common to obtain options from a data store.  We explore this
in detail in the next tutorial:
[Advanced Dijit Selects using Stores](../selects_using_stores/).