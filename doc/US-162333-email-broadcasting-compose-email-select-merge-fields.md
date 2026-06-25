# US-162333: Email Broadcasting - Compose Email | Select Merge Fields

| Field | Value |
|-------|-------|
| **ID** | 162333 |
| **Type** | User Story |
| **Module** | Email |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**Merge Fields**
 
 
Given the Super Admin / Contract Admin / BO Manager / BO User, 
When the email template includes merge fields,
 
When viewing the template,
 
Then the merge field placeholders (e.g., {{FirstName}}, {{PermitID}}) should be visible and insertable into the message. 
_Note_: Merge fields attached 

 
When placed the cursor in the email body and selected a merge field from list, 
Then that merge field should be appended in the email body.
 
Given the email contains merge fields,
 
When the email is sent,
 
Then the merge fields must resolve correctly with recipient-specific data.
