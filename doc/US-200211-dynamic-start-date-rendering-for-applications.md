# US-200211: Dynamic Start Date Rendering for Applications

| Field | Value |
|-------|-------|
| **ID** | 200211 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | southend |

## Acceptance Criteria

Display Dynamic Start Date
 
 
Given an application was purchased under a permission that has Start Date configuration,
 
When a BO User or Super Admin views the application anywhere in the system,
 
Then the Start Date must be shown based on the actual calculated date on which an application goes to 'ACTIVE STATE' (not a static date). 

 
Respect Start Date Policy Configuration
Given the permission’s Start Date Policy determines how the start date should be calculated,
 
When the Start Date is displayed in the BO screens,
 
Then the Start Date must reflect the policy used at the time of purchase. 
 
(e.g., Issue Now, Backdated to Start of Month, Backdated to Start of Application, Forward to Set Date). 
Note: The Date on which the status turns "ACTIVE" should be the application start date. 

 
Respect Start Date Delay Configuration
Given a Start Date Delay was configured for the permission,
 
When the Start Date is displayed,
 
Then the displayed Start Date must reflect the delay applied during purchase (today + delay days). 

 
Respect Include Time Configuration
Given the Include Time option was enabled for the permission,
 
When the BO user views the Start Date,
 
Then the system must display the Start Date along with the selected time (HH:MM). 

 
Display End Date Dynamically
Given an End Date is derived based on the permit duration or rules,
 
When a BO User or Super Admin views the End Date,
 
Then the system should display the correct End Date calculated from start date stored for that application (not a placeholder or static value). 

 
Consistency Across All Screens
Given Start Date and End Date appear in multiple areas of the BO system,
 
When these fields are rendered,
 
Then all screens must consistently show the same actual Start/End Date stored for the application. 

 
No Static or Hard coded Dates
Given the earlier implementation displayed a static hard coded date,
 
When the updated dynamic logic is applied,
 
Then no BO screen should ever show the previously hard coded static date.
