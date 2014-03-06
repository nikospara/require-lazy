define(["jquery"], function(jquery) {
	"use strict";

	return {
		start: function(containerElement) {
			jquery(containerElement).html("<span>M3 (I dont care for D0)</span>");
		},
		
		stop: function() {
//			return true;
		}
	};
});
