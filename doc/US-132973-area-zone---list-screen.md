# User Story 132973: Area | Zone - List Screen

## Metadata
| Field | Value |
|-------|-------|
| ID | 132973 |
| Type | User Story |
| Title | Area | Zone - List Screen |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete; LV |
| Module | Area |

---

## Acceptance Criteria

Note: Zones are created in MNPS and consumed in the **Apply system.****
Given a Super admin/Contract admin
When in the zone list screen,
Then should see the following fields:

- Zone name - Name of the zone which is created in the MNPS
- No. of. Streets - Count of the streets that mapped against the zone
- Status - Draft, Published
- Actions

These below audit fields will be part of column picker and not as default fields in the grid screen:



- Added On - Should display the date and time
- Added By - Should display the date and time
- Updated On - Should display the date and time
- Updated By - Should display the date and time


&
Then should see the tool tip message as 'Create a new zone, go to the MNPS zone creation screen '


When in the zone name
Then should be invokable


When invoke the zone name
Then should take to view zone screen.
Note: This story is covered in [#133094](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/133094/)


Show Status Draft & Published**
**Draft Status**
When the zone is not published yet,
Then the status column should show the status as 'Draft' in the list screen.
**
Published Status**
When the zone published,
Then the status column should show the status as 'Published' in the list screen.
**
Global Search**
When in the search field,
Then should be able to search zone name.
**
When enter zone name,
Then system should display the matching name on the zone list screen.


Action**
When in the action,
Then should have the option:

- Publish

&
If the status of the zone is published
Then should have the 'Unpublish' option in the action column
**
Column Filter, Sorting** & **Paging**



****


Default column filter, sorting & pagination is applied.
