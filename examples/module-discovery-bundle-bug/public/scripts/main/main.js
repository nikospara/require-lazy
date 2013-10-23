require(["jquery","lazy-registry"],
function($,lazyRegistry) {

	var currentModule = null, view;
	
	function startModule(m) {
		var result = true;
		
		if( currentModule != null ) {
			result = currentModule.stop();
		}
		
		if( result !== false ) {
			currentModule = m;
			m.start(view.find("#container"));
		}
	}
	
	function reportError(e) {
		console.log(e);
	}
	
	$(function() {
		var html, i, modules = lazyRegistry.getModules();
		
		html = "<div><div>";
		for( i=0; i < modules.length; i++ ) {
			if( modules[i].metadata == null || modules[i].metadata["menu-entry-label"] == null ) continue;
			if( i > 0 ) html += "&nbsp;";
			html += "<a href='#" + modules[i].name + "' class='modnav'>" + modules[i].metadata["menu-entry-label"] + "</a>";
		}
		html += "</div><div id='container'></div></div>";
		view = $(html).appendTo("body");
		
		view.on("click",".modnav",function(event) {
			event.preventDefault();
			var moduleName = $(this).attr("href").substring(1);
			lazyRegistry.get(moduleName).then(startModule, reportError);
			return false;
		});
	});

});
