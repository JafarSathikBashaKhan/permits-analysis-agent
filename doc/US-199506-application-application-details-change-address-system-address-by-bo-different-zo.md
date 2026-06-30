# US-199506: Application | Application Details | Change Address (system address ) By BO - Different zone  - Email notification

| Field | Value |
|-------|-------|
| **ID** | 199506 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Pre-condition : Active** 
**Background**: 
Given an application is in Active state 
And the application is in a state that permits change of address 
And BO user has updated with new address and pricing details have been calculated and displayed based on new zone which is different from existing zone. 

 
**Scenario: Proceed change address moves application to Waiting for Payment and opens Send Email screen** 
When the BO user clicks "Proceed" button 
And the system pre-populates the email subject and email body with the default change-address payment template 
And BO user should be able to view the email details, should be able to include insert merge fields if required and include attachments if any 
And the Bo user should be able to invoke "Preview and change address" button 

 

 

 
**Scenario: BO user can view and edit email subject and body, add merge fields and attachments** 
Given the BO user is on the "Send Email" screen for the application 
Then the BO user can view the email subject field 
And the BO user can view the email body field 
And the BO user can edit the email subject 
And the BO user can edit the email body 
And the BO user can insert merge fields 
And the BO user can add one or more attachments  
with "Cancel " and "change address & Send Email"button 
**Scenario: BO sends change address payment email to the customer** 
Given the BO user has reviewed the email subject and email body 
And mandatory fields such as email subject, email body and recipient email are filled 
When the BO user clicks "change address & Send Email" 
Then the system sends an email to the customer's email address 
And the email includes the payment information and relevant merge field data 
And the application remains in "Waiting for payment" state 

 
When invoking cancel , change address process is cancelled and application remains in same sate 
Updated work queue : Active state 

 
**Scenario: Payment successful - address updated and application moves to Active** 
Given the application is in "Waiting for payment" state due to change of address 
When the payment is successful for the change address  
Then the system updates the application address to the new address details  
And the application state is changed to "Active" 

 
**Scenario: Payment failed - application remains in Waiting for Payment** 
Given the application is in "Waiting for payment" state due to change of address 
When the payment gateway notifies the system that payment has failed 
Then the application address is not updated 
And the application remains in "Waiting for payment" state 
Then the application state is updated to "Waiting for payment" 

 
**Note**: Email template to be change address approved , if the change address is happened for same zone. Rest of the email context are similar as mentioned 
Mail content required for [#193136](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/193136/)  & [#193349](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/193349/)  
 
 
 
 
 
 
 
 
 
 
 
 

 
**Event Name:** Change Address - Proceeded to Waiting for Payment**Event Description:** BO user proceeded with change address and moved the application to Waiting for payment state.**Event Category:** Change Address / State Transition**Application ID:** $ApplicationID**User Role:** BO User**User Name:** $UserName**Date & Time:** $Timestamp 
**Event Name:** Change Address Successful**Event Description:** Application address updated to new address after successful payment and application moved to ACTIVE state**Event Category:** Change Address / Executed**Application ID:** $ApplicationID**User Role:** System**User Name:** Address Update Service**Date & Time:** $Timestamp 

 

 
**Event: Change of Address – Cancelled** 
Event Name: Change of Address Cancelled 
Event Description: BO User cancelled the Change of Address operation. 
Event Category: Address Update / Cancelled 
Application ID: $ApplicationID 
User Role: BO User 
User Name: $UserName 
Date & Time: $Timestamp
