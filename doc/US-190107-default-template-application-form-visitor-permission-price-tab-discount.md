# US-190107: Default Template | Application Form |Visitor Permission | Price Tab - Discount

| Field | Value |
|-------|-------|
| **ID** | 190107 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | southend |

## Acceptance Criteria

**Discount Options** 
The system should provide two discount eligibility options: 
- Are you a Blue Badge holder? → toggle  
- Do you receive a State Pension? → toggle 
 
 
Help text - Appear with the **help description** configured in the [148820Configure Permissions | Permission Tab | Discount Settings | Help Description](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/148820/) 
 
[Ready for UAT](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/148820/) 
 
  
By default the toggle is set as OFF 
**Precondition: **The Blue Badge discount is available only if the Blue Badge toggle is enabled in the contract settings (Apply). 
 
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
 
**Remove option ** 
When chooses to remove an added document 
Then it should be removed from the record. 
 
When a document is removed 
Then the user should again be able to upload a new document. 
 
 
Validation 
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
**Applicant add blue badge details in applicant account** 
When the user selects Yes for “Are you a Blue Badge holder?” 
Then the system should display a pop-up containing the fields Blue Badge Number and Proof of Evidence  
- Pre-populate both fields with the values already stored in the applicant’s account (if available). 
- And the applicant shouldn't edit the pre-populated information. 
 
 
**Given** the Blue Badge details are not added in the applicant’s account
**When** the applicant enable Blue Badge 
**Then** the system should display an option to **Add Blue Badge Details**. 
**When** the applicant enters the Blue Badge details and submits the application
**Then** the  Blue Badge information should be added to the applicant’s account. 
 
**Blue Badge Limit Validation** 
**Configuration Locations:** 
- Contract Settings – global/default limit. 
- Permission Level mapped in Zone – zone-specific limit. 
 
 
 
 
**Zone-Level Validation** 
**Configuration:** 

- Zone A → Visitor Permit → Blue Badge Limit = 1 
 
 
**Applicants:** 

- Address: 123 Main Street, Zone A 
 
 
**Process:** 
- Applicant John applies for a Visitor Permit at **123 Main Street** and selects Blue Badge. 
 
- John is issued **1 Blue Badge discount permit**. 
 
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
And the discount should be applied when you select pricing duration.  
 
When the user invokes the Close option in the pop-up 
Then the pop-up should close without saving any changes. 
 
**Start Date Choosing ** 
 
When the start of the application is configured as “Forward to set date” in the Permission BuilderThen the applicant should see a calendar picker with time selectionAnd the available start date and time should be determined based on the Start Date Delay and Time configured in the Start Date Settings of the Permission Builder. [#132390](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/132390/)
