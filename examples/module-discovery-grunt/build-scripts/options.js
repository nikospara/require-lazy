var
	path = require("path"),
	fs = require("fs");

exports.config = {
	basePath: path.normalize(path.join(__dirname, "..", "public")),
	outputBaseDir: path.normalize(path.join(__dirname, "..", "build")),
	discoverModules: discoverModules,
	retrieveMetaForModule: retrieveMetaForModule,
	makeBuildRelativePath: function(x) {
		return path.normalize(path.join(__dirname, "..", x));
	}
};

function discoverModules() {
	return ["app/m1", "app/m2", "app/m3"];
}

function retrieveMetaForModule(moduleName) {
	var
		 stat = null,
		 filename = path.normalize(path.join(__dirname, "../public/scripts/", moduleName + ".metadata.json")),
		 ret = null;
	try {
//		console.log("Looking for " + filename);
		stat = fs.statSync(filename);
	}
	catch(e) {
//		console.log("No metadata for " + moduleName);
	}
	if( stat !== null && stat.isFile() ) {
		try {
			ret = fs.readFileSync(filename);
			ret = JSON.parse(ret);
		}
		catch(e) {
			ret = null;
			console.log(e);
		}
	}
	return ret;
}
