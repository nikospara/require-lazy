Bug: Module in paths is placed in a bundle
==========================================

This is a test case for the following bug.

Bug
---
Setup:

- Let a module be given an alias through the `paths` configuration option. Here:

        paths: {
            ...
            "aliasedModule": "app/dm"
        }
- Let this module be required by more than one lazy loaded modules and no eager loaded modules. Here it is required by both lazy loaded modules, app/m1 and app/m2.
- The aliased module is placed in a bundle.

Bug:

The name of the module given by `r.js` and decided by `find-deps.js` is the real path; but the dependent modules still specify the aliased name as dependency, i.e.:

	// the dependency
	define("app/dm", [], function() {...});
	// dependent module
	define("app/m1", ["aliasedModule"], function(aliasedModule) {...});

The result is that Almond throws a `missing module` error.

Solution
--------
We now read the `mainConfigFile` specified in the build options, extract the `paths` configuration and perform an inverse paths mapping, before adding a module to the dependencies of another (the `deps` member array).

See `map-path-inverse.js`.
