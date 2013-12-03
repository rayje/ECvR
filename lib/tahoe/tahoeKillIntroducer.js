// tahoeKillntroducer
var Remote = require('../remote'),
	util = require('util'),
	tahoeCommand = require('./tahoeCommand');


function tahoeKillIntroducer(config) {
	tahoeCommand.call(this, config);

	var remote = new Remote(config.stor);

	this.run = function(options) {
		var nodeAddress = options.killInt;

		var command = 'tahoe stop -d .tahoe-int && rm -rf .tahoe-int';

		remote.runCommand(command, nodeAddress, function(err, result) {
			console.log('====================');
			console.log(nodeAddress);
			console.log('--------------------');
			if (err) {
				console.log('ERROR Stopping Introducer Node');
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

util.inherits(tahoeKillIntroducer, tahoeCommand);

module.exports = tahoeKillIntroducer;
