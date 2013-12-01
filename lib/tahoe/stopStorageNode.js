// stopStorageNode
var Remote = require('../remote'),
	util = require('util'),
	tahoeCommand = require('./tahoeCommand');

function stopStorageNode(config) {
	tahoeCommand.call(this, config);

	var remote = new Remote(config.stor);

	this.run = function(options) {
		var nodeAddress = options.kill;

		var address = this.getInstanceAddress(nodeAddress);

		this.stopNode(address);
	};

	this.stopNode = function(instanceAddress) {
		var command = 'tahoe stop .tahoe'

		remote.runCommand(command, instanceAddress, function(err, result) {
			console.log('====================');
			console.log(instanceAddress);
			console.log('--------------------');
			if (err) {
				console.log('ERROR Stopping Storage Node');
				if (err.code) {
					console.log('Error Code:', err.code);
				}

				if (err.signal) {
					console.log('Signal:', err.signal);
				}
			} else {
				console.log('SUCCESS');
			}

			if (result.length > 0) {
				console.log(result);	
			}
			console.log('====================');
		});
	};

};

util.inherits(stopStorageNode, tahoeCommand);

module.exports = stopStorageNode;