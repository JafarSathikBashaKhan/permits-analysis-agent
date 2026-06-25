# User Story 151336: Area | Zone | Edit Zone & Mapped streets

## Metadata
| Field | Value |
|-------|-------|
| ID | 151336 |
| Type | User Story |
| Title | Area | Zone | Edit Zone & Mapped streets |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

Given a super admin/contract admin
On invoking the zone name in the list
Then should be taken to view zone screen
**
When in the zone detail screen
Then should have the button to edit the zone


On invoking the button to edit
Then should be able to edit below fields

- Zone Name
- Add street - drop down should see a list of streets created in the "Street Creation" module.

&
Should be able to edit the mapped streets and property


When want to add street
Then should add the street in the drop


When street is added
Then should map at least on property




If no property is selected for the added street,
Then the system should not allow the changes to be saved,
And an appropriate validation message should be displayed “Select at least one property to map from the added street.”


When a street is selected and all properties associated with that street are mapped to different zones,
Then should see the error message as 'All properties are mapped to different zones. Please remove this street and select another street.'
When the street is removed,
Then the system should allow the changes to be saved.
Else if the street is not removed,
Then the system should not allow the changes to be saved.


Un-map Properties:**

When uncheck a property,
Then it should be unmapped from the current zone.
**
Remove Streets from Zone:**
When remove a street from the zone,
Then all its associated property mappings should also be removed from that zone.
**
Save**
When update the changes
Then should have the button to save the changes
**
On invoking the appropriate button
Then should appear toaster message "Zone Updated Successfully"


Cancel**
When invoke the button to cancel
Then should see the pop up 'Are you sure you want to cancel?' with Yes and No buttons
**
Yes - Close the form without saving
No - Return to the form


Audits/Events**:
Event Type / Name: Zone updated.
Event Description: Zone updated successfully.
Date and Time: $CurrentTimestamp
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
User Name: $FirstName $LastName of the user who performed the action.
