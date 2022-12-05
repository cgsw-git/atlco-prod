/*------------------------------------------------------------------------------------------------------/
| Program		: CONV_ADM_USERS.js
| Usage			: Accela Data Mapping Tool - Construct API - Get all Time Accounting Types
| Notes			: 
| Created by	: YBARGHOUTH
| Created at	: 10/27/2021
|
| NOTE: used SQL because aa.people.getSysUserList(QueryFormat) did not return same number of results as from SQL
/------------------------------------------------------------------------------------------------------*/
var SQL = "SELECT user_name, status from puser WHERE SERV_PROV_CODE = ?";
var sqlParams = [ aa.getServiceProviderCode() ];
var resp = [];
try {
	var result = aa.db.select(SQL, sqlParams);
	if (result.success) {
		result = result.output.toArray();
		for (var r = 0; r < result.length; r++) {
			var user = {};
			user.user_name = String(result[r].get("user_name"));
			user.status = String(result[r].get("status"));
			resp.push(user);
		}
	}
	aa.env.setValue("data", resp);
} catch (ex) {
	aa.env.setValue("data", "ERROR:" + ex);
}