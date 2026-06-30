# User Story 132611: Permission Setup | Builder  - Create Permission

## Metadata
| Field | Value |
|-------|-------|
| ID | 132611 |
| Type | User Story |
| Title | Permission Setup | Builder  - Create Permission |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete; LV |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Given a Super admin/Contract admin** 
 
 
 
 
 
 
 
 
When in the Permission list screen 
Then should have the button to create the new permission. 
 
When invoke the button to the create the permission 
Then a right-side slider panel should open with the following required** fields  

- Permission Name 
- Type 
- Group 
- Description 
 
Permission Name - Free Text field, should accept maximum 100 characters, Duplicates permission name should be restricted through a validation message.  
Type'- Drop down (The type that are created in the contract level should listed in the drop down, both default and custom types).  
Group - Drop down (Groups created should be listed in this dropdown)  
Description - Alpha numeric field should accept maximum of 500 characters. 
** 
When type is selected from the dropdown 
Then the groups associated with that selected type should be listed in group field.  

 
Create button** 
When filled with required details  
Then the button to create the new permission should be available 
** 
When invoke the button to create the new permission  
Then should see the success indication 'New Permission Created Successfully' 
 
When the new permission is added  
Then should display in the permission list screen as 'Draft' in status column. 
 
Cancel button** 
When invoke the button to cancel 
Then should see the pop-up as 'Are you sure you want to cancel? As this will reset the data on the screen and close it' with confirm and cancel button 
** 
 
When confirms the cancellation, 
Then it should be redirected back to the Permission List screen. 
Or 
When declines the cancellation, 
Then the user should remain on the Permission Creation panel. 

 
Error** 
When not able to create due to technical issue or network issue 
Then should see the indication as "Something went wrong Please try again" 
** 
When left any required field as empty 
Then should see the error indication below the field as 'This field is required' 

 
 
 
When tries to create a new permission with the name already exist 
Then should see a error indication as 'The permission name already exists. '   

 
When no group has been created for the selected type,
Then should see an error message: 'No groups yet. Create a group for this type.'
 
 
Audit/Event** 
**Success** 
Event Type / Name: Permission Created 
Event Description:  Permission Created successfully 
Date and Time: $CurrentTimestampUser Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin) 
User Name: $FirstName $LastName of the user who performed the action
