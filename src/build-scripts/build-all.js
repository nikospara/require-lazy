// build all
var
	rjs = require("requirejs"),
	path = require("path"),
	crypto = require("crypto"),
	fs = require('fs'),
	extend = require("extend"),
	shared = require("./shared"),
	removePluginsFromName = shared.removePluginsFromName,
	
	LIB_LAZY = shared.LIB_LAZY;


function buildAll(pmresult, options, config, callback, errback) {
	var splitModules;
	
	options = extend(true, {}, options);
	options.baseUrl = config.baseUrl;
	
	config = extend(true, {}, config);
	// deleting these two signals single file optimization
	delete config.appDir;
	delete config.dir;
// uncomment this for debugging the output
//	config.optimize = "none";
	config.baseUrl = path.normalize(path.join(options.basePath, config.baseUrl));
	// remember the original entry point name
	config.originalName = config.name;
	// communicate the module name
	addLibLazyNameToConfig(config, options);
	
	// the main module must be built last so that hashes are calculated
	splitModules = splitMainModuleFromArray(pmresult.modulesArray, options, config);
	
	buildModules(splitModules.otherModules, pmresult.bundles, options, config, function() {
		buildBundles(pmresult.bundles.bundlesArray, options, config, function() {
			// `lazy-registry` is generated, provide the text here
			shared.putLazyRegistryText(config, createModulesRegistryText(pmresult, options));
			buildModules(splitModules.mainModule, pmresult.bundles, options, config, function() {
				callback();
			}, errback);
		}, errback);
	}, errback);
}

function addLibLazyNameToConfig(config, options) {
	var lazycfg = config.config;
	if( lazycfg == null ) {
		lazycfg = {};
		config.config = lazycfg;
	}
	lazycfg = config.config[options.libLazy || LIB_LAZY];
	if( lazycfg == null ) {
		lazycfg = {};
		config.config[options.libLazy || LIB_LAZY] = lazycfg;
	}
	lazycfg.lazyModuleName = (options.libLazy || LIB_LAZY);
}

function splitMainModuleFromArray(modulesArray, options, config) {
	var
		 entryModule = options.entryModule || config.name,
		 ret = {mainModule: [], otherModules: []}, i;
	for( i=0; i < modulesArray.length; i++ ) {
		if( modulesArray[i].name === entryModule ) ret.mainModule.push(modulesArray[i]);
		else ret.otherModules.push(modulesArray[i]);
	}
	return ret;
}

function buildModules(modulesArray, bundles, options, config, callback, errback) {
	var nextModule;
	modulesArray = modulesArray.slice(0);
	loop();
	
	function loop() {
		nextModule = modulesArray.shift();
		if( typeof(nextModule) !== "undefined" ) {
			buildModule(options, config, nextModule, bundles, loop, errback);
		}
		else {
			if( typeof(callback) === "function" ) callback();
		}
	}
}

function buildModule(options, config, module, bundles, callback, errback) {
	var moduleName = module.name, originalIncludes = config.include, moduleBundles = makeModuleBundles(), originalOnBuildWrite = config.onBuildWrite;
	config.out = path.normalize(path.join(options.outputBaseDir, options.baseUrl, removePluginsFromName(moduleName) + "-built.js"));
	config.name = moduleName;
	config.exclude = module.excludedDeps;
	if( module.parents.length === 0 ) {
		if( config.include == null ) config.include = shared.ROOT_IMPLICIT_DEPS;
		else config.include = config.include.concat(shared.ROOT_IMPLICIT_DEPS);
		config.include = config.include.concat(discoveredModules(options));
	}
	config.onBuildWrite = function (moduleName, path, contents) {
		var b = bundles.depsToBundleMap[moduleName];
		if( b != null && !moduleBundles[b.id] ) contents = "";
		else if( typeof(originalOnBuildWrite) === "function" ) contents = originalOnBuildWrite(moduleName, path, contents);
		return contents;
	};
	rjs.optimize(config, function() {
		config.onBuildWrite = originalOnBuildWrite;
		config.include = originalIncludes;
		makeChecksum(config.out, function(hash) {
			module.hash = hash;
			callback();
		});
	}, function(err) {
		if( typeof(errback) === "function" ) errback("build-all::buildModule", err, module);
		else console.log("build-all::buildModule(%s): %s",module.name,err);
	});
	
	function makeModuleBundles() {
		var i, ret = {};
		for( i=0; i < module.bundleDeps.length; i++ ) {
			ret[module.bundleDeps[i].id] = true;
		}
		return ret;
	}
}

function discoveredModules(options) {
	var ret = [], i, disovered,
		PREFIX_LAZY = (options.libLazy || LIB_LAZY) + "!";
	if( typeof(options.discoverModules) === "function" ) {
		disovered = options.discoverModules();
		for( i=0; i < disovered.length; i++ ) {
			ret.push(PREFIX_LAZY + disovered[i]);
		}
	}
	return ret;
}

function buildBundles(bundlesArray, options, config, callback, errback) {
	var nextBundle, mainConfig = shared.loadMainConfig(options, config);
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
				buildBundle(options, config, mainConfig, nextBundle, loop, errback);
			}
		}
		else {
			if( typeof(callback) === "function" ) callback();
		}
	}
}

function buildBundle(options, config, mainConfig, bundle, callback, errback) {
	var originalOnBuildWrite = config.onBuildWrite
	config.out = path.normalize(path.join(options.outputBaseDir, options.baseUrl, "bundles", bundle.id + ".js"));
	delete config.name;
	config.exclude = mainConfig.deps || [];
	config.include = bundle.deps;
	config.onBuildWrite = function (moduleName, path, contents) {
		if( config.include.indexOf(moduleName) >= 0 ) {
			if( typeof(originalOnBuildWrite) === "function" ) contents = originalOnBuildWrite(moduleName, path, contents);
		}
		else contents = "";
		return contents;
	};
	rjs.optimize(config, function() {
		config.onBuildWrite = originalOnBuildWrite;
		makeChecksum(config.out, function(hash) {
			bundle.hash = hash;
			callback();
		});
	}, function(err) {
		if( typeof(errback) === "function" ) errback("build-all::buildBundle", err, bundle);
		else console.log("build-all::buildBundle(%s): %s",bundle.id,err);
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

function createModulesRegistryText(pmresult, options) {
	var text;
	
	text = shared.createModulesRegistryText(pmresult, options, {
		inludeModuleName: true,
		generateBody: true,
		nullBundleDeps: false,
		writeBundleRegistrations: true
	});
	
	return text;
}


module.exports = buildAll;
