## Dojo Effects

In this tutorial, we will explore the effects that Dojo provides, which allow us to jazz up your page or application!

### Getting Started

By this point, we're pretty comfortable manipulating the DOM and handling events from DOM nodes. However, as we take some of these actions, the transitions can be very abrupt: removing a node makes it disappear from the page, and that can potentially be disorienting for a user. Using some of the standard effects that Dojo provides, we can create smoother user experiences that really add an additional bit of polish and shine to our applications. Further, if we tap into Dojo's `dojo/_base/fx` and `dojo/fx` modules, we can chain and combine these effects to make some really dazzling, dynamic experiences.

<!-- protip -->
> Dojo 1.10 has two `fx` modules:  `dojo/_base/fx` and `dojo/fx`.
>   *   [`dojo/_base/fx`](/reference-guide/1.10/dojo/_base/fx.html) provides base effects methods that were found previously in Dojo base, including:
>	`animateProperty`, `anim`, `fadeIn`, and `fadeOut`.
>   *   [`dojo/fx`](/reference-guide/1.10/dojo/fx.html) provides more advanced effects, including: `chain`, `combine`, `wipeIn`, `wipeOut` and `slideTo`

### Fading

One animation you might have seen in applications you have used is a node fading in or out. This effect is so common and simple that it's included as a part of the core effects in `dojo/_base/fx`. We can use it to hide or show elements on a page in a way that feels really smooth and polished. Here's an example:

```html
<button id="fadeOutButton">Fade block out</button>
<button id="fadeInButton">Fade block in</button>

<div id="fadeTarget" class="red-block">
    A red block
</div>
<script>
    require(["dojo/_base/fx", "dojo/on", "dojo/dom", "dojo/domReady!"], function(fx, on, dom) {
        var fadeOutButton = dom.byId("fadeOutButton"),
            fadeInButton = dom.byId("fadeInButton"),
            fadeTarget = dom.byId("fadeTarget");

        on(fadeOutButton, "click", function(evt){
            fx.fadeOut({ node: fadeTarget }).play();
        });
        on(fadeInButton, "click", function(evt){
            fx.fadeIn({ node: fadeTarget }).play();
        });
    });
</script>
```

All animation functions take one argument: an object with properties. The most important property you will use is the `node` property: a DOM node or string ID of a node to animate. Another property is `duration`, which is how long the animation should last, specified in milliseconds. The `duration` defaults to 350 milliseconds. There are other properties for other animations, but fading doesn't require them.

