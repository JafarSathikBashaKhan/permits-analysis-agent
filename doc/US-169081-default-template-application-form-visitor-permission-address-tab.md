# US-169081: Default template | Application form | Visitor Permission | Address tab

| Field | Value |
|-------|-------|
| **ID** | 169081 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Address Tab ** 
 
 
Given a permissioned user 
When in the address tab 
Then the Permission Label should be displayed as configured in the Permission Builder [#181519](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/181519/) 

 
**Permit mode** 
 
Given the Permit Mode is set as Both in the permission builder 
When the user opens the Address Tab in the application form 
Then the field “Permit mode” should be visible 
And should have the options: 

- Physical permit - Physical copy of the letter is issued and must be displayed on the vehicle. 
- Virtual permit -No physical letter issued; permit accessed electronically via app or online. 
 
 
When the **Business Name** checkbox is checked in the Permission Builder, 
Then the system should display the ‘Business Name’ field in the Address section. 
The Business Name field should: 

- Accept alphanumeric characters. 
- Have a maximum limit of 1000 characters. 
 
 
 
When in the Address section 
Then should have the field  

- Postcode 
 
 
When user enter the postcode 
And invoke the search 
Then in the property field should list the property name or number configured in the system 
And the street should list the street name configured in the system 
If the postcode have one street then the street field list should have the one street name 

 
When the property name/no is selected  
Then the street and town should auto populated with non editable 
And the provided address(Postcode) is zonal  
Then should auto populate the zone name and should have the tag as 'This zone is allocated to 'Zone name' If it is not correct please contact to this number "Contract phone number" '  
Where **[Contract Phone Number]** is fetched from the **Contract Settings (MNPS)** configuration.
 
And the provided address is mapped to the location 
Then should auto populate the location name in the location field mapped to the property 
Note: The auto-populated field are not editable 

 
When in the address section 
Then should have the help text which configured in the Apply BO > Template > Alert&tooltip refer: [#148290 ](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/148290/) 
And should have the help text as '****If your address isn’t listed or can’t be found, but you still need to apply for a temporary permission, you can select this option to enter your address details manually and continue with your application.**' with checkbox 
Note: Applying for temporary permit and flow should covered in seperate story [#180319](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/180319/) 

 
When check the temporary permission 
Then the '**Saved**** this address for future use**?' option shouldn't be shown 

 
When invoke the check box  
Then should have the following mandatory fields 

- Postcode 
- Address Line 1 
- Address Line 2 - Optional  
- Town 
 
 
And should see the text as '***Saved****** this address for future use**?'* with the toggle by default it is disabled 

 
When enabled the toggle 
Then the address should saved in the applicant profile section [#126374](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/126374/) 
Again user apply for a permission 
Then in the address section should have the option to select the saved address  

 
 
**Household Limit Validation** 
 
Given the household limit for that group is set as 3, 
 
And the user has already purchased 3 permissions for the selected group,
 
 
When the user tries to purchase another permission for the same group,
 
 
Then the system should restrict the user from proceeding to the next step,
 
 
And display the error message: “You have exceeded your household limit for this "permission group".” 
**Note: **The house hold limit validation should apply for both zonal and non zonal address if the value configured in the permission group creation** [#132523](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/132523/) **                   
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
**Max number of permits per user in the zone validation** 
Given 'Max number of permits per user in the zone' is set as 2 for Visitor Permission
 
And the user has already purchased 2 Visitor Permits in the same zone
 
When the user tries to purchase another Visitor Permit in the same zone
 
Then the system should restrict the user and show the alert message "You’ve reached the maximum number of permits you can hold in this zone." 

 
**** 
**Permission Limit in Street Creation Refer [#125471](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/125471/) ** 
**Scenario 1:** When both property limit and zonal limit are configured 
Given the Permission Limit per Property is set as 12,
 
And the Max number of permits per user in the zone is configured as 2,
 
And the property is mapped to a zone where both configurations apply,
 
When an applicant attempts to purchase a permit for that property,
 
Then the system should override the property-level limit and enforce the zonal limit,
 
So that the applicant can hold a maximum of 2 permits as per the zonal configuration. 
**** 

 
**** 
**Scenario 2: **When only property limit is configured 
Given the Permission Limit per Property is set as 12,
 
And the Max number of permits per user in the zone is not configured,
 
When an applicant applies for a permit at that property,
 
Then the system should allow the user to purchase permits up to the configured property limit (12),
 
And if the applicant attempts to purchase more than the allowed limit,
 
Then the system should display the following error message “You’ve reached the maximum number of permits allowed for this property.” 

 
**Maximum number of permits per zone validation** 
Given the “Max number of permits per zone” is set as 100 for Visitor Permission
 
And multiple users have already purchased Visitor Permits in the zone
 

 
When the total number of issued Visitor Permits in the zone reaches 100
 
Then the system should allow users to submit applications beyond the limit
 
But the applications should be placed in the waiting queue
 
And display the alert message “This zone has reached its permit limit. You can still submit your application, but it will be added to the waiting list.” 
Waiting list functionality covered in seperate story [#190148](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/190148/)  

 
**Note:** *The above validation should validate based on the address and the error should throw when the user click save and continue * 

 
**Refer:** [#140170](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/140170/)  

 
**Save and continue** 
**** 
When the user clicks “Save and Continue”, 
Then the system should save all entered data from the current tab, 
And automatically navigate to the next tab in the form. 
 
[#190148](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/190148/) tab, 
Then the should navigate to the explore page in the customer portal 

 
**_Note:_ **Vehicle section is not required for Visitor permission 

 
**Note:** 

- In this story, fields marked as optional will be specifically mentioned. 
- All other fields are mandatory. 
 
When the user leaves any mandatory field empty 
Then the system should display the following error message “This field is required.”
