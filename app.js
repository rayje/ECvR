// http://nodejs.org/api.html#_child_processes
var exec = require('child_process').exec;
var child;

// executes `pwd`
child = exec("pwd", function (error, stdout, stderr) {
	console.log('stdout: ' + stdout);
	console.log('stderr: ' + stderr);
	if (error !== null) {
		console.log('exec error: ' + error);
	}
});