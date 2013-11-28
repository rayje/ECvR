module.exports = function(config) {

	this.run = function(options) {
		var nodeAddress = options.kill;

		console.log('Stopping storage node', nodeAddress);
	};

};