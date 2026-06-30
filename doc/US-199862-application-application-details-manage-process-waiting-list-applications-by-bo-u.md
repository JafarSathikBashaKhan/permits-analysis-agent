# US-199862: Application | Application details | Manage & Process Waiting List applications by BO User

| Field | Value |
|-------|-------|
| **ID** | 199862 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Natarajan Arumugam  |
| **Tags** |  |

## Acceptance Criteria

**Manage waiting list applications in BO Manager work queue** 

 
**Pre-Condition : Waiting-List** 

 
  Scenario: Search for application
by reference number 
** ** 
    Given the BO user need to process "Waiting List "Work Queue state applications from Application menu 
    And one or more applications exist in the
waiting list 
    When the BO Use renters a valid
application reference number in the search field 
    Then the system should display the
application matching the entered reference number with respect to the zone 
    And the BO User should be able to invoke the reference number  
     Then BO user is displayed with "Submit to process" and  "Cancel Application" buttons for BO user action 
  
  
  Scenario: Submit a waiting list
application to process 
** ** 
    Given the BO user is viewing a waiting
list application 
    When the BO user invokes "Submit to
Process" button 
    Then the system should display a confirmation
pop-up “Are you sure want to process this application?” with “Submit” and “cancel”
button 
    And once the BO user invokes “Submit”
button then the application moves to “Pending-approval” work queue for further processing 

 
**Current work Queue state : Pending-approval** 
** ** 
** ** 
** **  Scenario: Cancel a waiting list
application 
** ** 
    Given the BO user is viewing a waiting
list application 
    When the BO user invokes "Cancel Application" button 
    Then the system should be able to cancel the waiting list application without  further processing 
**Note**: cancel application Reason capture and email triggering has be captured here as well
 

 

 
 
**Scenario: Cancelled applications are not available for processing** 
Given an application has been marked as "Cancelled" 
When the BO user views the application 
And this cancelled application should be visible in applications menu with respect to the permission type 

 

 
**Scenario: Waiting list Cancelled applications should not be able to reinstate** 
Given an application is in waiting list 
When the BO manager has "Cancelled" the application for some reason 
Then the waiting listed cancelled application should not be able to reinstate by BO 
**Updated work queue : Cancelled** 
 
  
  Scenario: Processing one application
at a time 
  
   Given the BO Manager is on the waiting list
work queue 
    When viewing available actions 
    Then options such as "Submit to
Process" or "Cancel Application" should only be enabled for the
currently selected single application 
    And bulk action options should not be
available or visible 

 
**Event Name: Processing Waiting list application** 
**Event Description:** BO User submits a waiting list application for processing.
**Event Category:** Workflow Action / Status Change
**Application ID:** $ApplicationID
**Date & Time:** $Timestamp
**User Role:** BO user
**User Name:** $UserName 

 
 
**Event Name: Cancelled Waiting list application** 
**Event Description:** BO user cancels a waiting list application without processing it**Event Category:** Workflow Action / Status Change**Application ID:** $ApplicationID**Date & Time:** $Timestamp**User Role:** BO user**User Name:** $UserName
