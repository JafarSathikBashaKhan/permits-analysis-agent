# User Story 187109: "Count of Vehicles allowed" Field inclusion

## Metadata
| Field | Value |
|-------|-------|
| ID | 187109 |
| Type | User Story |
| Title | "Count of Vehicles allowed" Field inclusion |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | new |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Given a Super Admin or Contract Admin is in** 
Permission Builder → Rules → Vehicle Settings, 

 
When the “Multiple Vehicles Allowed” radio button is enabled,
 
Then the field “Count of Vehicles Allowed” should be displayed. 
The Count of Vehicles Allowed field should accept numeric values only, with a maximum length of 100 values. 

 
When the “Multiple Vehicles Allowed” radio button is disabled,
 
Then the field “Count of Vehicles Allowed” should not be displayed. 

 
Customer Portal Behavior** 
Given a permission has Multiple Vehicles Allowed enabled
 
And the Count of Vehicles Allowed is set to 10, 
Then the system should allow the applicant to add up to 10 vehicles under that single permission during the purchase process. 

 
When the applicant attempts to add more than the allowed limit (10),
 
Then the system should display an appropriate error message shown in the application form
