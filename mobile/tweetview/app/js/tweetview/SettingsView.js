define(["dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/aspect", "dojox/mobile/Switch", "dojox/mobile/ListItem", "dojox/mobile/ScrollableView", "dojo/DeferredList", "dojo/io/script", "tweetview/_ViewMixin", "dojo/date", "dijit/registry"], function(declare, arrayUtil, lang, aspect, Switch, ListItem, ScrollableView, DeferredList, ioScript, _ViewMixin, date, registry) {

	// Return the resource
	return declare("tweetview.SettingsView", [ScrollableView, _ViewMixin], {

		// Create a template string for tweets:
		accountTemplateString: '<img src="${avatar}" alt="${user}" class="tweetviewAvatar" />' +
		'<div class="tweetviewContent">' +
			'<div class="tweetviewUser">${user}</div>' +
		'</div><div class="tweetviewClear"></div>',

		// Views that this widget should have reference to
		views: "",

		// URL to pull user information from; simple template included
		serviceUrl: "http://api.twitter.com/1/users/show/${account}.json",

		// When the widgets have started....
		startup: function() {
			// Retain functionality of startup in dojox.mobile.ScrollableView
			this.inherited(arguments);

			// Get the list child widget
			this.listNode = this.getListNode();

			// Hide the list because it's not populated with list items yet
			this.showListNode(false);

			// Sort the accounts
			var accounts = [];
			for(var account in tweetview.ACCOUNTS) {
				accounts.push(account);
			}
			accounts.sort();

			// Create an array to hold our deferreds
			var defs = [];
			// For every account....
			arrayUtil.forEach(accounts, function(account){
				// Make a request to Twitter to get user information
				defs.push(ioScript.get({
					callbackParamName: "callback",
					timeout: 3000,
					url: this.substitute(this.serviceUrl, { account: account })
				}));
			},this);

			// Get view widgets if we don't have them already
			this.viewWidgets = arrayUtil.map(this.views.split(","), function(id) {
				return registry.byId(id);
			});

			// Create a deferred list to add a callback for user formatting
			new DeferredList(defs).then(lang.hitch(this, function(results) {
				// For every returned user array...
				arrayUtil.forEach(results, function(def,i) {
					// // If the deferred failed, the user account isn't available or doesn't exist
					if(!def[0]) {
						// Remove the account from the list to prevent further problems
						// Also remove from our "local" sorted accounts list
						delete tweetview.ACCOUNTS[accounts[i]];
						delete accounts[i];
						return;
					}

					// Grab the user array
					var user = def[1];

					// If the user exists and isn't suspended or protected...
					if(user.id && !user["protected"]) { // Protected is a reserved word

						// Create a new list item for the user, including a switch
						var item = new ListItem().placeAt(this.listNode, "last");

						// Update the list item's content using our template for tweets
						item.containerNode.innerHTML = this.substitute(this.accountTemplateString,{
							user: user.screen_name,
							avatar: user.profile_image_url,
							user_id: user.id
						});

						// Create the switch
						var userSwitch = new Switch({
							"class": "tweetviewSwitch",
							value: tweetview.ACCOUNTS[user.screen_name].enabled ? "on" : "off"
						}).placeAt(item.containerNode, "first");

						// Add change event to the switch
						aspect.after(userSwitch, "onStateChanged", lang.hitch(this, function(newState) {
							// get a true/false value
							var isOn = newState == "on";

							// Update our ACCOUNTS hash
							tweetview.ACCOUNTS[user.screen_name].enabled = isOn;

							// For each Pane widget, call the onUserChange method
							arrayUtil.forEach(this.viewWidgets, function(viewWidget) {
								viewWidget.onUserChange(user.screen_name, isOn);
							});
						}), true);
					}
				},this);
				// If we have any valid accounts...
				if(accounts.length) {
					// Show the list now that we have content for it
					this.showListNode(true);

					// Trigger a refresh of each view
					arrayUtil.forEach(this.viewWidgets, function(view) {
						view.refresh();
					});
				}
			}));
		}
	});

});
