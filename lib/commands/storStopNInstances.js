// storStopNInstances
var StorStop = require('./storStop'),
	fs = require('fs');

module.exports = function(config) {
	var storStop = new StorStop(config);

	this.run = function(options) {
		var startIndex = options.startIndex;
		var numInstances = options.numInstances;
		
		var addresses = getAddresses(startIndex, numInstances);
		addresses.forEach(function(address) {
			storStop.stopStor(address);
		});
	};

	function getAddresses(s, i) {
		return JSON.parse(fs.readFileSync(__dirname + '/../../instance-ips.json')).slice(s, s+i);
	}

};