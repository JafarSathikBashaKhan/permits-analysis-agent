# US-148242: View Applicant Details - Send Email | Save as Draft

| Field | Value |
|-------|-------|
| **ID** | 148242 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**Save and Close Option**: 
 
 
Given a **Super Admin / Contract Admin / BO Manager / BO User,** 
When the user wants to draft the email and save without sending, (After drafting) 
Then clicking "Save and Close" should retain the draft and close the window 

 
When the content is saved as draft, 
& When the selects 'Send' by the same BO user for the same applicant account, 
Then should see the saved content populated. 

 
When selects 'Send' in the applicant screen, 
Then should see the content saved as draft. 

 
When viewing the draft contents, 
Then should be able to clear the draft contents loaded. 

 
When wants to clear the draft contents and create a fresh contents, 
Then should be able to create fresh email contents. 

 
When the contents are saved, 
Then it should be BO user (**Super Admin / Contract Admin / BO Manager / BO User,**) specific. 
The saved content of 1 user should not be available for other user. 
& 
Then the saved content should be Applicant user specific. (Only for the previously selected applicant account, the saved content is applicable.) 

 
When the from email address already selected and saved as draft is deleted in the contract level, 
Then when the user again comes to the screen, from address field can be cleared. (So that user can select from the other available addresses) 
& 
Else retain the from address. 

 
~~When the template selected and saved as draft,~~  (The a/c is added in grooming as requested by  developers. Later in development, Suresh said it can be retained. hence stroke down the a/c) 
~~If that template is deleted in the master level, ~~ 
~~Then the contents can be cleared. ~~ 

 
Note: Events capturing is not required for save and draft.
