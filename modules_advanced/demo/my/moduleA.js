define([ "./moduleB" ], function(moduleB){
	return {
		getValue: function(){
			return "oranges";
		},

		print: function(){
			log(moduleB.getValue());
		}
	};
});