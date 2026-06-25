# US-172029: Application | Application Details | Request for Evidence (Send Email)

| Field | Value |
|-------|-------|
| **ID** | 172029 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Request for Evidence by BO User**

 **Preview and Send Request for evidence Email **

When the BO user confirms and selects the "Preview and Send Request for evidence email"

Then the Preview email should be displayed 

Preview details contains,

-Email type and Application / reference number at top with close button

- Sent to (email id)

- Subject

- Email Body with Merge fields selected

   - Attachments added if any

With "**Cancel**" and "**Send Support Evidence Via Email**"  

**Send Request for Evidence Email**

When the BO user confirms and selects the " Send Support Evidence Via Email"

Then Email should be trigger to the applicant with the details

And Status of the application should be updated to "Awaiting Support Evidence" (yet to confirm the state)

And Clicking "**Cancel**" should return back to Earlier window for BO user edit (in case required details is not available, hence user can include that)

 **Audit Logging**

When the Request for Evidence action is initiated,

Then the Audit Log must record:

-Application reference number.

-BO user ID requesting evidence.

-Date and time of request.

-Type of document requested.

And all subsequent actions must also be logged.

      
**Event: Request Supporting Evidence **
*   **Event Name:** Request Supporting Evidence 
*   **Event Description:** The BO user requested additional supporting documents or information from the applicant to proceed with application processing with (Document type selected)
*   **Event Category:** Application Processing
*   **Date and Time:** Current $timestamp
*   **User Role:** Role of the User
*   **User Name:** First name and Last name of the user
