// Copyright (c) 2015 devinit.org
// Licensed under the MIT license whose full plates can be found at http://opensource.org/licenses/MIT

var bake=exports;

var co = require('co');
var fs = require("fs");
var util=require('util');

var print=console.log;

var plate=require("./plate.js");
var db  =require('./db.js');

var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

bake.run=function(argv){
	
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

};

// build lists of distinct values in the database for drop down menus
bake.dbjson=function(){

	var pp=[
		["year"],
		["donor_code","donor_name"],
		["agency_code","agency_name"],
		["recipient_code","recipient_name"],
		["region_code","region_name"],
		["income_group_code","income_group_name"],
		["flow_code","flow_name"],
		["category"],
		["finance_type"],
		["aid_type"],
		["currency_code"],
		["purpose_code","purpose_name"],
		["sector_code","sector_name"],
		["channel_code","channel_name"],
		["type_repayment"],
		["gender"],
		["environment"],
		["trade"],
		["pdgg"],
		["ftc"],
		["pba"],
		["investment_project"],
		["associated_finance"],
		["biodiversity"],
		["climate_mitigation"],
		["climate_adaptation"],
		["desertification"],
		["rnmch"],
	];

	var ds={};

	ds.columns=[
		"year",
		"donor_code",
		"donor_name",
		"agency_code",
		"agency_name",
		"crs_id",
		"project_number",
		"initial_report",
		"recipient_code",
		"recipient_name",
		"region_code",
		"region_name",
		"income_group_code",
		"income_group_name",
		"flow_code",
		"flow_name",
		"bilateral_multilateral",
		"category",
		"finance_type",
		"aid_type",
		"usd_commitment",
		"usd_disbursement",
		"usd_received",
		"usd_commitment_deflated",
		"usd_disbursement_deflated",
		"usd_received_deflated",
		"usd_adjustment",
		"usd_adjustment_deflated",
		"usd_amount_untied",
		"usd_amount_partial_tied",
		"usd_amount_tied",
		"usd_amount_untied_deflated",
		"usd_amount_partial_tied_deflated",
		"usd_amount_tied_deflated",
		"usd_irtc",
		"usd_expert_commitment",
		"usd_expert_extended",
		"usd_export_credit",
		"currency_code",
		"commitment_national",
		"disbursement_national",
		"short_description",
		"project_title",
		"purpose_code",
		"purpose_name",
		"sector_code",
		"sector_name",
		"channel_code",
		"channel_name",
		"channel_reported_name",
		"geography",
		"expected_start_date",
		"completion_date",
		"long_description",
		"gender",
		"environment",
		"trade",
		"pdgg",
		"ftc",
		"pba",
		"investment_project",
		"associated_finance",
		"biodiversity",
		"climate_mitigation",
		"climate_adaptation",
		"desertification",
		"commitment_date",
		"type_repayment",
		"number_repayment",
		"interest_1",
		"interest_2",
		"repay_date_1",
		"repay_date_2",
		"grant_element",
		"usd_interest",
		"usd_outstanding",
		"usd_arrears_principal",
		"usd_arrears_interest",
		"usd_future_debt_service_principal",
		"usd_future_debt_service_interest",
		"rnmch"
	];

	ds.tables=["crs_1973_2013"];
	for(var y=1973;y<=2013;y++)
	{
		ds.tables.push("crs_"+(""+y).substring(2,3)+"0_21_04_2015.crs_"+y);
	}



	co(function*(){

		var d=yield db.start().connect();
				
		for(var i=0;i<pp.length;i++)
		{
			var id=pp[i][0];
			var tt=pp[i][1];
			if(tt)
			{
				var r=yield d.query("SELECT DISTINCT ON ($1^,$2^) $1^,$2^ FROM crs_1973_2013 ORDER BY $1^,$2^;",[id,tt]);
				
				ds[id]={};
//				ds[tt]={};
				for(var j=0;j<r.length;j++)
				{
					var rid=r[j][id];
					var rtt=r[j][tt];
					if(rid!==null) { ds[id][rid]=rtt; }
//					if(rtt!==null) { ds[tt][rtt]=rid; }
				}
				print(r.length);
			}
			else
			{ 
				var r=yield d.query("SELECT DISTINCT ON ($1^) $1^ FROM crs_XX_21_04_2015 ORDER BY $1^;",[id]);

				ds[id]={};
				for(var j=0;j<r.length;j++)
				{
					var rid=r[j][id];
					if(rid!==null) { ds[id][rid]=true; }
				}
				print(r.length);
			}
		}

		console.log("Writing js/db.json");
		fs.writeFileSync("js/db.json",JSON.stringify(ds,null,'\t'));

		d.done();
		
	}).then(function(v){},function(e){console.error(e.stack);});

	db.end(); // exit when database callbacks finish, otherwise we sit and wait forever?
	
};


// if global.argv is set then we are inside another command so do nothing
if(!global.argv)
{
	var argv = require('yargs').argv; global.argv=argv;
	require("./cmd.js").defaults(argv);
	bake.run(argv);
}

