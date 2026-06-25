# US-174167: Application | Application Details | Approve Application | Pre-Payment (Send Email)

| Field | Value |
|-------|-------|
| **ID** | 174167 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**** 
**** 
**** 
**** 
 
 
 
 
 
 
**Preview and Approve E-mail** 
When the BO user confirms and selects the "Preview and Approve" button with Close Button 
Then the Preview email should be displayed 
Preview details contains, 
-Email type and Application / reference number at top 
- Sent to (email id) 
- Subject 
- Email Body with Merge fields selected 
- Attachments added if any 
With "Cancel" and "Approve & Send Email" 

 
**Send Approve Email Pop-up** 
When the BO user selects the "Approve & Send Email"  button 
Then a Approve Application Email should be triggered to the applicant. 
And Cancel should stop sending Email and returns back to Edit screen email template. 

 
Application will move to "Approved " State, and once successful email triggering application will move to "**ACTIVE**" state 
**Current state after approved : ACTIVE** 
**Audit Trail Logging** 
Given an application is approved 
When the process is completed 
Then the system should log the approval and all related actions in the audit trail for compliance, traceability, and reporting.. 
**Events to be captured** 
**Event: Application Approved** 

- **Event Name:** Application Approved 
- **Event Description:** The application was approved by the BO user and moved forward in the process. 
- **Event Category:** Application Processing 
- **Date and Time:** Current $timestamp 
- **User Role:** Role of the User 
- **User Name:** First name and Last name of the user
