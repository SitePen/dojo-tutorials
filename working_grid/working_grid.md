## Working with the Grid

In this tutorial, you'll learn about the Grid's event system, how to select rows, and how to set up your grid for editing.

### dgrid

<!-- protip -->
> This tutorial covers the `dojox/grid/DataGrid` in depth. Beginning with Dojo 1.7, you should use the [dgrid](http://dgrid.io/), a next-generation grid component that takes full advantage of modern browsers and object stores. Visit the dgrid site for a collection of [dgrid tutorials](http://dgrid.io#tutorials).

### Getting Started

We've [learned about the Data Grid](../datagrid/) and how
to [populate a Grid with data](../populating_datagrid/).  Now
we'll introduce three major concepts to be used when working with the `dojox/grid/DataGrid`:
how the Grid's event system works, how the Grid's selections work, and how to set up your Grid
so that you can edit data.

### The Grid's Event System

The Grid supports quite a few events&mdash;see [the API reference](/api/?qs=1.10/dojox/grid/_Events#onApplyCellEdit)
for a full list&mdash;but for this tutorial, we are going to focus on the most common event handler
used by developers: `onRowClick`.  `onRowClick` is used to
detect clicks on rows (duh!), but the way in which it passes information about the event
is special: instead of passing specific arguments like many of the events in the
Dijit ecosphere, it augments standard DOM event objects with some custom information.

#### The decorated event object

When events are fired, the Grid _decorates_ the DOM event object passed to event handlers by the browser.
It does this by attaching the following properties to the event object:

*   **`grid`:** A reference to the grid in which the event was fired
*   **`cell`:** A reference to the specific cell in the grid from which the event was fired
*   **`rowIndex`:** A reference to the _index_ of the row in which the event was fired

All of these custom properties are accessible from the event object that is passed to your connected
handler.  Say, for example, we'd like to get a reference to the underlying `dojo/data` item
that a row represents when it is clicked.  Remember that the name of event is the event handler without the
"on" prefix, and so when using the new on() event handler, we use the event name of "RowClick" (and widgets
allow for all lower case, so we could use "rowclick"), therefore we would do something like this:

```js
// assuming our grid is stored in a variable called "myGrid":
myGrid.on("RowClick", function(evt){
	var idx = evt.rowIndex,
		rowData = grid.getItem(idx);
	// The rowData is returned in an object, last is the last name, first is the first name
	document.getElementById("results").innerHTML =
		"You have clicked on " + rowData.last + ", " + rowData.first + ".";
}, true);
```
[View Demo](demo/rowclick.html)

We focus on rows instead of cells for events because a Grid is a representation
(or view) of a collection of data items.  Since each row represents a single item,
it is more logical and efficient to work with full rows instead of attempting to
handle individual cells.

<!-- protip -->
> Don't forget: when working with a Grid, you should be doing any kind of data
operations _in the underlying data store_ and not with the DOM structure
of the Grid directly.

#### Other events

The Grid supports a large set of basic events on both rows and cells,
which you can use to create customizations (such as visual alterations) if needed.
They are as follows:

<table style="width: 100%;margin:1em;">
<thead>
<tr>
<th>Row</th>
<th>HeaderCell</th>
<th>Cell</th>
</tr>
</thead>
<tbody>
<tr>
<td>onRowClick</td>
<td>onHeaderCellClick</td>
<td>onCellClick</td>
</tr>
<tr>
<td>onRowContextMenu</td>
<td>onHeaderCellContextMenu</td>
<td>onCellContextMenu</td>
</tr>
<tr>
<td>onRowDblClick</td>
<td>onHeaderCellDblClick</td>
<td>onCellDblClick</td>
</tr>
<tr>
<td>onRowFocus</td>
<td>onHeaderCellFocus</td>
<td>onCellFocus</td>
</tr>
<tr>
<td>onRowMouseDown</td>
<td>onHeaderCellMouseDown</td>
<td>onCellMouseDown</td>
</tr>
<tr>
<td>onRowMouseOut</td>
<td>onHeaderCellMouseOut</td>
<td>onCellMouseOut</td>
</tr>
<tr>
<td>onRowMouseOver</td>
<td>onHeaderCellMouseOver</td>
<td>onCellMouseOver</td>
</tr>
</tbody>
</table>

Each of these events are passed the same decorated DOM event object as we saw in
our `onRowClick` example.

<!-- protip -->
> The Grid also supports a number of other events, including notifications when a
cell is being edited, and when rows/items are selected.  See
[the API reference](/api/?qs=1.10/dojox/grid/DataGrid#onApplyCellEdit)
for more details.

### Row selections with the Grid

The Grid supports the notion of row-based selections, providing several
options for selection behavior.  The desired behavior can be specified when
creating the Grid using the `selectionMode` property:

<!-- highlight: 5 -->
```js
require(["dojox/grid/DataGrid"], function(DataGrid){
	var myGrid = new DataGrid({
		store: myStore,
		structure: myStructure,
		selectionMode: "single"
	}, "someNode");
	myGrid.startup();
```

The possible values for `selectionMode` are:

*   **`none`:** No selections are allowed
*   **`single`:** Only one row may be selected at a
	time; clicking a second row will remove the selection from the first
*   **`multiple`:** Each click toggles the selection of
	the row in question
*   **`extended`:** The default mode; normal clicks
	operate like `single`, but multiple rows / ranges of rows may be
	selected by holding modifier keys (e.g. Ctrl and Shift on Windows) while clicking

#### Row selectors

In addition to selecting rows by clicking directly on data cells, the Grid also
provides a few options allowing selection via a dedicated area of each row.

The most basic of these is exposed via the Grid's `rowSelector` property.
This can be set to a CSS-compatible width measurement (e.g. `"20px"`),
or simply to `true` which will use a default width.

The Grid also provides options for selection via checkboxes, or&mdash;in the
case of the `single` row selection mode&mdash;radio buttons.
These capabilities are exposed via the semi-private custom view types
`dojox/grid/_CheckBoxSelector` and `dojox/grid/_RadioSelector`.
You would include one of these views in your grid structure as follows:

```js
require(["dojox/grid/cells", "dojox/grid/_CheckBoxSelector"], function(gridCells){

	var myStructure = [
		// First, a view using the _CheckBoxSelector custom type.
		// Don't forget to require dojox/grid/_CheckBoxSelector
		{
			type: "dojox.grid._CheckBoxSelector"
		},
		// Now include the data cells in a view occupying the rest of the grid.
		[
			[
				new gridCells.RowIndex({ width: "10%" }),
				{ name: "Column 1", field: "col1", width: "30%" },
				{ name: "Column 2", field: "col2", width: "30%" },
				{ name: "Column 3", field: "col3", width: "30%" }
			],[
				{ name: "Column 4", field: "col4", colSpan: 4 }
			]
		]
	];
```

<!-- protip -->
> You may have noticed we snuck an interesting cell type into this structure:
`gridCells.RowIndex`.  This cell simply displays the
index of each row in the grid.  It is not at all required in order
to take advantage of the Grid's selection capabilities, but it may be useful
particularly during the process of prototyping a grid structure.

To see these selector features in action, check out the selector demo below.

#### Getting selections from the Grid

The ability to select data is pointless unless you have some way of retrieving the
current selection.  The Grid handles this through the `selection` property,
and three event handlers&mdash;`onSelected`, `onDeselected`,
and `onSelectionChanged`.

When listening to the `onSelected` or `onDeselected` handlers, you
will receive the index of the row that has been selected or deselected, respectively.
Additionally, you can use the Grid's `selection` property to
retrieve the items represented by the selected rows and operate on them, like so:

```js
require(["dojo/_base/array", "dojo/_base/lang"], function(baseArray, lang){
	function reportSelection(node){
		var items = this.selection.getSelected();
		var tmp = baseArray.map(items, function(item){
			return item.id;
		}, this);
		var msg = "You have selected row" + ((tmp.length > 1) ? "s ": " ");
		node.innerHTML = msg + tmp.join(", ");
	}
	// assuming our grid is stored in a variable called "myGrid":
	myGrid.on("SelectionChanged",
		lang.hitch(grid, reportSelection, document.getElementById("results")), true);
```
[View Demo](demo/selector.html)

<!-- protip -->
> The return from `selection.getSelected()` is **always** an array, regardless
of the selection mode used; i.e. if you set up your Grid to only allow one selection at a time,
`getSelected` will still return an array, with a single item in it.

For more information about the Grid's `selection` object, take a look at
[the Selection object](/api/?qs=1.10/dojox/grid/Selection) in the API reference, where you'll
find that you have full programmatic access to grid selection operations.

Now that we have learned how selections work with a Grid, let's take a look at a major piece of
functionality: editing data with a Grid.

### Editing data with the Grid

Like a typical relational database GUI (Graphical User Interface) or a spreadsheet program, the
Grid can also allow you to edit data at the field level.  To do this, you have to designate
whether a field is _editable_ in your structure definition, and specify what type of
editing you want to enable through the use of the `type` property in each
column definition, like so:

```js
	require(["dojox/grid/DataGrid", "dojox/grid/cells", "dojox/grid/cells/dijit",
		"dojo/date/locale", "dojo/currency", "dijit/form/DateTextBox", "dijit/form/CurrencyTextBox",
		"dijit/form/HorizontalSlider", "dojo/domReady!"
	], function(DataGrid, cells, cellsDijit, locale, currency, DateTextBox, CurrencyTextBox, HorizontalSlider){
		function formatCurrency(inDatum){
			return isNaN(inDatum) ? '...' : currency.format(inDatum, this.constraint);
		}
		function formatDate(inDatum){
			return locale.format(new Date(inDatum), this.constraint);
		}
		gridLayout = [{
			defaultCell: { width: 8, editable: true, type: cells._Widget, styles: 'text-align: right;'  },
			cells: [
				{ name: 'Id', field: 'id', editable: false, width: 2 /* Can't edit ID's of dojo/store items */ },
				{ name: 'Date', field: 'col8', width: 10, editable: true,
					widgetClass: DateTextBox,
					formatter: formatDate,
					constraint: {formatLength: 'long', selector: "date"}},
				{ name: 'Priority', styles: 'text-align: center;', field: 'col1', width: 10,
					type: cells.ComboBox,
					options: ["normal","note","important"]},
				{ name: 'Mark', field: 'col2', width: 5, styles: 'text-align: center;',
					type: cells.CheckBox},
				{ name: 'Status', field: 'col3',
					styles: 'text-align: center;',
					type: cells.Select,
					options: ["new", "read", "replied"] },
				{ name: 'Message', field: 'col4', styles: '', width: 10 },
				{ name: 'Amount', field: 'col5', formatter: formatCurrency, constraint: {currency: 'EUR'},
					widgetClass: CurrencyTextBox, width: "auto" },
				{ name: 'Amount', field: 'col5', formatter: formatCurrency, constraint: {currency: 'EUR'},
					widgetClass: HorizontalSlider, width: 10}
			]
		}];
```
[View Demo](demo/edit.html)

<!-- protip -->
> Note that when defining a Grid's structure declaratively, cell editor type is specified
in the `th` via the `cellType` attribute, _not_ `type`.

By default, if you specify a column to be editable but don't specify a widget
constructor, you will get a plain text box.  This is often adequate;
however, you might find that you'll need to limit the options of entry, deal with
dates, or have some other special needs&mdash;like in the example above.

We set up our example structure with a `defaultCell` definition,
which sets a baseline of properties to be applied to all cells in our structure,
unless explicitly overridden on a per-cell basis.  In this case, we specify that
we want cells to be editable unless otherwise noted, and set the type to a basic
custom editor widget called `dojox/grid/cells._Widget`, from which
all the custom grid-based editing widgets derive.  We then customize each
column definition to specify which kind of editing widget we'd really like to
use in each case.

As you can see, the Grid itself provides a number of "special" widgets for you.
In our example, we can see `dojox/grid/cells/DateTextBox`,
`dojox/grid/cells/ComboBox`, `dojox/grid/cells/Select`,
`dojox/grid/cells/Editor`, and `dojox/grid/cells/CheckBox`;
we can also see the use of actual Dijits, such as
`dijit/form/CurrencyTextBox` and `dijit/form/HorizontalSlider`.
Using each of these widgets may also require additional properties to be defined;
for example, the ComboBox and Select widgets require an additional property
called `options`.

<!-- protip -->
> These widgets for editing on a cell-level (all defined within the
`dojox/grid/cells` namespace) have been defined because of the special
HTML needs of the Grid.  When in doubt about what kind of widget to use for
editing, look first to see if the widget in question has been implemented under
`dojox/grid/cells` before trying to use the Dijit equivalent.
This is particularly true of any kind of Dijit that defines/uses a popup of some sort.

Because of the data binding that occurs between Dijit-based form widgets and
`dojo/store` via the Grid, this should be all you need to enable
editing for a data set.

<!-- protip -->
> Another friendly reminder: you will need to use a _write-enabled_ data store
in order to do any kind of editing within a Grid.  Depending on the store, you
may also have to do a periodic _save()_ in order to capture any edits
within a Grid; this is entirely dependent on the store of choice.

### Conclusion

In this tutorial, we've built upon previous topics by introducing additional
features of the Grid.  The Grid exposes many events to which custom logic can be
applied.  Several row selection modes are available; the Grid provides APIs
for determining selected rows and being notified when a selection occurs.
Using the Grid's powerful editing capabilities, it is possible to
modify the data set from within the Grid itself.

Armed with this knowledge, you should be well on your way towards creating
an application capable of displaying and manipulating information in complex
data sets.