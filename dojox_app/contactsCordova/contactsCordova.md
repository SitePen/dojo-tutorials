---
Category:  dojox/app
...

## Using dojox/app Build and Cordova

In the previous tutorial, [Updating the Contacts App for a Tablet](/documentation/tutorials/1.10/dojox_app/contactsTablet/),
we updated the Contacts Application to use a tablet form factor in addition to the
phone form factor.  In this tutorial we will see how to update the Contacts Application to use Cordova/PhoneGap based access
the native contacts on a mobile device, and how to use the dojox/app "Build" support.

### We will update the Contacts Application to support *Cordova/PhoneGap* based access to the contacts on a device.

Look here for details about [Cordova/PhoneGap](http://docs.phonegap.com).

The **Contacts Application** will have the following file structure:

```
/contactsApp/
		contacts.css
		contacts.js
		contacts.json
		contacts.php
		contacts.profile.js
		package.json
		/build/
			build.profile.js
		/nls/  (the same as the previous Contacts Application)
		/views/  (the same as the previous Contacts Application)
```

The JSON configuration file **contacts.json** has to be updated in two sections to support
	**Cordova/PhoneGap**

*   The **stores** will be updated with a **has** check for cordova to use a
	dcordova/ContactsStore. This shows the power of using **has** checking in the config along
	with the dojo/store so that the backend data can be swapped out without having to make any changes to the views or controllers.
*   A **has** check for cordova will be used to update the **dependencies** to use a dcordova/ContactsStore.

<!--  highlight: [5,6,7,8,25,26,27,28,29,30,31,32,33,34] -->
```js
	"stores": {
		"contacts": {
			"type": "dojo/store/Memory",
			"has": {
				"cordova": {
					"type": "dcordova/ContactsStore",
					"params": { "displayName": true }
				}
			},
			"observable": true,
			"params": {
				"data": [
				:  :  :
	"has": {
		"html5history": {
			"controllers": [
				"dojox/app/controllers/History"
			]
		},
		"!html5history": {
			"controllers": [
				"dojox/app/controllers/HistoryHash"
			]
		},
		"!cordova": {
			"dependencies": [
				"dojo/store/Memory"
			]
		},
		"cordova": {
			"dependencies": [
				"dcordova/ContactsStore"
			]
		}
	}
```

### Update the main module of your application for Cordova/PhoneGap.

<p>The main module (contacts.js) will be updated to check for cordova and if it is available
	it will use the **Cordova/PhoneGap** support.

<!-- highlight: [19, 21,22,26] -->
```js
	// we use 'define' and not 'require' to workaround Dojo build system limitation that prevents from making of this file
	// a layer if it using 'require'
	define(["dojo/sniff", "dojo/request", "dojo/json", "dojo/text!contactsApp/contacts.json", "dojox/app/main", "dojox/mobile/common"],
		function(has, request, json, config, Application, common){

		// if we exclude the cordova trick the init could be as simple as:
		// has.add("html5history", !has("ie") || has("ie") > 9);
		// has.add("phone", ((window.innerWidth || document.documentElement.clientWidth) <= common.tabletSize));
		// Application(json.parse(config));

		// trick to know if cordova optional project is here or not
		var init = function(){
			// populate has flag on whether html5 history is correctly supported or not
			has.add("html5history", !has("ie") || has("ie") > 9);
			has.add("phone", ((window.innerWidth || document.documentElement.clientWidth) <= common.tabletSize));
			Application(json.parse(config));
		};
		// check if cordova project's here
		request("../dcordova/sniff.js").then(function(){
			// cordova project is here, sniff cordova features and load the app
			require(["dcordova/sniff"], function(){
				init();
			});
		}, function(){
			// cordova project is not here, directly load the app
			init();
		});
	});
```

### For Cordova/PhoneGap you will need to setup an index.html file, and build the application for Cordova/PhoneGap.

This index.html file was setup to work with **Cordova/PhoneGap**.

<!-- highlight: [9,10,11,12,15] -->
```html
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1,
            minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />
        <title>Contacts App</title>
        <link rel="stylesheet" href="{path_to_contactsApp}/contactsApp/contacts.css">
        <script src="{path_to_dojox}/dojox/mobile/deviceTheme.js"></script>
        <script src="cordova-2.7.0.js"></script>
        <script src="{path_to_dojo}/dojo/dojo.js"
                                        data-dojo-config="app: {debugApp: 1}, async: true"></script>
        <script>
            require(["contactsApp/contacts"]);
        </script>
    </head>
    <body>
    </body>
</html>
```

We can not run in Cordova/PhoneGap as part of this demo, you will need to install Cordova/PhoneGap and build the application to run on Cordova/PhoneGap.
	See the Getting Started Guides at the [The Cordova/PhoneGap Documentation](http://docs.phonegap.com/) for more details.

[Run the Contacts Application Demo](demos/contactsApp/contacts.html)

[View the contactsApp source on github](https://github.com/edchat/dojox_app_tutorial/tree/master/contactsCordova/demos/contactsApp)

### Contacts Application on github

These tutorials have contained links to the code used for the demos in a github project used for this tutorial, but if you
	want to run the code on your own server, you will want to get the Contacts Application from this github project:
[https://github.com/cjolif/dojo-contacts-app](https://github.com/cjolif/dojo-contacts-app)

### Building an Application

Now that we have completed the Contacts Application we will show you how to **build** it.
	dojox/app provides extensions to the Dojo build system to make it easy to build an application for production.  Here is a link to the
	[dojox/app documentation for building an application](http://dojotoolkit.org/reference-guide/dojox/app.html#building-an-application).

For these build instructions we will assume that the Contacts Application has been pulled from the github repository above, along with
	dojo, dijit, dojox, and util into a directory named **myApps** so the file structure would look like this:

```
/myApps/
	/contactsApp/
		contacts.css
		contacts.html
		contacts.js
		contacts.json
		contacts.profile.js
		package.json
		/build/
			build.profile.js
		/nls/  (the same as the previous Contacts Application)
		/views/  (the same as the previous Contacts Application)
	/dijit/
	/dojo/
	/dojox/
	/util/
```

First take a look at the **Dojo build system profile** for the Contacts
	Application **(build.profile.js)**.  The profile will contain the key information of your build and
	import the dojox/app extensions into the build process as shown below:

<!-- highlight: [1,8,19,27,31,32] -->
```js
	require(["dojox/app/build/buildControlApp"], function(){
	});

	var profile = {
		// relative to this file
		basePath: "../..",
		// relative to base path
		releaseDir: "./contactsApp-release",
		action: "release",
		cssOptimize: "comments",
		mini: true,
		packages:[{
			name: "dojo",
			location: "./dojo"
		},{
			name: "dijit",
			location: "./dijit"
		},{
			name: "contactsApp",
			location: "./contactsApp"
		},{
			name: "dojox",
			location: "./dojox"
		}],
		selectorEngine: "acme",
		layers: {
			"dojo/dojo": {
				boot: true,
				customBase: true
			},
			"contactsApp/contacts": {
				include: ["contactsApp/contacts"]
			}
		}
	};
```

Optionally you could replace the packages section with this:

<!-- highlight: [2,3,4] -->
```js
		packages: [
			'dojo',
			'dijit',
			'dojox',
			{
				name: "contactsApp",
				location: "./contactsApp"
			}
		],
```

The command you would run to **build** your application would look like this:

```
./build.sh --profile {path-to-myApps}/contactsApp/build/build.profile.js
	--appConfigFile {path-to-myApps}/contactsApp/contacts.json
```

The build output will be in `/myApps/contactsApp-release/` as specified in **releaseDir**.

There may be some errors related to the view template html files like this:

```
error(303) Missing include module for layer. missing: contactsApp/views/details.html; layer: contactsApp/contacts
```

These errors can be ignored for now, the build still runs with the errors.  The errors are related to
	this trac ticket: [https://bugs.dojotoolkit.org/ticket/17144](https://bugs.dojotoolkit.org/ticket/17144)

Watch the network tab in the debugger while running the built version of the application from **/myApps/contactsApp-release/**
	and you can see that only a few script files are loaded are loaded.

*   **deviceTheme.js** is loaded from contacts.html
*   **dojo.js** is loaded from contacts.html
*   **contacts.js** is loaded from dojo.js
*   **contacts_en-us.js** is loaded from dojo.js
*   **memory.js** is loaded because it was not included in the layer because the dependency in the config was inside a **has** section
*   **QueryResults.js** is loaded because memory.js requires it.
*   **SimpleQueryEngine.js** is loaded because memory.js requires it.
*   **History.js** is loaded because it was not included in the layer because the dependency in the config was inside a **has** section

Update the build profile to include **memory.js** and **History.js**, to include these scripts and
	the ones they require in the build layer.

<!-- highlight: [1,5,6] -->
```js
	layers: {
		"contactsApp/contacts": {
			include: [
				"contactsApp/contacts",
				"dojo/store/Memory",
				"dojox/app/controllers/History"
			]
		}
	}
};
```

After a rebuild check the network tab in the debugger while running the built version again and you will see that
	the ones included in the layer are no longer loaded, now only these script files are loaded.

*   **deviceTheme.js** is loaded from contacts.html
*   **dojo.js is** loaded from contacts.html
*   **contacts.js** is loaded from dojo.js
*   **contacts_en-us.js** is loaded from dojo.js

Alternatively, you can build a layer per-view, instead of a single layer for the entire application. Set
	the **multipleAppConfigLayers** property to true in your profile to build a layer for each view.
	This can be useful since dojox/app will only load a view when it is being transitioned to for the first time.
	So if an application has a lot of views that will not be navigated to in a typical usage of the application, and
	you do not want to load everything upfront, you can set **multipleAppConfigLayers: true** in your
	build profile. In this case the controller file of each view will be used as the layer for the view.

Modify the build profile above by adding a line with **multipleAppConfigLayers: true,** and then
	rebuild the application.  Look for **Layer Contents:** in the **build-report.txt** to see
	which layers have been created, you should see these layers:

*   contactsApp/contacts:
*   dojo/dojo:
*   contactsApp/views/list:
*   contactsApp/views/details:

Size your browser window to be the size of a phone, so that the list and details view will not be shown in two columns.
	Watch the network tab in the debugger while you run this built version of the application, notice that
	**details.js** is not loaded until you select a contact and transition to the details view.

By default the dojox/app build extension will use the first layer it finds while processing the profile to bundle all
	of the modules for the application.  You can specify a specific layer to use by
	passing **--appConfigLayer layer/name** on the command line.  It can be a layer listed in the
	profile or one not listed in the profile for example: .

```
./build.sh --profile {path-to-myApps}/contactsApp/build/build.profile.js
	--appConfigFile {path-to-myApps}/contactsApp/contacts.json
	--appConfigLayer contactsApp/contacts
```

### Tips for creating an Application using dojox/app

*   Leverage the View lifecycle methods to perform actions at the right moment in your View controller:
	**init, beforeActivate, afterActivate, beforeDeactivate, afterDeactivate, destroy**
*   Each view can access store data through the **loadedStores** property. Stores from the application,
	from a parent view or for the view itself are all available to the view with the **loadedStores** property.
*   Each view can access its translation through the **nls** property. NLS can either be shared or specific
	to a view, they are inherited.
*   In order to get a responsive design and the best performance, leverage **CSS and CSS media
	queries** where possible to layout/display/hide elements based on the destination channel characteristics.
*   Define **has** flags that corresponds to your different channels.
*   Leverage the **has** flags both in the configuration file to configure the layout of the
	application and in the view templates & controllers to possibly change the behavior of the application
	based on the channel.

### Conclusion

In this tutorial we learned how to update the Contacts Application to use Cordova/PhoneGap based access the native
contacts on a mobile device, and how to use the dojox/app "Build" support.

### The dojox/app Contacts Application Series
1.   [Getting Started with dojox/app](../contactsList)
1.   [Updating the Contacts App for a Phone](../contactsPhone)
1.   [Updating the Contacts App for a Tablet](../contactsTablet)
1.   [Using dojox/app Build and Cordova](../contactsCordova)