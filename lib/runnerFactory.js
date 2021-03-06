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
		} else if (options.status) {
			return require('./commands/storStatus');
		} else if (options.put) {
			return require('./commands/storPut');
		} else if (options.get) {
			return require('./commands/storGet');
		} else if (options.getUsage) {
			return require('./commands/storGetUsage');
		} else if (options.createStopFile) {
			return require('./commands/storCreateStopFile');
		} else if (options.stopN) {
			return require('./commands/storStopNInstances');
		}
	}
};
