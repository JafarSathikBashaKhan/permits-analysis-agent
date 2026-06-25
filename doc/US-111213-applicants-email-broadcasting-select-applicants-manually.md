# US-111213: Applicants | Email Broadcasting & Select Applicants Manually

| Field | Value |
|-------|-------|
| **ID** | 111213 |
| **Type** | User Story |
| **Module** | Email |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

Navigation and Access
 
 
 
 
 
 
 
Given the Super Admin / Contract Admin / BO Manager / BO User is on the Applicants List screen,
 
When they view the page,
 
Then the "Send Email" (Email Broadcasting) option should be available.
 

 
Given the user selects the "Send Email" option,
 
When clicked,
 
Then the system should navigate the user to a dedicated email composer screen.
 

 
**Recipient Selection Mode** 
When in the composing screen,
 
Then should see the field named "Choose recipients by". 

 
When in the choose recipients by field, 
Then should see the options between. 

- User accounts (Email accounts of all active applicant accounts) 
- Geographic 
 
**Manual Account Selection**
 
When prefers to go with applicant accounts selection, 
Then should be able to select from the Name & Email accounts of active applicant accounts mapped to users's CONTRACT. 
& 
Should not see the email accounts of Inactive and Verification pending status applicant accounts. 

 
When wants to make selection, 
Then should be able to make multi selection. 

 
When want to search through the list, 
Then should be able to search based on contains logic. 

 
When want to send to all active applicant accounts, 
Then should be able to "Select All". 

 
When selected email accounts, 
Then should be able to unselect the already selected ones. 

 
**Show Count**: 
When selected the email accounts, 
Then should see the count of email accounts selected. 

 
**Switch to Geographic After Account Selection**: 
Given the user after user account selection,
 
When they attempt to switch to recipient mode to geographic,
 
Then should see a prompt "Changing the recipient mode will reset your current selection".
