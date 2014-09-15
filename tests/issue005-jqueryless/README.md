Verify that jQuery is not required
==================================

The `promise-adaptor` module abstracts the actual promises library used. However references to jQuery
promises were found inside the code (see [issue 5](https://github.com/nikospara/require-lazy/issues/5)).

This test verifies that `require-lazy` can run independently of jQuery.

It also demonstrates how simple it is to create a new promise adaptor (here, as an example, [kriskowal/q](https://github.com/kriskowal/q)).

How to make a new promise-adaptor
---------------------------------

1. Make sure the promises implementation is accessible (here it is in `scripts/lib/q.js`)
2. Create the adaptor exposing the following methods (here `scripts/main/promiseAdaptorQ.js`):
	- `makeDeferred: function()`: Create a deferred object
	- `makePromise: function(deferred)`: Receive a deferred object, returned by a previous call to `makeDeferred()`, and derive a promise out of it
	- `all: function(promises_array)`: Receive a promises array, return a promise that is resolved with an array of the resolved values, when all are resolved
3. In your require configuration, alias your adaptor as `"promise-adaptor"` under paths (here in `scripts/require-cfg.js`):

		paths: {
			...
			"promise-adaptor": "main/promiseAdaptorQ"
		}
