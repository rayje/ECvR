var Connection = require('ssh2'), 
	fs = require('fs');

/**
 * The remote module provides an interface on top of the ssh2 module.
 *
 * This module expects the following options to be provided:
 *   - host: The host of the remote server
 *   - username: The username used to login to the remote server using ssh
 *   - privateKey: The location of the private key used with ssh
 *   - passphrase: The passphrase used with the private key (optional)
 */
module.exports = function(options) {
	var connectOptions = {
		port: 22,
		username: options.username,
		hostHash: 'sha1'
	};

	if (options.privateKey) {
		connectOptions.privateKey = fs.readFileSync(options.privateKey);
	}

	if (options.passphrase) {
		connectOptions.passphrase = options.passphrase;
	}

	connectOptions.hostVerifier = function(fingerprint){
		// result = fingerprint === 'd7c6f9808363f1e79f441348449d03c3b2d26a1a';
		// console.log(fingerprint, result);

		return true;
	}
	
	/**
	 * Run the remote command
	 *
	 * This method will initiate the ssh request. This request could result in
	 * data returned using separate buffers, so an intermediate callback should
	 * be provided to handle collecting data across buffers.
	 *
	 * Once all data has been received, the endCallback will be called indicating
	 * that the resulting data can now be consumed by the caller.
	 * 
	 * @param command: The command to run on the remote host
	 * @param host: The hostname or ip address of the remote host.
	 * @param callback: The callback to be used when data has been recieved on the buffer.
	 * 				- NOTE: This callback may be called multiple times.
	 * @param endCallback: The callback to be used when all data has been received.
	 */
	this.run = function(command, host, callback, endCallback) {
		validateOptions(connectOptions);

		var c = new Connection();

		c.on('ready', function() {

			c.exec(command, function(err, stream) {
				if (err) {
					return callback(err);
				}

				stream.on('data', function(data, extended) {
			  		return callback(null, data, extended);
				});

				stream.on('exit', function(code, signal) {
			  		c.end();
			  		return endCallback(code, signal);
				});
			});

		});

		c.on('error', function(err) {
			c.end();
			console.log('got remote error', err);
			return callback(err);
		});

		connectOptions.host = host;
		c.connect(connectOptions);
	};

	/**
	 * A helper method to concatenate intermittent results
	 * into a string.
	 * 
	 * This method is provided as a helper method that requires
	 * only a single callback, where only the end results
	 * will be returned.
	 */
	this.runCommand = function(command, host, callback) {
		var resultString = '';

		this.run(command, host, function(err, result) {
			if (err) {
				console.log('got error', err);
				return callback(err);
			}

			resultString += result.toString();
		}, function(code, signal) {
			if (code === 0) {
				callback(null, resultString);
			} else {
				callback({code:code,signal:signal});
			}
		});
	};

	this.put = function(host, local, remote, options, callback) {
		var c = new Connection();
		c.on('ready', function() {
			c.sftp(function(err, sftp) {
				if (err) {
					throw err;
				}

				sftp.fastPut(local, remote, options, function(err) {
					sftp.end();
					c.end();

					callback(err);
				});
			});
		});

		c.on('error', function(err) {
			c.end();
			console.log('got remote error', err);
			return callback(err);
		});

		connectOptions.host = host;
		c.connect(connectOptions);
	};


	function validateOptions(options) {
		if (!options.hasOwnProperty('privateKey') || !options.privateKey) {
			throw new Error('Missing required private key from configuration');
		}
	}

};

