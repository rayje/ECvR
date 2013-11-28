// storStart
var Remote = require('../remote');

module.exports = function(config) {

	var remote = new Remote(config.stor);

	this.run = function(options) {
		var instanceId = options.start;
		var address = getInstanceAddress(instanceId);

		this.startStor(address, options);
	};

	this.startStor = function(instanceAddress, options) {
		var ringServer = options.ringServer;
		var command = 'stor -s -p ' + ringServer;

		if (options.capacity) {
			command += ' -m ' + options.capacity;
		}

		if (options.storage) {
			command += ' -d ' + options.storage;
		}

		if (options.replication) {
			command += ' -r ' + options.replication;
		}

		remote.run(command, instanceAddress, function(err, result) {
			if (err) {
				console.log('got error', err);
				return callback(err);
			}

			console.log(result.toString());
		}, function(code, signal) {
			if (code === 0) {
				console.log('success');
			} else {
				console.log('error', code, signal);
			}
		});
	};

	function getInstanceAddress(instanceId) {
		return instanceId;
	}
};