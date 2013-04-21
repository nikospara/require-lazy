require(["jquery","app/d0","lazy!text!app/m4.txt","lazy-registry"],
function($,d0,m4,lazyRegistry) {

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
		html += "</div><div id='container'></div><div><button class='m4-alerter'>Text</button></div></div>";
		view = $(html).appendTo("body");
		
		view.on("click", ".m4-alerter", function(event) {
			m4.get().then(function(txt) {
				alert(txt);
			});
		});
		
		view.on("click",".modnav",function(event) {
			event.preventDefault();
			var moduleName = $(this).attr("href").substring(1);
			lazyRegistry.get(moduleName).then(startModule, reportError);
			return false;
		});
	});

});
