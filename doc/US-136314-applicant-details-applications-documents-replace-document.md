# US-136314: Applicant Details - Applications | Documents - Replace document

| Field | Value |
|-------|-------|
| **ID** | 136314 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**Validation for Uploading New Doc or Replacing** 
Given a Super admin / Contract admin / BO Manager / BO User,
 
When upload the document 
 
Then file format should be in ".png, .pdf, .jpg, .bmp, .tif, .heic" and max size 10 mb 

 
**Replace Document** 
When selected option to replace the document, 
Then should be able to replace the existing ones with the new ones from the local. 
 

 
When select Replace Document for the application that is active, 
Then
 should see a confirmation pop-up as "You are trying to replace the 
document of an active application. Are you sure wish to replace?" 

 
When confirms to replace, 
Then should be able to replace the existing ones with the new ones from the local. 
**(This change should only be in the application level. It should not affect same document in the account level)** 
 

 
When the user uploads a valid file to replace the existing document and the file upload is completed successfully,
Then the previous file should be replaced with the new file. 
& 
Then the following should be updated:
 

- File name 
- File size (if different) 
- Upload date/time 
- Document tag (if applicable, should remain unchanged unless intentionally modified) 
 
 
 
When tries to upload an unsupported file format or an empty file,
Then should see the validation error message as “Unsupported file type” or “File cannot be empty”. 
& 
Then the replacement should be blocked. 

 
**Events Capturing:**Event Type / Name: Document replaced 
Event Description: Document has been replaced for the application 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change
