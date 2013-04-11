define(["jquery", "text!templates/tab-button.html",
	"lib/jqueryui/jquery.ui.button"],
function($, template) {

	var element = $(template), rendered = false;
	
	element.find("button").button().click(function(event) {
		alert("Clicked!");
	});
	
	return {
		render: function(container) {
			if( !rendered ) {
				$(container).empty().append(element);
				rendered = true;
			}
		}
	};

});
