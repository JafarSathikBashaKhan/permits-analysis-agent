# User Story 142840: Configure Permissions | Permissions Tab | Enable and Configure Permissions Renewal

## Metadata
| Field | Value |
|-------|-------|
| ID | 142840 |
| Type | User Story |
| Title | Configure Permissions | Permissions Tab | Enable and Configure Permissions Renewal |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Show Renewals and Reminder Menu
** 
Given a Super admin / Contract admin,** 
When in the Permissions tab,
 
Then should see a menu named "Renewals and Reminder".
 

 
Permission Renewal**** 
Enable and Show Renewal Activation Period Fields
 
Given the Super admin / Contract admin is on the Renewal & Reminder Settings section of the Permission Setup,
 
When enables the Renewal checkbox,
 
Then should be able to configure the Renewal Activation Period using two fields:
 

- Frequency (numeric input field – appears first) 
- Period (drop-down – appears second) 
 
Period drop-down options should include:
 

- Weeks 
- Days 
- Months 
- Hours 
- Minutes 
 
Weeks
 
When the Period is set to "Weeks",
 
Then the Frequency field should accept values from 1 to 100,
 
And should restrict input above 100.
 

 
Days
 
When the Period is set to "Days",
 
Then the Frequency field should allow values from 1 to 1000,
 
And restrict values above 1000.
 

 
Months
 
When the Period is set to "Months",
 
Then the Frequency field should allow values from 1 to 50 only.
 

 
Hours
 
When the Period is set to "Hours",
 
Then the Frequency field should accept values from 1 to 24.
 

 
Minutes
 
When the Period is set to "Minutes",
 
Then the Frequency field should accept values from 1 to 1000.
 

** 
**Disable and Hide Renewal Activation Period Fields**** 
Given the admin has enabled and configured the Renewal Activation Period,
 
When the Renewal checkbox is unchecked (disabled),
 
Then both Frequency and Period fields should become disabled,
 
And any previously entered values should be cleared.
 

 
Save as Draft Without Renewal Activation Period**** 
Given the admin has enabled the Renewal checkbox,
 
When the admin attempts to save the permission as a Draft without entering Frequency or Period,
 
Then the permission should be saved successfully
 
And no validation error should appear for those fields.
 

** 
**Publish** 
When the Renewal is enabled and want to publish, 
Then the corresponding input fields are mandatory.
