# US-134684: View Applicant Details - Send Email

| Field | Value |
|-------|-------|
| **ID** | 134684 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Figma dependency; Fully Complete; LV |

## Acceptance Criteria

Access Across Tabs
 
Given a Super Admin / Contract Admin / BO Manager / BO User
 
When an applicant is selected and navigates to any tab on the details screen
 
Then a "Send Email" button should be visible and accessible on all tabs.
 

 
**Compose Email Screen**
 
When the "Send Email" button is clicked
 
Then a Compose Email screen must appear with the following fields:
 
Receiver Email (auto-filled, non-editable)
From address (drop-down - lists multiple email id's of that contract configured in the MNPS contract setup screen)
 
Template drop-down (with 'Notification Templates (Notification Type)' and a “Custom” option)
 
Subject (editable, mandatory, up to 255 characters)
 
~~Body (editable, mandatory, up to 5000 characters)~~
 
CC field (optional)
 
Attachments option (multi-file support as allowed in MNPS)

 
**Template Drop-down** 
When the user clicks the Template drop-down,
 
They should see a list of available "Notification Templates" (Template Name) / linked events configured in the MNPS templates section.
 
& A "Custom" option should also be available.
 

 
When a template is selected, 
Then subject and body should auto-populate with predefined content. 
And 
The user should still be able to edit the subject and body after selection.
 

 
When the "Custom" option is selected, 
The subject and body fields should be blank, allowing the user to draft a new email from scratch.
 

 
**Field Behaviors**
 
Receiver Email: Auto-filled with the selected applicant’s email, non-editable.
 
From Email: Selected from the email drop-down. 
_**Subject**_: 
Mandatory 
Editable
 
Max 255 characters
 
Validation message: "This field is required" if empty
 

 
**_Body_**:
 
Mandatory
 
Editable (rich text enabled)
 
Max 5000 characters
 
Validation message: "This field is required" if empty
 

 
_**CC Field**_:
 
Optional
 
Should support multiple email addresses
 
Accept comma , or semicolon ; as separators
 
Must validate correct email format
 

 
**Rich Text Editor**
 
When the user is typing in the body field,
 
Then they should see a rich text toolbar with options to:
 
Bold, Italic, Underline
 
Bullet List / Numbered List
 
Hyperlink insertion
 
Font size selection
 

 
**Attachment Handling **(Attachment in the text editor) 
When the user attaches files, 
They should be able to upload multiple attachments
 
The file names should be displayed clearly
 
There should be an option to remove any attachment before sending 

 
**Attachment Limit**: 
When wants to send the email with attachment, 
Then the maximum attachment limit should be less than 20 MB. (20 MB limit should be discussed with Vinoth before dev) 

 
When tries to add attachments more than 20 mb, 
Then should be restricted. 

 
When uploads the attachment files, 
Then it should not be more than 20 mb. 

 
Note:  
Maximum file count should not exceed more than 20 & should be within 20MB limit. 
Only images can be attached in the text editor attachment.  

**Send Email**
 
When all mandatory fields are filled correctly
 
And the user clicks "Send Email", 
Then the email should be sent to the receiver. 

 
**Cancel Option**
 
When the user clicks "Cancel", 
Then should see the confirmation pop-up "You have unsaved 
changes. If you leave now, your progress will be lost." - Buttons: 
Discard and Keep Creating. 

When select 'Discard', 
Then the email should be discarded. 

 
When 'Keep Creating' is selected, 
Then should stay in the same screen. 
 

 
**Validation Errors**
 
When the user tries to send the email with missing mandatory fields,
 
Then show validation errors “This field is required”. 

 
Email Logging
 
When the email is successfully sent,
 
Then the email should be logged in the applicant’s Email tab with:
 
Recipient email
 
Subject line
 
Sent date & time 

 
**Note: **Ignore the '**Save and Close**' (Save as draft) in the Figma for this implementation. (Can be taken in [#148242)](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/148242/) 

 
**** 
Audit/Event
Event Type / Name: Email Sent to Applicant 
Event Description:  Email Sent to Applicant
 
Date and Time:
 
User Role: User role 
User Name: First Name and Last Name of the user who done the change.
