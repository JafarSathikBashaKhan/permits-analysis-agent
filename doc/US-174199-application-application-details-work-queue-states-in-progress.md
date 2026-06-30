# US-174199: Application | Application Details | Work Queue States | IN PROGRESS

| Field | Value |
|-------|-------|
| **ID** | 174199 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**** 
**_Pre-Condition:_** 
******** 
****Work Queue State:**** 
******** 

- ****Application submitted -->Pending-approval****  
- ****Evidence Provided**** 
**** **** 
  

 
****BO user starts review of application **** 
 
Given Application is submitted for a Permission 
When the BO User logs in and invoke on any of the Permissions types 
Then BO user should be able to select any application and triggers the "Begin review" button on the application  
 
And the application status should change to** "In-Progress" **
 

 
**BO User views the current work queue state in Permission Details page and in Overview sections ****which is covered in [#169334](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/169334/) **    
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
******** 

 
****_Current Work Queue State:_**** 
Application submitted -->Pending-approval**-->In-Progress** 

 
**Email notification when application status changes to In-Progress** 
Given a task is assigned to a BO User 
When the BO User triggers the review action on the application 
Then the application status should change to "In-Progress" 
And an email notification should be sent to the applicant informing them about the application submitted has been started review by back office team 

 
**BO User manages an application in In Progress status (Possible Actions of BO)** 
Given the application is in "In- Progress" state 
Then BO user should be able to do any of the following actions with respect to the application by selecting the respective buttons 

- Approve application 
 
- Reject application 
 
- More Actions 
 
- Request Customer Information 
 
- Request Supporting Evidence, 
 
- Internal Referral 
 
- Postpone application 
 
 
Then upon Selection respective status get updated 
****
