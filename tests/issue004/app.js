var
	fs = require("fs"),
	express = require("express"),
	app = express();

// get a fresh copy of the files
copyFileSync("../../src/lib/lazy.js", __dirname + "/public/scripts/lib/lazy.js");
copyFileSync("../../src/lib/lazy-builder.js", __dirname + "/public/scripts/lib/lazy-builder.js");
copyFileSync("../../src/lib/promise-adaptor-jquery.js", __dirname + "/public/scripts/lib/promise-adaptor-jquery.js");

app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));

app.use(express.static(__dirname + '/build'));

app.listen(8110);
console.log("Server running at http://localhost:8110 - get app.html or app-built.html");

function copyFileSync(srcFile, destFile) {
	var encoding = "UTF-8", content = fs.readFileSync(srcFile, encoding);
	fs.writeFileSync(destFile, content, encoding);
}
