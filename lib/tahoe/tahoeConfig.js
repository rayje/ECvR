// tahoeConfig
var Remote = require('../remote'),
	sprintf = require('sprintf-js').sprintf,
	util = require('util'),
	tahoeCommand = require('./tahoeCommand'),
	noop = function(){},
	async = require('async'), 
	_ = require('underscore');

function tahoeConfig(config) {
	tahoeCommand.call(this, config);

	var sed = 'sed -i.bak s/%s/%s\\ =\\ %s/g .tahoe/tahoe.cfg';
	var remote = new Remote(config.stor);
	var debug = (config.debug) ? console.log : noop;
	var self = this;

	this.run = function(options) {
		var instanceId = options.config;
		var address = this.getInstanceAddress(instanceId);
		var configs = this.getConfigs(options);
		var listConfig = options.listConfig || false;

		this.doUpdate(address, configs, listConfig);
	};

	this.doUpdate = function(address, configs, listConfig, callback) {
		function iterator(key, callback) {
			getRemoteConfig(address, key, function(err, result) {
				if (err) {
					callback(err);
					return;
				}

				debug(address, 'remote config:', result);

				if (!listConfig) {
					var remoteConfig = normalize(result);
					updateConfig(address, remoteConfig, normalize(key), normalize(configs[key]));	
				} else {
					console.log(address, strip(result));
					console.log(address, 'update', normalize(key) + ' = ' + normalize(configs[key]));
				}

				callback();
			});
		}

		function onComplete(err) {
			if (callback) {
				callback(err);
			} else if (err) {
				self.logError(err);
			}
		}

		async.each(_.keys(configs), iterator, onComplete);
	};

	function updateConfig(address, remoteConfig, key, value) {
		var command = sprintf(sed, remoteConfig, key, value);
		debug(address, 'command', command);

		remote.runCommand(command, address, function(err, result) {
			if (err) {
				console.log('Error update remote config value');
				self.logError(err);
				return;
			}

			console.log('Updated', key, 'with', value);
			if (result && result.length > 0) {
				console.log(result);	
			}
		});
	}

	function getRemoteConfig(address, key, callback) {
		var command = 'grep ' + key + ' .tahoe/tahoe.cfg; sleep 1';
		debug(address, command);

		remote.runCommand(command, address, function(err, result) {
			if (err) {
				console.log('Error get remote config value');
				self.logError(err);
				return;
			}

			callback(err, strip(result));
		});
	}

	this.getConfigs = function(options) {
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

		if (options.port) {
			configs['tub.port'] = normalize(options.port);
		}

		return configs;
   	}

   	function normalize(str) {
   		return str
   			.replace(/[\/]/g, "\\$&")
   			.replace(/[\s\-\[\]\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
   	}

   	function strip(str) {
   		return str.replace(/(\r\n|\n|\r)/gm,"");
   	}


};

util.inherits(tahoeConfig, tahoeCommand);
module.exports = tahoeConfig;