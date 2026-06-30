# US-160915: Application | Application Details | Request for Evidence (Preview Email)

| Field | Value |
|-------|-------|
| **ID** | 160915 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Request for Evidence by BO User**

**Pre-Condition**

   **Work Queue status : In-Progress**

**1. Request Evidence Action Availability**

Given a BO user or an Internal Referral user is reviewing an application,

When the application is in a status that requires further documentation,

Then BO user must choose "Request for Evidence" from "More action" 

  

**Populate email template based on selected template type**

  Given the user is in the New Email creation screen

  And the Template Type dropdown is displayed

  When the user selects a Template Type from the dropdown

  Then the system must automatically populate the email template text editor with the corresponding predefined template content

**Display document types in dropdown based on permission type**

  Given the user is in the New Email creation screen

  And a permission type is associated with the application

  When the user clicks the Document Types dropdown

  Then the system must display a list of document types related to that permission type

**Select multiple document types**

  Given the Document Types dropdown is displayed

  When the user selects one or more document types

  Then the selected document types must be populated in the selection field (multi-select)

** Customer E-mail Notification**

When the BO user selects the Request Evidence option

Then a Request Evidence for respective permission type , Email pop-up must appear with:

*   A drop-down to select the type of documents for selection (multi-select allowed) - this is retrieved from MNPS settings 

*   From Email: will be retrieved from contract settings (Send-grid)
*   Email Template: pre-populated with the “Request for evidence” template with respect to permission (retrieved from contract settings, non-editable).
*   Email Body: pre-populated content (from the template) that is editable using a Text Editor.
*   Merge Fields : Merge fields should be included in the Email template and BO user can edit , Documents selected are included as a part of merge field and upon choosing it, it should populate the selected reason from the dropdown
*   Include Attachments if anything to be included in email.

*   "**Cancel**" and "**Preview & Send **" button is available for User selection

 **Preview  mail** 

When the BO user confirms and selects the "Preview & Send "

Then the Preview email should be displayed 

Preview details contains,

     - Email type and Application / reference number at top with close button
     - Sent to (email id)
     - Subject
     - Email Body with Merge fields selected
     - Attachments added if any

With "Cancel" and "Send Support Evidence Via Email"  

And Clicking "**Cancel**" should return back to Earlier window for BO user edit (in case required details is not available, hence user can include that)

**3. Attachment Handling** (Attachment in the text editor)

When the user attaches files,

They should be able to upload multiple attachments  

The file names should be displayed clearly  

There should be an option to remove any attachment before sending

  

**Attachment Limit**:

When wants to send the email with attachment,

Then the maximum attachment limit should be less than 10 MB. 

  

When tries to add attachments more than 10 mb,

Then should be restricted.

  

When uploads the attachment files,

Then it should not be more than 10 mb.

  

**Note**: 

Maximum file count should not exceed more than 10 & should be within 10MB limit.

Only images can be attached in the text editor attachment.
