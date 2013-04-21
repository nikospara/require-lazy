Module discovery with Require-Lazy
==================================

This extends the simple example, adding module discovery and metadata capabilities. The "menu" of links at the top is now created dynamically, based on information about "discovered" modules.

Setup
-----
Same as the "simple" example.

What's going on?
================

Runtime
-------
The `lazyRegistry` is the module that stores information about modules. The `main/main` module depends on it, instead of depending explicitly on `app/m1`, `app/m2`, `app/m3`. It iterates over all modules as:

	var i, modules = lazyRegistry.getModules();
	for( i=0; i < modules.length; i++ ) {
		...
	}

And then activates a module as:

	var moduleName = ...;
	lazyRegistry.get(moduleName).then(startModule, reportError);

The `Stub` module returned by `lazyRegistry.getModule()` gives access to the module metadata, if any. In this application:

	for( i=0; i < modules.length; i++ ) {
		if( modules[i].metadata ... ) ...;
	}

Build-time
----------
In order for module discovery to work, both the build process and the server need to be modified.

The `options.js` exports two new functions, `discoverModules()` and `retrieveMetaForModule(moduleName)`. The first returns an array of dynamic module names. The user may choose to implement it in any way appropriate. For the needs of this example, it returns a static result.

The second function, `retrieveMetaForModule(moduleName)`, returns a JS object containing the metadata for the given module, or `null`. Again the implementation is up to the user. Here it tries to read a file named `moduleName.metadata.json`.

Server-side
-----------
The server needs to be able to generate the `lazyRegistry` module. Since the server is Node, the code of the build scripts is reused.
