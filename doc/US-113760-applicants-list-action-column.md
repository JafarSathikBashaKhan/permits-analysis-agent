# US-113760: Applicants List - 'Action' Column

| Field | Value |
|-------|-------|
| **ID** | 113760 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

Display of Actions Based on Status
 
 
 
 
 
 
 
 
Given a Super Admin or Contract Admin,
 
When viewing the applicants list, 
Then should see an "Actions" menu against each applicant account with options visible based on the applicant’s current status. 

- Verification Pending - Send Confirmation Email 
- Active - Reset Password, Deactivate 
- Deactivated -  Redact Data & ~~Activate Account~~, Reactivate Account. 
 
**Send Confirmation Mail Action**
 
When the user account is in "Verification Pending" status, 
& 
When selected "Send Confirmation Email", 
Then confirmation email should be sent followed by a success indication as "Confirmation email sent successfully". 
(Mail should be sent based on template. For now, until the template UI is ready, trigger mail from back end) 

 
**Reset Password Action**
 
When the user account is in "Active" status, 
& 
 
When selected "Reset Password", 
Then a confirmation prompt should appear asking ~~"Are you sure you want to reset the password email?"~~ "Are you sure you want to send reset password email <User Name> Account?'" 

 
When confirmed the preference to send reset password email, 
Then the password should be reset and email should be sent followed by a success indication as "Password reset email sent successfully".  
(For context: Later new password can be set by the customer) 
 

 
**Deactivate Account Action**
 
When the user account is in "Active" status, 
& 
When selected "Deactivate", 
Then should see confirmation prompt ~~"Are you sure you want to deactivate this account?"~~ "Are you sure you want to Deactivate <User Name> Account?" 

 
When confirmed the preference to deactivate, 
Then the account should be deactivated followed by "Account deactivated successfully" indication. 
 

 
When account deactivated, (Soft delete)  
Then email should be triggered based on template. 
(Mail can be sent via backend for now until template UI is ready) 

 
When the account has any active applications, 
Then should not be allowed to deactivate and appropriate error should be shown as "There are some open applications for this user, hence account cannot be deactivated" 

 
**Activate the Deactivated Account** 
When the user account is in "Deactivated" status, 
& 
When selected "Activate", 
Then should see confirmation prompt "Are you sure you want to active this account?" 

 
When confirmed the preference to Activate,  
Then the account should be Activated followed by "Account activated successfully" indication. 
 

 
When account Activated, 
Then email should be triggered based on template. 
(Mail can be sent via backend for now until template UI is ready) 

 
 
 
**Error Handling** 
 
When any of the actions failed, 
Then should see an error indication as "Something went wrong. Please try again" 
& 
Then no status or account changes should occur unless the action succeeds. 

 
**Events Capturing:** 
**Send Confirmation Mail Action**
 
Event Type / Name: Applicant Confirmation email 
Event Description: Confirmation email sent to applicant. 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change. 

 
**Reset Password Action** 
Event Type / Name: Applicant Reset password 
Event Description: Applicant account password has been reset 
 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change. 

 
**Deactivate Account Action** 
Event Type / Name: Applicant Account Deactivated 
Event Description: Applicant user account has been deactivated
 
Date and Time:
  
User Role: $Role of the user who made the change
  
User Name: First Name and Last Name of the user who done the change. 

 
Activate the Deactivated Account
 
Event Type / Name: Applicant **Account Reactivated** 
Event Description: Applicant user account has been reactivated. 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change.
