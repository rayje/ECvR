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

		remote.runCommand(command, instanceAddress, function(err, result) {
			console.log('====================');
			console.log(instanceAddress);
			console.log('--------------------');
			if (err) {
				console.log('ERROR Stopping Stor');
				if (err.code) {
					console.log('Error Code:', err.code);
				}

				if (err.signal) {
					console.log('Signal:', err.signal);
				}
			} else {
				console.log('SUCCESS');
			}

			if (result && result.length > 0) {
				console.log(result);	
			}
			console.log('====================');
		});
	};

};

util.inherits(storStop, command);

module.exports = storStop;