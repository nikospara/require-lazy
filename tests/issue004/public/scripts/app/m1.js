define(["jquery", "app/d0"], function(jquery, d0) {
	"use strict";

	return {
		start: function(containerElement) {
			jquery(containerElement).html("<span>M1 " + d0.name() + "</span>");
		},
		
		stop: function() {
//			return true;
		}
	};
});
