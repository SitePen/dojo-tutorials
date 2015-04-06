---
Category:  DOM Basics
...

## Animation

In this tutorial, you will learn how to use Dojo to create and combine effects for customized animation of elements on the page.

### Getting Started

Web UIs, like all graphical user interfaces, need to maintain the illusion that all these pixels and buttons are connected to real things we can manipulate. Our brains can suspend disbelief and function efficiently with digital, virtual experiences as long as that illusion exists. The illusion can break down when transitions between changes are abrupt. Animating transitions helps UI to feel more natural and intuitive and can be used to subtly or not so subtly draw attention to changes on the page.

Or, to put it another way: you need more cowbell!

In this tutorial we'll learn more about the animation tools Dojo provides, to allow you to tweak and build custom animations to fit your specific UI requirements.

### Effects Recap

We've discussed some of the built-in, commonly used [effects available in Dojo](../effects/) in a previous tutorial. We can fade elements with `baseFx.fadeIn` and `baseFx.fadeOut` (both from the `dojo/_base/fx` modules), and we've got `fx.slideTo` and `fx.wipeIn` not far away in the `dojo/fx` module. We've already seen how you can pass a parameter object to these functions, with a node property to indicate what we want to animate:

```js
require(["dojo/fx", "dojo/dom", "dojo/domReady!"], function(fx, dom) {
	fx.wipeIn({
		node: dom.byId("wipeTarget")
	}).play();
});
```

But elements have countless properties with unit values that we could potentially animate. Suppose we wanted to flash the background, or move the node around on the screen? For that we need Dojo's generic animation utility, `baseFx.animateProperty`.

### Animating Properties

If you were to look at the source code to `fx.wipeIn`, you would see that basically the style.height property of the node is being changed from 0 to its auto or natural height. To see how we can create animations of arbitrary properties, we're going to animate the border of a node. Here's the markup we'll be working with:

```html
<button id="startButton">Grow Borders</button>
<button id="reverseButton">Shrink Borders</button>

<div id="anim8target" class="box" style="border-style:outset">
	<div class="innerBox">A box</div>
</div>
```

The `animateProperty` method follows the same pattern we've used already. It's specifically the `border-width` property we want to animate, so our call to animateProperty looks like this:

```js
require(["dojo/_base/fx", "dojo/dom", "dojo/domReady!"], function(baseFx, dom) {
	baseFx.animateProperty({
		node: dom.byId("anim8target"),
		properties: { borderWidth: 100 }
	}).play();
});
```

Notice that we use the JavaScript lower camelCase property name `borderWidth`, not the hyphenated CSS `border-width` property name. We're still passing in a node property, but this time we're using a new '`properties`' key to specify what it is we want to animate.

[View Demo](demo/animateBorder.html)

That same principal works for all properties that can have numeric values, and we can specify as many as we like. In this example, we'll animate top, left and opacity at the same time, to have the element drop out and fade away to the left. By providing specific `start` and `end` properties for each, we can make very specific, repeatable animations.

```js
baseFx.animateProperty({
	node: anim8target,
	properties: {
		top: { start: 25, end: 150 },
		left: 0,
		opacity: { start: 1, end: 0 }
	},
	duration: 800
}).play();
```

Notice that we've also provided a `duration` property. This is the number of milliseconds the whole animation should take, and in this case it gives us a bit more time to see what's going on.

[View Demo](demo/animateProperties.html)

### Easing

If we were to plot the values our animation generates, we would see a curve from the start value to the end value over time. The shape of this curve is referred to as "easing".
The most simple "curve" is a straight line - the node, for example, moves at an even speed from x:0 to y:100. But movements look more natural when they start slow, speed up and then slow down again right at the end.
The default works in most places, but Dojo provides a wide range of easing functions to get the right effect and feel. The `dojo/fx/easing` module has several easing curves we can load:

```js
require(["dojo/_base/fx", "dojo/dom", "dojo/fx/easing", "dojo/window", "dojo/on", "dojo/domReady!"], function(baseFx, dom, easing, win, on) {
	var dropButton = dom.byId("dropButton"),
		ariseSirButton = dom.byId("ariseSirButton"),
		anim8target = dom.byId("anim8target");

	// Set up a couple of click handlers to run our animations
	on(dropButton, "click", function(evt){
		// get the dimensions of our viewport
		var viewport = win.getBox(win.doc);
		baseFx.animateProperty({
			// use the bounceOut easing routine to have the box accelerate
			// and then bounce back a little before stopping
	        easing: easing.bounceOut,
	        duration: 500,
			node: anim8target,
			properties: {
				// calculate the 'floor'
				// and subtract the height of the node to get the distance from top we need
				top: { start: 0, end:viewport.h - anim8target.offsetHeight }
			}
		}).play();
	});
	on(ariseSirButton, "click", function(evt){
		baseFx.animateProperty({
			node: anim8target,
			properties: { top: 0 }
		}).play();
	});
});
```

In this example, we're calculating the viewport height so we can position the box to appear to sit at the bottom. By using the bounceOut easing function, it reaches the value for that floor, then winds it back up a bit, before settling back to the final value.
Notice also that the top property is an object with `start` and `end` properties, which lets us be very specific about the range of values we want to animate over for each style property.

