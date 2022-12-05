/*------------------------------------------------------------------------------------------------------/
| Program		: CONV_TIME_ACCOUNTING_GROUPS.js
| Usage			: Accela Data Mapping Tool - Construct API - Get all Time Accounting Groups
| Notes			: 
| Created by	: YBARGHOUTH
| Created at	: 7/27/2021
|
/------------------------------------------------------------------------------------------------------*/
var timeAccountService = com.accela.aa.emse.dom.service.CachedService.getInstance().getTimeAccountService();
var timeGroupModel = new com.accela.aa.finance.timeAccount.TimeGroupModel();
timeGroupModel.setServProvCode(aa.getServiceProviderCode());
var timeGroups = timeAccountService.getTimeGroupList(timeGroupModel);

if (timeGroups && timeGroups.size() > 0) {
	timeGroups = timeGroups.toArray()
} else {
	timeGroups = [];
}
var timeGroupsList = [];
for ( var t in timeGroups) {
	var tGroup = timeGroups[t];
	//if (tGroup.getRecStatus() != "A")
		//continue;
	var timeGroup = {};
	timeGroup.timeGroupName = String(tGroup.getTimeGroupName());
	timeGroupsList.push(timeGroup);
}
aa.env.setValue("data", timeGroupsList);