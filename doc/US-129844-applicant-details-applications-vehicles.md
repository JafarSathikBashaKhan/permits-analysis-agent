# US-129844: Applicant Details - Applications | Vehicles

| Field | Value |
|-------|-------|
| **ID** | 129844 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Figma dependency; Fully Complete; LV |

## Acceptance Criteria

Viewing Vehicles
 
 
 
 
 
 
 
 
 
Given a Super admin / Contract Admin / BO Manager / BO user, 
When in the "Vehicles" tab of an Permit, (Applicants List Screen -> Applications Tab -> View -> Vehicles Tab) 
 
Then all vehicles tied to the permit must be displayed. 
The following info should be displayed 

- VRM 
- Make, Model, Color 
- Icon 
 
**Single Vehicle Permit - No Primary Option**
 
When the permit is tied to only one vehicle,
 
Then the "Primary" label or selection option should not be displayed.
 

 
**Multiple Vehicle Permit - Primary Option Available**
 
When the permit is tied with multiple vehicles,
 
Then one vehicle should be marked as "Primary",  
& 
Then should be able to change the primary vehicle. 

 
When the user changes the primary vehicle with another vehicle, 
Then the changed vehicle should be set as primary by default. 

 
When the primary vehicle is set, 
Then that should be shown as 1st one in the order. 

 
**Swapping Vehicle**
 
When the vehicle is tied to the permit,
 
Then should be able to Change or Swap the vehicle with the vehicle which is already mapped to the applicant account. 
 
(New vehicle cannot be added in this screen) 
 

 
When tries to swap the vehicle and if there are no vehicles mapped against the account, 
Then UI should not allow him / her to swap the vehicle. 

 
When selects a different vehicle and clicks "Change",
 
Then the selected vehicle should replace the currently tied vehicle for the permit,
 
And the vehicle that was previously tied should be released. 

 
**Showing Vehicle Details in Change Screen** 
When in the change vehicle pop-up, 
Then should see the vehicle along with its details. 
If Visitors vehicle, then show 'Nick Name' 
If Personal vehicle, then show 'Make, Model and Color' 

 
**Prevent Adding New Vehicles**
 
When in the Vehicles tab,
 
Then should not see any option to add a new vehicle. 
And if no vehicles are available, show a message "No vehicles are available for selection. Please add a new vehicle in the Vehicles section to proceed" 
 

 
**Primary Vehicle Validation**
 
When a new primary vehicle is selected,
 
Then the selected vehicle should now be labeled as "Primary" and the previous one should be unmarked. 

 
**Search** 
When in the search field, 
Then should be able to search based on the 'VRM, Make, Model, Color and Nick Name. 

 
**Limit to Swap** 
When in the change vehicle pop-up, 
Then should see an indication as "Only <x> vehicle changes allowed. No further change will be allowed". (Count of changes allowed is based on configuration in the Permissions setup [#135408](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/135408/) ) 

 
When the limit is reached,
 
Then the following banner message should be displayed "Vehicle change limit reached. No further changes are allowed" 
And the "Change" button should be disabled.
 

 
**Audit Or Events Capturing: ** 
Event Type / Name: Vehicle changed for PermitEvent Description: Vehicle changed for this permit 
Date and Time: $CurrentTimestamp
  
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin / BO Manager / Bo User)
  
User Name: $FirstName $LastName of the user who performed the action
