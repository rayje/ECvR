// storCreateStopFile
var fs = require('fs'),
	util = require('util'),
	command = require('./command'),
	noop = function(){};

function storCreateStopFile(config) {
	command.call(this, config);

	var debug = (config.debug) ? console.log : noop;

	this.run = function(options) {
		var excludes;
		var addresses = this.getAllAddresses(excludes);

		if (options.excludes && typeof options.excludes === 'string') {
			excludes = options.excludes.split(',');
			excludes.forEach(function(address) {
				var index = addresses.indexOf(address);
				if (index > -1) {
					debug('Excluding', address);
					addresses.splice(index, 1);
				}
			});
		}

		addresses = shuffleAddresses(addresses);

		fs.writeFile('instance-ips.json', JSON.stringify(addresses), function(err) {
			if (err) {
				console.log(err);
			}
		});
	};

	function shuffleAddresses(addresses) {
		var currentIndex = addresses.length, 
			temporaryValue, 
			randomIndex;

		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			temporaryValue = addresses[currentIndex];
			addresses[currentIndex] = addresses[randomIndex];
			addresses[randomIndex] = temporaryValue;
		}

		return addresses;
	}

}

util.inherits(storCreateStopFile, command);
module.exports = storCreateStopFile;