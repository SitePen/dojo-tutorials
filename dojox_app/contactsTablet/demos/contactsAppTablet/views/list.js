define(["dojo/_base/declare", "dojo/_base/array", "dojo/has",
	"dojox/mobile/ListItem", "dojox/mobile/EdgeToEdgeStoreList",
	"dojox/mobile/FilteredListMixin"],
	function(declare, array, has, ListItem){
	var ContactListItem = declare(ListItem, {
		target: "details",
		clickable: true,
		// we don't get an arrow if we are on a two panes layout (tablet)
		noArrow: !has("phone"),
		postMixInProperties: function(){
			this.inherited(arguments);
			this.transitionOptions = {
				params: {
					"id" : this.id
				}
			}
		}
	});

	return {
		ContactListItem: ContactListItem,
		init: function(){
			var view = this;
			this.contacts.on("add", function(item){
				// select the newly added element
				if(!has("phone")){
					array.some(view.contacts.getChildren(),
						function(child){
							if(child.id == item.id){
								view.contacts.selectItem(child);
							}
							return false;
						}
					);
				}
			});
			this.add.on("click", function(){
				view.contacts.deselectAll();
			});
		},
		beforeActivate: function(){
			// in tablet we want one to be selected each time but list
			// must be completed for that
			if(!has("phone")){
				// check if something is selected
				var selected = array.some(this.contacts.getChildren(),
					function(child){
						return child.get("selected");
					}
				);
				if(!selected && this.contacts.getChildren().length > 0){
					var item = this.contacts.getChildren()[0];
					this.contacts.selectItem(item);
					// transition
					this.app.transitionToView(this.domNode, {
						target: "details",
						params: {
							id: item.id
						}
					});
				}
			}
		}
	};
});