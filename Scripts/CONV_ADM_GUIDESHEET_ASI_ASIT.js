/*------------------------------------------------------------------------------------------------------/
| Program		: CONV_ADM_GUIDESHEET_ASI_ASIT.js
| Usage			: Accela Data Mapping Tool - Construct API - Get Guidesheet ASI and ASIT
| Notes			: 
| Created by	: YBARGHOUTH
| Created at	: 10/06/2021
|
/------------------------------------------------------------------------------------------------------*/
var sqlParams = [ aa.getServiceProviderCode(), aa.getServiceProviderCode() ];
var output = {};
var SQL = "";
var result = [];
var reqTypeParam = aa.env.getValue("type");

if (!reqTypeParam)
	reqTypeParam = "";
else
	reqTypeParam = reqTypeParam.toUpperCase();

if (reqTypeParam == "ASI") {
	SQL = "SELECT a.R1_CHECKBOX_CODE, a.R1_CHECKBOX_TYPE, a.R1_CHECKBOX_DESC, a.R1_CHECKBOX_GROUP, a.R1_CHECKBOX_IND FROM R2CHCKBOX a WHERE a.SERV_PROV_CODE=? AND a.R1_CHECKBOX_GROUP='APPLICATION' AND a.R1_CHECKBOX_CODE IN (select b.ASI_GRP_NAM from rguidesheet_item b where b.SERV_PROV_CODE=?)";
	result = aa.db.select(SQL, sqlParams);
	if (result.success) {
		result = result.output.toArray();
		aa.env.setValue("data", result);
	}//success
} else if (reqTypeParam == "ASIT") {
	SQL = "SELECT B.R1_CHECKBOX_CODE,A.R1_CHECKBOX_CODE R1_TABLE_GROUP_NAME, A.R1_CHECKBOX_TYPE, A.R1_CHECKBOX_DESC, A.R1_CHECKBOX_GROUP, A.R1_CHECKBOX_IND FROM R2CHCKBOX A INNER JOIN (SELECT DISTINCT SERV_PROV_CODE, R1_CHECKBOX_CODE,R1_TABLE_GROUP_NAME FROM R2CHCKBOX WHERE R1_TABLE_GROUP_NAME IS NOT NULL AND R1_CHECKBOX_GROUP='APPLICATION' AND REC_STATUS='A') B ON A.SERV_PROV_CODE=B.SERV_PROV_CODE AND A.R1_CHECKBOX_CODE=B.R1_TABLE_GROUP_NAME WHERE A.SERV_PROV_CODE=? AND A.REC_STATUS='A' AND A.R1_CHECKBOX_GROUP='FEEATTACHEDTABLE' AND a.R1_CHECKBOX_CODE IN (select b.ASI_GRP_NAM from rguidesheet_item b where b.SERV_PROV_CODE=?)";
	result = aa.db.select(SQL, sqlParams);
	if (result.success) {
		result = result.output.toArray();
		aa.env.setValue("data", result);
	}//success
} else {
	aa.env.setValue("data", "invalid request parameter [type]: " + reqTypeParam);
}