# US-164253: Template | Email | Add WHITE MAIL REMINDER Notification Template

| Field | Value |
|-------|-------|
| **ID** | 164253 |
| **Type** | User Story |
| **Module** | MNPS Template Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**Given** a Super Admin,
**When** viewing the Notification Template dropdown,
**Then** the option **"White Mail Reminder"** should be available in the list.
 
**Set Default Validation to override existing template for Create & Edit** 

 
 
**Given** a template already exists and is set as default for a contract, permission type, and notification template,
**When** a new template is created for the same contract, permission type, and notification template,
**Then** the new template should override the previous default template. 

 
 
 
**First Template Created** 
Given a contract is selected as Permission LV 
And the permission type is selected as Suspension 
When Template A is created for the event Approval under Notification Template  
Then Template A should be set as the default template. 

 
**Another Template Created for Same Context** 
Given the same contract (Permission LV) 
And the same permission type (Suspension) 
And the same event (Approval) with Notification Template White  
When Template B is created, 
Then Template B should be set as the default template, 
And Template A’s default status should be overridden. 

 
**Different Context (No Override)** 
Given Template A exists as default under contract **Permission LV**, permission type **Suspension**, and Notification Template **White Mail Reminder ** 
When a new template is created under a different contract, permission type, or notification template, 
Then the override should not occur, 
And Template A remains the default for its original context.
