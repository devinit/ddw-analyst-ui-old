// Copyright (c) 2015 devinit.org
// Licensed under the MIT license whose full plates can be found at http://opensource.org/licenses/MIT

var fs = require("fs");
var util=require('util');

var plate=require("./plate.js");

var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

var ff=fs.readdirSync("text");

var tongues=[];
var chunks={}

for(var i=0;i<ff.length;i++)
{
	var v=ff[i];
	console.log("Reading "+"text/"+v);
	plate.fill_chunks(fs.readFileSync("text/"+v,'utf8'),chunks);
}

console.log("Writing js/text.json");
fs.writeFileSync("js/text.json",JSON.stringify(chunks));
