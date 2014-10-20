define([], function() {
	// See bug: https://github.com/nikospara/require-lazy/issues/3
	// This file is included through the `deps` option; it should be required
	// exactly once in the main bundle.
	console.log("BUG 3 - if this is printed more than once, then issue 3 is not solved");
	return { name: "bug3" };
});
