var command = require('./command'),
	Remote = require('../remote'),
	util = require('util');

function storGetUsage(config) {
	command.call(this, config);

	var remote = new Remote(config.stor);
	
	this.run = function(options) {
		var ip_excludes = [];
		if(options.excludes)
		{
			ip_excludes = options.excludes.split(',');
			console.log("Skip measuring the following systems:", ip_excludes);
		}

		if(options.storage)
		{
			console.log("Using the following directory for measurement: " + options.storage);
		}

		var addresses = this.getAllAddresses(ip_excludes);
		addresses.forEach(function(address){
			remote.runCommand("du -bs " + options.storage + " | sed s/[^0-9]//g", address,
				function(err, result){
					if(err)
					{
						console.log(address, " - Err - ", err);
					}
					else
					{
						console.log(address, " - Ok - ", result.replace('\n', ''));
					}
				});
		});
	};
};

util.inherits(storGetUsage, command);
module.exports = storGetUsage;
