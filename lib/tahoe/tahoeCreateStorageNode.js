// tahoeCreateStorageNode
var Remote = require('../remote'),
	util = require('util'),
	noop = function(){},
	tahoeCommand = require('./tahoeCommand');

function createStorageNode(config) {
	tahoeCommand.call(this, config);

	var remote = new Remote(config.stor);
	var debug = (config.debug) ? console.log : noop;

	this.run = function(options) {
		var nodeAddress = options.create;
		var address = this.getInstanceAddress(nodeAddress);

		this.createNode(address);
	};

	this.createNode = function(instanceAddress) {
		var command = 'if [ ! -d ".tahoe" ]; then tahoe create-node .tahoe; fi'
		debug(instanceAddress, command);

		remote.runCommand(command, instanceAddress, function(err, result) {
			console.log('====================');
			console.log(instanceAddress);
			console.log('--------------------');
			if (err) {
				console.log('ERROR Creating Storage Node');
				if (err.code) {
					console.log('Error Code:', err.code);
				}

				if (err.signal) {
					console.log('Signal:', err.signal);
				}
			} else {
				console.log('Storage node created:', instanceAddress);
			}

			if (result.length > 0) {
				console.log(result);	
			}
			console.log('====================');
		});
	};

};

util.inherits(createStorageNode, tahoeCommand);

module.exports = createStorageNode;