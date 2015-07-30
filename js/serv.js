// Copyright (c) 2015 devinit.org
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var fs = require('fs');
var express = require('express');
var util=require('util');
var path=require('path');
var app = express();

var print=function(a) { console.log(util.inspect(a,{depth:null})); }

// global.argv
var argv=require('yargs').argv; global.argv=argv;

// serv html on this port
argv.port=argv.port||12345;

// use a readonly restricted user so none of this code can do any damage
// seriously, I'm just pushing SQL across to the server so this is important
argv.database=argv.database||"postgres://test:test@localhost/didat";


app.use(express.logger());
app.use(express.json());


app.use("/q",function (req, res) {
	require("./q").serv(req,res);
});

app.use(express.compress());
app.use(express.static(__dirname+"/../www"));

console.log("");
console.log("--port="+argv.port);
console.log("--database="+argv.database);
console.log("");
console.log("Starting didat server at http://localhost:"+argv.port+"/");
console.log("");

app.listen(argv.port);


