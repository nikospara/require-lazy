define(['module'], function (module) {


	return {
		load: function(name, parentRequire, onload, config) {
			onload();
		},
		write: function(pluginName, moduleName, write) {
			// INTENTIONALLY BLANK
			// We write all module definitions in the main (root) bundle from build-all.js
		}
	};


});
