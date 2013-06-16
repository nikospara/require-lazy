define(["jquery", "app/d1", "app/d2", "lazy!app/dm1", "app/dx", "app/d5"],
function(jquery, d1, d2, dm1, dx, d5) {


var $result;

function getSuccess(m) {
	loading(false);
	m.render($result);
}

function loading(flag) {
	console.log("loading %b", flag);
	if( flag ) $result.addClass("activity-inline");
	else $result.removeClass("activity-inline");
}

function getError() {
	loading(false);
	alert("Error");
}

return {
	start: function(containerElement) {
		containerElement.empty();
		jquery("<span>M1 - " + d5.name + " - <a href='#' class='activator'>Dependent Module</a> <span class='result'></span></span>")
			.on("click", ".activator", function(event) {
				$result = jquery(this).siblings(".result");
				event.preventDefault();
				loading(true);
				dm1.get().then(getSuccess, getError);
			})
			.appendTo(containerElement);
	},
	
	stop: function() {
//		return true;
	}
};


});
