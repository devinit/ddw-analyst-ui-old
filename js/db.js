// Copyright (c) 2015 devinit.org
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var db=exports;

var print=console.log;

var promisify = require('@atomiq/promisify');
var co = require('co');

var pgp_options = {};
//enable database logging to console
require("pg-monitor").attach(pgp_options);
var pgp = require('pg-promise')(pgp_options);


// use a readonly user so none of this code can do any damage
var connect_string_didat = "postgres://test:test@localhost/didat";


// test some bits and bobs
db.test=function()
{

// create a big union table view for all 21_04_2015 data...
// I don't really want to run this code here as I only want to use *read* access to the database
// so just print it as an example to be copypasta into an admin panel somewhere else.
	var ts=[];
	for(var y=1973;y<=2013;y++)
	{
		ts.push("SELECT * FROM crs_"+(""+y).substring(2,3)+"0_21_04_2015.crs_"+y);
	}
	print();
	print("CREATE OR REPLACE VIEW crs_XX_21_04_2015 AS " + ts.join(" UNION ALL ") + ";");
	print("GRANT SELECT ON crs_XX_21_04_2015 TO PUBLIC;")
	print();


// run a yieldable coroutine (requires ES6)
// This  reduces callback hell / excessive use of unnamed function 

	co(function*(){

		var db=yield pgp(connect_string_didat).connect();
		
//		var r=yield db.query("EXPLAIN ANALYSE SELECT distinct(year) FROM crs_XX_21_04_2015;");
//		print(r);
		
		var r=yield db.query("SELECT distinct(year) FROM crs_XX_21_04_2015;");
		print(r);

		db.done();
		
	}).then(function(v){},function(e){console.error(e.stack);});

	pgp.end(); // exit when database callbacks finish, otherwise we sit and wait forever?
};
