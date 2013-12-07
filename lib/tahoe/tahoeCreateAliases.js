// tahoeCreateAliases
var Remote = require('../remote'),
	util = require('util'),
	noop = function(){},
	tahoeCommand = require('./tahoeCommand');

function tahoeCreateAliases(config) {
	tahoeCommand.call(this, config);

	var remote = new Remote(config.stor);
	var debug = (config.debug) ? console.log : noop;

	this.run = function(options) {
		var nodeAddress = options.create;
		var addresses = this.getAllAddresses(nodeAddress);
		var self = this;

		addresses.forEach(function(address) {
			self.tahoeCreateAlias(address);	
		});
	};

	this.tahoeCreateAlias = function(instanceAddress) {
		var command = 'B=$(tahoe list-aliases); ';
		command += 'if [ "$B" = "" ]; then tahoe create-alias -d .tahoe tahoe; else echo $B; fi';
		debug(instanceAddress, command);

		remote.runCommand(command, instanceAddress, function(err, result) {
			console.log('====================');
			console.log(instanceAddress);
			console.log('--------------------');
			if (err) {
				console.log('ERROR Listing Aliases');
				if (err.code) {
					console.log('Error Code:', err.code);
				}

				if (err.signal) {
					console.log('Signal:', err.signal);
				}
			} else {
				console.log('Alias created:', instanceAddress);
			}

			console.log(result);
			console.log('====================');
		});
	};

};

util.inherits(tahoeCreateAliases, tahoeCommand);

module.exports = tahoeCreateAliases;