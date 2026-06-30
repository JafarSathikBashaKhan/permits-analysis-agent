# User Story 135718: Configure Permissions | Permissions Tab – Sub Menus or Sections

## Metadata
| Field | Value |
|-------|-------|
| ID | 135718 |
| Type | User Story |
| Title | Configure Permissions | Permissions Tab – Sub Menus or Sections |
| Assigned To | Nisanth Paulin A |
| State | Done |
| Tags | Fully Complete; LV |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Viewing Static Sections in Permissions Tab
** 
 
**Navigation**: Permissions Setup -> Builder -> Select Permission type -> "Permissions Tab" 
** 
Given a Super admin and Contract admin, 
When selects the Permissions tab,  
Then the system should display a list of static sections or sub menus**, ** 
Basic Information 
General Settings 
Payment Settings 
Discount settings
 
Document type settings
 
Merchant settings
 
Expiration and Renewals
 
Email templates
 
Operation criteria
 
Visitor portal (VRN only) setting
 

 
Section Availability and Order**** 
Given the Permissions tab is selected,
 
When the sections are displayed,
 
Then all the above sections should appear in a fixed order mentioned above. 

 
Save Draft: 
When want to save the basic info, 
Then all the fields are mandatory. 

 
When invoked 'Save Draft', 
When manda**tory fields are not filled, 
Then should see 'This field is required' error and restricted from saving as draft. 
** 
When filled all the mandatory fields, 
Then should be able to save as draft. 
** 
** 
Publish: 
When the permission is not published, 
Then should have 'Publish' button to publish. 

 
When other sub menus and their mandatory fields are filled, 
& Selected 'Publish', 
Then the permission should be published successfully. 

 
When other sub menus and their mandatory fields are not filled, 
& Selected 'Publish', 
Then should be restricted from publishing and should see the error as mentioned in the below design direction 
**
