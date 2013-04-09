define(["jquery", "app/d1", "app/d4"],
function(jquery, d1, d4) {

return {
	start: function(containerElement) {
		jquery(containerElement).html("<span>M3 - " + d1.name + "</span>");
	},
	
	stop: function() {
//		return true;
	}
};

});
