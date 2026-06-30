# User Story 142873: Templates | Terms and Condition | Single/Multi select Delete

## Metadata
| Field | Value |
|-------|-------|
| ID | 142873 |
| Type | User Story |
| Title | Templates | Terms and Condition | Single/Multi select Delete |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Templates |

---

## Acceptance Criteria

**Pre-requisite: Permission setup> Builder> [Permission Name] > Permission Tab > General setting ** 
When the terms and condition template is selected in general settings 
And published then it should link to permission in the customer portal 
And should not be deleted. 
**
** 
**Single Delete** 
When in the action column  
Then should see the delete icon  
** 
If the terms and conditions is not linked to permission 
Then should see the pop up "Deleted Terms and Conditions Are you sure you want to delete the selected 'Terms and Conditions' " with Delete and Cancel button 

 
if the terms and condition is linked to permission 
 
 
Then should see the pop up 'This "Template name" is linked with permissions and cannot be deleted.' 
 
 
Delete** 
When invoke delete,  
Then toaster message should appear: "Terms and Conditions deleted successfully." 
And it should no longer appear in the customer portal for the selected permission. 
**Cancel** 
When the cancel action is invoked, the system should revert back to the list screen without making any changes. 
** 
Multi Select Delete** 
When two or more terms and condition are selected using checkboxes,** 
Then the Delete button should appear in the list screen toolbar. 
 
If the selected all the template are not linked with permissions, 
Then should see the pop up "Deleted All Terms and Conditions Are you sure you want to delete all the selected  Terms and Conditions " with Delete All and Cancel button 

 
If the selected all the template are linked with permission 
Then should see the pop up 'The selected terms and conditions are linked with permissions and cannot be deleted.' with the option to close the pop up.
 

 
If the selected the combination of linked permission and not linked permission 
 
Then should see the pop up 'You have selected 6 terms and conditions. Only 4 are not linked to any permission and will be deleted. The remaining 2 are already linked and will be skipped.' with Delete All and cancel button.
 
 
Delete All** 
When invoke delete all,  
Then toaster message should appear: "Terms and Conditions deleted successfully." 
** 
Cancel** 
When the cancel action is invoked, the system should revert back to the list screen without making any changes. 
** 
Audit/Event  ** 
 
 
**Single Delete** 
 
 
Event Type / Name: Terms and Condition deleted 
Event Description:  "Template Name" deleted successfully 
Date and Time: Current $timestamp** 
User Role: Role of the user 
User Name: First Name and Last Name of the Back office user 
 
 
 
 
 
Multi Select Delete** 
 
Event Type / Name: Terms and condition deleted 
Event Description: Terms and condition deleted successfully 
Date and Time: Current $timestamp 
User Role: Role of the user 
User Name: First Name and Last Name of the Back office user
