// build all
var
	rjs = require("./lib/r.js"),
	path = require("path"),
	crypto = require("crypto"),
	fs = require('fs'),
	extend = require("./lib/extend"),
	shared = require("./shared"),
	removePluginsFromName = shared.removePluginsFromName,
	
	LIB_LAZY = "lazy";


function buildAll(pmresult, options, config, callback) {
	options = extend(true, {}, options);
	options.baseUrl = config.baseUrl;
	
	config = extend(true, {}, config);
	// deleting these two signals single file optimization
	delete config.appDir;
	delete config.dir;
// uncomment this for debugging the output
//	config.optimize = "none";
	config.baseUrl = path.normalize(path.join(options.basePath, config.baseUrl));
	// TODO Code duplication with fd.findDeps()
	// remember the original entry point name
	config.originalName = config.name;
	
	buildModules(pmresult.modulesArray, options, config, function() {
		buildBundles(pmresult.bundles.bundlesArray, options, config, function() {
			createModulesRegistry(pmresult, options, config, callback);
		});
	});
}

function buildModules(modulesArray, options, config, callback) {
	var nextModule;
	modulesArray = modulesArray.slice(0);
	loop();
	
	function loop() {
		nextModule = modulesArray.shift();
		if( typeof(nextModule) !== "undefined" ) {
			buildModule(options, config, nextModule, loop);
		}
		else {
			if( typeof(callback) === "function" ) callback();
		}
	}
}

function buildModule(options, config, module, callback) {
	var moduleName = module.name;
	config.out = path.normalize(path.join(options.outputBaseDir, options.baseUrl, removePluginsFromName(moduleName) + "-built.js"));
	config.name = moduleName;
	config.exclude = module.excludedDeps;
	rjs.optimize(config, function() {
		makeChecksum(config.out, function(hash) {
			module.hash = hash;
			callback();
		});
	}, function(err) {
		console.log(err);
	});
}

function buildBundles(bundlesArray, options, config, callback) {
	var nextBundle;
	bundlesArray = bundlesArray.slice(0);
	loop();
	
	function loop() {
		nextBundle = bundlesArray.shift();
		if( typeof(nextBundle) !== "undefined" ) {
			if( nextBundle.exclusive || nextBundle.includedIn ) {
				// exclusive bundles are included in the module, skip
				loop();
			}
			else {
				buildBundle(options, config, nextBundle, loop);
			}
		}
		else {
			if( typeof(callback) === "function" ) callback();
		}
	}
}

function buildBundle(options, config, bundle, callback) {
	config.out = path.normalize(path.join(options.outputBaseDir, options.baseUrl, "bundles", bundle.id + ".js"));
	delete config.name;
	config.exclude = [];
	config.include = bundle.deps;
	rjs.optimize(config, function() {
		makeChecksum(config.out, function(hash) {
			bundle.hash = hash;
			callback();
		});
	}, function(err) {
		console.log(err);
	});
}

function makeChecksum(filename, callback) {
	var
		md5 = crypto.createHash("md5"),
		s = fs.ReadStream(filename);
	s.on("data", function(d) {
		md5.update(d);
	});
	
	s.on("end", function() {
		var d = md5.digest('hex');
		callback(d);
	});
}

function createModulesRegistry(pmresult, options, config, callback) {
// I like this more, but for some reason config.out() is not called
// 	var optimizedText;
// 	config.out = function(text) {
// 		optimizedText = text;
// 	};
// 	delete config.name;
// 	config.name = "lazy-registry";
// 	config.exclude = [];
// 	config.include = ["lazy-registry"];
// 	config.rawText = {
// 		"lazy-registry": makeRawText()
// 	};
// 	rjs.optimize(config, function() {
// 		var filename = path.normalize(path.join(options.outputBaseDir, options.baseUrl, config.originalName + "-built.js"));
// 		fs.appendFile(filename, optimizedText, function(err) {
// 			callback();
// 		});
// 	});
	var text = makeRawText(), filename = path.normalize(path.join(options.outputBaseDir, options.baseUrl, config.originalName + "-built.js"));
	fs.appendFile(filename, text, function(err) {
		callback();
	});
	
	function makeRawText() {
		var text, i, a;
		
		a = pmresult.bundles.bundlesArray
//		text = "define(['" + LIB_LAZY + "'], function(lazy) {\n";
		text = "define('lazy-registry',['" + LIB_LAZY + "','require'], function(lazy,require) {\n";
		for( i=0; i < a.length; i++ ) {
			if( !(a[i].exclusive || a[i].includedIn) ) text += "lazy.registerBundle('" + a[i].id + "','" + a[i].hash + "');\n";
		}
		a = pmresult.modulesArray;
		for( i=0; i < a.length; i++ ) {
			if( a[i].parents.length > 0 ) text += writeModuleRegistration(a[i]); // skip the main module
		}
		text += "});\n";
		
		a = pmresult.modulesArray;
		for( i=0; i < a.length; i++ ) {
			if( a[i].parents.length > 0 ) text += writeModule(a[i]);
		}
		
		return text;
	}
	
	function writeModuleRegistration(module) {
		var i, text, first = true;
		text = "lazy.registerModule(new lazy.Stub('" + module.name + "',require,[";
		if( module.bundleDeps != null && module.bundleDeps.length > 0 ) {
			for( i=0; i < module.bundleDeps.length; i++ ) {
				if( !(module.bundleDeps[i].exclusive || module.bundleDeps[i].includedIn) ) {
					if( first ) first = false;
					else text += ",";
					text += "'" + module.bundleDeps[i].id + "'";
				}
			}
		}
		text += "],";
		text += "'" + module.hash + "',";
		text += "null"; // TODO Metadata
		text += "));\n";
		return text;
	}
	
	function writeModule(module) {
		var i, text, first = true;
		text = "define('" + LIB_LAZY + "!" + module.name + "',['" + LIB_LAZY + "','lazy-registry'],function(lazy) {\n";
		text += "return lazy.getModule('" + module.name + "');\n";
		text += "});\n";
		return text;
	}
}


module.exports = buildAll;
