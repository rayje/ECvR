var Instances = require('../instances');

module.exports = function(options) {

	var ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

	var instances = new Instances();

	this.getInstanceAddress = function(instanceId) {
		// Instance id could be an ip address
		if (ipRegex.test(instanceId)) {
			return instanceId;
		}

		return instances.getAddress(instanceId);
	};

	this.getAllAddresses = function(excludes) {
		return instances.getAllAddresses(excludes);
	};

	this.getPublicAddress = function(privateAddress) {
		return instances.getPublicAddress(privateAddress);
	}

};