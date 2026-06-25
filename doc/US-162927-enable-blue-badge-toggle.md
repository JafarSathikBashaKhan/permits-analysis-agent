# User Story 162927: Enable Blue Badge Toggle

## Metadata
| Field | Value |
|-------|-------|
| ID | 162927 |
| Type | User Story |
| Title | Enable Blue Badge Toggle |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a super admin 
When in the contract setting (Apply) 
Then should have the blue badge toggle 
** 
Default Behavior** 
The Blue Badge toggle should be OFF (disabled) by default. 
** 
Toggle On** 
When Enabling the Toggle  
Then should see the popup message should appear "Enabling the Blue Badge option will allow you to configure and apply Blue Badge limits in the contract setup. Do you want to enable it?" 
The user can select: 
Enable – Confirms the action, and the toggle switches to ON. 
Cancel – Cancels the action, and the toggle remains OFF. 
** 
When the toggle is enabled  
Then the blue badge limit should be display 

 
Toggle Off** 
When Disabling the Toggle  
Then should see the popup message should appear "Disabling the Blue Badge option will remove access to Blue Badge limit settings in the contract apply section. Do you want to disable it?" 
The user can select: 
Disable – Confirms the action, and the toggle switches to OFF. 
Cancel – Cancels the action, and the toggle remains ON. 
** 
When the toggle is disabled  
Then the blue badge limit field should not display 

 
Impact in customer portal (My account/profile) and applicant menu BO (Overview)** 
**
** 
**Blue Badge Toggle Enabled** 
Given the Blue Badge toggle is enabled in the contract settings,** 
When a user views the Customer Portal or Applicant Overview in the Back Office,
 
Then the Blue Badge section should be visible. 

 
Blue Badge Toggle Disabled** 
Given the Blue Badge toggle is disabled in the contract settings,** 
When a user views the Customer Portal or Applicant Overview in the Back Office,
 
Then the Blue Badge section should be hidden. 

 
Toggle Disabled After Badge Details Added** 
Given Blue Badge details were already added in the Customer Portal and/or Applicant BO,** 
And the Blue Badge toggle is then disabled,
 
Then the system should hide the Blue Badge section in both places.
 

(The previously saved data remains intact in the backend.) 

 
Toggle Re-enabled After Being Disabled** 
Given the Blue Badge toggle is re-enabled after being disabled,** 
Then any previously entered Blue Badge details should be visible again in both Customer Portal and Applicant BO. 

 

 
Event** 
Event Type / Name: Blue badge Toggle enabled 
Event Description: Blue badge Toggle enabled 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration 

 
 
 
 
Event Type / Name: Blue badge Toggle disabled 
Event Description: Blue badge Toggle disabled 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
