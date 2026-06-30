# US-193418: Default template | Application Form | Resident permit | Price

| Field | Value |
|-------|-------|
| **ID** | 193418 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | southend |

## Acceptance Criteria

**Tab 1 **[User Story 168818](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/168818): Default template | Application Form | Resident permit | Address section**** 
**Tab 2 [User Story 176993](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/176993): Default template | Application Form | Resident permit | Vehicle details** 
Tab 3 [User Story 176992](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/176992): Default template | Application Form | Resident permit | Document tab
 

 
**Tab 4 | Pricing ** 

 
**Price Section** 
When navigate to the price section 
Then should have Discount, Pricing   
 
 
 
 
**Pricing Duration** 
When the user is in the Price section 
Then the pricing configured for the permission must be displayed in the format: 

- Duration – [Should display all the duration added for the permission] 
- Price – [The system should display the band price & diesel surcharge. If tiered pricing is configured, the first purchase should apply Tier 1 pricing, the second purchase Tier 2, the third purchase Tier 3, and so on. If the ‘Tier price at original rate’ toggle is enabled in the contract, the system should lock the applicant to the tier at which they first purchased. For example, if their first purchase falls under Tier 2 pricing, then Tier 2 will continue to apply for all subsequent purchases.] 
- Diesel surcharge - [Should display the diesel surcharge. If configured for the permission] 
- Sub total - Should calculate the  amount based on the quantity added for the duration. When the duration is not added then the sub total field  should be 0.00 
 
 
**Example:** 
If resident permission pricing has durations of 1 year, 6 months, and 1 month configured, then all three should be displayed in the Pricing Duration section with price & diesel surcharge if configured. 
Diesel surcharge value even if configured against that pricing of the permission, should be included in checkout only if the vehicle is of fuel type "Diesel". 
 
