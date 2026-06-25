# US-110411: Applicants - List Screen

| Field | Value |
|-------|-------|
| **ID** | 110411 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

Given a Super admin / Contract admin, 
When selected 'Applicant' sub menu under Users main menu, 
Then should be taken to the list screen that list all applicant users of the contract 

 
When viewing the list of users, 
Then should see both the users created from Customer Portal and BO as well. 
 

 
When in the list screen, 
Then should have the columns as "First Name, Last Name, Contact Number, Email Address, Date of Birth, Status and Actions". 

 
When in the DOB column, 
Then should see the DOB of the user if available. 
Note: DOB will be fetched from Experian Api, but this will be implemented later. Hence DOB column can be shown as empty for now. 

 
When there is no DOB data, 
Then the column can be empty. 
 

 
When there is a mismatch in user entered DOB and the one fetched from Experian, 
Then the user entered DOB should be considered. 

 
When in the status column, 
Then should see the status as 'Active, Deactivated, Verification Pending" 

 
Active: Applicant user has completed the email confirmation after registration. 
Deactivated: When the account is deactivated, either by Applicant user or by System user 
Verification Pending: When registered, but verification is pending. 
 

 
**Column Level Sorting & Filtering:** 
When interacting with the list,Then the user should be able to sort in ascending and descending order. 
& 
Then should be able to Filter in the column level. 

 
_Note:_ 
Search and Filtering will covered in [#113689](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/113689/) 
 
'Action' Column's sub options covered in [#113760](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/113760/).  'Action' column with 3 dots can be shown in this story itself.
