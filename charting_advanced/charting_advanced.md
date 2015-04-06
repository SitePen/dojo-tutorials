---
Category:  Widgets
...

## Advanced Charting

While most developers only need basic charts, `dojox/charting` is capable of highly advanced charts:  charts with animations, charts that respond to changes in data, and charts that respond to events. In this tutorial, you will learn about using some these advanced capabilities within `dojox/charting`.

### Getting Started

Creating advanced, dynamic charts with `dojox/charting` is probably easier than you would believe.  Creating charts that handle changes in data, zooming, panning, and scrolling is simple, thanks to the Dojo Toolkit!

### Dojo Stores and Charting

Dojo provides an outstanding, flexible Store API which allows developers to manage (add, edit, delete, query, etc.) data in an efficient manner.  Due to the prevalence of Store usage within Dojo applications, `dojox/charting/StoreSeries` has incorporated solutions for creating data series from Store data.

#### StoreSeries

`dojox/charting/StoreSeries` was specifically created to incorporate data stores within charts. The first step in using store data within a chart is creating the store:

```js
require(["dojo/store/Observable", "dojo/store/Memory"], function(ObservableStore, MemoryStore) {
	// Initial data
	var data = [
		// This information, presumably, would come from a database or web service
		// Note that the values for site are either 1 or 2
		{ id: 1, value: 20, site: 1 },
		{ id: 2, value: 16, site: 1 },
		{ id: 3, value: 11, site: 1 },
		{ id: 4, value: 18, site: 1 },
		{ id: 5, value: 26, site: 1 },
		{ id: 6, value: 19, site: 2 },
		{ id: 7, value: 20, site: 2 },
		{ id: 8, value: 28, site: 2 },
		{ id: 9, value: 12, site: 2 },
		{ id: 10, value: 4, site: 2 }
	];

	// Create the data store
	// Store information in a data store on the client side
	var store = new ObservableStore(new MemoryStore({
		data: {
			identifier: "id",
			label: "Users Online",
			items: data
		}
	}));
});
```

_Wrapping the store in Observable is important, as it allows notifications to be sent to the store, which in turn notifies the StoreSeries instance we will create._

With the store in place, the chart, plot, and axes should be added just as they were in the [basic tutorial](../charting/).  With the chart, plot, and axes created,  it's time to implement StoreSeries:

```
// Adds a StoreSeries to the y axis, queries for all site 1 items
chart.addSeries("y", new StoreSeries(store, { query: { site: 1 } }, "value"));
```

With the StoreSeries in place, each time the data store is notified of a change, the series is re-rendered on the chart.

[View Demo](demo/store-series.html)

### Charting Animation:  Zooming, Scrolling, and Panning

Dojo's charting solution is flexible enough to allow a change in data at any time, so it's only natural that charts would also need to be flexible enough to accommodate those changes in data.  Zooming, scrolling, and panning in charts allows just that.

The role that each animation plays is straight-forward:

* **Zooming** - Allows developers to enlarge elements within the chart without enlarging the chart itself
* **Scrolling** - Allows the user to click and drag their way around the chart
* **Panning** - Allows the user to elegantly pan to a different view of the chart

These effects can be accomplished with two chart methods:  `setAxisWindow` and `setWindow`.

#### setAxisWindow(name,scale,offset)

`setAxisWindow` defines a window on the named axis with a scale factor, which starts at the set offset in data coordinates.  The `setAxisWindow` method accepts three arguments:

* **name** - The name of the axis
* **scale** - Scale which the chart should change to
* **offset** - The chart's destination offset

Usage of `setAxisWindow` would look like:

```js
	// Changes the x axis to twice the scale, offset by 100
	chart.setAxisWindow("x",2,100).render();
```

#### setWindow(sx,sy,dx,dy)

`setWindow` sets scale and offsets on all plots of the chart.  The `setWindow` method accepts four arguments:

* **sx** - The magnification factor on horizontal axes
* **sy** - The magnification factor on vertical axes
* **dx** - The offset of horizontal axes in pixels
* **dy** - The offset of vertical axes in pixels

Usage of `setWindow` would look like:

```js
	// Returns the chart to it original position
	chart.setWindow(1, 1, 0, 0).render();
```

Each method requires the chart's `render` method to be called for changes to be reflected on the chart.

