// storStart
var Remote = require('../remote'),
	util = require('util'),
	command = require('./command');

function storStart(config) {
	command.call(this, config);
	
	var remote = new Remote(config.stor);

	this.run = function(options) {
		if (!options.hasOwnProperty('ringServer')) {
			throw new Error('Missing required parameter: ringServer');
		}

		var instanceId = options.start;
		var address = this.getInstanceAddress(instanceId);

		this.startStor(address, options);
	};

	this.startStor = function(instanceAddress, options, callback) {
		var command = buildCommand(options);

		var resultString = '';
		remote.run(command, instanceAddress, function(err, result) {
			if (err) {
				console.log('got error', err);
				return callback(err);
			}

			resultString += result.toString();
		}, function(code, signal) {
			if (code === 0) {
				if (callback && typeof callback === 'function') {
					callback(null, resultString);
				} else {
					console.log(resultString);
					console.log('success');
				}
			} else {
				if (callback && typeof callback === 'function') {
					callback({code:code,signal:signal});
				} else {
					console.log('error', code, signal);	
				}
			}
		});
	};

	function buildCommand(options) {
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
		return command;
	}

};

util.inherits(storStart, command);
module.exports = storStart;