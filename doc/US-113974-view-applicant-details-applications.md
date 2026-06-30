# US-113974: View Applicant Details - Applications

| Field | Value |
|-------|-------|
| **ID** | 113974 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**Tab & Accordion** 
Given a Super admin / Contract admin / BO Manager / Bo User, 
When in the applicant details screen,
 
Then should see an Applications tab along with other tabs like Overview, Emails, etc.
 

 
When the Applications tab is selected,
 
Then should see permission types organized as separate accordions (e.g., Permit, Licensing, Suspension). 
Note: Permission types should be dynamic based on Contract settings. 

 
When interacting with an accordion,
 
Then should be able to expand and collapse each permission type independently. 

 
When want to open a accordion, 
Then only one accordion should be opened at a time. (Default behaviour) 

 
Accordion Expansion and Grid 
When expanded a permission type accordion,
 
Then should see the permission details in a grid view. 

 
When in the grid, 
Then each grid should have the following columns 

- Permission Name 
- Status 
- Group 
- Start Date 
- End Date 
- Action (View) 
 
_Example_: 
**Permission name**      **Status**              **Group**         **Start Date**          **End Date**         **Action ** 
Resident permit    To be Renewed   Residential     23/3/2025          23/3/2026          view 
 

 
When selects a accordion with no data, 
Then accordion should not be clickable. (Only record counts and Buy now option can be shown) 

 
When in each accordion, 
Then should see a separate 'Buy Now' option. 
(Only focus on the _Buy Now_ button placement for this story. The buy now functionality can be covered in different story) 
 

 
**Count**: 
When in the accordion, 
Then should also see the count of records. 

  
**Column Level Filter**  
When in each column,  
Then there should be a default column level filter. 

 
** Pagination**: 
When in each accordion, 
Then pagination is required based on the count. 

 
**Search:** 
When want to quick search the Permissions name, 
Then should be able to search the permissions name alone. 

 
**Close** 
When want to close the slider, 
Then provision to close should be there.
