---
Category:  Widgets
...

## Dijit Menus

Dijit is a powerful framework for allowing us to create very clean, professional-looking interfaces. Sometimes, that means that we need a desktop-like experience with a menu of options. With dijit/Menu, we have a very powerful yet easy-to-use tool to create these interfaces.

### Introduction

Option menus are a familiar concept in any graphical user interface.
They come in different shapes and sizes, from the horizontal menubar, to drop-down menus,
to context or right-click menus for contextual actions.
The native controls provided by HTML are limited, and simple HTML/CSS
arrangements are awkward to manage and suffer from usability and accessibility problems.
The family of `dijit/Menu*` widgets are designed to address these issues.

### Getting Started

The [dijit/Menu documentation](/reference-guide/1.10/dijit/Menu.html)
outlines the types of menus and ways to assemble them.  This and the
[API documentation](/api/?qs=1.10/dijit/Menu) are
good places to start. We'll be reviewing and expanding on those resources to
put together menus for a simple task management application.

We'll start with a rather plain `dijit/Menu`&mdash;a vertical
arrangement of menu items.  Like all Dijit widgets, `dijit/Menu` can
be used in the declarative style, where we configure the widget from our markup,
or programmatically, where we configure and create the instance explicitly in our
JavaScript code.  To get started, we'll make the simplest possible menu in
each style, with three items: edit, view, and task.

> These code examples assume you have already set up a page
to load the Dojo toolkit and the Claro theme.  You can refer to
[previous](../dialogs_tooltips/ "Dialogs & Tooltips")
[tutorials](../sliders/ "Sliders") if you need
to refresh your memory.

<div id="example1">
	<div data-dojo-type="dijit/layout/TabContainer"
		data-dojo-props="doLayout:false, 'class':'code-tabs'">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Declarative'">
	<pre class="brush: js; html-script: true;">
	&lt;body class="claro"&gt;
		&lt;div id="mainMenu" data-dojo-type="dijit/Menu"&gt;
			&lt;div id="edit" data-dojo-type="dijit/MenuItem"&gt;Edit&lt;/div&gt;
			&lt;div id="view" data-dojo-type="dijit/MenuItem"&gt;View&lt;/div&gt;
			&lt;div id="task" data-dojo-type="dijit/MenuItem"&gt;Task&lt;/div&gt;
		&lt;/div&gt;
		&lt;script&gt;
			// Require the Menu and MenuItem class, and the dojo/parser,
			// and make sure the DOM is ready
			require([
				"dijit/Menu",
				"dijit/MenuItem",
				"dojo/parser",
				"dojo/domReady!"
			], function(Menu, MenuItem, parser){
				parser.parse();
			});
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Programmatic'">
	<pre class="brush: js; html-script: true;">
	&lt;body class="claro"&gt;
		&lt;div id="mainMenu"&gt;&lt;/div&gt;

		&lt;script&gt;
			// Require the Menu and MenuItem class
			// Make sure the DOM is ready
			require([
				"dijit/Menu",
				"dijit/MenuItem",
				"dojo/domReady!"
			], function(Menu, MenuItem){
				// create the Menu container
				var menu = new Menu({}, "mainMenu");

				// create and add child item widgets
				// for each of "edit", "view", "task"
				menu.addChild(new MenuItem({
					id: "edit",
					label: "Edit"
				}));

				menu.addChild(new MenuItem({
					id: "view",
					label: "View"
				}));

				menu.addChild(new MenuItem({
					id: "task",
					label: "Task"
				}));

				menu.startup();
			});
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	</div>
</div>

[View Declarative Demo](demo/simpleDeclarativeMenu.html)

[View Programmatic Demo](demo/simpleProgMenu.html)

When using `dijit/Menu`, a menu is composed of a collection of menu items.
Each Menu is a widget instance, and each menu item is its own widget instance.
Menus contain menu items, and individual menu items can be associated with a sub-menu.
In the above examples, we have used the generic `dijit/MenuItem` widget class
to represent items in the menu. However, a list of items can include separators,
and items containing sub-menus.  Each of these special types of menu items has
its own appropriate widget class:

**`dijit/MenuItem`**
> Item in a vertical menu. Supports an optional icon (via CSS), and an
optional accelerator (shortcut) key combination.
`dijit/MenuItem` and widgets which inherit from it can be clicked
or selected from the keyboard, and support full keyboard navigation.
The item can be both visually and functionally disabled by setting the
`disabled` flag.

