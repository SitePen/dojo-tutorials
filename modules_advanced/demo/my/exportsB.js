define([ "./exportsA" ], function(moduleA){
	return {
		getValue: function(){
			return "apples and " + moduleA.getValue();
		}
	};
});