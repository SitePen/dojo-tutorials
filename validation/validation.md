## Forms and Validation

In this tutorial, you'll learn how to make use of the validation helpers in
`dojox/validate` with your Dijit-based form widgets to create customizable,
validating forms&mdash;all on the client side.

### Getting Started

`dojox/validate` is a set of utility functions for common validation tasks, such as checking
for a valid e-mail address, valid ZIP code (both the US and Canada), valid phone numbers, and more.  It was
designed for pure programmatic use&mdash;but also for use by various validation-based Dijits.  In this tutorial,
we'll look at what's available in `dojox/validate`, how to use the functionality directly, and
how to use the functionality with widgets such as `dijit/form/ValidationTextBox`.

To get started, simply `require` the validation project, like so:

```js
require(["dojox/validate"], function(validate) {

});
```

That's all there is to it to get the basic validation functionality, which includes the following methods:

```js
validate.isInRange(test, options);
validate.isNumberFormat(test, options);
validate.isText(test, options);
validate.isValidLuhn(test);
```

Each one of these methods (except for `isValidLuhn`) can take an optional keyword arguments object to
specify additional information about the check; for example, the `isNumberFormat` method takes an
object that specifies the format to check against, like so:

```js
var test = validate.isNumberFormat(someNum, { format: "(###) ###-####" });
```

It can also take an array of formats to check against, like so:

```js
var test = validate.isNumberFormat(someNum, { 
	format: ["### ##", "###-##", "## ###"] 
});
```

<!-- protip -->
> Almost all of the validation methods take different options; check the documentation in
[the API documentation tools](/api/?qs=1.10/dojox/validate) for more information
about each of the methods.

### Other Validation Methods

Obviously these 4 methods would not be enough for normal validation purposes; the `dojox/validate`
codebase also includes a number of additional validation rules that can be included in your code by
specifying the kind of validation you want to use.  The additional validation resources are:

```js
validate.creditCard
validate.isbn
validate.web
```

Unlike many of the module definitions in the Dojo Toolkit, `require`'ing these files does not
create separate objects, but attaches new methods directly to `dojox/validate`.  For instance, if
your application needs validation rules for common web-related checks, you could do something like the following:

```js
require(["dojox/validate/web"], function(validate) {
	validate.isEmailAddress(someAddress);
});
```

Finally, there are two more optional modules available that are North America-specific: `dojox/validate/us`
and `dojox/validate/ca`.  These modules each provide country-specific methods for checking for valid
phone numbers, postal codes, social insurance/security numbers, and state/provinces.

### Using `dojox/validate` with HTML-based forms

If your application uses straight-up HTML forms, `dojox/validate` has a module called
**check** that allows you to define a validation profile (based on your form structure) that you can
use to make sure all values in your form are valid.  This profile is a JavaScript object/map, and is quite
powerful&mdash;it can apply filters to field values, define a set of required values, define dependent values
(for instance, if one field relies on another), constraints on values, and "confirm" fields (for instance,
when requiring a password to be typed in twice).

To use the validation checker, you would have something like the following in your code:

```js
// Since dojox/validate/check and dojox/validate/web just extend
// dojox/validate with new methods we don't need references to them
require([
	"dojox/validate",
	"dojox/validate/check",
	"dojox/validate/web"
], function(validate) {
	var profile = {
		trim: [ "field1", "field2" ],
		required: [ "field1", "pwd", "pwd2" ],
		constraints: {
			field1: myValidationFunction,
			field2: [validate.isEmailAddress, false, true]
		},
		confirm: {
			pwd2: "pwd"
		}
	}

	//	later on in the app, probably onsubmit on the form:
	var results = validate.check(document.getElementById, profile);
});
```

The return from `dojox/validate/check` is an object with several methods on it that you can then
use to inspect any validation information on it.  The methods are as follows:

```js
isSuccessful(): Returns true if there were no invalid or missing fields, 
				else it returns false.
hasMissing():  Returns true if the results contain any missing fields.
getMissing():  Returns a list of required fields that have values missing.
isMissing(field):  Returns true if the field is required and the value is missing.
hasInvalid():  Returns true if the results contain fields with invalid data.
getInvalid():  Returns a list of fields that have invalid values.
isInvalid(field):  Returns true if the field has an invalid value.
```

The basic idea is that you perform the check, and then use the results to find out what parts of your form
are valid and what are not before letting the browser process it.  Take a look at the demo to see it in 
action!

[View Demo](demo/htmlcheck.html)

<!-- protip -->
> While `dojox/validate/check` is not well documented, there _are_ good instructions on how
the profile is constructed embedded in the comments of the source code.

### Using `dojox/validate` with Dijit-based Forms

You can also use the functions in `dojox/validate` in conjunction with Dijit form elements&mdash;
specifically Dijit's ValidationTextBox&mdash;as a way of validating your form elements.  The key to this technique
is ValidationTextBox's _validator_ method.  In your markup (or programmatically), all you need to do is
set the `validator` of your ValidationTextBox to point to a _reference_ of the function
you want to use in `dojox/validate`, like so:

```js
require(["dijit/form/ValidationTextBox", "dojox/validate/web"])
```

...and in your markup:

```html
<input id="email" name="email"
    data-dojo-type="dijit/form/ValidationTextBox"
    data-dojo-props="validator:dojox.validate.isEmailAddress,
        invalidMessage:'This is not a valid email!'"
    />
```

If you want your ValidationTextBox to use an optional keyword arguments object, just set the value of 
the `constraints` property:

```html
<input id="range" name="range"
    data-dojo-type="dijit/form/ValidationTextBox"
    data-dojo-props="validator:dojox.validate.isInRange,
        constraints:{ min:10, max:100 },
        invalidMessage:'This is not within the range of 10 to 100!'"
    />
```

Check it out!

[View Demo](demo/dijitcheck.html)

### Conclusion

As you can see, `dojox/validate` provides some very useful utilities for your web-form
based applications&mdash;both with regular HTML forms, and in conjunction with Dijit-based forms.