# User Story 157253: Area | Zone | Mapping Street in zone creation

## Metadata
| Field | Value |
|-------|-------|
| ID | 157253 |
| Type | User Story |
| Title | Area | Zone | Mapping Street in zone creation |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

Given a super admin/contract admin
When in the zone list screen
Then should have the '+ New Zone' button
**
When invoke the button
Then should have 'Add Street' field as mandatory


Add Street** - Drop down with search should have the values streets created in the street creation menu
**
When street is selected
Then should added in the list
&
Should see the total count of the properties mapped to the streets

When invoke the street name

Then should see the properties associated with that street should be displayed with multi-select options.
And
If the properties are mapped with another zone
Then that properties should be disable and not selectable

When select properties,
Then those properties should be mapped to the current zone.



Validation**

When a street is added to a zone,
Then the user must select at least one property from that street to map to the zone,
And the system should validate this selection.
**
If no property is selected for the added street,
Then the system should not allow to save the changes,
And an appropriate validation message should be displayed “Select at least one property to map from the added street.”

Un-map Properties:**
When uncheck a property,
Then it should be unmapped from the current zone.
**
Remove Streets from Zone:**
When remove a street from the zone,
Then the street should be removed the list.
**
Create**
When add the zone name, add street and mapping property field
Then the button to create zone should be invokable
**
When invoke the button to create zone
Then should appear toaster message as 'Zone created successfully'

When zone is created
Then the status should marked as 'Draft'

Cancel**
When invoke the button to cancel
Then should see the pop up 'Are you sure you want to cancel?' with Yes and No buttons

Yes - Close the form without saving
No - Return to the form


Audit/Event captured in  [#149117](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/149117/)
