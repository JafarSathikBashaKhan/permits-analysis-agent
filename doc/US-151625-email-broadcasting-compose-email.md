# US-151625: Email Broadcasting - Compose Email

| Field | Value |
|-------|-------|
| **ID** | 151625 |
| **Type** | User Story |
| **Module** | Email |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

Email Composition
 
 
 
 
 
 
 
Given the Super Admin / Contract Admin / BO Manager / BO User is on the email composer screen,
 
When composing the email,
 
Then input fields for Subject and Message Body must be provided.
 

 
**Template Drop-down** 
 
When the user clicks the Template drop-down,
 
They
 should see a list of available "Notification Templates" (Template Name)
 / linked events configured in the MNPS templates section.
 
& A "Custom" option should also be available.
 

 
When a template is selected, 
Then subject and body should auto-populate with predefined content. 
And 
The user should still be able to edit the subject and body after selection. 
Note: When template content is edited, then that should not affect the base template. 

 
When the "Custom" option is selected, 
The subject and body fields should be blank, allowing the user to draft a new email from scratch.
 

 
**Field Behaviors**
 
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
Then the maximum attachment limit should be less than 10 MB. (10 MB limit should be discussed with Vinoth before dev) 

 
When tries to add attachments more than 10 mb, 
Then should be restricted. 

 
When uploads the attachment files, 
Then it should not be more than 10 mb. 

 
Note:  
Maximum file count should not exceed more than 10 & should be within 10MB limit. 
Only images can be attached in the text editor attachment. 
 

Given the user has entered subject and message body,
 
When there is at least one recipient selected,
 
Then the “Send” button should be enabled.
 

 
**Sender and CC Details**
 
Given the user is composing the email,
 
When selecting the sender,
 
Then the system should show a dropdown of valid sender email addresses based on the user’s contract configuration.
 

 
Given the user selects the sender,
 
When composing the email,
 
Then the sender field should be mandatory.
 

 
Given the user wants to add CC recipients,
 
When entering CC addresses,
 
Then the system should allow multiple email addresses, with each address being validated.
 

 
Given the sender and CC addresses are set,
 
When sending the email,
 
Then the email should be sent from the selected sender address, and the CC addresses should receive the email as well.