**`dijit/MenuBarItem`**
> A variation on `dijit/MenuItem` designed for a horizontal menu,
with the visual and accessibility changes it implies.

**`dijit/PopupMenuItem`**
> A variation on `dijit/MenuItem` which represents an item with a
sub-menu. The sub-menu can be accessed by clicking on or pausing over the item,
or via the keyboard with the arrow keys.

**`dijit/PopupMenuBarItem`**
> A horizontally-oriented version of `dijit/PopupMenuItem`.

**`dijit/MenuSeparator`**
> A non-interactive divider between items in a menu.

### Menu Structure

It is useful to correlate how we picture our menu structure,
against the internal structure `dijit/Menu` uses.
Ultimately, sub-menus are simply the `popup` property of a
`dijit/PopupMenuItem`.
When creating a menu programmatically, we assign a menu instance to the `popup`
property of an item to create menu hierarchy.
When creating a menu declaratively, the intuitive way to indicate menu hierarchy is
through element nesting. To create a menu item with a sub-menu, we can simply
nest a menu inside the menu item; the first element (typically a `<span>`)
is used as the label for the item.

<div id="example4">
	<div data-dojo-type="dijit/layout/TabContainer"
		data-dojo-props="doLayout:false, 'class':'code-tabs'">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Declarative'">
	<pre class="brush: js; html-script: true; highlight: [3,4,5]">
	&lt;body class="claro"&gt;
		&lt;div id="mainMenu" data-dojo-type="dijit/Menu"&gt;
			&lt;div id="edit" data-dojo-type="dijit/MenuItem"&gt;Edit&lt;/div&gt;
			&lt;div id="view" data-dojo-type="dijit/MenuItem"&gt;View&lt;/div&gt;
			&lt;div id="task" data-dojo-type="dijit/PopupMenuItem"&gt;
				&lt;span&gt;Task&lt;/span&gt;
				&lt;div id="taskMenu" data-dojo-type="dijit/Menu"&gt;
					&lt;div id="complete" data-dojo-type="dijit/MenuItem"&gt;
						Mark as Complete
					&lt;/div&gt;
					&lt;div id="cancel" data-dojo-type="dijit/MenuItem"&gt;
						Cancel
					&lt;/div&gt;
					&lt;div id="begin" data-dojo-type="dijit/MenuItem"&gt;
						Begin
					&lt;/div&gt;
				&lt;/div&gt;
			&lt;/div&gt;&lt;!-- end of sub-menu --&gt;
		&lt;/div&gt;
		&lt;script&gt;
			// Require dependencies
			require([
				"dijit/Menu",
				"dijit/MenuItem",
				"dijit/PopupMenuItem",
				"dojo/parser",
				"dojo/domReady!"
			], function(Menu, MenuItem, PopupMenuItem, parser){
				parser.parse();
			});
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Programmatic'">
	<pre class="brush: js; html-script: true; highlight: [49]">
	&lt;body class="claro"&gt;
		&lt;div id="mainMenu"&gt;&lt;/div&gt;
		&lt;script&gt;
			// Require dependencies
			require([
				"dijit/Menu",
				"dijit/MenuItem",
				"dijit/PopupMenuItem",
				"dojo/domReady!"
			], function(Menu, MenuItem, PopupMenuItem){
				// create the Menu container
				var mainMenu = new Menu({}, "mainMenu");

				// create Menu container and child MenuItems
				// for our sub-menu (no srcNodeRef; we will
				// add it under a PopupMenuItem)
				var taskMenu = new Menu({
					id: "taskMenu"
				});

				// define the task sub-menu items
				taskMenu.addChild(new MenuItem({
					id: "complete",
					label: "Mark as Complete"
				}) );

				taskMenu.addChild(new MenuItem({
					id: "cancel",
					label: "Cancel"
				}) );

				taskMenu.addChild(new MenuItem({
					id: "begin",
					label: "Begin"
				}) );

				// create and add main menu items
				mainMenu.addChild(new MenuItem({
					id: "edit",
					label: "Edit"
				}) );

				mainMenu.addChild(new MenuItem({
					id: "view",
					label: "View"
				}) );

				// make task menu item open the sub-menu we defined above
				mainMenu.addChild(new PopupMenuItem({
					id: "task",
					label: "Task",
					popup: taskMenu
				}) );

				mainMenu.startup();
				taskMenu.startup();
			});
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	</div>
</div>

[View Declarative Demo](demo/nestedDeclarativeMenu.html)

