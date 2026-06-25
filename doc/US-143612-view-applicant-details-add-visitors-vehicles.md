# US-143612: View Applicant Details | Add Visitors Vehicles

| Field | Value |
|-------|-------|
| **ID** | 143612 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**_Visitors Vehicle_** 
Given a Super admin / Contract admin, 
When entered the VRM number, 
& 
Selected 'Visitors' instead of personal, 
Then should be able to enter the VRM number add Nick name for the same. 
_Note_: Details fetching via Autoguru api is not required for visitors vehicle. 
 

 
When enters the nick name, 
Then nickname field should be a text field that allow maximum 50 character (mandatory). 

 
When adds a visitors vehicle, 
Then should be able to mark the same as favorite as optional.
 
When want to change or edit the VRM number entered, 
Then should be able to edit the same. 

When fill the detail 
 
Then should able to invoke the button to add the vehicle. 

 
**Success Indication** 
When selected the button to add vehicle, 
Then should see the success indication as "Vehicle added successfully"
 

 
**Mandatory Field Validation** 
When any of the mandatory field is empty and tries to add, 
Then should see the error message as "This field is required". 

 
**Duplicate Validation:** 
When tries to add a VRM which is already linked to this account, 
Then should see an error message as "This VRM already linked with this account" 

 
**Add to List** 
When a vehicle is added, 
Then it should be added to the list screen. 

 
**Audit:** 
**Visitors Vehicle** 
Event Type / Name: Visitor Vehicle Added 
Event Description:  Visitor Vehicle Added  
Date and Time: 
 
User Role: User role of the user who added 
User Name: First Name and Last Name of the user who added.
