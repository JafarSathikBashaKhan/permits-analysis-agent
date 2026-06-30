# US-111848: Create System User - Agent Assist

| Field | Value |
|-------|-------|
| **ID** | 111848 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

Given a Super admin / Contract admin, 
When creating a user, 
Then should be able to enable the 'Agent assist' toggle. (Non - Mandatory) 
 
When enabled agent assist, 
Then should see the fields "DDI and PIN". 
 
When the agent assist toggle is enabled, 
Then the "DDI and PIN" fields are mandatory. 
 

 
Mandatory Field Validation
 
Given Agent Assist is enabled for a user, 
When the admin tries to save the user profile without filling DDI or PIN,
 
Then the system should prevent saving and display an error: "This field is required"
 

Field Format and Allowed Characters
 
Given the user enters values in DDI and PIN fields,
 
Then the system should only allow:
 
DDI: Numeric only, 15 digits maximum (no spaces or special characters)
 
PIN: Alphanumeric, 4 minimum to 10 characters maximum (no spaces, no special characters except hyphen or underscore)
 

 
Validation Messages
 
When tries to enter more than the allowed characters, 
Then should be restricted. 
And tries to enter less than 4 characters, 
Then should show the error message "PIN must be at least 4 characters"
 

 
Negative Scenario – Editing After Save
 
Given a user is saved with valid DDI and PIN,
 
When the admin disables the "Agent Assist" toggle,
 
Then the DDI and PIN fields should: Be hidden.
