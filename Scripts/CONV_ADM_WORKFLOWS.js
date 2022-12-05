/*------------------------------------------------------------------------------------------------------/
| Program		: CONV_ADM_WORKFLOWS.js
| Usage			: Accela Data Mapping Tool - Construct API - Get all ref workflow tasks and statuses
| Notes			: 
| Created by	: Osama Matkari
| Created at	: 18/03/2019 10:46:02
|
/------------------------------------------------------------------------------------------------------*/
var qry = "SELECT SPROCESS_GROUP_CODE, R3_ACT_TYPE_DES, R3_ACT_STAT_DES, R3_PROCESS_CODE FROM R3STATYP a INNER JOIN SPROCESS_GROUP b ON A.SERV_PROV_CODE=B.SERV_PROV_CODE AND a.R3_PROCESS_CODE = b.R1_PROCESS_CODE WHERE b.SERV_PROV_CODE = ? AND b.REC_STATUS = 'A' AND a.REC_STATUS = 'A' AND EXISTS (SELECT 1 FROM SPROCESS S WHERE S.SERV_PROV_CODE = a.SERV_PROV_CODE AND S.R1_PROCESS_CODE = a.R3_PROCESS_CODE AND S.SD_PRO_DES = a.R3_ACT_TYPE_DES AND S.REC_STATUS = 'A')";
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