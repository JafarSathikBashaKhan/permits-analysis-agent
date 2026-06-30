# US-164800: Enable Auto-guru toggle

| Field | Value |
|-------|-------|
| **ID** | 164800 |
| **Type** | User Story |
| **Module** | MNPS Contract Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Given a super admin 
When in the contract setting for (MNPS) 
Then should have the toggle for Auto-guru look up in Integration sections
 
And 
The Autoguru toggle is set to be OFF by default in contract settings of MNPS. 

 
Toggle ON Behavior
 
When user enables the toggle, 
 
Then should see the popup message as "Enabling Auto-Guru look up will retrieve and display vehicle details such as make, model, colour, year of manufacture, etc., based on the entered VRM. Are you sure you want to enable?"
 
The user can select:
 
Enable – Confirms the action, and the toggle switches to ON.This contract is now eligible for auto-guru lookup. 
In the application form (Customer Portal / BO), the auto-guru lookup option becomes visible [In Add Vehicle section - > show Vehicle Details].
 
Cancel – Cancels the action, and the toggle remains OFF.
 

 
Toggle OFF Behavior
 
When user disables the toggle, 
 
Then should see the pop up message as "Disabling Auto-Guru lookup will remove access to retrieving vehicle details. Are you sure you want to disable?"
 
The user can select:
 
Disable – Confirms the action, and the toggle switches to OFF. Upon confirmation
 
Autoguru lookup becomes unavailable in the application process for that contract while adding vehicle.
 
Cancel – Cancels the action, and the toggle remains ON.
 

 
Event
 
Event Type / Name: Auto-guru Toggle enabled for {Contract name}
 
Event Description: Auto-guru Toggle enabled for {Contract name}
 
Date and Time: $CurrentTimestamp
 
User Role: $UserRole
 
User Name: $FirstName $LastName
 
Event Category/Type: Configuration
 

 
Event Type / Name: Auto-guru Toggle disabled for {Contract name}
 
Event Description: Auto-guru Toggle disabled for {Contract name}
 
Date and Time: $CurrentTimestamp
 
User Role: $UserRole
 
User Name: $FirstName $LastName
 
Event Category/Type: Configuration
