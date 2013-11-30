var StorStart = require('./storStart'),
	command = require('./command')
	util = require('util');

function storStartAll(config) {
	command.call(this, config);

	var storStart = new StorStart(config);

	this.run = function(options) {
		if (!options.hasOwnProperty('ringServer')) {
			throw new Error('Missing required parameter: ringServer');
		}

		var addresses = this.getAllAddresses(options.ringServer);

		console.log(addresses);

		addresses.forEach(function(address){
			console.log('=============================');
			console.log('Starting ' + address);
			console.log('-----------------------------');
			storStart.startStor(address, options, function(err, result) {
				if (err) {
					console.log('Error starting: ' + address, err.code, err.signal);
					return;
				}

				storStart.printStartResult(address, result);
			});
		});
	};
	
};

util.inherits(storStartAll, command);
module.exports = storStartAll;