ECvR
====

A set of test scripts for verifying Erasure Coding vs Replication.

### Contents

* [Setup](#setup)
* [Config](#config)

### [Scripts](#scripts-1)

* [getInstances](#getinstances)
* [readInstances](#readinstances)
* [tahoe-setup](#tahoe-setup)
* [tahoe-teardown](#tahoe-teardown)

### [Stor](#stor-1)
* [start](#start)
* [startAll](#start-all)
* [stop](#stop)
* [stopAll](#stop-all)
* [stopN](#stop-n)
* [status](#status)
* [putFile](#put-file)
* [getFile](#get-file)
* [getUsage](#get-usage)
* [createStopFile](#create-stop-file)

### [Tahoe](#tahoe-1)
* [kill](#kill)
* [killAll](#kill-all)
* [status](#status-1)
* [capture](#capture)
* [startInt](#start-int)
* [killInt](#kill-int)
* [put](#put)
* [get](#get)
* [config](#config-1)
* [configAll](#config-all)
* [list](#list)
* [create](#create)
* [createAll](#create-all)
* [deleteAll](#delete-all)
* [listAliases](#list-aliases)
* [createAliases](#create-aliases)

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
		},
		"ec2": {
		    "accessKeyId": "AWS Access Key Id",
		    "secretAccessKey": "AWS Secret Key",
		    "region": "us-west-2"
		},
		"isEC2": true
	}


Scripts
-------

The following is a description of the scripts contained in this repo.

#### getInstances

Gets information of Future Grid or EC2 instances associated with the Stor project. This
script will write the result in JSON format to a file named ```instances.json```.

	$ ./getInstances --help

	  Usage: getInstances [options]

	  Options:

	    -h, --help           output usage information
	    -V, --version        output the version number
	    --imageId <imageId>  The image id used to filter the search. (FutureGrid)
	    --keyName <keyName>  The keyName used to filter the search. (FutureGrid)

**NOTE**: When run on EC2, this scripts takes no options.

To run the script on Future Grid:

	$ ./getInstances --imageId <imageId> --keyName <keyName>

**Note**: ```imageId``` is required for Future Grid

To run the script on EC2

	$ ./getInstances



#### readInstances

Reads and displays the content found in the file ```instances.json``` in tabular format.

	$ ./readInstances

	instanceId  | imageId       | keyName | instanceType | ipAddress        | privateIpAddress |
	-----------   -------------   -------   ------------   ----------------   ----------------
	i-000xxxxx  | ami-000xxxxx  | my-key  | m1.small     | xxx.xxx.xxx.xxx  | xxx.xxx.xxx.xxx  |
	i-000xxxxx  | ami-000xxxxx  | my-key  | m1.small     | xxx.xxx.xxx.xxx  | xxx.xxx.xxx.xxx  |
	i-000xxxxx  | ami-000xxxxx  | my-key  | m1.small     | xxx.xxx.xxx.xxx  | xxx.xxx.xxx.xxx  |


#### tahoe-setup

Sets up tahoe on all nodes. This script will run all the required commands to
get tahoe setup on all nodes. This scripts expects the ```instances.json```
file to have been create with the ```getInstances``` script.

	$ ./tahoe-setup <introducer-ip>

#### tahoe-teardown

Tears down all tahoe nodes. This command will remove the setup created from the
```tahoe-setup``` script. This scripts expects the ```instances.json```
file to have been create with the ```getInstances``` script.

	$ ./tahoe-teardown <introducer-ip>


stor
----

A script to run stor commands on a remote server.

	$ ./stor --help

	  Usage: stor [options]

	  Options:

	    -h, --help                         output usage information
	    -V, --version                      output the version number
	    --start <instanceId>               Start the stor server on a specific instance
	    --startAll                         Start the stor server on all instances
	    -p, --ringServer <ipAddress>       The ip address of the Pastry ring server
	    -m, --capacity <capacity>          The storage capacity for the Stor server [Default: 10]
	    -d, --storage <directory>          The storage directory for the Stor server [Default: $HOME/Stor_Age]
	    -r, --replication <rep>            The replication factor setting [Default: 5]
	    --stop <instanceId>                Stop the stor server in a specific instance
	    --stopAll                          Stop the stor server on all instances
	    -e, --excludes <instanceIds>       A comma delimted list of excluded instances
	    --stopN                            Stop N instances, reads from instances-ips.json
	    -n, --numInstances <numInstances>  The number of instances to stop
	    -i, --startIndex <index>           The index to start the stop within the stop file (instances-ips.json)
	    --status                           Displays the status of Stor on all instances
	    --debug                            Run in debug mode
	    --put <instanceId>                 Execute the stor client PUT command on the specified instanceId
	    --filePath <filePath>              File path for the file to save in Stor
	    --get <instanceId>                 Execute the stor client GET command on the specified instanceId
	    --fileKey <fileKey>                File key as returned by the PUT command
	    --getUsage                         Get file system space usage for all instances
	    --createStopFile                   Creates a file that can be used with the stop command (instances-ips.json)

#### Commands

##### Start

Start the Stor server on a single instance.

Example:

	$ ./stor --start 192.168.1.100 -p 192.168.1.100 -m 10 -r 5

or

	$ ./stor --start i-00004545 -p 10.1.2.123


##### Start All

Starts all stor servers.

This command will read the addresses of the instances found in ```instances.json``` and run the start stor 
command for each instance minus the ring server.

**Note**: It is expected that the ring server already be started before this script runs. This script WILL NOT
try to start the ring server.

Example:

	$ ./stor --startAll -p 10.1.2.123

##### Stop

Stop the Stor server on a single instance.

Example:
	
	$ ./stor --stop 192.168.1.100

or 

	$ ./stor --stop i-00004545

##### Stop All

Stops all the Stor servers found, minus those specified with the excludes flag.

Example:

	$ ./stor --stopAll -e i-00001234

or 
	
	$ ./stor --stopAll -e <public address>

##### Stop N

Stops the Stor server on N instances.

**Note**: This command requires that the ```createStopFile``` command was run at least once 
and there exists a ```instance-ips.json``` file in the same directory as ```instances.json```.

Arguments:

	-i	The index of the first instance
	-n	The number of instances to stop

Example:

	$ ./stor --stopN -i 0 -n 10

The above command will read the ```instance-ips.json``` file and read the first ```10``` ip
addresses, and run the ```stor -k``` command on those instances.

##### Put File

Executes the PUT command on the instance of the Stor server identified.

Example:

	$ ./stor --put i-00001234 --filePath /tmp/A

##### Get File

Executes the GET command on the instance of the Stor server identified.

Example:

	$ ./stor --get i-00001234 --fileKey KEY


##### Status

Display the status of the stor server on all instances

Example:

	$ ./stor --status
	instanceId   | keyName  | ipAddress        | privateIpAddress | running |
	------------   --------   ----------------   ----------------   -------
	i-000xxxx1   | my-key   | xxx.xxx.xxx.xx1  | xxx.xxx.xxx.xx1  | true    |
	i-000xxxx2   | my-key   | xxx.xxx.xxx.xx2  | xxx.xxx.xxx.xx2  | false   |
	i-000xxxx3   | my-key   | xxx.xxx.xxx.xx3  | xxx.xxx.xxx.xx3  | false   |	

##### Get Usage

Display the file system usage of for all instances

Optional parameters: 

	-e, --exclude xxx.xxx.xxx.xx1,xxx.xxx.xxx.xx2
	-d, --storage <storage directory>

Example:

	$ ./stor --getUsage 

	xxx.xxx.xxx.xxa - Ok - 12345
	xxx.xxx.xxx.xxb - Err - Error info

##### Create Stop File

Creates a file named ```instance-ips.json``` that consists of the public addresses
of all instances. 

**Note**: This command will shuffle the addresses, so they will not appear
in the same order as they appear when the ```readInstances``` or ```getInstances``` 
scripts are run.

This command also takes the ```-e``` option which is a comma delimited list of public 
ip addresses to exclude from the list of addresses generated. 

Example: 

	$ ./stor --createStopFile -e xxx.xxx.xxx.xx1,xxx.xxx.xxx.xx2

	
tahoe
-----

A script to run commands on a tahoe node

	$ ./tahoe --help

	  Usage: tahoe [options]

	  Options:

	    -h, --help                     output usage information
	    -V, --version                  output the version number
	    --kill <nodeIp>                Stop a storage node
	    --killAll                      Stop all storage nodes
	    -e, --excludes <instanceIds>   A comma delimted list of excluded instances
	    --status                       Displays the status of Tahoe on all instances
	    --debug                        Run in debug mode
	    --capture                      Capture storage measurement
	    --startInt <nodeIp>            Start an introducer node on the specified instance
	    --killInt <nodeIp>             Kill an introducer running on the specified instance
	    --startAll <introducerNodeIp>  Start tahoe storage nodes on all but the introducer node
	    --put <nodeId>                 Put a file on tahoe.
	    --filePath <filePath>          The path to the file used for the put command.
	    --get <nodeId>                 Get a file from tahoe
	    --filename <filename>          The name of the remote file
	    --config <nodeId>              Set a tahoe configuration
	    --configAll                    Set a tahoe configuration on all nodes
	    -s, --storage <size>           reserved_space
	    -n, --needed <needed>          shares.needed
	    -t, --total <total>            shares.total
	    -p, --happy <happy>            shares.happy
	    -x, --port <happy>             tub.port
	    -l, --listConfig               Display the current config value
	    --list <nodeIp>                List the files stored on the tahoe node
	    --create <node>                Creates a storage node, if not already created
	    --createAll                    Create a storage node on all instances
	    --deleteAll                    Delete all storage nodes from all instances
	    --listAliases                  List aliases on all nodes
	    --createAliases                Creates the tahoe alias on all nodes, if it does not exist	


##### Kill

Stop the tahoe storage node on a single instance.

Example:
	
	$ ./tahoe --kill 192.168.1.100

or 

	$ ./tahoe --kill i-00004545

##### Kill All

Stops all the storage nodes found, minus those specified with the excludes flag.

Example:

	$ ./tahoe --killAll -e i-00001234

or 
	
	$ ./tahoe --killAll -e <public address>

##### Status

Display the status of the tahoe storage nodes on all instances

Example:

	$ ./tahoe --status
	instanceId   | keyName  | ipAddress        | privateIpAddress | running |
	------------   --------   ----------------   ----------------   -------
	i-000xxxx1   | my-key   | xxx.xxx.xxx.xx1  | xxx.xxx.xxx.xx1  | true    |
	i-000xxxx2   | my-key   | xxx.xxx.xxx.xx2  | xxx.xxx.xxx.xx2  | false   |
	i-000xxxx3   | my-key   | xxx.xxx.xxx.xx3  | xxx.xxx.xxx.xx3  | false   |

##### Capture

Display the size of the contents within the .tahoe/storage directory on all instances

Example:

	$ ./tahoe --capture
	instanceId   | keyName  | ipAddress        | privateIpAddress | storage |
	------------   --------   ----------------   ----------------   -------
	i-000xxxx1   | my-key   | xxx.xxx.xxx.xx1  | xxx.xxx.xxx.xx1  | 31960   |
	i-000xxxx2   | my-key   | xxx.xxx.xxx.xx2  | xxx.xxx.xxx.xx2  | 0       |
	i-000xxxx3   | my-key   | xxx.xxx.xxx.xx3  | xxx.xxx.xxx.xx3  | 31959   |

##### Start Int

Starts an introducer node on the IP address of the instance
    
	--startInt <nodeIp>           Start an introducer node on the specified instance

Example: 

	$ ./tahoe --startInt xxx.xxx.xxx.xx1


##### Kill Int

Terminates the introducer node on the IP address of the instance, also deletes the .tahoe-int directory

    --killInt <nodeIp>            Kill an introducer running on the specified instance

Example: 

	$ ./tahoe --killInt xxx.xxx.xxx.xx1

##### Put

Put a file on tahoe. This command will copy a local file to the tahoe node and run
the ```tahoe put``` command on the node.

Example:

	$ ./tahoe --put i-000xxxx3 --filePath /tmp/test.txt

The ```put``` command expects the --filePath flag to be a local file path.

**NOTE**: The --filePath is required.


##### Get

Gets the contents of a file that was previously PUT on a tahoe node.

Example:
	
	$ ./tahoe --get i-000xxxx3 --filename test.txt

The ```get``` command expects the ```filename``` flag to be the name of a file that 
was previously PUT on a tahoe node.

**NOTE**: The --filename is required.

##### Config

Sets a value in the ```tahoe.cfg``` file on a storage node.

This command supports the following flags to set the related config values:

* -s reserved_space
* -n shares.needed
* -t shares.total
* -p shares.happy
* -x tub.port

Example:

	$ ./tahoe --config i-000xxxx3 -s 1G

The above example will set the following config value:

	reserved_space = 1G

The config command also supports the following helper flags:

	--debug		Outputs debug content
	-l			Displays the remote config value without setting it

##### Config All

The same as Config, except applies selected configuration to all nodes

Example:

	$ ./tahoe --configAll -s 1G	


##### List

Lists the files on a tahoe node

Example:

	$ ./tahoe --list i-000xxxx3

	List: xxx.xxx.xxx.xx1
	---------------------
	my_test.txt
	list.out

##### Create 

Creates a storage node, if not already created. This command will run the
```tahoe create-node -d .tahoe tahoe``` command on a single node. 

Example:

	$ ./tahoe --create i-000xxxx3

##### Create All

Create a storage node on all instances. This will run the above ```--create```
command on all nodes.

Example:

	$ ./tahoe --createAll                    

##### Delete All

Delete all storage nodes from all instances. This command will remove the 
```.tahoe``` directory from all nodes.

Example:
	
	$ ./tahoe --deleteAll    

##### List Aliases

List aliases on all nodes. This command will run the ```tahoe list-aliases```
command on all nodes.

Example:
	    
	$ ./tahoe --listAliases    

##### Create Aliases

Creates the tahoe alias on all nodes, if it does not exist. This command will
run the ```tahoe create-alias tahoe``` command on all nodes.      
	    
Example:

	$ ./tahoe --createAliases                