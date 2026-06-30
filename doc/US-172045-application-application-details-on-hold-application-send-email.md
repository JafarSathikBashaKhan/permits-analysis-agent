# US-172045: Application | Application Details | On-Hold Application (Send Email)

| Field | Value |
|-------|-------|
| **ID** | 172045 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Partial Complete |

## Acceptance Criteria

**Preview and Send On-hold Application E-mail** 

When the BO user confirms and selects the "Preview & On hold"

Then the Preview email should be displayed 

Preview details contains,

-Email type and Application / reference number at top with close button

- Sent to (email id)

- Subject

- Email Body with Merge fields selected

   - Attachments added if any

With "Cancel" and "On-Hold & Send Email"  

**On-Hold & Send Email  Pop-up**

When the BO user selects the On-Hold & Send Email button

Then a On hold Application Email should be triggered to the applicant.

And Cancel should stop sending Email and returns back to Edit screen email template.

      
**Application status update to **On-Hold****

    When the BO user confirms On-Hold

    Then the application status must be updated to "On-Hold"

  
**Audit Trail Logging**

When an application is On-hold

Then the system must record the following in the Audit Log:

**Application Status should be changed to "On-hold"**
      
**Event: Application On-hold**
*   **Event Name:** Application On-Hold
*   **Event Description:** The application was reviewed by the BO user and On-hold due to (Reason selected)
*   **Event Category:** Application Processing
*   **Date and Time:** Current $timestamp
*   **User Role:** Role of the User
*   **User Name:** First name and Last name of the user
