---
Category:  Widgets
...

## Form Management with dojox/form/Manager

While there are elements within Dojo to allow for simple form validation, occasionally you may want a more powerful solution. The Dojo Toolkit offers a fantastic solution for detailed form management: `dojox/form/Manager`.

### Getting Started

A recurring problem for any form-based application is an easy way of managing all of the elements in a form, including
collecting values, validating values, and handling form resetting and submission.  More often than not, this is done
manually&mdash;which can often be time consuming and brittle.  The Dojo Toolkit offers a comprehensive solution that works
with both HTML-based forms and Dijit-based forms: `[dojox/form/Manager](/reference-guide/1.10/dojox/form/manager/)`.

#### The Problem

Traditionally, form management has always been cumbersome.  Two approaches are generally taken: either know all of the form
elements (including identifiers) beforehand and write any handling code based on this knowledge, or write a system that will
try to automatically detect all of the elements in a form and create a generic handling system for it.  The first approach,
while generally the most accurate, can become a maintenance nightmare (particularly in applications with a large number of
forms); the second approach tends to be very brittle, and ends up becoming bloated (usually due to the slow but steady addition
of business rules as time goes on).

`dojox/form/Manager` combines the best of both worlds&mdash;it allows you to simply wrap your form so that you don't
have to know each individual element (if you don't want to), but gives you the flexibility to create custom methods to handle
specific business rules.

<!-- protip -->
> The [dijit/form/Form](/reference-guide/1.10/dijit/form/Form.html) module is easy to use and provides basic functionality:
>
>	*   `get/set`: methods to retrieve or set field values
>	*   `isValid/validate`: methods to validate the field values
>	*   `submit`: method and event for submitting the form
>	*   `reset`: method and event for resetting field values
>
>	`dijit/form/Form` only has full support for Dijit form widgets (HTML form elements will still be submitted with the
>	form, but `dijit/form/Form` will not manage or interact with them). If you are working with a form that only contains
>	Dijit form widgets you may find that `dijit/form/Form` meets your needs and is easier to work with.
>
>	It can take more work to set up `dojox/form/Manager`, but it has full support for both native HTML form elements as
>	well as Dijit form widgets, and adds observer methods for responding to field changes, enable/disable functionality for the whole
>	form, and show/hide methods to set the form's visibility.

### Setting up the Manager

Setting up your form(s) to use the manager is easy: simply require the manager itself, and then set your form element
to be of type `dojox/form/Manager`, like so:

```html
<form data-dojo-type="dojox/form/Manager" id="myForm">
    ...your form elements here...
</form>

<!-- later on in your HTML document -->
<script type="text/javascript">
require(["dojo/parser", "dojox/form/Manager","dojo/domReady!"],function(parser) {
    parser.parse();
});
</script>
```

That's all for the basic setup; now you're ready to start managing your form elements.

<!-- protip -->
> Unlike most Dijit-based widgets, `dojox/form/Manager` is **not** intended to be used/created
programmatically; it's possible to do, but the design intention was to be able to apply the Manager to existing HTML
forms.  When using `dojox/form/Manager`, you should always use it _declaratively_, and make sure
you call `parser.parse()`.

#### Adding in observer hooks to your form elements

The next step in setting up your form to be managed by `dojox/form/Manager` is to add a custom attribute to
the form elements to be managed (both HTML-based and Dijit-based ones) called **data-dojo-observer**.  This custom attribute
tells the Manager what to execute, in the Manager itself, when a change is made in your form element.

The value in each _data-dojo-observer_ attribute is a comma-delimited list of methods to execute when something changes on
the form element.  For example, if we have an HTML checkbox input and we wanted to run the methods _showValues_ and
_logRadio_ when someone clicks on it, we'd set it up like so:

```html
<input type="checkbox" name="foo" data-dojo-observer="showValues, logRadio" />
<input type="text" name="txt" data-dojo-observer="showValues" data-dojo-type="dijit/form/TextBox" intermediateChanges="true">
```

This setup tells the Manager to execute both methods each time the state of the checkbox changes, and to call _showValues_ when the
value of the `dijit/form/TextBox` widget changes.  If you only have one method observing changes, then just list the
single method (no comma).  The `intermediateChanges` property can be used to fire the change event on every change
made to an input or delay the _observer_ event until after the widget has lost focus.

<!-- protip -->
> Note that `dojox/form/Manager` is **not** set up to be completely HTML 5 data-attribute compliant; you'll
be adding non-standard attributes to your form elements as we go.  This means that if HTML validation is extremely important
to you, using `dojox/form/Manager` will cause your document to fail validation.

#### Setting up your observer methods

Finally, you'll need to actually implement your observer methods.  `dojox/form/Manager` handles this using the special
_declarative script technique_ available with the `dojo/parser`; inside of your main declarative object, you'll
use script blocks to make your definitions.  The net effect of adding these script blocks is to _extend_ the instance of
the Manager with functionality specific to your form's needs.  Here's an example:

```html
<input type="checkbox" name="foo" data-dojo-observer="showValues, logRadio" />
<script type="dojo/method" data-dojo-event="showValues" data-dojo-args="value,name">
    if(name){
        console.log("name = ", name, " value = ", value);
    }
</script>
```

Let's break this down.

**The MIME type of the script block**

This is a way of telling the Dojo parser that the content that is contained within the block has special meaning.  The Dojo parser
recognizes some special values for the "type" attribute of a `script` element:

*   `dojo/method`: extend the Manager with an additional method
	<li>`dojo/on`: add an event handler to the Manager
*   `dojo/aspect`: hook into a method of the Manager using `dojo/aspect`

<!-- protip -->
> Keep in mind that when you create a script block using _type="dojo/method"_, you may be overriding any methods that already exist
on the Manager.  Using the _dojo/on_ or _dojo/aspect_ type ensures that you are not clobbering anything that already exists&mdash;but
at the same time, you are not preventing the original method from executing when called.

**The "data-dojo-event" attribute**

*   _dojo/method_: the name of the method to define
*   _dojo/on_: the name of the event to handle
*   _dojo/aspect_: the name of the method to advise

<!-- protip -->
> When defining methods using the declarative technique, don't forget that the _this_ keyword can be used, and will be
a reference to the Manager.

**The "data-dojo-args" attribute**

This is an optional attribute; but if it exists, it is the names of the parameters that will be passed to the function, in order.

**The "data-dojo-advice" attribute**

"before", "around", or "after". This one only applies to _type="dojo/aspect"_. If omitted, the default is "after".

<!-- protip -->
> When using Dojo's declarative script techniques, the script is applied to the parent object&mdash;so make sure your script blocks
are declared as direct children of the element that defines the Manager.

Our example from above, _showValues_, is a pretty typical observer with `dojox/form/Manager`.  Notice the signature
of the observer: _value_ and _name_.  The observer&mdash;when executed&mdash;will either be passed no arguments, a single value
argument, or both.  Because of this, you must account for all of these possibilities when implementing your observer methods.

### Helper methods of the Form Manager

Now that we have the basics of setting up your form management, we can tap into some of the helper methods of the Manager itself
to aid you.  There are a few basic methods to be used:

*   **gatherFormValues**: can take an array of names, a dictionary of names, or nothing.  If an array or dictionary
is passed only those elements that match in the form will be returned, otherwise all of the values in the form are collected and
returned.
*   **setFormValues**: takes a dictionary of name/value pairs, and will match the keys in the dictionary to the
corresponding form elements in your form, and set the value.
*   **isValid**: validates the form and returns true if all elements pass validation.
*   **validate**: like isValid, but also triggers display in the UI of validation messages.

<!-- protip -->
> There are quite a few other useful methods in the Manager, such as enable/disable and addClass/removeClass, that can be used
as well.  Take a look at [the documentation](//api/?qs=1.10/1.9/dojox/form/Manager) for more details.

#### Events on your form

The Manager pre-defines two events for you to override: _onReset_ and _onSubmit_.  These are self-explanatory,
but they will allow you to do any kind of special handling when either event occurs.  For example, if you wish to prevent any form
submission, you would add a `submit` handler to the form, like so:

```js
form.on("submit", function(event){
	// prevent form submission
	event.preventDefault();
	event.stopPropagation();
});
```

<!-- protip -->
> If you want your form to be "ajaxy", you can use any of Dojo's _xhr_ methods in your `onSubmit` handler; just
remember to return `false` in it to prevent the browser's normal actions.

### Let's put it all together

Now that we have a good overview of `dojox/form/Manager`, let's put it all together!

[View Demo](demo/manager.html)

### Conclusion

The `dojox/form/Manager` is a powerful tool for form management; it allows you to inspect your form
easily (including validation), get and set values in your form quickly, deal with standard form events, and a lot
more.  It allows you to mix-and-match standard HTML form elements and Dijit-based form elements quickly and easily;
in addition, it allows you to easily implement custom methods so that you can work with your standard business
rules in a clean, modular fashion.

Happy form management!