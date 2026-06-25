# US-195830: Default template | Application form | Non - Zonal permit (car park permit)

| Field | Value |
|-------|-------|
| **ID** | 195830 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | southend |

## Acceptance Criteria

Non - zonal or car park permits are grouped under non-zonal category, which states they wont consume the system configured address. 
 
**Tab 1 | Address tab - Non Zonal permits:** 
If the permission is tagged under non zonal group then this would have the template with non zonal address field. 

 
Permit mode selection field should be available if the permit mode in permission is set as BOTH.  
 
Should have provision to select address from the saved address (from profile sections) 
 
Should have list the open text fields to enter correspondence address as, 
Postcode - Should validate when invalid format entered.  
Property Number / Name  
Street 
Town 
Note: The above fields validation should be as similar to the one defined for the temporary permit application flow. 
 
Should have provision to save the entered address in the profile section for future use.  
 
And if the "business field" is enabled against the permission, then the field should be available in the application form in the address tab. 

  
**Household limit and Max vouchers books per household** - these validation remains same as defined for resident and visitor permit. If the limit exceeds the user should be restricted to apply for this permission. 
The **permission limit **configured for the permission must also be enforced during this purchase.

Under **Builder → Rules → Permission Limit (Non-Zonal)**: 

- If the limit is set to **Unlimited**, the customer may make any number of purchases for the application. 
 
- If a specific limit is configured, the system must validate the customer’s purchase count against that limit. 
 
- If the user attempts to exceed the configured limit, the purchase should be blocked with the message:
**“You have exceeded the purchase limit for this application.”** 
 
 
 

 
Validation pertaining to non - zonal should be as defined as in, if applicable,**[ Story 168818](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/168818): Default template | Application Form | Resident permit | Address tab** 

 
 
**Tab 2 | Vehicle tab:** 

 
Should be defined as in** [User Story 176993](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/176993): Default template | Application Form | Resident permit | Vehicle details** 

 
**Tab 3 | Document tab ** 
**** 
This section should be available only when there are document type configured against the permissions and should behave as defined in** [User Story 176992](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/176992): Default template | Application Form | Resident permit | Document tab** 
**** 
**Tab 4 | Price** 

 
Should behave as defined in, **[User Story 193418](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/193418): Default template | Application Form | Resident permit | Price** 

 
Discounts on state pension and blue badge as defined in [#193418](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/193418/) 
 
**Tab 4 | Checkout** 
**** 
should behave as defined in** [User Story 180803](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/180803): Default template | Application form | Visitor Permission | Price & Checkout tab** 
****