#### Example: Zooming, Scrolling, and Panning

The following example allows the user to zoom, pan, and scroll the chart using sliders.

```html
<script>

	// Require the dependencies
	require(["dijit/form/HorizontalSlider", "dijit/form/HorizontalRule", "dijit/form/HorizontalRuleLabels", "dojox/charting/Chart", "dojox/charting/themes/Claro", "dojox/lang/functional/object", "dijit/registry", "dojo/on", "dojo/dom", "dojo/_base/event", "dojo/parser", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Areas", "dojox/charting/plot2d/Grid", "dojo/domReady!"], function(HorizontalSlider, HorizontalRule, HorizontalRuleLabels, Chart, Claro, functionalObject, registry, on, dom, baseEvent, parser) {

		// Initialize chart, scales, and offsets
		var chart, moveable, scaleX = 1, scaleY = 1, offsetX = 0, offsetY = 0;

		// Updates the slider values, animates the change in scale and offsets
		var reflect = function(){
			functionalObject.forIn(chart.axes, function(axis){
				var scale  = axis.getWindowScale(),
					offset = Math.round(axis.getWindowOffset() * axis.getScaler().bounds.scale);
				if(axis.vertical){
					scaleY  = scale;
					offsetY = offset;
				}else{
					scaleX  = scale;
					offsetX = offset;
				}
			});
			setTimeout(function(){
				registry.byId("scaleXSlider").set("value", scaleX);
				registry.byId("offsetXSlider").set("value", offsetX);
				registry.byId("scaleYSlider").set("value", scaleY);
				registry.byId("offsetYSlider").set("value", offsetY);
			}, 25);
		};

		// Update the scale and offsets of *all* plots on the chart
		var update = function(){
			chart.setWindow(scaleX, scaleY, offsetX, offsetY, { duration: 1500 }).render();
			reflect();
		};

		// The following four methods are fired when the corresponding sliders are  changed
		var scaleXEvent = function(value){
			scaleX = value;
			dom.byId("scaleXValue").innerHTML = value;
			update();
		};

		var scaleYEvent = function(value){
			scaleY = value;
			dom.byId("scaleYValue").innerHTML = value;
			update();
		};

		var offsetXEvent = function(value){
			offsetX = value;
			dom.byId("offsetXValue").innerHTML = value;
			update();
		};

		var offsetYEvent = function(value){
			offsetY = value;
			dom.byId("offsetYValue").innerHTML = value;
			update();
		};

		// Function called when the mouse goes down
		var _init = null;
		var onMouseDown = function(e){
			console.warn("mousedown");
			_init = {x: e.clientX, y: e.clientY, ox: offsetX, oy: offsetY};
			baseEvent.stop(e);
		};

		// Function called when the mouse is released
		var onMouseUp = function(e){
			if(_init){
				// Clears the click/drag, updates the chart
				console.warn("mouseup");
				_init = null;
				reflect();
				baseEvent.stop(e);
			}
		};

		// Create the base chart
		chart = new Chart("chart");
		chart.setTheme(Claro);
		chart.addAxis("x", {fixLower: "minor", natural: true, stroke: "grey",
			majorTick: {stroke: "black", length: 4}, minorTick: {stroke: "gray", length: 2}});
		chart.addAxis("y", {vertical: true, min: 0, max: 30, majorTickStep: 5, minorTickStep: 1, stroke: "grey",
			majorTick: {stroke: "black", length: 4}, minorTick: {stroke: "gray", length: 2}});
		chart.addPlot("default", {type: "Areas", animate: {duration: 1800}});
		chart.addSeries("Series A", [0, 25, 5, 20, 10, 15, 5, 20, 0, 25]);
		chart.addAxis("x2", {fixLower: "minor", natural: true, leftBottom: false, stroke: "grey",
			majorTick: {stroke: "black", length: 4}, minorTick: {stroke: "gray", length: 2}});
		chart.addAxis("y2", {vertical: true, min: 0, max: 20, leftBottom: false, stroke: "grey",
			majorTick: {stroke: "black", length: 4}, minorTick: {stroke: "gray", length: 2}});
		chart.addPlot("plot2", {type: "Areas", hAxis: "x2", vAxis: "y2", animate: {duration: 1800}});
		chart.addSeries("Series B", [15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 15], {plot: "plot2"});
		chart.addPlot("grid", { type: "Grid", hMinorLines: true });
		chart.render();

		parser.parse();

		// Add change events to the sliders to know when chart changes should be triggered
	    registry.byId("scaleXSlider").on("Change", scaleXEvent, true);
	    registry.byId("scaleYSlider").on("Change", scaleYEvent, true);
	    registry.byId("offsetXSlider").on("Change", offsetXEvent, true);
	    registry.byId("offsetYSlider").on("Change", offsetYEvent, true);

		// Add mouse events to the chart to allow click and drag
		var chartNode = dom.byId("chart");
	    on(chartNode, "mousedown", onMouseDown);
	    on(chartNode, "mouseup",   onMouseUp);
	});
</script>

<!-- create the sliders to control chart scale and offsets -->
<table>
	<tr><td align="center" class="pad">Scale X (<span id="scaleXValue">1</span>)</td></tr>
	<tr><td>
		<div id="scaleXSlider" data-dojo-type="dijit/form/HorizontalSlider" data-dojo-props="
				value: 1, minimum: 1, maximum: 5, discreteValues: 5, showButtons: false"
				style="width: 600px;">
			<div data-dojo-type="dijit/form/HorizontalRule" data-dojo-props="
				container: 'bottomDecoration', count: 5" style="height:5px;"></div>
			<div data-dojo-type="dijit/form/HorizontalRuleLabels" data-dojo-props="
				container: 'bottomDecoration', count: 5, minimum: 1, maximum: 5, constraints: {pattern: '##'}" style="height:1.2em;font-size:75%;color:gray;"></div>
		</div>
	</td></tr>
	<tr><td align="center" class="pad">Scale Y (<span id="scaleYValue">1</span>)</td></tr>
	<tr><td>
		<div id="scaleYSlider" data-dojo-type="dijit/form/HorizontalSlider" data-dojo-props="
				value: 1, minimum: 1, maximum: 5, discreteValues: 5, showButtons: false"
				style="width: 600px;">
			<div data-dojo-type="dijit/form/HorizontalRule" data-dojo-props="
				container: 'bottomDecoration', count: 5" style="height:5px;"></div>
			<div data-dojo-type="dijit/form/HorizontalRuleLabels" data-dojo-props="
				container: 'bottomDecoration', count: 5, minimum: 1, maximum: 5, constraints: {pattern: '##'}" style="height:1.2em;font-size:75%;color:gray;"></div>
		</div>
	</td></tr>
	<tr><td align="center" class="pad">Offset X (<span id="offsetXValue">0</span>)</td></tr>
	<tr><td>
		<div id="offsetXSlider" data-dojo-type="dijit/form/HorizontalSlider" data-dojo-props="
				value: 1, minimum: 0, maximum: 500, discreteValues: 501, showButtons: false"
				style="width: 600px;">
			<div data-dojo-type="dijit/form/HorizontalRule" data-dojo-props="
				container: 'bottomDecoration', count: 6" style="height:5px;"></div>
			<div data-dojo-type="dijit/form/HorizontalRuleLabels" data-dojo-props="
				container: 'bottomDecoration', count: 6, minimum: 0, maximum: 500, constraints: {pattern: '####'}" style="height:1.2em;font-size:75%;color:gray;"></div>
		</div>
	</td></tr>
	<tr><td align="center" class="pad">Offset Y (<span id="offsetYValue">0</span>)</td></tr>
	<tr><td>
		<div id="offsetYSlider" data-dojo-type="dijit/form/HorizontalSlider" data-dojo-props="
				value: 1, minimum: 0, maximum: 500, discreteValues: 501, showButtons: false"
				style="width: 600px;">
			<div data-dojo-type="dijit/form/HorizontalRule" data-dojo-props="
				container: 'bottomDecoration', count: 6" style="height:5px;"></div>
			<div data-dojo-type="dijit/form/HorizontalRuleLabels" data-dojo-props="
				container: 'bottomDecoration', count: 6, minimum: 0, maximum: 500, constraints: {pattern: '####'}" style="height:1.2em;font-size:75%;color:gray;"></div>
		</div>
	</td></tr>
</table><br /><br />

<!-- the chart node -->
<div id="chart" style="width: 800px; height: 400px;"></div>
```

