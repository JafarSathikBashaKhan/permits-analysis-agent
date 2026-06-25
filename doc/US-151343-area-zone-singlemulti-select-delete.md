# User Story 151343: Area | Zone | Single/Multi Select Delete

## Metadata
| Field | Value |
|-------|-------|
| ID | 151343 |
| Type | User Story |
| Title | Area | Zone | Single/Multi Select Delete |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

Given a super admin/contract admin
When in the action column
Then should have three dots in each line items
**
When invoke the three dots
Then should have option to delete


Single Delete [Soft delete]**
When select the zone status marked as **'Draft' **
Then should see the pop up as 'Are you sure you want to delete the selected zone: {Zone Name}?' with the delete and cancel
**
When invoke delete
Then should appear toaster message as 'Zone Deleted Successfully'


When select the zone status marked as 'Published'**** **
Then shouldn't have delete option
**
Multi Select Delete [Soft delete]**
When multi select the zone status marked as **'Draft' **
Then should see the pop up as 'You have selected 5 zones.All 5 will be deleted' with option to delete all and cancel
**
When invoke delete
Then should appear toaster message as ' Zones Deleted Successfully'


When multi select the status marked as 'Published' (Linked with active permission)**
Then shouldn't have delete option
**
When multi selects the status as 'Draft'** and **'Published' **
If one zone is linked to active permission then should see the pop up message as 'Out of the 4 zones selected, 3 will be deleted. 1 zone is linked to active permission and will be skipped.'
&
If 2 or more zones are linked with active permission then should see the pop up message as 'Out of the 4 zones selected, 2 will be deleted. 2 zones are linked to active permissions and will be skipped.'with option to delete all and cancel
**
When invoke delete all
Then should appear toaster message as ' Zones Deleted Successfully'


Note: if the zone is deleted, the associated street should be unmapped from the zone
Audit/Event**
**Single delete**
Event Type / Name: Zone Deleted.Event Description: "Zone name" deleted Successfully.
Date and Time: $CurrentTimestamp**
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
User Name: $FirstName $LastName of the user who performed the action.


Multi select delete****Event Type / Name: Zone Delete.Event Description: Zone Deleted Successfully.
Date and Time: $CurrentTimestamp
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
User Name: $FirstName $LastName of the user who performed the action.








**
