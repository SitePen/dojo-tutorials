require([
	"dojo/request",
	"dojox/grid/DataGrid",
	"dojo/store/Memory",
	"dojo/data/ObjectStore"
], function(request, DataGrid, Memory, ObjectStore) {
	var store = new Memory();

	request("./users.json", {
		handleAs: "json"
	}).then(function (data) {
		var grid;
		store.setData(data);
		grid = new DataGrid({
			store: new ObjectStore({ objectStore: store }),
			structure: [{
				name: "Full Name",
				field: "fullName",
				width: "200px"
			}, {
				name: "Email Address",
				field: "email",
				width: "200px"
			}],
			autoHeight: true,
			autoWidth: true,
			onRowClick: function (e) {
				location.href = "users.html#/user/" + grid.getItem(e.rowIndex).id
			},
			selectionMode: "single"
		}, "grid");

		grid.startup();
	});
});