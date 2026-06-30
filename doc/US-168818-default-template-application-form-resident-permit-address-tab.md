# US-168818: Default template | Application Form | Resident permit | Address tab

| Field | Value |
|-------|-------|
| **ID** | 168818 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**Use Case to Access the Application Form from the Customer Portal:**

The user logs into the customer portal, selects the **Resident Permit** option from the available tile, and chooses to make a purchase. The user then enters their address and finds the resident permit options available for the selected address.  If the user cannot find their address, they have the option to submit a **temporary application** instead. 

 
**Resident Permit | Tab - Address Information:**
Given a permissioned user [Specify user] 
When accessing the default templates for application form
 
Then should see Resident permit to be available.
 

 
The below elements, Sections and fields are to be available for resident Permit application form; 

 
**Tab 1 | Address Information:**
 

 
**Address Tab ** 
 
 
Given a permissioned user 
When in the address tab 
Then the Permission Label should be displayed as configured in the Permission Builder [#181519](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/181519/) 
 

 
When in the address tab,
 
 

- Should have an option to select between **physical or virtual**, if the permission has settings enabled as both. 
- Should have option to select the address from the **saved address** (configured in profile section) 
- Should display direct **input fields **if any enabled against that permission Eg: Business Name  
- Should have fields to select system configured address from the drop down, the fields include,  
 
 
 Post Code - Free text input field, should validate for the right format entered.
  
*** Search **- Post entering post code, user should be able to invoke search and find the post code valid and available in the system configurations. * 
* And should list the Property ID / Name, streets, Town in the respective drop down for selection* 
 Property Name / No - Drop down selection based on the post code entered
  

 
When the property name/no is selected  
Then the street and town should auto populate  

 
 Street - Gets auto populated if the result is a single street entry available, if there are multiple streets available then should see drop down selection
  
* Town - Gets auto populated if the result is a single town entry available, if there are multiple town entries against the search available then should see drop down selection*
  
* Zone - Gets auto displayed based on the above selection of fields with the text 'This zone is allocated to 'Zone name' If it is not correct, please contact to this number "Contract phone number" [Display the contract's phone number configured in the contract settings]*
 

 
And the provided address is mapped to a location 
Then should auto populate the location name in the location field mapped to the property 
Note: The auto-populated field are not editable 
 

 
**Household limit validation:** 
Given the household limit for that group is set as 3, 
 
And the user has already purchased 3 permissions for the selected group, 
 
When the user tries to purchase another permission for the same group, 
 
Then the system should restrict the user from proceeding to the next step, 
 
And display the error message: “You have exceeded your household limit for this "permission group".” 
**Note: **The house hold limit validation should apply for both zonal and non zonal address if the value configured in the permission group creation** [#132523](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/132523/) **   
 
 
 
 
 
 
 
 
 
 
 
 
** ** 
** ** 
** ** 
** ** 
****Max number of permits per user in the zone validation:**** 
**Given 'Max number of permits per user in the zone' is set as 2 for the selected Permission ** 
**And the user has already purchased 2 Permission in the same zone ** 
**When the user tries to purchase another permission in the same zone ** 
**Then the system should restrict the user and show the alert message "You’ve reached the maximum number of applications you can hold in this zone." ** 

  
**Permission Limit in Street Creation Refer [#125471](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/125471/) ** 
**Scenario 1:** When both property limit and zonal limit are configured 
Given the Permission Limit per Property is set as 12, 
And the Max number of permits per user in the zone is configured as 2, 
And the property is mapped to a zone where both configurations apply, 
When an applicant attempts to purchase a permit for that property, 
Then the system should override the property-level limit and enforce the zonal limit, 
So that the applicant can hold a maximum of 2 permits as per the zonal configuration. 
And if the applicant attempts to purchase more than the allowed limit, 
Then the system should display the following error message “You’ve reached the maximum number of permits allowed for this zone.” 
 
**** 
**** 
**Scenario 2: **When only property limit is configured 
Given the Permission Limit per Property is set as 12, 
And the Max number of permits per user in the zone is not configured, 
When an applicant applies for a permit at that property, 
Then the system should allow the user to purchase permits up to the configured property limit (12), 
And if the applicant attempts to purchase more than the allowed limit, 
Then the system should display the following error message “You’ve reached the maximum number of permits allowed for this property.” 
**** 
**Maximum number of permits per zone validation:** 
Given the “Max number of permits per zone” is set as 100 for a Permission 
And multiple users have already purchased that Permits in the zone 
 
When the total number of issued Permits in the zone reaches 100 
Then the system should allow users to submit applications beyond the limit 
But the applications should be placed in the waiting queue 
And display the alert message “This zone has reached its permit limit. You can still submit your application, but it will be added to the waiting list.” 
**** 
**Note:** The above validation should validate based on the address and the error should throw when the user click save and continue  
**Refer:** [#140170](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/140170/) 
  
** ** 
****Manual address entry / Temporary application submission:** ** 

  
When in the address section 
Then should have the help text displayed which is configured in the Apply BO > Template > Alert&tooltip refer: [#148290](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/148290/) 

 
Note: Applying for temporary permit and flow should covered in separate story [#180319](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/180319/) 
 

- Should have provision to enter address manually if user does not find their address in the system configured addresses, Info text to be displayed with Checkbox: "If your address isn’t listed or can’t be found, but you still wish to apply for a temporary application, select this option to enter your address manually and continue with your application." 
- Should display below fields when the above check box is enabled, 
 
  
Postcode
  
Address Line 1
  
Address Line 2 (optional)
  
Town 

- After entering the address, should see an option to "Save this address for future use?" with a toggle for selection. When the toggle is selected, the entered address should be saved in use's profile management section. 
 
When user opts the temporary application 
Then the 'Saved this address for future use?' option shouldn't be shown 

 
When enabled the toggle for save address 
Then the address should be saved in the applicant profile section [#126374](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/126374/) 
If user apply for any other permissions, 
Then in the address section should have the option to select the saved address  
 

  
**Save and Continue:**
Post entering the required data, a button to "Save and Continue" should be available. 
When invoking this button, should have these entries saved against the selected application and proceeds to next tab.
  

  
When the user clicks the “Back” button in address tab,  
Then the should navigate to the explore page in the customer portal  
 

 
Note: 

- In this story, fields marked as optional will be specifically mentioned. 
- All other fields are mandatory. 
 
When the user leaves any mandatory field empty 
Then the system should display the following error message “This field is required.” 
 

 

 

  

  
** **
