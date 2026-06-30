# User Story 132390: Configure Permissions | Permissions Tab – Overview | Start Date Settings

## Metadata
| Field | Value |
|-------|-------|
| ID | 132390 |
| Type | User Story |
| Title | Configure Permissions | Permissions Tab – Overview | Start Date Settings |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Given the Super admin / Contract admin user,** 
 
 
 
When selects the Overview sub menu or section of Permissions tab,
 
Then should be able to define the permissions settings for the already selected permission type. 

 
When in the general settings sub section,
 
Then should see the first grouped section as “Start Date Settings” (May be heading). 

 
When in the ‘Start date settings’ sub section or group,
Then should see the fields as 
 
•	Start Date Policy ('Start Date Choosing Method') - Mandatory 
•	Include Time - Check box
 
• Start Date Delay ('Start Date in Buffers') - Mandatory Numeric field should have the limitation 0 - 100 and the default value is set to 0. 

 
When in the 'Start Date Choosing Method' 
 
Then should have the drop down with the data are listed below 

- Issue Now 
- Backdated to Start of the Month 
- Backdated to Start of the Application 
- Forward to Set Date 
 
 
When the user selects 'Issue Now' as the start of the
application, 

Then the system should set the start date to the approval date recorded in BO. 

 
When the user
selects 'Backdated to Start of the Month' as the start of the application,
 

Then the system should set the application start date from the start of the month. (1st calendar day of the month) 

 
When the user
selects 'Backdated to Start of the Application' as the start of the
application,
 

Then the system should set the start date to the date the application was
submitted in the system. 

 
When the user
selects 'Forward to Set Date' as the start date of the application,
 
And the Start Date Delay** field, **Include time** check box should enabled 

Then should enable the calendar picker to select a custom start
date in the **customer portal.** 
** 
When 'Include Time' checkbox is checked 
Then should select the time below the calendar picker. 
And then the application start based on the selected date and time. 

 
 
For Example:  
If the Start Date Delay is set to 0,
 
Then the calendar picker should allow selecting today's date. 

 
 
If the Start Date Delay is set to 1,
 
Then the calendar picker should not allow selecting today's date,
 

but should allow selecting tomorrow's date onwards. 

 
If the Start Date Delay is set to n,
 
Then the calendar picker should allow selecting dates starting from today + n days. 

 
Note**: 
The date setting reflection in the customer portal can be tested once the Customer portal is done.
