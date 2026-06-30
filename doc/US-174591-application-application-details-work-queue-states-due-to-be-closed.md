# US-174591: Application | Application Details | Work Queue States | Due To Be Closed

| Field | Value |
|-------|-------|
| **ID** | 174591 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Natarajan Arumugam  |
| **Tags** |  |

## Acceptance Criteria

**Pre-condition : Application in "Payment-Failed" state  [#162363](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/162363/) ** 
**                        ****                        Application in "Request Further evidence" state  [#173473](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/173473/) ** 
                         
 
Considering above two cases: 

 
Given an application is approaching its grace period configured in settings for payment completion / document submission that is requested
When the system checks the for the latest status of the application 
Then the application status should be updated to “Due To Be Closed” once the grace period crossed
 
And application will wait for Closure date configured 

 
**Updated work queue state : Due to be closed** 

 
When the closure date configuration is reached (configured in settings) 
Then the application should be cancelled  
And the application status should be changed to "Cancelled" state 

 
**Updated work queue state : Cancelled**
 

 
**Note : ** 

 

 
configuration is covered in **[#162363](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/162363/)** 

  [#173473](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/173473/)  

 
FIGMA : [https://www.figma.com/proto/76fXcgYWbmwEhu8Z0cgrjZ/Permission-System?page-id=1158%3A71545&node-id=3515-73515&viewport=-1163%2C0%2C0.42&t=csWjAzl8Ngq04PvF-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=3515%3A73515](https://www.figma.com/proto/76fXcgYWbmwEhu8Z0cgrjZ/Permission-System?page-id=1158:71545&node-id=3515-73515&viewport=-1163%2c0%2c0.42&t=csWjAzl8Ngq04PvF-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=3515:73515) 

 

 
**Event Name:** Application State Updated to
Due To Be Closed 
**Event Description:** Application automatically moved to “Due To Be
Closed” due to SLA threshold and pending payment/documents.
**Event Category:** Auto – State Transition
**Application ID:** $ApplicationID
**User Role:** System user
**User Name:** System user
**Date & Time:** $Timestamp 
  
  
Event Name: Application
Cancelled Automatically 
**Event Description:** Application moved from “Due To
Be Closed” to “Cancelled” as pending items were not completed within SLA.
**Event Category:** Auto – Cancellation
**Application ID:** $ApplicationID
**User Role:** System user
**User Name:** System user
**Date & Time:** $Timestamp
