// Copyright (c) 2014 International Aid Transparency Initiative (IATI)
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var fs = require('fs');
var express = require('express');
var util=require('util');
var path=require('path');
var app = express();

var print=function(a) { console.log(util.inspect(a,{depth:null})); }

// global.argv
var argv=require('yargs').argv; global.argv=argv;

argv.port=argv.port||12345;
argv.database=argv.database||"";


app.use(express.logger());
app.use(express.json());


app.use("/q",function (req, res) {
	require("./q").serv(req,res);
});

app.use(express.compress());
app.use(express.static(__dirname+"/../static"));

console.log("Starting didat server at http://localhost:"+argv.port+"/");

app.listen(argv.port);


