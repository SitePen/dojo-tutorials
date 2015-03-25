define([ "./a" ], function(moduleA){
	// this code will run at resolution time, when the reference to
	// moduleA is an empty object, so moduleA.isValid will be undefined
	if(moduleA.isValid){
		return {
			getValue: function(){
				return "won't happen";
			}
		};
	}

	// this code returns an object with a method that references moduleA
	// the "getValue" method won't be called until after moduleA has
	// actually been resolved, and since it uses exports, the "getValue"
	// method will be available
	return {
		getValue: function(){
			return "apples and " + moduleA.getValue();
		}
	};
});