define([ "./b", "exports" ], function(moduleB, exports){
	exports.isValid = true;

	exports.getValue = function(){
		return "oranges";
	};

	exports.print = function(){
		// dependency on moduleB
		log(moduleB.getValue());
	}
});