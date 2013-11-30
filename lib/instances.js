var Remote = require('./remote'),
	fs = require('fs'),
	sprintf = require('sprintf-js').sprintf;

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
	options = options || {};

	var host = options.host || null;
	var options = {
		username: options.username || null,
		privateKey: options.privateKey || null,
 		passphrase: options.passphrase || null
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

	this.getFromFile = function(filename){
		return JSON.parse(fs.readFileSync(filename));
	};

	this.getAddress = function(instanceId) {
		var instanceData = this.getFromFile(__dirname + '/../instances.json');

		var ipAddress;
		for (var i=0; i < instanceData.length; i++) {
			if (instanceData[i].instanceId === instanceId) {
				ipAddress = instanceData[i].ipAddress;
				break;
			}
		}

		if (!ipAddress) {
			throw new Error('Cannot find address for ' + instanceId);
		}

		return ipAddress;
	};

	this.getAllAddresses = function() {
		var instanceData = this.getFromFile(__dirname + '/../instances.json');

		var addresses = [];
		instanceData.forEach(function(instance){
			addresses.push(instance.ipAddress);
		});

		if (addresses.length === 0) {
			throw new Error('No addresses found.');
		}

		return addresses;
	};

	this.printInstances = function(filename) {
		var results = this.getFromFile(filename); 
		this.printResults(results);
	};

	this.printResults = function(results) {
		var keys = ['instanceId', 'imageId', 'keyName', 'instanceType', 'ipAddress', 'privateIpAddress'];
		var header = '';
		var border = '';
		var width = 17;
		var format = '%-' + width + 's| ';
		var borderFormat = "%+'-" + (width + 2) + "s"

		keys.forEach(function(key){
			header += sprintf(format, key);	
			border += sprintf(borderFormat, '   ');
		});

		console.log(header);
		console.log(border);

		results.forEach(function(result){
			var line = '';
			keys.forEach(function(key){
				line += sprintf(format, result[key]);	
			});	
			console.log(line);
		});
	}

};
