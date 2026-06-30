# US-175711: Application | Application Details | Request Customer Information

| Field | Value |
|-------|-------|
| **ID** | 175711 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**** 
**Pre-Condition :** 
**Current Work Queue State : in-progress** 
**BO User triggers Request Customer Information** 
Given an application is in "In-Progress" status 
When the applicant has missed providing general customer information during application submission 
Then the BO User must be able to invoke "Request Customer Information" from the "More Actions" menu 
**Customer E-mail Notification** 
When the BO user selects the Request Customer information button 
Then a Request Customer information for respective permission type , Email pop-up must appear with: 
*   From Email: will be retrieved from contract settings (Send-grid) 
*   Email Template: pre-populated with the “Request Customer information” template with respect to permission (retrieved from contract settings, non-editable). 
*   Email Body: pre-populated content (from the template) that is editable using a Text Editor. BO should be able to include the required customer information from applicant. 
*   Merge Fields : Merge fields should be included in the Email template and BO user can edit , Documents selected are included as a part of merge field and upon choosing it, it should populate the selected merge field in the Email body 
Include Attachments if anything to be included in email. 
"Cancel" and "Preview & Send " button is available for User selection 
**Preview  mail** 
When the BO user confirms and selects the "Preview & Send " 
Then the Preview email should be displayed 
Preview details contains, 

- Email type and Application / reference number at top with close button 
 
- Sent to (email id) 
 
- Subject 
 
- Email Body with Merge fields selected 
 
- Attachments added if any 
 
 
With "Cancel" and "Send Request Customer information Email" 
And Clicking "Cancel" should return back to Earlier window for BO user edit (in case required details is not available, hence user can include that) 
**Send Request Customer information Email** 
When the BO user confirms and selects the " Send Request Customer information Email" 
Then Email should be trigger to the applicant with the details 
And Status of the application should be updated to "Waiting for customer information" 
And Clicking "Cancel" should return back to Earlier window for BO user edit (in case required details is not available, hence user can include that) 
**Updated Work Queue State : "Waiting for customer information"** 
**Audit Log Events to be captured** 
Event Name: Request Customer Information 
Event Description: BO User triggered a request for missing customer general information from the applicant 
Event Category: Application Processing 
Date and Time: Current $timestamp 
User Role: Role of the User 
User Name: First name and Last name of the user
