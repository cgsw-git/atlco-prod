/*------------------------------------------------------------------------------------------------------/
| Program		: CONV_ADM_GUIDESHEET_ITEMS.js
| Usage			: Accela Data Mapping Tool - Construct API - Get Guidesheets,Guidesheet items and Guidesheet status
| Notes			: 
| Created by	: YBARGHOUTH
| Created at	: 8/26/2021
|
/------------------------------------------------------------------------------------------------------*/
var sqlParams = [ aa.getServiceProviderCode() ];
var output = {};
var SQL = "";
var result = [];

//--------------- GUIDESHEET ITEMS:
SQL = "select b.guide_group, a.guide_type, a.guide_item_text, a.GUIDE_ITEM_DISPLAY_ORDER, a.guide_item_status_group_name, a.ASI_GRP_NAM from rguidesheet_item a left join  RGUIDESHEET_GROUP b on a.serv_prov_code = ? and a.serv_prov_code = b.serv_prov_code and  a.guide_type = b.guide_type";
result = aa.db.select(SQL, sqlParams);
var guidesheetItems = [];
if (result.success) {
	result = result.output.toArray();
	for ( var line in result) {
		var item = {};
		var row = result[line];
		var guideGroup = String(row.get("guide_group"));
		item["guide_group"] = guideGroup == "null" ? "NONE" : guideGroup;
		item["guide_type"] = String(row.get("guide_type"));
		item["guide_item_text"] = String(row.get("guide_item_text"));
		item["guide_item_display_order"] = String(row.get("GUIDE_ITEM_DISPLAY_ORDER"));
		item["guide_item_status_group_name"] = String(row.get("guide_item_status_group_name"));
		item["asi_grp_nam"] = String(row.get("ASI_GRP_NAM"));
		guidesheetItems.push(item);
	}
	output["guidesheet_items"] = guidesheetItems;
}
//--------------- GUIDESHEET ITEM STATUS:
SQL = "SELECT GUIDE_ITEM_STATUS_GROUP, GUIDE_ITEM_STATUS, GUIDE_ITEM_STATUS_RESULT_TYPE,GUIDE_ITEM_STATUS_DISP_ORDER FROM RGUIDE_ITEM_STATUS_GROUP WHERE SERV_PROV_CODE=?";
result = aa.db.select(SQL, sqlParams);
var guidesheetItemsStatus = [];
if (result.success) {
	result = result.output.toArray();
	for ( var line in result) {
		var item = {};
		var row = result[line];
		item["guide_item_status_group"] = String(row.get("GUIDE_ITEM_STATUS_GROUP"));
		item["guide_item_status"] = String(row.get("GUIDE_ITEM_STATUS"));
		item["guide_item_status_result_type"] = String(row.get("GUIDE_ITEM_STATUS_RESULT_TYPE"));
		item["guide_item_status_disp_order"] = String(row.get("GUIDE_ITEM_STATUS_DISP_ORDER"));
		guidesheetItemsStatus.push(item);
	}
	output["guidesheet_items_status"] = guidesheetItemsStatus;
}
//--------------- GUIDE_GROUP:
SQL = "SELECT GUIDE_GROUP, GUIDE_TYPE FROM RGUIDESHEET_GROUP WHERE SERV_PROV_CODE=?";
result = aa.db.select(SQL, sqlParams);
var guideGroups = [];
if (result.success) {
	result = result.output.toArray();
	for ( var line in result) {
		var item = {};
		var row = result[line];
		item["guide_group"] = String(row.get("GUIDE_GROUP"));
		item["guide_type"] = String(row.get("GUIDE_TYPE"));
		guideGroups.push(item);
	}
	output["guide_groups"] = guideGroups;
}
//--------------- AAX_GUIDESHEET:
SQL = "SELECT distinct r3.R1_PER_GROUP, r3.R1_PER_TYPE, r3.R1_PER_SUB_TYPE, r3.R1_PER_CATEGORY, r3.R1_UDCODE1 FROM R3APPTYP r3 WHERE r3.SERV_PROV_CODE=?";
result = aa.db.select(SQL, sqlParams);
var aaxGuidesheet = [];

if (result.success) {
	result = result.output.toArray();
	for ( var line in result) {
		var item = {};
		var row = result[line];
		//var guideGroup = String(row.get("GUIDE_GROUP"));
		//item["guide_group"] = guideGroup == "null" ? "NONE" : guideGroup;

		var udcode1 = String(row.get("R1_UDCODE1"));
		item["udcode1"] = udcode1 == "null" ? "NONE" : udcode1;
		item["per_group"] = String(row.get("R1_PER_GROUP"));
		item["per_type"] = String(row.get("R1_PER_TYPE"));
		item["per_sub_type"] = String(row.get("R1_PER_SUB_TYPE"));
		item["per_category"] = String(row.get("R1_PER_CATEGORY"));
		aaxGuidesheet.push(item);
	}
	output["aax_guidesheet"] = aaxGuidesheet;
}

//--------------- AAX_GUIDESHEET_TT is obtained from Access DB

////Send Response
var outputAry = [];//ADM TOOL .NET code expects result as an array, we will give it an array :)
outputAry.push(output);
aa.env.setValue("data", outputAry);

///////////HELPER METHOD
function exists(item, ary) {
	for ( var x in ary) {
		if (ary[x] == item)
			return true;
	}
	return false;
}