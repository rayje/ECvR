// tahoeStartIntroducer
var Remote = require('../remote'),
	util = require('util'),
	tahoeCommand = require('./tahoeCommand');


function tahoeStartIntroducer(config) {
	tahoeCommand.call(this, config);

	var remote = new Remote(config.stor);

	this.run = function(options) {
		var nodeAddress = options.startInt;

		var command = 'tahoe create-introducer -d .tahoe-int && tahoe start -d .tahoe-int';

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
