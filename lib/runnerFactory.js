module.exports = {
	
	getRunner: function(options) {

		if (options.start) {
			return require('./commands/storStart');
		} else if (options.startAll) {
			return require('./commands/storStartAll');
		} else if (options.stop) {
			return require('./commands/storStop');
		} else if (options.stopAll) {
			return require('./commands/storStopAll');
		}

	}

};
