// storGet
var Remote = require('../remote'),
	util = require('util'),
	command = require('./command');

function storGet(config) {
	command.call(this, config);

	var remote = new Remote(config.stor);

	this.run = function(options) {
		if (!options.hasOwnProperty('fileKey')) {
					throw new Error('Missing required parameter: fileKey');
		}

		var instanceId = options.get;
		var address = this.getInstanceAddress(instanceId);
		this.doTheWork(options.fileKey, address);
	};

	this.doTheWork = function(fileKey, instanceAddress) {
		var command = 'stor -c -a GET -i ' +  fileKey;
		console.log(command);

		remote.runCommand(command, instanceAddress, function(err, result) {
			console.log('====================');
			console.log(command);
			console.log("Server: " + instanceAddress);
			console.log('--------------------');

			if (err) {
				console.log('ERROR Executing GET');
				if (err.code) {
					console.log('Error Code:', err.code);
				}
				
				if (err.signal) {
					console.log('Signal:', err.signal);
				}
			} else {
				console.log('SUCCESS');
			}

			if (result != undefined && result.length > 0) {
				console.log(result);	
			}

			console.log('====================');
		});
	};

};

util.inherits(storGet, command);

module.exports = storGet;
