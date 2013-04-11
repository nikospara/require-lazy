var path = require("path");

exports.config = {
	basePath: path.normalize(path.join(__dirname, "..", "WebContent")),
	outputBaseDir: path.normalize(path.join(__dirname, "..", "build"))
};
