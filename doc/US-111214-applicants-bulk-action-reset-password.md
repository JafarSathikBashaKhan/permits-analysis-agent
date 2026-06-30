# US-111214: Applicants | Bulk Action - Reset Password

| Field | Value |
|-------|-------|
| **ID** | 111214 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

Precondition for enabling the button to reset the password is mentioned in [#111211](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/111211/) 

 
Given a Super admin / Contract admin, 
When the selects the button to reset the password which is in enabled state, 
& 
 
Then a confirmation prompt should appear asking "Are you sure you want to send the reset password email for $users?"
 

 
When confirmed the preference to send reset password link email in bulk, 
Then reset password link should be generated and emailed. 
(For context: Later new password can be set by the customer). 
 

 
When the password reset link is sent, 
Then the old password should be active until the user sets the new password. 
 

 
When the reset password link is sent, 
Then it should be active only for 24 hours. 

 
Technical Error
When action execution failed due to technical issue,
 
Then should see "Something went wrong. Please try again." 

 
**Audit Or Events Capturing**: 
Event Type / Name: Password Reset TriggeredEvent Description: Reset password link has been sent 
Date and Time: $CurrentTimestamp
 
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
 
User Name: $FirstName $LastName of the user who performed the action
