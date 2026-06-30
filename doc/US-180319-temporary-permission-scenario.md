# US-180319: Temporary permission scenario

| Field | Value |
|-------|-------|
| **ID** | 180319 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Prerequisite** 
Given the “**Address Challenge Permission**” toggle is enabled in Contract Settings (Apply),
 
Then the system should automatically create a Temporary Zone,
 
And the relevant permissions should be assigned manually to this zone. refer; [#177655](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/177655/) 
Only then, in the Application Form → Address tab, the system should display the option **"**If your address isn’t listed or can’t be found, but you still need to apply for a temporary permission, you can select this option to enter your address details manually and continue with your application." (checkbox) 
 

 
 
When the "Address Challenge Permission" toggle is disabled in Contract Settings (Apply),
 
And the applicant selects the corresponding permission in the Customer Portal,
 
And the application form is opened,
 
Then the system should display an info message “The temporary application is not available for this request. Please contact support at [contract phone number] for assistance.”  **[Contract Phone Number]** – Retrieved from the Contract Settings (MNPS) configuration. 
 
And the checkbox option “If your address isn’t listed or can’t be found, but you still need to apply for a temporary permission, you can select this option to enter your address details manually and continue with your application.” should not be displayed in the application form. 
 

 
**Temporary Address Selection** 
When the applicant selects the checkbox,
 
Then the following fields should be displayed: 

- Postcode (mandatory) 
- Address Line 1 (mandatory) 
- Address Line 2 (optional) 
- Town (mandatory) 
 
 
**Permission Availability in Temporary Zone** 
If the temporary zone has assigned permissions such as: 

- Resident Permit 
- Carer Permit 
 
 
Then the applicant can only apply for temporary permissions for these types. 
**Example:**
 
If the applicant wants to purchase a Resident Permit but cannot find their address,
 
Then they can apply using the temporary permission with a correspondence address. 

 
**Permission Not Assigned to Temporary Zone** 
If the applicant selects a temporary permission for a permission not assigned to the Temporary Zone (e.g., Doctor Permit), 
Then the system should restrict the action and display the info message “Temporary permission is not available for this [Permission Name].” 
**When the user selects the *Temporary Permission* checkbox,**

Then the **Saved Address** and **Find Address Manually** fields should **not** be hidden or disabled. 
**When the checkbox is selected,**

And the user enters a correspondence address,

And then selects a saved address **or** enters a postcode in the *Find Address Manually* field,

Then the **Temporary Permission** checkbox should automatically be **unchecked**. 
**When the checkbox is checked again,**

If previously entered correspondence address details exist,

Then the system should **retain the entered data** in the correspondence address fields. 
 
 
**Zone Tag Display** 
When the applicant enters the correspondence address,
 
Then the system should display the tag:“This address is allocated to **[Zone Name]**. This zone name refers to the temporary zone automatically created by the system when the *Address Challenge* toggle is enabled in the Contract Settings. If this information is incorrect, please contact **[Contract Phone Number]**.” 

- **[Zone Name]** – Automatically fetched from the temporary zone created by the system. 
 
- **[Contract Phone Number]** – Retrieved from the *Contract Settings (MNPS)* configuration. 
 
 
 
 
**Max Number of Permits Per User in the Zone** 
Given ‘Max number of permits per user in the zone’ is 2 for Visitor Permission,
 
And the user has already purchased 2 Visitor Permits in the same zone,
 
When the user tries to purchase another Visitor Permit in the same zone,
 
Then the system should restrict the user and show the alert message “You’ve reached the maximum number of permits you can hold in this zone.” 

 
**Maximum Number of Permits Per Zone** [#190148](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/190148/) 

 
If the **Maximum voucher books per household**, **Blue badge limit** configured in temporary zone that validations are covered here [#180803](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/180803/) 
 

 
**Application Continuation** 
When the applicant provides a correspondence address,
 
Then the system should navigate to the Document → Price & Checkout tabs. 

 
**Application Submission Flow** 
When the application is submitted,
 
Then it should move to the ‘Pending Approval’ work queue. 
Reference: The application flow for temporary permission is covered in [#181869](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/181869/)
