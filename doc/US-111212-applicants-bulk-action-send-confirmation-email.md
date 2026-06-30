# US-111212: Applicants | Bulk Action - Send Confirmation Email

| Field | Value |
|-------|-------|
| **ID** | 111212 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

Precondition for showing 'Send Confirmation Mail' button is mentioned in [#111211](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/111211/) 

 
**Send Confirmation Mail Bulk Action**
 
 
Given a Super admin / Contract admin, 
When the 'Send Confirmation Email' button is in shown and invoked that, 
Then should see a confirmation pop-up "Are you sure you want to send confirmation emails for $users". 

 
When confirmed the preference to send, 
Then confirmation email should be sent followed by a success indication as "Confirmation Email sent successfully to $X ~~applicants~~ users". 
 
(Mail should be sent based on template. For now, until the template UI is ready, trigger mail from back end) 
 

 
When want to skip sending, 
Then should be able to close the confirmation pop-up by selecting appropriate button. 

 
When the mail is sent, 
Then user should receive the email with the link to confirm the registration. 
& 
Then the link should have a expiration time of **24 hours**. 
(By clicking the link, the applicant should be able to confirm the account) 

 
When confirms the account based on the confirmation process, 
Then the account should be moved to 'Active' state from ' Verification pending'. 

  
When wants to select all,   
Then should be able to select all. 
  

  
When invoked the button to select,  
Then all the entries of all pagination should be selected. 

 
When selected many applicant accounts from the list for bulk action, 
But want to trigger confirmation email for only one account, 
Then should be able to trigger via 'Actions' column button against the line item. 
(Bulk email should not be triggered. Only for the account from which the user triggered action email should be sent)

 
**Technical Error** 
When mail sending failed due to technical issue, 
Then should see "Something went wrong. Please try again." 

 
**Audit Or Events Capturing**: 
Event Type / Name: ~~Confirmation Email Sent~~ Applicant Confirmation email Event Description: ~~Confirmation Email sent.~~ Confirmation email sent to applicant. 
Date and Time: $CurrentTimestamp
 
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
 
User Name: $FirstName $LastName of the user who performed the action
