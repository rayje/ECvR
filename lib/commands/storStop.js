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

		var resultString = '';
		remote.run(command, instanceAddress, function(err, result) {
			if (err) {
				console.log('got error', err);
				return callback(err);
			}

			resultString += result.toString();
		}, function(code, signal) {
			console.log('====================');
			console.log(instanceAddress);
			console.log('--------------------');
			if (code !== 0) {
				console.log('ERROR Stopping Stor');
				if (code !== undefined) {
					console.log('Error Code:', code);
				}

				if (signal !== undefined) {
					console.log('Signal:', signal);
				}
			} else {
				console.log('SUCCESS');
			}

			if (resultString.length > 0) {
				console.log(resultString);	
			}
			console.log('====================');
		});
	};

};

util.inherits(storStop, command);

module.exports = storStop;