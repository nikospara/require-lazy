// this is an example build script; several actions are for demonstration purposes
var
	fs = require("fs"),
	requireLazy = require("require-lazy"),
	options = require("./options.js").config,
	config = require("./app.build.json");

// get a fresh copy of the files
copyFileSync("../../../src/lib/lazy.js", __dirname + "/../public/scripts/lib/lazy.js");
copyFileSync("../../../src/lib/lazy-builder.js", __dirname + "/../public/scripts/lib/lazy-builder.js");
copyFileSync("../../../src/lib/promise-adaptor-jquery.js", __dirname + "/../public/scripts/lib/promise-adaptor-jquery.js");

requireLazy.build(options, config, function(modules, pmresult) { // this callback is optional
	var util = require("util"), path = require("path");
	fs.writeFileSync(path.join(options.outputBaseDir, "modules.js"), util.inspect(modules,{depth:null,colors:false}));
	fs.writeFileSync(path.join(options.outputBaseDir, "bundles.js"), util.inspect(pmresult.bundles,{depth:null,colors:false}));
	console.log("success");
	var bug3 = checkBug3(pmresult);
	if( bug3 ) console.log("BUG 3 occured: " + bug3);
	var modulePlacementError = validateAmdModulePlacement(modules, pmresult.bundles);
	if( modulePlacementError ) console.log("Misplaced AMD modules: " + util.inspect(modulePlacementError,{depth:null,colors:false}));
});

function copyFileSync(srcFile, destFile) {
	var encoding = "utf8", content = fs.readFileSync(srcFile, encoding);
	fs.writeFileSync(destFile, content, encoding);
}

/**
 * Check for bug from issue 3: https://github.com/nikospara/require-lazy/issues/3
 */
function checkBug3(pmresult) {
	var fileContents, i, bundlesArray = pmresult.bundles.bundlesArray;
	fileContents = fs.readFileSync("../build/scripts/main/main-built.js", {encoding:"utf8"});
	if( fileContents.indexOf("\tconsole.log(\"BUG 3\");") < 0 ) return "not found in main-built.js";
	for( i=0; i < bundlesArray.length; i++ ) {
		if( bundlesArray[i].exclusive || bundlesArray[i].includedIn ) continue;
		fileContents = fs.readFileSync("../build/scripts/bundles/" + bundlesArray[i].id + ".js", {encoding:"utf8"});
		if( fileContents.indexOf("\tconsole.log(\"BUG 3\");") >= 0 ) return "found in bundle " + bundlesArray[i].id;
	}
	return false;
}

function validateAmdModulePlacement(modules, bundles) {
	var util = require("util"), ret = null, bundleFiles, i;
	
	check("main/main");
	check("app/m1");
	check("app/m2");
	
	bundleFiles = fs.readdirSync("../build/scripts/bundles");
	for( i=0; i < bundleFiles.length; i++ ) {
		checkBundle(bundleFiles[i].substring(0,bundleFiles[i].length-3));
	}
	
	return ret;
	
	function check(moduleName) {
		var fileContents, name, b, depsToBundleMap = bundles.depsToBundleMap, re = /^\s*define\s*\(\s*["']([^"']*)["']/gm,
			res, module = modules[moduleName];
		fileContents = fs.readFileSync("../build/scripts/" + moduleName + "-built.js", {encoding:"utf8"});
		do {
			res = re.exec(fileContents);
			if( res ) {
				name = res[1];
				b = depsToBundleMap[name];
				if( b != null && !hasBundle(module,b.id) ) {
					addError(moduleName,name);
				}
			}
		} while( res );
	}
	
	function checkBundle(bundleId) {
		var fileContents, name, b, depsToBundleMap = bundles.depsToBundleMap, res, re = /^\s*define\s*\(\s*["']([^"']*)["']/gm;
		fileContents = fs.readFileSync("../build/scripts/bundles/" + bundleId + ".js", {encoding:"utf8"});
		do {
			res = re.exec(fileContents);
			if( res ) {
				name = res[1];
				b = depsToBundleMap[name];
				if( b != null && b.id !== bundleId ) {
					addError(bundleId,name);
				}
			}
		} while( res );
	}
	
	function addError(k,v) {
		if( ret == null ) ret = {};
		var list = ret[k];
		if( list == null ) {
			list = [];
			ret[k] = list;
		}
		list.push(v);
	}
	
	function hasBundle(module, bundleId) {
		var i;
		for( i=0; i < module.bundleDeps.length; i++ ) {
			if( module.bundleDeps[i].id === bundleId ) return true;
		}
		return false;
	}
}
