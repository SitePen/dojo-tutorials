---
Category:  Widgets
...

## Advanced Dijit Selects using Stores

In this tutorial, we will further explore Dijit's select widgets&mdash;particularly how to create instances programmatically, populating their drop-down lists from dojo/data stores.

### Introduction

Previously in [Getting Selective with Dijit](../selects), you learned how Dijit enables you to quickly transform
a plain HTML select element into one of several feature-rich, skinnable widgets,
presenting a look and feel that is consistent with other Dijit widgets
across browsers.

However, that tutorial focused on creating these widgets declaratively
via markup reminiscent of standard HTML select elements.  While that may
satisfy a wide range of use cases, there are plenty of others&mdash;such as
single-page rich internet applications pursuing a modular
design&mdash;which highly prefer programmatic widget instantiation.

It is clear from
[other](../sliders/ "Slippin")
[tutorials](../themes_buttons_textboxes "Dijit Themes, Buttons, and Textboxes")
that widgets can be created either declaratively or programmatically,
and indeed Dijit's select widgets are no exception.  However, when creating
widgets programmatically, one does not ordinarily rely on pre-existing markup
in the page (perhaps a placeholder element, at most)&mdash;in which
case, from where shall we derive our drop-down list items?

### Select Widgets and dojo/store

You should already be familiar with the concepts behind
[`dojo/store`](/reference-guide/1.10/dojo/store.html "Using Dojo Stores");
perhaps you have also already observed how some widgets interact with
stores.
Dijit's select widgets are also capable of working with `dojo/store`.

Select widgets have an optional **`store`** property;
passing a `dojo/store` instance to the
select widget via this property will instruct the widget to populate its
drop-down list with the items from the specified store.  This works for all
three select widgets we've previously discussed: `dijit/form/Select`,
`dijit/form/FilteringSelect`, and `dijit/form/ComboBox`.

<!-- protip -->
> Fun fact: even when you create a `dijit/form/FilteringSelect` or
`dijit/form/ComboBox` from markup, the widget internally
converts it to a store!

To demonstrate select widgets and data stores working together, we will recreate
our select widgets for US states programmatically.  To keep things simple,
we will use an instance of `dojo/store/Memory`
[ [api](/api/?qs=1.10/dojo/store/Memory "dojo/store/Memory API")
| [ref](/reference-guide/1.10/dojo/store/Memory.html "dojo/store/Memory Reference") ],
fetching its data from a JSON resource whose contents look something like this:

```js
[
	{ "abbreviation": "AL", "name": "Alabama" },

	... other 48 states here ...

	{ "abbreviation": "WY", "name": "Wyoming" }
]
```

Notice that in addition to the name, there is an abbreviation.
It will become the "internal value" of each item.

<!-- protip -->
> When populating from a store, the `value` of a
`dijit/form/Select` or `dijit/form/FilteringSelect`
reports the _identity_ of the selected item.
(This means that select widgets expect a store which implements getIdentity().)

Let's say that we have a web page set up with the Claro theme as seen in
[previous](../sliders/ "Slippin")
[tutorials](../themes_buttons_textboxes/ "Dijit Themes, Buttons, and Textboxes"),
and that the above JSON resource is available as
`states.json` within the same folder as the page.
We can instantiate an Memory to consume the resource, then
create a select widget referencing the store, like so:

##### Using dijit/form/Select

```html
<body class="claro">
    <div id="stateSelect"></div>

    <script>
        require(["dijit/form/Select", "dojo/store/Memory",
            "dojo/json", "dojo/text!./states.json", "dojo/domReady!"],
        function(Select, Memory, json, states){

            // create store instance referencing data from states.json
            var stateStore = new Memory({
                idProperty: "abbreviation",
                data: json.parse(states)
            });

            // create Select widget, populating its options from the store
            var select = new Select({
                name: "stateSelect",
                store: stateStore,
                style: "width: 200px;",
                labelAttr: "name",
                maxHeight: -1, // tells _HasDropDown to fit menu within viewport
                onChange: function(value){
                    document.getElementById("value").innerHTML = value;
                    document.getElementById("displayedValue").innerHTML = this.get("displayedValue");
                }
            }, "stateSelect");
            select.startup();
        });
    </script>
</body>
```

<a href="demos/ProgSelect.html" class="button">View Select Demo</a>

##### Using dijit/form/FilteringSelect

