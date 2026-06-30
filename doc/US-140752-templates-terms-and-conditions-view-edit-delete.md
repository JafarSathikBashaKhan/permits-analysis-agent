# User Story 140752: Templates | Terms and Conditions | View | Edit & Delete

## Metadata
| Field | Value |
|-------|-------|
| ID | 140752 |
| Type | User Story |
| Title | Templates | Terms and Conditions | View | Edit & Delete |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Figma to be added; Fully Complete; LV |
| Module | Templates |

---

## Acceptance Criteria

**View** 
When in the template name 
Then should be invokable 
** 
On invoking the respective template in the grid screen 
Then should open the slide to view and edit the terms and conditions 
 
When in the view screen  
Then should the below existing data 

- Template Name 
- Permission Type 
- T&C template 
 
 
 
And should have the edit & delete button in the view screen 
 
Edit** 
When invoke the button to edit 
Then the following fields should be editable: 
 

- Template Name 
- Permission Type 
- Text Editor 
 
 
**Error** 
When not able to edit document type due to technical issue or network issue 
Then should see the indication as "Something went wrong Please try again" 
** 
 
Save** 
When necessary changes are made, 
Then the Save button should become enabled. 
** 
On saving the details, 
Then toaster message appear as 'Terms and Conditions updated successfully' 
And then the changes should be reflected in the customer portal. 

 
Cancel** 
 
When invoke the cancel button 
Then should see the pop up 'Are you sure you want to cancel' with Yes and No 
** 
Yes - Should revert back to list screen 
No- Should stay on the edit screen 
 
 
Delete** 
When in the view screen 
Then should have the delete button 
** 
If the terms and conditions is not linked to permission 
Then should see the pop up "Deleted Terms and Conditions Are you sure you want to delete the selected 'Terms and Conditions' " with Delete and Cancel button 
 
if the terms and condition is linked to permission 
 
 
Then should see the pop up 'This "Template name" is linked with permissions and cannot be deleted.' 
 
 
Delete** 
When invoke delete,  
Then toaster message should appear: "Terms and Conditions deleted successfully." 
** 
Cancel** 
When the cancel action is invoked, the system should revert back to the list screen without making any changes. 
 
** 
Audit/Event**  
**Edit** 
Event Type / Name: Terms and Conditions updated 
Event Description:  Terms and Conditions updated successfully 
Date and Time: Current $timestamp** 
User Role: Role of the user 
User Name: First Name and Last Name of the Back office user 
 
 
 
 
 
Delete** 
 
 
Event Type / Name: Terms and Condition deleted 
Event Description:  "Template Name" deleted successfully 
Date and Time: Current $timestamp** 
User Role: Role of the user 
User Name: First Name and Last Name of the Back office user 
 
 
 
 
 
 
**
