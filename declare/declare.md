## Classy JavaScript with dojo/_base/declare

The `dojo/_base/declare` module is the foundation of class creation within the Dojo Toolkit.  `declare` allows for multiple inheritance to allow developers to create flexible code and avoid writing the same code routines.  Dojo, Dijit, and Dojox modules all use `declare`; in this tutorial, you'll learn why you should too.

</p>

*   <span>Difficulty:</span> Beginner
*   <span>Dojo Version:</span> 1.10


### Getting Started

Make sure you have reviewed the concepts presented in the [modules tutorial](../modules).

<!-- Basic dojo.declare Creation -->

### Basic Dojo Class Creation with Dojo

The `declare` function is defined in the `dojo/_base/declare` module.  `declare` accepts three arguments: `className`, `superClass`, and `properties`.

#### ClassName

The `className` argument represents the name of the class, including the namespace, to be created.  Named classes are placed within the global scope. The `className` can also represent the inheritance chain via the namespace.

##### Named Class

<pre class="brush:js;">
// Create a new class named "mynamespace.MyClass"
declare("mynamespace.MyClass", null, {

	// Custom properties and methods here

});
</pre>

A class named `mynamespace.MyClass` is now globally available within the application.

Named classes should only be created if they will be used with the Dojo parser. All other classes should omit the `className` parameter.

##### "Anonymous" Class

<pre class="brush:js;">
// Create a scoped, anonymous class
var MyClass = declare(null, {

	// Custom properties and methods here

});
</pre>

The `MyClass` is now only available within its given scope.

#### SuperClass(es)

The SuperClass argument can be `null`, one existing class, or an array of existing classes.  If a new class inherits from more than one class, the first class in the list will be the base prototype, the rest will be considered "mixins".

##### Class with No Inheritance

<pre class="brush:js;">
var MyClass = declare(null, {

	// Custom properties and methods here

});
</pre>

`null` signifies that this class has no classes to inherit from.

##### Class Inheriting from Another Class

<pre class="brush:js;">
var MySubClass = declare(MyClass, {

	// MySubClass now has all of MyClass's properties and methods
	// These properties and methods override parent's

});
</pre>

The new `MySubClass` will inherit `MyClass`'s properties and methods.  A parent class' method or property can be overridden by adding its key with a new definition within the third argument, which will be explained shortly.

##### Class with Multiple Inheritance

<pre class="brush:js;">
var MyMultiSubClass = declare([
	MySubClass,
	MyOtherClass,
	MyMixinClass
],{

	// MyMultiSubClass now has all of the properties and methods from:
	// MySubClass, MyOtherClass, and MyMixinClass

});
</pre>

An array of classes signifies multiple inheritance.  Properties and methods are inherited from left to right.  The first class in the array serves as the base prototype, then the subsequent classes are mixins to that class.

If a property or method is specified in more than one inherited class, the property or method from the last inherited class is used.

#### Properties and Methods Object

The last argument of `declare` is an object containing methods and properties for the class prototype.  Properties and methods provided via this argument will override their same namesake if inherited classes have the same properties.

##### Custom Properties and Methods

<pre class="brush:js;">
// Class with custom properties and methods
var MyClass = declare(MyParentClass, {
	// Any property
	myProperty1: 12,
	// Another
	myOtherProperty: "Hello",
	// A method
	myMethod: function(){

		// Perform any functionality here

		return result;
	}
});
</pre>

#### Example:  Basic Class Creation and Inheritance

The following code creates a widget that inherits from `dijit/form/Button`:

<pre class="brush:js;">
define([
	"dojo/_base/declare",
	"dijit/form/Button"
], function(declare, Button){
	return declare("mynamespace.Button", Button, {
		label: "My Button",
		onClick: function(evt){
			console.log("I was clicked!");
			this.inherited(arguments);
		}
	});
});
</pre>

From the snippet above, it's easy to conclude:

