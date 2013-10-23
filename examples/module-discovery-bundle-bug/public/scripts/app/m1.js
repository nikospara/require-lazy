define(["jquery", "aliasedModule"],
function(jquery, aliasedModule) {


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
		jquery("<span>M1 - " + aliasedModule + "</span>")
			.appendTo(containerElement);
	},
	
	stop: function() {
//		return true;
	}
};


});
