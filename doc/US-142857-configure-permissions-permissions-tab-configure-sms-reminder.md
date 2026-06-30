# User Story 142857: Configure Permissions | Permissions Tab | Configure SMS Reminders

## Metadata
| Field | Value |
|-------|-------|
| ID | 142857 |
| Type | User Story |
| Title | Configure Permissions | Permissions Tab | Configure SMS Reminders |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Pre-requisite**: SMS reminder fields are shown **only
if the contract has SMS enabled**. [#143071](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/143071/)  
** 
Given a Super admin / Contract admin, 
When in the Renewals and Reminder section, 
Then should be able to enable or disable SMS Reminders. 

 
When enabled in contract and want to set SMS reminder, 
Then should be able to set multiple reminders upto 6. 

 
When has already added 6 reminders,
When tries to add another,
 
Then should be restricted. 

 
When want to configure reminder, 
Then the Period drop-down options should include:
 

- Weeks 
- Days 
- Months 
- Hours 
- Minutes 
 
Weeks**** 
When the Period is set to "Weeks",
 
Then the Frequency field should accept values from 1 to 100,
 
And should restrict input above 100.
 

 
Days**** 
When the Period is set to "Days",
 
Then the Frequency field should allow values from 1 to 1000,
 
And restrict values above 1000.
 

 
Months**** 
When the Period is set to "Months",
 
Then the Frequency field should allow values from 1 to 50 only.
 

 
Hours**** 
When the Period is set to "Hours",
 
Then the Frequency field should accept values from 1 to 24.
 

 
Minutes**** 
When the Period is set to "Minutes",
 
Then the Frequency field should accept values from 1 to 1000.
 

 
Disable Reminder Fields** 
Given the admin has enabled and configured the reminders, 
When the checkbox is unchecked (disabled),** 
Then both Frequency and Period fields should become disabled,
 
And any previously entered values should be cleared.
 

** 
**Save as Draft Without Reminder Period**
 
Given the admin has enabled any of the reminder checkbox,
 
When the admin attempts to save the permission as a Draft without entering Frequency or Period,
 
Then the permission should be saved successfully
 
And no validation error should appear for those fields.
