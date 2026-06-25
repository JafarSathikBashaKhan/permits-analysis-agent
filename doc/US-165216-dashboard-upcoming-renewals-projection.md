# US-165216: Dashboard | Upcoming Renewals Projection

| Field | Value |
|-------|-------|
| **ID** | 165216 |
| **Type** | User Story |
| **Module** | Dashboard |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | southend |

## Acceptance Criteria

Chart Display
 
 
 
Given the user is on the dashboard,
 
When the “Upcoming Renewals” section loads,
 
Then a line chart must display upcoming renewal counts grouped by permission type (e.g., Permit, Suspension, License, Exemptions, Taxi Card). 

 
**Upcoming Renewals Condition or Eligibility:** 
Active Status Validation
Given an application,
 
When the system evaluates applications for upcoming renewals,
 
Then only applications with Status = Active should be considered.
 

 
**End Date Eligibility Check**
 
Given an active application,
 
When the system compares the End Date with the Current Date,
 
Then the End Date should be equal to or less than the Current Date for the application to be eligible for upcoming renewal.
 

 
**Color Distinction** 
Given multiple permission types exist,
 
When displayed in the chart,
 
Then each permission type must appear as a distinct colored line with a corresponding legend. 

 
Time Range Filter
Given the default time range filter is set to “Next 7 Days,” 
When the dashboard loads,
 
Then the chart must show only renewals due Next 7 days. 

 
Given the user selects "Next 30 Days,”
 
When the filter option is changed,
 
Then the chart must refresh dynamically to display renewal data corresponding to the selected time range. 

 
Hover and Tool tip Interaction
Given the user hovers over any data point,
 
When the hover occurs,
 
Then a tooltip must display the permission type, renewal count. 

 
Drill-Down Behavior
Given the user clicks a data point for a permission type,
 
When drill-down is supported,
 
Then the system must display a list of renewal applications for that type with the below mentioned columns. (Based on the conditions) 
Reference Number
 
Permission Group 
VRM 
Work Queue Status - (Active filter applied) 
Applicant Name 
Address 
Post Code 
Applied On 
Start Date
 
Expiry Date 

 
Given the user lacks permission to view that renewal type,
 
When attempting to drill down,
 
Then should be restricted from drill down. 

 
Summary Display
Given the chart displays data,
 
When it loads successfully,
 
Then a text summary below the chart must show:
 
“Total Upcoming Renewals – [calculated count based on filter range]”
 

 
**Data Consistency and Auto-Refresh**
 
Given renewal data is updated (new renewals or extensions),
 
When the dashboard auto-refreshes,
 
Then the chart and total renewal count must automatically reflect the updated values.
 

 
**Empty State**
 
Given no renewal data exists for the selected time range,
 
When the chart loads,
 
Then a message must be displayed:
 
“No upcoming renewals found for the selected period.”
