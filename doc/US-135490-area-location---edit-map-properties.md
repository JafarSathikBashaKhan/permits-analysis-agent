# User Story 135490: Area | Location - Edit & Map Properties

## Metadata
| Field | Value |
|-------|-------|
| ID | 135490 |
| Type | User Story |
| Title | Area | Location - Edit & Map Properties |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete; LV |
| Module | Area |

---

## Acceptance Criteria

Given a super admin/contract admin
When in the view screen
Then should see the button to edit
**
When invoke the button to edit
Then should be able to see,


Location name - editable mode
Status - non editable mode

And
Should see list of streets and properties associated location in editable mode
And
Should see a provision to edit and add more streets and properties to the existing list.
And
Should allow street and property selection via a dropdown list *[****Town, USRN, Postcode, UPRN, and Permission Limit related to the selected streets and properties should be mapped at the backend during the association.]*
**
When in the street and property drop down
Then should see provision  to add in more streets and properties.
And
Option to undo the removed entry should also be available. [since delete is a soft delete, undo should be possible.]


Search**:
Search option against property should be available to search through the properties name or id.


**
Remove properties**
When want to remove streets and properties
Then should see the remove.
**
When invoke the remove option
Then the streets and property mapped against the location should be removed.
And
the updated number of streets and properties mapped to the location should be reflected on the location list screen.
And
The count of streets and properties associated to the location should also be displayed both in edit and view screen.
And
Option to undo the removed entry should also be available. [since delete is a soft delete, undo should be possible.]



Save and Cancel**
When the changes made are successfully saved
Then a toaster message should appear as "Location updated successfully."
**
When invoke the button to cancel
Then should see the pop-up which states,
" Are you sure you want to cancel?
As this will reset the data on the screen and close it.


with confirm and cancel button"


When confirms the cancellation,
Then it should be redirected back to the location List screen.
Or
When declines the cancellation,
Then the user should remain on the view screen.


Audit/Event**
Event Type / Name: Location  updated.Event Description: "Location name" updated Successfully.
Date and Time: $CurrentTimestamp**
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
User Name: $FirstName $LastName of the user who performed the action.


Property mapping: **
Property mapping to the street should be unique against location. [When mapping a property to a location, the same property for the selected street should not be mapped to another location.]
Show validation message when the above scenario is attempted. "The selected property has already been assigned to another location."
