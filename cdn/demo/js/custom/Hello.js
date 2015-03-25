// dojo/_base/declare and dijit/Dialog are loaded from CDN
define([ "dojo/_base/declare", "dijit/Dialog" ], function(declare, Dialog){
	// declare our custom class
	return dojo.declare(dijit.Dialog, {
		title: "Hi"
	});
});