[View Programmatic Demo](demo/nestedProgMenu.html)

Notice that in the declarative example, the only "magic" is in
the convention where the first element in the item markup is interpreted as the
item label. The nested menu is automatically assigned as the item's `popup`.

We have already stated that a sub-menu simply ends up as the value of a menu item's
`popup` property. This means that it is quite possible to dynamically
change menu relationships, and to have multiple items reference the same
menu instance as their sub-menu.  Following the above example, we could additionally
assign `taskMenu` to be the `popup` of another
`dijit/PopupMenuItem` in a completely different portion of the UI,
for instance.

<!-- protip -->
> One task the above example does not demonstrate, but which is
certainly possible programmatically, is re-assigning a sub-menu on the fly.
To accomplish this, you can simply reset the `popup` property on the
`dijit/PopupMenuItem` in question to point to a new sub-menu.
Alternatively, you could remove/destroy the original PopupMenuItem (and the
sub-menu as well, if it is not being used elsewhere) and insert a new one
with the appropriate `popup` property value.

### Menu Accessibility

All the menu variations enjoy the same accessibility support as the rest of Dijit.
This means that the correct ARIA roles are used to allow assistive technology to
inform the user as to what type of controls they are interacting with, and
therefore how to operate it.  Keyboard accessibility is present for
low-vision, non-pointer, and/or power-users.  The Tab key moves focus
to/from the menu as a whole, and the arrow keys are used to move within
a menu and any sub-menus.

### Menu Icons

Like `dijit/form/Button` and its subclasses, instances of
`dijit/MenuItem` have an `iconClass` property.  This can be used
to add a particular CSS class into an item's template, in order to show an icon
next to the item label.  Here is a simple, out-of-context example of how to
achieve this, both declaratively and programmatically:

<div id="example5">
	<div data-dojo-type="dijit/layout/TabContainer"
		data-dojo-props="doLayout:false, 'class':'code-tabs'">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Declarative'">
	<pre class="brush: js; html-script: true;">
	&lt;div id="task"
		 data-dojo-type="dijit/MenuItem"
		 data-dojo-props="iconClass: 'taskIcon'"&gt;
		Task
	&lt;/div&gt;
	&lt;script&gt;
		// Require dependencies
		require([
			"dojo/parser",
			"dijit/MenuItem",
			"dojo/domReady!"
		], function(parser){
			parser.parse();
		});
	&lt;/script&gt;
	</pre>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Programmatic'">
	<pre class="brush:js;">
	// Require dependencies
	require([
		"dijit/MenuItem",
		"dojo/domReady!"
	], function(MenuItem){
		new MenuItem({
			id: "task",
			label: "Task",
			iconClass: "taskIcon"
		});
	});
	</pre>
	</div>
	</div>
</div>

The `iconClass` property refers to a CSS class which we would
define in our stylesheet&mdash;for example:

```css
.taskIcon {
	background: url("./icons/task.png");
	width: 24px;
	height: 24px;
}
```

[View Demo](demo/iconClass.html)

### Menu Variations

So far, we've used `dijit/Menu` as what the documentation calls
"navigation menus"&mdash;that is, statically placed on the page.
We can turn this menu into a context popup menu quite easily:

```js
require([
    "dijit/Menu",
    "dojo/domReady!"
], function(Menu){
    var mainMenu = new Menu({
        id: "mainMenu",
        contextMenuForWindow: true
    });
});
```

This gives us a context menu for the entire document. We can
configure a menu as a context menu for particular elements by passing in an
array of DOM nodes or IDs via the `targetNodeIds` property when we
create the menu, and optionally a selector parameter to only apply the
menu to certain subnodes of the nodes specified by `targetNodeIds`:

```js
require([
    "dojo/dom",
    "dijit/Menu",
    "dojo/domReady!",
    "dojo/query!css2"
], function(dom, Menu){
	var taskMenu = new Menu({
		id: "taskMenu",
		targetNodeIds: ["taskList"],
		selector: ".task"
	});
});
```

Specifying a single targetNodeId and a selector is more efficient than
specifying multiple targetNodeIds.
Also, that approach will handle new nodes (new .task nodes in this example) that are created
after the menu was created.

<!-- protip -->
> If you specify a selector, you need to include an appropriate level of dojo/query to handle your selector.

Our next demo hooks up menus as noted above, resulting in one context menu
on the document as a whole, and another context menu specific to task items.

[View Demo](demo/contextMenus.html)

