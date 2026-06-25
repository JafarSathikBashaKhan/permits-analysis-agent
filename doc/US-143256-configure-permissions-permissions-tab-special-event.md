# User Story 143256: Configure Permissions | Permissions Tab | Special Event

## Metadata
| Field | Value |
|-------|-------|
| ID | 143256 |
| Type | User Story |
| Title | Configure Permissions | Permissions Tab | Special Event |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

"**Special Event**" radio button must be enabled in **General Settings** of permission setup. (Permission setup -> Builder -> Overview -> General Settings -> Special Event Enabled) 
** 
Given a Super admin and Contract admin, 
When has the "Special Event" radio button enabled in the General settings of permission setup (Permission setup -> Builder -> Overview -> General Settings) 
 
When navigates to the "Permissions" tab,
 
Then should see a new menu/section labeled "Special Event". 

 
When the 'Special event' radio button is enabled in general settings, 
Then 'Special Event' section should be shown. (Feasibility needs to be checked) 
 

 
When the 'Special event' radio button is disabled in general settings, 
Then 'Special Event' section should be hidden. (Feasibility needs to be checked) 

 
When in the 'Special Event', 
Then should be able to configure the operational criteria for the special event. 

** 
**Display of Input Fields
**Given I am in the Special event section,** 
When the section is expanded,
 
Then the following UI elements should be present: 
Duration (calendar picker)
 
Days (multi-select drop-down with "All Week days") - Week days should be shown dynamically based on selected dates duration. (Check the dates and then the days falls on that and show them) 
Time (time picker)
 
Delete icon (to delete a configuration set). 

 
UI Input Validations**** 
Given I select a Start Date and End Date,
 
When the Start Date is after the End Date,
 
Then the system should show a validation error (e.g., "Start date cannot be larger than end date").
 

 
Given I select a From and Until time,
 
When the From time is later than Until time,
 
Then a validation message should appear (e.g., "Start time must be before end time").
 

 
Given I try to save the configuration,
 
When no day is selected from the drop-down,
 
Then the system should prompt with an error like "At least one day must be selected".
 

** 
**Add** 
Given one set of Start Date, End Date, Day(s), and Time is entered,** 
When I click "Add Timing",
 
Then a new empty timing block should appear below the current one, replicating the same field structure.
 

 
Given multiple timing blocks are added,
 
When I click the delete icon on any block,
 
Then that timing entry should be removed from the view. 

 
Add Event**: 
When want to add multiple special events, 
Then should be able to add multiple special events upto 15. 
**
** 
**Validation – Overlapping Time Ranges (Same Day)
**Given I have added a timing block for one or more days with a specific time range (e.g., Saturday: 1:00 PM–3:00 PM),** 
When I attempt to add another timing block for the same day(s) with an overlapping time range (e.g., Saturday: 2:30 PM–4:00 PM),
 
Then the system should show a validation error message: "Time range overlaps with an existing entry for the same day." 

 
Partial overlaps (e.g., Block 1: 10:00 AM–12:00 PM, Block 2: 11:30 AM–1:00 PM) must trigger the validation.
 
Exact time matches (e.g., Block 1 and Block 2 both from 2:00 PM–4:00 PM) must also trigger the validation.
 
Back-to-back ranges (e.g., Block 1: 1:00 PM–2:00 PM, Block 2: 2:00 PM–3:00 PM) should not trigger the validation. 

 
Validation - Date Range Overlapping** 
Date range overlapping should also be restricted with error message. 
** 
Duplicate Timing Block
**Given I am in the Special Event section of the Permissions tab, 
When a timing block is already configured with values (Duration, Days, Time) 
Then I should see a “Duplicate” or “Copy” icon/button within that timing block.** 

 
Given I click the “Duplicate” icon/button on a timing block,
 
When the action is triggered,
 
Then a new timing block should be inserted below the original one,
 
And it should be pre-filled with the same values as the original block (Duration, Days, Time).
 

 
Given the duplicated timing block is added,
 
When I need to modify any of the values (e.g., changing a time or date),
 
Then each field in the duplicated block should be fully editable like a normal entry.
 

 
Given multiple timing blocks exist (including duplicates),
 
When I click Delete on any block,
 
Then only the selected block should be removed, with no effect on the others. 

 
Atleast 1 Configuration is Mandatory**: 
When special event is enabled, 
Then atleast one configuration is mandatory for publishing. (Save as draft, mandatory field) 
** 
 
 
Note**:  
Duplicate option can be disabled if the allowed limit of 15 is reached. 
Remove button should be shown only when there are more than 1 events. If there is only one event, then remove button should not be shown. 
Mandatory validations can only be done at the time of implementing 'Publish' story.
