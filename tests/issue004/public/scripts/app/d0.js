define(["./id0","./d1"], function(id0,d1) {
	"use strict";

	return {
		name: function() {
			return "D0+" + id0.name + " D1:" + d1.name;
		}
	};
});
