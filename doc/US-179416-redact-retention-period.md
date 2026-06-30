# User Story 179416: Redact Retention period

## Metadata
| Field | Value |
|-------|-------|
| ID | 179416 |
| Type | User Story |
| Title | Redact Retention period |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags |  |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a super admin/contract admin 
When in the contract setting (Apply) 
Then should have the 'Redact Retention Period' toggle 
** 
When the toggle is enabled 
Then should see a following field and it is mandatory to configure 

- Frequency - Numeric field 
- Period - drop down 
 
Period drop down should show the  

- Day(s) 
- Weeks(s) 
- Months(s) 
- Year(s) 
 
 
 
When the user selects "Day(s)" from the Period dropdown
Then the Frequency field should accept numeric values between 0 and 365
 

 
When the user selects "Week(s)" from the Period dropdown
 
Then the Frequency field should accept numeric values between 1 and 5
 

 
When the user selects "Month(s)" from the Period dropdown
 
Then the Frequency field should accept numeric values between 1 and 12
 

 
When the user selects "Year(s)" from the Period dropdown
 
Then the Frequency field should accept numeric values between 1 and 3 
When the toggle is disabled 
Then the frequency and period field should be hidden 

 
 
 
Show Restore Option Based on Retention Period** 
Given a retention period is configured for Redact in Contract Settings  
When a Back Office user performs the Redact action on an applicant record  
Then the applicant’s information should be redacted (hidden or masked)  
And the system should display a "Restore" button for that record  
And the Restore button should remain available based on the configured retention period  
  **For example: - ** 
If 2 weeks is configured, the Restore button is available for 2 weeks   
If 3 months is configured, the Restore button is available for 3 months
