// Copyright (c) 2015 devinit.org
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var tables=exports;

var didat=require("./didat.js");
var lines=require("./lines.js");
var plate=require("./plate.js");


tables.setup=function()
{
	$(document).on( "click", "#download",function(){
		var t=lines.allstrings();
		var sql=encodeURIComponent(t.trim().split(/\s+/).join(" "));
		location.hash = '#sql='+sql;
		$(this).attr("href",didat.args.q+".tsv?sql="+sql );
	});

	$(document).on( "click", "#query", function(){



		var t=lines.allstrings();
//		console.log(t);
		var sql=encodeURIComponent(t.trim().split(/\s+/).join(" "));
		location.hash = '#sql='+sql;
//		console.log("CLICK Q");
//		console.log($('#sqltext').val());
		
		var success=function(t){
//			console.log("AJAX Q");
//			console.log(t);

			if(t.error) // error, just display that
			{
				var it=$('<div/>').text(t.error).html();
				$("#results").empty().html( plate.replace("{sql_results_error}",{it:it}) );
				return;
			}
			
			var heds=[];
			var v=t.results[0];
			if(v)
			{
				for(var j=0;j<v.length;j++)
				{
					heds[j]="result_"+$('<div/>').text(v[j]).html();
				}
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
					if(v[j]===null){it.txt="";} // dont show nulls
					if(i==0)
					{
						its.push(plate.replace("{sql_results_th}",{it:it}));
					}
					else
					{
						its.push(plate.replace("{sql_results_td}",{it:it}));
					}
				}
				itss.push(plate.replace("{sql_results_tr}",{it:its.join("")}));
			}
			$("#results").empty().html( plate.replace("{sql_results_table}",{it:itss.join("")}) );
			$("#download").show();
		};
		$("#results").empty().html( plate.replace("{loading}") );
		$.ajax({
			type: 'POST',
			url: didat.args.q,
			data: JSON.stringify ({sql:lines.allstrings_limit(10)}),
			success: success,
			contentType: "application/json",
			dataType: 'json'
		});

	} );
	
	
}

