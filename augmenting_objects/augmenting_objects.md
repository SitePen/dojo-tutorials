---
Category:  Fundamentals
...

## Augmenting Objects

When you’re working with JavaScript, you’re working with objects. The `dojo/_base/lang` resource makes it easy to augment objects and prototypes using `lang.mixin`, `lang.extend`, and `declare.safeMixin` when using `dojo/_base/declare`.

### Getting Started

`lang.mixin`, `lang.extend`, and `declare.safeMixin` are all used to augment an original object with properties from one or more other objects. In this context, the other objects are called “mixins”. There are small differences between each of these functions that make them suitable for different use cases. Here's a quick overview of the differences before we dive in:

<table class="augmentingObjectsOverview">
	<tr>
		<th scope="row">Method:</th>
		<th scope="col">lang.mixin</th>
		<th scope="col">declare.safeMixin</th>
		<th scope="col">lang.extend</th>
	</tr>
	<tr>
		<th scope="row">Operates on</th>
		<td>object</td>
		<td>object</td>
		<td>object.prototype</td>
	</tr>
	<tr>
		<th scope="row">Mixes in `constructor` property</th>
		<td>yes</td>
		<td>no</td>
		<td>yes</td>
	</tr>
	<tr>
		<th scope="row">Mixes in multiple objects at once</th>
		<td>yes</td>
		<td>no</td>
		<td>yes</td>
	</tr>
	<tr>
		<th scope="row">Annotates functions to support `this.inherited`</th>
		<td>no</td>
		<td>yes</td>
		<td>no</td>
	</tr>
	<tr>
		<th scope="row">Speed</th>
		<td>fast</td>
		<td>slow</td>
		<td>fast</td>
	</tr>
	<tr>
		<th scope="row">Use primarily with</th>
		<td>A plain object</td>
		<td>A declare instance</td>
		<td>A constructor</td>
	</tr>
</table>

### lang.mixin

The `lang.mixin` method is a simple utility function that, given any number of objects as arguments, adds the properties of subsequent objects to the first object and returns it. For example, let's say we have an existing object to which we need to add some additional properties. This might be a collection of form data, some data for a template, a namespace object, or a settings object. In any case, without `lang.mixin`, copying over several properties might look like this:

```js
var formData = domForm.formToObject(dom.byId('form'));
formData.name = currentUser.name;
formData.phone = currentUser.phone;
formData.address = currentUser.address;
formData.city = currentUser.city;
formData.province = currentUser.province;
formData.country = currentUser.country;
formData.postalCode = currentUser.postalCode;
```

That's a lot of typing just to copy data from one object to another.
Assuming _all_ the properties in the second object were meant to be
copied to the first, `lang.mixin` makes this work much simpler:

```js
var formData = domForm.formToObject(dom.byId("form"));
lang.mixin(formData, currentUser);
```

Notice how the return value of this call was discarded.  This is because `lang.mixin` works directly on the first object passed in, so we don't need to manually update the `formData` variable at all.

`lang.mixin` can also mix in multiple objects at the same time. For example, if you had a settings object on a prototype that always needed to contain certain default values whenever a new instance was created, you could simply write it like this:

```js
var defaultSettings = {
	useTheForce: true,
	isEvil: false,
	length: 75,
	color: "blue"
};

function Lightsaber(settings){
	// `defaultSettings` is first mixed into the blank object,
	// then `settings` is mixed into the blank object, overriding
	// any properties from `defaultSettings` without altering
	// the `defaultSettings` object
	this.settings = lang.mixin({}, defaultSettings, settings);
}

var darthsaber = new Lightsaber({
	isEvil: true,
	color: "red"
});

// { useTheForce: true, isEvil: true, length: 75, color: "red" }
console.log("darthsaber:", darthsaber.settings);
```

<a href="demo/mixin.html" class="button">View Demo</a>

### declare.safeMixin

`declare.safeMixin` primarily accomplishes the same task as `lang.mixin`, with three important differences:

* It can only mix in one object at a time
* It will not mix in the `constructor` property
* It will add annotations to functions to make them function properly with `declare`'s `this.inherited` function

Despite what the name implies, there is nothing “unsafe” about the original `lang.mixin`, unless:

* You are adding functions to an instance of an object created with `declare`, _and_:
* you rely on calls to `this.inherited` within those new functions, or
* one or more of the mixins contains a `constructor` property

Thus, outside of cases involving instances of instances of `declare`d classes, `lang.mixin` is likely to be sufficient.

`declare`d constructors expose an `extend` method, which is really just an alias for calling `declare.safeMixin` with the declared constructor's prototype as the first argument.  This is not to be confused with `lang.extend`, which we will examine next.

### lang.extend

