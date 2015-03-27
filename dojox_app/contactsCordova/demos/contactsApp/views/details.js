define(["dojo/_base/array", "dojo/_base/lang", "dojo/has", "dojo/when",
	"dojo/Deferred", "dojo/query", "dojo/dom-class", "dijit/registry",
	"dojox/mobile/Button", "dojox/mobile/FormLayout",
	"dojox/mobile/TextArea"],
	function(array, lang, has, when, Deferred, query, domClass,
			 registry){

	var DATA_MAPPING = {
		"phonehome": "phoneNumbers.home",
		"phonework": "phoneNumbers.work",
		"mailhome": "emails.home",
		"mailwork": "emails.work"
	};

	var getStoreField = function(arr, type){
		var index = array.indexOf(arr, function(item){
			return (item.type == type);
		});
		if(index == -1){
			// create one
			arr.push({
				type: type
			});
			index = arr.length - 1;
		}
		return arr[index];
	};

	return {
		beforeActivate: function(){
			// in case we are still under saving previous
			// modifications, let's wait for the operation
			// to be completed and use the resulting
			// contact as input
			var view = this;
			when(view._savePromise, function(contact){
				view._savePromise = null;
				view._beforeActivate(contact);
			});
		},
		_beforeActivate: function(contact){
			// get the id of the displayed contact from the params if
			// we don't have a contact or from the contact if we have
			// one
			if(contact){
				this.params.id = contact.id;
			}
			var id = this.params.id;

			// are we in edit mode or not? if we are we need to
			// slightly update the view for that
			var edit = this.params.edit;
			// are we in create mode
			var create = (typeof id === "undefined");
			// change widgets readonly value based on that
			query("input", this.domNode).forEach(function(node){
				registry.byNode(node).set("readOnly", !edit);
			});
			// in edit mode change the label and params of the
			// edit button
			this.editButton.set("label",
				edit?this.nls.ok:this.nls.edit);
			// put a listener to save the form when we are editing if
			// there is not one already
			if(!this._onHandler && edit){
				this._onHandler = this.editButton.on("click",
					lang.hitch(this, this._saveForm));
			}else if(this._onHandler && !edit){
				this._onHandler.remove();
				this._onHandler = null;
			}
			var editButtonOptions =
				this.editButton.transitionOptions;
			editButtonOptions.params.edit = !edit;
			// also update the edit & ok button to reference the
			// currently displayed item
			editButtonOptions.params.id = id;
			var cancelButtonOptions =
				this.cancelButton.transitionOptions;
			if(create){
				// if we cancel we want to go back to main view
				cancelButtonOptions.target = "list";
				if(cancelButtonOptions.params.id){
					delete cancelButtonOptions.params.id;
				}
			}else{
				cancelButtonOptions.target = "details";
				cancelButtonOptions.params.id = id;
			}
			// hide back button in edit mode
			if(edit){
				domClass.add(this.backButton.domNode, "hidden");
				domClass.remove(this.formLayout.domNode,
					"mblFormLayoutReadOnly");
			}else{
				domClass.remove(this.backButton.domNode, "hidden");
				domClass.add(this.formLayout.domNode,
					"mblFormLayoutReadOnly");
			}
			// cancel button must be shown in edit mode only,
			// same for delete button if we are not creating a
			// new contact
			this.cancelButton.domNode.style.display = edit?"":"none";
			this.deleteButton.domNode.style.display =
				(edit&&(typeof id !== "undefined"))?"":"none";

			// let's fill the form with the currently selected contact
			// if nothing selected skip that part
			var view = this;
			var promise = null;
			if(!create && !contact){
				id = id.toString();
				// get the contact on the store
				promise = this.loadedStores.contacts.get(id);
			}else{
				promise = contact;
			}
			when(promise, function(contact){
				view.firstname.set("value",
					contact ? contact.name.givenName : null);
				view.lastname.set("value",
					contact ? contact.name.familyName : null);
				if(contact && contact.organizations &&
					contact.organizations.length){
					view.company.set("value",
						contact.organizations[0].name);
				}else{
					view.company.set("value", null);
				}
				// reset binding fields
				for(var key in DATA_MAPPING){
					view[key].set("value", null);
				}
				if(contact){
					// set each phone number to the corresponding form
					// field
					array.forEach(contact.phoneNumbers,
						function(number){
						// for now we just skip non supported
						// fields, ideally we should have a generic
						// mechanism to deal with them
						var phonekey = "phone"+number.type;
						if(view[phonekey]){
							view[phonekey].set("value", number.value);
						}
					});
					// set each mail field to the corresponding form
					// field
					array.forEach(contact.emails, function(mail){
						// for now we just skip non supported
						// fields, ideally we should have a generic
						// mechanism to deal with them
						var mailkey = "mail"+mail.type;
						if(view[mailkey]){
							view[mailkey].set("value", mail.value);
						}
					});
					// hide empty fields when not in edit mode
					if(!edit){
						view._hideEmptyFields(view);
					}
				}
			});
		},
		_saveForm: function(){
			var id = this.params.id, view = this;
			view._savePromise = new Deferred();
			if(typeof id === "undefined"){
				view._createContact();
			}else{
				// get the contact on the store
				var promise =
					this.loadedStores.contacts.get(id.toString());
				when(promise, function(contact){
					view._saveContact(contact);
					// save the updated item into the store
					when(view.loadedStores.contacts.put(contact),
						function(savedContact){
							// some store do return a contact some
							// other an ID
							view._savePromise.resolve(
								savedContact == id ?
									contact:savedContact);
						}
					);
				});
			}
		},
		_createContact: function(){
			var contact = {
				"id": (Math.round(Math.random()*1000000)).toString(),
				"name": {},
				"displayName": "",
				"phoneNumbers": [],
				"emails": [],
				"organizations": []
			};
			var view = this;
			this._saveContact(contact);
			when(this.loadedStores.contacts.add(contact),
				function(savedContact){
					// some store do return a contact some other an ID
					view._savePromise.resolve(savedContact ==
						contact.id ? contact : savedContact);
				}
			);
		},
		_saveContact: function(contact){
			// set back the values on the contact object
			var value, keys;
			// deal with name first
			var displayName = "";
			value = this.firstname.get("value");
			if(typeof value !== "undefined"){
				contact.name.givenName = value;
				displayName += value;
			}
			value = this.lastname.get("value");
			if(typeof value !== "undefined"){
				contact.name.familyName = value;
				displayName += " " + value;
			}
			contact.displayName = displayName;
			value = this.company.get("value");
			if(typeof value !== "undefined"){
				if(!contact.organizations){
					contact.organizations = [{}];
				}else if(contact.organizations.length == 0){
					contact.organizations.push({});
				}
				contact.organizations[0].name = value;
			}
			for(var key in DATA_MAPPING){
				value = this[key].get("value");
				if(typeof value !== "undefined"){
					// there is a value, save it
					keys = DATA_MAPPING[key].split(".");
					if(contact[keys[0]] == null){
						contact[keys[0]] = [];
					}
					getStoreField(contact[keys[0]],
						keys[1]).value = value;
				}
			}
		},
		_hideEmptyFields: function(view){
			query(".readOnlyHidden",
				view.formLayout.domNode).forEach(function(node){
				domClass.remove(node, "readOnlyHidden");
			});
			query("input",
				view.formLayout.domNode).forEach(function(node){
				var val = registry.byNode(node).get("value");
				if(!val && node.parentNode.parentNode &&
					node.id !== "firstname" &&
					node.id !== "lastname"){
						domClass.add(node.parentNode.parentNode,
							"readOnlyHidden");
				}
			});

		},
		_deleteContact: function(){
			var view = this;
			when(this.loadedStores.contacts.remove(
				this.params.id.toString()), function(){
				// we want to be back to list
				view.app.transitionToView(view.domNode, {
					target: "list" });
			});
		}
	}
});