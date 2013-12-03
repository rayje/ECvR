module.exports = {
	
	getRunner: function(options) {

		if (options.kill) {
			return require('./tahoe/stopStorageNode');
		} else if (options.killAll) {
			return require('./tahoe/stopAllStorageNodes');
		} else if (options.status) {
			return require('./tahoe/tahoeStatus');
		} else if (options.capture) {
			return require('./tahoe/tahoeMeasureStorage');
		} else if (options.startInt) {
			return require('./tahoe/tahoeStartIntroducer');
		} else if (options.killInt) {
			return require('./tahoe/tahoeKillIntroducer');
		}

	}

};
