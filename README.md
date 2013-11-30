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

Scripts
-------

The following is a description of the scripts contained in this repo.

#### getInstances

Gets information of future grid instances associated with the Stor project. This
script will write the result in JSON format to a file named ```instances.json```.

	$ ./getInstances --help

	  Usage: getInstances [options]

	  Options:

	    -h, --help           output usage information
	    -V, --version        output the version number
	    --imageId <imageId>  The image id used to filter the search.
	    --keyName <keyName>  The keyName used to filter the search.

To run the script:

	$ ./getInstances --imageId <imageId> --keyName <keyName>

**Note**: ```imageId``` is required

#### readInstances

Reads and displays the content found in the file ```instances.json``` in tabular format.

	$ ./readInstances

	instanceId  | imageId       | keyName | instanceType | ipAddress        | privateIpAddress |
	-----------   -------------   -------   ------------   ----------------   ----------------
	i-000xxxxx  | ami-000xxxxx  | my-key  | m1.small     | xxx.xxx.xxx.xxx  | xxx.xxx.xxx.xxx  |
	i-000xxxxx  | ami-000xxxxx  | my-key  | m1.small     | xxx.xxx.xxx.xxx  | xxx.xxx.xxx.xxx  |
	i-000xxxxx  | ami-000xxxxx  | my-key  | m1.small     | xxx.xxx.xxx.xxx  | xxx.xxx.xxx.xxx  |


stor
----

A script to run stor commands on a remote server.

	$ ./stor --help

	  Usage: stor [options]

	  Options:

	    -h, --help                    output usage information
	    -V, --version                 output the version number
	    --start <instanceId>          Start the stor server on a specific instance
	    --startAll                    Start the stor server on all instances
	    -p, --ringServer <ipAddress>  The ip address of the Pastry ring server
	    -m, --capacity <capacity>     The storage capacity for the Stor server [Default: 10]
	    -d, --storage <directory>     The storage directory for the Stor server [Default: $HOME/Stor_Age]
	    -r, --replication <rep>       The replication factor setting [Default: 5]
	    --stop <instanceId>           Stop the stor server in a specific instance
	    --stopAll                     Stop the stor server on all instances

#### Commands

***Start***

Start the Stor server on a single instance.

Example:

	$ ./stor --start 192.168.1.100 -p 192.168.1.100 -m 10 -r 5

or

	$ ./stor --start i-00004545 -p 10.1.2.123


***Start All***

Starts all stor servers.

This command will read the addresses of the instances found in ```instances.json``` and run the start stor 
command for each instance minus the ring server.

**Note**: It is expected that the ring server already be started before this script runs. This script WILL NOT
try to start the ring server.

Example:

	$ ./stor --startAll -p 10.1.2.123



***Stop***

Stop the Stor server on a single instance.

Example:
	
	$ ./stor --stop 192.168.1.100

or 

	$ ./stor --stop i-00004545

tahoe
-----

A script to run commands on a tahoe node

	$ ./tahoe --help

	  Usage: tahoe [options]

	  Options:

	    -h, --help           output usage information
	    -V, --version        output the version number
	    -k, --kill <nodeIp>  Stop a storage node
