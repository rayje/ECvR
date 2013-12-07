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
		} else if (options.startAll) {
			return require('./tahoe/startAllStorageNodes');
		} else if (options.put) {
			return require('./tahoe/tahoePut');
		} else if (options.get) {
			return require('./tahoe/tahoeGet');
		} else if (options.config) {
			return require('./tahoe/tahoeConfig');
		} else if (options.list) {
			return require('./tahoe/tahoeList');
		} else if (options.create) {
			return require('./tahoe/tahoeCreateStorageNode');
		} else if (options.listAliases) {
			return require('./tahoe/tahoeListAliases');
		} else if (options.createAliases) {
			return require('./tahoe/tahoeCreateAliases');
		}

	}

};
