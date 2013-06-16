define(["app/dx", "./d5"],
function(dx, d5) {

return {
	render: function($e) {
		$e.text("From DM1.render() and " + d5.name);
	}
};

});
