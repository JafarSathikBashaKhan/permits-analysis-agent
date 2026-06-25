# US-165516: System Audits List Screen | Filter Option

| Field | Value |
|-------|-------|
| **ID** | 165516 |
| **Type** | User Story |
| **Module** | System Audit |
| **State** | Done |
| **Assigned To** | Karthikeyan RR  |
| **Tags** |  |

## Acceptance Criteria

Date Range Filter
 
 
 
Given a **Super admin / Contract admin** is on the System Audits screen,
 
When they apply a date range using the calendar picker,
 
Then only audit events within the selected date range should be displayed. 

 
Predefined Ranges
Given the user opens the date picker,
 
When they click on predefined options (e.g., Last 7 Days, Last 30 Days, This Month),
 
Then the date range should auto-populate and display matching results. 

 
Cancel Option in Calendar
Given the user opens the date picker,
 
When they click Cancel,
 
Then no changes should be applied, and the previous filter (if any) should remain active. 

 
Apply (OK) Button Behavior
Given the user selects a valid date range,
 
When they click OK,
 
Then the selected range should apply and update the audit results immediately. 

 
Calendar Default State
Given no filter is applied,
 
When the user opens the date picker,
 
Then the default selection should be blank.
 

 
**Single Column Filter**
 
Given a user is on the System Audits screen,
 
When they filter by a column (e.g., User Role, User Name, Event Type),
 
Then the results must match the applied filter condition (equals logic as applicable).
 

 
**Multi-Level Filters (Date + Other Criteria)**
 
Given a user has applied a date range filter,
 
When they apply an additional filter (e.g., User Role, User Name, Event Type),
 
Then only events matching both conditions should be displayed.
 

 
**Multiple Column Filters**
 
Given a user is on the System Audits screen,
 
When they apply filters on more than one column (e.g., Date Range + User Role + User Name),
 
Then the list should reflect the intersection of all applied filters.
 

 
**Clear Filters Option**
 
Given filters are applied on the System Audits screen,
 
When the user clicks the Clear Filters option,
 
Then all filters should be reset, and the full unfiltered audit list should display.
 

 
**Filter Persistence During Session**
 
Given a user has applied filters,
 
When they navigate within the System Audits screen or refresh the list,
 
Then the applied filters should remain active until cleared manually.
 

 
**Default State**
 
Given the System Audits screen is loaded,
 
When no filter is applied,
 
Then the list should show all events in reverse chronological order by default. 

 
Filter Combination Validation
Given multi-level filters are available,
 
When the user applies invalid combinations (e.g., mutually exclusive values),
 
Then the system must handle gracefully by showing “No Records Found” (instead of error).
 

 
**_Calendar Picker Restriction_** 
End Date Restriction
Given a **Super admin / Contract admin** selects a start date,
 
When they try to pick an end date earlier than the start date,
 
Then the calendar should restrict selection of invalid earlier dates (greyed out / disabled).
 

 
**Start Date Restriction**
 
Given a user selects an end date,
 
When they try to pick a start date later than the end date,
 
Then the calendar should restrict selection of invalid later dates.
 

 
**Maximum Range Restriction** 
Given a maximum allowed date range is 6 months,
 
When the user selects a start date,
 
Then the calendar should restrict end dates beyond the maximum range of 6 months.
 

 
**Future Dates Restriction**
 
Given today’s date is the maximum valid date,
 
When the user opens the calendar picker,
 
Then all future dates should be disabled.
 

 
**Valid Range Default**
 
Given the user opens the date picker,
 
When they select a valid start and end date,
 
Then the system should allow applying the filter without additional validation prompts.
 

 
Clear Date Range
 
Given a date range is selected,
 
When the user clicks Clear Date Range,
 
Then the selection should reset and show all audit records. 

 
Filter Icon Indicator
Given filters are applied (date or column),
 
When the user returns to the System Audits screen,
 
Then the filter icon should visually indicate active filters.
