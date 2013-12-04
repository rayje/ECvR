// tahoeConfig
var Remote = require('../remote'),
	sprintf = require('sprintf-js').sprintf,
	util = require('util'),
	tahoeCommand = require('./tahoeCommand'),
	noop = function(){};

function tahoeConfig(config) {
	tahoeCommand.call(this, config);

	var sed = 'sed -i.bak s/%s/%s\\ =\\ %s/g .tahoe/tahoe.cfg';
	var remote = new Remote(config.stor);
	var debug = (config.debug) ? console.log : noop;

	this.run = function(options) {
		var instanceId = options.config;
		var address = this.getInstanceAddress(instanceId);
		var configs = getConfigs(options);

		for (var i in configs) {
			getRemoteConfig(address, i, function(err, result) {
				if (err) {
					logError(err);
					return;
				}

				debug(address, 'remote config:', result);

				if (!options.listConfig) {
					var remoteConfig = normalize(result);
					updateConfig(address, remoteConfig, i, configs[i]);
				} else {
					console.log(strip(result));
				}
			})

		}
	};

	function updateConfig(address, remoteConfig, key, value) {
		var command = sprintf(sed, remoteConfig, key, value);
		debug(address, command);

		remote.runCommand(command, address, function(err, result) {
			if (err) {
				console.log('Error get remote config value');
				logError(err);
				return;
			}

			console.log('Updated', key, 'with', value);
			if (result && result.length > 0) {
				console.log(result);	
			}
		});
	}

	function getRemoteConfig(address, key, callback) {
		var command = 'grep ' + key + ' .tahoe/tahoe.cfg';
		debug(address, command);

		remote.runCommand(command, address, function(err, result) {
			if (err) {
				console.log('Error get remote config value');
				logError(err);
				return;
			}

			callback(err, strip(result));
		});
	}

	function getConfigs(options) {
		var configs = {};

		if (options.storage) {
			configs['reserved_space'] = normalize(options.storage);
		}

		if (options.needed) {
			configs['shares.needed'] = normalize(options.needed);
		} 

		if (options.total) {
			configs['shares.total'] = normalize(options.total);
		} 

		if (options.happy) {
			configs['shares.happy'] = normalize(options.happy);
		}

		return configs;
   	}

   	function normalize(str) {
   		return str.replace(/[\s\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
   	}

   	function logError(err) {
   		if (err.code) {
			console.log('Error Code:', err.code);
		}
		
		if (err.signal) {
			console.log('Signal:', err.signal);
		}
   	}

   	function strip(str) {
   		return str.replace(/(\r\n|\n|\r)/gm,"");
   	}


};

util.inherits(tahoeConfig, tahoeCommand);
module.exports = tahoeConfig;