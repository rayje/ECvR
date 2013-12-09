// storCreateStopFile
var Instances = require('../instances'),
	fs = require('fs'),
	noop = function(){};

module.exports = function(config) {

	var instances = new Instances();
	var debug = (config.debug) ? console.log : noop;

	this.run = function(options) {
		var instanceData = instances.getInstanceData();

		var addresses = [];
		instanceData.forEach(function(instance){
			addresses.push(instance.ipAddress);
		});

		var ringServer = options.createStopFile;
		var index = addresses.indexOf(ringServer);
		if (index > -1) {
			addresses.splice(index, 1);
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

};