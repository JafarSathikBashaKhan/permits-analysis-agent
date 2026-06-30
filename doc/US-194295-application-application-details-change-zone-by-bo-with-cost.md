# US-194295: Application | Application Details | Change Zone (By BO) with cost

| Field | Value |
|-------|-------|
| **ID** | 194295 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**** 
**Change Zone With Pricing and Payment** 
As a BO user (on request from customer ) 
I want to change the application's zone with correct pricing and payment capture 
So that the updated zone is applied only after successful payment 
**Background:** 
Given an applicant requests for change of zone to BO user 
And the Bo has the provision to change zone 
And BO user triggers change zone from More actions 
**Scenario: Preview zone change displays pricing summary** 
When the BO user selects to change the zone to a new zone from dropdown 
And the BO user clicks “with cost” 
Then the system calculates the pricing details and Displays cost summary details in an accordion: 
When BO user opens the accordion (down arrow), then it displays the below detail;s 
Cost summary 
| Current Zone price      
| Selected Zone price     
| Price difference        
| Admin fee            
| VAT (2%)    - Need to display value 2% or 5% based on configured in contract settings)      
| Price Differences :   
And BO user should be able to close the accordion  
And such that system UI displays the email template accordingly 
And default configured email template displays 
subject: as configured in template settings 
Email body : As configured in template settings 
And BO user should be able to add any attachments if required, and attachment displays below the email body 
And BO user should be able to add any notes in the Email body and insert Merge fields as required 

 
And VAT percentage value to be displayed based on the configured in contract settings and calculation has to be made based on the Price. 

 
**Scenario: BO user initiates zone change and payment email is sent** 
Given the pricing preview is displayed 
When the BO user clicks the "Preview and Change zone" button 
Then a Preview window displays with "cancel" and "Send change zone" 
And upon invoking "Send Change Zone"  
Then the system sends an email to the customer about the pricing information and complete payment at his end 
Update work Queue : "Waiting for payment" 
**Scenario: Payment successful – zone updated and application activated** 
Given a pending zone change request exists for the application 
And the customer completes the payment successfully 
When the payment gateway sends a success confirmation to the system 
Then the system updates the application zone to "selected zone” 
And the application state is set to "Active" 
And a confirmation email is sent to the customer 

 
**Scenario: Payment fails – zone remains unchanged** 
Given a pending zone change request exists for the application 
When the payment gateway sends a failure notification 
Then the system does not update the application zone 
And the application remains in its previous state 
And an audit event  logged 

 
**Scenario: BO user cancels the zone change request before payment** 
Given a pending zone change request exists for the application 
When the BO user clicks "Cancel"  zone change request 
Then the system cancels the pending request 
And the application remains unchanged 
Work queue state defined in[174594Application | Application Details | Work Queue States | Change Zone](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/174594/) 
 
[In Development](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/174594/) 
 
 
**Event Name:** Zone Change Requested **Event Description:** BO user confirmed change zone; system sent payment completion email to customer **Event Category:** Zone Change / Request / Notification**Application ID:** $ApplicationID**User Role:** BO User**User Name:** $UserName**Date & Time:** $Timestamp 
**Event Name:** Zone Change Completed**Event Description:** Application zone updated from <OldZone> to <NewZone> following successful payment.**Event Category:** Zone Change / Executed**Application ID:** $ApplicationID**User Role:** System**User Name:** Auto Zone Update Service**Date & Time:** $Timestamp 
**Event Name:** Payment Failed for Zone Change**Event Description:** Attempt to process zone-change payment failed.**Event Category:** Payment / Failed**Application ID:** $ApplicationID**User Role:** Customer**User Name:** $CustomerName**Date & Time:** $Timestamp
