/*------------------------------------------------------------------------------------------------------/
| Program		: CONV_ADM_APP_STATUS_GROUP.js
| Usage			: Accela Data Mapping Tool - Construct API - Get APP STATUS GROUPS
| Notes			: 
| Created by	: OMATKARI
| Created at	: 24/03/2019 09:19:05
|
/------------------------------------------------------------------------------------------------------*/
var qry = "SELECT APP_STATUS_GROUP_CODE, \"STATUS\" FROM APP_STATUS_GROUP WHERE SERV_PROV_CODE=? AND REC_STATUS='A'";
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
		processResultSetRow : function(rs) {
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

	if (result.size() > 0) {
		return result.toArray();
	}
	return new Array();
}