# User Story 165048: Experian | Pass score set up

## Metadata
| Field | Value |
|-------|-------|
| ID | 165048 |
| Type | User Story |
| Title | Experian | Pass score set up |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a Super Admin or Contract Admin,** 
 
 
 
When in the contract settings of MNPS,
 
Then an Experian main toggle should be available to enable or disable Experian integration. [Ref story: User Story 162928: Enable Experian Toggle]
 

 
Given the Experian toggle is enabled in MNPS contract settings,
 
Then the Experian score settings should become visible in:
 
The contract settings of Apply, 
and
 
The respective permissions configured under Apply.
 

 
When in Contract setting Apply
 
Then should see section titles as "Experian Vehicle Pass Score" Settings; 
With Comparison operator selection as (Greater Than, Less Than, Equals, Greater Than or Equal To, Less Than or Equal To)
 
And text box to input the score value between 1 to 1000. [Selectable value through increment and decrement arrows] 

 
This section should be enabled only if the Experian toggle is enabled in MNPS contract creation.
 
And
 
Similar setting to be available against permission in Permission set up - > Rules - > Vehicle Settings section [Only if the Experian toggle is enabled in MNPS contract screation] 
And 
To Save and publish a permission this setting is not mandatory 
 

 
By default, the values should be defaulted to "Select" in Operators and 0 in Score. 

 
If both contract settings and permission have the configuration enabled for Experian, the settings configured against the permission should take precedence. 

 
When the score has been set in apply contract settings, capture events as, 
Event Type / Name: Experian Vehicle Pass Score Configured 
Event Description: Experian Vehicle Pass Score Configured 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration 
 

 
References scenarios: **[Not to be included for this story development]
 
Given a customer performs a VRM lookup from the Customer Portal,
 
When a valid score is returned from Experian,
 
Then the score should be:
 
Recorded against the application, and
 
Evaluated using the configured pass/fail logic.
 

 
When an Experian score is returned and recorded,
 
Then the Customer Portal (CT portal) should clearly show:
 
The actual score, and
 
A status flag indicating whether the score is a Pass or Fail, based on the configured thresholds.
 

 
Given a BO (Back Office) user is reviewing an application, 
Then they should be able to: 
View the Experian score flag as Pass/Fail 
And decide to Approve, Reject, or Request Additional Evidence based on the score result.
