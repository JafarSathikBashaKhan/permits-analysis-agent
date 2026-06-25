# US-193567: Application | Application Details | Renewal | Expired Documents | New documents to be uploaded

| Field | Value |
|-------|-------|
| **ID** | 193567 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**BO uploads expired documents during Renewal** 
**Background:** 
**Given a BO User proceeds with Renewal process [#193350](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/193350/) ** 
**And an application exists in work queue state "Pending-Renewal"** 
**And the Renewal Summary displays one or more documents with status "Expired"** 

 
Given the confirmation popup is displayed 
When the BO User clicks "Cancel" 
Then the popup closes and the user returns to the Renewal Summary 
And no document upload screen is shown 

 
**Scenario: Proceed to Document Upload screen** 
Given the Renewal summary page 
When the BO User clicks "Renew" 
Then the system should navigate to the Document Upload screen 
And display each expired document type with options: BO to upload new updated documents using 
- Upload New File 
And each file upload should show progress and validation status 
And document uploads successfully  

 
Note: Refer : [#164802](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/164802/)   
 
 
 
 
 

- Expiry document settings can be configured at both the contract level and the individual document type level. 
- If expiry settings are defined for a specific document type, those settings should take precedence over the contract-level configuration. 
- For any document types where expiry settings are not specified, the system should apply the expiry duration defined at the contract level. 
 
  

 
**Scenario: Successful uploads included in Document Section ** 
Given the BO User uploaded or selected valid replacements for all expired documents 
When uploads complete successfully 
Then the system should include these documents in the application Document Section 
And the BO should be able to proceed to payment section on invoking "Next" 

 
**Scenario: Next triggers Renewal confirmation popup** 
Given all required expired documents have been refreshed and are valid 
When the BO User clicks "Next" 
Then the system should display the payment screen" 

 
**Scenario: Missing required proof blocks Next** 
Given contract requires proof for a payment mode or document type 
When the BO User attempts to click "Next" without required proof 
Then the system should block progression and show an error "Complete Uploading the required documents to proceed further?  " 

 
**Event Name: Document Upload Completed** 
Event Description: Document successfully uploaded or selected for renewal and added to application documents. 
Event Category: Renewal / Document Update 
Application ID: $ApplicationID 
User Role: BO User 
User Name: $UserName 
Date & Time: $Timestamp
