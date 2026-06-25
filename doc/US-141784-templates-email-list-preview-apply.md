# US-141784: Templates | Email | List & Preview | Apply

| Field | Value |
|-------|-------|
| **ID** | 141784 |
| **Type** | User Story |
| **Module** | MNPS Template Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Figma Added; Fully Complete; LV |

## Acceptance Criteria

**Email Template is created in MNPS and consumed in apply** 
 
Given a super admin, contract admin, Bo Manager, Bo User 
When in the template menu 
Select the Email submenu 
 
When selected the Email submenu 
Then should see the following fields with existing details 

- Template Name 
- Permission Type 
- Linked Events 
- E-mail subjects 
 
These below audit fields will be part of column picker and not as default fields in the grid screen: 

- Created by - Should display the name of the user 
- Created on - Should display with Date and Time 
- Updated by - should display the name of the user 
- Updated on - Should display with Date and Time 
 
**&** 
Should see the tooltip 'Create a new Email template, go to the MNPS template creation screen' 
 
**View Template** 
When want the preview the template  
Then the template name should be invokable 
 
On invoking the template name in the grid screen 
Then should open the view screen to view the template in read only mode. 
 
Default pagination, filtering and sorting applied 

 
**Search** 
When in the search field 
Then template name should be searchable.
