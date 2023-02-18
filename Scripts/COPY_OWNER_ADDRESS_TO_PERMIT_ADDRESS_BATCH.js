//@ts-check
/*

Batch Job Script 
Name: COPY_OWNER_ADDRESS_TO_PERMIT_ADDRESS_BATCH
Description: Copies the Property Owner Business Address to the Complaint address for Animal Bite complaints
Author: Mike Zachry based on Chris Hansen's SDSS_Refresh_Token script

*/

var SCRIPT_VERSION = "3";
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
eval(getScriptText("INCLUDES_CUSTOM", null, true));

var debug = "";
var showDebug = 1;
var StartDate;

// begin main process
var params = loadEnvVars(true);
var runJob = startJob();
// var baseURL_SDSS = params["BaseUrlSDSS"] || "https://sdss.azurewebsites.net";
// var baseURL_SFTP = params["BaseUrlSFTP"] || "https://sftp-prod.azurewebsites.net";

if (runJob) {

	// var systemUserObj = aa.person.getUser("ADMIN").getOutput();
	var currentUserID = "ADMIN";
	// var startDate = new Date();
	// var startTime = startDate.getTime();			// Start timer
	var skippedDepartments = 0;
	var processedDepartments = 0;
	var emailedDepartments = 0;
	var emailsSent = 0;
	var statusCorrected = 0;
	showDebug = true;
	// var wfComment; // to accomodate customization that was done to getRecordParams4Notification() in INCLUDES_CUSTOM
	// logDebug("Start of Job");

	//loop through Department records with status of CAP required
	var getResult = aa.cap.getByAppType("EnvHealth","Animal Bites", "Animal Bites", "Permit");
	if (getResult.getSuccess()) {
		var list = getResult.getOutput();
		// logDebug("Success! Records Equals = " + list.length) ;
		for (var i in list) {
			propertyOwner = '';
			processedDepartments = list.length;
			capId = list[i].getCapID();
			// proceed if permit address is blank
			if (!addressExistsOnCap(capId) && getAppSpecific('Program Element',capId) == '1501 Animal Bites')  {
				// logDebug(getAppSpecific('Program Element',capId));
				// find the property owner address
				var contactArray = getContactArray(capId);
				propertyOwner = getContactObj(capId,'Property Owner');
				if (!matches(propertyOwner,null,undefined,"")) {
					// exploreObject(capId);
					var contactAddresses = new Array(propertyOwner.addresses)
					if (contactAddresses){
						// get the contact's business address
						// logDebug("getting the business address");
						// exploreObject(contactAddresses);
						for (ba in propertyOwner.addresses) {
							thisAddress = propertyOwner.addresses[ba];
							// logDebugObject(thisAddress);
							if (thisAddress.addressType == "Business" && !matches(thisAddress.getAddressLine1(),null,undefined,"") ) {
								logDebug("has a business address");
								// logDebugObject(thisAddress);
								createPrimAddressFromAddress(thisAddress, capId);
								emailedDepartments = ++emailedDepartments;
								break;
							}else{
								logDebug("is " + thisAddress.addressType + " address type or addressline1 was null");
							}
						}
						// if (thisAddress.addressType == "Business" && !matches(thisAddress.getAddressLine1(),null,undefined,"") ) {
							// break;
						// }
						// if the business address exists
						// if (addressAttributesArray["Business Address"]) {
							// replace the CAP address with the business address
						// }
					}else{
						// logDebug("couldn't get the addresses");
					}
				} 
			}else{
				skippedDepartments = ++skippedDepartments;
			}
		}
		
	}

	// logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");
	logDebug("Complaints processed:" + processedDepartments);
	logDebug("Complaints skipped: " + skippedDepartments);
	logDebug("Updated complaints: " + emailedDepartments);
	// logDebug("Emails sent " + emailsSent);
	// logDebug("Department Status values corrected " + statusCorrected);


}

endJob();

// end main process


// begin custom batch job functions

function createPrimAddressFromAddress(thisAddressModel, capId) {
    /*
    Author CGray
	Modified MZachry
    NOTE: Creates transactional address
    NOTE: Not setting street number/name/type due to inconsistent parsing. Setting setAddressLine1 instead
    */
    // var ownersResult = aa.owner.getOwnerByCapId(capId);
    // if (ownersResult.getSuccess()) {
        // var ownersArray = ownersResult.getOutput();
        // for (own in ownersArray) {
            // if (ownersArray[own].getPrimaryOwner() == "Y") {
                var newAddressModel = aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.AddressModel").getOutput();
                newAddressModel.setCapID(capId);
                newAddressModel.setServiceProviderCode(aa.getServiceProviderCode());
                newAddressModel.setAuditID(currentUserID);
                newAddressModel.setPrimaryFlag("Y");
                newAddressModel.setCity(thisAddressModel.getCity());
                newAddressModel.setState(thisAddressModel.getState());
                newAddressModel.setZip(thisAddressModel.getZip());
                // newAddressModel.setCountry("United States"); //Doesn't set?
                newAddressModel.setAddressLine1(thisAddressModel.getAddressLine1()); 
                // var newAdd = aa.address.createAddressWithAPOAttribute(capId, newAddressModel);
				// var newAdd = aa.address.createAddress(capId,newAddressModel);
				var newAdd = aa.address.createAddress(newAddressModel);
                if (newAdd.getSuccess()) {
                    logDebug("New address created from Owner");
                }
                else {
                    logDebug("Error creating new address: " + newAdd.getErrorMessage());
                }
            // }
        // }
    // }
}

