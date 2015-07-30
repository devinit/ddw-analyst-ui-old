// Copyright (c) 2015 devinit.org
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var q=exports;

var co=require('co');
var fs=require('fs');
var util=require('util');

var print=console.log;

var db=require('./db.js');


q.write_json=function(res,dat){
	
	if(dat.results)
	{
//		if(dat.results.length==1) // special single row results
//		{
//			dat.result=dat.results;
//		}
// fix results, into a csv style array of arrays
		{
			var head=[];
			var data=[];
			if(dat.results && dat.results[0])
			{
				for(var n in dat.results[0]) { head.push(n.split("\t").join(" ")); }
//				head.sort();
				data.push(head);
				for(var i=0;i<dat.results.length;i++)
				{
					var v=dat.results[i];
					var t=[];
					head.forEach(function(n){
						var s=v[n];
						if("string" == typeof s) // may need to escape
						{
							s=s.split("\t").join(" "); // replace any possible tabs with spaces
						}
						t.push( s );
					});
					data.push(t);
				}
				dat.results=data;
			}
		}
	}
	res.jsonp(dat);
};

q.write_tsv=function(res,dat){

	res.set('Content-Type', 'text/tab-separated-values');
	
	if(typeof(dat)=="object") // need just the table
	{
		dat=dat.results; // this should be the results table
	}
	
	var head=[];
	if(dat && dat[0])
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
					s=s.split("\t").join(" "); // replace any possible tabs with spaces
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

	var start_time=Date.now();

// use file extension as form and default to json
	var form="json";
	var aa=req.url.split(".");
	if(aa[1]) { form=aa[1].split("?")[0]; }

// expect the body to contain a json request that tells us what we want
	var sql;
	
//print(req.body);

	if(req.body)
	{
		sql=req.body.sql
	}

	var r={};

	var output=function(){
		if(form=="json")
		{
			r.time=(Date.now()-start_time)/1000;
			q.write_json(res,r);
		}
		else
		if(form=="tsv")
		{
			q.write_tsv(res,r);
		}
	};
	
	if(sql) // perform a query
	{
		r.sql=sql; // spit the sql back
		
		co(function*(){

			var d=yield db.start().connect();					
			r.results=yield d.query(sql);
			d.done();

		}).then(function(v){
		
			output();
		
		},function(e){
			
			r.error=e.toString();
			output();

//			console.error(e.stack);
		});

	}
	else
	{
		r.error="missing sql"
		output();
	}
	
};

