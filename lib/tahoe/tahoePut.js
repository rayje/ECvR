// tahoePut
var Remote = require('../remote'),
	util = require('util'),
	tahoeCommand = require('./tahoeCommand'),
	path = require('path')
	noop = function(){};

function tahoePut(config) {
	tahoeCommand.call(this, config);

	var remote = new Remote(config.stor);
	var debug = (config.debug) ? console.log : noop;

	this.run = function(options) {
		if (!options.hasOwnProperty('filePath')) {
			throw new Error('Missing required parameter: filePath');
		}

		var instanceId = options.put;
		var address = this.getInstanceAddress(instanceId);
		var localPath = options.filePath;
		var basename = path.basename(localPath);
		var remotePath = '/tmp/' + basename;
		var putOptions = { step: logStep };

		debug(address, 'putting file');
		remote.put(address, localPath, remotePath, putOptions, function(err) {
			if (err) {
				console.log('Error:', err);
				return;
			}

			debug(address, 'Copied file', 'local:', localPath, 'to remote:', remotePath);

			var command = 'tahoe put ' + remotePath + ' tahoe:' + basename;
			debug(address, command);

			remote.runCommand(command, address, function(err, result) {
				if (err) {
					console.log('ERROR Executing PUT');
			
					if (err.code) {
						console.log('Error Code:', err.code);
					}
					
					if (err.signal) {
						console.log('Signal:', err.signal);
					}

					return;
				}

				console.log('Tahoe PUT:', address, 'SUCCESS');
				if (result && result.length > 0) {
					console.log(result);
				}
			});
		});
	};

	function logStep(totalTransferred, chunk, total) {
		debug('STEP::', 'transfered', totalTransferred, 'chunk', chunk, 'total', total);
	}


};

util.inherits(tahoePut, tahoeCommand);
module.exports = tahoePut;