Animation functions return a [`dojo/_base/fx::Animation`](/reference-guide/1.10/dojo/_base/fx.html#dojo-base-fx-animation) object with several methods: play, pause, stop, status, and gotoPercent. Animations are not started when they are created and must be manually started with the play method, as shown above.

[View Demo](demo/fade.html)

### Wiping

Another effect you might have seen is wiping: changing the height of a node while leaving the content alone. This makes it look like someone is using a windshield wiper on the node. Often, wiping could be a useful effect to create something like a pulldown on a page, where you might have some sort of infrequently accessed content or settings, or perhaps you just prefer the shrinking to fading.

```html
<button id="wipeOutButton">Wipe block out</button>
<button id="wipeInButton">Wipe block in</button>

<div id="wipeTarget" class="red-block wipe">
    A red block
</div>
<script>
    require(["dojo/fx", "dojo/on", "dojo/dom", "dojo/domReady!"], function(fx, on, dom) {
        var wipeOutButton = dom.byId("wipeOutButton"),
            wipeInButton = dom.byId("wipeInButton"),
            wipeTarget = dom.byId("wipeTarget");

        on(wipeOutButton, "click", function(evt){
            fx.wipeOut({ node: wipeTarget }).play();
        });
        on(wipeInButton, "click", function(evt){
            fx.wipeIn({ node: wipeTarget }).play();
        });
    });
</script>
```

The wipe effect is in the `dojo/fx` module. In this example, we have added the "wipe" class to our target node. Because the wipe functions operate on the height of the contents of a node rather than a definite height, our "wipe" class sets the target node's height to "auto".

[View Demo](demo/wipe.html)

### Sliding

So far we've covered hiding nodes, but what if we're looking to move them around a bit? A fade or a wipe doesn't change the node's location. That's where `fx.slideTo` comes into play. Shifting a node around could be useful to create an appearance of movement or progression on a page, and `fx.slideTo` creates a smooth animation of the node in the page, moving it around by specifying the coordinates of the top and left position of the node in pixels.

```html
<button id="slideAwayButton">Slide block away</button>
<button id="slideBackButton">Slide block back</button>

<div id="slideTarget" class="red-block slide">
    A red block
</div>
<script>
    require(["dojo/fx", "dojo/on", "dojo/dom", "dojo/domReady!"], function(fx, on, dom) {
        var slideAwayButton = dom.byId("slideAwayButton"),
            slideBackButton = dom.byId("slideBackButton"),
            slideTarget = dom.byId("slideTarget");

        on(slideAwayButton, "click", function(evt){
            fx.slideTo({ node: slideTarget, left: "200", top: "200" }).play();
        });
        on(slideBackButton, "click", function(evt){
            fx.slideTo({ node: slideTarget, left: "0", top: "100" }).play();
        });
    });
</script>
```

[View Demo](demo/slide.html)

### Animation Events

As discussed previously, all of these animation methods return a [`dojo/_base/fx::Animation`](/reference-guide/1.10/dojo/_base/fx.html#dojo-base-fx-animation) object. These objects all provide not just controls to play or pause the animation, but they also provide a set of events that we can listen to, in order to perform some sorts of actions before, during, and after the animation. Two of the most important and commonly-used event handlers are `beforeBegin` and `onEnd`:

```html
<button id="slideAwayButton">Slide block away</button>
<button id="slideBackButton">Slide block back</button>

<div id="slideTarget" class="red-block slide">
    A red block
</div>
<script>
    require(["dojo/fx", "dojo/on", "dojo/dom-style", "dojo/dom", "dojo/domReady!"], function(fx, on, style, dom) {

        var slideAwayButton = dom.byId("slideAwayButton"),
            slideBackButton = dom.byId("slideBackButton"),
            slideTarget = dom.byId("slideTarget");

            on(slideAwayButton, "click", function(evt){
                // Note that we're specifying the beforeBegin as a property of the animation
                // rather than using connect. This ensures that our beforeBegin handler
                // executes before any others.
                var anim = fx.slideTo({
                    node: slideTarget,
                    left: "200",
                    top: "200",
                    beforeBegin: function(){

                        console.warn("slide target is: ", slideTarget);

                        style.set(slideTarget, {
                            left: "0px",
                            top: "100px"
                        });
                    }
                });

                // We could have also specified onEnd above alongside beforeBegin,
                // but it's just as easy to connect like so
                on(anim, "End", function(){
                    style.set(slideTarget, {
                        backgroundColor: "blue"
                    });
                }, true);

                // Don't forget to actually start the animation!
                anim.play();
            });

            on(slideBackButton, "click", function(evt){
                var anim = fx.slideTo({
                    node: slideTarget,
                    left: "0",
                    top: "100",
                    beforeBegin: function(){

                        style.set(slideTarget, {
                            left: "200px",
                            top: "200px"
                        });
                    }
                });

                on(anim, "End", function(){
                    style.set(slideTarget, {
                        backgroundColor: "red"
                    });
                }, true);

                anim.play();
            });
    });
</script>
```

You might have noticed that `beforeBegin` is being passed as a property of the arguments object. The reason for passing it in more directly is that certain animations connect to `beforeBegin` when they are created. Therefore, if you connect to `beforeBegin` after the animation is created, your handler will be executed after the animation's `beforeBegin` handler, which may not be what you want to happen. By passing your handler as a property of the arguments object, you guarantee that your handler will execute first.

[View Demo](demo/connect.html)

### Chaining

What if we want to fire animations in sequence? We could use the `End` event that we just talked about to set up the next effect, but that's not very convenient. This sort of pattern is common enough that the `dojo/fx` module gives us a couple of great convenience methods to set up effects to run in sequence or in parallel, and each method returns a new [`dojo/_base/fx::Animation`](/reference-guide/1.10/dojo/_base/fx.html#dojo-base-fx-animation) object with its own set of events and methods that represent the entire sequence. Let's first take a look at `fx.chain` to play animations one after another:

```html
<button id="slideAwayButton">Slide block away</button>
<button id="slideBackButton">Slide block back</button>

<div id="slideTarget" class="red-block slide chain">
    A red block
</div>
<script>
    require(["dojo/_base/fx", "dojo/fx", "dojo/on", "dojo/dom", "dojo/domReady!"], function(baseFx, fx, on, dom) {

        var slideAwayButton = dom.byId("slideAwayButton"),
            slideBackButton = dom.byId("slideBackButton"),
            slideTarget = dom.byId("slideTarget");

        // Set up a couple of click handlers to run our chained animations
        on(slideAwayButton, "click", function(evt){
            fx.chain([
                baseFx.fadeIn({ node: slideTarget }),
                fx.slideTo({ node: slideTarget, left: "200", top: "200" }),
                baseFx.fadeOut({ node: slideTarget })
            ]).play();
        });
        on(slideBackButton, "click", function(evt){
            fx.chain([
                baseFx.fadeIn({ node: slideTarget }),
                fx.slideTo({ node: slideTarget, left: "0", top: "100" }),
                baseFx.fadeOut({ node: slideTarget })
            ]).play();
        });
    });
</script>
```

As you can see here, we create a few effects directly inline the call to `fx.chain`, and immediately call `play` on the returned [`dojo/_base/fx::Animation`](/reference-guide/1.10/dojo/_base/fx.html#dojo-base-fx-animation) to start the chained animation. We don't start playing each individual effect within the chain: `fx.chain` handles that for us.

[View Demo](demo/chain.html)

### Combining

The second convenience method that `dojo/fx` provides is the `combine` method which will start multiple animations at the same time. The [`dojo/_base/fx::Animation`](/reference-guide/1.10/dojo/_base/fx.html#dojo-base-fx-animation) returned will fire its `onEnd` event after the animation with the longest duration finishes. Let's look at another example:

```html
<button id="slideAwayButton">Slide block away</button>
<button id="slideBackButton">Slide block back</button>

<div id="slideTarget" class="red-block slide chain">
    A red block
</div>
<script>
    require(["dojo/_base/fx", "dojo/fx", "dojo/on", "dojo/dom", "dojo/domReady!"], function(baseFx, fx, on, dom) {

        var slideAwayButton = dom.byId("slideAwayButton"),
            slideBackButton = dom.byId("slideBackButton"),
            slideTarget = dom.byId("slideTarget");

        // Set up a couple of click handlers to run our combined animations
        on(slideAwayButton, "click", function(evt){
            fx.combine([
                baseFx.fadeIn({ node: slideTarget }),
                fx.slideTo({ node: slideTarget, left: "200", top: "200" })
            ]).play();
        });
        on(slideBackButton, "click", function(evt){
            fx.combine([
                fx.slideTo({ node: slideTarget, left: "0", top: "100" }),
                baseFx.fadeOut({ node: slideTarget })
            ]).play();
        });
    });
</script>
```

In this case, rather than playing the fade and then the slideTo in sequence, they play simultaneously.

Using `fx.chain` and `fx.combine`, you can build up some fairly elaborate animation sequences. Also, given that both chain and combine return animation objects, the end results of those methods can also be chained and combined, allowing for you to build everything from very simple animations to very rich and detailed sequences.

[View Demo](demo/combine.html)

### Conclusion

Using Dojo, it's quite simple to add some flair to your pages. With the [`dojo/_base/fx`](/reference-guide/1.10/dojo/_base/fx.html) and [`dojo/fx`](/reference-guide/1.10/dojo/fx.html) modules, you can easily fade DOM nodes in and out, and with a simple require, you can bring in a lot more powerful ways to simply and easily move your nodes about or wipe them in and out, and the ability to chain and combine animations means you can quickly and easily build up a rather advanced animation.

However, what if you want to do something more advanced, like adjusting a DOM node's height but not necessarily shrinking it to zero, or perhaps adjusting a background color via animation? There's the more generalized [`fx.animateProperty`](/reference-guide/1.10/dojo/_base/fx.html#id8), which we'll be covering in the next tutorial.