{
  "EnvHealth/Land Use/*/Application": {
    "WorkflowTaskUpdateAfter": [
      {
        "metadata": {
          "description": "Issues a Land Use License",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [
            "Permit Issuance" ,
            "Decision Notification"
          ],
          "status": [
            "Issued" ,
            "Modification Request Approved"
          ]
        },
        "action": {
          "parentLicense": "EnvHealth/Land Use/*/Permit",
          "issuedStatus": "Active",
          "copyCustomFields": [
            "ALL" 
          ],
          "copyCustomTables": [
            "ALL"
          ],
          "expirationType": "Expiration Code",
          "expirationPeriod": "EH_GENERAL",
          "copyContacts": [
            "ALL"
          ],
          "createLP": false,
          "licenseTable": "",
          "refLPType": "Business",
          "contactType": "Applicant",
          "contactAddressType": "Mailing"
        },
        "postScript": ""
      }
    ]
  }
}