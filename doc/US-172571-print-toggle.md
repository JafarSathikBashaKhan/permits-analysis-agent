# US-172571: Print Toggle

| Field | Value |
|-------|-------|
| **ID** | 172571 |
| **Type** | User Story |
| **Module** | MNPS Contract Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Given a super admin/contract admin 
When in the contract settings in MNPS 
Then should have the 'Apply print' toggle in MNPS 

 
**Default Behavior** 
The Print Partner toggle should be OFF (disabled) by default. 
 
**Toggle On** 
When Enabling the Toggle  
Then should see the popup message should appear "Enabling the Apply print toggle will make the ‘Send to Print’ option available for Physical Permission and White Mail Reminder applications, allowing them to be sent to the Print Partner. Do you want to enable it?" 
The user can select: 
Enable – Confirms the action, and the toggle switches to ON. 
Cancel – Cancels the action, and the toggle remains OFF. 
 
When the toggle is enabled  
Then in the physical permission & white reminders should have the 'Send to Print' option is available in the grid screen and the action column 
 
**Toggle Off** 
When Disabling the Toggle  
Then should see the popup message should appear "Disabling the Apply print toggle will remove the ‘Send to Print’ option for Physical Permission and White Mail Reminder applications, and they will no longer be sent to the Print Partner. Do you want to disable it?" 
The user can select: 
Disable – Confirms the action, and the toggle switches to OFF. 
Cancel – Cancels the action, and the toggle remains ON. 
 
When the toggle is disabled  
Then in the physical permission & white reminders should not have the 'Send to Print' option is available in the grid screen and the action column 

 
 
 
 
**Event** 
Event Type / Name: Apply print Toggle enabled 
Event Description: Apply printr Toggle enabled 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration 
 
 
 
 
Event Type / Name: Apply print Toggle disabled 
Event Description: Apply print Toggle disabled 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
