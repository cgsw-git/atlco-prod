/*------------------------------------------------------------------------------------------------------/
| Program		: CONV_ADM_R3APPTYP.js
| Usage			: Accela Data Mapping Tool - Construct API - Get R3APPTYP RECORDS
| Notes			: 
| Created by	: OMATKARI
| Created at	: 24/03/2019 09:19:05
|
/------------------------------------------------------------------------------------------------------*/
var qry = "SELECT r1_per_group, r1_per_type, r1_per_sub_type, r1_per_category, r1_fee_code, r1_process_code, r1_chckbox_code, r1_udcode1, r1_udcode2, r1_udcode3, r1_smartchoice_code, app_status_group_code, app_default_status_code, r1_app_type_alias, (SELECT MAX(R1_TABLE_GROUP_NAME) FROM R2CHCKBOX B WHERE A.SERV_PROV_CODE=B.SERV_PROV_CODE AND A.R1_CHCKBOX_CODE=B.R1_CHECKBOX_CODE AND A.REC_STATUS=B.REC_STATUS AND B.R1_CHECKBOX_GROUP='APPLICATION') R1_TABLE_GROUP_NAME FROM R3APPTYP A WHERE SERV_PROV_CODE=? AND REC_STATUS='A'";
var qryParams = new Array();
qryParams.push(aa.getServiceProviderCode());

var results = execSQL(qry, qryParams);
aa.env.setValue("data", results);

// Execute sql query
function execSQL(sqlCMD, parameters) {
	var params = [];
	if (arguments.length == 2)
		params = parameters;

	var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
	var utilProcessor = new JavaAdapter(com.accela.aa.datautil.DBResultSetProcessor, {
			processResultSetRow: function (rs) {
				var meta = rs.getMetaData();
				var numcols = meta.getColumnCount();
				var record = {}
				var result = null;

				for (var i = 0; i < numcols; i++) {
					var columnName = meta.getColumnName(i + 1);
					columnName = columnName.toUpperCase()
						result = rs.getObject(i + 1);
					if (result == null) {
						record[columnName] = String("");
					} else {
						if (result.getClass && result.getClass().getName() == "java.sql.Timestamp") {
							record[columnName] = String(new Date(rs.getTimestamp(i + 1).getTime()).toString("MM/dd/yyyy"));
						} else {
							record[columnName] = String(rs.getObject(i + 1));
						}
					}
				}
				return record;
			}
		});

	var result = dba.select(sqlCMD, params, utilProcessor, null);

	if(result.size() > 0) {
		return result.toArray();
	}
	return new Array();
}