// tahoeListAliases
var Remote = require('../remote'),
	util = require('util'),
	noop = function(){},
	async = require('async'),
	tahoeCommand = require('./tahoeCommand');

function listAliases(config) {
	tahoeCommand.call(this, config);

	var remote = new Remote(config.stor);
	var debug = (config.debug) ? console.log : noop;

	this.run = function(options) {
		var instanceData = this.getInstanceData();
		var self = this;

		function iterator(instance, callback) {
			instance.aliases = '';

			var instanceAddress = instance.ipAddress;
			var command = 'tahoe list-aliases';
			debug(instanceAddress, command);

			remote.runCommand(command, instanceAddress, function(err, result) {
				if (err) {
					err['instance'] = instanceAddress;
					callback(err);
					return;
				}

				if (result && result.length > 0) {
					var alias = strip(result).split(/ /);
					if (alias.length >= 1) { 
						instance.aliases = alias[0];
					} else {
						instance.aliases = result;
					}
				} else {
					instance.aliases = 'No Aliases';
				}

				callback();
			});
		}

		function onComplete(err) {
			debug('all complete');

			var keys = ['instanceId', 'keyName', 'ipAddress', 'privateIpAddress', 'aliases'];

			if (err) {
				if (err.instanceAddress) {
					console.log("Error:", err.instanceAddress);
				}

				if (err.code) {
					console.log('Error Code:', err.code);
				}

				if (err.signal) {
					console.log('Signal:', signal);
				}

				return;
			}

			self.printResults(instanceData, keys);
		}

		async.each(instanceData, iterator, onComplete);
		
	};

	function strip(str) {
   		return str.replace(/(\r\n|\n|\r)/gm,"").trim();
   	}

};

util.inherits(listAliases, tahoeCommand);

module.exports = listAliases;