# US-125495: Applicants | Bulk Action - Redact

| Field | Value |
|-------|-------|
| **ID** | 125495 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

Precondition for showing 'Redact' button is mentioned in [#111211](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/111211/) 
 

 
**Redact Bulk Action**
 
 
Given a Super admin / Contract admin, 
When the 'Redact' button is in shown and invoked that, 
Then should see a confirmation pop-up as in Figma. (Ref Figma for message) 
Note: The pop-up should say the information like "Name, Email, Telephone, Blue badge number, and attachments will be permanently removed" 

 
When confirmed the preference to Redact, 
Then the following should be deleted, 

- Name 
- Email 
- Telephone  
- Blue badge number 
- Attachments 
 
When redacted, 
Then "Permit data, Residential address. and Contents of application form" should be retained. 

 
When redacted, 
Then only the deactivated account data should be redacted. 
(The account should not have any active applications or permissions) 
 

 
**Technical Error** 
When execution sending failed due to technical issue, 
Then should see "Something went wrong. Please try again." 

 
**Audit Or Events Capturing**: 
Event Type / Name: Redact DataEvent Description: Personal data redacted 
Date and Time: $CurrentTimestamp
 
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
 
User Name: $FirstName $LastName of the user who performed the action
