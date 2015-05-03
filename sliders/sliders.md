---
Category:  Widgets
...

## Sliders with Dijit

The HTML5 specification provides many new features, such as the `<input type="range">` element which allows users to choose from a range of values.  Unfortunately, this new input type is not supported in all browsers, and looks different in each browser that does support it.  That's where Dijit's `HorizontalSlider` and `VerticalSlider` widgets come in: flexible, themeable, and functional.

### Getting Started

There are many benefits to using sliders within user interfaces.
Benefits to using Dijit's slider solutions include:

*   Both horizontal and vertical sliders are provided
*   Sliders may be easily themed to match the rest of an application
*   Sliders display and work uniformly in each browser
*   The same convenient properties, methods, and events you've come to expect from Dijit widgets are provided

The Dojo Toolkit's slider widgets live within Dojo's user interface library, Dijit.
As with using any Dijit resource, it's important to include the CSS of the theme you want to use:

```html
<head>
    <!-- load the "claro" theme -->
    <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.10.4/dijit/themes/claro/claro.css">
</head>
<!-- add the "claro" CSS class to the body -->
<body class="claro">

    <!-- load dojo and provide config via data attribute -->
    <script src="//ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js"
        data-dojo-config="async: true, parseOnLoad: true">
    </script>
</body>
```

<!-- protip -->
> It is also important to remember to `require` the modules you
will be using. This will be demonstrated in later examples as we explore
the various features that Dijit's slider widgets have to offer.

Important `dijit/form/HorizontalSlider` and
`dijit/form/VerticalSlider` initialization properties include:

*   **`clickSelect`:** Whether or not simply clicking the
	slider bar should change the value
*   **`disabled`:** Whether or not the slider should be active
*   **`discreteValues`:** The number of possible discrete slider values
	(e.g. if your `minimum` is 0, your `maximum` is 10,
	and your `discreteValues` is 3, the slider will stop at the values 0, 5, and 10)
*   **`intermediateChanges`:** Whether or not
	`onChange` should fire during each step of the slide
	(by default, the onChange event fires only when the slider has settled at its final position)
*   **`maximum`:** The maximum slider value
*   **`minimum`:** The minimum slider value
*   **`name`:** The name used for the `<input>` when submitting the form
	(so its value may be accessed)
*   **`pageIncrement`:** If `discreteValues` is also specified,
	this indicates the number of increments that the slider handle
	is moved via the page up/page down keys. If `discreteValues`
	is not specified, it indicates the number of pixels that the slider handle
	is moved via page up/page down.
*   **`showButtons`:** Whether or not increment and decrement
	buttons should be displayed with the slider
*   **`value`:** The slider's current value

Important `dijit/form/HorizontalSlider` and `dijit/form/VerticalSlider` methods include:

*   **`decrement`:** Decrements the slider's value
*   **`increment`:** Increments the slider's value
*   **`get`:** Returns the slider's value
*   **`set`:** Sets the slider's value

Important `dijit/form/HorizontalSlider` and
`dijit/form/VerticalSlider` events include:

*   **`onChange`:** Fires when the slider reaches its
	destination value, or at each step of the change if
	`intermediateChanges` is `true`

### Creating Sliders

[![Horizontal Slider Dijit](images/horizontal-basic.png)](demos/simple.html)

A basic horizontal slider.

Sliders may be created programmatically or declaratively.
A declaratively-created horizontal slider would look like this:

```html
<body class="claro">
    <input id="hslider" value="3" type="range"
        data-dojo-type="dijit/form/HorizontalSlider"
        data-dojo-props="
            minimum: 0,
            maximum: 10,
            discreteValues: 11">

    <script>
            // Require parser since we are performing declarative instantiation
            // Also require the slider class
            require(["dijit/form/HorizontalSlider", "dojo/parser"]);
    </script>
</body>
```

The example above creates a horizontal slider with values from 0 to 10,
starting with a value of 3, with increment and decrement buttons, which will
add or subtract 1 from the slider's value when clicked.

<!-- protip -->
> Note that we defined `discreteValues` as `11` in order
to achieve increments of 1 in this example&mdash;this is because there are
really 11 whole numbers within the range 0 to 10, _including zero_.

<a href="demos/simple.html" class="button">View Demo</a>

Programmatic creation of a vertical slider would look like this:

```html
<body class="claro">
    <div id="vertSlider"></div>

    <script>
        // Require the slider class
        require(["dijit/form/VerticalSlider"], function(VerticalSlider) {
            // Create the vertical slider programmatically
            var vertSlider = new VerticalSlider({
                minimum: 0,
                maximum: 100,
                pageIncrement: 20,
                value: 20,
                intermediateChanges: true,
                style: "height: 200px;"
            }, "vertSlider");

            // Start up the widget
            vertSlider.startup();
        });
    </script>
</body>
```

The vertical slider above ranges from 0 to 100, has an initial value of 20,
operates at per-pixel increments since `discreteValues` is not set,
and fires an onChange event during each step of the slider's movement.

<a href="demos/simple.html" class="button">View Demo</a>

### Adding Rules and Rule Labels

Horizontal and Vertical sliders function well, but often a developer will want to add tick marks and labels to clearly indicate values at given locations along the slider.  That's where Dijit's `dijit/form/HorizontalRule`, `dijit/form/HorizontalRuleLabels`, `dijit/form/VerticalRule`, and `dijit/form/VerticalRuleLabels` come in.

[![Horizontal Slider Dijit](images/horizontal.png)](demos/rules.html)

A horizontal slider with two rules and labels.

Important `dijit/form/HorizontalRule` and `dijit/form/VerticalRule`
initialization properties include:

*   **`container`:** Can be "topDecoration" or
	"bottomDecoration" for HorizontalRule, or "leftDecoration" or "rightDecoration" for
	VerticalRule, indicating where this rule appears relative to the slider
