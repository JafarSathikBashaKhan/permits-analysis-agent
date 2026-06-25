# User Story 161638: Configure Expiration of Supporting Documentation

## Metadata
| Field | Value |
|-------|-------|
| ID | 161638 |
| Type | User Story |
| Title | Configure Expiration of Supporting Documentation |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a super admin or contract admin 
When in the contract settings (apply) 
Then should have the document section 
** 
When in the document section 
Then should have the fields 
Expiration Duration** 

- Frequency - It defines** **how long a document uploaded during the application process **(while applying for a permission)** remains valid in the system. 
- Period -  It defines the time unit (hour, day, week, month, or year) that determines how long a support document remains valid. 
 
When in the frequency field 
 
Then the system should: 

- Accept only positive whole numbers 
- Accept values from 0 to 999 (a maximum of 3 digits). 
- Should not accept decimal values 
 
 
When in the period field 
Then should have the drop down values as  

- Hour 
- Day 
- Week 
- Month 
- Year 
 
 
**Example** 
 
 
When the field "frequency" is set to 1 
And the field "period" is set to Year 
If the user initiates a renewal of the permission after the 1-year period has passed 
Then the system should prompt the user with a message in the customer portal indicating that the uploaded document has expired 
And the system should allow the user to upload a new document during the renewal process 
** 
Event ** 
Event Type / Name: Document Expiration Settings Updated 
Event Description: Document Expiration frequency/period updated in contract settings 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
