var
	fs = require("fs"),
	express = require("express"),
	app = express(),
	options = require("./build-scripts/options.js"),
	path = require("path"),
	shared = require("../../src/build-scripts/shared.js"),
	
	LIB_LAZY = "lazy";

// get a fresh copy of the files
copyFileSync("../../src/lib/lazy.js", __dirname + "/public/scripts/lib/lazy.js");
copyFileSync("../../src/lib/lazy-builder.js", __dirname + "/public/scripts/lib/lazy-builder.js");
copyFileSync("../../src/lib/promise-adaptor-jquery.js", __dirname + "/public/scripts/lib/promise-adaptor-jquery.js");

app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));

app.use(express.static(__dirname + '/build'));

app.get("/scripts/lazy-registry.js", getLazyRegistry);

app.listen(8110);
console.log("Server running at http://localhost:8110 - get app.html or app-built.html");


function copyFileSync(srcFile, destFile) {
	var encoding = "UTF-8", content = fs.readFileSync(srcFile, encoding);
	fs.writeFileSync(destFile, content, encoding);
}


function getLazyRegistry(req, res) {
	var modules, text, i, metadata, pmresult;
	
	modules = options.discoverModules();
	pmresult = makePmresult(modules);
	text = shared.createModulesRegistryText(pmresult, options, {
		inludeModuleName: false,
		generateBody: true,
		nullBundleDeps: true,
		writeBundleRegistrations: false
	});
	
	res.type("application/javascript");
	res.send(text);
	
	
	function makePmresult(modules) {
		var i, dummyParents = ["DUMMY"], pmresult = {
			modulesArray: []
		};
		
		for( i=0; i < modules.length; i++ ) {
			pmresult.modulesArray.push({
				name: modules[i],
				index: i,
				parents: dummyParents
			});
		}
		
		return pmresult;
	}
}
