# User Story 179406: Free Permission Option

## Metadata
| Field | Value |
|-------|-------|
| ID | 179406 |
| Type | User Story |
| Title | Free Permission Option |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags |  |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Given a Super Admin or Contract Admin** 
 
When the user navigates to Permission Builder → Permission tab → General Settings
 
Then the system should display a labeled "Free Permission" with enable and disable radio button
 

** 
**Enable Free Permission ** 
When the user enables the button** 
Then the system should display a confirmation prompt with the message "Enabling this option will make this permission free, even if a pricing is configured. No charges will be applied." 
And the prompt should have two actions: Enable and Cancel
 

 
When the user selects Enable
 
Then the permission should be considered at zero cost
 
And it should remain enable
 
And it should not affect any existing pricing configuration
 

 
When the user selects Cancel
 
Then the option should remain disabled
 
And no changes should be applied
 

 
Disable Free Permission** 
Given the "Free Permission" radio button is enabled
 
When the user disables the radio button
 
Then the system should display a confirmation prompt with the message "Disabling this option will remove the free status from this permission. Configured pricing will now be applied." 
And the prompt should have two actions: Disable and Cancel
 

 
When the user selects Disable
 
Then the permission should no longer be free
 
And the option should remain disable
 

 
When the toggle is disabled 
Then the pricing configured for the permission should be consider 

 
When the user selects Cancel
 
Then the option should remain enable
 
And no changes should be applied
