// tahoeMeasureStorage
var Instances = require('../instances'),
	Remote = require('../remote'),
	async = require('async'),
	noop = function(){};

module.exports = function(config) {

	var remote = new Remote(config.stor);	
	var instances = new Instances();
	var debug = (config.debug) ? console.log : noop;

	this.run = function() {
		var instanceData = instances.getInstanceData();

		function iterator(instance, callback){
			instance.storage = 0;

			measureStorage(instance.ipAddress, function(err, result){
				debug(instance.ipAddress,'processing');
				if (err) { 
					if (err.code && err.code > 1) {
						debug(instance.ipAddress,'error');
						return callback(err);
					}
				}

				debug(instance.ipAddress, 'success');

				if (result) {
					debug(instance.ipAddress, 'result', result);
					var parts = result.split(/\s+/);
					debug(instance.ipAddress, 'storage', parts[0]);
					instance.storage = parts[0];
				}

				debug(instance.ipAddress,'complete');
				callback();
			});
		}

		function onComplete(err){
			debug('all complete');

			if (err) {
				console.log('Error getting storage measurement');
				if (err.code) {
					console.log('Error Code:', err.code);
				}

				if (err.signal) {
					console.log('Signal:', signal);
				}

				return;
			}

			var keys = ['instanceId', 'keyName', 'ipAddress', 'privateIpAddress', 'storage'];
			instances.printResults(instanceData, keys);
		}

		async.each(instanceData, iterator, onComplete);
	};

	function measureStorage(instanceAddress, callback) {
		var command = 'if [ -d ".tahoe/storage" ]; then du -sb .tahoe/storage; else echo "0   .tahoe/storage"; fi; sleep 1';

		debug(instanceAddress, 'started', command);
		remote.runCommand(command, instanceAddress, function(err, result) {
			debug(instanceAddress, 'result');
			if (err) {
				return callback(err);
			}

			callback(null, result);
		});
	}

};