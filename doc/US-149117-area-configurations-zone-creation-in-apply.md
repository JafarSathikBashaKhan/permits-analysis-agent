# User Story 149117: Area Configurations | Zone creation in apply

## Metadata
| Field | Value |
|-------|-------|
| ID | 149117 |
| Type | User Story |
| Title | Area Configurations | Zone creation in apply |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

Given a super admin/contract admin
When in the zone list screen
Then should have the button to create zone
**
When invoke the appropriate button
Then should have mandatory** field

- Zone Name - Alphanumeric fields should accept 100 characters including special characters

**Error**
When zone name that already exists
Then should displayed "Zone name already exists". **


Create**
When filled the mandatory field
Then the button to create zone should be invokable
**
When invoke the button to create zone
Then should appear toaster message as 'Zone created successfully'


When zone is created
Then the status should marked as 'Draft'


Cancel**
When invoke the button to cancel
Then should see the pop up 'Are you sure you want to cancel?' with Yes and No buttons
**
Yes - Close the form without saving
No - Return to the form


Audits/Events**:
Event Type / Name: Zone created.
Event Description: "Zone name" created Successfully.
Date and Time: $CurrentTimestamp
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
User Name: $FirstName $LastName of the user who performed the action.


Note: Earlier, the zone was created in MNPS and consumed in Apply, but now the creation is implemented directly in Apply.
