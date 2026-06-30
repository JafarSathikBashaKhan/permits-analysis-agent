# US-141683: Templates | Email | Edit | MNPS

| Field | Value |
|-------|-------|
| **ID** | 141683 |
| **Type** | User Story |
| **Module** | MNPS Template Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**MNPS BO > Configuration > Templates > Actions** 
 
 
 
 
 
 
 
**** 
**Edit** 
Given a super admin/contract admin 
When in the template list screen 
Then should have the edit option 
 
When invoke the edit option for the selected email template 
Then the following fields should not be editable 

- Organization 
- Contract 
 
And should edit the Permission type, Sender** **email, Template name, E-mail subjects, Linked events 
And edit the template in text editor 

 
When the changes are made  
Then update button should be invokable 
 
 
**The Update button, Cancel button, and toaster message **follow the existing flow used in MNPS.**** 
**Preview **follow the existing flow used in MNPS. 
 
**Delete **follow the existing flow used in MNPS. 

 
**Audit/Event**  
**Success** 
Event Type / Name: Template Updated 
Event Description:  "Template Name" updated successfully 
Date and Time: Current $timestamp 
User Role: Role of the user 
User Name: First Name and Last Name of the Back office user 
 
 
 

 
Note: Event to be captured in APPLY
