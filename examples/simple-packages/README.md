**This example is deprecated due to a misconception, see [this issue](https://github.com/jrburke/requirejs/issues/1048). DO NOT USE IT!!!**

Mod of the simple example of Require-Lazy utilizing the packages feature
========================================================================

This example is a modification of the simple example to use the packages feature of require.js (see [here](http://requirejs.org/docs/api.html#packages)).

Setup
-----
Same as the "simple" example.

What's going on?
================

The three main modules of out application, `app/m1`, `app/m2`, `app/m3` are now defined as packages.
The files `app/m*.js` have been moved to `app/m*/main.js` and the configuration file (`scripts/require-cfg.js`) is updated accordingly:

	require.config({
		// ...
		packages: ["app/m1", "app/m2", "app/m3"],
		// ...
	});
