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

	this.createNode = function(instanceAddress, callback) {
		var command = 'if [ ! -d ".tahoe" ]; then tahoe create-node .tahoe; fi'
		debug(instanceAddress, command);

		remote.runCommand(command, instanceAddress, function(err, result) {
			if (callback) {
				callback(err, result);
				return;
			}

			console.log('====================');
			console.log(instanceAddress);
			console.log('--------------------');
			if (err) {
				console.log('ERROR Creating Storage Node');
				self.logError(err);
			} else {
				console.log('Storage node created:', instanceAddress);
			}

			if (result && result.length > 0) {
				console.log(result);	
			}
			console.log('====================');
		});
	};

};

util.inherits(createStorageNode, tahoeCommand);

module.exports = createStorageNode;