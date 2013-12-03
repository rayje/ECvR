// startAllStorageNodes
var util = require('util'),
	Remote = require('../remote'),
	tahoeCommand = require('./tahoeCommand');

function startAllStorageNodes(config) {
	tahoeCommand.call(this, config);

	this.run = function(options) {
		remote = new Remote(config.stor);

		var introducerIp = options.startAll;

		remote.runCommand("cat .tahoe-int/introducer.furl", introducerIp, function(err, result){
			if(err)
			{
				console.log('ERROR', err, result);
				return 1;
			}

			console.log("Introducer FURL", result);
	});

	/**	

		

		var excludes;
		if (options.excludes && typeof options.excludes === 'string') {
			excludes = options.excludes.split(',');
			for (var i=0;i<excludes.length;i++){
				excludes[i] = this.getInstanceAddress(excludes[i]);
			}
		}

		var addresses = this.getAllAddresses(excludes);
		console.log('Starting storage nodes', addresses.join(', '));


		addresses.forEach(function(address) {
			//remote.runCommand('tahoe start-node -d .tahoe');

			//update config with the introducer url

			//start the storage node
		});

	**/
	};
	
};

util.inherits(startAllStorageNodes, tahoeCommand);

module.exports = startAllStorageNodes;
