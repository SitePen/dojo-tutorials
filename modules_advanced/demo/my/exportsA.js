define([ "./exportsB", "exports" ], function(moduleB, exports){
	exports.getValue = function(){
		return "oranges";
	};

	exports.print = function(){
		log(moduleB.getValue());
	};
});