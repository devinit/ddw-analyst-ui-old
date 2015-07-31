// Copyright (c) 2015 devinit.org
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var didat=exports;

var plate=require("./plate.js")


didat.setup=function(args)
{
	didat.q={};
	window.location.search.substring(1).split("&").forEach(function(n){
		var aa=n.split("=");
		didat.q[aa[0]]=decodeURIComponent(aa[1]||"");
	});
	
	args=args || {};
	args.js		=args.js	 	||  "/js/";		// url to load js from
	args.art	=args.art 		|| 	"/art/"; 	// url to load art from
	args.q		=args.q 		|| 	"/q"; 		// url to access q api

	if(!args.css) // can totally override with args
	{
		args.css=[
				args.art+"didat.css",
				args.art+"chosen/chosen.min.css",
		];
	}
	if(args.css) { head.load(args.css); }
	
	didat.args=args;



	didat.chunks={};
	plate.push_namespace(require("./text.json")); //the main chunks
	if(args.chunks)
	{
		plate.push_namespace(args.chunks); // override on load
	}
	plate.push_namespace(didat.chunks); // finally this is the data we create at runtime

// set or get a chunk in the didat namespace
	didat.chunk=function(n,s){
		if( s !== undefined )
		{
			didat.chunks[n]=s;
		}
		return didat.chunks[n];
	};
	didat.chunk_clear=function(n){
			didat.chunks[n]=undefined;
	};
	
	didat.div={};
	didat.div.master=$(didat.args.master);
	didat.div.master.empty();
	didat.div.master.html( plate.replace("{base}")  );

	$(document).on( "click", "#query", function(){
		
//		console.log("CLICK Q");
//		console.log($('#sqltext').val());
		
		var success=function(t){
//			console.log("AJAX Q");
			console.log(t);
			
			var heds=[];
			var v=t.results[0];
			for(var j=0;j<v.length;j++)
			{
				heds[j]="result_"+$('<div/>').text(v[j]).html();
			}

			var itss=[];
			for(var i=0;i<t.results.length;i++)
			{
				var its=[];
				var v=t.results[i];
				for(var j=0;j<v.length;j++)
				{
					var it={};
					it.hed=heds[j];
					it.txt=$('<div/>').text(v[j]).html();
					its.push(plate.replace("{sql_results_td}",{it:it}));
				}
				itss.push(plate.replace("{sql_results_tr}",{it:its.join("")}));
			}
			$("#results").empty().html( plate.replace("{sql_results_table}",{it:itss.join("")}) );
		};
		$("#results").empty().html( plate.replace("{loading}") );
		$.ajax({
			type: 'POST',
			url: args.q,
			data: JSON.stringify ({sql:$('#sqltext').val()}),
			success: success,
			contentType: "application/json",
			dataType: 'json'
		});

	} );

}

