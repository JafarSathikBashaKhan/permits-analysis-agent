# US-161872: Send Notification Emails from Selected Sender Address

| Field | Value |
|-------|-------|
| **ID** | 161872 |
| **Type** | User Story |
| **Module** | MNPS Template Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**MNPS BO > Configuration > Templates > + Design Template** 

 
Given a permission contract is selected,
 
When the user opens the Permission Type field,
 
Then only the permission types associated with that contract should be displayed in the **dropdown**. 

 
 
When a Permission Type is selected,
Then the Sender Email field should appear as a **dropdown**,
And it should list all email addresses configured in Contract Settings for the selected Permission Type. 

 
**EDIT** 
To edit, select the existing template from the grid screen. 
Click the edit button accessed via the three dots. 
When on the edit screen,

Then the sender email can be changed using the dropdown. 
**Notification Sending Behavior** 
When a notification template is triggered (e.g., Reset Password),
 
Then the email should be sent from the selected Sender Email associated with that specific notification template 

 
**Example** 
A template is created for the **Reset Password **Notification template. 
The Sender Email selected during template creation is** noreply@yourdomain.com.** 

 
When a Reset Password event is triggered (e.g., a user clicks “Forgot Password”), 
The system sends the Reset Password email from **noreply@yourdomain.com.**
