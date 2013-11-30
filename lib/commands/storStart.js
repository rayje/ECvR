// storStart
var Remote = require('../remote'),
	util = require('util'),
	command = require('./command');

function storStart(config) {
	command.call(this, config);
	
	var remote = new Remote(config.stor);

	this.run = function(options) {
		var instanceId = options.start;
		var address = this.getInstanceAddress(instanceId);

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

		command += '; sleep 10; jps';

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
};

util.inherits(storStart, command);

module.exports = storStart;