**Default vs Tiered Pricing** 
When a permission has default Band pricing configured 
Then the default Band price & diesel surcharge (if diesel surcharge configured and if the vehicle's fuel type is returned as Diesel) should be displayed. 
 
When a permission has tiered pricing configured 
Then the tiered band prices & diesel surcharge (if diesel surcharge configured and if the vehicle's fuel type is returned as Diesel) should be displayed according to the setup. 
If there are multiple Tier Price configured against that duration, then based on the tier condition the relevant price should be applied. 
Tier 1 price applied, when the user is purchasing the permission for the first time. 
Tier 2 price should be applied, if the user is purchasing the application for the second time with same address. 
 
**Tier Price at Original Rate toggle enabled** 
When the permission has tiered pricing 
And the “Tier price at original rate” toggle is enabled in contract settings 
And the applicant purchases the permission for the first time 
Then the Tier 1 price should be displayed. 
When the applicant purchases the second time (or more) for the same permission 
And the toggle is enabled 
Then the same Tier 1 price should continue to be displayed (instead of progressing to Tier 2, Tier 3, etc.). 
 
When the user applies for resident permit with two vehicles  
And selects the price as duration 1 year 
Then the system should calculate as below, 
**Example:** 

- No of vehicles added for purchase = 2 
- Duration = 1 year  
- Pricing per vehicle = 40pound  
- Total price field should display 80pound 
 
 
The system should calculate the Total Price field using the formula: 
Total Price = Σ ( No of vehicles added × each selected duration’s price) 
 
 
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
 

 
 
**Discount Options** 
The system should provide two discount eligibility options: 
- Are you a Blue Badge holder? → toggle  
- Do you receive a State Pension? → toggle 
 
 
Help text - Appear with the **help description** configured in the [#148820](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/148820/) 
    
 
 
 
 
 
 
 
 
 
 
 
 
By default the toggle is set as OFF**Precondition: **The Blue Badge discount is available only if the Blue Badge toggle is enabled in the contract settings (Apply). 
 
**Blue Badge Validation** 
When the user selects Yes for “Are you a Blue Badge holder?” 
Then should have following **mandatory** fields: 
- Blue Badge Number **- **Alphanumeric input field, Maximum length: 20 characters 
- Proof of Evidence** - **Document upload option, User must upload supporting evidence 
- Add document & Close** -** Button 
 
 
**Pension Validation** 
 
 
 
When the user selects Yes for “Do you receive a state pension?” 
Then a pop-up should appear with the help description configured in the [#148820](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/148820/) and following mandatory fields: 
- Proof of evidence - Document upload option, User must upload supporting evidence 
- Add document & Close - Button 
 
 
 
When in the Proof of Evidence field for both blue badge or pension discount 
Then the user should be able to browse and upload documents. 
 
When the Document Upload pop-up is displayed 
Then the user should be able to upload documents, with a maximum limit of 2 files. 
 
When the file limit is reached 
Then the system should display: "File limit reached. Remove a file to upload a new one." 
 
When the user uploads a document successfully 
Then the system should show toaster as: "Document added successfully." 
 
When a document is added 
Then the file name should be displayed with a timestamp. 
 
When chooses to remove an added document 
Then it should be removed from the record. 
 
When a document is removed 
Then the user should again be able to upload a new document. 
 
 
Validation: 
When upload the document  
Then file format should be in .png, .pdf, .jpg, .bmp, .tif, .heic and max size 10 mb 
 
**Error** 
When select the invalid format 
Then should see the error message as "Invalid file format" 
 
When select the file exceed the size limit 
Then should see the error message as "File size must not exceed 10 mb" 
 
When the user left either one field as empty 
Then should see the error indication as "This field is required"  
 
**** 
**Blue badge details fetched from applicant's account (profile section)** 
When the user selects Yes for “Are you a Blue Badge holder?” 
Then the system should display a pop-up containing the fields Blue Badge Number and Proof of Evidence  
- Pre-populate both fields with the values already stored in the applicant’s account (if available). 
- Allow the applicant to edit the pre-populated information before save. 
 
 
**Blue Badge Limit Validation** 
**Configuration Locations:** 
- Contract Settings – global/default limit. 
- Permission Level mapped in Zone – zone-specific limit. 
 
 
 
 
**Zone-Level Validation** 
**Configuration:** 

- Zone A → resident Permit → Blue Badge Limit = 1 
 
 
**Applicants:** 

- Address: 123 Main Street, Zone A 
 
 
**Process:** 
- Applicant John applies for a resident Permit at **123 Main Street** and selects Blue Badge. 
 
- John is issued **1 Blue Badge discount**. 
 
- John tries to apply again for the same permit at the same address. 
 
 
**System Behavior:** 

- Checks Zone A → Visitor Permit → Blue Badge Limit = 1 
 
- John already has 1 permit at that address. 
 
- **Blue badge discount is restricted**. 
 
- Error message displayed “You’ve reached the maximum number of Blue Badge discount permits allowed for this address.” 
 
 
 
**Contract level Validation:** 

- Contract → Blue Badge Limit = 2 
 
- Applicant lives in a **non-zonal address**. 
 
 
**Applicants:** 

- Applicant Mary has already applied for 2 Blue Badge permits. 
 
 
**Process:** 
- Mary tries to apply for a 3rd Blue Badge permit. 
 
 
**System Behavior:** 

- Checks Contract-level Blue Badge limit = 2 
 
- Mary already has 2 permits 
 
- **Blue badge discount is restricted** 
 
- Error message displayed “You’ve reached your maximum number of Blue Badge permits allowed.” 
 
 
 
 
**Note:** 
Zone-level limit takes precedence only if configured. 
If Zone-level limit is missing, the system uses the Contract-level limit as a fallback. 
 
**** 
**Add document & Close** 
When the user invokes the Add document option in the pop-up, 
Then the entered (or updated) details should be saved against the applicant’s application, 
And the discount should be applied.  
 
When the user invokes the Close option in the pop-up 
Then the pop-up should close without saving any changes. 
 
**Start Date Choosing ** 
 
When the start of the application is configured as “Forward to set date” in the Permission BuilderThen the applicant should see a calendar picker with time selectionAnd the available start date and time should be determined based on the Start Date and Time configured in the Start Date Settings of the Permission Builder. [#132390](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/132390/) 
 
 

 
 
**Save and continue:** 
**** 
When the user clicks “Save and Continue”, 
Then the system should save all entered data from the current tab, 
And automatically navigate to the next tab in the form. 
 
When the user clicks the “Back” button, 
Then the system should display the previous tab with all previously saved data pre-filled.
