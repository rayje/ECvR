// storStopAll
var util = require('util'),
	command = require('./command'),
	StorStop = require('./storStop');

function storStopAll(config) {
	command.call(this, config);

	var storStop = new StorStop(config);

	this.run = function(options) {
		var excludes;
		if (options.excludes && typeof options.excludes === 'string') {
			excludes = options.excludes.split(',');
			for (var i=0;i<excludes.length;i++){
				excludes[i] = this.getInstanceAddress(excludes[i]);
			}
		}

		var addresses = this.getAllAddresses(excludes);
		console.log('Stopping servers: ', addresses.join(', '));

		addresses.forEach(function(address) {
			storStop.stopStor(address);
		});
	};
	
};

util.inherits(storStopAll, command);

module.exports = storStopAll;