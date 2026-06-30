# US-173274: Application | Application Details | Start/Begin review Button

| Field | Value |
|-------|-------|
| **ID** | 173274 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**** 
**** 
**** 
**** 
**Initiate Review of Application**

 
**  Background:**
 

 
    Given a BO user is logged into the system
 
    And has permission to review applications
 
    And an application is in "**Pending Approval**" state
 

 
**Pre-condition** 

 
**Current state : Pending-approval** 
If the Application doesn't have Work items assignment process, then it requires a "Begin Review" button , for Manual assigned application. 

 
**BO initiates review If Application is assigned ** 

 
    Given application is in "Pending-approval" state, 
    When the BO opens the application, "Begin Review", Should be visible
 
    And clicks the "Begin Review" button
 
    Then the system should change the application status to "In-Progress"
 
    And applicant is notified with a auto-email (Configured in Email template) - New notification template for "Application In-progress" has to be defined in settings. 

 
Once Begin Review started application will move to** work queue state : In-Progress** 

 
 

 
- **Event Name:** Application Review Initiated 
 
- **Event Description:** A BO user initiated the review process for an application. 
 
- **Event Category:** Application Processing 
 
- **Date and Time:** $Current timestamp 
 
- **User Role:** BO User 
 
- **User Name:** First name and Last name of the BO user
