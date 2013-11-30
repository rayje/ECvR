// storStatus
var Instances = require('../instances'),
	Remote = require('../remote'),
	async = require('async');

module.exports = function(config) {

	var remote = new Remote(config.stor);	
	var instances = new Instances();

	this.run = function() {
		var instanceData = instances.getInstanceData();

		async.each(instanceData, function(instance, callback){
			instance.running = false;

			getStatus(instance.ipAddress, function(err, result){
				if (err) {
					return callback(err);
				}

				var lines = result.split('\n');
				for (var i=0;i<lines.length;i++) {
					if (lines[i].indexOf('Server') > -1) {
						instance.running = true;
					}
				}

				callback();
			});
		}, function(err){
			var keys = ['instanceId', 'keyName', 'ipAddress', 'privateIpAddress', 'running'];
			instances.printResults(instanceData, keys);
		});
	};

	function getStatus(instanceAddress, callback) {
		var command = 'jps';

		var resultString = '';
		remote.run(command, instanceAddress, function(err, result) {
			if (err) {
				console.log('got error', err);
				return callback(err);
			}

			resultString += result.toString();
		}, function(code, signal) {
			if (code === 0) {
				callback(null, resultString);
			} else {
				callback({code:code,signal:signal});
			}
		});
	}

};