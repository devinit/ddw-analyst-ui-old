// Copyright (c) 2015 devinit.org
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var cmd=exports;

var fs = require('fs');
var util=require('util');
var path=require('path');

var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

cmd.run=function(argv)
{
	if( argv._[0]=="bake" )		{		return require('./bake.js').run();		}
	else
	if( argv._[0]=="dbjson" )	{		return require('./bake.js').dbjson();	}
	else
	if( argv._[0]=="test" )		{		return require('./db.js').test();		}

	// help text
	console.log(
		"\n"+
		">	bake \n"+
		"\n"+
		"Bake the code, output js and min.js files.\n"+
		"\n"+
		"\n"+
		"\n"+
		">	dbjson \n"+
		"\n"+
		"Scan DB for unique codes and save as json data for use at runtime.\n"+
		"\n"+
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
