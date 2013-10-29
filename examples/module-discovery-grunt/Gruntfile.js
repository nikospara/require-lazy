module.exports = function(grunt) {
	var
		fs = require("fs"),
		options = require("./build-scripts/options.js").config,
		config = require("./build-scripts/app.json");
	
	grunt.initConfig({
		copy: {
			main: {
				expand: true,
				cwd: "../../src/",
				src: [
					"lib/lazy.js",
					"lib/lazy-builder.js",
					"lib/promise-adaptor-jquery.js"
				],
				dest: "public/scripts/"
			}
		},
		require_lazy_grunt: {
			options: {
				buildOptions: options,
				config: config,
				callback: function(modules, pmresult) {
					// This callback is optional; included here just for demonstration purposes.
					var util = require("util"), path = require("path");
					fs.writeFileSync(path.join(options.outputBaseDir, "modules.js"), util.inspect(modules,{depth:null,colors:false}));
					fs.writeFileSync(path.join(options.outputBaseDir, "bundles.js"), util.inspect(pmresult.bundles,{depth:null,colors:false}));
				}
			}
		},
		clean: ["build/*"]
	});
	
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("require-lazy-grunt");
	grunt.loadNpmTasks("grunt-contrib-clean");
	
	grunt.registerTask("default", ["copy:main", "require_lazy_grunt"]);
};
