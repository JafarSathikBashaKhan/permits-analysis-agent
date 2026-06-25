# User Story 142892: Diesel Surcharge  toggle

## Metadata
| Field | Value |
|-------|-------|
| ID | 142892 |
| Type | User Story |
| Title | Diesel Surcharge  toggle |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a permissioned user (Super Admin or Contract Admin),** 
 
 
When in contract settings 
 
Then should see a toggle:
 
Diesel Surcharge**** 

 
 
Default **State: The Toggle should be set to OFF by default.**
 
When the user switches the Diesel Surcharge toggle ON
 
Then display the following confirmation prompt:
 

 
*"Enabling this toggle will apply the diesel surcharge fee to the application cost. Do you want to enable it?"*
 
[Enable] - Enables the toggle 
[Cancel] - should close the pop up.
 

 
When the user switches the Diesel Surcharge toggle OFF
 
Then display the following confirmation prompt:
 

 
*"Disabling this toggle will remove the diesel surcharge fee from the application cost. Do you want to disable it?"
* 
 
[Disable] - Disables the toggle 
[Cancel] - should close the pop up. 

 
And when the toggle is enabled,
 
Then the diesel surcharge field should become visible on the Pricing screen.
 

 
Else if the toggle is disabled,
 
Then the diesel surcharge field should be hidden from the Pricing screen.
 

 
Event **Logging: Diesel Surcharge Toggle
 
Event Type / Name: Diesel Surcharge Toggle Enabled
 
Event Description: Diesel surcharge toggle Enabled.
 
Date and Time: $CurrentTimestamp
 
User Role: $UserRole (e.g., Super Admin / Contract Admin)
 
User Name: $FirstName $LastName of the user who performed the action 

 
Event Type / Name: Diesel Surcharge Toggle disabled 
Event Description: Diesel surcharge toggle disabled. 
Date and Time: $CurrentTimestamp 
User Role: $UserRole (e.g., Super Admin / Contract Admin) 
User Name: $FirstName $LastName of the user who performed the action
 

 
Note: The contract can decide switch the toggle off whenever required.