In the demo, you will notice that there is also a "Task" popup menu item in the global
context menu (which reuses the same menu as the context menu for task items).
However, until you click one of the task items to "select" it,
there is no "current" item for it to apply to&mdash;for this reason, we initially disable
this menu item, and enable it when the user selects an item, by calling:

```js
require(["dijit/registry"], function(registry){
    registry.byId("task").set("disabled", false);
}
```

### MenuBars and More

So far we've been working exclusively with `dijit/Menu` and standalone menus.
But as we discussed in the introduction, menus can take different forms.
For a horizontal menubar, where sub-menus are drop-downs, `dijit/MenuBar`
is provided as a variation on `dijit/Menu`.
Usage is generally the same, but you do have to remember to use the
`dijit/MenuBarItem` widget class for items:

<div id="example2">
	<div data-dojo-type="dijit/layout/TabContainer"
		data-dojo-props="doLayout:false, 'class':'code-tabs'">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Declarative'">
	<pre class="brush: js; html-script: true;">
	&lt;body class="claro"&gt;
		&lt;div id="mainMenu" data-dojo-type="dijit/MenuBar"&gt;
			&lt;div id="edit" data-dojo-type="dijit/MenuBarItem"&gt;Edit&lt;/div&gt;
			&lt;div id="view" data-dojo-type="dijit/MenuBarItem"&gt;View&lt;/div&gt;
			&lt;div id="task" data-dojo-type="dijit/PopupMenuBarItem"&gt;
				&lt;span&gt;Task&lt;/span&gt;
				&lt;div id="taskMenu" data-dojo-type="dijit/Menu"&gt;
					&lt;div id="complete" data-dojo-type="dijit/MenuItem"&gt;
						Mark as Complete
					&lt;/div&gt;
					&lt;div id="cancel" data-dojo-type="dijit/MenuItem"&gt;
						Cancel
					&lt;/div&gt;
					&lt;div id="begin" data-dojo-type="dijit/MenuItem"&gt;
						Begin
					&lt;/div&gt;
				&lt;/div&gt;
			&lt;/div&gt;&lt;!-- end of sub-menu --&gt;
		&lt;/div&gt;

		&lt;script&gt;
			// Require dependencies
			require([
				"dojo/parser",
				"dijit/Menu",
				"dijit/MenuItem",
				"dijit/MenuBar",
				"dijit/MenuBarItem",
				"dijit/PopupMenuBarItem",
				"dojo/domReady!"
			], function(parser){
				parser.parse;
			});
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Programmatic'">
	<pre class="brush: js; html-script: true;">
	&lt;body class="claro"&gt;
		&lt;div id="mainMenu"&gt;&lt;/div&gt;

		&lt;script&gt;
			// Require dependencies
			require([
				"dijit/Menu",
				"dijit/MenuItem",
				"dijit/MenuBar",
				"dijit/MenuBarItem"
				"dijit/PopupMenuBarItem",
				"dojo/domReady!"
			], function(Menu, MenuItem, MenuBar, MenuBarItem,
				PopupMenuBarItem){
				// create the Menu container
				var mainMenu = new MenuBar({}, "mainMenu");

				// create Menu container and child MenuItems
				// for our sub-menu (no srcNodeRef; we will
				//add it under a PopupMenuItem)
				var taskMenu = new Menu({
					id: "taskMenu"
				});

				// define the task sub-menu items
				taskMenu.addChild(new MenuItem({
					id: "complete",
					label: "Mark as Complete"
				}));

				taskMenu.addChild(new MenuItem({
					id: "cancel",
					label: "Cancel"
				}));

				taskMenu.addChild(new MenuItem({
					id: "begin",
					label: "Begin"
				}));

				// create and add main menu items
				mainMenu.addChild(new MenuBarItem({
					id: "edit",
					label: "Edit"
				}));

				mainMenu.addChild(new MenuBarItem({
					id: "view",
					label: "View"
				}));

				// make task menu item open the sub-menu we defined above
				mainMenu.addChild(new PopupMenuBarItem({
					id: "task",
					label: "Task",
					popup: taskMenu
				}));

				mainMenu.startup();
				taskMenu.startup();
			});
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	</div>
</div>

[View Declarative Demo](demo/nestedDeclarativeMenuBar.html)

[View Programmatic Demo](demo/nestedProgMenuBar.html)

### Menus in Widgets

There are a series of composite widgets in Dijit which employ menus.
These include `dijit/form/ComboButton` and `dijit/form/DropDownButton`.
The principle is very similar to how we have been creating nested menus.
For example, we could create a ComboButton with a Menu as follows:

