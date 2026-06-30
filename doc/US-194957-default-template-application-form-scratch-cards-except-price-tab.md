# US-194957: Default template | Application form | Scratch cards (except price tab)

| Field | Value |
|-------|-------|
| **ID** | 194957 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Sureshkumar M  |
| **Tags** | southend |

## Acceptance Criteria

Scratch card permits are physical version of visitor permit. There provided only in physical mode of scratch card books. And scratch cards can be both **zonal and non zonal permits** 

 
**Tab 1 | Address tab - ****Zonal Based scratch card permit:** 
If the permission is tagged under zonal group then this would have the template with zonal address.

 
No selection of permit mode is required as the scratch cards are ideally physical. (Permit mode selected in permission should be Physical) 

 
Rest all shall be similar to the address tab in resident permit. Ref [User Story 168818](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/168818): Default template | Application Form | Resident permit | Address tab 

 
**Tab 1 | Address tab - Non-Zonal scratch card permits:** 
If the permission is tagged under non zonal group then this would have the template with non zonal address fields. 

 
No selection of permit mode is required as the scratch cards are ideally physical. (Permit mode selected in permission should be Physical) 
 
Should have provision to select address from the saved address (from profile sections) 

 
Should have list the open text fields to enter correspondence address as, 
Postcode - Should validate when invalid format entered.  
Property Number / Name  
Street 
Town 
Note: The above fields validation should be as similar to the one defined for the temporary permit application flow. 

 
Should have provision to save the entered address in the profile section for future use.  

 
For both zonal and non zonal address tab, if the business field is enabled against the permission, then the field should be available in the application form in the address section. 

 
**Note: No Vehicle tab for scratch cards. In form Builder, should have provision to disable the Vehicle tab when configuring the template for this permission.** 
**VRM Limit in the vehicle setting will be set to 0.** 

 
**Tab 2 | Document tab ** 

 
This section should be available only when there are document type configured against the permissions and should behave as defined in** [User Story 176992](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/176992): Default template | Application Form | Resident permit | Document tab** 
In form Builder, should have provision to enable / disable the Document tab as required.
 

 
**Tab 3 | Price** 

 
No start date selection should be available as the stat date method will be configured as "issue now" for scratch cards and visitor permits. 

 
Pricing part as defined in "[User Story 180803](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/180803): Default template | Application form | Visitor Permission | Price&Checkout" tab   **EXCEPT below changes,** 

 
**Duration ** 
**Price** 

 
Price is covered in [#201786](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/201786/) 
 

 
Discounts on state pension and blue badge: Discounts if configured against the permissions or the contract should be applicable in price tab. refer discount related functionality in [#180803](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/180803/) 

 
**Tab 4 | Checkout** 

 
As defined in** [User Story 180803](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/180803): Default template | Application form | Visitor Permission | Price & Checkout tab** 

 
**IMP: Scratch card should behave as similar to visitor permit with all the conditions and validations as applicable to visitor permit. Please refer to the visitor permit stories to include the conditional validation across the tabs against the configuration made in the permission and contract settings.** 

 
**Note:** 
**Scratch card expiry and serial number generation should be tracked in the story [User Story 195824](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/195824): Scratch card serial number generation and expiry**
