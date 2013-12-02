module.exports = {
	
	getRunner: function(options) {

		if (options.kill) {
			return require('./tahoe/stopStorageNode');
		} else if (options.killAll) {
			return require('./tahoe/stopAllStorageNodes');
		}

	}

};