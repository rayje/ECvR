module.exports = {
	
	getRunner: function(options) {

		if (options.kill) {
			return require('./tahoe/stopStorageNode');
		} else if (options.killAll) {
			return require('./tahoe/stopAllStorageNodes');
		} else if (options.status) {
			return require('./tahoe/tahoeStatus');
		}

	}

};