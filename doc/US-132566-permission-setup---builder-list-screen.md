# User Story 132566: Permission Setup - Builder | List Screen

## Metadata
| Field | Value |
|-------|-------|
| ID | 132566 |
| Type | User Story |
| Title | Permission Setup - Builder | List Screen |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete; LV |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Given Super Admin, Contract Admin, 
When in the permission setup menu and selected have the 'Builder' sub menu, 
 
Then should see the list screen with data are listed below 

- Permission Name  
- Type 
- Status - Draft, Published 
- Actions 
 
These below audit fields will be part of column picker and not as default fields in the grid screen:** 

- Created by - Should display the name of the user 
- Created on - Should display with Date and Time 
- Updated by - should display the name of the user 
- Updated on - Should display with Date and Time 
 
 
 
When in the permission name 
Then should be invokable. 

 
When invoke the permission name 
Then should taken to view permission screen. 
And 
Then should have the button to edit the permission in the view screen. 
Note: This story is covered in [#132613](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/132613/) 

 
Create Button** 
When in the builder list screen 
Then should have the button to add the new permission 
**Note:** Covered in "[User Story 132611](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/132611): Permission Setup - Create Permission" 
** 
Actions** 
When in the action field 
Then should have the three dots on each line items  
** 
When invoke the three dots  
Then should have option  

- Clone 
- Publish 
- Version History 
- Delete 
 
 
Note: Focus only on Clone, Publish, Version History and delete buttons placement in UI for this story. Their functionality to be covered in separate story. For now delete functionality covered in [#132613](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/132613/) and Publish functionality is covered in [User Story 136281](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/136281): Permission Setup | Builder - Multi/single Select Publish & Draft.
 
When the status is marked as 'Published' 
Then should have the 'Unpublish' option in the action column. 

 
Show Status Draft & Published** 
**Draft Status** 
When the permission is created and not published yet, 
Then the status column should show the status as 'Draft'. 
** 
Published Status** 
When the permission is published 
Then the status column should show the status as 'Published'. 
  
** 
Global Search** 
When in the search field 
Then should able to search permission name, Type and group. 
** 
When enter permission name, type or group For example: when the user types the permission name 
Then system should display the matching name on the builder list screen. 

 
 
 
Column Filter  
When in the list screen 
Then should have the hamburger icon on each column. 
 
When invoke the hamburger icon  
Then the filter input text field should appear. 
 
When entered the filter value 
Then should display the matching data in the list screen. 
 
When multiple filter applied to different columns 
Then should show data matching all active filters. 
 
Sorting** 
When clicking any column header 
Then data should sorted in ascending order. 
** 
When clicking again same column header 
Then data should sorted in descending order. 
 
When it is in descending order and again clicking the same column header 
Then the sorting should be cleared. 
 
 
Paging** 
 
**** 
 
 
Default pagination is applied.
