# US-153121: Templates | Email | Set default toggle for email template (create & edit) | MNPS

| Field | Value |
|-------|-------|
| **ID** | 153121 |
| **Type** | User Story |
| **Module** | MNPS Template Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

Given a super admin/contract admin 
When creating an email template,
 
Then a new toggle called "Set  as Default Template" should be shown next to the Notification Template field. 

 
When the "Set  as Default Template" toggle is enabled,
 
Then the system should use this template by default whenever the related event is triggered. 

 
When creating a new template for the first notification template 
Then the "Set as Default Template" should be enable by default 

 
**Existing Defaults**
 
When a default template already exists for any of the selected events,
 
Then enabling the "Set as Default Template" toggle for a new template should: 

- Override the existing default template 
 
 
 
When in the notification template 
Then should have the drop down as single select  

 
**Edit** 
 
When editing an existing email template,
Then the "Set as Default Template" toggle should be editable. 

 
**Example** 
When creating a template as (Template A) for the event (Application Approval) 
Then the "Set  as Default Template" should be enable by default 
And 
If creating another template as (Template B) for the same event (Application Approval) 
Then the previous template toggle should be overridden 

 
**Result** 
The Template B should set as default template for the event (Application Approval)
