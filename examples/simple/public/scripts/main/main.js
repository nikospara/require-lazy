require(["jquery","lazy!app/m1","lazy!app/m2","lazy!app/m3","app/d0","lazy!text!app/m4.txt"],
function(jq,m1,m2,m3,d0,m4) {

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
	
	$(function() {
		view = jq("<div><div><a href='#' id='link-m1' class='modnav'>Module 1</a>&nbsp;<a href='#' id='link-m2' class='modnav'>Module 2 " + d0.name + "</a>&nbsp;<a href='#' id='link-m3' class='modnav'>Module 3</a></div><div id='container'></div><div><button class='m4-alerter'>Text</button></div></div>").appendTo("body");
		
		view.on("click", ".m4-alerter", function(event) {
			m4.get().then(function(txt) {
				alert(txt);
			});
		});
		
		view.on("click",".modnav",function(event) {
			event.preventDefault();
			if( this.id === "link-m1" ) m1.get().then(startModule);
			else if( this.id === "link-m2" ) m2.get().then(startModule);
			else if( this.id === "link-m3" ) m3.get().then(startModule);
			return false;
		});
	});

});
