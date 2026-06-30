# US-164966: Application | Application Details | Overview | Applicant tab

| Field | Value |
|-------|-------|
| **ID** | 164966 |
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

 
**Applicant tab Details** 

 
 
**** 
**** 
**Display of applicant personal details** 
** ** 
  Given the
Application View screen is open 
  When the Applicant
section is displayed 
  Then the system
must show the applicant's  

- First
name 
- Lastname 
- Email
Id 
- Date
of Birth 
- Mobile
number 
- Address 
 
**Note**:   only if the “Show DOB”
toggle is enabled in permit settings, Date of Birth will be displayed in
Applicant details. Refer [#129427](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/129427/)   
Display of applicant Date of Birth if
enabled 
  
  Given the
Application View screen is open 
  And the Date of
Birth field is enabled in system settings 
  When the Applicant
section is displayed 
  Then the system
must show the applicant's Date of Birth 
  
**Hide Date of Birth if disabled** 
** ** 
  Given the
Application View screen is open 
  And the Date of
Birth field is disabled in system settings 
  When the Applicant
section is displayed 
  Then the system
must not show the Date of Birth field