[View Demo](demo/zooming-scrolling-panning.html)

### dojox/charting Events

Event connections within all interactive interfaces are important.  It's important that they are effectively and efficiently relayed, as well as plainly available.  With those goals in mind, an API by which developers can connect and respond to user-triggered events has been created.

Event listeners are assigned to specific plots on a given chart with the `connectToPlot` method:

```js
// Connect an event to the "default" plot
chart.connectToPlot("default", function(evt) {
	// Use console to output information about the event
	console.info("Chart event on default plot!",evt);
	console.info("Event type is: ",evt.type);
	console.info("The element clicked was: ",evt.element);
});
```

The connectToPlot's `event` object is very different from a traditional DOM event.  This event object contains the following key properties:

* **type** - The type of event (`onclick`, `onmouseover`, or `onmouseleave`)
* **element** - The type of element hovered (`marker`, `bar`, `column`, `circle`, `slice`)
* **x** - The `x` value of the point
* **y** - The `y` value of the point
* **shape** - The gfx shape object that represents a data point

A full listing of event properties can be found at the [dojox/charting reference guide](/reference-guide/1.10/dojox/charting.html#chart-events).

The plugins covered within the [basic charting tutorial](../charting/) use charting event solutions to trigger movement in shapes.

#### Example: Using Chart Events

This example illustrates using charting events to change the color pie piece when hovered over, and rotate the piece 360 degrees when clicked:

```js
// Require the basic 2d chart resource: Chart
// Retrieve the Tooltip class
// Require the theme of our choosing
require(["dojox/charting/Chart", "dojox/charting/action2d/Tooltip", "dojox/charting/themes/Claro", "dojox/charting/plot2d/Pie", "dojox/charting/axis2d/Default", "dojo/domReady!"], function(Chart, Tooltip, Claro) {

	// Define the data
	var chartData = [10000,9200,11811,12000,7662,13887,14200,12222,12000,10009,11288,12099];

	// Create the chart within it's "holding" node
	var chart = new Chart("chartNode");

	// Set the theme
	chart.setTheme(Claro);

	// Add the only/default plot
	chart.addPlot("default", {
		type: "Pie",
		markers: true
	});

	// Add axes
	chart.addAxis("x");
	chart.addAxis("y", { min: 5000, max: 30000, vertical: true, fixLower: "major", fixUpper: "major" });

	// Add the series of data
	chart.addSeries("Monthly Sales - 2010", chartData);

	// Create the tooltip
	var tip = new Tooltip(chart, "default");

	// Render the chart!
	chart.render();

	// Add a mouseover event to the plot
	chart.connectToPlot("default",function(evt) {
		// Output some debug information to the console
		console.warn(evt.type," on element ",evt.element," with shape ",evt.shape);
		// Get access to the shape and type
		var shape = evt.shape, type = evt.type;
		// React to click event
		if(type == "onclick") {
			// Update its fill
			var rotateFx = new gfxFx.animateTransform({
				duration: 1200,
				shape: shape,
				transform: [
					{ name: "rotategAt", start: [0,240,240], end: [360,240,240] }
				]
			}).play();
		}
		// If it's a mouseover event
		else if(type == "onmouseover") {
			// Store the original color
			if(!shape.originalFill) {
				shape.originalFill = shape.fillStyle;
			}
			// Set the fill color to pink
			shape.setFill("pink");
		}
		// If it's a mouseout event
		else if(type == "onmouseout") {
			// Set the fill the original fill
			shape.setFill(shape.originalFill);
		}

	});

});
```

[View Demo](demo/chart-events.html)

It's important to realize that every element within a chart is just a GFX graphic, so elements of the chart may be treated and animated as such, allowing for us to create some unique effects.

### Conclusion

Creating basic Dojo charts isn't always enough.  Dynamic data calls for dynamic charts, and the Dojo Toolkit's `dojox/charting` library provides all the tools to make your charts as flexible as your data.

### dojox/charting Resources

Looking for more detail about Dojo's charting library?  Check out these great resources:

* [dojox/charting Reference Guide](/reference-guide/1.10/dojox/charting.html)
* [Theme Preview](http://download.dojotoolkit.org/release-1.10.3/dojo-release-1.10.3/dojox/charting/tests/theme_preview.html)
* [GFX Animation Examples](http://www.sitepen.com/labs/code/london-ajax/london-ajax.html)