// Copyright (c) 2015 devinit.org
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var db=exports;

var print=console.log;

var promisify = require('@atomiq/promisify');
var co = require('co');

var pgp_options = {};
//enable database logging to console
require("pg-monitor").attach(pgp_options);
var pgp = require('pg-promise')(pgp_options);

// use a readonly user so none of this code can do any damage
var test_host = "postgres://test:test@localhost/didat";

/* COLUMN NAMES
year,
donor_code,
donor_name,
agency_code,
agency_name,
crs_id,
project_number,
initial_report,
recipient_code,
recipient_name,
region_code,
region_name,
income_group_code,
income_group_name,
flow_code,
flow_name,
bilateral_multilateral,
category,
finance_type,
aid_type,
usd_commitment,
usd_disbursement,
usd_received,
usd_commitment_deflated,
usd_disbursement_deflated,
usd_received_deflated,
usd_adjustment,
usd_adjustment_deflated,
usd_amount_untied,
usd_amount_partial_tied,
usd_amount_tied,
usd_amount_untied_deflated,
usd_amount_partial_tied_deflated,
usd_amount_tied_deflated,
usd_irtc,
usd_expert_commitment,
usd_expert_extended,
usd_export_credit,
currency_code,
commitment_national,
disbursement_national,
short_description,
project_title,
purpose_code,
purpose_name,
sector_code,
sector_name,
channel_code,
channel_name,
channel_reported_name,
geography,
expected_start_date,
completion_date,
long_description,
gender,
environment,
trade,
pdgg,
ftc,
pba,
investment_project,
associated_finance,
biodiversity,
climate_mitigation,
climate_adaptation,
desertification,
commitment_date,
type_repayment,
number_repayment,
interest_1,
interest_2,
repay_date_1,
repay_date_2,
grant_element,
usd_interest,
usd_outstanding,
usd_arrears_principal,
usd_arrears_interest,
usd_future_debt_service_principal,
usd_future_debt_service_interest,
rnmch
*/



// get pgp using given host or the default host
db.start=function(host)
{
	return pgp( host || test_host );
};

db.end=function()
{
	return pgp.end();
};

// test some bits and bobs
db.test=function()
{

// create a big union table view for all 21_04_2015 data...
// I don't really want to run this code here as I only want to use *read* access to the database
// so just print it as an example to be copypasta into an admin panel somewhere else.
	var ts=[];
	for(var y=1973;y<=2013;y++)
	{
		ts.push("SELECT * FROM crs_"+(""+y).substring(2,3)+"0_21_04_2015.crs_"+y);
	}
	print();
	print("CREATE OR REPLACE VIEW crs_XX_21_04_2015 AS " + ts.join(" UNION ALL ") + ";");
	print("GRANT SELECT ON crs_XX_21_04_2015 TO PUBLIC;")
	print();


// run a yieldable coroutine (requires ES6)
// This  reduces callback hell / excessive use of unnamed function 

	co(function*(){

		var d=yield db.start().connect();
		
//		var r=yield d.query("EXPLAIN ANALYSE SELECT distinct(year) FROM crs_XX_21_04_2015;");
//		print(r);
		
		var r=yield d.query("SELECT DISTINCT year FROM crs_XX_21_04_2015 ORDER BY 1;");
		print(r);

		d.done();
		
	}).then(function(v){},function(e){console.error(e.stack);});

	db.end(); // exit when database callbacks finish, otherwise we sit and wait forever?
};
