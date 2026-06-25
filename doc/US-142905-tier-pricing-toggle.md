# User Story 142905: Tier Pricing toggle

## Metadata
| Field | Value |
|-------|-------|
| ID | 142905 |
| Type | User Story |
| Title | Tier Pricing toggle |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a permissioned user (Super Admin or Contract Admin)**When in the Contract Settings screen
 
Then the user should see a toggle labelled "Tier Pricing"**** 

 
Default State: The toggle should be OFF by default.
 

 
When the user switches the Tier Pricing toggle ON**, 
Then display the following confirmation prompt:** 
"Enabling this toggle will apply the Tier Pricing fee to the application cost. Do you want to enable it?"
 
[Yes] [No]
 
Selecting Enable→ enables the toggle
 
Selecting Cancel→ closes the prompt and retains the current state
 

 
When the user switches the Tier Pricing toggle OFF**,** 
Then display the following confirmation prompt:
 
"Disabling this toggle will remove the Tier Pricing fee from the application cost. Do you want to disable it?"
 
[Yes] [No]
 
Selecting Disable → disables the toggle
 
Selecting Cancel → closes the prompt and retains the current state
 

 
If the toggle is enabled, then the Tier Pricing section should be visible on the Pricing screen, allowing the user to configure multiple pricing tiers.** 
If the toggle is disabled, then the Tier Pricing section should be hidden from the Pricing screen.** 

 
Event **Logging: 
 
Event Type / Name: Tier Pricing Toggle Enabled
 
Event Description: Tier Pricing toggle enabled.
 
Date and Time: $CurrentTimestamp
 
User Role: $UserRole (e.g., Super Admin / Contract Admin)
 
User Name: $FirstName $LastName of the user who made the change
 

 
Event Type / Name: Tier Pricing Toggle Disabled. 
Event Description: Tier Pricing toggle disabled. 
Date and Time: $CurrentTimestamp 
User Role: $UserRole (e.g., Super Admin / Contract Admin) 
User Name: $FirstName $LastName of the user who made the change
 

 
Note: The contract can decide switch the toggle off whenever required.
