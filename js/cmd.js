// Copyright (c) 2015 devinit.org
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var cmd=exports;

var fs = require('fs');
var util=require('util');
var path=require('path');

var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

cmd.run=function(argv)
{
	if( argv._[0]=="test" )
	{
		var db=require('./db.js');
		db.test();
		
		return;
	}

	// help text
	console.log(
		"\n"+
		">	test \n"+
		"\n"+
		"Test some bits and bobs.\n"+
		"\n"+
		"\n"+
	"");
}

// if global.argv is set then we are inside another command so do nothing
if(!global.argv)
{
	var argv = require('yargs').argv; global.argv=argv;
	cmd.run(argv);
}
