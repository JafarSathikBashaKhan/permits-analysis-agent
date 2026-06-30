# User Story 177544: Grace period for expired permission

## Metadata
| Field | Value |
|-------|-------|
| ID | 177544 |
| Type | User Story |
| Title | Grace period for expired permission |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags |  |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Given a user with the role of Super Admin or Contract Admin,** 
When the user navigates to the “Renewal & Reminder” settings,
 
Then they should see a “Permission Renewal” option with an Enable/Disable toggle. 

 
The default state of the toggle is Disabled. 

 
When enables the Permission Renewal toggle,
 
Then the following options should be displayed: 

- Renewal Before Expiry **(label has been updated as per existing story). Help Text: "Number of days before the permit expires when renewal becomes available." 
- **Grace Period After Expiry **Help Text: "Number of days after expiry when renewal is still allowed." 
 
 
**Grace Period after expiry** 

- Frequency: Numeric input between 1–30 
- Period: Fixed as Days 
 
 
**Email & SMS Configuration** 
When the user navigates to the Email & SMS Configuration section,** 
Then the system should allow configuration of 3 reminders with the following fields: 

- Frequency: numeric input dynamically limited based on the Grace Period for Expired Permission 
- Period: dropdown with options Hours, Days (Weeks should not be selectable) 
 
 
Rules for Reminder Configuration** 
The Email & SMS reminders should be automatically calculated based on the Grace Period for Expired Permission. 
**Examples:** 
Grace period for expired permission= 3 days 

- If Period = Days: Frequency input allowed = 1–3 
- If Period = Hours: Frequency input allowed = 1–72 
- Weeks cannot be selected as a period.** 
 
 
The system should prevent entering a frequency larger than the total grace period in the selected unit. 
The reminders should automatically adjust according to the grace period to ensure timely notifications. **
