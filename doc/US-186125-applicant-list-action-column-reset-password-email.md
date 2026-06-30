# US-186125: Applicant List - Action Column | Reset Password Email

| Field | Value |
|-------|-------|
| **ID** | 186125 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Given a Super Admin or Contract Admin, When viewing the applicants list,  
 
When the user account is in "Active" status,
 
When selected "Reset Password",
 
Then the password should be reset and email should be sent followed by a success indication as "Password reset email sent successfully".  
 
Note: Email has been shared as template that is configure in the BO this story is captured in #141488
 
 
*<The above a/c is already developed in [#113760](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/113760/) . Just giving here for context and continuation>*
 
When the customer after receiving the reset password link in email box, 
& Clicks the reset password link, 
Then it should redirect to the customer portal reset password page where he can enter the new password and reset.  
(Link creation and reset password functionalities are already covered in [#56823](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/56823/)) 

 
When the reset password email is triggered via **bulk action** button, 
Then still the customer should receive the same reset password link.
