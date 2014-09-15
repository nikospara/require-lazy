define(["lib/q"], function(q) {
	"use strict";
	
	return {
		makeDeferred: function() {
			return q.defer();
		},
		makePromise: function(deferred) {
			return deferred.promise;
		},
		all: function(promises) {
			return q.all(promises);
		}
	};
});
