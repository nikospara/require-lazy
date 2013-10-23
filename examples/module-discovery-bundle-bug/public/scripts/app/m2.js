define(["jquery", "aliasedModule"],
function(jquery, aliasedModule) {

return {
	start: function(containerElement) {
		jquery(containerElement).html("<span>M2 - " + aliasedModule + "</span>");
	},
	
	stop: function() {
//		return true;
	}
};

});
