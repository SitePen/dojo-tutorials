## Modern Dojo

You may have been away from Dojo for a while, or you have been struggling to keep your older Dojo 1.6 applications working under 1.10 and you find yourself not sure of what is going on.  You keep hearing talk of "AMD" and "baseless", but you aren't sure what to do or where to start.  This tutorial will help you with that.


### Getting Started

Dojo 1.7 was a significant transformation of the Dojo Toolkit towards a more modern architecture, and Dojo 1.10 continues down that path.  While it is broadly backwards compatible, in order to take full advantage of Dojo 1.10, some of the fundamental concepts have changed.  The concepts will form the basis of Dojo 2.0 and by adopting these concepts now, you can help ensure you are on the right long term path.  Also, in order to take advantage of new features directly (like `dojo/on`) you need to adopt some of these "modern" concepts.

During this tutorial I will try to explain some of the concepts that have been introduced in Dojo.  I will refer to these as "legacy" and "modern" Dojo.  I will do my best to explain how things and have changed and touch on why.  While some of the changes are fundamental and at first glance might be confusing, they are all there for good reasons to make your code be more efficient, run faster, better leverage JavaScript and make your code more maintainable.  I feel it is worth the investment of time to get to understand "modern" Dojo.

This tutorial isn't specifically a migration guide, but more of a primer for the concepts that you would likely need to consider if you are already familiar with Dojo.  Specific technical details are available in the work in progress reference guide document [Dojo 1.X to 2.0 Migration Guide](/reference-guide/1.10/releasenotes/migration-2.0.html).

### Hello New World

One of the core concepts of "modern" Dojo is that things in the global namespace are bad.  There are numerous reasons for this, but in a complex web application, the global namespace can easily become polluted with all manner of code, especially when a lot of organisations use multiple JavaScript frameworks.  I won't even mention the nefarious things that can happen from a security standpoint with people intentionally modifying the global namespace.  This means in "modern" Dojo, if you are about to access something in the global namespace **STOP** because you are doing something wrong.  While for backwards compatibility reasons the vast majority of the toolkit for the moment scopes itself globally, it shouldn't be used for new development.

<div class="proTip">If you find yourself typing `dojo.*` or `dijit.*` or `dojox.*`, something isn't right.</div>

This does mean though for developers who are used to "legacy" Dojo, just including `dojo.js` and getting a core of functionality and then requiring in a few other modules and just typing `dojo.something` to your heart's content is gone (or really should be, because while it will broadly work until 2.0, it is a BAD BAD thing).

Again, repeat after me "the global namespace is bad, the global namespace is bad, I will not use the global namespace, I will not use the global namespace".

Another core concept is that synchronous operations are slow and asynchronous ones are usually faster.  "Legacy" Dojo already had a fairly strong pedigree in asynchronous JavaScript code with the concept of `dojo.Deferred`, but in "modern" Dojo, it is best to think of everything operating asynchronously.

To strengthen the modularity of Dojo and leverage the concepts above, in 1.7 Dojo adopted the CommonJS module definition called Asynchronous Module Definition (AMD).  This meant a fundamental re-write of the Dojo module loader which is usually exposed through the `require()` and `define()` functions.  You can find full documentation of the [loader in the reference guide](/reference-guide/1.10/loader).  This has fundamentally changed the way code is structured.

Let's take for example something we would have done in "legacy":

```js
  dojo.ready(function(){
    dojo.byId("helloworld").innerHTML = "Hello World!";
  });
```

Now let's look at the modern version of this:

```js
  require(["dojo/dom", "dojo/domReady!"], function(dom){
    dom.byId("helloworld").innerHTML = "Hello New World!";
  });
```

[View Demo](demo/modern_dojo-helloworld.php)

Welcome to the brave new world.  The foundation for "modern" Dojo is the `require()` function.  It creates a closure of JavaScript code and provides it with the modules it needs to do the job as return variables passed as arguments to the function.  Typically, the first argument is an array of module IDs (MIDs) and the second is the function.  Within the closure of the `require()`, we reference the modules based on the variable name we declared in the argument.  While we could call a module anything, there are some common conventions that are used and are usually noted in the Reference Guide.

The loader, just like the legacy one, does all the heavy lifting of finding the module, loading it and managing the loaded modules.

