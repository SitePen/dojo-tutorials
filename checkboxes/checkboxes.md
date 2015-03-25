## Checkboxes

Dijit's collection of form widgets provides a convenient and flexible range of options for creating rich forms. In this tutorial we will look at the options available for checkbox-style interaction.

### Getting Started

The checkbox and radio button are staples of any user interface that requires input and selection. Dijit includes the `dijit/form/CheckBox` and `dijit/form/RadioButton` widget modules that can be used as drop-in replacements for the native checkbox and radio button elements. These widgets are themed to help create a consistent look and feel when building forms and to provide a convenient set of methods for managing input value and state.

The driving principle in Dijit's form widgets is to enhance the native controls while preserving the existing semantics and patterns of use where they make sense. So, you can expect CheckBox and RadioButton widgets to support all the same functionality you're used to in native checkbox and radio input types.

#### Declare a CheckBox

Like all Dijit widgets, `dijit/form/CheckBox` can be instantiated using markup (declaratively) or in code (programmatically). The following two examples create an initially-checked CheckBox:

```html
<input type="checkbox" id="dbox1" checked
	data-dojo-type="dijit/form/CheckBox">
<label for="dbox1">Want</label>
```

```js
require(["dijit/form/CheckBox"], function(CheckBox) {
	var box1 = new CheckBox({
		id: "pbox1",
		checked: true
	});

	// place the widget on the page
	box1.placeAt("pbox1_container", "first");
});
```

[View Demo](demo/CheckBox.html)

Clicking on either the label or the input itself toggles it between a checked and unchecked state. You can also use the tab key to navigate between controls using the keyboard and check/uncheck elements with the space bar, just as you can with native controls. By referencing the corresponding CheckBox widget's ID, HTML labels also continue to work the same as they would with a native form element.

One of the new features introduced in Dojo 1.6 was the ability to use HTML5 `data-dojo-type` attributes instead of `dojoType` attributes. In Dojo 1.6, however, `data-dojo-type` prevented Dojo from picking up values from standard HTML attributes, which meant that you needed to duplicate all of your normal HTML attribute values (`checked`, `disabled`, etc.) in `data-dojo-props` if you choose to use this attribute. This issue was resolved in Dojo 1.7.

### Checkbox Values

All Dijit form widgets have getter and setter methods to retrieve and update the widget's value (`<var>widget</var>.get("value")` and `<var>widget</var>.set("value")`). Remember that for native checkboxes, a checkbox's value is only sent to the server if it is checked. Dijit's CheckBox works somewhat similarly: if it is in a checked state, `<var>widget</var>.get("value")` will return the value property of the widget. Otherwise, it returns `false`. If no value property has been provided or set, `dijit/form/CheckBox` has a default value of "on". We can infer the checked state by asking for the value and seeing if we get a boolean `false` back, or we can inspect the `checked` property itself:

```js
require(["dijit/registry"], function(registry){

	var toppings = [];
	if(registry.byId("topping1").get("checked")){
		toppings.push(registry.byId("topping1").get("value"));
	}

	if(registry.byId("topping2").get("value") !== false){
		toppings.push(registry.byId("topping2").get("value"));
	}
```

[View Demo](demo/checkboxValues.html)

This demo also wires up an additional CheckBox which modifies the value of one of the others, providing an example of the `value` property setter:

```js
registry.byId("deluxe").on("change", function(isChecked){
	registry.byId("topping2").set("value", isChecked ? "kalamata olives" : "olives");
}, true);
```

When you pass a truthy (i.e. non-empty, non-zero) `value` to a `dijit/form/CheckBox`, the widget is automatically put into a checked state.

### Radio Buttons

Much of what we've discussed so far in the context of checkboxes and `dijit/form/CheckBox` is also true of Dijit's radio button widget, `dijit/form/RadioButton`. A radio button differs from a checkbox in that it is:

* Typically rendered as a disc, with or without a circular dot inside depending on its checked state
* Used for single-choice selections, where only one of a series of items can be checked at a time

Otherwise, its use is very similar to the checkbox. Let's see an example:

