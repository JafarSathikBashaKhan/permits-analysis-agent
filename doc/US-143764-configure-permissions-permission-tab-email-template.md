# User Story 143764: Configure Permissions | Permission Tab | Email Template

## Metadata
| Field | Value |
|-------|-------|
| ID | 143764 |
| Type | User Story |
| Title | Configure Permissions | Permission Tab | Email Template |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Email Templates section visibility
** 
 
 
 
 
 
 
 
Given the Super admin / Contract admin is on the Permission Setup screen, 
When the screen loads, 
Then the Email Templates section should be visible. 
** 
Static event types listed in Drop-Down**When the Email Templates section is viewed** 
Then a drop-down should display all predefined static event types listed below. 

- Reject The Application 
- Submit Application 
- Request Support Evidence 
- Cancel 
- Suspend 
- Activate 
- Approve 
- Expiration Reminder 
- Waiting for pay online by card 
- Insufficient funds for a pay 
- Automatic Card Payment Failed 
- Waiting for pay cash 
- Reject Permit Changes 
- Visitor Details 
- Successful refund 
- Refund fail 
- Permit expired 
- Approve Address Changes 
- Approve VRN Changes 
- Due To Be Closed - Non payment 
- Due to be closed  - No documents received 
- Confirmation Link 
- Reset Link 
- Reset Password 
- Visitor voucher activation (Applicant) 
- Visitor voucher activation (Visitor) 
- Visitor voucher expire (Visitor) 
- Payment card expiration 
- Submit Renewal 
- Forgotten UserName 
- Submit Change of Vehicle 
- Visitor Permit Activation Email 
- Application Form Email 
- Address Challenge Approved 
- Change Zone 
- Change Address Challenge Approved 
- Pre-Approval Link 
- Pre-Approval Submission 
- Temporary Vehicle Added 
- Temporary Vehicle removed ​ 
 
 
Templates based on event selected:** 
Given an event is selected from the event drop-down,** 
When the admin selects "Approve Application" (for example),
 
Then a should see the list of all the available global email templates configured for selection. 

 
When views the list of templates for the earlier selection, 
Then should be able to select and map that template for the already selected event. ~~(Multi select allowed) ~~ 

 
When selects an event, 
& If that event has only one template, 
Then that should be selected as default in the drop-down. 

 
When want to select all events in a single click, 
When selected "Select All", 
Then should see all the events added in the configuration area. (Post that user can select template against each) 

 
Ability to Configure Multiple Event-Template Mappings**** 
Given the admin has already configured one event-template pair,
 
When want to configure for another event, 
Then should be able to configure by selecting"Add Event" button.
 

** 
**Mapping Is Saved Per Permission Type**** 
Given the admin selects and maps one or more event-template combinations,
 
When the admin saves the configuration,
 
Then the system should save this mapping specific to the permission type being configured (e.g., Residential Permit or Visitors Permit).
 

** 
**Do Not Show Already Mapped Events**** 
Given an event has already been configured,
 
When the admin attempts to add another configuration,
 
Then the drop-down should show the previously selected events. (So that the user can uncheck) 

 
When unchecks the previously selected events, 
Then the event section should be removed from the configuration area. 

** 
**Warning for Overriding Global Templates**** 
Given the admin is configuring email templates at the permission level,
 
When they are about to save a new mapping,
 
Then the UI must display the following warning:
 

 
⚠️ These settings will override the default (global) email templates. Only configure them if you intend to send different emails for this permission type.
 

 
Non-Mandatory**: 
When in the section, 
Then configuring or setting a template is non-mandatory. 
** 
When the event is added, 
Then selecting the template is mandatory for publishing. 

 
Note for Understanding: (Can't be achieved) 
Fallback to Global Templates**
 
Given no email template is selected for a specific event at the permission level,
 
When the event is triggered in the system,
 
Then the system should send the default global template configured for that event.
