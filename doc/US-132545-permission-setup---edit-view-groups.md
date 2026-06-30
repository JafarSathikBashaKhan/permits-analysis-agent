# User Story 132545: Permission Setup - Edit & View Groups

## Metadata
| Field | Value |
|-------|-------|
| ID | 132545 |
| Type | User Story |
| Title | Permission Setup - Edit & View Groups |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete; LV |
| Module | Permission Setup > Group |

---

## Acceptance Criteria

**Edit** 
**Given a Super admin/Contract admin
** 
 
When in the group list screen  
Then should see the group name invokable. 
** 
On invoking the respective group entry in the grid screen 
Then should be taken to view group screen 
And 
Then should see an option to edit in View screen 
 

 
When invoke the option to edit the group  
Then the following fields should be editable 

- Group Name 
- Type - Drop down 
- House Hold Limit 
- Max Vouchers & Scratch Books per Household 
- Group related to -  radio button 
- Back office use - Toggle 
 
And  
Then shoulds see the status of the group as 'Active' or 'Inactive'.

 
When make the necessary changes  
Then the button to save the changes should be invokable. 

 
When invoke the button to save the changes 
Then should see the success indication as 'Group Updated Successfully'. 

 
When the group is updated 
Then changes is updated in the group list screen. 

 
When in the view permission group screen 
Then should see the delete button 
 
When invoke the delete button 
Then should see the pop up based on the status of the group. 
 

 
Cancel** 
When invoke the button to cancel 
Then should see the pop-up as 'Are you sure you want to cancel? As this will reset the data on the screen and close it' with confirm and cancel button 
** 
 
When confirms the cancellation, 
Then it should be redirected back to the group List screen. 
Or 
When declines the cancellation, 
Then the user should remain on the Group Editing panel. 
 

 
Error** 
When not able to edit due to technical issue or network issue 
Then should see the indication as "Something went wrong. Please try again" 
** 
Audit/Event** 
**** 
**Edit Success** 
Event Type / Name: Group Updated 
Event Description: Group updated successfully 
Date and Time: $CurrentTimestampUser Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)** 
User Name: $FirstName $LastName of the user who performed the action
 
 
**
