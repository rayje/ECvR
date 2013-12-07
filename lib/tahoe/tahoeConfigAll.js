// tahoeConfigAll
var util = require('util'),
	Remote = require('../remote'),
	tahoeCommand = require('./tahoeCommand'),
	async = require('async'),
	noop = function(){},
	TahoeConfig = require('./tahoeConfig');

function tahoeConfigAll(config) {
	tahoeCommand.call(this, config);

	var remote = new Remote(config.stor);
	var debug = (config.debug) ? console.log : noop;
	var tahoeConfig = new TahoeConfig(config);

	this.run = function(options) {
		var addresses = this.getAllAddresses(getExcludes(options, this));
		var configs = tahoeConfig.getConfigs(options);
		var listConfig = options.listConfig || false;

		function iterator(address, callback) {
			debug(address, configs);

			tahoeConfig.doUpdate(address, configs, listConfig, function(err) {
				debug(address, 'updated');
				callback(err);
			});
		}

		function onComplete(err) {
			if (err) {
				this.logError(err);
				return;
			}

			console.log('Update complete');
		}

		async.each(addresses, iterator, onComplete);
	
	};

	function getExcludes(options, self) {
		var excludes;
		if (options.excludes && typeof options.excludes === 'string') {
			excludes = options.excludes.split(',');
			for (var i=0;i<excludes.length;i++){
				excludes[i] = self.getInstanceAddress(excludes[i]);
			}
			debug("Excluding:", excludes);
		}
		return excludes;
	}


}

util.inherits(tahoeConfigAll, tahoeCommand);

module.exports = tahoeConfigAll;