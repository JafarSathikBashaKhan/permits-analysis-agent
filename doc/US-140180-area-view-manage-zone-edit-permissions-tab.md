# User Story 140180: Area | View & Manage Zone | Edit Permissions Tab

## Metadata
| Field | Value |
|-------|-------|
| ID | 140180 |
| Type | User Story |
| Title | Area | View & Manage Zone | Edit Permissions Tab |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

**Edit (Permission Limits)**
When in the permission tab
Then should see the 'setting' or 'gear' icon in the action column.
**
When invoke the 'setting' or 'gear' icon
Then should open the left side panel to optionally** set limits for the following fields:

- Max number of permits per zone - Numeric field should accept maximum 10000.
- Max number of permits per user in the zone - Numeric field should accept maximum 100.
- Max voucher books per household - Numeric field should accept maximum 1000.
- Blue Badge Limit - Numeric field should accept maximum 100.



**'No Limit' Checkbox Toggle Behavior**
By default, "No limit" checkbox is checked for the above four fields
**
When the "No limit" checkbox is checked,
Then the corresponding input field (if any) must be disabled and cleared (if previously populated).

When the "No limit" checkbox is unchecked,
Then the input field must become enabled and allow user input

When Max number of permits per zone is set as 50
Then the field Max number of permits per user in the zone should not exceed 50.
If exceed then should show the error indication under the field 'Must be less than or equal to the permit per zone (50).'

When in the left side panel
Then should have the button to Save changes and cancel.

When invoke the button to save changes
Then should save the changes against the permission

When the zone is not published yet
Then should not be able to see and manage the permissions mapped against the zone.


Cancel**
When invoke the button to cancel
Then should see the pop-up as 'Are you sure you want to cancel? As this will reset the data on the screen and close it' with confirm and cancel button
**

When confirms the cancellation,
Then it should be redirected back to the permission tab.
Or
When declines the cancellation,
Then the user should remain on the same page.


Audit/Event**
**Zone Update**
Event Type / Name: Zone  Updated.Event Description: Zone  Updated Successfully.
Date and Time: $CurrentTimestamp
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
User Name: $FirstName $LastName of the user who performed the action
