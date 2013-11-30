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
		username: options.username
	};

	if (options.privateKey) {
		connectOptions.privateKey = fs.readFileSync(options.privateKey);
	}

	if (options.passphrase) {
		connectOptions.passphrase = options.passphrase;
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

	function validateOptions(options) {
		if (!options.hasOwnProperty('privateKey') || !options.privateKey) {
			throw new Error('Missing required private key from configuration');
		}
	}

};