function localLookup(stdChoice,stdValue) 
	{
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	
   	if (bizDomScriptResult.getSuccess())
   		{
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = "" + bizDomScriptObj.getDescription(); 
		}
	return strControl;
	}

function defaultAPIKeyValues(sftpBaseUrl, sdssBaseUrl, constructCode, environment) {
    if (typeof constructCode == "undefined" || constructCode == null) {
        constructCode = "";
    }
    if (typeof environment == "undefined" || environment == null) {
        environment = "";
    }

    var defaults = {
        "constructApiCode": constructCode,
        "constructApiEnv": environment,
        "SDSS_BASEURL": sdssBaseUrl,
        "SFTP_BASEURL": sftpBaseUrl,
        "SDSS_CACHEDOC": sdssBaseUrl + "/api/cachedocuments",
        "SDSS_CACHEREC": sdssBaseUrl + "/api/cacherecords",
        "SDSS_LIST": sdssBaseUrl + "/api/list",
        "SDSS_REFRESH": sdssBaseUrl + "/api/refreshtoken",
        "SDSS_URL": sdssBaseUrl + "/api/get",
        "SFTP_CREATEFOLDER": sftpBaseUrl + "/api/createfolder",
        "SFTP_DELETE": sftpBaseUrl + "/api/delete",
        "SFTP_DOWNLOAD": sftpBaseUrl + "/api/download",
        "SFTP_LIST": sftpBaseUrl + "/api/list",
        "SFTP_PINGGET": sftpBaseUrl + "/api/pingget",
        "SFTP_PINGPOST": sftpBaseUrl + "/api/pingpost",
        "SFTP_UPLOAD": sftpBaseUrl + "/api/upload",
    }
    for (var keyIdx in defaults) {
        var thisValue = localLookup("APIKey", keyIdx);
        if (typeof thisValue == "undefined" || thisValue == null || thisValue == "") {
            addOrEditStandardChoiceItemValue("APIKey", keyIdx, defaults[keyIdx]);
        }
    }
}

function addOrEditStandardChoiceItemValue(stdChoice, stdValue, stdDesc) {
    var bizDomResult = aa.bizDomain.getBizDomain

    var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);
    if (bizDomScriptResult.getSuccess()) {
        var bizDomainScriptModel = bizDomScriptResult.getOutput();
        var BizDomainModel = bizDomainScriptModel.getBizDomain()
        BizDomainModel.setDescription(stdDesc);
        BizDomainModel.setAuditStatus("A")
        var editResult = aa.bizDomain.editBizDomain(BizDomainModel);
        if (editResult.getSuccess()) {
            logDebug(stdValue + " set to '" + stdDesc + "'.");
        } else {
            logDebug("**ERROR editing standard choice item value:" + editResult.getErrorMessage());
            return false;
        }
    } else {
        var bizDomScriptResult = aa.bizDomain.createBizDomain(stdChoice, stdValue, "A", stdDesc)
        if (bizDomScriptResult.getSuccess()) {
            logDebug(stdValue + " set to '" + stdDesc + "'.");
        } else {
            logDebug("**ERROR creating standard choice item value:" + bizDomScriptResult.getErrorMessage());
            return false;
        }
    }
    return true;
}


function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function httpGet(url) {
    var title = "httpGet(): ";

    if (typeof url == "undefined" || url == null || url == "") {
        logDebug(title + "URL can't be undefined, null, or blank.");
        return null;
    }

    var getResult = aa.httpClient.get(url);
    if (!getResult.getSuccess()) {
        aa.print(title + "Error in HTTP GET: " + getResult.getErrorMessage());
        return null;
    }
    logDebug(title + "aa.httpClient.get was successful.");
    var get = getResult.getOutput();

    return get;
}

/**
 * Looks up a standard choice and returns the standard choice value/desc
 * in name/value pair in a JSON array. Access the 
 * description value with object[value]. 
 * @example var scArray = LookupCSLB();
 * @example var descr = scArray[value];
 * @param {string} stdChoice name of standard choice.
 *
 * @return {Array}  array object with the value as the index. 
 */
