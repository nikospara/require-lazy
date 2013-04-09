// find dependencies
var
	rjs = require("./lib/r.js"),
	path = require("path"),
	extend = require("./lib/extend"),
	shared = require("./shared"),

	LIB_LAZY = "lazy",
	PREFIX_LAZY = LIB_LAZY + "!";


function findDeps(options, config, callback) {
	var entryModule = options.entryModule || config.name;
	
	options = extend(true, {}, options);
	options.baseUrl = config.baseUrl;
	
	config = extend(true, {}, config);
	// deleting these two signals single file optimization
	delete config.appDir;
	delete config.dir;
	// make it explicit that no optimization must be done at this point for faster execution
	config.optimize = "none";
	config.baseUrl = path.normalize(path.join(options.basePath, config.baseUrl));
	
	buildAllModules(options, config, entryModule, callback);
}

function buildAllModules(options, config, entryModule, callback) {
	var modules = {}, modulesToCompile = [];
	
	buildModule(entryModule, null);
	
	function buildModule(moduleName, parentModuleName) {
		// do not write anything at this phase
		config.out = function(text) {};
		config.name = moduleName;
		if( parentModuleName != null ) config.exclude = [LIB_LAZY];
		rjs.optimize(config, function(buildResponse) {
			handleBuildResponse(buildResponse, parentModuleName);
			var nextModule = modulesToCompile.shift();
			while( typeof(nextModule) !== "undefined" && modules[nextModule.name] != null ) {
				if( modules[nextModule.name].parents.indexOf(nextModule.parentName) < 0 ) {
					modules[nextModule.name].parents.push(nextModule.parentName);
				}
				nextModule = modulesToCompile.shift();
			}
			if( typeof(nextModule) !== "undefined" ) {
				buildModule(nextModule.name, nextModule.parentName);
			}
			else {
				callback(modules);
			}
		}, function(err) {
			console.log(moduleName + " - " + err);
		});
	}
	
	function handleBuildResponse(buildResponse, parentModuleName) {
		var a = buildResponse.split("\n"),
			storing = false,
			i, moduleName;
		
		for( i = 0; i < a.length; i++ ) {
			if( storing && a[i].trim() !== "" ) {
				if( a[i].indexOf(config.baseUrl) === 0 ) moduleName = a[i].substring(config.baseUrl.length, a[i].length-(".js".length));
				else moduleName = a[i];
				if( moduleName === config.name ) storing = false; // last line in dependencies is the module being compiled, do not add it to deps
				else {
					if( moduleName.indexOf(PREFIX_LAZY) === 0 ) {
						moduleName = moduleName.substring(PREFIX_LAZY.length);
						modulesToCompile.push({
							name: moduleName,
							parentName: config.name
						});
					}
					else modules[config.name].deps.push(moduleName);
				}
			}
			else if( a[i].indexOf("-----") === 0 ) {
				storing = true;
				modules[config.name] = {
					parents: parentModuleName != null ? [parentModuleName] : [],
					deps: []
				};
			}
		}
	}
}


module.exports = findDeps;
