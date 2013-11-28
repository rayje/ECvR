ECvR
====

A set of test scripts for verifying Erasure Coding vs Replication.

### Setup

To install run the following commands:
	
	$ git clone git@github.com:rayje/ECvR.git
	$ cd ECvR
	$ npm install

The previous commands will clone the repository and install the node dependencies for the scripts.

#### Config

The scripts contained in this repo require a config file named ```config.json``` that exists in root directory of the ECvR project.
The config file is expected to contain the following format:

	{
		"futuregrid": {
			"host": "host at futuregrid.org",
			"privateKey": "/path/to/private/key/file",
			"username": "username on future grid",
			"passphrase": "passphrase for keyfile"
		},
		"stor": {
			"privateKey": "location of stor private key",
			"username": "ubuntu"
		}
	}

### Scripts

The following is a description of the scripts contained in this repo.

#### getIps

Gets the Ip Addresses of the instances associated with the Stor project.

To run the script:
	$ ./getIps
