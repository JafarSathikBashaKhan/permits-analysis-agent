# US-111325: System Users - View / Edit Overview Information

| Field | Value |
|-------|-------|
| **ID** | 111325 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**View User Details (Invoke Line Item)** 
Given a Super admin / Contract admin,  
When in the list screen, 
Then should be able to click on a user to view the user details. 

 
When selected a user, 
Then should be able to see the details of that user. 
& 
Then should see the 'Full Name' of the user as title and corresponding role as a badge. (Ref Figma) 

 
When viewing the details, 
Then should see them segregated as 'Overview, Configuration and Audit'. 

 
**Overview Tab** 
When viewing the 'Overview' user information, 
Then should see the below information, 

- Role 
- First Name 
- Last Name 
- Email 
- Contact Number 
- Change permit start and end date toggle settings 
 
 When viewing the user Overview information, 
Then there should be provision to edit them including the 'Change permit start and end date toggle settings'. 

 
**Edit** 
When wants to edit the information, 
Then should be able to enter edit mode by invoking the appropriate button. 

 
When enters Edit mode,
Then the following fields should become editable: 

- Role (Super admin role should not be shown in drop-down) 
- First Name  
- Sur Name  
- Email  
- Contact Number  
- Change permit start and end date toggle 
 
When edits the email field, 
Then duplicate email ID should not be allowed. 

 
When edited the information, 
Then should be able to save the changes. 
 

 
When saved the changes, 
Then should see the indication as "Updated successfully" 
 

 
When the changes are not saved due to technical issue, 
Then should see the indication as "Something went wrong".  
 

 
**Mandatory fields** 
When removes values from any of the mandatory fields below, 
Then should not be allowed to Save the changes. 
& 
Then should see 'This field is required" against each fields. 

- **Role (Super admin role** should not be shown in drop-down) 
- **First Name ** 
- **Sur Name ** 
- **Email ** 
- **Contact Number ** 
 
**Mandatory Field Validation** 
When deleted the data in any field and tried to save the entry, 
Then a mandatory field error message should be shown 
 

 
When selected 'X' or 'Cancel' button, 
Then should see a confirmation pop-up. 
 

 
**Deactivate** 
When viewing the information, 
Then should be able to deactivate the user account by selecting the appropriate button in the UI. 
& 
Then should see a confirmation pop-up. 

 
When confirmed the preference to deactivate, 
Then the account should be deactivated and the status should be updated. 
 

 
**Activate**: 
When viewing the information of deactivated account, 
Then should be able to activate the user account by selecting the appropriate button in the UI. 
& 
Then should see a confirmation pop-up. 

 
When confirmed the preference to activate, 
Then the account should be activated and the status should be updated. 

 
**Events Capturing**: 
Event Type / Name: System user basic information updated 
Event Description: System user basic information updated 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change 

 
Event Type / Name: System user deactivatedEvent Description: System user deactivated
 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change
 

 
Event Type / Name: System user activatedEvent Description: System user activated
 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change
 

 
 
 
_Note_: 
 
 
 
Ignore the "Agent Assist toggle" settings for now. 
This will be covered [#111848](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/111848/)
