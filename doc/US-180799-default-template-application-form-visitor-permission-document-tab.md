# US-180799: Default template | Application form | Visitor Permission | Document tab

| Field | Value |
|-------|-------|
| **ID** | 180799 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Document Tab** 
When in the Document section  
Then should have two option 

- Option to upload from local 
- Option to attach the existing document added in the applicant account 
 
 
**Upload Document from Local** 
When the user select the option to upload local 
Then should select the document type and subtype 
 
When select the subtype 
Then should be able to browse and upload the document from their local 
 
**Document types visible if enabled** 
Given a Document Type is enabled in Permission Builder for the permission 
When the user select the option to upload from local 
Then that Document Type must be available for selection. 
And disabled Document Types must not appear. 
Refer: [#25067](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/25067/) 
 
**Sub-types visible after type selection** 
When the user selects that Document Type 
Then all its sub-types should be displayed for selection. 
 
**Upload new document (single proof_count)** 
Given Document Type 'Proof of ownership' is enabled and the proof_count field is set as 1 by default 
When the user uploads one file, selects the document type and sub-type, and clicks Save 
Then the document is attached to the application and shown in the Document tab. 
And if all mandatory document requirements are satisfied, Save and Continue is enabled. 
**** 
**Upload new document (multiple proof_count)** 
Given Document Type 'Proof of ownership' is enabled with proof_count = 2 
When the user uploads only one document and clicks Save 
Then the system shows an error (e.g., “You must upload 2 documents for Proof of ownership. 1 uploaded.”) 
And Save and Continue remains disabled until 2 documents are uploaded. 
 
**Remove document** 
When the document is uploaded 
Then should have the option to remove the document 
 
Given a document is uploaded and attached to the application 
When the user removes it 
Then the proof count is recalculated. 
If mandatory requirements are no longer met, Save and Continue becomes disabled. 
 
**Validation** 
When upload the document  
Then file format should be in .png, .pdf, .jpg, .bmp, .tif, .heic and max size 10 mb 
 
**Error** 
When select invalid format 
Then should see the error message as "Invalid file format" 
 
When select the file exceed the size limit 
Then should see the error message as "File size must not exceed 10 mb" 
 
When the system failed to upload the document due to technical issue 
Then should see the error message as "Something went wrong. Please try again" 
 
 
**Attach Existing Document (from Applicant Account)** 
Select existing documents by type 
Given the applicant already has documents stored in their account 
And Document Type should be shown based on the configuration in the permission builder > Document settings Ref: [#25067](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/25067/) 
When the user selects the option to attach existing document 
Then the list must show only existing documents that match for the Document Types. 
 
**Sub-type filtering** 
When the user selects that Document Type 
Then all its sub-types should be displayed for selection. 
 
**Attach existing document (single proof_count)** 
Given Document Type 'Proof of ownership' is enabled and the proof_count field is set as 1 by default 
When the user uploads one file, selects the document type and sub-type, and clicks Add document 
Then the document is attached to the application and shown in the Document tab. 
And if all mandatory document requirements are satisfied, Save and Continue is enabled. 
 
**Upload existing document (multiple proof_count)** 
Given Document Type 'Proof of ownership' is enabled with proof_count = 2 
When the user uploads only one document and clicks Save 
Then the system shows an error (e.g., “You must upload 2 documents for Proof of ownership. 1 uploaded.”) 
And Save and Continue remains disabled until 2 documents are uploaded. 
 
 
**Successful attach** 
Given all mandatory document types and proof counts are met using existing documents 
When the user saves 
Then the documents are attached to the application and displayed in the Document tab  
And Save and Continue is enabled. 
 
**Remove attached document** 
Given an existing document has been attached to the application 
When the user removes it 
Then the proof count is recalculated. 
If the requirement is no longer met, disable Save and Continue. 

 
 
**Save and continue** 
**** 
When the user clicks “Save and Continue”,
 
Then the system should save all entered data from the current tab,
 
And automatically navigate to the next tab in the form. 

 
When the user clicks the “Back” button,
 
Then the system should display the previous tab with all previously saved data pre-filled. 
**** 

 
**Note:** 

- In this story, fields marked as optional will be specifically mentioned. 
- All other fields are mandatory. 
 
When the user leaves any mandatory field empty 
Then the system should display the following error message “This field is required.”
