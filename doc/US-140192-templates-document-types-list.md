# User Story 140192: Templates | Document types | List

## Metadata
| Field | Value |
|-------|-------|
| ID | 140192 |
| Type | User Story |
| Title | Templates | Document types | List |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Figma Added; Fully Complete; LV |
| Module | Templates |

---

## Acceptance Criteria

Given a super admin/contract admin 
When in the template menu 
Select the Document Types submenu 
** 
When selected the document types submenu 
Then should see the following fields with existing details 

- Document Type - Should see the document type name (Eg: Proof of Residence) 
- Sub Type - Should see the count of sub type  
- Actions - Should have the delete icon. 
 
These below audit fields will be part of column picker and not as default fields in the grid screen: 

- Created by - Should display the name of the user 
- Created on - Should display with Date and Time 
- Updated by - should display the name of the user 
- Updated on - Should display with Date and Time 
 
Note: **This list of document type name is displayed in the Permission setup > Builder > [Permission Name] > **Document type settings **[#25067](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/25067/) 
** 
Create Button** 
When in the list screen 
Then should have the button create document type 
**Note:** Covered in [#140263](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/140263/)  
** 
View & Edit** 
When in the document type name 
Then should be invokable 
** 
On invoking the respective document type name in the grid screen 
Then should open the slide to view and edit the document type 
Note:** Covered in [#140407](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/140407/) ** 

 
Delete** 
When in the action column  
Then should see the delete icon  
Note: Delete functionality covered in [#140463](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/140463/) 
** 
Global Search** 
When in the search field, 
Then should be able to search document type name. 
** 
When enter the document type name, 
Then system should display the matching name on the list screen.  
 
Column Filter, Sorting** & **Paging** 
 
 
 
**** 
 
 
Default column filter, sorting & pagination is applied.
