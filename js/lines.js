// Copyright (c) 2015 devinit.org
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var lines=exports;

var plate=require("./plate.js")

var print=console.log;

lines.setup=function()
{

/*
	didat.div={};
	didat.div.master=$(didat.args.master);
	didat.div.master.empty();
	didat.div.master.html( plate.replace("{base}")  );
*/

	$(document).on( "click", ".line_remove",function(){
		$(this).parent().remove();
	});
	
	$(document).on( "click", ".line_add",function(){
		$(this).parent().after( $(plate.replace("{part_line}",{it:"{part_line_text}"})) );
	});

	var t=[
		"SELECT",
		"*",
		"FROM crs_XX_21_04_2015",
		"WHERE donor_code=12",
		"AND year=1979",
	];
	$(".parts").empty();
	var l=$( plate.replace("{part_line_top}",{it:"{part_line_text}"}) );
	l.find(".line_text").val(t[0]);
	$(".parts").append(l);
	for(var i=1;i<t.length;i++)
	{
		var l=$( plate.replace("{part_line}",{it:"{part_line_text}"}) );
		l.find(".line_text").val(t[i]);
		$(".parts").append(l);
	}
	
};

lines.allstrings=function()
{
	var a=[];
	$(".parts").find(".line").each(function(i,v){
		a.push($(v).find("input").val());
	});
	return a.join(" ");
};

lines.allstrings_limit=function(n)
{
	return lines.allstrings()+" LIMIT 10";
}
