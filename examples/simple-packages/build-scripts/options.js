var path = require("path");

exports.config = {
	basePath: path.normalize(path.join(__dirname, "..", "public")),
	outputBaseDir: path.normalize(path.join(__dirname, "..", "build")),
	makeBuildRelativePath: function(x) {
		return path.normalize(path.join(__dirname, x));
	}
};
