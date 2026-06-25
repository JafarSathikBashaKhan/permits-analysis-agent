# US-136315: Applicant Details - Applications | Documents - Add or Upload Document

| Field | Value |
|-------|-------|
| **ID** | 136315 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**Add or Upload Document** 
Given a Super admin / Contract admin / BO Manager / BO User,
 
When clicks on the appropriate button to upload,  
Then should be able to upload the document after selecting its type. 
 
 
When selected the type of the document, 
Then should be able browse and upload the document. 

When the document is uploaded
 
Then should see the success indication as "Document has been successfully uploaded". 

 
**Validation**
 
When upload the document 
 
Then file format should be in ".png, .pdf, .jpg, .bmp, .tif, .heic" and max size 10 mb 

 
**Error**
 
When select invalid format
 
Then should see the error message as "Invalid file format"
 

 
When select the file exceed the size limit
 
Then should see the error message as "File size must not exceed 10 mb"
 

 
When the system failed to upload the document due to technical issue
 
Then should see the error message as "Something went wrong. Please try again"  

 
Events Capturing / Audit
Event Type / Name: New Document Uploaded 
Event Description: New document has been uploaded for the application 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change