```html
<body class="claro">
    <div id="stateSelect"></div>

    <script>
        require(["dijit/form/FilteringSelect", "dojo/store/Memory",
            "dojo/json", "dojo/text!./states.json", "dojo/domReady!"],
        function(FilteringSelect, Memory, json, states){
            // create store instance referencing data from states.json
            var stateStore = new Memory({
                idProperty: "abbreviation",
                data: json.parse(states)
            });

            // create FilteringSelect widget, populating its options from the store
            var select = new FilteringSelect({
                name: "stateSelect",
                placeHolder: "Select a State",
                store: stateStore,
                onChange: function(val){
                    document.getElementById("value").innerHTML = val;
                    document.getElementById("displayedValue").innerHTML = this.get("displayedValue");
                }
            }, "stateSelect");
            select.startup();
        });
    </script>
</body>
```

<a href="demos/ProgFilteringSelect.html" class="button">View FilteringSelect Demo</a>


##### Using dijit/form/ComboBox

```html
<body class="claro">
    <div id="stateSelect"></div>

    <script>
        require(["dijit/form/ComboBox", "dojo/store/Memory",
            "dojo/json", "dojo/text!./states.json", "dojo/domReady!"],
        function(ComboBox, Memory, json, states){
            // create store instance referencing data from states.json
            var stateStore = new Memory({
                idProperty: "abbreviation",
                data: json.parse(states)
            });

            // create ComboBox widget, populating its options from the store
            var select = new ComboBox({
                name: "stateSelect",
                placeHolder: "Select a State",
                store: stateStore,
                onChange: function(value){
                    document.getElementById("value").innerHTML = value;
                }
            }, "stateSelect");
            select.startup();
        });
    </script>
</body>
```

<a href="demos/ProgComboBox.html" class="button">View ComboBox Demo</a>

<!-- protip -->
> When creating widgets programmatically, don't forget to call `startup`
on your widget instances once they have been placed in the document.
(The parser takes care of this for you in the case of declarative instantiation.)
Forgetting to call `startup` is a very common mistake, and while its
effects may vary from widget to widget, you can generally expect odd behavior to
ensue.  For example, if we were to forget to call `startup` in the
`dijit/form/Select` example above, you would find that the drop-down
list would be empty.

Notice how similar these examples are&mdash;the primary difference being which
widget is `require`d and instantiated.  Aside from that, there
are only a few differences:

*   We add `maxHeight: -1` for Select, to prevent the drop-down
	menu from causing the entire page to grow in size; FilteringSelect and
	ComboBox already do this by default.
*   We add `placeHolder` text for FilteringSelect and
	ComboBox&mdash;Select does not support this.
*   labelAttr, the attribute used for the label, is specified for the Select&mdash;
	for ComboBox and FilteringSelect labelAttr defaults to searchAttr,
	and searchAttr defaults to "name", so we didn't bother specifying it.
*   Select needs an explicit width setting.

<!-- protip -->
> You may have noticed that our `dijit/form/Select` example does not
have an empty-valued "Select a state" item this time around.
The smoothest way to resolve this would be to also include this item in the store.
For the purposes of this example, however, we have omitted it in favor of a
more natural presentation of the other two widgets, while still being able to
use the same store and JSON resource for all three.

We have now observed how all three Dijit select widgets can be created
programmatically, populating their lists from a data store via the
`store` property.  Next we will take a closer look at some behaviors
and capabilities that set these widgets apart from one another.

<!-- protip -->
> Note: it is technically possible to declaratively create Dijit select
widgets using stores as well; however, doing so is not recommended, since
it requires exposing the store as a global object in the web page or
application.  Declarative instantiation of select widgets is best reserved for
instances which take advantage of their ability to be created with
markup very similar to that of a standard HTML select element.
It is far more common and appropriate to use stores in conjunction with
programmatically-created select widgets.

### Using Stores with FilteringSelect and ComboBox

It makes sense to look at `dijit/form/FilteringSelect` and
`dijit/form/ComboBox` together, as both inherit the same codebase
and thus share the same behavior in terms of how they interact with a data store.

<!-- protip -->
> While FilteringSelect and ComboBox behave identically within the confines of this
discussion, please remember that these two widgets report `value`
differently&mdash;see the
[previous tutorial on select widgets](../selects "Getting Selective with Dijit")
for details.

In the previous tutorial, we only looked at the most important widget properties
to get up and running.  There are a few additional properties of interest
particularly when working with stores:

*   **`searchAttr`:**
	Name of the attribute to match text field input against when filtering
	the list; defaults to `"name"`.
*   **`pageSize`:**
	Limits how many list options will be displayed at a time&mdash;if the
	number of results exceeds this limit, a special item will be added to the list
	at each end, for moving to the next or previous "page".
	The default is `Infinity` (no limit).

<!-- protip -->
> Note that `pageSize` can also be used when creating widgets from
markup&mdash;we did not introduce it in the previous tutorial simply because
it is not a feature normally encountered in a standard HTML select element.

