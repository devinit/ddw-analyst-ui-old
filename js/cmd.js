// Copyright (c) 2015 devinit.org
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var cmd=exports;

var fs = require('fs');
var util=require('util');
var path=require('path');

var ls=function(a) { console.log(util.inspect(a,{depth:null})); }


cmd.defaults=function(argv)
{
	// serv html on this port
	argv.port=argv.port||12345;

	// use a readonly restricted user so none of this code can do any damage
	// seriously, I'm just pushing SQL across to the server so this is important
	argv.database=argv.database||"postgres://test:test@localhost/didat";

	return argv;
}


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
	cmd.defaults(argv);
	cmd.run(argv);
}
