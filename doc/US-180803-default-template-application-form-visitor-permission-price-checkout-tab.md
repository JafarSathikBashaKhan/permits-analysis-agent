# US-180803: Default template | Application form | Visitor Permission | Price&Checkout tab

| Field | Value |
|-------|-------|
| **ID** | 180803 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Prathiba K  |
| **Tags** | southend |

## Acceptance Criteria

**Price Section** 
When navigate to the price & Payment section 
Then should have Discount, Pricing   
 
 
 

 
**Pricing Duration** 
When the user is in the Price & Payment section 
Then the pricing configured for the permission must be displayed in the format: 

- Duration – [Should display all the duration added for the permission] 
- Price – [The system should display the band price & diesel surcharge. If tiered pricing is configured, the first purchase should apply Tier 1 pricing, the second purchase Tier 2, the third purchase Tier 3, and so on. If the ‘Tier price at original rate’ toggle is enabled in the contract, the system should lock the applicant to the tier at which they first purchased. For example, if their first purchase falls under Tier 2 pricing, then Tier 2 will continue to apply for all subsequent purchases.] 
- Diesel surcharge - [Should display the diesel surcharge. If configured for the permission] 
- Quantity - The number of vouchers entered for that duration.
 
- Sub total - Should calculate the  amount based on the quantity added for the duration. When the duration is not added then the sub total field  should be 0.00 
 
 
**Example:** 
If visitor permission pricing has durations of 1 hour, 6 hours, and 1 day configured, then all three should be displayed in the Pricing Duration section with price & diesel surcharge if configured. 
 
 
**Number of Vouchers** 
When in the Quantity field should: 

- Accept only numeric values 
- Accept values in the range 1–1000  
 
 
And the **Quantity** field should have Add button against each duration 

 
 
