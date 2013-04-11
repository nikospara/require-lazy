require.config({
	baseUrl: "scripts",
	
	paths: {
		"text": "lib/text-2.0.5",
		"lazy": "lib/lazy"
	},
	
	shim: {
		"lib/jqueryui/jquery.ui.core": {
			deps: ["jquery"]
		},
		"lib/jqueryui/jquery.ui.widget": {
			deps: []
		},
		"lib/jqueryui/jquery.ui.button": {
			deps: ["lib/jqueryui/jquery.ui.core", "lib/jqueryui/jquery.ui.widget"]
		},
		"lib/jqueryui/jquery.ui.tabs": {
			deps: ["lib/jqueryui/jquery.ui.core", "lib/jqueryui/jquery.ui.widget"]
		},
		"lib/jqueryui/jquery.ui.datepicker": {
			deps: ["lib/jqueryui/jquery.ui.core"]
		}
	}
});
