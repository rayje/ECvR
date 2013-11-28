var Remote = require('./remote');

var reservation = [
	'RESERVATION',
	'ID',
	'Account ID',
	'Security Group Name'
];

var instanceKeys = [
	'INSTANCE',
	'instanceId', 
	'imageId',
	'dnsName',
	'privateDnsName',
	'instanceState',
	'keyName',
	'amiLaunchIndex',
	'productCodes',
	'instanceType',
	'launchTime',
	'placement',
	'kernelId',
	'ramdiskId',
	'platform',
	'monitoring',
	'ipAddress',
	'privateIpAddress',
	'vpcId',
	'subnetId',
	'rootDeviceType',
	'instanceLifecycle',
	'showInstanceRequestId',
	'placement',
	'virtualizationType',
	'hypervisor',
	'clientToken',
	'groupId',
	'placement',
	'ebsOptimized',
	'iamInstanceProfile'
]; 

/** 
 * A module used to get instance data from futuregrid.
 *
 * This module expects the following options to be provided:
 *   - host: The host of the futuregrid server
 *   - username: The username used to login to futuregrid with ssh
 *   - privateKey: The location of the private key used with ssh
 *   - passphrase: The passphrase used with the private key
 */
module.exports = function(options) {

	var host = options.host;
	var options = {
		username: options.username,
		privateKey: options.privateKey,
		passphrase: options.passphrase
	}

	var result = "";
	var remote = new Remote(options);
 
 	/**
 	 * Get an instance or all instances
 	 * 
 	 * @param instanceId: The id of an idividual instance
 	 * @param callback: A function that will be called with an array if instances.
 	 */
	this.get = function(instanceId, callback) {
		if (typeof instanceId === 'function') {
			callback = instanceId;
			instanceId = '';
		}

		var instances = [];
		var command = 'euca-describe-instances ' + instanceId;

		remote.run(command, host, function(err, data, extended) {
			if (err) {
				console.log('got error', err);
				return callback(err);
			}

			result += data.toString();
		}, function(code, signal) {
			if (result.length === 0 || code !== 0) {
				return callback(null, instances);
			}

			var results = result.split('\n');
			for (var i = 0; i < results.length; i++) {
				results[i] = results[i].split('\t');
			}

			results.forEach(function(result) {
				if (result[0] === 'INSTANCE') {
					var instance = {};
					for (var i = 1; i < result.length; i++) {
						if (instanceKeys.length > i) {
							instance[instanceKeys[i]] = result[i];
						}
					}
					instances.push(instance);
				}
			});

			callback(null, instances);
		});
	};

};