# US-163729: Enable Agent Assists Toggle

| Field | Value |
|-------|-------|
| **ID** | 163729 |
| **Type** | User Story |
| **Module** | MNPS Contract Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

Given a super admin 
When in the contract settings for apply (MNPS) 
Then should have the agent assist toggle 

 
**Default Behavior** 
The Blue Badge toggle should be OFF (disabled) by default. 
 
**Toggle On** 
When Enabling the Toggle  
Then should see the popup message should appear "Enabling Agent Assist allows agents to securely assist customers with payments and makes this payment option available for customers. Do you want to enable it?" 
The user can select: 
Enable – Confirms the action, and the toggle switches to ON. 
Cancel – Cancels the action, and the toggle remains OFF. 
 
**Toggle Off** 
When Disabling the Toggle  
Then should see the popup message should appear "Disabling Agent Assist will prevent agents from assisting customers with payments and will make this payment option unavailable for customers. Do you want to disable it?" 
The user can select: 
Disable – Confirms the action, and the toggle switches to OFF. 
Cancel – Cancels the action, and the toggle remains ON. 

 
**Impact on Payment Settings in Permission Builder** 

 
 
**Scenario 1 – Enable Agent Assist** 
Given the toggle for Agent Assist is enabled in the Payment Settings of the Permission Builder 
Then the Agent Assist option should be available to select as a payment method for the permission 

 
**Scenario 2 – Disable Agent Assist** 
Given the toggle for Agent Assist is disabled in the Payment Settings of the Permission Builder 
Then the Agent Assist option should not be available as a payment method for the permission 

 
**Event** 
Event Type / Name: Agent assists Toggle enabled 
Event Description: Agent assists Toggle enabled 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration 

 
Event Type / Name: Agent assists Toggle disabled 
Event Description: Agent assists Toggle disabled 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
