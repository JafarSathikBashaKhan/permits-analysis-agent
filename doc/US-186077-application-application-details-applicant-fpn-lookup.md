# US-186077: Application | Application Details | Applicant | FPN Lookup

| Field | Value |
|-------|-------|
| **ID** | 186077 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | southend |

## Acceptance Criteria

**** 
**** 
**** 
**** 
  Scenario: Perform FPN lookup against
an applicant 
** ** 
    Given the user is logged in as a
"Super Admin" or "Contract Admin" 
    And the user is in the Applicant section of
an application (Overview à Applicant) 
    When the user performs a lookup of FPN with
respect to the applicant by triggering “Show active FPN / FPN lookup” 
    Then the system should display the matching
FPN records with respect to the contract (configured in settings) 
  
**Scenario: View list of FPNs linked to the applicant** 
** ** 
    Given the user is logged in as a “Super
Admin” or “Contract Admin” 
    And the user navigates to the Applicant
section of an application 
    When the applicant has one or more ACTIVE FPNs
associated  
    And search criteria should be based on First name, Last name, Postcode and Property name (MNPS) 
    and Address details 1,2,3,4 (based on configured) 

 
    Then the system should display a list of
FPNs based on search critera with details including  

- Contravention Date & Time 
 

 - Case
     Number         

 - Balance
     Amount       
 
-Total
outstanding amount 
  
  
  Scenario: No FPNs
linked to applicant 
** ** 
    Given the user is viewing the Applicant
section of an application 
    And the applicant has no FPNs associated 
    Then the system should display a message
“No Fixed Penalty Notices found for this applicant.”
