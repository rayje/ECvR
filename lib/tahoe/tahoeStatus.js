// tahoeStatus
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
			instance.running = false;

			getStatus(instance.ipAddress, function(err, result){
				debug(instance.ipAddress,'processing');
				if (err) {
					if (err.code && err.code > 1) {
						debug(instance.ipAddress,'error');
						return callback(err);
					}
				}

				if (result) {
					var lines = result.split('\n');
					for (var i=0;i<lines.length;i++) {
						if (lines[i].indexOf('.tahoe') > -1) {
							debug(instance.ipAddress, 'running');
							instance.running = true;
						}
					}
				}

				debug(instance.ipAddress,'complete');
				callback();
			});
		}

		function onComplete(err){
			debug('all complete');

			var keys = ['instanceId', 'keyName', 'ipAddress', 'privateIpAddress', 'running'];

			if (err) {
				if (err.code) {
					if (err.code === 1) {
						instances.printResults(instanceData, keys);
						return;
					}

					console.log('Error Code:', err.code);
				}

				if (err.signal) {
					console.log('Signal:', signal);
				}

				return;
			}

			instances.printResults(instanceData, keys);
		}

		async.each(instanceData, iterator, onComplete);
	};

	function getStatus(instanceAddress, callback) {
		var command = 'pgrep -lf tahoe';

		debug(instanceAddress, 'started');
		remote.runCommand(command, instanceAddress, function(err, result) {
			debug(instanceAddress, 'result');
			if (err) {
				return callback(err);
			}

			callback(null, result);
		});
	}

};