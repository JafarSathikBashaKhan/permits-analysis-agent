# US-133707: View Applicant Details | Document - Add and Replace

| Field | Value |
|-------|-------|
| **ID** | 133707 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**Add Document** 
When in the section of document categories, 
Then should see an option to add document. 

 
When selected the option to add document, 
Then
 should see the document types. (Document types should be shown based on
 the types that are configured for that permission type) 

 
When selected the document type, 
Then should be able to upload the document in .png, .pdf, .jpg, .bmp, .tif, .heic and max size 10 mb
 

 
When the document is uploaded
Then should see the success indication as "Your document has been successfully uploaded"  
 

When document is added
 
Then the file name should be displayed with timestamp. 

 
When uploads a document newly, 
Then should see the line item against that document as 'Inactive'. (Because it is not tied against any application) 

 
**Replace Document **(Only single select) 
When viewing documents, 
Then should have 'Replace document (label name as in Figma)' option against each document. 

 
When select Replace Document for a document, 
& 
If the that document is **tied against a active permission application,** 
Then should see a confirmation pop-up as "This document is in use for an active application. Are you sure wish to replace? _info text_: This will not replace the document at application level." 

 
When confirmed the preference to replace, 
Then the document should be replaced. 

 
When select Replace Document for a document, 
& 
If the that document is **not tied against a active permission application,** 
Then should see a confirmation pop-up as "Are you sure wish to replace?" 

 
When confirmed the preference to replace, 
Then the document should be replaced. 

 
 
 
When tries to replace the document, 
Then should only be able to replace the document in allowed formats. (_Formats_: png, .pdf, .jpg, .bmp, .tif, .heic and max size 10 mb) 

 
When tries to upload more than 10 mb, 
Then should see a pop-up message as "File size cannot be more than 10 MB size". 
& 
Then should able to select another one of less than 10 MB and upload. 

 
When tries to replace with other document formats, 
Then should not be allowed to upload. (Should not see the other formats to upload) 

 
When replaced,  
Then the replaced document shouldn't affect the active application.  
(When document is replaced, that should be in user account level only.) 

 
**Validation**
 
When upload the document 
 
Then file format should be in .png, .pdf, .jpg, .bmp, .tif, .heic and max size 10 mb
 

 
**Error**
 
When the system failed to upload the document due to technical issue
 
Then should see the error message as "Something went wrong. Please try again" 
 

 
**Events Capturing:** 
Event Type / Name: New Document Uploaded 
Event Description: New document has been uploaded for the application 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change 

 
 
Event Type / Name: Document replaced 
Event Description: Document has been replaced for the application 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change
