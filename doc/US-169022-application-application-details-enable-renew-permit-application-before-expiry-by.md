# US-169022: Application | Application Details | Enable "Renew "Permit Application before Expiry (By BO)

| Field | Value |
|-------|-------|
| **ID** | 169022 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**_Renewal of Permit Application by BO_** 
**Pre-Condition : ACTIVE** 
**Scenario: Automatic notification to applicant before permit expiry** 
Given a permit application is in "Active" status 
And the expiry date is within the renewal window configured in system settings  
When the system checks for expiring permits 
Then an email notification should be sent automatically to the applicant (based on reminders sent from config settings) 

 
Configuration is covered in [#142840](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/142840/) 
 
 
 
 
 
 
 
 
 
 
 

 
**Scenario: BO User sees Renew button for expiring application** 
Given a permit application is in "Active" status 
And the expiry date is within the renewal window configured in system settings 
When a BO User views the application 
Then the "Renew" button should be visible and enabled for User selection 

 
**Scenario: BO User initiates renewal upon applicant request** 
Given a permit application is in "Active" status 
When Applicant requests BO for renewal 
Then the BO User should be able to proceed "Renewal"  
**Note:** Renewal part will be covered in story 
**Scenario: Renewal not available outside configured window** 
Given a permit application is in "Active" status 
And the expiry date is not within the renewal window configured in system settings 
When a BO User views the application 
Then the "Renew" button should not be visible or enabled 

 
**Audit Log/ Events to be captured for Renewal initiation** 

- **Event Name:** Renew Permit 
- **Event Description:** BO User initiated renewal process for a permit application that is expiring. 
- **Event Category:** Configuration 
- **Date and Time:** Captured automatically by system 
- **User Role:** BO User 
- **User Name:** Captured from logged-in user
