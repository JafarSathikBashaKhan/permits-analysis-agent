# User Story 132523: Permission Setup - Create Group

## Metadata
| Field | Value |
|-------|-------|
| ID | 132523 |
| Type | User Story |
| Title | Permission Setup - Create Group |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete; LV |
| Module | Permission Setup > Group |

---

## Acceptance Criteria

Given a Super admin/Contract admin 
When in the group list screen 
Then should have the button to create the new group. 
** 
When invoke the button to the create the group 
Then a right-side slider panel should open with the following fields  

- Group Name - Mandatory** 
- Type - **Mandatory** 
- House hold limit  
- Max vouchers books per household 
- Group Related To - **Mandatory** 
- Back office use 
 
Group Name - alpha numeric field should accept maximum 100 characters. 
Type - Drop down (The type that are created in the contract settings should listed in the drop down). 
House hold limit - Numeric field should accept maximum 100. ​(Maximum number of permission that the user can purchase in this group) 
Max vouchers books per household - Numeric field should accept maximum 1000 (Maximum number of visitor voucher/scratch card can be book by the user). 
** 
Radio Button** 
Zone - (Option to select if the group is zone related). 
Non Zonal - (Option to select if the group is not zone related). 
** 
Toggle** 
Back office use only - Toggle (If the permission is visible only to BO users). 
Note: By default the toggle is off. 
** 
~~When the fields House hold limit or max visitor voucher/scratch card books per household value is set here ~~ 
~~Then the value should pre populated in the Zone level permission setting. ~~ 
~~Note: That story is covered in [#133094](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/133094/)~~ 

 
When filled the required details  
Then the button to create the new group is invokable 

 
When invoke the button to create the new group  
Then should see the success indication 'New Group Created successfully' 

 
When the new group is created  
Then should display in the group list screen. 

 
Error** 
When tries to create a new group with the name already exist 
Then should see a error indication as 'The group name already exists. '   
** 
When left any of the required fields as empty 
Then should see the error message 'This field is required' under the fields 

 
When not able to create group due to technical issue or network issue 
Then should see the indication as "Something went wrong Please try again" 
 

 
Cancel/Quiet** 
When invoke the button to cancel 
Then should see the pop-up as 'Are you sure you want to cancel? As this will reset the data on the screen and close it' with confirm and cancel button 
** 
 
When confirms the cancellation, 
Then it should be redirected back to the group List screen. 
Or 
When declines the cancellation, 
Then the user should remain on the Group Creation panel. 
 

 
Audit/Event** 
**Success** 
Event Type / Name: New Group Created 
Event Description:  New Group Created successfully 
Date and Time: ** 
User Role: Back office User 
User Name: First Name and Last Name of the Back office user 
 
 
******
