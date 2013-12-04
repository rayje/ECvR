// tahoeGet
var Remote = require('../remote'),
	util = require('util'),
	tahoeCommand = require('./tahoeCommand'),
	path = require('path')
	noop = function(){};

function tahoeGet(config) {
	tahoeCommand.call(this, config);

	var remote = new Remote(config.stor);
	var debug = (config.debug) ? console.log : noop;

	this.run = function(options) {
		if (!options.hasOwnProperty('filename')) {
			throw new Error('Missing required parameter: filename');
		}

		var instanceId = options.get;
		var address = this.getInstanceAddress(instanceId);
		var filename = options.filename;
		var basename = path.basename(filename);

		var command = 'tahoe get tahoe:' + basename;
		debug(command);
		remote.runCommand(command, address, function(err, result) {
			if (err) {
				console.log('ERROR Executing GET');
		
				if (err.code) {
					console.log('Error Code:', err.code);
				}
				
				if (err.signal) {
					console.log('Signal:', err.signal);
				}

				return;
			}

			debug('Tahoe GET:', address, 'SUCCESS');
			if (result && result.length > 0) {
				console.log(result);
			}
		});
	};

};

util.inherits(tahoeGet, tahoeCommand);
module.exports = tahoeGet;