# US-164967: Application | Application Details | Overview | Vehicles tab

| Field | Value |
|-------|-------|
| **ID** | 164967 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**** 
**** 
**** 
**** 
Permissions
Based on Role 
Given
the user is logged in as either a Super Admin or Contract User, 
When
they access the Applications menu, 
Then
they should be able so permissions and its details 
  
1.
Navigation 
 Given
the Permissions details page 
When
the user selects a Reference Number 
Then
the system must open the Application View screen for that reference number 
And
display all the defined sections (Overview, Applicant, Vehicles, Documents,
Notes, Emails, Audit Log, Payment History). 
 Note:
Vehicles section will not be displayed for License permission, if License is
selected 

 

 

 
 
**** 
Display of vehicles linked to the
application 
** ** 
  Given the
Application View screen is open 
  When the Vehicles
section is displayed 
  Then the system
must show a list of all vehicles linked to the application 
  
**Note** : If the Permission type is “License”
then Vehicles tab should not be displayed 
  
  
Display 'Show Active PCN' option when
enabled 
  
  Given the
Application View screen is open 
  And the PCN toggle
is enabled in the contract settings 
  When the Vehicles
section is displayed 
  Then each vehicle
in the list must have an option to "Show Active PCN" 
  And selecting this
option must invoke the PCN lookup 
  
Hide 'Show Active PCN' option
when disabled 
** ** 
  Given the
Application View screen is open 
  And the PCN toggle
is disabled in the contract settings 
  When the Vehicles
section is displayed 
  Then no vehicle in
the list must display the "Show Active PCN" option 
  
**   Note**: “PCN Toggle” enabled is developed
in USER STORY 160554 
** ** 
**BO user can swap a vehicle / change vehicle** 
** ** 
  Given the
Application View screen is open 
  And the logged-in
user is a BO user 
  When the Vehicles
section is displayed 
  Then the user must
see an option to “Swap Vehicle” using “swap icon” for each linked vehicle
