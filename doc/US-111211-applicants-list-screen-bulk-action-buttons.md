# US-111211: Applicants List Screen - Bulk Action Buttons

| Field | Value |
|-------|-------|
| **ID** | 111211 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

Given a Super admin / Contract admin, 
When in the applicants list screen, 
Then should have the following dedicated bulk operations button. 

- Send confirmation email 
- Send email 
- Send Reset Password Email 
- Redact data 
 
**Button Visibility**When no applicants are selected on the Applicants page,
 
Then all the bulk operations button should be hidden. 

 
**Button Visibility After Selection**
 
When one or more applicants are selected,,
 
Then should see the following options based on the status of applicant account, 

- Send confirmation email 
- Send email 
- Send Reset Password Email 
- Redact data 
 
**Bulk Actions Button Enabling Based on Status** 
**Active:** 
When one or more selected applicants have the status "**Active**",
Then the following options should be available:
 

- Send email 
- Reset Password 
- And the "Redact data and Send Confirmation email" option should be hidden. 
 
 
**Verification Pending**: 
When one or more selected applicants have the status "Verification Pending",
Then only the following options should be available:
 

- Send email 
- Send Confirmation e Mail 
- And the "Redact data and Reset Password" option should be hidden. 
 
**Deactivated**: 
When one or more selected applicants have the status "Deactivated",
Then only the following options should be available:
 

- Send email 
- Redact data 
- And the "Send Confirmation Email and Reset Password" option should be hidden. 
 
**Mixed Status Scenarios**: 
_Any Combination_ -  (including all the 3 selected together) 
 
When the user selects multiple applicants for any combination of status,
Then the **"Send email"** options should **shown **as default.
(Because that actions are allowed for all statuses.) 

 
**Hide Buttons for Mixed Selection** 
_Active and Deactivated:_ 
When the user selects accounts in "Active and Deactivated state,Then the "Reset Password, Redact data and Send Confirmation email" option should be hidden other can be shown. 
 

 
_Active and Verification Pending:_ 
When the user selects accounts "Active and Verification Pending" selection,
Then the "Reset Password, Redact data and "Send Confirmation" option should be hidden other can be shown. 

 
_Verification Pending and Deactivated_ 
When the user selects accounts in "Verification pending and Deactivated"Then the "Reset Password, Redact data and "Send Confirmation" option should be hidden other can be shown. 
 

 
_Active + Verification Pending + Deactivated_ 
When the user selects accounts in "Active + Verification Pending + Deactivated",Then the "Reset Password, Redact data and "Send Confirmation" option should be hidden. 
 

 
_Note_: 
Redact operation is only applicable for the deactivated accounts.
