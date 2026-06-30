# User Story 151215: Configure Temporary Vehicle Days

## Metadata
| Field | Value |
|-------|-------|
| ID | 151215 |
| Type | User Story |
| Title | Configure Temporary Vehicle Days |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a super admin or contract admin 
When in the contract settings (apply) 
Then should have the Temporary vehicle section 
** 
When in the vehicle section 
Then should see the following fields 
Temporary Vehicle Validity** 

- Frequency - It defines how long a temporary vehicle stays linked to a permit before being automatically removed by the system. 
- Period -  It defines the time unit (hour, day, week, month, or year) that determines how long a temporary vehicle remains valid. 
 
**Temporary Vehicle Add Limit****
- Frequency - It defines the length of the time period for adding temporary vehicles. 
- Period - It defines the time period (hour, day, week, month, or year) during which users can add a limited number of temporary vehicle 
- Number of Temporary Switches -It defines how many times a user can add temporary vehicles within the add limit.
 
 
 
 
When configuring the Temporary Vehicle Validity and Temporary Vehicle Add Limit sections: 
Frequency Field:** 

- Should accept only positive whole numbers. 
- Valid values range from 1 to 500. 
- Decimal values are not allowed. 
 
 
**Period Field:** 
Should provide the following dropdown options: 

- Hour 
- Day 
- Week 
- Month 
- Year 
 
 
 
**Number of Temporary Switches
** 

- Should accept only positive whole numbers. 
- Valid values range from 1 to 500 (maximum 3 digits). 
- Decimal values are not allowed. 
 
 

 
**Example:** 
 
 
**Temporary Vehicle Validity:** 
 
If the frequency is set to 1 and the period is set to week,** 
Then the system should allow the temporary vehicle to remain valid for 1 week. 

 
Temporary Vehicle Add Limit:** 
If the frequency is set to 1 and the period is set to year, 
 
And the number of temporary switch is set to 5 
Then the system allows 5 switches in 1 years, you can change your temporary vehicle up to 5 times during that 1 year period.** 

 
 
Error** 
 
When a mandatory field is left empty,** 
Then the system should display the error message: "This field is required." 
 
 
Event** 
Event Type / Name: Temporary Vehicle Settings Updated 
Event Description: Temporary vehicle validity/add limit updated in contract settings 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
