module.exports = {
	
	getRunner: function(options) {

		if (options.kill) {
			return require('./tahoe/stopStorageNode');
		}

	}

};