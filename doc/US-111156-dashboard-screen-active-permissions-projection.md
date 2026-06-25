# US-111156: Dashboard screen | Active Permissions Projection

| Field | Value |
|-------|-------|
| **ID** | 111156 |
| **Type** | User Story |
| **Module** | Dashboard |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | southend |

## Acceptance Criteria

Display of Counts
 
 
 
 
 
Given the user is on the Permissions Dashboard, 
When the dashboard loads, 
Then the system must display the total count of active permissions grouped by permission type. (Work Queue Status: **Active**) 

 
**Separate Representation**
 
Given multiple permission types exist in the system, 
When the dashboard loads, 
Then each permission type must be represented separately with its corresponding active count (e.g., Permits – 120, Licensing – 85). 

 
**Contract Specific**: 
When the dashboard is viewed, 
Then should only see the data specific to the selected contact. 

 
**Projection Format Flexibility**
 
Given the system needs to show active permission counts
  
When the dashboard is rendered
  
Then the count should be displayed in a tile, card, or equivalent projection as per UX design recommendations.
  

 
**Real-Time Refresh**
 
Given an active permission is added, updated, or expired
 
When the dashboard is refreshed or filters are applied
 
Then the count should reflect real-time data without delay.
 

**Data Accuracy**
 
Given there are active permission records in the database
 
When the dashboard count is compared to the database
 
Then the number displayed must match the total number of active records for each type.
 

 
**Empty State Handling**
 
Given no active permissions exist for a particular type
 
When the dashboard loads
 
Then the system should display “0” for that permission type instead of leaving it blank.
 

 
**Accessibility Requirement**
 
Given the dashboard is viewed by users of any role
 
When the counts are displayed
 
Then all users must see the same counts, ensuring consistent visibility across roles. 

 
Trend Comparison Basis
Given the system displays active applications count for each permission type (Permit, Suspension, License, Exemptions, Taxi Card),
 
When the dashboard loads,
 
Then the system must compare the current month’s active count with the previous month’s active count to determine the trend.
 

 
Incremental Indicator
 
Given the current month’s active applications count is higher than the previous month,
 
When the trend is calculated,
 
Then the system must display:
 
A “+X%” indicator in green,
 
Along with an upward arrow icon (&#128200;),
 
And the caption “from last month.”
 

 
**Decremental Indicator**
 
Given the current month’s active applications count is lower than the previous month,
 
When the trend is calculated,
 
Then the system must display:
 
A “-X%” indicator in red,
 
Along with a downward arrow icon (&#128201;),
 
And the caption “from last month.”
 

 
**No Change Indicator**
 
Given the current and previous month’s active application counts are equal,
 
When the trend is calculated,
 
Then the system must display:
 
A “0%” indicator in neutral (grey) color,
 
With a horizontal arrow (→) or no arrow,
 
And the caption “no change from last month.”
