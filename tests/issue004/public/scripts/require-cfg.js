require.config({
	baseUrl: "scripts",
	
	paths: {
		"text": "lib/text",
		"lazy": "lib/lazy",
		"lazy-builder": "lib/lazy-builder",
		"promise-adaptor": "lib/promise-adaptor-jquery"
	},
	
	deps: ["app/bug3"] //  Check for bug from issue 3: https://github.com/nikospara/require-lazy/issues/3
});