When the user clicks the **Add** button,
Then the system should display **increment (+)** and **decrement (–)** options,
And should also allow the user to **manually enter a number** in the field. 

 
**Voucher configuration locations in BO** 
Given voucher purchase limits are configured in Back Office (BO) 
Then the field Maximum voucher books per household should exist in two places: 
- Permission Group level  Refer: [#132523](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/132523/) 
- Zone level Refer: [#140180](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/140180/) 
 
 
 
Given the user enters a value in the Quantity,Then the system should validate it against the configured limits as follows: 
- Zonal Address: 

- If the user’s address belongs to a zone, the system applies the Zone-level configuration, if it is configured. 
 
 
 
- Non-Zonal Address: 

- If the user’s address does not belong to a zone, the system applies the Permission Group-level configuration, if it is configured. 
 
 
 
- Maximum Voucher Books per Household: 

- If the configuration is set to None, the user can buy unlimited vouchers without restriction. 
 
 
 
 
 
**Validation error message** 
Given the maximum voucher books per household is configured as 30 in BO 
When the user enters 35 in the Quantity and click the Add button against the pricing section 
Then the system should display an error message,“You cannot purchase more than 30 vouchers per household.”” 
 
Given a household has already purchased and used their full annual allowance of visitor permits 
When the user applies again within the same annual period 
And enters a value in the Number of Voucher and click the Add button against the pricing section 
Then the system should display the error message “You have exceeded your annual allowance of visitor permits.”  
 
 
Given the maximum voucher books per household is configured as 30 in the Back Office (BO), 
And the household has already purchased 27 vouchers, 
When the user enters 5 in the Quantity field and clicks the Add button in the pricing section, 
Then the system should restrict the purchase and display the error message “You can only purchase 3 more vouchers. The maximum voucher per household is 30.” 

 
**Default vs Tiered Pricing** 
When a permission has default Band pricing configured 
Then the default Band price & diesel surcharge (if diesel surcharge configured) should be displayed. 
 
When a permission has tiered pricing configured 
Then the tiered band prices & diesel surcharge (if diesel surcharge configured) should be displayed according to the setup. 
 
**Tier Price at Original Rate toggle enabled** 
When the permission has tiered pricing 
And the “Tier price at original rate” toggle is enabled in contract settings 
And the applicant purchases the permission for the first time 
Then the Tier 1 price should be displayed. 
When the applicant purchases the second time (or more) for the same permission 
And the toggle is enabled 
Then the same Tier 1 price should continue to be displayed (instead of progressing to Tier 2, Tier 3, etc.). 
 
When the user enters a Number of voucher 2 
And selects the duration 1 hour voucher 
Then the system should calculate Number of voucher × Voucher price 
**Example:** 

- 1 hour voucher price = 25 
- Permit count = 2 
- Calculation = 25 × 2 = 50 
- Total price field should display 50 
 
 
When the user enters a permit count of 2 
And selects the durations 1 hour voucher and 6 hour voucher 
Then the system should issue 2 × 1 hour vouchers and 2 × 6 hour vouchers 
And calculate: (Quantity × 1 hour voucher price) + (Quantity × 6 hour voucher price) 
**Example:** 

- 1 hour voucher price = 25 
- 6 hour voucher price = 35 
- Permit count = 2 
- Calculation = (25 × 2) + (35 × 2) = 50 + 70 = 120 
- Total price field should display 120 
 
 
 
If the user enters 2 as the Quantity and selects the duration 1 Hour Voucher, 
And the user enters 5 as the Quantity and selects the duration 6 Hour Voucher, 
Then the system should issue 2 × 1 Hour Vouchers and 5 × 6 Hour Vouchers, 
And the system should calculate the total price as: 
(Quantity × 1 Hour Voucher Price) + (Quantity × 6 Hour Voucher Price) 

 
The system should calculate the Total Price field using the formula: 
Total Price = Σ ( Quantity × each selected duration’s price) 
Given one or more durations are already added When the user reduce the duration in the Quantity fieldThen the system should recalculate the Total Price field accordingly. 
 
**Vat% **if VAT percentage is configured in the contract settings then that percentage should be added in the total price Refer: [#108776](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/108776/) 
 
 
**Admin fee for permission** If admin fee is configured then that amount should be added in the total price   
The fee is applied based on two levels of configuration: 
- Contract Settings (Default) – This is the standard or default fee that applies to all permissions. Refer: [#163196](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/163196/) 
- Permission Builder – This is where you can override the default fee for a specific permission. If a fee is defined here. Refer: [#165020](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/165020/) 
 
 
 
 
When a pricing duration is selected  
Then the system should: 
- Apply all applicable discounts (e.g., Blue Badge, State Pension). 
- Apply additional values such as: 
 
 

- VAT % 
- Admin Fee 
 
 
**Save and continue** 
**** 
When the user clicks “Save and Continue”, 
Then the system should save all entered data from the current tab, 
And automatically navigate to the next tab in the form. 
 
When the user clicks the “Back” button, 
Then the system should display the previous tab with all previously saved data pre-filled. 

 
Checkout section 

 
**Payment Method** 
When in the Payment method  
Then should have the drop down  
 
When select the drop down  
Then should have values enabled in the payment settings in permission builder** [#135723](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/135723/)** 
**** 
**** 
**** 
**Terms and Condition** 
**** 
**When** the applicant reaches the final step of the application form,**Then** the system should display a message stating **“By clicking Apply, you agree to our Terms and Conditions and Privacy Policy.”** 
**When** the user clicks on the “Terms and Conditions” (which should be clickable/invokable) 
**Then** the system should display the Terms and Conditions content mapped to that permission in a modal or popup window. 
 
**When** the user clicks on the "Privacy Policy" (which should be clickable/invokable)**Then** the system should display the Privacy policy configured in the contract creation (MNPS) content mapped in a modal or popup window. 
 
 
**Apply** 
When the user has entered all mandatory fields 
And clicks the Apply button, 
Then the application should submitted. 
And should display the following **success message:** 
“Application Submitted. Thank you for submitting your application. Your permit will either be auto-approved or sent to the processing team for review, depending on the permit type. You will receive an email with the next steps once your permit is approved. To check your permit status, go to ‘Manage Permits’ on the account home page. Your permit is not valid until its status shows ‘Active’.” 
 
Display an option “Would you like to apply for another "Permission name"?” with the below options: 
Yes! Please→ Navigate to the permit application flow. 
No Thanks Take me back to my permit page → Redirect to my permit page of the customer portal. 
 
 
**Cancel (Include in all tabs) covered in [#190410](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/190410/) ** 
~~When the user invokes Cancel, ~~ 
~~Then the system should display a pop-up message stating “Would you like to save your work as draft before leaving?” ~~ 
~~And the pop-up should provide Stay on page, Don't Save and Save and Leave options: ~~ 
~~**Stay on page**: Closes the pop-up and keeps the user on the current page. ~~ 
~~**Don't Save:** Confirms the cancellation and discards changes. ~~ 
 
~~**Save and leave:** ~~ 
~~When the user invokes Save and leave, ~~ 
~~Then the system should display a toaster message "Progress saved successfully." ~~ 
~~And should redirect to the my permit page should have tag as 'Draft' ~~ 

 
 
 
When the user clicks the “Back” button, 
Then the system should display the previous tab with all previously saved data pre-filled. 
 
 
**Note:** 

- In this story, fields marked as optional will be specifically mentioned. 
- All other fields are mandatory. 
 
When the user leaves any mandatory field empty 
Then the system should display the following error message “This field is required.” 

 
**Tier Pricing Application** **Zone Permissions (Property-Level Tier Pricing)** 
- **Given** the permission is configured as a Zone Permission, 
 
- **When** a user submits the same permission request for the **same property**, 
 
- **Then** the system should apply **tier pricing at the property level**, 
 
- **And** each subsequent application for the same permission and property should move to the **next tier price**. 
 
 
**Non-Zone Permissions (User-Level Tier Pricing)** 
- **Given** the permission is configured as a Non-Zone Permission, 
 
- **When** the user submits the same permission request again (regardless of property), 
 
- **Then** the system should apply **tier pricing at the user level**, 
 
- **And** each subsequent application for the same permission by that user should move to the **next tier price**. 
 
 
 
**Example 1 – Zone Permission (Property-Level)** 
(Tier increments based on the SAME property) 
RequestDate    Tier AppliedPermission for Property A    19-11-2025       Tier 1 Permission for Property A    19-11-2025       Tier 2 Permission for Property A    19-11-2025       Tier 3  
 
**Example 2 – Non-Zone Permission (User-Level)** 
(Tier increments based on SAME user for SAME permission) 
RequestDateTier AppliedUser submits Permission X    First attempt  Tier 1 User submits Permission X    Second attempt  Tier 2 User submits Permission X    Third attempt  Tier 3  
 
 
**First application is rejected before the second application is submitted** 

- User submits **Application 1** 
 
- Back Office reviews and **rejects** Application 1 
 
- User then submits **Application 2** 
 
 
 At the time of Application 2 submission: 

- Application 1 = **Rejected**, so it is **not counted** 
 
 
**Result:** **Tier 1 pricing applies** to Application 2 because no active permits exist. 
 
**Scenario 2 — First application is still active when the second application is submitted** 

- User submits **Application 1** 
 
- Application 1 is still in an active status (Pending/Submitted/In progress) 
 
- User submits **Application 2** 
 
- AFTER Application 2 is submitted, Application 1 gets Rejected/Cancelled 
 
 
At the time of Application 2 submission: 

- Application 1 = **Active**, so it is **counted** in the tier calculation 
 
- Rejection/cancellation happens **later**, so it does NOT impact the pricing already applied 
 
 
**Result:** **Tier 2 pricing applies** to Application 2. 
**Tier pricing is locked at the moment of purchase and does NOT get recalculated later.** 
 
**Full Scenario Breakdown (All Possible Cases)** 
**Scenario A — First application rejected before second submission** 
Application 1: Submitted → Rejected or canceled 
Application 2: Submitted after rejection 
Pricing: 
→ Application 2 = Tier 1 
(Because no active permits remain) 
 
**Scenario B — First application active when second application is submitted** 
Application 1: Submitted  
Application 2: Submitted  
Application 1: Later Rejected or Cancelled 
Pricing: 
→ Application 2 = Tier 2 
(Because Application 1 was active at that time) 
 
**Scenario C — Both first and second active when third is submitted** 
Application 1: Active  
Application 2: Active  
Application 3: Submitted 
Pricing: 
→ Application 3 = Tier 3 
(2 active permits at that moment) 
Even if Application 1 or 2 gets rejected later → Tier stays Tier 3 
 
**Scenario D — First rejected, second active, third submitted** 
Application 1: Rejected  
Application 2: Active  
Application 3: Submitted 
Pricing: 
→ Application 3 = Tier 2 
Because only Application 2 counts. 
 
**Scenario E — Rapid submission order** 
User submits multiple applications before BO takes action: 
Application 1: Submitted   
Application 2: Submitted Before BO reviews anything  
Application 3: Submitted 
Pricing: 
→ Application 3 = Tier 3 
Later if BO rejects 1 → does NOT change the applied Tier. 
 
**Scenario F — User rejected an application** 
If the user withdraws before submitting a new one: 
Application 1: Cancelled (treated similar to rejected)  
Application 2: Submitted 
→ Application 2 = Tier 1 
Reason: Withdrawn = NOT active.
