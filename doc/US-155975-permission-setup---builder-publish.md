# User Story 155975: Permission Setup - Builder | Publish

## Metadata
| Field | Value |
|-------|-------|
| ID | 155975 |
| Type | User Story |
| Title | Permission Setup - Builder | Publish |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | southend |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Publish:** 
Given a Super admin / Contract admin, 
When in the permission setup or configuration section and invokes "Publish", 
Then the permission should be published only when the mandatory fields are filled. 
** 
When any of the mandatory fields are not filled in any tabs of sections and invoked "Publish" , 
Then should see the error as "This field is required". 

 
Basic Information**: 
When any of the basic information section, 
Then all the below mentioned fields are mandatory to publish. 

- Permission Name 
- Type 
- Group 
- Description 
 
**General Settings**: 
The below fields are the mandatory fields to Publish 
 

- Special Events (Optional) ** 
- Start Date Settings: 
- Prefix: 
- Terms & Conditions 
- Display Description 
- Permit related to (If the permission group belongs to "Zonal')  
- Permit Mode 
- Other settings (OPTIONAL) 
 
General Settings (1st sub menu) - Specific Scenarios **When not selected zone in "General Settings" (1st sub menu) 
Publish is not allowed. 
 
** 
Given the user enables “Zone Related” under "General Settings" 
When no zone is selected , 
Then display error: “Please select at least one zone" at the time of publishing. 

 
Zone Mapping**: 
When the permission belongs to the permission group of zone, 
Then at least one zone set is mandatory to publish. 
& 
All the zones mapped against that particular permission should be available in the zone set. 
& 
All the zones should have the pricing configured in it. 
& 
Only when the above conditions met, then should be allowed to publish. 
** 
 
 
 
Payments Settings**: 
When tried to publish without at least one payment method selected, 
Then should see an error as "At least one payment method is required to publish this permission". 
** 
When the 'Help description' field is not filled, 
Then should not be restricted to publish it is an optional field. 
 

 
Discount Settings**: 
When tries to publish without Bluebadge discount and Pension discount fields, 
Then should be restricted. 
(But, by default those 2 fields value will have the value as '0') 
** 
Document Type Settings**: 
When in the document type settings, 
Then at least one document type should be checked and enabled to publish. 
** 
When a document type is checked and enabled, 
Then the input corresponding field is mandatory. (By default it will have the value 1) 

 
Merchant Settings**: 
When in the merchant settings, 
Then the below listed fields are OPTIONAL. 

- Back Office Merchant ID 
- Back Office Merchant User 
- Back Office Merchant Password 
- Customer Merchant ID 
- Customer Merchant User 
- Customer Merchant Password 
 
 
When any of the above fields are not filled, 
Then should not be restricted from Publishing. 
** 
Renewals & Reminders**: 
When in the Renewals & Reminders section, 
Then enabling the fields by checking the check boxes is optional. 
** 
When enabled any of the check box for the renewals or reminders, 
Then the corresponding fields are mandatory for publishing. 

 
Email Templates**: 
When in the Email templates section,** 
Then configuring or setting a template is non-mandatory.
 

 
When the event is added,
 
Then selecting the template is mandatory for publishing. 
 

 
Visitors Portal**: 
When want to publish, 
Then visitors portal configuration is non mandatory. (As confirmed by Jo, it is non mandatory) 
** 
Special Events**: 
General Settings 
When selected enable for special event in general settings**Then selecting a special event properties set is MANDATORY FIELD for publishing. 
& 
If not filled, 
Then should see "This field is required" error. 

 
When disable special event is selected, 
Then special event properties field is non-mandatory. 

 
Special Events Section 
(Special events section will only be shown when the special events is enabled in the General settings)  
When special event is enabled in general settings,  
Then special events configuration is mandatory to publish.  

  
When want to publish,  
Then at least one special event configuration set should be configured.  
& 
Then all the field validation and duplicate block validation mentioned in [#143256](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/143256/) should be considered and same error should be shown. 

 
Rules**: 
**Refund Settings**: 
Given the Refund is enabled, 
Then all the input fields are mandatory for publishing. 

- Refund Policy  
- Cancellation Charge 
 
 
**Auto Approval**: 
When in the auto approval section, ** 
Then all the auto approval options (check boxes)a are non-mandatory for publishing.  

 
Vehicle Settings**: 
When in the vehicle settings then only the below 2 fields are MANDATORY to publish, 

- VRN Limit 
- Number Plate Change Limit 
 
When any of the above fields are not filled, 
Then error should be shown. 
 
** 
Template Settings**: 
When the mode is set as "PHYSICAL PERMIT" in GENERAL SETTINGS, 
Then the below templates are mandatory for publish. 

- Physical Permit Print 
- White Mail Reminder**** 
 
When the mode is set as "VIRTUAL PERMIT" in GENERAL SETTINGS, 
Then all the fields in the template settings are NON - MANDATORY to publish.  
 
** 
Pricing:** 
When want to Publish a permission, 
Then all the fields in the Pricing section needs to be filled. 
** 
When any of the fields in the pricing section is not filled, 
& Selected 'Publish' button here, 
Then should see an error indication as "Please complete the pricing configuration to publish". 

 
Permission Limits**: 
When in the permission limit section, 
And has selected 'Set Limit', 
Then the limit field should have value to publish the permission. 
(But by default '1' will be there in the field. So obviously the mandatory field will have a value.) 
** 
Showing Error in UI**: 
When there is any error in the any of the fields of any sections, 
Then error needs to be shown as "This field is required" to notify the exact place of error. 
& 
Also there should be some error indication in the permission level as whole to say the user. 
** 
Display Error Badge for Sections with Validation Failures
**Given a permission setup form contains one or more fields in a section that fail validation,** 
When the user attempts to save or publish the permission setup,
 
Then a red circular badge should be displayed next to that section in the menu,
 
And the badge should display the number of invalid fields in that section.
 

 
Hide Error Badge for Sections without Validation Failures**** 
Given a section contains no fields that fail validation,
 
When the user attempts to save or publish the permission setup,
 
Then no error badge should be displayed next to that section in the menu.
 

 
Display Error Count on Parent Menu for Sub-menu Errors**** 
Given a section contains multiple sub-menus,
 
When validation errors exist in one or more sub-menus,
 
Then the parent menu should display a red badge showing the sum of all errors in its sub-menus.
 

 
Real-Time Badge Update after Error Fix**** 
Given a section shows a red badge with a count due to validation errors,
 
When the user corrects one or more invalid fields in that section and re-validation passes,
 
Then the badge count should decrease accordingly,
 
And the badge should disappear entirely when the error count reaches zero.
 

 
Inline Error Visibility**** 
Given a red badge appears for a section,
 
When the user navigates to that section,
 
Then each field with a validation error should display its inline error message for clarity 
 

 
Application Form** 
When even at least one application is not configured,  
Then should be restricted from publishing. 
& 
Then should see error as "Configure at least 1 form to publish" 
** 
Events Capturing**: 
 
Event Name: Permission Setup Published 
Event Type:  $PermissionName Published 
Category: Configuration 
Date and Time:  
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change.
