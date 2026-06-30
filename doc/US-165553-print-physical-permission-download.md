# US-165553: Print | Physical Permission | Download

| Field | Value |
|-------|-------|
| **ID** | 165553 |
| **Type** | User Story |
| **Module** | Print |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Select Single Application** 
**Given a super admin / contract admin is on the grid screen**
 
**When in the grid screen navigate to the action column** 
**Then should see the three dots** 

 
**When click the three dots ** 
**Then have the download option** 

 
When the user clicks the Download button 
Then the system should download selected letter. 
And the letter should be: 

- Downloaded in **PDF format** 
 
 
**Update Application Status** 
When the letter is downloaded successfully for the selected application 
Then the application status should be updated to Active. 
And the application should be removed from the 'Physical permission' grid screen 
And it should appear under the Application Menu as an active permission. 

 
 
**Select Multiple Applications** 
Given a super admin / contract admin is on the grid screen
 
When the user views the list of applications 
Then the user should be able to select multiple applications using checkboxes next to each application. 

 
**Click Print Button** 
Given an applications selected via the check box in the grid screen 
Then should have the Download button in the grid screen 

 
When the user clicks the Download button 
Then the system should download all selected letters. 
And the letters should be: 

- Downloaded in **PDF format** 
 
 
 
**Update Application Status** 
When the letter is downloaded successfully for all selected applications 
Then the application’s status should be updated to Active. 
And the application should be removed from the 'Physical permission' grid screen 
And it should appear under the Application Menu as an active permission. 

 
 
Downloaded file name (Reference number. Pdf) 
**Event ** 
**Multiple Letter Download** 
Event Type / Name: Physical permission letter downloaded 
Event Description: "Reference number" physical permission letter downloaded  
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration 
 

 
**Single letter Download** 
Event Type / Name: Physical permission letter downloaded 
Event Description: "Reference number" physical permission letter downloaded  
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration 

 
Status Update 
****Event Type / Name: Physical permission status updated 
Event Description: "Reference number" physical permission status updated as active 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
