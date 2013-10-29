var
	findDeps = require("./find-deps"),
	processModules = require("./process-modules"),
	buildAll = require("./build-all");

module.exports.findDeps = findDeps;
module.exports.processModules = processModules;
module.exports.buildAll = buildAll;

function build(options, config, callback, errback) {
	findDeps(options, config, function(modules) {
		var pmresult = processModules(modules);
		buildAll(pmresult, options, config, function() {
			if( typeof(callback) === "function" ) callback(modules, pmresult);
		}, errback);
	}, errback);
}

module.exports.build = build;
