# US-162391: PCN Lookup Toggle

| Field | Value |
|-------|-------|
| **ID** | 162391 |
| **Type** | User Story |
| **Module** | MNPS Contract Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

Given a super admin or contract admin,
 
 
 
 
When they navigate to the contract settings for apply in MNPS,
 
Then they should see a toggle labeled "PCN Lookup" in the integration section. 

 
**Behavior** 
By default, the PCN Lookup toggle should be in the disabled state. 

 
**Toggle ON** 
When the user switches the toggle ON, 
The system should display a prompt message: "Enabling PCN Lookup will allow viewing all PCN cases for a vehicle in the Application menu. Do you want to enable it?" 
The user can select: 
 
Enable — Confirms enabling the feature and keeps the toggle ON. 
Cancel — Cancels the action and keeps the toggle OFF. 
 

 
**Toggle OFF** 
When the user switches the toggle OFF, 
The system should display a prompt message: "Disabling PCN Lookup will remove the option to view PCN cases for vehicles in the Application menu. Do you want to disable it?" 
The user can select: 
 
Disable — Confirms disabling the feature and keeps the toggle OFF. 
Cancel — Cancels the action and keeps the toggle ON. 
 

 
If the PCN Lookup toggle is ON: 
When the user goes to Application > Application Details > Vehicle Section, the **PCN Lookup** option should be visible and enabled. 

 
If the PCN Lookup toggle is OFF: 
The **PCN Lookup** option should not be visible in the vehicle section. 

 
**Event Log** 
Event Type / Name: PCN Lookup Toggle Enabled 
Event Description: PCN Lookup toggle enabled. 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName of the user who made the change 
 
Event Category/Type: Configuration 
 

 
Event Type / Name: PCN Lookup Toggle Disabled. 
Event Description: PCN Lookup toggle disabled. 
Date and Time: $CurrentTimestamp 
User Role: $UserRole  
User Name: $FirstName $LastName of the user who made the change 
Event Category/Type: Configuration
