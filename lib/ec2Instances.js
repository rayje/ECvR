var AWS = require('aws-sdk')
	fs = require('fs'),
	sprintf = require('sprintf-js').sprintf;

AWS.config.loadFromPath(__dirname + '/../aws-config.json');

module.exports = function EC2Client(options) {

    var ec2 = new AWS.EC2();

    this.describeInstances = function(callback) {
    	var params = {};

    	ec2.describeInstances(params, function(err, data){
    		if (err) {
                callback(err);
                return;
            }

            callback(null, data);
    	});
    };

    this.getFromFile = function(filename){
		return JSON.parse(fs.readFileSync(filename));
	};

    this.printInstances = function(filename) {
		var results = this.getFromFile(filename); 
		this.printResults(results);
	};

	this.printResults = function(results, keys) {
		var keys = keys || ['instanceId', 'imageId', 'keyName', 'instanceType', 'ipAddress', 'privateIpAddress', 'instanceState'];
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

}

