# US-167242: Print | Physical Permission | Send to Print

| Field | Value |
|-------|-------|
| **ID** | 167242 |
| **Type** | User Story |
| **Module** | Print |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Prerequisite: ** 
When Apply print is enable in the contract settings [MNPS]  
Then should only the 'Send to Print' option is show in the Physical Permission grid and action column 

 
**Select Single Application** 
Given a super admin / contract admin is on the grid screen 
When in the grid screen navigate to the action column 
Then should see the three dots 
 
When click the three dots  
Then have the send to print option 
 
When the user clicks the send to print button 
Then the selected letter should be placed in BLOB. 
And the letters should be placed in the BLOB location as **PDF** format
 

 
**Update Application Status** 
When the letter is successfully stored in the BLOB location for the selected application 
Then the application’s status should be updated to Active.
 
And the application should be removed from the 'Physical Permission' grid screen 
And it should appear under the Application Menu as an active permission. 
 
 
 
**Select Multiple Applications** 
Given a super admin / contract admin is on the grid screen 
When the user views the list of applications 
Then the user should be able to select multiple applications using checkboxes next to each application. 
 
**Click Print Button** 
Given an applications selected via the check box in the grid screen 
Then should have the Send to print button in the grid screen 
 
When the user clicks the Send to print button 
Then the system should stored all selected letters in BLOB. 
And the letters should be placed in the BLOB location as **PDF** format 

 
**Update Application Status** 
When the letter is successfully stored in the BLOB location for all selected applications 
Then the application’s status should be updated to Active.
 
And the application should be removed from the 'Physical permission' grid screen 
And it should appear under the Application Menu as an active permission. 
 

 
 
**Note:** When an item is sent to the print partner, it should **not remain in the queue awaiting a response**. Once the item is sent, it should be **immediately removed from the queue**, and the **status should be updated accordingly**.

If there is any **failure response from the print partner**, it must be **captured and logged in the system audit** for traceability.
 

 
 
When I have success or failure responses from print partner 
Then the event to be captured in the system audits as below, 
  
**Print Success** 
Event type/name: Print succeeded 
Event Description: "Reference Number" Print succeeded 
User: Print Service 
Date & Time: Response date and time 
Event Category: print 
 

 
**Print Failed** 
Event type/name: Print Failed 
Event Description: "Reference Number" Print Failed 
User: Print Service 
Date & Time: Response date and time 
Event Category: print 
 

 
When the Print failed. 
Then the user will manually investigate with the print response that was received in E-mail from the print partner. (Not handle in the system for failed application) 
 

 
**Event ** 
**Multiple Letter Send** 
 
Event Type / Name: Physical permission letter downloaded 
Event Description: "Reference number" physical permission letter downloaded  
 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Print 
 
 
**Single Letter Send** 
 
Event Type / Name: Physical permission letter downloaded 
Event Description: "Reference number" physical permission letter downloaded  
 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Print
