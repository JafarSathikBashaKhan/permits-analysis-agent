# User Story 163636: Area | Zone | Configure Non Enforceable Time

## Metadata
| Field | Value |
|-------|-------|
| ID | 163636 |
| Type | User Story |
| Title | Area | Zone | Configure Non Enforceable Time |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags |  |
| Module | Area |

---

## Acceptance Criteria

****
**Prerequisite:** When 'Hours of Operation' is enabled in the Permission Builder, the Non-Enforceable Time configuration is applicable for the permission**


Navigation:** **Zone> Zone name**
**
Given a Super Admin or Contract Admin,

When they navigate to the 'Non-Enforceable Time' tab for the first time,

Then they should see the days from Monday to Sunday listed, each showing No time configured next to the day (configuring time is optional**),**
And should have the option to edit.


When the Edit button is clicked,

Then the days Monday to Sunday** should each have a checkbox,
And a time field should be available for each day.
**
When a day’s checkbox (e.g., Monday) is selected,

Then the corresponding time fields should become active for selecting time.


When a day’s checkbox is unselected,

Then the corresponding time fields should be disabled and show the placeholder No Time Configure**d.
**
When a day’s checkbox is selected,

And time is configured in the time fields,

And the checkbox is then unselected before saving,

Then the time fields should be disabled and show the placeholder No Time Configured**.
**
Time Fields**
When a day is selected,
Then selecting both a start time and an end time is mandatory.
The time fields should use a time picker control.
**
Validation Rules**
The From Time must be earlier than the To Time.
If only one day is selected, only one time range should be configured.
If multiple days are selected, each day should allow one independent time range to be configured.
**
**
**Save Action****
When the Save button is clicked,

Then the system should save the configured non-enforceable times.


The configured non-enforceable times should then be displayed on the Non - enforceable time tab screen.


If no time is configured for a day, it should be displayed as **'No Time Configured'**.


'Hours of operation' enabled in the permission builder> general settings**
When 'Hours of operation' is enabled for the permission mapped this zone
Then the 'Non - Enforceable Time' configured in the zone should save to the illumin8
If the illumin8 toggle is enable in the contract settings
**
Impact:**
No enforcement should happen during the saved non-enforceable times, regardless of whether a permit is valid or not.**


Enforcement Scenario – Zone A (Non-Enforceable Hours: Mon–Fri, 8:00 AM – 6:00 PM) & 'Hours of operation' enabled for resident permission**
Scenario 1: Vehicle Parks at 9:00 AM on Tuesday
Day/Time: Tuesday, 9:00 AM
Zone Settings: Non-enforceable hours are active (8:00 AM – 6:00 PM)
Permit Status: Not checked
**Outcome:**

- Since the vehicle is parked within non-enforceable hours,
- No enforcement action should be taken, regardless of whether the vehicle has a valid permit.
- The handheld device should indicate "Non-Enforceable Period – No Action Required".


**Scenario 2:** Vehicle Parks at 7:30 PM on Thursday
Day/Time: Thursday, 7:30 PM
Zone Settings: Outside non-enforceable hours (enforcement is active)
Permit Status: Permit not found
**Outcome:**

- The vehicle is parked during enforceable hours,
- The handheld device does not find a valid permit,
- A PCN (Penalty Charge Notice) should be issued.


**Scenario 3:** Vehicle Parks at 10:00 AM on Saturday
Day/Time: Saturday, 10:00 AM
Zone Settings: Non-enforceable hours apply only Monday to Friday
Permit Status: Permit not found
**Outcome:**

- Since Saturday is outside the configured non-enforceable days,
- The time is considered enforceable,
- A PCN should be issued if no valid permit is found.
