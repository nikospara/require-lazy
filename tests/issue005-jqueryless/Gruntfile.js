module.exports = function(grunt) {
	var options = require("./build-scripts/options.js"),
		config = require("./build-scripts/app.json");
	
	grunt.initConfig({
		require_lazy_grunt: {
			options: {
				buildOptions: options,
				config: config,
				callback: function(modules, pmresult) {
					// This callback is optional; included here just for demonstration purposes.
					var fs = require("fs"), util = require("util"), path = require("path");
					fs.writeFileSync(path.join(options.outputBaseDir, "modules.js"), util.inspect(modules,{depth:null,colors:false}));
					fs.writeFileSync(path.join(options.outputBaseDir, "bundles.js"), util.inspect(pmresult.bundles,{depth:null,colors:false}));
				}
			}
		},
		clean: ["build/*"]
	});
	
	grunt.loadNpmTasks("require-lazy-grunt");
	grunt.loadNpmTasks("grunt-contrib-clean");
	
	grunt.registerTask("default", ["require_lazy_grunt"]);
};
