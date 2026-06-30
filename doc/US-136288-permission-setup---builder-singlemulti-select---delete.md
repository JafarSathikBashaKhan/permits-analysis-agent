# User Story 136288: Permission Setup - Builder | Single/Multi Select - Delete

## Metadata
| Field | Value |
|-------|-------|
| ID | 136288 |
| Type | User Story |
| Title | Permission Setup - Builder | Single/Multi Select - Delete |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Delete** 
 
When in the builder list screen 
Then should see the three dot in the action column 
** 
When invoke the three dots  
Then should see the option to delete the permission 
 
When invoke the option to delete the permission  
Then should see the alert pop-up as 'Delete vehicle. Are you sure you want to delete "$ permission name ( i.e 'Carer Permit') ?" with the option to delete and cancel 
When invoke the option to delete 
Then the selected permission should deleted. 
 
When invoke the button to cancel 
Then should go back to the list screen. 
 

** 
**Multi Select Delete** 
When multi select the permission to delete 
Then should have button to delete in the list screen. 
** 
When invoke the button to delete  
Then should open the pop-up with 'Delete All Permission? Are you sure want to delete all the selected Permissions' with button to Delete All and Cancel 
 
When invoke the button to delete  
Then should see the success indication as ' Permissions Deleted successfully' 
 
When invoke the button to cancel 
Then should close the pop-up. 
 
When two or more permission is selected 
Then should only the button to delete is invokable 

 
Error** 
When not able to edit due to technical issue or network issue 
Then should see the indication as "Something went wrong Please try again" 
** 
Audit/Event** 
**Single Delete Success** 
Event Type / Name: Permission Deleted 
Event Description: "Permission name" Deleted Successfully 
Date and Time: $CurrentTimestampUser Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)** 
User Name: $FirstName $LastName of the user who performed the action 
 

** 
 
**Multi Select Delete** 
 
Event Type / Name: Permission Deleted.Event Description: Permissions Deleted Successfully. 
Date and Time: $CurrentTimestamp 
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin) 
User Name: $FirstName $LastName of the user who performed the action
