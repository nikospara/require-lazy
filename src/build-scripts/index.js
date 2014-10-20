var
	findDeps = require("./find-deps"),
	processModules = require("./process-modules"),
	buildAll = require("./build-all"),
	shared = require("./shared");

module.exports.findDeps = findDeps;
module.exports.processModules = processModules;
module.exports.buildAll = buildAll;
module.exports.shared = shared;

function build(options, config, callback, errback) {
	findDeps(options, config, function(modules) {
		var pmresult = processModules(modules, options);
		buildAll(pmresult, options, config, function() {
			if( typeof(callback) === "function" ) callback(modules, pmresult);
		}, errback);
	}, errback);
}

module.exports.build = build;
