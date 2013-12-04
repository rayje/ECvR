// storPut
var Remote = require('../remote'),
	util = require('util'),
	command = require('./command'),
	path = require('path');

function storPut(config) {
	command.call(this, config);

	var remote = new Remote(config.stor);

	this.run = function(options) {
		if (!options.hasOwnProperty('filePath')) {
					throw new Error('Missing required parameter: filePath');
		}
		
		var address = this.getInstanceAddress(options.put);
		var localPath = path.basename(options.filePath);	
		var remotePath = '/tmp/' + localPath;

		remote.put(address, options.filePath, remotePath, options,
			function(err){
				if(err){
					console.log("Error:", err);	
					return;
				}

				console.log("Copied file: ", localPath, remotePath);
				this.doTheWork(remotePath, address);
			}
		);
	};

	this.doTheWork = function(filePath, instanceAddress) {
		var command = 'stor -c -a PUT -f ' +  filePath;
		console.log(command);

		remote.runCommand(command, instanceAddress, function(err, result) {
			console.log('====================');
			console.log(command);
			console.log("Server: " + instanceAddress);
			console.log('--------------------');

			if (err) {
				console.log('ERROR Executing PUT');
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

util.inherits(storPut, command);

module.exports = storPut;
