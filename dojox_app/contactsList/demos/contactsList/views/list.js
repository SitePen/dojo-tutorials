define(["dojo/_base/declare", "dojo/dom", "dojox/mobile/ListItem",
	"dojox/mobile/EdgeToEdgeStoreList", "dojox/mobile/FilteredListMixin"],
	function(declare, dom, ListItem){
	var ContactListItem = declare(ListItem, {
		clickable: true
	});

	return {
		ContactListItem: ContactListItem,
		init: function(){
			this.contacts.on("click", function(e){
				dom.byId("selectionMade").innerHTML = e.target.innerHTML + ": was selected.";
			});
		}
	};
});