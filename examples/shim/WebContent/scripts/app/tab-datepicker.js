define(["jquery", "text!templates/tab-datepicker.html",
	"lib/jqueryui/jquery.ui.datepicker"],
function($, template) {

	var element = $(template), rendered = false;
	
	element.find("#datepicker").datepicker();
	
	return {
		render: function(container) {
			if( !rendered ) {
				$(container).empty().append(element);
				rendered = true;
			}
		}
	};

});
