# US-135102: View Applicant Details | Vehicles - Add to Temporary

| Field | Value |
|-------|-------|
| **ID** | 135102 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**Add Temporary Vehicle** 
Given a Super Admin / Contract Admin / BO Manager / BO User, 
When selects "Add Temporary Vehicle" from the menu against a **personal vehicle,** 
Then a modal should open to enter VRM and select a validity period. 
_Note_: Add to temporary option is not applicable for Visitors vehicle. 

 
**Setting Validity Period for Temporary Vehicle** 
When entered the VRM in the VRM field, 
Then should be able to select date until the temporary vehicle should override the personal vehicle. 

 
When setting the validity for the temporary vehicle, 
Then should not allow to select the start date lesser than the current date. 

 
When the start date is selected, wants to set the till date, 
Then based on allowed configuration days, till date should be set automatically 
& 
Till date should not be allowed to edit. (It should be automatically set based on the start date) - _(Story to be created for Temporary vehicle configuration days)_ 

 
When wants to add a temporary vehicle, 
Then VRM and start and end / till date fields becomes mandatory. 

 
When filled the mandatory fields, 
Then the temporary vehicle should should override the selected personal vehicle. (Till the set time) 

 
**Update List** 
When a temporary vehicle has been added
 
 
Then the personal vehicle information should be overridden with the temporary vehicle in the list screen. 
& 
Then the user should see an indication as temporary vehicle in the list. 
& 
Then should see the type changed from 'Personal' to 'temporary' 

**Reversion Logic**
 
When the configured validity period ends for the temporary vehicle, 
Then the original personal vehicle should automatically be shown in the list, 
And the temporary vehicle should no longer be available. 

 
**Restrictions and Validations**
 
When the user tries to enter a VRM already mapped with the applicant account, (Eg: Can be Personal or Visitor) 
Then the system should block the action with a error message. "This VRM already linked with this account". 

 
**Multiple Temporary Vehicles**
  
Given the applicant already has a temporary vehicle active for a personal vehicle 
When the BO user tries to add another one for the same entry 
Then the system should restrict multiple active temporary vehicles for 1 personal vehicle. 

 
When want to add a temporary vehicle for another personal vehicle which doesn't have an active temporary vehicle at that time, 
Then should be allowed to add. 

 
**Updating in Illumin8** 
When the temporary vehicle is added, 
Then that should be updated to Illumin8. 
& 
When it is reversed, 
Then the same should be updated to Illumin8. 

 
**Button Validation**: 
**Add Vehicle:** 
When the mandatory fields 'Temporary VRM and Start Date' fields are not filled 
& 
Invoked 'Add Vehicle', 
Then should see an error message as "This field is required" 
 

 
**Temporary Vehicle Icon and Tool Tip** 
When temporary vehicle is set, 
Then the icon for temporary vehicle should be shown in the list screen. 

 
When mouse hovered on the icon, 
Then a tool tip stating '**Main VRM, Temporary Validity**' should be shown.  
(In Figma, it shown as "Temp VRM and End Date. Ignore that and use the above which is mentioned in a/c) 

 
Audit/Event
Event Type / Name: Temporary vehicle added
 
Event Description:  VRM $vrmno has been overridden by temporary vehicle of VRM $vrmno.
 
Date and Time:
 
User Role: User role 
User Name: First Name and Last Name of the user who done the change.