The sharped eyed among you will notice that there is a "module" in the requirement array that doesn't have a return variable, called `dojo/domReady!`.  This is actually a loader "plugin" that is used to control the behaviour of the loader.  This one ensures that the loader waits until the DOM structure for the page is ready.  In an async world, it isn't a bright idea to assume that your DOM structure is there if you want to manipulate it, so if you are going to be doing something with the DOM in your code, make sure you include this plugin.  Since we don't use the plugin in the code, it is the standard convention to put it at the end of the array and not provide a return variable for it.

<div class="proTip">For now there is only the `dojo/domReady!` plugin, but that may not be sufficient for your code to work properly (as there are other things, like some of the a11y feature detection, that may not have run).  So, using `dojo/ready` when using things like the `dojo/parser` and Dijits is wise.</div>

You can also get a reference to a module with `require()` after that module has already loaded, by just supplying the MID as a single string argument.  This won't load the module and will throw an error if it isn't already loaded.  You won't see this coding style in the Dojo Toolkit, because we like to manage all of our dependencies centrally in the code.  But if you choose to use this alternative syntax it would look something like this:

```js
  require(["dojo/dom"], function(){
    // some code
    var dom = require("dojo/dom");
    // some more code
  });
```

<div class="proTip">The other core function in AMD is `define()` which is usually used for defining modules.  See the [Defining Modules](../modules/) tutorial for more information on how to use `define()`.</div>

### Dojo Base and Core

You might hear the term "baseless" when dealing with "modern" Dojo.  This is talking about ensuring that a module doesn't depend on any more of the "base" Dojo functionality than it needs.  In the "legacy" world, there was quite a lot of functionality in the base `dojo.js` and in fact it is still there until at least Dojo 2.0, but if you want to make sure your code is easier to migrate as well as make sure your code does what you anticipate, you should stop using `dojo.*`.  This does mean you might not know where certain parts of the namespace are now.

One of the `dojoConfig` options is `async`.  It defaults to `false` and this means all the Dojo base models are automatically loaded.  If you set it to `true` and take advantage of the asynchronous nature of the loader, these modules will not automatically be loaded.  All of this combined together makes for a more responsive and faster loading application.

In addition, Dojo is embracing EcmaScript 5 Specification, and where possible, deprecating parts of Dojo that emulated ES5 functionality and "shimming" where appropriate in order to bring ES5 functionality to non-modern browsers.  This does mean the "Dojo-way" in some situations is to not use Dojo at all.

