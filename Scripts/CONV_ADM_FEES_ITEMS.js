/*------------------------------------------------------------------------------------------------------/
| Program		: CONV_ADM_FEES_ITEMS.js
| Usage			: Accela Data Mapping Tool - Construct API - Get all ref fee items
| Notes			: 
| Created by	: Osama Matkari
| Created at	: 17/03/2019 16:36:11
|
/------------------------------------------------------------------------------------------------------*/
// Get Cached Service
var cacheService = com.accela.aa.emse.dom.service.CachedService.getInstance();

// Get ref fee item service
var rFeeItemService = cacheService.getRefFeeService();

// Get instance of rFeeItemModel
var rFeeItemModel = aa.proxyInvoker.newInstance("com.accela.aa.finance.fee.RFeeItemModel").getOutput();

// Prepare model for search
rFeeItemModel.setServiceProviderCode(aa.getServiceProviderCode());
rFeeItemModel.setAuditStatus("A");

// get Data
var rFeeItemsList = rFeeItemService.getFeeItemListByModel(rFeeItemModel);
if(rFeeItemsList && rFeeItemsList.size() > 0) {
	aa.env.setValue("data", rFeeItemsList);
} else {
	aa.env.setValue("data", new Array());
}
