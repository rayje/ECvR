// tahoeCreateAllStorageNodes
var util = require('util'),
	Remote = require('../remote'),
	tahoeCommand = require('./tahoeCommand'),
	async = require('async'),
	noop = function(){},
	StorageNodeCreator = require('./tahoeCreateStorageNode');

function tahoeCreateAllStorageNodes(config) {
	tahoeCommand.call(this, config);

	var remote = new Remote(config.stor);
	var debug = (config.debug) ? console.log : noop;
	var creator = new StorageNodeCreator(config);
	var self = this;

	this.run = function(options) {
		var addresses = this.getAllAddresses(getExcludes(options, this));

		function iterator(instanceAddress, callback) {
			debug(instanceAddress, 'Deleting node');

			var command = 'rm -rf .tahoe';
			debug(instanceAddress, command);

			remote.runCommand(command, instanceAddress, function(err, result) {
				console.log('====================');
				console.log(instanceAddress);
				console.log('--------------------');
				if (err) {
					console.log('ERROR Deleting Storage Node');
					self.logError(err);
				} else {
					console.log('Storage node deleted:', instanceAddress);
				}

				if (result && result.length > 0) {
					console.log(result);	
				}
				console.log('====================');

				callback(err);
			});

		}

		function onComplete(err) {
			if (err) {
				self.logError(err);
				return;
			}

			console.log('Deleting Storage Node Complete');
		}

		async.each(addresses, iterator, onComplete);
	
	};

	function getExcludes(options, self) {
		var excludes;
		if (options.excludes && typeof options.excludes === 'string') {
			excludes = options.excludes.split(',');
			for (var i=0;i<excludes.length;i++){
				excludes[i] = self.getInstanceAddress(excludes[i]);
			}
			debug("Excluding:", excludes);
		}
		return excludes;
	}


}

util.inherits(tahoeCreateAllStorageNodes, tahoeCommand);

module.exports = tahoeCreateAllStorageNodes;