`lang.extend` is very similar to `lang.mixin`, except that it adds properties to the first object's `prototype` instead of directly on the object itself. Directly augmenting an object's prototype is useful if you want to make changes that immediately affect all inheriting instances:

```js
// Assume Lightsaber is defined as in the previous example

var darthsaber = new Lightsaber({
	isEvil: true,
	color: "red"
});

var weaponMixin = {
	hp: 5,
	maxHp: 10,
	repair: function() {
		if(this.hp >= this.maxHp) {
			console.log("Can't repair!");
			return;
		}

		this.hp++;
	},
	swing: function() {
		if(!this.hp) {
			console.log("Weapon is broken!");
			return;
		}

		this.hp--;
		console.log(Math.random() >= 0.5 ? "hit!" : "miss!");
	}
};

lang.extend(Lightsaber, weaponMixin);

// Now we can call swing() on our Lightsaber instance,
// even though we augmented the prototype after creating the instance.
darthsaber.swing(); // "hit!" (or "miss!" if you are unlucky)
```

<a href="demo/extend.html" class="button">View Demo</a>

This is much more performant than calling `lang.mixin` on every new object that is created, as it modifies one inherited object rather than several child objects. It is also faster than using `declare.safeMixin`. However, should you need to augment a `declare`d constructor with functions that respect calls to `this.inherited`, you should use `declare.safeMixin`, or the `extend` method on the constructor:

```js
var Lightsaber = declare({
	constructor: function(settings){
		this.settings = lang.mixin({}, defaultSettings, settings);
	}
});

// same augmentation, but calls to this.inherited won't break:
Lightsaber.extend(weaponMixin);
```

Note that using `lang.extend` or `declaredConstructor.extend` effectively modifies the prototype of the constructor in question, affecting _all_ created instances. Thus, it is important to limit usage of these functions to cases where you are certain this effect is appropriate, as it could otherwise produce unwanted side-effects. In particular, remember that when creating customizations of out-of-the-box components, it is recommended to create a derivative using `declare`, rather than augment the existing prototype.

It's important to note that all mixin functions perform "shallow" copies. This means that the following is true:

It is important to note that the mixin functions we have introduced perform “shallow” copies.  For example:

```js
var a = {
	name: "a",
	subObject: {
		foo: "bar"
	}
};
var b = lang.mixin({}, a);

b.name = "b";
b.subObject.foo = "baz";

console.log("a b, as expected:",
	a.name, b.name);
console.log("true - both subObjects reference the exact same object:",
	a.subObject === b.subObject);
console.log("baz baz - a change to one subObject affects both:",
	a.subObject.foo, b.subObject.foo);
```

In simple cases, this behavior is not a problem; in some cases it may even be desirable. However, in cases where you do not want objects to be shared, you can perform a “deep” copy using `lang.clone`:

```js
var a = {
	name: "a",
	subObject: {
		foo: "bar"
	}
};
var b = lang.clone(a);

b.name = "b";
b.subObject.foo = "baz";

console.log("a b, same as before:",
	a.name, b.name);
console.log("false - the subObjects are different now:",
	a.subObject === b.subObject);
console.log("bar baz - a change to one subObject no longer affects all:",
	a.subObject.foo, b.subObject.foo);
```

<a href="demo/clone.html" class="button">View Demo</a>

Keep in mind that deep copies can be _significantly_ slower than shallow copies, and will cause scripts to hang if used on recursive data structures. Deep copies should be used only when absolutely necessary.

### Conclusion

Dojo simplifies the process of creating and augmenting objects and classes. The `lang.mixin` and `declare.safeMixin` methods offer a convenient way to add and modify properties on an object, and `lang.extend` makes it easy to modify the prototype of an object. Remember, though, that these functions perform shallow copies.

<!-- resources -->

### dojo/_base/lang Resources

Looking for more detail about `lang.mixin`, `lang.extend`, `declare.safeMixin` and `lang.clone`?  Check out these great resources:

*   [lang.mixin](/reference-guide/1.10/dojo/_base/lang.html#dojo-base-lang-mixin)
*   [lang.extend](/reference-guide/1.10/dojo/_base/lang.html#dojo-base-lang-extend)
*   [lang.clone](/reference-guide/1.10/dojo/_base/lang.html#dojo-base-lang-clone)
*   [declare.safeMixin](/reference-guide/1.10/dojo/_base/declare.html#dojo-base-declare-safemixin)

<style>
.augmentingObjectsOverview th {
	text-align: left;
}
.augmentingObjectsOverview th, .augmentingObjectsOverview td {
	border-bottom: 1px solid #ccc;
	padding: 0.25em 0.5em;
	margin: 0;
	vertical-align: top;
}
</style>