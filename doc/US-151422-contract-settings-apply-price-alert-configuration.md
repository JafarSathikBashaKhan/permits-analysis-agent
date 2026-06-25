# User Story 151422: Contract settings | Apply | Price Alert Configuration

## Metadata
| Field | Value |
|-------|-------|
| ID | 151422 |
| Type | User Story |
| Title | Contract settings | Apply | Price Alert Configuration |
| Assigned To | Natarajan Arumugam |
| State | Done |
| Tags | Fully Complete |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a Super Admin or Contract Admin** 
 
When in Contract settings of Apply 
Then should see a new section titled as "Pricing Alert Configuration"**** 
 
When in the alert configuration section 
Then should see an option to configure 2 reminders. 
And 
Each reminder should have provision to set the frequency and period  
 
Frequency **should have the value defaulted to 1. User should also be able to configure values between 1 to 100. 
**Period **should have values as Days, Weeks and Months. 
** 
When the remainders has been set 
Then an option to enter the email address should be available to specify to which users get the notifications on pricing expiry. 
And 
Should be able to enter max of 10 email address, and below the email address field should see a text info "You can enter up to 10 email address separated by commas." 
And 
Email address validation should be applied as defined in the email address sections of contract creation screen of MNPS. 
 
When the configuration for pricing alert is set 
Then the system should look for the expiry date of each pricing configurations of the permissions and send an alert to the specified user based on the alert configuration set in contract settings. 
 
Example**: 
Remainder 1 - Frequency [1] and Period [Month] is set, and if the pricing expiry date is 30th Sep 2025, then the specified user should be notified on 30th of Aug 2025. [Notified a month prior to the expiry] 
Remainder 2 - Frequency [2] and Period [Weeks] is set, and if the pricing expiry date is 25th Aug 2025, then the specified user should be notified on 12th of Aug 2025. [Notified 2 weeks prior to the expiry] 
** 
Event**:  
Event Type / Name: Pricing remainder alert has been set for the contract.
 
Event Description: Pricing remainder alert set.
 
Date and Time: $CurrentTimestamp
 
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
 
User Name: $FirstName $LastName of the user who performed the action.
 
 
Reference story on Pricing Alert Notification display [[User Story 162433](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/162433): Pricing Alert Notification]
