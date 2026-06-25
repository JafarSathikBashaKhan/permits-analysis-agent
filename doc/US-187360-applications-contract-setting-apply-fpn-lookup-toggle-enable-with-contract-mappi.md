# US-187360: Applications | Contract setting | Apply | FPN Lookup Toggle enable with contract mapping

| Field | Value |
|-------|-------|
| **ID** | 187360 |
| **Type** | User Story |
| **Module** | MNPS Contract Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Given a super admin or contract admin,
 
 
 
 
 
When they navigate to the contract settings for apply in MNPS,
 
Then they should see a toggle labeled "FPN Lookup" in the integration section. 

 
**Behavior** 
By default, the FPN Lookup toggle should be in the disabled state. 

 
**Toggle ON** 
When the user switches the toggle ON, 
The system should display a prompt message: "Enabling FPN Lookup will allow viewing all FPN cases for a applicant in the Application menu. Do you want to enable it?" 
The user can select: 
 
Enable — Confirms enabling the feature and keeps the toggle ON. 
Cancel — Cancels the action and keeps the toggle OFF. 

 
Given a Super Admin user, 
When the FPN Lookup toggle is enabled/On, 
Then a FPN contract name selection dropdown should be displayed. 
 
**Dropdown List** 
Then the dropdown should list all available contracts that have been created with contract type = 'FPN' within the selected organization. 
 
**Mapping Responsibility** 

 
Note: The FPN contract selected must logically match the applied contract. 
**Example:**  
If the applied contract is Lewisham, the selected FPN contract should also correspond to Lewisham. 
The system does not perform automatic validation for this mapping. 
Users are responsible for ensuring that the correct FPN contract is selected. 

 
**Toggle OFF** 
When the user switches the toggle OFF, 
The system should display a prompt message: "Disabling FPN Lookup will remove the option to view FPN cases for vehicles in the Application menu. Do you want to disable it?" 
The user can select: 
 
Disable — Confirms disabling the feature and keeps the toggle OFF. 
Cancel — Cancels the action and keeps the toggle ON. 
 

 
If the FPN Lookup toggle is ON: 
When the user goes to Application > Application Details > Applicant Section, the **FPN Lookup** option should be visible and enabled. 

 
If the FPN Lookup toggle is OFF: 
The **FPN Lookup** option should not be visible in the vehicle section. 

 
**Event Log** 
Event Type / Name: FPN Lookup Toggle Enabled 
Event Description: FPN Lookup toggle enabled. 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName of the user who made the change 
 
Event Category/Type: Configuration 
 

 
Event Type / Name: FPN Lookup Toggle Disabled. 
Event Description: FPN Lookup toggle disabled. 
Date and Time: $CurrentTimestamp 
User Role: $UserRole  
User Name: $FirstName $LastName of the user who made the change 
Event Category/Type: Configuration
