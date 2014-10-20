Using the `map` config option to alias the `lazy` module
========================================================

Until now (October 2014) the `lazy` module was aliased using the `paths` config option as follows:

	require.config({
		...,
		paths: {
			...,
			"lazy": "lib/lazy",
			...
		},
		...
	});

This is abusing the `paths` config; a more preferable way is using the `map` config as:

	require.config({
		...
		map: {
			"*": {
				"lazy": "lib/lazy"
			}
		},
		...
	});
