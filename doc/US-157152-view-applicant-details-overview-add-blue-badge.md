# US-157152: View Applicant Details | Overview | Add Blue Badge

| Field | Value |
|-------|-------|
| **ID** | 157152 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

Note: Blue badge is available only when it is enabled in the contract 
 
Add Blue badge 

 
Given a Super Admin or Contract Admin
 
When on the Applicant Detail screen
 
Then the user should be able to add Blue Badge details for the customer. 

 
When the Blue Badge is not added
 
Then its value should be set to None. 

 
When wants to add a Blue Badge
 
Then they should have the option to edit the Blue Badge. 

 
When the option to Blue Badge is clicked
 
Then a slider screen should open with the following fields: 

- Blue Badge Number – Numeric field allowing up to 20 characters, with no duplicate values permitted. 
- Proof of Evidence – Document upload option. 
 
 
 
 
 
Proof of evidence  
 
When in the Proof of Evidence section
 
Then the user should be able to browse and upload documents. 

 
When the Document Upload pop-up is displayed
 
Then the user should be able to upload documents, with a maximum limit of 2 files. 

 
When the file limit is reached
 
Then the system should display: "File limit reached. Remove a file to upload a new one." 

 
When the user uploads a document successfully
 
Then the system should show toaster as: "Document added successfully." 

 
When a document is added
 
Then the file name should be displayed with a timestamp. 

 
When the Blue Badge number and document are added in the Applicant section for an applicant account (and vice versa)
 
Then they should also be available in the Customer Portal. 
 
 
 
 

 
Remove Document 
 
 
When chooses to remove an added document
 
Then it should be removed from the record. 

 
When a document is removed
 
Then the user should again be able to upload a new document. 
 
 
Save & Confirmation  
 
 
When the Blue Badge number and Proof of Evidence are entered
 
Then the user should be able to click the Save Changes button to update the details. 
 
 
 
Validation 
When upload the document  
Then file format should be in .png, .pdf, .jpg, .bmp, .tif, .heic and max size 10 mb 
 
 
Error 
When select the invalid format 
Then should see the error message as "Invalid file format" 
 
When select the file exceed the size limit 
Then should see the error message as "File size must not exceed 10 mb" 
 
When the user left either one field as empty 
Then should see the error indication as "This field is required"  

 
 
Audit/Event 
Blue badge Added 
Event Type / Name: Blue badge Added 
Event Description: Blue badge Added successfully 
Date and Time: 
User Role: Applicant User 
User Name: First Name and Last Name of the applicant user
