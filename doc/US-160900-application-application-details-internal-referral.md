# US-160900: Application | Application Details | Internal Referral

| Field | Value |
|-------|-------|
| **ID** | 160900 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Internal Referral** 
**Pre-condition** 
Application can be on any of Below status: 

- In-Progress 
 
- Pending Renewal 
 
 
Then the system must display the Internal Referral option. 
**Display internal team dropdown when initiating referral** 
Given the application is in above mentioned pre-condition status 
When the BO User selects "Internal Referral" from More actions button 
Then the system must display a dropdown list of "internal team members" (with respect to the contract) 
**BO User selects internal team members for referral** 
Given the internal team dropdown is displayed 
When the BO User selects an internal team member from the dropdown 
Then the system must prompt the BO User to enter a mandatory referral note in the provided text box as a "**Notes**" 
And the reason should be included in Notes section with respect to the application 
And notes to be included in Notes section of the respective applcation 
And the system must assign the application to the selected internal team member. 
**Application status is updated after referral** 
Given the application is referred to an internal team 
Then the application status must be updated to "**Internal Referral**" 

 
**Note:** 
**Email notification to the assigned BO is covered in different user story [#195616](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/195616/) **  
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
** ** 
** **  
**System notification will be covered in user story  (will be updated later)**   

   
****Assigned New BO actions on referred application** **  
**Given the application is in "Internal Referral" status **  
**When the internal team selects one of the following actions: **  

- **Approve **  
- **Reject **  
- **Request Supporting Evidence **  
- **On-Hold **  
** **  
****Events / Audit Logged** **  
**Given an internal referral action occurs **  
**Then the system must log the following details: **  
****Event 1: Internal Referral Initiated** **  
***   Event Name: Internal Referral Initiated **  
***   Event Description: (BO User) initiated an internal referral and for further evaluation(With Notes included) **  
***   Event Category: Work Queue **  
***   Date and Time        Current $timestamp **  
***   User Role                  Role of the User **  
***   User Name                 First name and Last name of the user **  
**Note:**   
**Merge fields are not required when including a note.**   

   
** **
