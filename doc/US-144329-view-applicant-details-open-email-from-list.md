# US-144329: View Applicant Details - Open Email from List

| Field | Value |
|-------|-------|
| **ID** | 144329 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**Read Full Email Content**
 
 
 
Given a Super Admin / Contract Admin / BO Manager / BO User, 
When selects an email from the list, 
Then should see the  

- Full email body 
- Attachments (if any) 
- Sent timestamp 
- To / from address clearly 
 
**Lines and Breaks:** 
When viewing the email, 
Then line breaks, paragraph formatting, and basic HTML formatting (bold, links, etc.) must be preserved.
 

 
**Emails with Attachments:** 
When the user opens the email with attachments, 
Then the attachments should be downloadable. 

 
Each attachment must be listed below the email body with:

- Filename 
- File type icon (e.g., PDF, Image) 
- Download button or link 
 
**Note**:  
For now, opening and viewing the email can be focused. 
Reply and other allied functionalities can be focused later.
