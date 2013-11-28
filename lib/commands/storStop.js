// storStop
var Remote = require('../remote');

module.exports = function(config) {

	var remote = new Remote(config.stor);

	this.run = function(options) {
		var instanceId = options.stop;
		var address = getInstanceAddress(instanceId);

		this.stopStor(address);
	};

	this.stopStor = function(instanceAddress) {
		var command = 'stor -k';

		remote.run(command, instanceAddress, function(err, result) {
			if (err) {
				console.log('got error', err);
				return callback(err);
			}

			console.log(result.toString());
		}, function(code, signal) {
			if (code === 0) {
				console.log('success');
			} else {
				console.log('error', code, signal);
			}
		});
	};

	function getInstanceAddress(instanceId) {
		return instanceId;
	}

};