While the Reference Guide has been updated to tell you where functionality is located now, there is a specific document that indicates where the [basic functions](/reference-guide/1.10/releasenotes/migration-2.0.html#basic-functions) are now located.

Once you get outside of the Dojo Base and Core, almost everything else would work like the following.  Where you would have done a `dojo.require()`:

```js
  dojo.require("dojo.string");

  dojo.byId("someNode").innerHTML = dojo.string.trim("  I Like Trim Strings ");
```

You would now do a `require()`:

```js
  require(["dojo/dom", "dojo/string", "dojo/domReady!"], function(dom, string){
    dom.byId("someNode").innerHTML = string.trim("  I Like Trim Strings ");
  });
```

[View Demo](demo/modern_dojo-string.php)

### Events and Advice

While `dojo.connect()` and `dojo.disconnect()` have been moved into the `dojo/_base/connect` module, "modern" Dojo should follow the pattern of using `dojo/on` for event handling and `dojo/aspect` for method advice.  There is a more in depth tutorial on [Events](../events/) available, but we will cover some of the differences here.

In "legacy" Dojo, there was no clear distinction between events and modifying method behavior, and `dojo.connect()` was used to deal with both.  Events are things that occur in relationship to an object, like for example a "click" event.  `dojo/on` deals seamlessly with native DOM events and those emitted by Dojo objects or widgets.  While advice is a concept that is part of aspect oriented programming (AOP) that add additional behavior to a join point (or method).  While many parts of Dojo mostly followed AOP the `dojo/aspect` module provides a centralized mechanism to manifest this.

In "legacy" Dojo, we might have accomplished handling of a button `onclick` event a couple of different ways:

```html
  <script>
    dojo.require("dijit.form.Button");

    myOnClick = function(evt){
      console.log("I was clicked");
    };

    dojo.connect(dojo.byId("button3"), "onclick", myOnClick);
  </script>
  <body>
    <div>
      <button id="button1" type="button" onclick="myOnClick">Button1</button>
      <button id="button2" data-dojo-type="dijit.form.Button" type="button"
        data-dojo-props="onClick: myOnClick">Button2</button>
      <button id="button3" type="button">Button3</button>
      <button id="button4" data-dojo-type="dijit.form.Button" type="button">
        <span>Button4</span>
        <script type="dojo/connect" data-dojo-event="onClick">
          console.log("I was clicked");
        </script>
    </div>
  </body>
```

In "modern" Dojo, only using `dojo/on`, you can specify your code, both programmatically and declaratively, as well as not worry about if it is the DOM event or the Dijit/widget event you are dealing with:

```html
  <script>
    require([
        "dojo/dom",
        "dojo/on",
        "dojo/parser",
        "dijit/registry",
        "dijit/form/Button",
        "dojo/domReady!"
    ], function(dom, on, parser, registry){
        var myClick = function(evt){
            console.log("I was clicked");
        };

        parser.parse();

        on(dom.byId("button1"), "click", myClick);
        on(registry.byId("button2"), "click", myClick);
    });
  </script>
  <body>
    <div>
      <button id="button1" type="button">Button1</button>
      <button id="button2" data-dojo-type="dijit/form/Button" type="button">Button2</button>
      <button id="button3" data-dojo-type="dijit/form/Button" type="button">
        <div>Button4</div>
        <script type="dojo/on" data-dojo-event="click">
          console.log("I was clicked");
        </script>
      </button>
    </div>
  </body>
```

[View Demo](demo/modern_dojo-button.php)

<div class="proTip">Notice how `dijit.byId` isn't used.  In "modern" Dojo, the `dijit/registry` is used for widgets and `registry.byId()` retrieves a reference to the widget.  Also, notice how `dojo/on` handles both the DOM node and widget events in the same way.</div>

Adding functionality to methods in a "legacy" way you might have done something like:

```js
  var callback = function(){
    // ...
  };
  var handle = dojo.connect(myInstance, "execute", callback);
  // ...
  dojo.disconnect(handle);
```

In "modern" Dojo, the `dojo/aspect` module allows you to get advice from a method and add behaviour "before", "after" or "around" another method.  Typically, if you were converting a `dojo.connect()` you would replace it with an `aspect.after()` which would look something like this:

```js
  require(["dojo/aspect"], function(aspect){
    var callback = function(){
      // ...
    };
    var handle = aspect.after(myInstance, "execute", callback);
    // ...
    handle.remove();
  });
```

<div class="proTip">Check out the reference guide for [`dojo/aspect`](/reference-guide/1.10/dojo/aspect.html) for more details as well as [David Walsh's blog on `dojo/aspect`](http://davidwalsh.name/dojo-aspect) and [SitePen's blog comparing dojo/on and dojo/aspect](http://www.sitepen.com/blog/2014/03/26/dojo-faq-what-is-the-difference-between-dojoon-and-dojoaspect/).</div>

### Topics

Another area that has undergone a bit of a revision is the "publish/subscribe" functionality in Dojo.  This has been modularized under the `dojo/topic` module and improved.

For example, the "legacy" way of doing this would be something like:

```js
  // To publish a topic
  dojo.publish("some/topic", [1, 2, 3]);

  // To subscribe to a topic
  var handle = dojo.subscribe("some/topic", context, callback);

  // And to unsubscribe from a topic
  dojo.unsubscribe(handle);
```

In "modern" Dojo, you would leverage the `dojo/topic` module and do something like:

```js
  require(["dojo/topic"], function(topic){
    // To publish a topic
    topic.publish("some/topic", 1, 2, 3);

    // To subscribe to a topic
    var handle = topic.subscribe("some/topic", function(arg1, arg2, arg3){
      // ...
    });

    // To unsubscribe from a topic
    handle.remove();
  });
```

<div class="proTip">Check out the reference guide for [`dojo/topic`](/reference-guide/1.10/dojo/topic.html) for more details.</div>

<div class="proTip">Notice how the publish arguments are not an array anymore and are simply passed on the publish.</div>

### Promises

One of the core concepts of Dojo has always been the `Deferred` class, and while the change to the "promise" architecture occurred in Dojo 1.5, it is worth discussing here.  In addition, in Dojo 1.8 and newer, the promise API was rewritten.  While it is mostly semantically the same as before, it no longer supports the "legacy" API, so if you want to use it, you will have to adopt the "modern" API.  In "legacy" Dojo you would find a `Deferred` worked like this:

```js
  function createMyDeferred(){
    var myDeferred = new dojo.Deferred();
    setTimeout(function(){
      myDeferred.callback({ success: true });
    }, 1000);
    return myDeferred;
  }

  var deferred = createMyDeferred();
  deferred.addCallback(function(data){
    console.log("Success: " + data);
  });
  deferred.addErrback(function(err){
    console.log("Error: " + err);
  });
```

Now "modern" Dojo would work like this:

```js
  require(["dojo/Deferred"], function(Deferred){
    function createMyDeferred(){
      var myDeferred = new Deferred();
      setTimeout(function(){
        myDeferred.resolve({ success: true });
      }, 1000);
      return myDeferred;
    }

    var deferred = createMyDeferred();
    deferred.then(function(data){
      console.log("Success: " + data);
    }, function(err){
      console.log("Error: " + err);
    });
  });
```

<div class="proTip">There is quite a bit more to `Deferred`s, so check out the [Getting Started with Deferreds](../deferreds/) tutorial.</div>

<div class="proTip">`dojo/DeferredList` while still there, is _deprecated_.  You will find a more robust, but similar functionality in `[dojo/promise/all](/reference-guide/1.10/dojo/promise/all.html)` and `[dojo/promise/first](/reference-guide/1.10/dojo/promise/first.html)`.</div>

### Requests

One of the core fundamentals of any JavaScript library is the concept of Ajax.  For Dojo 1.8 and newer, this basic building block API was refreshed, made to run cross platform, be easily extensible and promote re-use of code.  Previously, you would have to juggle between XHR, Script and IFrame IO communication, as well as often handle any exotic data returns yourself.  `dojo/request` was introduced to help make that whole process easier.

Just like `dojo/promise` the old implementations are still there, but you can easily re-factor your code to take advantage of the new.  For example, in "legacy" Dojo you might have written something like this:

```js
  dojo.xhrGet({
    url: "something.json",
    handleAs: "json",
    load: function(response){
      console.log("response:", response);
    },
    error: function(err){
      console.log("error:", err);
    }
  });
```

In "modern" Dojo, you would write the above like this:

```js
  require(["dojo/request"], function(request){
    request.get("something.json", {
      handleAs: "json"
    }).then(function(response){
      console.log("response:", response);
    }, function(err){
      console.log("error:", err);
    });
  });
```

<div class="proTip">`dojo/request` will load the most appropriate request handler for your platform, which for a browser is XHR.  The code above could easily be code running on NodeJS and you wouldn't need to change anything.</div>

This also is a very broad topic, to checkout the [Ajax with dojo/request](../ajax/) tutorial.

### DOM Manipulation

You might be seeing a trend here if you have gotten this far in the tutorial, in that not only has Dojo abandoned its dependency on the global namespace and adopted some new patterns, it has also broken out some of "core" functionality into modules and what is more core to a JavaScript toolkit than DOM manipulation.

Well, that too has been broken up into much smaller chunks and modularized.  Here is summary of the modules and what they contain:

<table class="info">
  <thead>
    <tr><th>Module</th><th>Description</th><th>Contains</th></tr>
  </thead>
  <tbody>
    <tr><td>dojo/dom</td><td>Core DOM functions</td><td>byId()
isDescendant()
setSelectable()</td></tr>
    <tr><td>dojo/dom-attr</td><td>DOM attribute functions</td><td>has()
get()
set()
remove()
getNodeProp()</td></tr>
    <tr><td>dojo/dom-class</td><td>DOM class functions</td><td>contains()
add()
remove()
replace()
toggle()</td></tr>
    <tr><td>dojo/dom-construct</td><td>DOM construction functions</td><td>toDom()
place()
create()
empty()
destroy()</td></tr>
    <tr><td>dojo/dom-form</td><td>Form handling functions</td><td>fieldToObject()
toObject()
toQuery()
toJson()
</td></tr>
    <tr><td>dojo/io-query</td><td>String processing functions</td><td>objectToQuery()
queryToObject()</td></tr>
    <tr><td>dojo/dom-geometry</td><td>DOM geometry related functions</td><td>position()
getMarginBox()
setMarginBox()
getContentBox()
setContentSize()
getPadExtents()
getBorderExtents()
getPadBorderExtents()
getMarginExtents()
isBodyLtr()
docScroll()
fixIeBiDiScrollLeft()</td></tr>
    <tr><td>dojo/dom-prop</td><td>DOM property functions</td><td>get()
set()</td></tr>
    <tr><td>dojo/dom-style</td><td>DOM style functions</td><td>getComputedStyle()
get()
set()</td></tr>
  </tbody>
</table>

One of the things that is a consistent pattern across the "modern" Dojo toolkit is the separation of logic around accessors, in that instead of something like:

```js
  var node = dojo.byId("someNode");

  // Retrieves the value of the "value" DOM attribute
  var value = dojo.attr(node, "value");

  // Sets the value of the "value" DOM attribute
  dojo.attr(node, "value", "something");
```

Where the same function does two wholly different things depending on the arguments, versus something like this:

```js
  require(["dojo/dom", "dojo/dom-attr"], function(dom, domAttr){
    var node = dom.byId("someNode");

    // Retrieves the value of the "value" DOM attribute
    var value = domAttr.get(node, "value");

    // Sets the value of the "value" DOM attribute
    domAttr.set(node, "value", "something");
  });
```

In the "modern" example, it is very clear what you are doing in the code and it becomes more difficult for your code to do something you didn't intend, because of an extra or missing argument.  This separation of accessors is consistent throughout "modern" Dojo.

### DataStores versus Stores

In Dojo 1.6, the new `dojo/store` API was introduced and the `dojo/data` API was deprecated.  While the `dojo/data` datastores and `dojox/data` datastores are being maintained at least until Dojo 2.0, it is best to migrate to the new API when possible.  This tutorial cannot be exhaustive on the subject, but there is the [Dojo Object Store](../intro_dojo_store/) tutorial available for further information.

<div class="proTip">There is also the [`dojo/store`](/reference-guide/1.10/dojo/store.html) reference guide as well for detailed information on the API.</div>

### Dijit and Widgets

Dijit has also transformed itself in the "modern" world, but a lot of the changes have been in the underpinnings of the toolkit, with functionality being broken out into discrete building blocks and being combined together to make more complex functionality.  If you are creating a custom widget, you should read the [Creating a custom widget](../recipes/custom_widget) tutorial.

If you are just developing with dijits or other widgets, then there were a few core concepts that were introduced with the `dojo/Stateful` and `dojo/Evented` classes.

`dojo/Stateful` provides discrete accessors for widget attributes as well as the ability to "watch" changes to these attributes.  For example, you can do the following:

```js
  require(["dijit/form/Button", "dojo/domReady!"], function(Button){
    var button = new Button({
      label: "A label"
    }, "someNode");

    // Sets up a watch on button.label
    var handle = button.watch("label", function(attr, oldValue, newValue){
      console.log("button." + attr + " changed from '" + oldValue + "' to '" + newValue + "'");
    });

    // Gets the current label
    var label = button.get("label");
    console.log("button's current label: " + label);

    // This changes the value and should call the watch
    button.set("label", "A different label");

    // This will stop watching button.label
    handle.unwatch();

    button.set("label", "Even more different");
  });
```

[View Demo](demo/modern_dojo-watch.php)

`dojo/Evented` provides `emit()` and `on()` functionality for classes and this is incorporated into Dijits and widgets.  In particular, it is "modern" to use `widget.on()` to set your event handling.  For example, you can do the following:

```js
  require(["dijit/form/Button", "dojo/domReady!"], function(Button){
    var button = new Button({
      label: "Click Me!"
    }, "someNode");

    // Sets the event handling for the button
    button.on("click", function(e){
      console.log("I was clicked!", e);
    });
  });
```

[View Demo](demo/modern_dojo-on.php)

### Parser

Finally, there is the `dojo/parser`.  Dojo has had strength in both a programmatic and declarative markup way, with the `dojo/parser` handling the interpretation of the declarative markup and converting that into instantiated objects and widgets.  All of the "modern" thinking mentioned above has had an impact on the `dojo/parser` as well as there has been some "modern" changes of its own.

While the `parseOnLoad: true` Dojo configuration is still supported, it usually makes more sense to invoke the parser explicitly.  For example:

```js
    require(["dojo/parser", "dojo/domReady!"], function(parser){
        parser.parse();
    });
```

One of the other "big" changes with the parser is that it supports HTML5 compliant attributes to markup the nodes.  This allows your marked-up HTML to be valid in HTML5.  In particular `dojoType` changes to `data-dojo-type` and instead of specifying object parameters as non-valid HTML/XHTML attributes, all parameters to be passed to the object constructor are specified in the `data-dojo-props` attribute.  For example:

```html
  <button data-dojo-type="dijit/form/Button" tabIndex=2
      data-dojo-props="iconClass: 'checkmark'">OK</button>
```

<div class="proTip">Dojo supports using the Module ID (MID) in `data-dojo-type`.  For example `dojoType="dijit.form.Button"` becomes `data-dojo-type="dijit/form/Button"`.</div>

With the changes mentioned above in regards to the concepts introduced with `dojo/Evented` and `dojo/Stateful` the parser has kept pace with the declarative scripting and added appropriate script types to replicate the "watch" and "on" functionality.  For example, you can now do:

```html
  <button data-dojo-type="dijit/form/Button" type="button">
    <span>Click</span>
    <script type="dojo/on" data-dojo-event="click" data-dojo-args="e">
      console.log("I was clicked!", e);
      this.set("label", "Clicked!");
    </script>
    <script type="dojo/watch" data-dojo-prop="label" data-dojo-args="prop, oldValue, newValue">
      console.log("button: " + prop + " changed from '" + oldValue + "' to '" + newValue + "'");
    </script>
  </button>
```

[View Demo](demo/modern_dojo-parser.php)


In addition, the parser also supports the concepts introduced with `dojo/aspect` and you can provide code for "before", "after" and "around" advice.  See [dojo/parser](/reference-guide/1.10/dojo/parser.html#changing-the-behavior-of-a-method) reference guide for more information about this.

<div class="proTip">The `dojo/parser` also supports auto-requring in modules.  This means you don't necessairly have to require in the module before invoking the require.  If you set `isDebug` to `true` though, it will warn you if you are requiring modules this way.</div>

### Builder

<p>The final area to briefly touch on in this tutorial is the Dojo builder.  In Dojo 1.7 it was completely rewritten.  Partly it was to handle the significant changes with AMD, but it was also designed to modernize it and make it very feature rich.  It is a topic too vast for this tutorial.  You should read the [Creating Builds](../build/) tutorial for information, but be prepared to forget everything you knew about the old builder in order to embrace the "modern" builder.

### Conclusion

Hopefully your journey into the "modern" world of Dojo has been interesting.  While it takes a while for anyone familiar with the "legacy" world to start thinking the "Dojo way" in the new world, once you have made the move, it will be hard to go back and you will find you have more structured approach to your applications.

When all else fails, remember the "modern" Dojo way is:

*   **Granular Dependencies and Modular** &mdash; only require what you need when you need it.  Say goodbye to the "kitchen sink".  It makes for faster/smarter/safer apps.
*   **Asynchronous** &mdash; things do not necessarily happen in order, plan for code to operate asynchronously.
*   **Global Scope is Bad** &mdash; one more time, repeat after me, "I will not use the global scope."
*   **Discrete Accessors** &mdash; a function only does one thing, especially when it comes to accessors.  There is a `get()` and a `set()` for what you want to do.
*   **Dojo complements ES5** &mdash; if EcmaScript 5 does something (and it is "shimmable") then Dojo doesn't want to do it.
*   **Events and Advice, not Connections** &mdash; Dojo is migrating away from "generic" connections to focus on events and aspect oriented programming.
*   **The Builder is a Different Beast** &mdash; it is much stronger, more powerful and feature rich, but it will only go to highlight bad design assumptions in "legacy" applications, not fix them.

Good luck!