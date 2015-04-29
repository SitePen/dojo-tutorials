---
Category:  Fundamentals
...

## Making Functions with hitch and partial

The `dojo/_base/lang` resource contains helpful methods for working with functions in JavaScript.  In this tutorial, you'll learn the basics of the Function object&mdash;and how to bind contexts to functions using
`lang.hitch`.  From there, you'll learn how to bind specific _arguments_ to a function using
`lang.partial`, and how `lang.hitch` can combine the two operations.


### Getting Started

For the purposes of this tutorial, we will assume that you have basic knowledge of
Dojo Toolkit constructs such as [dojo/query](../using_query/) and other language-based
helper functions, such as Dojo's [Array helpers](../arrays/).

Before we can understand how and when to use `lang.hitch` and `lang.partial`, we must first understand the problems they solve. One of the most misunderstood concepts in JavaScript is embodied in the simple, frequently-asked question, "What is `this`"? Normally, in object-oriented programming, when one of an object's methods is invoked, we expect 'this' to be that object. The answer is more subtle in JavaScript however; to get firmly to grips with it we need to understand _execution contexts_.

#### Execution Contexts in JavaScript

Whenever a function is invoked in JavaScript, an execution context is created (see
[this article from Tuenti](http://blog.tuenti.com/dev/functions-and-execution-contexts-in-javascript-2/)
for some gruesome details).  This context is created with the following process:

*   The **arguments** object is created;
*   The function's **scope** is created;
*   **Variables** for the function are instantiated;
*   The **_this_** property (for the context itself) is created.

The **_this_** property is where most developers get confused; it is a reference
_to the object that is considered the context (or scope) of the function's invocation_.  Understanding this
(no pun intended) is the key to understanding how JavaScript works&mdash;because in JavaScript, the
actual context in which a function is executed is determined _when the function is invoked_.

<div class="proTip">

Scope is often confusing in JavaScript - on the one hand, it can mean the object under which something is invoked (or executed), and on the other it is the object under which something is defined. The latter is referred to as lexical scope, and is considered the true scope in JavaScript. Lexical scoping enables such programming techniques as [closures](http://en.wikipedia.org/wiki/Closure_(computer_science)); for reference, take a look at this [excellent article](http://www.jibbering.com/faq/notes/closures/) by Richard Cornford.

The idea of scope during invocation is known as the execution context in JavaScript
</div>

Let's take a common example.  Say we have an object, and one of the methods in that object is intended
to be used as an event handler for a number of nodes in a document.  We might define it like so:

```js
// Require the query resource, and wait until the DOM is ready
require(["dojo/query", "dojo/domReady!"],
	function(query) {

		var myObject = {
			foo: "bar",
			myHandler: function(evt){
				//	this is very contrived but will do.
				alert("The value of 'foo' is " + this.foo);
			}
		};

		//	later on in the script:
		query(".myNodes").forEach(function(node){
			node.onclick = myObject.myHandler;
		});

});
```

<a href="demo/demo.html" class="button">View Demo</a>

When someone clicks on any node with the CSS class "myNodes", you might expect the above function
definition to show a JavaScript alert box saying "The value of 'foo' is bar"; however, because of the way we
set myObject.myHandler as the event handler for each node we'll instead get **The value of 'foo' is undefined**.
Let's look at why this happens:

*   `node.onclick = myObject.myHandler`

	*	The expression `myObject.myHandler` evaluates to a function &mdash; the function `myHandler`. However, the fact that `myHandler` is a defined as a method on `myObject` is discarded.
	*	So now `node.onclick` is a reference to the function `myHandler` &mdash; just the function, no context of `myObject`.
	*	DOM event handlers run in the context of the node that triggers the event - that is, the function, regardless of how or where it was defined, is executed as if it is a method of the node &mdash; the result is that the value of `this` inside the function at run-time is the node.

<div class="proTip">

If you find that confusing, remember that the reason why is because Function objects, like any other
non-primitive type in JavaScript, are passed _by reference_ and not by value; in our example above,
we are setting the _onclick_ method of a node to be a reference directly to _myObject.myHandler_.

Remember: functions in JavaScript are _first-order objects_, and can be treated just like any
other object in JavaScript&mdash;including being passed to another function as an argument.

</div>

#### Switching execution contexts with `.apply` and `.call`

Because of the ability for JavaScript to define execution contexts when a function is invoked, the
language provides a way of changing contexts&mdash;i.e., the meaning of _this_&mdash;on the
fly through `Function.apply` and `Function.call`.  Simply put, both methods
allow you to execute a function with a passed object as its context.  For example, if we wanted
to ensure that our contrived handler above was executed in the context of _myObject_, we'd
wrap our reference using the `Function.call` method, like so:

```js
query(".myNodes").forEach(function(node){
	node.onclick = function(evt){
		myObject.myHandler.call(myObject, evt);
	};
});
```

<a href="demo/call.html" class="button">View Demo</a>
<div class="proTip">

In most examples on the Intertubes&trade;, `Function.apply` is used, and usually
passed the _arguments_ object from the outer function.  However, when the _arguments_
to a function are known in advance we recommend the use of _call_; there is a slight
performance gain when the JavaScript interpreter does not have to access the _arguments_
object directly.

We could have also called _myObject.myHandler_ directly, but used the `.call`
form to demonstrate setting the context of _myHandler_ on-the-fly.

</div>

Now that we've reviewed the basics of execution context in JavaScript, let's see how
the Dojo Toolkit simplifies this process through `lang.hitch`.

### Binding execution context with `lang.hitch`

The Dojo Toolkit provides a way of simplifying context binding with functions via the workhorse
[`lang.hitch`](/api/?qs=1.10/dojo/_base/lang).  To put it simply, `lang.hitch`
creates a _new_ Function object that is bound (or hitched, hence the name) to a specific
context, which you can then invoke safely&mdash;without ever worrying if the context has
changed.  Using `lang.hitch` is simple:

```js
// `foo` is intentionally global
var foo = "bar";
require(["dojo/_base/lang"],
	function(lang) {

		var myFunction = function(){
			return this.foo;
		};
		var myObject = { foo: "baz" };

		// later on in your application
		var boundFunction = lang.hitch(myObject, myFunction);

		// the first value will be "bar", the second will be "baz";
		// the third will still be "bar".
		myFunction();		// "bar"
		boundFunction();	// "baz"
		myFunction();		// "bar"

});
```

<a href="demo/hitch.html" class="button">View Demo</a>

As you can see, `lang.hitch` ensures that a particular function&mdash;_bound_ to
a specific execution context&mdash;will _always_ be invoked without fear of having that
context be switched at run-time.

### The _arguments_ object

Remember when we explained the process by which an execution context is created?  The very first
step is to create the _arguments_ object.  This object is an Array-like object, with an
ordered list of values that have been passed to a function.  In addition, in the third step of
creating a context all variables for the function are created&mdash;including any named arguments,
so that these values can be accessed directly by name as if they were just another variable in the
function body.

Keep in mind that the _arguments_ object is not a true Array object in JavaScript; though
it shares some of the same aspects (such as members accessible via numbers and a _length_
property), it is considered read-only&mdash;which means that none of the other Array methods
(such as `Array.prototype.slice`) are available.

When a function is defined, the _signature_ of the function becomes fixed.  One cannot add
or remove named arguments without redefining the function itself.  This can become a problem at times,
particularly when you are in need of matching a function signature (say, for a pre-defined handler in
a library such as the Dojo Toolkit) without actually copying or rewriting the original function.  The
Dojo Toolkit provides a simple way of accomplishing this through the method `lang.partial`.

### Changing function signatures with `lang.partial`

A problem a developer might face is having a function with multiple arguments
being used where a smaller set of arguments is required.  For example, say we have a function
that takes 4 arguments, like so (we'll be using `dojo/data` for the example):

```js
var putValue = function(store, item, attr, value){
	return store.setValue(item, attr, value);
}
```


...but somewhere else in your application, a different developer (or a library) has written a set of objects
that will call a similar handler with only _3_ arguments:

```js
someObject.setValueHandler = function(item, attr, value){
	//	placeholder function to be overridden
};
```


With `lang.partial`, you can create a new (unbound) function _with preset values
for arguments_ (or _bound_ arguments).  To complete our example above, we'd want to
"preset" the _store_ argument with a reference to a specific store and then set
`someObject.setValueHandler` to a reference of our _partial_ function
(hence the name), like so:

```js
// assuming we have a dojo/data store called "myStore"

// our function
var putValue = function(store, item, attr, value){
	return store.setValue(item, attr, value);
}

// ...
// their function signature
someObject.setValueHandler = function(item, attr, value){
	//	placeholder function to be overridden
};

// ...
// our solution using lang.partial
someObject.setValueHandler = lang.partial(putValue, myStore);

// ...
// somewhere in the application when setValueHandler is invoked,
// our putValue function will already have the "store" arg
// set to a reference to "myStore"
someObject.setValueHandler(someItem, "foo", "bar");
```

<a href="demo/partial.html" class="button">View Demo</a>

The above can be confusing, so let's break down what is happening:

1.  We define our putValue function to take 4 arguments;
2.  We find out that the setValueHandler was only designed to take _3_ arguments, and
(for the sake of the example) we cannot change that;
3.  We create a _new_ function out of _putValue_ that has the first
argument&mdash;_store_&mdash;**preset** to be _myStore_;
4.  The new _partial_ function is then called by other mechanisms with the
_3_ arguments passed, but our _partial_ function already has _myStore_
set to be the first argument, no matter what.

An important thing to note is that unlike `lang.hitch`, `lang.partial`
**does not preset the execution context for the returned partial function**.  In
other words, the meaning of the _this_ keyword can change, depending on how you've used
the new partial function.

One interesting technique you could do with `lang.partial`, should you be so inclined,
is to preset a reference to an object you would like access to _beforehand_ so that you
get the best of both worlds&mdash;by letting the execution context change but having a bound
reference via the function's arguments.

### Getting the best of `hitch` and `partial` together

What if you wanted the best of what `hitch` does (forcing an execution context) with
the best of what `partial` does (presetting arguments)?  Well, it turns out that
`lang.hitch` was designed to do just that&mdash;you can include any number of values
_after_ the context and method arguments, and `lang.hitch` will assemble
the new function with both a bound context and preset arguments.  Let's take a similar example
to the above:

```js
someObject.setValueHandler = lang.hitch(someObject, putValue, myStore);

// ...
// later on in the application, the setHandler is invoked
// again--this time in the context of someObject
someObject.setValueHandler(someItem, "foo", "bar");
```


`hitch` and `partial` are a gateway to a technique known as
[_functional programming_](http://en.wikipedia.org/wiki/Functional_programming);
the Dojo Toolkit offers a lot more functional programming techniques through the
[dojox/lang/functional](/api/?qs=1.10/dojox/lang/functional) namespace, which we encourage
you to take a look at.

### Conclusion

In this tutorial, we've reviewed the JavaScript Function object&mdash;including the invocation
process when a function is called. We then introduced `lang.hitch`, which allows
you to bind a function to a specific execution context.  From there, we learned how to
bind _arguments_ to a function using `lang.partial`&mdash;and then showed how
you can bind both context and arguments using `lang.hitch`.

`lang.hitch` is particularly useful with event-driven programming techniques
(i.e. callback-based programming), as it allows you to preset the execution context of
a function without fear of changing the meaning of the _this_ keyword.

Don't forget&mdash;if you ever need any help with the Dojo Toolkit, you can always
[drop into the #dojo IRC channel](/chat) on irc.freenode.net.  Don't forget
our motto for the channel: _Don't Ask To Ask, Just Ask&reg;_!