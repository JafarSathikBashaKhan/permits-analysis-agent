# User Story 140146: Area | Zone | Single/Multiselect Unpublish

## Metadata
| Field | Value |
|-------|-------|
| ID | 140146 |
| Type | User Story |
| Title | Area | Zone | Single/Multiselect Unpublish |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

**Unpublish Zone**


When the status is published
Then in the action column should have Unpublish option.
**
When invoke the unpublish option

Then should see the pop up 'Unpublish Zone? Are you sure you want to unpublish '$Zonename?' with unpublish and cancel button.


When invoke unpublish

Then should see the toaster message 'Zone unpublished successfully.'

&


Then status should update to 'Draft'
Note: If the published zone is mapped with the active permission
When tries to unpublish

Then should see the pop up 'This zone is linked with active permissions and cannot be unpublished.' with the option to close the pop up.


Multi select Unpublish**
When multi select the zone status draft and published
Then should see the publish and unpublish button in the list screen.
**


When multi select the zone status marked as 'Published'
Then should see the button to unpublish the zone in the list screen.

When invoke the button to unpublish
Note: if the selected zone has no active permissions
Then should see a pop up 'You have selected 5 zones. All 5 will be unpublished and moved to Draft.' with unpublish all and cancel button.

When invoke unpublish all
Then should see the toaster message '5 zones unpublished successfully'.
&
Then status should be updated to 'draft**'
**
Note: if the selected some of the zone has associated with any active permission
Then should see a pop up 'You have selected 6 zones. Only 4 will be unpublished.2 zones are linked with active permissions and will be skipped.' with Unpublish all and cancel.

When invoke unpublish all
Then should see the toaster message '4 zones unpublished successfully.'
&
Then status marked as published with no active permission is marked as draft.

When two or more zone is selected
Then appropriate button is visible in the list screen.


Audit/Event**
**Unpublished Zone**
Event Type / Name: Zone Unpublished.Event Description: Zone Unpublished Successfully.
Date and Time: $CurrentTimestamp**
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
User Name: $FirstName $LastName of the user who performed the action.



Multi select Unpublish zone**Event Type / Name: Zone Published.Event Description: Zone Unpublished Successfully.
Date and Time: $CurrentTimestamp
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
User Name: $FirstName $LastName of the user who performed the action.