[View Demo](demo/easing.html)

Almost all of the easings have names that end in either "In" or "Out" — or both, as "InOut". The name implies whether the easing is going to affect the beginning (In), ending (Out), or both ends (InOut) of the animation. Be sure to check out [the dojo/fx/easing Reference Guide](/reference-guide/1.10/dojo/fx/easing.html) for more detail.

### Putting it Together

Traditional animation software typically uses a timeline to model what is changing over what period, and it's normal to have things moving simultaneously, as well as one after the other. As we've seen in the earlier Effects tutorial, Dojo provides a mechanism for each: `fx.combine` and `fx.chain`. Let's see how to put the pieces together.

For this demo, the setup is that we have two boxes of content which we want to swap. To highlight the change we'll also fade out the background color behind them. Here's the markup we'll be working with:

```html
<button id="swapButton">Swap</button>

<div class="container" id="container">
	<div id="content1" class="contentBox" style="top: 0; left: 0">
		<div class="innerBox">1: Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</div>
	</div>
	<div id="content2" class="contentBox" style="top: 0; left: 250px">
		<div class="innerBox">2: Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>
	</div>
</div>
```

As usual, we load Dojo, require the desired modules, and do our initialization inside a function we pass to `require`.

```html
<script src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js"
		data-dojo-config="isDebug: true, async: true">
<script>

require(["dojo/_base/fx", "dojo/fx", "dojo/fx/easing", "dojo/dom-style", "dojo/dom", "dojo/on", "dojo/aspect", "dojo/domReady!"], function(baseFx, fx, easing, domStyle, dom, on, aspect) {

	function swapAnim(node1, node2) {
		// create & return animation which swaps the positions of 2 nodes
	}

	var originalOrder = true; // track which order our content nodes are in

	var swapButton = dom.byId("swapButton"),
		c1 = originalOrder ? dom.byId("content1") : dom.byId("content2"),
		c2 = originalOrder ? dom.byId("content2") : dom.byId("content1"),
		container = dom.byId("container");

		// Set up a click handler to run our animations
		on(swapButton, "click", function(evt){
			// pass the content nodes into swapAnim to create the node-swapping effect
			// and chain it with a background-color fade on the container
			// ensure the originalOrder bool gets togged properly for next time
		});
});
</script>
```

Being able to compose complex animations from distinct pieces is immensely useful. We've broken the animation out into separate pieces here, so we can keep the position-swapping code generic and reusable.
The implementation for the `swapAnim` function looks like this:

```js
function swapAnim(node1, node2) {
	var posn1 = parseInt(domStyle.get(node1, "left")),
		posn2 = parseInt(domStyle.get(node2, "left"));

	return moveNodes = fx.combine([
		fx.slideTo({
			duration: 1200,
			node: node2,
			left: posn1
		}),
		fx.slideTo({
			duration: 1200,
			node: node1,
			left: posn2
		})
	]);
}
```

The `slideTo` method is used to actually move each node, using the `left` style property. We might also have used `animateProperty` to similar effect. The two separate animations should run in parallel, so both nodes move at once. The `fx.combine` method accomplishes that - making one animation from two. Notice that we return the animation object just like `animateProperty` and the other Dojo methods do. It's up to the calling code to `play()` it when needed.

```js
// Set up a click handlers to run our animations
on(swapButton, "click", function(evt){

	// chain the swap nodes animation
	// with another to fade out a background color in our container
	var anim = fx.chain([
		swapAnim(c1, c2),
		baseFx.animateProperty({
			node: container,
			properties: {
				backgroundColor: "#fff"
			}
		}),

	]);
	// before the animation begins, set initial container background
	aspect.before(anim, "beforeBegin", function(){
		domStyle.set(container, "backgroundColor", "#eee");
	});

	// when the animation ends, toggle the originalOrder
	on(anim, "End", function(n1, n2){
		originalOrder = !originalOrder;
	});

	anim.play();
});
```

Here is that calling code - the click handler. As with `fx.combine` before, the array passed to `fx.chain` has two separate animations. However, we want to run these in series: the node-swap, then the background-color animation. The container's initial background-color is set by connecting to the `beforeBegin` event, and during `onEnd` we have a little bookkeeping to do, to ensure that when we click next, the nodes are reversed.

[View Demo](demo/index.html)

The resulting code is flexible, logical and easily extended. What would you need to do to have the background animation run in parallel with the swap? How about pushing back the opacity of the content as it moves to the right? As frequently happens, it turns out the hardest bit is knowing where to stop!

### Conclusion

Dojo's animation utilities give you convenience and simplicity for the common cases, yet all the control you need for specific, custom transitions and other effects. Animations can be built up from simple pieces and provide a useful set of lifecycle events to help synchronize changes.

In the real world, nothing snaps directly from one state to another, so the ability to control movement and visual change is important for creating great user experiences. In future tutorials, we'll see the same pattern across the Dojo Toolkit: make the simple things easy, and the difficult things possible.