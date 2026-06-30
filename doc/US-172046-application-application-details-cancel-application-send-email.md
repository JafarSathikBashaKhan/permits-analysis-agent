# US-172046: Application | Application Details | Cancel Application (Send Email)

| Field | Value |
|-------|-------|
| **ID** | 172046 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**Preview and Send Cancel Application E-mail** 

When the BO user confirms and selects the "Preview & Cancel "

Then the Preview email should be displayed 

Preview details contains,

-Email type and Application / reference number at top with close button

- Sent to (email id)

- Subject

- Email Body with Merge fields selected

- Attachments added if any

With "Cancel" and "Send Cancel Application Via Email"  

**Send cancel Application Email Pop-up**

When the BO user selects the "Send cancel application via Email" button

Then a Cancel Application Email should be triggered to the applicant.

And Cancel should stop sending Email and returns back to Edit screen email template.

**Audit Trail Logging**

When an application is rejected

Then the system must record the following in the Audit Log:

**Application Status should be changed to "Cancelled"**
      
**Event: Application Cancelled**
*   **Event Name:** Application Cancelled
*   **Event Description:** The application was reviewed by the BO user and Cancelled due to (Reason selected)
*   **Event Category:** Application Processing
*   **Date and Time:** Current $timestamp
*   **User Role:** Role of the User
*   **User Name:** First name and Last name of the user
