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
});

function copyFileSync(srcFile, destFile) {
	var encoding = "utf8", content = fs.readFileSync(srcFile, encoding);
	fs.writeFileSync(destFile, content, encoding);
}

/**
 * Check for bug from issue 3: https://github.com/nikospara/require-lazy/issues/3
 */
function checkBug3(pmresult) {
	var fileContents, i, bundlesArray = pmresult.bundles.bundlesArray,
		STR_TO_SEARCH='\tconsole.log("BUG 3 - if this is printed more than once, then issue 3 is not solved");';
	fileContents = fs.readFileSync("../build/scripts/main/main-built.js", {encoding:"utf8"});
	if( fileContents.indexOf(STR_TO_SEARCH) < 0 ) return "not found in main-built.js";
	for( i=0; i < bundlesArray.length; i++ ) {
		if( bundlesArray[i].exclusive || bundlesArray[i].includedIn ) continue;
		fileContents = fs.readFileSync("../build/scripts/bundles/" + bundlesArray[i].id + ".js", {encoding:"utf8"});
		if( fileContents.indexOf(STR_TO_SEARCH) >= 0 ) return "found in bundle " + bundlesArray[i].id;
	}
	return false;
}
