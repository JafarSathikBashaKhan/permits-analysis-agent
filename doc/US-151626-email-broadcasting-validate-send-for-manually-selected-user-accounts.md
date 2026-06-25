# US-151626: Email Broadcasting | Validate & Send for Manually Selected User Accounts

| Field | Value |
|-------|-------|
| **ID** | 151626 |
| **Type** | User Story |
| **Module** | Email |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

Recipient Validation
 
 
 
 
 
Given the user is composing an email,
 
When they try to send the email without selecting at least one active recipient,
 
Then the system should prevent the action and display an inline error message: "Please select the recipient."
 

 
**Sender Email Validation**
 
Given the user is ready to send the email,
 
When the system detects that no sender email is selected,
 
Then the system should block the email from being sent and show the message: "Please select sender email address."
 

 
**Subject Validation**
 
Given the user is on the email broadcasting form,
 
When they leave the subject field empty and click "Send",
 
Then the system should display an inline error: "Subject cannot be empty." and prevent sending.
 

 
**Message Body Validation**
 
Given the user is composing the email,
 
When the message body is left empty and the user clicks "Send",
 
Then the system should show an inline error message: "**Message body cannot be empty**."
 

 
**Inline Error Messaging**
 
Given the user has validation errors in the form,
 
When they attempt to send the email,
 
Then the system should highlight all invalid fields with clear inline error messages specific to each field.
 

 
**Block Send on Validation Failure**
 
Given one or more validation errors exist (e.g., missing recipients, subject, etc.),
 
When the user clicks on "Send",
 
Then the system must not proceed with the email dispatch.
 

 
**Send Email for Manually Selected User Accounts **Given all required fields are filled correctly and at least one recipient is selected,
 
When the user clicks on "Send",
 
Then the system should dispatch the email and show a success message: "Email has been sent successfully." 
**_Note_**: Sending email for recipient based on Zone, Street and Properties selection is covered in [#162387](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/162387/) 

 
**Error on Technical Failure**
 
Given all inputs are valid and the user clicks "Send",
 
When a technical error (e.g., mail server failure) occurs during dispatch,
 
Then the system should log the error and show a message: "An error occurred while sending the email. Please try again later." 

 
**Emails availability in Applicant List**: 
When the emails are sent successfully, 
Then those emails should be available in the "Users -> Applicants -> Emails". 

 
**Events Capturing** 
Event Type / Name: Email Broadcasted to Applicant 
Event Description:  Email Broadcasted to Applicant 
Date and Time:
 
User Role: User role 
User Name: First Name and Last Name of the user who done the change.
