/*------------------------------------------------------------------------------------------------------/
| Program		: CONV_ADM_TIME_ACCOUNTING_TYPES.js
| Usage			: Accela Data Mapping Tool - Construct API - Get all Time Accounting Types
| Notes			: 
| Created by	: YBARGHOUTH
| Created at	: 7/27/2021
|
/------------------------------------------------------------------------------------------------------*/
var sqlParams = [ aa.getServiceProviderCode() ];
var SQL = "select record_type, time_type_name, r1_per_group, r1_per_type, r1_per_sub_type, r1_per_category from r1_time_types WHERE SERV_PROV_CODE=?";
var result = [];
var timeTypesList = [];
result = aa.db.select(SQL, sqlParams);
if (result.success) {
	result = result.output.toArray();
	for ( var line in result) {
		var timeType = {};
		var row = result[line];
		timeType.recordType = String(row.get("record_type"));
		timeType.timeTypeName = String(row.get("time_type_name"));
		timeType.r1PerGroup = String(row.get("r1_per_group"));
		timeType.r1PerType = String(row.get("r1_per_type"));
		timeType.r1PerSubType = String(row.get("r1_per_sub_type"));
		timeType.r1PerCategory = String(row.get("r1_per_category"));
		timeTypesList.push(timeType);
	}
}
aa.env.setValue("data", timeTypesList);