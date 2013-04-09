// shared code
function removePluginsFromName(moduleName) {
	var index = moduleName.lastIndexOf("!");
	if( index >= 0 ) moduleName = moduleName.substr(index+1);
	return moduleName;
}


module.exports = {
	removePluginsFromName: removePluginsFromName
};
