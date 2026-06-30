# User Story 126513: Edit street

## Metadata
| Field | Value |
|-------|-------|
| ID | 126513 |
| Type | User Story |
| Title | Edit street |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete; LV |
| Module | Area |

---

## Acceptance Criteria

Edit:**



Given a Super Admin or Contract Admin,

When on the street grid screen,

Then they should see an action column with 3 dots next to it.

AND

Invoking the 3 dots should display an option to edit.****


When the edit option is invoked,

Then the user should open up the edit street slider, and all fields in edit mode should be open for editing,

except:

The USRN and UPRN fields, which should be locked (even if they are free-text or auto-generated fields, depending on contract settings).

AND
The validation of duplicates and empty mandatory fields applies here as well as similar to creating a street.


After editing a street and its associated values
Then system should display options to Save Changes** and **Cancel**
Save Changes  - Should save the edited changes
Cancel - should close the pop up. **


When editing any field, the following events **should be captured:

Event Name: "[Field Name] updated" (e.g., "Postcode updated")

Event Description: "[Field Name] updated"

Date and Time Stamp: Current date and time

User Role: The role of the user who made the change

User Name: First Name and Last Name of the user who made the change.





When a user updates a street entry,
the changes should only affect permissions that are applied by the customer afterward.


Note: The Edit screen should see the count of properties added against the street.
