require(["lazy!app/m1", "lazy!app/m2"], function(m1, m2) {
	
	function execute(m) {
		document.getElementById("output").innerHTML = "" + m(2,3);
	};
	
	document.getElementById("add").addEventListener("click", function() {
		m1.get().then(execute,
			function error(e) {
				console.error(e);
			}
		);
	});
	
	document.getElementById("mul").addEventListener("click", function() {
		m2.get().then(execute,
			function error(e) {
				console.error(e);
			}
		);
	});
});
