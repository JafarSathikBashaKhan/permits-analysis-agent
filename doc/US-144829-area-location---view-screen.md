# User Story 144829: Area | Location - View Screen

## Metadata
| Field | Value |
|-------|-------|
| ID | 144829 |
| Type | User Story |
| Title | Area | Location - View Screen |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

**View Location: **
**
When invoke the location name in the grid screen
Then should navigate to view location screen.

**
When in View screen
Then should see fields as,
**Location Name, **
**Streets - **streets associated to the locations and its USRN to be displayed
**Properties Associated - **Display the list of associated property names/IDs and its respective UPRN and permission limit.
  -If no properties or streets associated, show a blank field and set the count of them as **0**.
  -If streets and properties are associated, display them and show the count accordingly.
and
-The **Status **of the location as active / inactive based on its mapping to the active permissions.
**
Search**:

When in the search field,
Then should be able to search through streets and properties respectively. [separate search options for street and property]
**
Column Filter, Sorting & ****Paging**



****


Default Column Filter, Sorting &** **pagination is applied. [separate Column Filter, Sorting & Paging options for street and property]



Note: The design, layout, and placement of widgets, buttons, and titles should maintain consistency with the existing **Zones** and **Streets** screens.
