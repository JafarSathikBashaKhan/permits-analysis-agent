# US-193136: Application | Application Details | Change Address (system) By BO - same zone

| Field | Value |
|-------|-------|
| **ID** | 193136 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Pre-condition : Active** 
**** 
**Scenario: Change address using system-provided address from dropdown** 
As a BO user  I want to change a customer's address and capture required documents so that the system can show zone differences and pricing only after documents are complete 
**Background:** 
Given an application with exists 
And the application is in ACTIVE state that permits address change 
And BO user proceeds Change address based on applicant request 
And on invoking “Change Address” from more action, change address pop-up window displays 

 
**Scenario: BO selects new postcode/property and sees zone information** 
When the BO user selects Postcode from the dropdown or should type the postcode , based on that pincode displayed in the dropdown 
And BO user should be able to select the PINCODE 
And based on the selected postcode Property dropdown displays and upon selection of property , street list displays for user selection. 
And user should be populated with the town detail 

 
When the postcode, property, street and town details are provided 
System fetches the Zone details and if the ZONE is same as existing it displays the details in a section as :  
*"Selected Zone is located on <Zone name> "* 
*"You are changing the address to the same zone. So no extra charges apply"* 

 
**Scenario: BO uploads required documents for the new address** 
Given the required document types for this permission are displayed 
When the BO user uploads all required documents for the application 
And the system displays the uploaded documents in the UI 

 
**Scenario: BO confirms address change ** 
Given document upload is completed and BO user invokes "Proceed" button 
Then Change Address  E Mail window displays 
Email subject - as configured in MNPS 
Attachment icon 
Email body template- as configured in MNPS 
Attachment section  
With "Back" " Cancel" and "Preview and change Address" buttons displayed 
on invoking "Preview and change Address" button Preview email window displays  
ON invoking cancel - will cancel the change address update 
On invoking Back - will move back earlier screen 

 
Preview email 
Given BO user on invoking "Preview and change Address" button  
Then Preview email window displays with details of email previewed 
And BO user has option to "Cancel " and "Change Address & Send Email " button 
ON invoking "Change Address & Send Email " button 
Email notification will be triggered to applicant on change address completed 
Then the system creates an change address request record with status "Active"  
Address is updated with respect to the permit 
**Updated work-queue state : Active**
 

 
**Note **: Email is covered in different story [#199506](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/199506/) 

 
**** 
**** 
**Event: Change of Address – initiated** 
Event Name: Change Address initiated 
Event Description: <BO User> initiated application change address  
Event Category: Address Update / initiated 
Application ID: $ApplicationID 
User Role: BO User 
User Name: $UserName 
Date & Time: $Timestamp 

  
**Event: Change of Address – Updated Successfully** 
Event Name: Address Updated 
Event Description: BO User successfully updated the application address using system-provided address. 
Event Category: Address Update / Completed 
Application ID: $ApplicationID 
User Role: BO User 
User Name: $UserName 
Date & Time: $Timestamp 

 
**Event: Change of Address – Cancelled** 
Event Name: Change of Address Cancelled 
Event Description: BO User cancelled the Change of Address operation. 
Event Category: Address Update / Cancelled 
Application ID: $ApplicationID 
User Role: BO User 
User Name: $UserName 
Date & Time: $Timestamp
