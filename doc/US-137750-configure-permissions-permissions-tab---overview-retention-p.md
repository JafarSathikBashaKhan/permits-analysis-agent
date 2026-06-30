# User Story 137750: Configure Permissions | Permissions Tab - Overview | Retention Period for Expired Permits

## Metadata
| Field | Value |
|-------|-------|
| ID | 137750 |
| Type | User Story |
| Title | Configure Permissions | Permissions Tab - Overview | Retention Period for Expired Permits |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Positive Scenarios
** 
**Numeric Entry Only**** 
Given the user is on the Overview screen,
 
When entering a value in the field "Retention Period for Expired Permits (Days)", 
Then the system should allow only positive whole numbers including 0. 
Default Value: 7 

 
Valid Configuration Behavior**** 
Given the value 8 is entered,
 
Then expired permits will remain visible for 8 days after expiry, and will be hidden automatically on the 9th day.
 

 
Zero Configuration Behavior**** 
Given the value 0 is entered,
 
Then expired permits should be hidden by the next day after expiry. 

 
Tool Tip Display**** 
When the user hovers over the tooltip icon near the field,
 
Then the system should show:
 
"Enter the number of days expired permits should remain visible after their expiry date. For example, if set to 7, expired permits will be displayed for 7 days before being hidden from the system view. Enter 0 to hide them immediately upon expiry."
 

 
Persist and Reflect Behavior**** 
When the configuration is saved,
 
Then the system should enforce this setting in the customer portal only.  
Note: In back-office portal, the expired ones can be listed ignoring the configured value. 

 
Edit** 
When wants to edit, 
Then should be allowed. 

 
When edits, 
Then all the validations applicable for add applies here.
