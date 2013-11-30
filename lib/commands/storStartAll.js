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

				printResult(address, result);
			});
		});
	};

	function printResult(address, result) {
		var lines = result.split('\n');
		
		console.log('=============================');
		console.log('Started ' + address);
		console.log('-----------------------------');
		lines.forEach(function(line){
			if (startsWith(line, 'INFO:')) {
				console.log(line);
			}
		});
		console.log('-----------------------------');
	}

	function startsWith(str, starts) {
    	str = String(str);
    	starts = String(starts);

    	return str.length >= starts.length && str.slice(0, starts.length) === starts;
    }
	
};

util.inherits(storStartAll, command);
module.exports = storStartAll;