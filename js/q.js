// Copyright (c) 2015 devinit.org
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var q=exports;

var util=require('util');
var fs=require('fs');

var print=function(a) { console.log(util.inspect(a,{depth:null})); }


q.write_tsv=function(res,dat){

	res.set('Content-Type', 'text/tab-separated-values');

	var head=[];
	if(dat[0])
	{
		for(var n in dat[0]) { head.push(n.split("\t").join(" ")); }
		head.sort();
		res.write(	head.join("\t")+"\n" ); // header
		for(var i=0;i<dat.length;i++)
		{
			var v=dat[i];
			var t=[];
			head.forEach(function(n){
				var s=""+v[n];
				if("string" == typeof s) // may need to escape
				{
					s=s.split("\t").join(" "); // remove any possible taba
				}
				t.push( s );
			});
			res.write(	t.join("\t")+"\n" );
		}
		res.end("");
	}
	else
	{
		res.end("");
	}
};

// handle the /q url space
q.serv=function(req,res){

	var r={};
	r.name="test";


	q.write_tsv(res,[r]);
};

