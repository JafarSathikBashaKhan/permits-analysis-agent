# User Story 162363: Configure Permission Closure

## Metadata
| Field | Value |
|-------|-------|
| ID | 162363 |
| Type | User Story |
| Title | Configure Permission Closure |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a super admin or contract admin 
When in the contract settings (apply) 
Then should have the Permission Closure section 
** 
When in the Permission Closure section 
Then should see the following fields 
 
Payment Failure Grace Period (mandatory)**** 
 
 

- Frequency - It defines how long the system waits after a payment failure before changing the application status to “Due to be closed.” 
- Period -  It defines the time unit (hour, day, week, month, or year) for the above field 
 
 
 
Closure Permission Period (mandatory)** 

- Frequency - It defines how long the system waits after the application is marked as “Due to be Closed” before automatically cancelling the permission. 
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
 
And the payment fails,
 
And the Payment Failure Grace Period** configured in contract settings: 

- Frequency = 1 
- Period = Week 
 
 
Then the system will wait 1 week from the payment failure date.** 
If the payment is not resolved within that period,
 
Then the application status is updated to "Due to be Closed". 
Now, based on: Closure Permission Period**  

- Frequency = 2 
- Period = Days 
 
 
Then the system will wait 2 additional days after the application is marked as Due to be Closed,** 

And if no further action is taken, it will automatically cancel the permission. 
 
 
 
 
Event** 
Event Type/Name: Permission Closure updated 
Event Description: Permission closure configuration updated in contract settings 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
