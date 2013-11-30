// storStop
var Remote = require('../remote'),
	util = require('util'),
	command = require('./command');

function storStop(config) {
	command.call(this, config);

	var remote = new Remote(config.stor);

	this.run = function(options) {
		var instanceId = options.stop;
		var address = this.getInstanceAddress(instanceId);

		this.stopStor(address);
	};

	this.stopStor = function(instanceAddress) {
		var command = 'stor -k';

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

util.inherits(storStop, command);

module.exports = storStop;