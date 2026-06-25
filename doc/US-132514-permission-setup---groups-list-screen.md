# User Story 132514: Permission Setup - Groups | List Screen

## Metadata
| Field | Value |
|-------|-------|
| ID | 132514 |
| Type | User Story |
| Title | Permission Setup - Groups | List Screen |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete; LV |
| Module | Permission Setup > Group |

---

## Acceptance Criteria

Given Super Admin, Contract Admin, 
When in the permission setup menu and selected have the 'Group' sub menu, 
Then should see the list screen with data are listed below 

- Group Name  
- Group Type - Zone, Back office use, Non Zonal (This is not be filtered or sorted) 
- House hold limit - Should display the number of permission that the user can purchase under this group. 
- Max visitor voucher/scratch card books per household - Should display the number of visitor voucher/scratch card can be book by the use 
- Actions** 
 
These below audit fields will be part of column picker and not as default fields in the grid screen: 

- Created by - Should display the name of the user 
- Created on - Should display with Date and Time 
- Updated by - should display the name of the user 
- Updated on - Should display with Date and Time 
 
 
When in the group type column 
Then should displays the group type with the tag 'Zone' , 'Back
Office use', 'Non Zonal'. 
Note: The
group type display in the list screen when you select the 'Zone' or 'Non-Zonal' radio button and switch 'Back
office use' toggles while creating the group. 

 
When in the group list screen 
Then should have the button to create the group. 
Note:** Covered in "[User Story 132523](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/132523): Permission Setup - Create Group" 
** 
When in the group name 
Then it should be invokable. 

 
When invoke the group name 
Then should show the details of the group. 

 
Actions** 
When in the action field 
Then should see the delete icon. 
Note: Focus only on Delete icon placement in UI for this story. Their functionalities are covered in [#132545](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/132545/) 

 
**Global Search** ** 
When in the search field 
Then should able to search by Group Name. 
When the user types the group name fully 
Then system should display the results on the group list screen. 
 
 
 
 

 
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
When clicking column header 
Then data should sorted in ascending order. 
** 
When clicking again column header 
Then data should sorted in descending order. 

 
When it is in descending order and again clicking column header 
Then the sorting should be cleared. 

 
Paging** 
 
**** 
 
 
 
Default pagination is applied.