function LookUpStandardChoice(stdChoice) {
    var title = "LookUpStandardChoice(): ";

    var retArray = [];
    var bizDomainResult = aa.bizDomain.getBizDomain(stdChoice);
    var bizDomain;
    if (bizDomainResult.getSuccess()) {
        bizDomain = bizDomainResult.getOutput().toArray();
    } else {
        return retArray;
    }

    var bizDomainLen = bizDomain.length;
    for (var i = 0; i < bizDomainLen; i++) {
        if (bizDomain[i].auditStatus == "A") {
            retArray[bizDomain[i].bizdomainValue] = bizDomain[i].description;
        }
    }

    return retArray;
}

// end custom batch job functions


// begin standard batch job functions

/**
 * function to close out the batch job with logging.
 *
 * @return {void} 
 */
function endJob() {
    var endDate = new Date();

    var elapsed = Number(endDate) - Number(StartDate);
    var elapsed = elapsed / 1000;

    logDebug(" ");
    logDebug("==========");
    logDebug("Batch job ended on " + endDate);
    logDebug("Batch job elapsed time: " + elapsed);

    aa.env.setValue("ScriptReturnCode", "0");
    aa.env.setValue("ScriptReturnMessage", debug);

    return;
}

/**
 * function to start the batch job with debug output for logging.
 *
 * @return {boolean} flag indicating whether the batch job was started 
 * successfully or not.
 */
function startJob() {
    // update global variable with start of batch job
    StartDate = new Date();

    var batchJobName = "" + aa.env.getValue("BatchJobName");
    var batchJobId = 0;
    var batchJobIdResult = aa.batchJob.getJobID();
    var runJob = false;
    if (batchJobIdResult.getSuccess()) {
        batchJobId = batchJobIdResult.getOutput();
        runJob = true;
        logDebug("Batch job " + batchJobName + " (" + batchJobId + ")");
        logDebug("Batch job begun on " + StartDate);
        logDebug("==========");
        logDebug(" ");
    } else {
        logDebug("Batch job not found. Message = " + batchJobIdResult.getErrorMessage());
    }

    return runJob;
}

/**
 * Function to retrieve a script's text. If the useProductScripts is set to 
 * true function retrieves the master script otherwise function retrieves the 
 * text of the business script.
 *
 * @param {string} vScriptName - script name
 * @param {string} servProvCode - service provider code. If null, function 
 * defaults to the current service provider code
 * @param {boolean} useProductScripts - flag to indicate whether to retrieve 
 * from master scripts or business scripts
 * @return {string} text of the script 
 */
function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        }
        else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    }
    catch (err) {
        return "";
    }
}

/**
 * Loads all of the environment variables and returns the variables in an 
 * array where the key is the environment variable name and value is the value
 * of the environment variable.
 * 
 * @param {boolean} logFlag - flag to indicate whether to log the parameters as they are
 * loaded
 *
 * @return {Array} array of environment variables with the variable name as the
 * key. 
 */
function loadEnvVars(logFlag) {
    var newArr = [];
    var params = aa.env.getParamValues();
    var keys = params.keys();
    var key = null;
    while (keys.hasMoreElements()) {
        key = keys.nextElement();
        var keyValue = aa.env.getValue(key);
        newArr[key] = keyValue;
        if (logFlag) {
            logDebug("Loaded parameter " + key + " = " + keyValue);
        }
    }
    return newArr;
}

function exploreObject(objExplore) {
    logDebug("Methods:");
    for (var x in objExplore) {
        try {
            if (typeof (objExplore[x]) === "function") {
                logDebug("<font color=blue><u><b>" + x + "</b></u></font> ");
                logDebug("   " + objExplore[x] + "<br>");
            }
        } catch (err) {
            logDebug("exploreObject(): **ERROR** in Functions: " + err.Message);
        }
        var counter = objExplore.length;
    }

    logDebug("");
    logDebug("Properties:");
    for (var y in objExplore) {
        try {
            if (typeof (objExplore[y]) !== "function") {
                logDebug("  <b> " + y + ": </b> " + objExplore[y]);
            }
        } catch (err) {
            logDebug("exploreObject(): **ERROR** in Properties: " + err.Message);
        }
    }
}

  function logDebugObject(myObject) {
/*
usage - logDebugObject(object)

author - Michael Zachry
created - 10/10/2018

updates
10/11/2018 - initial version

*/
  //list the methods
  try {
    logDebug("object is is a " + myObject.getClass());
    logDebug("object has the following methods:");
    for (x in myObject) {
      if (typeof(myObject[x]) == "function" ) {
        logDebug("  " + x);
      }
    }

    //list the properties and values    
    logDebug("object has the following properties and values:");
    for (x in myObject) {
      if (typeof(myObject[x]) != "function" ) {
        logDebug("  " + x + " = " + myObject[x]);
      }
    }
  } catch (err) {
    logDebug("A JavaScript Error occured: " + err.message);
  }
}


// end standard batch job functions