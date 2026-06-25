# User Story 168777: Permission Tab | Renewal & Reminder settings | Configure Paper Reminders

## Metadata
| Field | Value |
|-------|-------|
| ID | 168777 |
| Type | User Story |
| Title | Permission Tab | Renewal & Reminder settings | Configure Paper Reminders |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Given a super admin / contract admin 
When in the Renewal & Reminder settings 
Then should have the Paper Reminder section  
** 
 
When configure Paper Reminder
 
Then they should be able to add only one Paper Reminder configuration. 

 
When in the Paper Reminder section
 
Then there should be fields for: 

- Frequency 
- Period 
 
 
When in the period field, 
Then the Period drop-down options should include: 

- Weeks 
- Days 
- Months 
 
Weeks**** 
When the Period is set to "Weeks", 
Then the Frequency field should accept values from 1 to 100, 
And should restrict input above 100. 
 
Days**** 
When the Period is set to "Days", 
Then the Frequency field should allow values from 1 to 1000, 
And restrict values above 1000. 
 
Months**** 
When the Period is set to "Months", 
Then the Frequency field should allow values from 1 to 50 only. 
 
**Note:** The Paper Reminder is applicable for both **Physical and Virtual Permissions**.
 

** 
**Publish** 
**** 
 
 
When the user wants to publish** 
Then Paper Reminder configuration should be mandatory. 

 
When Paper Reminder is not configured
 
And the user tries to publish
 
Then the system should show the error message 'This field is required' 
** 
**
** 
****Note: **Based on this configuration, the paper reminder will be sent to applicants who were flagged as **'Paper Reminder'** during BO applicant creation.**
