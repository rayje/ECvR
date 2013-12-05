// tahoeList
var Remote = require('../remote'),
	util = require('util'),
	tahoeCommand = require('./tahoeCommand'),
	noop = function(){};

function tahoeList(config) {
	tahoeCommand.call(this, config);

	var remote = new Remote(config.stor);
	var debug = (config.debug) ? console.log : noop;

	this.run = function(options) {
		var instanceId = options.list;
		var address = this.getInstanceAddress(instanceId);

		var command = 'tahoe ls tahoe:';
		debug(command);
		remote.runCommand(command, address, function(err, result) {
			if (err) {
				console.log('ERROR Executing List');
		
				if (err.code) {
					console.log('Error Code:', err.code);
				}
				
				if (err.signal) {
					console.log('Signal:', err.signal);
				}

				return;
			}

			console.log('List:', address);
			console.log('---------------------');
			if (result && result.length > 0) {
				console.log(result);
			}
		});
	};

};

util.inherits(tahoeList, tahoeCommand);
module.exports = tahoeList;