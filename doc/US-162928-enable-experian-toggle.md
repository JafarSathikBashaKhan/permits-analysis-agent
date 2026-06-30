# US-162928: Enable Experian Toggle

| Field | Value |
|-------|-------|
| **ID** | 162928 |
| **Type** | User Story |
| **Module** | MNPS Contract Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

Given a super admin 
When in the contract setting for apply (MNPS) 
Then should have the experian toggle 
 

 
**Default Behavior** 
The Experian toggle is OFF by default in contract settings. 

 
**Toggle ON Behavior** 
When user enables the toggle,  
Then should see the pop up message as "Enabling Experian Lookup will allow credit scores to be retrieved during the permission application process. Do you want to enable?" 
The user can select:
 
Enable – Confirms the action, and the toggle switches to ON. Upon confirmation 
 

- This contract is now eligible for Experian lookup. 
- In the application form(Customer Portal), the Experian lookup option becomes visible. 
- On performing the lookup, the credit score is saved in the application overview section (Back office). 
 
 
Cancel – Cancels the action, and the toggle remains OFF.
 

 
**Toggle OFF Behavior** 
When user disables the toggle,  
Then should see the pop up message as "Disabling Experian Lookup will remove access to Experian credit scoring for this contract’s applications. Do you want to disable?" 
The user can select: 
Disable – Confirms the action, and the toggle switches to OFF. Upon confirmation 
 
 

- Experian lookup becomes unavailable in the application process for that contract. 
 
 
Cancel – Cancels the action, and the toggle remains ON.
 

 
**Scenario:** 

- Super Admin enables the Experian toggle in the Contract Settings for "Council A". 
- A resident logs into the Customer Portal to apply for a Resident Permit under "Council A". 
- During the application process, the Experian Lookup option becomes visible  
- The resident triggers the lookup, and the system retrieves a credit score from Experian. 
 
 
 
**Event** 
Event Type / Name: Experian Toggle enabled 
Event Description: Experian Toggle enabled 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration 
 

 
Event Type / Name: Experian Toggle disabled 
Event Description: Experian Toggle disabled 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