```html
<ul>
	<li>
		<input id="topping1" type="radio" name="topping" value="anchovies" checked
			data-dojo-type="dijit/form/RadioButton">
		<label for="topping1">Anchovies</label>
	</li>
	<li>
		<input id="topping2" type="radio" name="topping" value="olives"
			data-dojo-type="dijit/form/RadioButton">
		<label for="topping2">Olives</label>
	</li>
	<li>
		<input id="topping3" type="radio" name="topping" value="pineapple"
			data-dojo-type="dijit/form/RadioButton">
		<label for="topping3">Pineapple</label>
	</li>
</ul>
```

[View Demo](demo/radioButtons.html)

The key difference here is the use of the `name` property. Just as with native HTML radio controls, you associate a group of Dijit radio buttons by having them share a `name` property. Now, when you check one of the options in the list, the others are automatically unchecked.

It is common to want to treat a series of radio buttons as a single control, and to get the value of whichever is checked at that time. The [dojox/form/CheckedMultiSelect](/reference-guide/1.10/dojox/form/CheckedMultiSelect.html) widget provides this functionality.

### Events

So, we can create and interact with these fine looking controls. What else can we do? Like many of the widgets provided by Dijit, RadioButton and CheckBox provide methods you can hook into for notification when activity occurs.
	A full list of these events can be found in the [API docs](/api/?qs=1.10/dijit/form/CheckBox). For our next demo, we'll focus on the one you'll probably use most often: `change`.

```js
registry.byId("topping1").on("change", function(isChecked){
	if(isChecked){
		summaryNode.innerHTML = "Likes the salty!";
	}
}, true);

registry.byId("topping2").on("change", function(isChecked){
	if(isChecked){
		summaryNode.innerHTML = "Likes the sweet!";
	}
}, true);

registry.byId("crust").on("change", function(isChecked){
	remarkNode.innerHTML = isChecked ? "Healthy gums!" : "";
}, true);
```

[View Demo](demo/onChange.html)

We saw a sneak preview of this in our earlier `value` getters &amp; setters demo. The pattern is simple since `dojo/aspect` lets us treat the widget method just the same way that we might treat a DOM event on a regular element. The listener function receives the checked state as a sole argument, and we respond by updating a message on the screen. The many events provided by these widgets opens up a broad range of interaction and form-logic options.

### dijit/form/ToggleButton

We will cover one more variation on the boolean-state button: `dijit/form/ToggleButton`. A toggle button is a button that has two states. It is functionally very similar to CheckBox and RadioButton, but the user interface is different. Each state can contain an icon, text, or both. The icon is defined using a CSS class.

```html
<input type="checkbox" dojoType="dijit/form/ToggleButton" checked iconClass="dijitCheckBoxIcon" label="Toggle Me">
```

```js
var myToggleButton = new ToggleButton({
	checked: true,
	iconClass: "dijitCheckBoxIcon",
	label: "Toggle Me, Too."
}, "toggleButtonProgrammatic");
```

[View Demo](demo/ToggleButton.html)

In this widget, the `label` property is mandatory for correct functionality. Like all other properties, after initialization, `label` and `iconClass` can be updated via the `set` method:

```js
// provide a new label for the button
myToggleButton.set("label", "New Label");

// hook a .recent rule in our stylesheet
myToggleButton.set("iconClass", "recent");
```


Note that you _must_ use the `<var>widget</var>.set()` method; simply assigning the property will not update the widget properly.

### Conclusion

Dijit's out-of-the-box form widgets meet many of the most common requirements for user input and selection. CheckBox, RadioButton, and ToggleButton are three widget classes that help you provide a richer, more visually engaging and consistent user experience. There are other widgets in Dijit that you may want to familiarize yourself with if forms are an important part of your project: `dijit/Menu` (and the `dijit/CheckedMenuItem`), `dijit/form/Select` and related widgets `FilteringSelect`, `ComboBox` and `MultiSelect`. The `dojox/form` package has even more options—and when _that's_ not enough, you'll find `dijit/form/_FormWidget` an extremely useful base to build on. That, however, is a topic for another tutorial.