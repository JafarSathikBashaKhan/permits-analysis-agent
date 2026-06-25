# US-172028: Application | Application Details | Reject Application (Send Reject Email)

| Field | Value |
|-------|-------|
| **ID** | 172028 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**Preview and Reject E-mail** 
When the BO user confirms and selects the "Preview and Reject" button 
Then the Preview email should be displayed 
Preview details contains, 
 
 -Email type and Application / reference number at top with close button 
- Sent to (email id) 
- Subject 
- Email Body with Merge fields selected 

- Attachments if any 
 
 
 
With "Cancel" and "Reject & Send Email" 
**Send Approve Email Pop-up** 
When the BO user selects the "Reject & Send Email"  button 
Then a Approve Application Email should be triggered to the applicant. 
And Cancel should stop sending Email and returns back to Edit screen email template. 
**Audit Trail Logging** 
Given an application is approved 
When the process is completed 
Then the system should log the Rejected and all related actions in the audit trail for compliance, traceability, and reporting.. 
**Events to be captured** 
**Event: Application Rejected** 

- **Event Name:** Application Rejected 
- **Event Description:** The application was Rejected by the BO user , due to (Reason selected) 
- **Event Category:** Application Processing 
- **Date and Time:** Current $timestamp 
- **User Role:** Role of the User 
- **User Name:** First name and Last name of the user
