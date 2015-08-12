// Copyright (c) 2015 devinit.org
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var lines=exports;

var plate=require("./plate.js")

var dbvals=require("./db.json")


var escapeHTML = (function () {
    'use strict';
    var chr = { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' };
    return function (text) {
        return text.replace(/[\"&<>]/g, function (a) { return chr[a]; });
    };
}());

// get the groupname given a member
lines.find_groupname=function(str)
{
	for(var groupname in dbvals)
	{
		var a=dbvals[groupname];
		if( Object.prototype.toString.call( a ) === '[object Array]' )
		{
			for(var i=0;i<a.length;i++)
			{
				if(a[i]==str)
				{
					return groupname;
				}
			}
		}
		else // object
		{
			if(a[str])
			{
				return groupname;
			}
		}
	}
	return null;
};


lines.span_read=function(line)
{
	var span=line.find(".line_span");
	var a=[];
	span.contents().each(function(i){
		a.push( $(this).val() || $(this).text() );
	});
	return a.join(" ");
};

lines.span_write=function(line,val)
{
	var span=line.find(".line_span");
	var ops={"=":true,"<":true,">":true,"<=":true,">=":true};
	var v=val;
		v=v.split("=").join(" = ");
		v=v.split("<").join(" < ");
		v=v.split(">").join(" > ");
		v=v.split("<=").join(" <= ");
		v=v.split(">=").join(" >= ");
	var a1=v.split(/\s+/);
	
	var build_select=function(groupname,value){
		var d=dbvals[groupname];
		if(d)
		{
			var it=[];
			if(d.length) { for(j=0;j<d.length;j++) { it.push({ id:d[j] ,selected:(d[j]==value?"selected":"") }); } }
			else {                     for(n in d) { it.push({ id:n    ,selected:(n   ==value?"selected":"") }); } }
			return plate.replace("{part_line_select}",{it:it});
		}
		else
		{
			return escapeHTML(value || "");
		}
	};
	
	var a2=[];
	for(var i=0;i<a1.length;i++)
	{
		var v=a1[i];
		if(i>=2)
		{
			if(ops[ a1[i-1] ])
			{
				var groupname=lines.find_groupname(a1[i-2]);
				if(groupname=="columns")
				{
					a2[i]=build_select(a1[i-2],a1[i]);
					continue;
				}
			}
		}
		if( parseInt(v)+"" == v) // dont look up numbers
		{
			a2[i]=escapeHTML(v);
			continue;
		}
		var groupname=lines.find_groupname(v);
		if(groupname)
		{
			a2[i]=build_select(groupname,v);
		}
		else // just text
		{
			a2[i]=escapeHTML(v);
		}
	}
	
	span.html(a2.join(" "));
};

lines.show_text=function(line)
{
	var span=line.find(".line_span");
	var text=line.find(".line_text");
	text.val(lines.span_read(line));
	span.hide();
	text.show();
};

lines.show_span=function(line)
{
	var span=line.find(".line_span");
	var text=line.find(".line_text");
	lines.span_write(line,text.val());
	text.hide();
	span.show();
};

lines.setup=function()
{

	$(document).on( "change", ".line_select",function(){
		var line=$(this).parent().parent();
		var text=line.find(".line_text");
		text.val(lines.span_read(line));
	});

	$(document).on( "click", ".line_remove",function(){
		$(this).parent().remove();
	});
	
	$(document).on( "click", ".line_add",function(){
		$(this).parent().after( $(plate.replace("{part_line}",{it:"{part_line_text}"})) );
	});

	$(document).on( "click", ".line_edit",function(){
		$(".line").each(function(i){
			var line=$(this);		
			if(line.find(".line_text").is(':hidden'))
			{
				lines.show_text(line);
			}
			else
			{
				lines.show_span(line);
			}
		});
	});

	var t=[
		"SELECT",
		"*",
//		"FROM crs_XX_21_04_2015",
		"FROM crs_1973_2013",
		"WHERE donor_code=12",
		"AND year=1979",
		"ORDER BY 1",
	];
	$(".parts").empty();
	$(".parts").append( $( plate.replace("{part_line_top}") ) );
	for(var i=0;i<t.length;i++)
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
	return lines.allstrings().split("LIMIT")[0]+" LIMIT 10";
}
