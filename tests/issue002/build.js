/*jslint node: true, unparam: true, nomen: true */
/*global exec */

'use strict';

var fs = require("fs"),
	requireLazy = require("require-lazy"),
	path = require("path"),
	options = {
		basePath: './',
		outputBaseDir: './jsmin',
		makeBuildRelativePath: function (x) {
			return path.normalize(path.join(__dirname, x));
		}
	},
	config = {
		"appDir": "./",
		"baseUrl": "./js",
		"mainConfigFile": "./js/config.js",
		"dir": "../jsmin",
		"inlineText": true,
		"name": "main",
		"optimize": "none",
		"normalizeDirDefines": true
	};

// get a fresh copy of the files
copyFileSync("../../src/lib/lazy.js", __dirname + "/bower_components/require-lazy/lazy.js");
copyFileSync("../../src/lib/lazy-builder.js", __dirname + "/bower_components/require-lazy/lazy-builder.js");
copyFileSync("../../src/lib/promise-adaptor-jquery.js", __dirname + "/bower_components/require-lazy/promise-adaptor-jquery.js");

requireLazy.build(options, config, function (modules, pmresult) { // this callback is optional
	console.log("success");
}, function() { // this callback (the "errback") is also optional, but recomended
	var util = require("util");
	console.log("================  ERROR  ========================");
	console.log(util.inspect(arguments, {depth: null}));
});

function copyFileSync(srcFile, destFile) {
	var encoding = "utf8", content = fs.readFileSync(srcFile, encoding);
	fs.writeFileSync(destFile, content, encoding);
}