*   The class' name is `mynamespace.Button`
*   The class may be referenced by the globally available `mynamespace.Button` or from the module's return value
*   The class inherits from `dijit/form/Button` (and thus Button's dependencies)
*   The class sets a few custom properties and methods

Let's dig deeper into class creation with Dojo by learning about the `constructor` method.

### The constructor Method

One of the special class methods is the `constructor` method.  The `constructor` method is fired upon class instantiation, executed in the scope of the new object.  This means that the `this` keyword references the instance, not the original class.  The `constructor` method also accepts any number of instance-specific arguments.

<pre class="brush:js;">
// Create a new class
var Twitter = declare(null, {
	// The default username
	username: "defaultUser",

	// The constructor
	constructor: function(args){
		declare.safeMixin(this,args);
	}
});
</pre>

Take the following instance creation:

<pre class="brush:js;">
var myInstance = new Twitter();
</pre>

The username used within this instance will be "defaultUser" since no specific settings were provided to the instance.  To leverage the `safeMixin` method, provide a username parameter:

<pre class="brush:js;">
var myInstance = new Twitter({
	username: "sitepen"
});
</pre>

Now the instance uses `sitepen` as the username setting!

`declare.safeMixin` is also useful in class creation and inheritance.  As the API docs state:

> This function is used to mix in properties like lang._mixin does, but it skips a constructor property and decorates functions like dojo/_base/declare does. It is meant to be used with classes and objects produced with dojo/_base/declare. Functions mixed in with declare.safeMixin can use this.inherited() like normal methods. This function is used to implement extend() method of a constructor produced with declare().

`declare.safeMixin` is the perfect ally when creating classes with numerous options.

### Inheritance

As stated above, inheritance is defined within the second argument of `declare`.  Classes are mixed-in from left to right with each subsequent class' properties and methods getting priority over the previous if a property has already been defined.  Take the following:

<pre class="brush:js;">
// Define class A
var A = declare(null, {
	// A few properties...
	propertyA: "Yes",
	propertyB: 2
});

// Define class B
var B = declare(A, {
	// A few properties...
	propertyA: "Maybe",
	propertyB: 1,
	propertyC: true
});

// Define class C
var C = declare([mynamespace.A, mynamespace.B], {
	// A few properties...
	propertyA: "No",
	propertyB: 99,
	propertyD: false
});
</pre>

The result of the inherited class properties is:

<pre class="brush:js;">
// Create an instance
var instance = new C();

// instance.propertyA = "No" // overridden by B, then by C
// instance.propertyB = 99 // overridden by B, then by C
// instance.propertyC = true // kept from B
// instance.propertyD = false // created by C
</pre>

It is important to have a clear understanding of prototypical inheritance. When a property is read from an object instance, the instance itself is first inspected to see if the property is defined on it. If not, the prototype chain is traversed and the value from the first object in the chain that has the property defined is returned. When a value is assigned to a property it is always on the object instance, never the prototype. The result of this is that all objects that share a common prototype will return the same value for a property defined on the prototype, unless the value has been set on the instance. This makes it easy to define default values for primitive data types (number, string, boolean) in your class declaration and update them on instance objects as needed. However, if you assign object values (Object, Array) to a property on the prototype, every instance will manipulate the same shared value. Consider the following:

<pre class="brush: js;">var MyClass = declare(null, {
	primitiveVal: 5,
	objectVal: [1, 2, 3]
});

var obj1 = new MyClass();
var obj2 = new MyClass();

// both return the same value from the prototype
obj1.primitiveVal === 5; // true
obj2.primitiveVal === 5; // true

// obj2 gets its own property (prototype remains unchanged)
obj2.primitiveVal = 10;

// obj1 still gets its value from the prototype
obj1.primitiveVal === 5; // true
obj2.primitiveVal === 10; // true

// both point to the array on the prototype,
// neither instance has its own array at this point
obj1.objectVal === obj2.objectVal; // true

// obj2 manipulates the prototype's array
obj2.objectVal.push(4);
// obj2's manipulation is reflected in obj1 since the array
// is shared by all instances from the prototype
obj1.objectVal.length === 4; // true
obj1.objectVal[3] === 4; // true

// only assignment of the property itself (not manipulation of object
// properties) creates an instance-specific property
obj2.objectVal = [];
obj1.objectVal === obj2.objectVal; // false
</pre>

To avoid inadvertently sharing arrays or objects among all instances, object properties should be declared with null values and initialized in the constructor function:

<pre class="brush: js;">declare(null, {
	// not strictly necessary, but good practice
	// for readability to declare all properties
	memberList: null,
	roomMap: null,

	constructor: function () {
		// initializing these properties with values in the constructor
		// ensures that they ready for use by other methods
		// (and are not null or undefined)
		this.memberList = [];
		this.roomMap = {};
	}
});
</pre>

Refer to the [dojo/_base/declare](/reference-guide/1.10/dojo/_base/declare.html#arrays-and-objects-as-member-variables) documentation for additional information.

#### this.inherited

While completely overriding methods is certainly useful, sometimes the constructor of each class up through the inheritance chain should be executed to preserve its original functionality.  This is where the `this.inherited(arguments)` statement comes in handy.  The `this.inherited(arguments)` statement calls the parent class' method of the same name.  Consider the following:

<pre class="brush:js;">
// Define class A
var A = declare(null, {
	myMethod: function(){
		console.log("Hello!");
	}
});

// Define class B
var B = declare(A, {
	myMethod: function(){
		// Call A's myMethod
		this.inherited(arguments); // arguments provided to A's myMethod
		console.log("World!");
	}
});

// Create an instance of B
var myB = new B();
myB.myMethod();

// Would output:
//		Hello!
//		World!
</pre>

The `this.inherited` method can be called at any time within the child class' code.  There will be some cases where you will want to call `inherited()` in the middle of the child function, or even at the end. That said, you should not call it from within the constructor.

<!-- tutorials end with a "Conclusion" block -->

### Conclusion

The `declare` function is the key to creating modular, reusable classes with the Dojo Toolkit. `declare` allows for complex class recreation with multiple inheritance and any number of properties and methods.  Better yet is that `declare` is simple to learn and will allow developers to avoid repeating code.

<!-- resources -->

### dojo/_base/declare Resources

Looking for more detail about `declare` and class creation?  Check out these great resources:

*   [dojo/declare](/reference-guide/1.10/dojo/_base/declare.html)
*   [dojo/_base/lang::mixin](/reference-guide/1.10/dojo/_base/lang.html#dojo-base-lang-mixin)
*   [Writing Your Own Widget](/reference-guide/1.10/quickstart/writingWidgets.html)