# User Story 179544: Permission set up | Tab - Application Form

## Metadata
| Field | Value |
|-------|-------|
| ID | 179544 |
| Type | User Story |
| Title | Permission set up | Tab - Application Form |
| Assigned To | Veronikka Albart |
| State | Done |
| Tags |  |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Display Template Dropdown** 
Given a Super Admin or Contract Admin  
When the user navigates to Permission Builder → Application Form tab  
Then the system should display a dropdown to select the template  
And the dropdown should list all default application form templates

** 
Drop down should have templates names as Visitor Permit, Resident permit, Suspension, Dispensation etc., 

 
Preview Template** 
Given a template is selected from the dropdown  
Then the system should open a preview modal  
And display the template layout as it will appear in the Customer Portal  
And the preview should include all sections defined in the selected template like - Address tab - Vehicles tab
- Price & Payment tab  
And should have the action Edit 
** 
 
Edit Template** 
Given the user wishes to edit or customize a default template** 
Then should have the Edit option 

 
When invoke the edit option the form builder is opened 
Then should have the provision to add and delete fields, enable disable the sections/tabs and use the other provisions of form builder.IO to derive the application form as desired by the user. 

 
Post editing user should be able to preview the edited application form as it would be displayed in customer portal. 
User should have option to save the changes made and should be able to use the edited template to be applied for the intended permission. 
~~The edited file should be prompted to save in new name and that template should be available for a selection in the default template drop down. ~~ 
And the edited application form is saved against the permission name 

 
Note: For this story deliverable, visitor permit to be available as default template in the drop down and user should be able to choose and make amendments to this template. [Ref #User Story 169081: Default template | Application form | Visitor Permission] 
When the user clicks **‘Save Form’**,

Then the system should save all changes made. 
When the user clicks **‘Save as Draft’**,

Then the **‘Select Template’** dropdown should display the **‘Change Template’** option. 
When the user selects **‘Change Template’**,

Then the system should display a pop-up message:

“Changing the template and saving it as a draft will retain only the changes made to the selected template. All other template changes will be lost. Are you okay to change the template?”

with the action buttons **‘Change Template’** and **‘Cancel’**. 
When the user confirms by clicking **‘Change Template’**,

Then they should be able to select a different template from the dropdown. 
When the user clicks **‘Cancel’**,

Then the system should close the pop-up and return to the current page without making any changes. 
 
Publish** 
When a selected template is applied against a permission, only then the permission should be published. 
To publish, all the mandatory setting of the permissions should be configured and saved, Pricing should be configured for the zone sets and one template should be applied against the permission, only then a publish should be possible. 
** 
Publish and Render in Customer Portal** 
Given a template is applied and the permission is published  
When a user accesses Customer Portal → Apply for a Permission  
Then the selected application form should render according to the applied template for the selected permission 
And display all configured sections correctly
