# User Story 162923: Keep tier pricing at original rate

## Metadata
| Field | Value |
|-------|-------|
| ID | 162923 |
| Type | User Story |
| Title | Keep tier pricing at original rate |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a super admin or contract admin** 
When they navigate to the contract settings (Apply)
 
Then they should see the "Keep tier price at original rate" toggle in the Other section 

 
If the 'tire price' toggle is enable in the pricing 
And this 'Keep tire price at original rate' toggle enable in the contract settings 
Then 'Keep tire price at original rate' functionality should be applicable  

 
If the 'tire price' toggle is disabled in the pricing 
Then 'Keep tire price at original rate' functionality should not be applicable
 

 
Default Behavior** 
The toggle is OFF by default. 
** 
Toggle ON Behavior** 
When enabling the toggle,** 
Then show a confirmation popup message: 
"Enabling this option will retain the original pricing tier for the user, even if their tier eligibility changes in the future. Do you want to continue?" 
The user has two options: 
Enable — confirms the action; toggle remains ON. 
Cancel — cancels the action; toggle remains OFF. 

 
Toggle OFF Behavior** 
When disabling the toggle,** 
Then show a confirmation popup message: 
"Disabling this option will allow the system to update the pricing tier based on current eligibility upon renewal. Do you want to continue?" 
The user has two options: 
Disable — confirms the action; toggle changes to OFF. 
Cancel — cancels the action; toggle remains ON. 

 
Notes:** This toggle locks the user to the original tier they purchased, regardless of future tier reassignments or eligibility changes. This functionality addresses council requests to keep users on their original tier for consistency or fairness. 
** 
Example** 
A resident buys a Tier 2 permit in 2024. 
In 2025, the resident’s eligibility would normally move them to Tier 3 due to changes in tier structure or availability. 
If the toggle is ON, the resident remains on Tier 2 for pricing and classification. 
If the toggle is OFF, the resident moves to Tier 3 pricing upon renewal as per the current tier rules. 
** 
Event** 
Event Type / Name: Keep tier pricing at original rate Toggle enabled 
Event Description: Keep tier pricing at original rate Toggle enabled 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration 
 
Event Type / Name: Keep tier pricing at original rate Toggle disabled 
Event Description: Keep tier pricing at original rate Toggle disabled 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