Noting the properties above gives us some insight as to the behavior of these
two widgets&mdash;they do not rely upon the store's label attribute(s).
Rather, they expect you to specify which item attribute
to use for searching and displaying items in the drop-down list.

In our states drop-down example above, notice that we did not specify
`searchAttr`; this is because our data items already have a
`name` attribute, which contains what we want to search against and
display in the list&mdash;therefore, the example "just works".

### Using Stores with dijit/form/Select

We noted earlier that when using stores, `dijit/form/Select` and
`dijit/form/FilteringSelect` associate their `value` with
the identity of the currently-selected item.  However,
`dijit/form/Select` possesses an important limitation: it is
implemented in such a way that it does not handle non-string item identities well.
Particularly, setting the current value of the widget programmatically via
`select.set("value", id)` will not work with non-string
(e.g. numeric) identities.

<!-- protip -->
> For best results, only use `dijit/form/Select` with a store whose
items' identities are strings.

<!-- protip -->
> Another important detail: when changing the store referenced by a
`dijit/form/Select` widget after initialization, you might be
inclined to call `widget.set("store", newStore)` as with other
select widgets, but this will not work with
`dijit/form/Select`&mdash;instead, call
`widget.setStore(newStore)`.

### Programmatically Creating dijit/form/Select without a Store

Thus far, this tutorial has been dedicated to the use of stores with Dijit's
select widgets, but its underlying purpose has been to demonstrate programmatic
instantiation of these widgets.  Along those lines, `dijit/form/Select`
provides an alternative approach that does not require the use of a store: the
**`options`** property.

The `options` property accepts an array of objects,
each of which may include the following properties:

*   **`label`:**
	The text to appear in this list item; analogous to the
	`innerHTML` of an `option` element.  This is reflected in
	the widget's `displayedValue` when the item is selected.
*   **`value`:**
	The "internal" value represented by this list item; analogous to the
	`value` attribute of an `option` element.  This is
	reflected in the widget's `value` when the item is selected.
*   **`selected`:**
	_(optional)_ If `true`, indicates that this item should be
	initially selected in the widget; analogous to the `selected`
	attribute of an `option` element.
*   **`disabled`:**
	_(optional)_ If `true`, indicates that this item should not be
	selectable in the drop-down list; analogous to the `disabled`
	attribute of an `option` element.

Let's take a look at an example of the `options` array in action,
with an alternate (and abridged) version of our states drop-down:

```html
<body class="claro">
    <div id="stateSelect"></div>

    <script>
        require(["dijit/form/Select", "dojo/store/Memory", "dojo/domReady!"],
        function(Select, Memory){
            var select = new Select({
                name: "stateSelect",
                options: [
                    {
                        value: "",
                        label: "Select a state",
                        selected: true
                    },
                    {
                        value: "AL",
                        label: "Alabama"
                    },
                    {
                        value: "AK",
                        label: "Alaska"
                    },
                    {
                        value: "AZ",
                        label: "Arizona"
                    },
                    {
                        value: "AR",
                        label: "Arkansas"
                    },
                    // ... more states would go here ...
                    {
                        value: "DC",
                        label: "Washington, D.C.",
                        disabled: true // can't pick this; it's not a state!
                    },
                    {
                        value: "WY",
                        label: "Wyoming"
                    }
                ],
                onChange: function(value){
                    document.getElementById("value").innerHTML = value;
                    document.getElementById("displayedValue").innerHTML = this.get("displayedValue");
                }
            }, "stateSelect");
            select.startup();
        });
    </script>
</body>
```

<a href="demos/ProgSelectOptions.html" class="button">View Demo</a>

As you can see, this achieves a result comparable to the previous
`dijit/form/Select` example, without using a store.
This can be useful in instances where you wish to create the widget
programmatically, with a list of options that is either short and static,
or simple to generate procedurally.

<!-- protip -->
> It is also possible to later add and remove individual options using the
`addOption` and `removeOption` methods, each of which can
be passed either a single object or an array of objects.  Additionally, you
can replace the list entirely by calling
`set("options", arrayOfObjects)`.  However, due to a limitation
of the implementation, you will need to call `startup` again
for this to take effect (which is otherwise not a standard practice).

### Conclusion

Dijit offers a number of widgets for enriching the user experience normally
found in HTML select elements.  These widgets can be created via markup with
minimal changes to ordinary HTML code, but can also be instantiated
programmatically&mdash;primarily through cooperation with `dojo/store`
stores.  At the most basic level, you can easily swap between these widgets
with minimal code changes, but as we have seen, each one has its own
particular behaviors and strengths.

After reading a number of these tutorials, you should feel more comfortable with
the basic building blocks Dijit provides for creating rich, functional
user interfaces.  We hope this encourages you to start exploring and building
awesome applications with Dojo!