// tahoeStartIntroducer
var Remote = require('../remote'),
	util = require('util'),
	tahoeCommand = require('./tahoeCommand'),
	noop = function(){};


function tahoeStartIntroducer(config) {
	tahoeCommand.call(this, config);

	var remote = new Remote(config.stor);
	var debug = (config.debug) ? console.log : noop;

	this.run = function(options) {
		var instanceId = options.startInt;
		var nodeAddress = this.getInstanceAddress(instanceId);

		var command = 'if [ ! -d ".tahoe-int" ]; then tahoe create-introducer -d .tahoe-int; fi; tahoe start -d .tahoe-int';
		debug(nodeAddress, command);

		remote.runCommand(command, nodeAddress, function(err, result) {
			console.log('====================');
			console.log(nodeAddress);
			console.log('--------------------');
			if (err) {
				console.log('ERROR Creating Introducer Node');
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

util.inherits(tahoeStartIntroducer, tahoeCommand);

module.exports = tahoeStartIntroducer;
