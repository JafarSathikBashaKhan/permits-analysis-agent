# US-168840: Application | Application Details | Expired Application (Permit Expired)

| Field | Value |
|-------|-------|
| **ID** | 168840 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**** 
**Pre-Condition of the Application:** 
**Current Work Queue Status : ACTIVE (until the Permit expiry date is reached)** 
**Once Expired date crossed, application status will be changed to “EXPIRED”** 

 
**Expired Permit Application Handling:** 
**Application status automatically changes to EXPIRED when permit end date is reached** 
Given the permit's end date has passed and no grace period is configured 
When the system checks the application status 
Then the application status must automatically change to "EXPIRED" 
And an Email notification will be triggered automatically to the Applicant about application expiry. 
**Note:** 
**End date is visible in Overview section--> Permission Details** 
**Grace Period configuration is covered in [#177544](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/177544/)** 
**Customer E-mail Notification** 
When the permit is EXPIRED 
Then a Expired Email will be triggered automatically to the applicant.(Configured in Email notification settings) 
**Expired applications are viewable in Customer Portal and BO System** 
Given the application status is "EXPIRED" 
When the Customer or BO User views the application 
Then the application details must be displayed in read-only mode 
And the status must clearly display "EXPIRED" 
**Actions are restricted for expired applications** 
Given the application status is "EXPIRED" 
When the Customer or BO User opens the application 
Then no actions should not be possible 
**UPDATED WORK QUEUE STATE : EXPIRED** 
Audit log entry is created when application expires 
Given the permit's end date has passed 
When the system marks the application as expired 
**Then an audit log entry must be created with:** 

- Event Name: Permit Expired 
- Event Description: The system automatically updated the application status to "EXPIRED" upon reaching the permit end date. 
- Event Category: System configuration 
- Date and Time: Current $timestamp 
- User Role: Role of the User 
- User Name: First name and Last name of the user 
 

 
 
 
** ** 
** **
