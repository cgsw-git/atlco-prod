/*------------------------------------------------------------------------------------------------------/
| Program		: CONV_ADM_TASKSPECINFO.js
| Usage			: Accela Data Mapping Tool - Construct API - Get all ref workflow TSIs
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: OMATKARI
| Created at	: 19/03/2019 14:34:20
|
/------------------------------------------------------------------------------------------------------*/
var qry = "SELECT A.SPROCESS_GROUP_CODE WORKFLOW,B.R1_PROCESS_CODE,B.SD_PRO_DES,C.R1_CHECKBOX_CODE,C.R1_CHECKBOX_TYPE,C.R1_CHECKBOX_DESC,C.R1_CHECKBOX_GROUP, C.R1_CHECKBOX_IND"
        + " FROM SPROCESS_GROUP A INNER JOIN SPROCESS B ON A.SERV_PROV_CODE=B.SERV_PROV_CODE AND a.r1_process_code = b.r1_process_code INNER JOIN R2CHCKBOX C ON A.SERV_PROV_CODE=C.SERV_PROV_CODE AND B.R1_CHECKBOX_GROUP=C.R1_CHECKBOX_GROUP AND B.R1_CHECKBOX_CODE=C.R1_CHECKBOX_CODE"
        + " WHERE b.SERV_PROV_CODE= ? AND b.REC_STATUS='A' AND a.REC_STATUS='A' AND c.REC_STATUS='A'";

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