# User Story 140145: Area | Zone | Single/Multi Select Publish

## Metadata
| Field | Value |
|-------|-------|
| ID | 140145 |
| Type | User Story |
| Title | Area | Zone | Single/Multi Select Publish |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

**Publish Zone**
When want to publish the zone,
Then should invoke the option to publish in the action column.
**
Note: If you want to publish the zone

Then the zone should be mapped with streets,

When the streets are mapped with zone
And
Invoke the publish option


Then should see the pop up 'Publish Zone? Are you sure you want to publish '$Zonename?' with Publish and Cancel buttons


When invoke publish

Then should the toaster message as 'Zone published successfully'.
&
Then status should update to 'Published'

If the zone is not mapped against the streets
When invoke the option to publish


Then should open the pop-up 'This zone is not mapped to any streets. Please map streets before publishing.' with the option to close the pop up.


Multi Select Publish**
When multi select the zone status marked as draft, and the zone is mapped against the streets
Then publish is visible in the list screen.
**
When invoke publish


Then should see the pop up 'You have selected 5 zones. All 5 zones will be published.' with the option to publish all and cancel

When invoke publish all


Then should see a toaster message '5 zones published successfully'
&
Then status should update to 'Published'.

If some of the zone is not mapped against the streets
Then the zone that is mapped against the streets is only published
&


Then should see the pop up 'You have selected 6 zones. Only 4 are mapped to streets and will be published.2 will be skipped.' with the option to publish all and cancel.

When invoke publish all
Then should see the toaster message '4 zones published successfully'


When selected all zones are not mapped with streets


Then should see a pop up 'None of the selected zones are mapped to streets. Please map them before publishing.' with the option close the pop up.


Draft & Published**
When multi select the status 'Draft' and 'Published'
Then the button to publish and unpublish is shown in the list screen.
**
When invoke the button to publish


Then should see the pop up 'You have selected 7 zones. Only 4 Draft zones are mapped to streets will be published. Published zones will remain unchanged.' with publish all and cancel.

When invoke publish all


Then should see the toaster message '4 zones published successfully'
&
Then the status marked as 'Draft' and if the zone is mapped against the street should only be marked as 'Published' in the list screen.




Unmapped streets for Draft & Published**
When multiselect the status 'Draft' and 'Published'
Then should see the pop up 'You have selected 7 zones. Selected 4 zones are not mapped to streets. Please map them before publishing.' with the option close the pop up.'
**
When two or more zone is selected
Then appropriate button is visible in the list screen.





Event/Audit**
**Published Zone**
Event Type / Name: Zone Published.Event Description: ""Zone name" Published Successfully.
Date and Time: $CurrentTimestamp**
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
User Name: $FirstName $LastName of the user who performed the action.





Multi select publish zone**Event Type / Name: Zone Published.Event Description: Zone Published Successfully.
Date and Time: $CurrentTimestamp
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
User Name: $FirstName $LastName of the user who performed the action.