<div id="example3">
	<div data-dojo-type="dijit/layout/TabContainer"
		data-dojo-props="doLayout:false, 'class':'code-tabs'">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Declarative'">
	<pre class="brush:js; html-script: true; highlight:[2,16]">
	&lt;body class="claro"&gt;
		&lt;div id="comboButton" data-dojo-type="dijit/form/ComboButton"&gt;
			&lt;span&gt;Do Something&lt;/span&gt;
			&lt;div data-dojo-type="dijit/Menu"&gt;
				&lt;div data-dojo-type="dijit/MenuItem"&gt;Edit&lt;/div&gt;
				&lt;div data-dojo-type="dijit/MenuItem"&gt;View&lt;/div&gt;
				&lt;div data-dojo-type="dijit/MenuItem"&gt;Task&lt;/div&gt;
			&lt;/div&gt;
		&lt;/div&gt;

		&lt;script&gt;
			// Require dependencies
			require([
				"dijit/Menu",
				"dijit/MenuItem",
				"dijit/form/ComboButton",
				"dojo/parser",
				"dojo/domReady!"
			], function(Menu, MenuItem, ComboButton, parser){
				parser.parse;
			});
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title:'Programmatic'">
	<pre class="brush:js; html-script: true; highlight: [27,28,29,30]">
	&lt;body class="claro"&gt;
		&lt;div id="comboBtn"&gt;&lt;/div&gt;

		&lt;script&gt;
			// Require dependencies
			require([
				"dijit/Menu",
				"dijit/MenuItem",
				"dijit/form/ComboButton",
				"dojo/domReady!"
			], function(Menu, MenuItem, ComboButton) {
				var menu = new Menu({ id: "mainMenu" });

				menu.addChild(new MenuItem({
					label: "Edit"
				}));

				menu.addChild(new MenuItem({
					label: "View"
				}));

				menu.addChild(new MenuItem({
					label: "Task"
				}));

				// create a ComboButton and add the Menu
				var comboBtn = new ComboButton({
					label: "Do Something",
					dropDown: menu
				}, "comboBtn");

				menu.startup();
				comboBtn.startup();
			});
		&lt;/script&gt;
	&lt;/body&gt;
	</pre>
	</div>
	</div>
</div>

[View Demo](demo/ComboButton.html)

### Going Further

There are innumerable ways in which applications can use menus, and each
use case brings its own requirements.  Dijit provides you with a robust
Menu widget class, and implementations of a selection of common
user interface patterns.  You can react to menu interactions and configure and
change how items look. There are a number of other event hooks
we don't have space to cover here, but which you may wish to familiarize yourself
with:

**`onItemHover`**
> Called when the user's cursor is over a MenuItem. Connect to it or provide an implementation to handle this event.

**`onItemUnHover`**
> Called when the user's cursor leaves a MenuItem.

**`onItemClick`**
> Called when an item in the menu is clicked.
This is essentially an alternative to connecting to `onClick` of
individual menu items.

**`onOpen`**
> Called when the menu is shown or opened.

**`onClose`**
> Called when the menu is hidden or closed.

Review the API documentation for more details on these and other Menu widget methods.
Like any other Dijit widget, `dijit/Menu` and the other associated classes
are readily extensible if the behavior you need is not implemented out of the box.

### Conclusion

The menu functionality in Dijit makes it easy to create and interact with menu bars,
popup/dropdown menus, and sub-menus.
We have seen how to create a variety of menus from markup as well as programmatically.
This is just another one of the many pieces of the arsenal Dijit affords for
building great user experiences.

### Resources

*   [dijit/Menu reference guide](/reference-guide/1.10/dijit/Menu.html)
*   [dijit/Menu API docs](/api/?qs=1.10/dijit/Menu)
*   [dijit/MenuItem API docs](/api/?qs=1.10/dijit/MenuItem)

<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dijit/themes/claro/claro.css" />
<script src="//ajax.googleapis.com/ajax/libs/dojo/1.10.3/dojo/dojo.js" data-dojo-config="isDebug: true, async: true"></script>
<script>
	require(['dojo/parser',
		'dojo/dom-style',
		'dijit/layout/TabContainer',
		'dijit/layout/ContentPane',
		'dojo/domReady!'
	], function(parser, domStyle) {
		for(var i = 1; i < 6; i++) {
			var name = 'example' + i;
			parser.parse(name);
		}
	});
</script>