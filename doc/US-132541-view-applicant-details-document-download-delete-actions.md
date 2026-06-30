# US-132541: View Applicant Details | Document - Download, Delete Actions

| Field | Value |
|-------|-------|
| **ID** | 132541 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Figma dependency; Fully Complete; LV |

## Acceptance Criteria

**Download**
 
Given Super admin / Contract admin / BO Manager / BO User, 
When wants to download the document locally, (for download button label name, ref Figma) 
Then should be able to Download the document to the local. 

 
 
**Delete** 
 
 
When viewing the documents, 
Then should see 'Delete' option for all documents. (for Delete button label name, ref Figma) 

 
When selected the option to delete, 
& 
If the that document is not tied against a active permission application, 
Then should see a confirmation pop-up as "Are you sure wish to delete this document?" 

 
When confirmed to delete, 
Then the document should be deleted. 

 
When selected the option to delete, 
& 
If the that document is **tied against an active permission application**, 
Then should be restricted from deleting with a message "Document cannot be deleted as this is in use for an active application" 

 
**Validation**
 
When upload the document 
 
Then file format should be in .png, .pdf, .jpg, .bmp, .tif, .heic and max size 10 mb
 

 
**Error**
 
When the system failed to upload the document due to technical issue
 
Then should see the error message as "Something went wrong. Please try again" 

 
**Note**: 
When the document is newly added or replaced or deleted, 
Then there is no change in the state of the application. 

 
 
 
Events Capturing / Audit
Event Type / Name: Document deleted 
Event Description: Document has been deleted for the application
 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change
