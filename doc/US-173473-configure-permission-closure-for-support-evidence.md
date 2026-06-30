# User Story 173473: Configure permission closure for support evidence

## Metadata
| Field | Value |
|-------|-------|
| ID | 173473 |
| Type | User Story |
| Title | Configure permission closure for support evidence |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags |  |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a super admin or contract admin 
When in the contract settings (apply) 
Then should have the Permission Closure section 
** 
When in the Permission Closure section 
Then should see the Support evidence with following fields 
 
Support Evidence Grace Period (mandatory)**** 
 
 

- Frequency - It defines how long the system waits when application status in support evidence 
- Period -  It defines the time unit (hour, day, week, month, or year) for the above field 
 
 
 
Closure Permission Period (mandatory)** 

- Frequency - It defines how long the system waits after the application is marked as “Due to be Closed - Support Evidence” before automatically cancelling the permission. 
- Period -  It defines the time unit (hour, day, week, month, or year) for the above field 
 

 
 
**Field validation** 
 
For frequency field should: 

- Accept only positive whole numbers 
- Accept values from 1 to 999 (a maximum of 3 digits). 
- Should not accept decimal values 
 
 
Frequency field should have the default value as 1 
** 
For period field: 
should have the drop down values as  

- Hour 
- Day 
- Week 
- Month 
- Year 
 
 
 
**Example:** 
When a user applies for a permission in the Customer Portal,

And the BO user verifies the application and triggers the action **“Request for Support Evidence,”**

And the application status changes to **“Support Evidence,”**

And the **Support Evidence Grace Period** configured in contract settings is: 

- Frequency = 3 
 
- Period = Days 
 
 
Then the system will wait 3 days from the date the application entered **Support Evidence** status.

If the issue is not resolved within that period,

Then the application status is updated to **“Due to be Closed - Support Evidence.”** 
Now, based on the **Closure Permission Period**: 

- Frequency = 1 
 
- Period = Week 
 
 
Then the system will wait 1 week after the application is marked as **“Due to be Closed - Support Evidence,”**

And if no further action is taken, the system will automatically cancel the permission. 
 
 
 
 
 
Event** 
Event Type/Name: Permission Closure updated 
Event Description: Permission closure support evidence configuration updated in contract settings 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
