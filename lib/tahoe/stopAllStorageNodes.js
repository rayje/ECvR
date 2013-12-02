// stopAllStorageNodes
var util = require('util'),
	tahoeCommand = require('./tahoeCommand'),
	StopStorageNode = require('./stopStorageNode');

function stopAllStorageNodes(config) {
	tahoeCommand.call(this, config);

	var stopStorageNode = new StopStorageNode(config);

	this.run = function(options) {
		var excludes;
		if (options.excludes && typeof options.excludes === 'string') {
			excludes = options.excludes.split(',');
			for (var i=0;i<excludes.length;i++){
				excludes[i] = this.getInstanceAddress(excludes[i]);
			}
		}

		var addresses = this.getAllAddresses(excludes);
		console.log('Stopping storage nodes', addresses.join(', '));

		addresses.forEach(function(address) {
			stopStorageNode.stopNode(address);
		});
	};
	
};

util.inherits(stopAllStorageNodes, tahoeCommand);

module.exports = stopAllStorageNodes;