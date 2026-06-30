# User Story 135883: Permission Setup - Groups | Single & Multi Select - Delete

## Metadata
| Field | Value |
|-------|-------|
| ID | 135883 |
| Type | User Story |
| Title | Permission Setup - Groups | Single & Multi Select - Delete |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Group |

---

## Acceptance Criteria

**Delete** 
**Given a Super admin/Contract admin** 
When in the group list screen 
Then should see the delete icon in the action column 
** 
When invoke the delete icon   
Then should see the option to delete the group 
 
Note: The status should not be shown in the list screen 
When tries to delete the group marked as 'Active' 
Then should open the pop-up with 'Delete Selected Group. The selected group is currently linked to active permissions and cannot be deleted' with the button to close the pop-up. 
 
When invoke the button to close the pop-up 
Then should go back to group list screen. 
 
When tries to delete the group marked as 'Inactive' 
Then should open the pop-up with 'Delete Selected Group. Are you sure you want to delete "" ?" with button to Delete and Cancel 
 
When invoke the button to delete  
Then should see the success indication as ' Deleted successfully' 
 
 
When invoke option to cancel 
The the should go back to the list screen 
 

** 
**Multi Select - Delete** 
When multi select the group 
Then should have button to delete group in the list screen 
** 
Note: The status should not be shown in the list screen 
When selects the group marked as 'Active'  
Then should open the pop-up with 'Delete Selected Groups. The selected groups are currently linked to active permissions and cannot be deleted' with the button to close the pop-up. 
 
When invoke the button to close the pop-up 
Then should go back to group list screen. 
 
When selects the group marked as 'Inactive' 
Then should open the pop-up with 'Are you sure want to delete all the selected  Groups?" with button to Delete All and Cancel 
 
When invoke the button to delete all 
Then should see the success indication as ' Groups Deleted successfully' 
 
 
 
 
 
 
 
When user selecting multiples of active and inactive groups  
Then alert through a pop up stating " groups have active permissions and cannot be deleted. Do you want to proceed deleting the remaining  groups?" 
With Delete and Cancel button. 
 
 
When invoke the button to delete 
Then the status marked as inactive should be deleted 
 
When two or more groups is selected 
Then should only the button to delete group is invokable in the list screen. 

 
Cancel** 
When invoke the button to cancel 
Then should go back to the group list screen. 
** 
Error** 
When not able to delete due to technical issue or network issue 
Then should see the indication as "Something went wrong. Please try again" 
** 
Audit/Event** 
**Multi Delete Success** 
Event Type / Name: Group Deleted.Event Description: Group Deleted Successfully. 
Date and Time: $CurrentTimestamp** 
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin) 
User Name: $FirstName $LastName of the user who performed the action 

 
Single Delete Success** 
Event Type / Name: Group Deleted 
Event Description: "Group name" Deleted Successfully 
Date and Time: $CurrentTimestampUser Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin) 
User Name: $FirstName $LastName of the user who performed the action
