# User Story 130663: Delete street [Bulk Delete]

## Metadata
| Field | Value |
|-------|-------|
| ID | 130663 |
| Type | User Story |
| Title | Delete street [Bulk Delete] |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Figma dependency; Fully Complete |
| Module | Area |

---

## Acceptance Criteria

**Delete street:****





Bulk Delete: [Soft Delete]****


Given a Super Admin or Contract Admin,

When on the street grid screen and when the user selects one or more  streets** entry via check box**
Then delete **button should be enabled.**


When the user selects all inactive** streets entries**
AND

Invoking delete button should prompt a confirmation pop up stating "Are you sure you want to delete all the selected [Count] streets?" with Delete All and Cancel button

Delete All - should delete the selected entries

Cancel - should close the pop up.


When user multi selects all active streets** and wants to delete through delete button
Then a message should be prompted " The selected  entries have active permissions associated with them and cannot be deleted." with ok button.
**
When user selecting multiples of active and inactive street**s **
Then alert through a pop up stating " streets have active permissions and cannot be deleted. Do you want to proceed deleting the remaining  streets?"

With Delete and Cancel button. [ defined in previous AC]



Single delete: [Soft Delete]****

**
**When in Action column then should see 3 options; [Ref #126513]
Edit
Add to Blacklist
Delete [Soft delete]
**
**
**
When selecting delete option through** 3 dots** against the entries in grid screen
Then that refers a single street delete
AND
When invoked delete option against a **inactive **street
Throw a prompt "Are you sure you want to delete the selected street ?" with Delete and Cancel buttonDelete - should delete the entry**
Cancel - should close the pop up.
AND
When invoked delete option against a active **street
Throw a prompt "You can't delete the street '' as it is associated with active permissions." with Delete and Cancel buttonDelete - should delete the entry**
Cancel - should close the pop up.



When a street is deleted
The associated town, postcode, property should also be deleted.


Toaster **Message:
When a single street is deleted
Then show toaster as "The street deleted successfully."
**
When multiple selected streets have been deleted
Should show message as "The selected  streets has been successfully deleted."



The below event** should be captured while deleting street[s];

Event name: Street "Street name" deleted

Event Description: Street and associated town, postcode, property were also deleted

Date and Time stamp: Current date and time

User Role: $Role of the user who made the change

User Name: First Name and Last Name of the user who done the change.
