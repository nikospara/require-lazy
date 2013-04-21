require-lazy
============

A RequireJS plugin for lazy loading AMD modules packaged with r.js, automatically splitting packaged
code in bundles, cache-breaking the bundles only when the code changes, and defining module metadata
and module discovery in Javascript applications.

Quick Example
-------------

Main module (`main.js`):

	define(["lazy!modules/m1", "lazy!modules/m2", "lazy!text!templates/faq.html"],
	function(m1, m2, faq) {
		...
	});

In the simplest case where the modules `main`, `m1`, `m2` have no common dependencies, Require-Lazy
build scripts will create 4 separate bundles. One will contain `main.js` and `lazy.js`, one `m1.js`
and all its dependencies, one `m2.js` and all its dependencies and one `text.js` and `faq.html`.

The URL for each module will look like:

	/scripts/app/m1-built.js?v=684beaf379a164c2d4044a74f22ffc6d

The `v` request parameter is a hash of the contents of the built file, used as cache-breaker.

The lazy plugin will replace each lazy module with a lazy stub. The stub has (for the time)
one method, `get()` that returns a promise for the real module:

	m1.get().done(function(m) {
		// here m is the real module
	});

A more detailed discussion and an example project setup can be found in the `examples/simple`
directory.

Dependencies
------------
This project requires, includes, or uses code from:

- [Node.js](http://nodejs.org/) (required for building the target app and running the examples)
- [requirejs](https://github.com/jrburke/requirejs)
- [almond](https://github.com/jrburke/almond)
- [lazyload](https://github.com/rgrove/lazyload/)
- [r.js](https://github.com/jrburke/r.js)
- [node.extend](https://github.com/dreamerslab/node.extend)
- [jQuery](http://jquery.com/) (dependency on Deferred implementation, can use any other library through adapter)
- [expressjs](http://expressjs.com/) (for serving the examples)

Development Status
------------------
This project is an idea in the early stages of development. While many things work, it is expected
that many more will not. Even worse, some things may not work *as* expected. Moreover the code is
not thoroughly tested yet.

Ideas, critisism, comments, code contributions are all welcome!
