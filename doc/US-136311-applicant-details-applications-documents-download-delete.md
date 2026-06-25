# US-136311: Applicant Details - Applications | Documents - Download & Delete

| Field | Value |
|-------|-------|
| **ID** | 136311 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**Download** 
Given a Super admin / Contract admin / BO Manager / BO User,
 
When selects the option to download, 
Then the document should be downloaded to local storage. 

 
**Delete** 
When the application is in active state, 
Then delete option is not allowed. (Hiding the delete button or disabling the delete button should be based on Figma) 

 
When the application is not in active state and selected 'Delete', 
Then should see a confirmation pop-up as "Are you sure wish to delete the document $filename"? 

 
 When confirmed the preference to delete, 
Then the document should be deleted. 

 
**Events Capturing:**
 
Event Type / Name: Document deleted 
Event Description: Document has been deleted for the application
 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change