*   **`count`:** Number of hashmarks to display
*   **`ruleStyle`:** CSS styles to be applied to each mark

Important `dijit/form/HorizontalRuleLabels` and `dijit/form/VerticalRuleLabels`
initialization properties include:

*   **`container`:** Can be "topDecoration" or
	"bottomDecoration" for HorizontalRuleLabels, or "leftDecoration" or
	"rightDecoration" for VerticalRuleLabels, indicating where the labels
	appear relative to the slider
*   **`labelStyle`:** CSS styles to be applied to each label
*   **`labels`:** Optional array (or, declaratively,
	a list of `<li>`s) of labels to place along the slider

When the `labels` property is _not_ specified,
the following properties also apply to rule labels:

*   **`count`:** Number of labels to display
*   **`maximum`:** Highest value to be displayed in the set of labels
*   **`minimum`:** Lowest value to be displayed in the set of labels
*   **`numericMargin`:** Number of labels that should be
	suppressed at each end of the slider. Note that this applies on top of
	`count`, `minimum`, and `maximum`;
	for example, `count: 6` and `numericMargin: 1`
	would result in 4 labels, with the lowest and highest labels hidden.
*   **`constraints`:** Allows customization of the
	format of auto-generated numeric labels. This behaves like the options
	object to `dojo/number/format`.

Let's go back to our HorizontalSlider example and add some rules and labels above and below
the slider.  The code would end up looking something like this:

```html
<body class="claro">
    <!-- create rules and labels above horizontal slider -->
    <ol data-dojo-type="dijit/form/HorizontalRuleLabels"
        data-dojo-props="
            container: 'topDecoration',
            count: 11,
            numericMargin: 1"
        style="height: 1.2em; font-weight: bold">
    </ol>
    <div data-dojo-type="dijit/form/HorizontalRule"
        data-dojo-props="
            container: 'topDecoration',
            count: 11"
        style="height: 5px; margin: 0 12px;"></div>

    <!-- declaratively create a slider without buttons, values from 0-10 -->
    <input id="hslider" type="range" value="3"
        data-dojo-type="dijit/form/HorizontalSlider"
        data-dojo-props="
            minimum: 0,
            maximum: 10,
            showButtons: false,
            discreteValues: 11">

    <!-- create rules and labels below horizontal slider -->
    <div data-dojo-type="dijit/form/HorizontalRule"
        data-dojo-props="
            container: 'bottomDecoration',
            count: 5"
            style="height: 5px; margin: 0 12px;"></div>
    <ol data-dojo-type="dijit/form/HorizontalRuleLabels"
        data-dojo-props="
            container: 'bottomDecoration'"
        style="height: 1em; font-weight: bold;">
        <li>lowest</li>
        <li>normal</li>
        <li>highest</li>
    </ol>

    <script>
        // Require parser since we are performing declarative instantiation
        require(["dijit/form/HorizontalSlider", "dijit/form/HorizontalRuleLabels", "dijit/form/HorizontalRule", "dojo/parser"]);
    </script>
</body>
```

<a href="demos/rules.html" class="button">View Demo</a>

We can also augment our programmatically-created vertical slider to show
rules and rule labels, as follows:

```html
<body class="claro">
    <div id="vertSlider"></div>

    <script>
        require(["dijit/form/VerticalSlider", "dijit/form/VerticalRuleLabels", "dijit/form/VerticalRule", "dojo/dom-construct", "dojo/parser", "dojo/dom", "dojo/domReady!"],
            function(VerticalSlider, VerticalRuleLabels, VerticalRule, domConstruct, parser, dom) {
                // Create the rules
                var rulesNode = domConstruct.create("div", {}, dom.byId("vertSlider"), "first");
                var sliderRules = new VerticalRule({
                    container: "leftDecoration",
                    count: 11,
                    style: "width: 5px;"
                }, rulesNode);

                // Create the labels
                var labelsNode = domConstruct.create("div", {}, dom.byId("vertSlider"), "first");
                var sliderLabels = new VerticalRuleLabels({
                    container: "rightDecoration",
                    labelStyle: "font-style: italic; font-size: 0.75em"
                }, labelsNode);

                // Create the vertical slider programmatically
                var vertSlider = new VerticalSlider({
                    minimum: 0,
                    maximum: 100,
                    pageIncrement: 20,
                    value: 20,
                    intermediateChanges: true,
                    style: "height: 200px;"
                }, "vertSlider");

                // Start up the widgets
                vertSlider.startup();
                sliderRules.startup();
                sliderLabels.startup();
            }
        );
    </script>
</body>
```

<a href="demos/rules.html" class="button">View Demo</a>

Note that rules and labels are each given their own `<div>` element and are
injected into the node which will become the VerticalSlider ("vertSlider").

### Conclusion

While the HTML5 specification offers slider controls via `<input type="range">`, this feature is only
available in modern browsers, and the ability to customize its look and feel is limited.  Dijit's
Slider widgets provide a uniform, themeable, cross-browser compatible solution
for allowing users to change range values.  Sliders provide the flexibility and
reliability developers expect from the Dojo Toolkit.

### Slider Resources

Looking for more detail about Dijit's slider widgets?  Check out these great resources:

*   [HorizontalSlider Reference Guide](/reference-guide/1.10/dijit/form/HorizontalSlider.html)
*   [VerticalSlider Reference Guide](/reference-guide/1.10/dijit/form/VerticalSlider.html)
*   [dijit/form/HorizontalSlider API Documentation](/api/?qs=1.10/dijit/form/HorizontalSlider)
*   [dijit/form/VerticalSlider API Documentation](/api/?qs=1.10/dijit/form/VerticalSlider)