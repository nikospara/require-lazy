require(["jquery", "lazy!app/tab-button", "lazy!app/tab-datepicker", "text!templates/main.html",
	"lib/jqueryui/jquery.ui.tabs"],
function($, tab2, tab3, template) {

	var
		tabActivationMap = {
			"main_tab2": function(panel) {
				tab2.get().then(function(m) {
					m.render(panel);
				});
			},
			
			"main_tab3": function(panel) {
				tab3.get().then(function(m) {
					m.render(panel);
				});
			}
		};
	
	$(function() {
		var element = $(template);
		
		element.find(".main_tab_wrapper").tabs({
			beforeActivate: function(event, ui) {
				var callback = tabActivationMap[ui.newPanel.attr("id")];
				if( typeof(callback) === "function" ) callback(ui.newPanel);
			}
		});
		$("body").append(element);
	});

});
