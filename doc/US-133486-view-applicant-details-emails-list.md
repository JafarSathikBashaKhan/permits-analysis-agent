# US-133486: View Applicant Details - Emails List

| Field | Value |
|-------|-------|
| **ID** | 133486 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Figma dependency; Fully Complete; LV |

## Acceptance Criteria

**Note: Received cannot be handled now.** 

 
Display Email List
 
 
 
 
Given a Super Admin / Contract Admin / BO Manager / BO User, 
When in the Emails tab of a selected applicant, (Applicants List -> Select an Applicant -> '_Emails Tab_') 
Then should see a list of all emails (sent from BO to customer) with the following details:
 

- Email address (Recipient email address) 
- Subject line 
- Timestamp 
- Sent or ~~received ~~indication  
 
**Search Functionality**
 
When enters a full keyword in the search bar,
 
Then the list should dynamically filter and show only the emails where the keyword is matched in the below: 

- Subject 
 
**Filter** 
When want to filter the list, 
Then should be able to filter based on the columns available. 

 
**Empty Email List** 
When the applicant has no emails yet,
 
Then an indication should be shown as "No emails found". 
 

 
**Large Email List with Pagination** 
When the list has more number of emails, 
Then pagination is required as per the application standards. 
 

**Visual Indicator for Sent vs Received**
 
When goes through the list,
 
Then should see a clear indication "Sent emails (from BO)" 
 

 
_Note_: 
Default Column managing options and filter options are required as there in other grid screens.
