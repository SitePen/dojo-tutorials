require([
	"dojo/dom",
	"dojo/dom-attr",
	"dojo/hash",
	"dojo/on",
	"dojo/request",
	"dojo/query" // for dojo/on event delegation
], function(dom, domAttr, hash, on, request){
	var contentNode = dom.byId("content");

	on(dom.byId("menu"), "a:click", function(event){
		// prevent loading a new page - we're doing a single page app
		event.preventDefault();
		var page = '../' + domAttr.get(this, "href").replace(".php", "");
		loadPage(page);
	});

	function loadPage(page){
		hash(page);

		// get the page content using an Ajax GET
		request(page + ".json", {
			handleAs: "json"
		}).then(function (data) {
			// update the page title and content
			document.title = data.title;
			contentNode.innerHTML = data.content;
		});
	}
});