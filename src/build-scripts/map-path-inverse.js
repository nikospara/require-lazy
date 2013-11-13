var inversePaths,
	util = require("util"),
	fs = require("fs"),
	pathModule = require("path");

function mapPathInverse(path) {
	if( inversePaths != null ) path = mapPathInverseInner(path);
	return path;
}

function mapPathInverseInner(path) {
	var x;
	for( x in inversePaths ) {
		if( !inversePaths.hasOwnProperty(x) ) continue;
		if( path.indexOf(x) === 0 ) {
			if( path.length === x.length ) return inversePaths[x];
			else if( path[x.length] === "/" ) return inversePaths[x]+path.substring(x.length);
		}
	}
	return path;
}

mapPathInverse.setMainConfig = function(options, config) {
	var x, i, mainConfig, baseFullUrl;
	baseFullUrl = options.makeBuildRelativePath(config.baseUrl).replace(/\\/g,"/");
	mainConfig = loadMainConfig(options, config);
	if( mainConfig && mainConfig.paths ) {
		inversePaths = {};
		for( x in mainConfig.paths ) {
			if( !mainConfig.paths.hasOwnProperty(x) ) continue;
			if( util.isArray(mainConfig.paths[x]) ) {
				for( i=0; i < mainConfig.paths[x].length; i++ ) {
					addPath(mainConfig.paths[x][i], x);
				}
			}
			else addPath(mainConfig.paths[x], x);
		}
	}
	
	/** Add the module to the inverse path mappings. */
	function addPath(path, name) {
		// This will add a path -> name mapping, so that paths may be later
		// resolved to module names, as well as a filesystem full path to
		// module mapping, in case the `paths` value contains relative paths
		// (e.g. `../`, see issue #2).
		var fullPath = (pathModule.normalize(pathModule.join(baseFullUrl,path)) + ".js").replace(/\\/g,"/");
		inversePaths[path] = name;
		inversePaths[fullPath] = name;
	}
};

function loadMainConfig(options, config) {
	var ret = null, mainConfigFileContents;
	if( config && config.mainConfigFile ) {
		if( typeof(options.makeBuildRelativePath) !== "function" ) throw new Error("options should contain a method makeBuildRelativePath()");
		mainConfigFileContents = fs.readFileSync(options.makeBuildRelativePath(config.mainConfigFile), {encoding:"utf8"});
		ret = evalMainConfig();
	}
	return ret;
	
	function evalMainConfig() {
		var realRequire = require, requirejs, originalObject, config;
		originalObject = require = requirejs = {
			config: function(cfg) { config = cfg; } // configuration with the `require.config(...)` or `requirejs.config(...)` case
		};
		eval(mainConfigFileContents);
		if( require !== originalObject ) config = require; // configuration with the `var require = ...` case
		else if( requirejs !== originalObject ) config = requirejs; // configuration with the `var requirejs = ...` case
		require = realRequire;
		return config;
	}
}


module.exports = mapPathInverse;
