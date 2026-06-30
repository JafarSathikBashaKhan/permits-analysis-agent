# User Story 144850: Delete Location

## Metadata
| Field | Value |
|-------|-------|
| ID | 144850 |
| Type | User Story |
| Title | Delete Location |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

Delete Location:
**
Bulk Delete: [Soft Delete]



Given a Super Admin or Contract Admin,

When on the Location grid screen and when the user selects one or more  locations entry via check box

Then delete button should be enabled.



When the user selects all inactive **locations entries**
AND

Invoking delete button should prompt a confirmation pop up stating "Are you sure you want to delete all the selected [Count] locations?" with Delete All and Cancel button

Delete All - should delete the selected entries

Cancel - should close the pop up.



When user multi selects all active** locations and wants to delete through delete button**
Then a message should be prompted "The selected  entries have active permissions associated with them and cannot be deleted." with ok button.



When user selecting multiples of active and inactive** locations **
Then alert through a pop up stating " locations have active permissions and cannot be deleted. Do you want to proceed deleting the remaining  locations?"

With Delete and Cancel button.

Delete All - should delete the selected entries
Cancel - should close the pop up.



Single delete: [Soft Delete]



When in Action column then should see option to delete:
Delete [Soft delete]


When I invoke delete option against the entry
Then that refers a single location delete

AND

When invoked delete option against a inactive **location **
Throw a prompt "Are you sure you want to delete the selected location ?" with Delete and Cancel button

Delete - should delete the entry

Cancel - should close the pop up.

AND

When invoked delete option against a active **location **
Throw a prompt "You can't delete the location '' as it is associated with active permissions." with Ok button

OK- should close the pop up.


Toaster Message:

When a single location is deleted

Then show toaster as "Location deleted successfully."



When multiple selected locations have been deleted

Should show message as "The selected  locations has been successfully deleted."



The below event should be captured while deleting location[s];

Event **name: location deleted **
Event Description: location "location name" deleted**

Date and Time stamp: Current date and time

User Role: $Role of the user who made the change

User Name: First Name and Last Name of the user who done the change.
