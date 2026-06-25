# User Story 177655: Enable Address Challenge Permission

## Metadata
| Field | Value |
|-------|-------|
| ID | 177655 |
| Type | User Story |
| Title | Enable Address Challenge Permission |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags |  |
| Module | Area |

---

## Acceptance Criteria

Given a Super Admin or Contract Admin
When the user navigates to Contract Settings (Apply),**
Then the system should display the Address Challenge Permission toggle.


Behavior**
By default, the Address Challenge Permission toggle should be in the disabled state.

**
Toggle ON**
When the user clicks to enable the toggle,**
Then the system should display a confirmation prompt “By enabling Address Challenge Permission, this will allow this contract to apply for a temporary permission. Do you want to enable it?"
The user can select:

Enable — Confirms enabling the feature and keeps the toggle ON.
Cancel — Cancels the action and keeps the toggle OFF.




When the toggle is enabled in the Contract Settings,


Then the system should automatically create a default Temporary Zone** in the Zone screen.
This ensures that the contract has only one temporary zone to manage temporary permissions without requiring manual zone creation.
**
When in the list screen
Then should display the zone name as 'Temporary Address Challenge', street as 0, Status as 'Publish'
And in the action column should be disabled the 'Edit' ,'Delete', and 'Unpublish' actions


When invoking on the 'Temporary Address Challenge' zone name in the list screen
Then the street tab should not be shown
And permission tab should list the assigned permission for this zone and should set the limits Maximum no of permits per user in zone, maximum no of permit in zone, maximum vouchers books per household and blue badge limit
And the Non - Enforceable time tab should not be shown


When the toggle is enabled
Then in the application form should have the option to apply for temporary permission
Refer: [#180319](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/180319/)


Understanding purpose
if the toggle is enable the contract have one temporary zone. by default the temporary zone is created in the zone screen when the toggle is enabled


Toggle OFF**

When the user clicks to disable the toggle,

Then the system should display a confirmation prompt: "Disabling Address Challenge Permission will prevent this contract from applying for temporary permissions. Do you want to disable it?"

The user can select:

Disable — Confirms disabling the feature and keeps the toggle OFF.
Cancel — Cancels the action and keeps the toggle ON.


When the toggle is disabled
Then the 'Temporary Address Challenge' zone name should be soft deleted


When the toggle is enabled again, if a permission is assigned and a value is configured for it, the same value should be retained.

**Event/Audit Entry:**

Event Type / Name: Address Challenge Permission Toggle Enabled

Event Description: "Contract name" Address Challenge Permission toggle enabled.

Date and Time: $CurrentTimestamp

User Role: $UserRole

User Name: $FirstName $LastName

Event Category/Type: Configuration



Event Type / Name: Address Challenge Permission Toggle Disabled
Event Description: "Contract name" Address Challenge Permission toggle disabled.
Date and Time: $CurrentTimestamp
User Role: $UserRole
User Name: $FirstName $LastName
Event Category/Type: Configuration
