// this is an example build script; several actions are for demonstration purposes
var
	fs = require("fs"),
	requireLazy = require("require-lazy"),
	findDeps = requireLazy.findDeps,
	processModules = requireLazy.processModules,
	buildAll = requireLazy.buildAll,
	options = require("./options.js").config,
	config = require("./app.build.json");

// get a fresh copy of the files
copyFileSync("../../../src/lib/lazy.js", __dirname + "/../public/scripts/lib/lazy.js");
copyFileSync("../../../src/lib/lazy-builder.js", __dirname + "/../public/scripts/lib/lazy-builder.js");
copyFileSync("../../../src/lib/promise-adaptor-jquery.js", __dirname + "/../public/scripts/lib/promise-adaptor-jquery.js");

findDeps(options, config, function(modules) {
	var pmresult = processModules(modules);
	var util = require("util"), path = require("path");
	buildAll(pmresult, options, config, function() {
		fs.writeFileSync(path.join(options.outputBaseDir, "modules.js"), util.inspect(modules,{depth:null,colors:false}));
		fs.writeFileSync(path.join(options.outputBaseDir, "bundles.js"), util.inspect(pmresult.bundles,{depth:null,colors:false}));
		console.log("success");
	});
});

function copyFileSync(srcFile, destFile) {
	var encoding = "UTF-8", content = fs.readFileSync(srcFile, encoding);
	fs.writeFileSync(destFile, content, encoding);
}
