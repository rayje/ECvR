// startAllStorageNodes
var util = require('util'),
	Remote = require('../remote'),
	tahoeCommand = require('./tahoeCommand'),
	async = require('async'),
	noop = function(){},
	TahoeConfig = require('./tahoeConfig');

function startAllStorageNodes(config) {
	tahoeCommand.call(this, config);

	var remote = new Remote(config.stor);
	var debug = (config.debug) ? console.log : noop;
	var tahoeConfig = new TahoeConfig(config);

	this.run = function(options) {

		
		var introducerIp = options.startAll;
		var self = this;

		var command = "cat .tahoe-int/introducer.furl";
		debug(introducerIp, command);

		remote.runCommand(command, introducerIp, function(err, result) {
			if(err)
			{
				console.log('ERROR', err, result);
				return 1;
			}

			var furl = strip(result);
			debug("Introducer FURL:", furl);

			var addresses = self.getAllAddresses(getExcludes(options, self));
			console.log('Starting storage nodes', addresses.join(', '));


			function iterator(address, callback) {
				var keys = { 'introducer.furl': furl};
				debug(address, keys);

				tahoeConfig.doUpdate(address, keys, false, function(err) {
					debug(address, 'updated');
					callback(err);
				});
			}

			function onComplete(err) {
				startStorageNodes(addresses);
			}

			async.each(addresses, iterator, onComplete);
		});
	
	};

	function startStorageNodes(addresses) {
		var command = 'tahoe start -d .tahoe';

		function iterator(address, callback) {
			debug(address, command);

			remote.runCommand(command, address, function(err, result) {
				if (err) {
					console.log('Error starting storage node', address);
				}

				debug(address, (err ? 'Error' : 'Started'));
				callback(err);
			});
		}

		function onComplete(err) {
			if (err) {
				logError(err);
				return;
			}

			console.log('Started Stoage Nodes:', addresses.join(', '));
		}

		async.each(addresses, iterator, onComplete);
	}

	function logError(err) {
   		if (err.code) {
			console.log('Error Code:', err.code);
		}
		
		if (err.signal) {
			console.log('Signal:', err.signal);
		}
   	}

   	function strip(str) {
   		return str.replace(/(\r\n|\n|\r)/gm,"");
   	}

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

util.inherits(startAllStorageNodes, tahoeCommand);

module.exports = startAllStorageNodes;