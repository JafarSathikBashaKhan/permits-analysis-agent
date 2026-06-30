# User Story 142761: Permissions Setup | Builder | Rules - Refund Settings

## Metadata
| Field | Value |
|-------|-------|
| ID | 142761 |
| Type | User Story |
| Title | Permissions Setup | Builder | Rules - Refund Settings |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Given a Super admin / Contract admin, 
When in the Rules tab of Permissions setup, (Permissions Setup -> Builder -> Rules Tab -> Refund Settings)  
Then should see a new tab 'Rules'. (Already done in [#135720](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/135720/) ) 
** 
When selected Rules tab, 
Then should see "Refund Settings" as the 1st menu. 

 
Refund Applicable Option**** 
Given the user is in the Refund Settings section,
 
When the user selects "Yes" for "Refund Applicable",
 
Then the fields for Refund Policy and Cancellation Charge should be displayed.
 

 
Given the user selects "No" for "Refund Applicable",
 
When they do so,
 
Then all refund-related fields (Refund Policy, Cancellation Charge) should be hidden or disabled.
 

 
Refund Policy Drop-down**** 
Given "Refund Applicable" is set to Yes,
 
When the user opens the Refund Policy drop-down,
 
Then the user should see predefined options (e.g., "Only if greater than 3 months") to select. 
Options:(SINGLE SELECT) 
Only if greater than 6 months 
Only if greater than 3 months 
Only if greater than 1 month 
Only if greater than 3 weeks 
Only if greater than 2 weeks 
Only if greater than 1 week 
Full months remaining 
Days remaining 
Unused vouchers 

** 
**Toggle Between Percentage and Currency** 
Given the user is configuring cancellation charges,** 
When the user selects "Currency", 
Then should be able to enter only numbers from 0 to 100000. (Restrict more than that) 
Decimal values, 2 digits after decimal point should also be allowed. 

 
Given the user selects "Percentage",
 
When they do so,
 
Then should be able to enter the whole number from 0 to 100. 

 
Currency field: Currency symbol (Pound) and Percentage symbol should be adjusted accordingly based on the selection. 

 
Default Values and State Persistence**
 
Given the Refund Settings have been previously saved,
 
When the user revisits the section,
 
Then the last saved values for Refund Applicable, Refund Policy, and Cancellation Charges (amount or percentage) should be populated accordingly.
 

 
Given the Refund is enabled, 
Then all the input fields are mandatory for publishing. 

- Refund Policy  
- Cancellation Charge 
 
When missed to set any mandatory field, 
 
Then "This field is required" indication should be shown as per the application standard.
