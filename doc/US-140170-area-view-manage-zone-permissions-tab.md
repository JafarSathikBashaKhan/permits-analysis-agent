# User Story 140170: Area | View & Manage Zone | Permissions Tab

## Metadata
| Field | Value |
|-------|-------|
| ID | 140170 |
| Type | User Story |
| Title | Area | View & Manage Zone | Permissions Tab |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

When in the permission tab
Then should display the following details **
- Permission Name - Should display the permission which is mapped against the zone.
- Max number of permits per zone - The number of permissions in this zone (For example, if I set the value to 100, then this zone will have a limit of 100 permissions meaning only 100 permissions can be mapped to this zone.)
- Max number of permits per user in the zone - The number of permissions per user can purchase in this zone.
- Max voucher books per household - The number of visitor vouchers and scratch cards can be booked by per user in this zone.
- Blue Badge Limit - The number of blue batches to be allowed in this zone
- Action - Should see the 'Settings' or 'Gear' icon

Note: Mapping permission to the zone is covered in [#138267](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/138267/)

When the zone is not published yet
Then should not be able to see the permissions mapped against the zone.


Default**
When in permission tab
Then the fields

- Max number of permits per zone
- Max number of permits per user in the zone
- Max voucher books per household
- Blue Badge Limit**

Should set the default value as 'No Limit'



Global Search**
When in the search field,
Then should be able to search permission name.
**
When enter the permission name in the permissions tab,
Then system should display the matching name on the permission tab.


Column Filter, Sorting** & **Paging**



****


Default column filter, sorting & pagination is applied.
