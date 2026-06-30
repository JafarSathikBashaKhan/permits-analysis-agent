# US-160796: Application | Application Details | Reject Application (Preview Email)

| Field | Value |
|-------|-------|
| **ID** | 160796 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Application Rejection Process**

****Pre-Condition****

1.  Work Queue status : **In Progress**

**Application Display & Access**

Given a customer has submitted an application via the customer portal

Then the application must be visible under:

-My Work Items tab of the assigned BO user.

-Permissions tab.

And the application must be automatically added to the correct work queue.

**Eligibility Review & Reject Option**

Given the BO user is reviewing an application

When the user identifies that the customer is not eligible or does not meet the required criteria

Then the BO user must be able to select the Reject button to initiate the rejection process.

  

**Reject reason selection from list**

When the BO user selects "Reject" button

Then a pop-up should display with a drop-down list of predefined Reject reasons that are configured (Configured in MNPS)

And the BO user must select one reason from the list to procced Rejection of application
 

Reasons has to be configured in settings.(Yet to confirm)  

**Display text field when 'Others' is selected as reason**

    Given the BO user is on the reason selection screen

    When the BO user selects "Others" from the list of reasons

    Then a text field should be displayed

    And the BO user should be able to type a custom reason in the text field

  **No text field displayed when a predefined reason is selected**

    Given the BO user is on the reason selection screen

    When the BO user selects any predefined reason other than "Others"

    Then no text field should be displayed

**Preview Rejection Email Pop-up**

When the BO user selects the Reject option

Then a Reject Application Email pop-up must appear with:

*   A drop-down to select the Reject reasons , once selected 
*   From Email: will be retrieved from contract settings (Send-grid)
*   Email Template: pre-populated with the “Rejected” template (retrieved from contract settings, non-editable).
*   Email Body: pre-populated content (from the template) that is editable using a Text Editor.
*   Merge Fields : Merge fields should be included in the Email template and BO user can edit , Reject reasons are included as a part of merge field and upon choosing it, it should populate the selected reason from the dropdown
*   Include Attachments if anything to be included in email.
*   "Cancel" and "Preview & Reject " button is available for User selection

**Note** : Rejection Email Template is pre-defined in the settings. So respective Email content will be displayed automatically
                 Merge fields insert already covered in #148624 

 **Preview  mail **

When the BO user confirms and selects the "Preview and Send rejection email"

Then the Preview email should be displayed 

Preview details contains,

-Email type and Application / reference number at top with close button

- Sent to (email id)

- Subject

- Email Body with Merge fields selected

   - Attachments added if any

With "Cancel" and "Reject & Send Email"  

And Clicking on cancel should return back to previous window for user edit

Send Rejection Email is covered in : #172028 

  

**Audit Trail Logging**

When an application is rejected

Then the system must record the following in the Audit Log:

      
**Event: Application Rejected**
*   **Event Name:** Application Rejected
*   **Event Description:** The application was reviewed by the BO user and rejected due to (Reason selected)
*   **Event Category:** Application Processing
*   **Date and Time:** Current $timestamp
*   **User Role:** Role of the User
*   **User Name:** First name and Last name of the user
