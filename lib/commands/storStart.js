// storStart
var Remote = require('../remote'),
	util = require('util'),
	command = require('./command');

function storStart(config) {
	command.call(this, config);
	
	var remote = new Remote(config.stor);

	this.run = function(options) {
		if (!options.hasOwnProperty('ringServer')) {
			throw new Error('Missing required parameter: ringServer');
		}

		var instanceId = options.start;
		var address = this.getInstanceAddress(instanceId);
		var self = this;

		console.log('=============================');
		console.log('Starting ' + address);
		console.log('-----------------------------');
		
		this.startStor(address, options, function(err, result) {
			if (err) {
				return self.printErrorResult(err);
			}

			self.printStartResult(address, result);
		});
	};

	this.startStor = function(instanceAddress, options, callback) {
		var command = buildCommand(options);

		remote.runCommand(command, instanceAddress, function(err, result) {
			if (err) {
				return callback(err); 
			}

			callback(null, result);
		});
	};

	this.printErrorResult = function(err) {
		console.log('ERROR Starting Stor');
		if (err.code) {
			console.log('Error Code:', err.code);
		}

		if (err.signal) {
			console.log('Signal:', signal);
		}

		if (result.length > 0) {
			result.split('\n').forEach(function(line){
				console.log(line);
			});
		}
	};

	this.printStartResult = function(address, result) {
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
	};

	function startsWith(str, starts) {
    	str = String(str);
    	starts = String(starts);

    	return str.length >= starts.length && str.slice(0, starts.length) === starts;
    }

	function buildCommand(options) {
		var ringServer = options.ringServer;
		var command = 'stor -s -p ' + ringServer;

		if (options.capacity) {
			command += ' -m ' + options.capacity;
		}

		if (options.storage) {
			command += ' -d ' + options.storage;
		}

		if (options.replication) {
			command += ' -r ' + options.replication;
		}

		command += '; sleep 10; jps';
		return command;
	}

};

util.inherits(storStart, command);
module.exports = storStart;