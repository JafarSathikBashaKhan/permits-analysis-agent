# US-133259: View Applicant Details | Vehicles - Delete & Multi Select Delete

| Field | Value |
|-------|-------|
| **ID** | 133259 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**Delete Vehicle (SOFT DELETE)** 
Given a Super Admin / Contract Admin / BO Manager / BO User,
 
When tries to delete a vehicle which has an active application,
Then
 should see a confirmation pop-up "You cannot delete this vehicle $VRM 
as it is associated with active permissions" with OK button. 

 
When tries to delete a vehicle which does not has any active application, 
Then should see a confirmation pop-up as "Are you sure wish to delete the selected vehicle $VRM? 

 
 
When confirmed the preference to delete, 
Then the vehicle should be removed from the list. 

 
**Multi Select Delete** 
When in the list, 
Then should be able to multi select the line items. 

 
When multi selected, 
Then should only be able to perform delete operation. 

 
When selected multiple vehicles in the mixed combination of active and inactive ones 
& 
Selected delete, 
Then only the vehicles of inactive or expired state should be deleted and the active ones should be restricted from deletion. 
& 
Then should see a message as "**Deletion partially completed. Vehicles of active applications were not deleted**." 

 
When selected all the inactive or expired application's vehicles, 
Then all those vehicles should be deleted with the success indication. 
_Success Message_: Deleted successfully 

 
When selected multiple vehicles & if all of them are part of active applications, 
& Selected delete, 
Then a confirmation message should be shown and followed by confirmation, 
& 
Then
 all the items should be restricted from deletion with an indication 
"Deletion cannot be completed as all the vehicles $noofvehicles are associated with 
active applications" 

 
_Note_: For all the
 bulk delete actions, confirmation pop-up is required with the message 
"Are you sure wish to delete multiple selected vehicles?" 

 
**Audit:**  
**Delete Event:** 
Event Type / Name: Applicant vehicle deleted 
Event Description: Applicant vehicle deleted in BO 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change
