var path = require("path");

exports.config = {
	// this should match the corresponding require.config.map entry
	libLazy: "lib/lazy",
	basePath: path.normalize(path.join(__dirname, "..", "public")),
	outputBaseDir: path.normalize(path.join(__dirname, "..", "build")),
	makeBuildRelativePath: function(x) {
		return path.normalize(path.join(__dirname, x));
	}
};
