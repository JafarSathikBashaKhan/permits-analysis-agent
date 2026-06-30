# US-160629: Application | Application Details | Approve Application | Pre-Payment (Preview Email)

| Field | Value |
|-------|-------|
| **ID** | 160629 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**** 
**** 
**** 
**** 
 
Preview of the converted field value 
 
 
 
 
**Pre-payment Approval Workflow** 
This Flow describes how a Approval workflow process carried out . 
**Pre-Condition** 
- **Work Queue status : In-Progress** 
 
- 
 
 
- 
 
 
- **Application status will be displayed near the Application number as "In-Progress"** 
 
**1.Application Eligibility Check** 
 
Given an application is submitted with pre-payment 
When the BO user views the application in the work queue 
Then the system should only allow approval if the application status is “**In-Progress**”. 
 
 
**2. Document Validation** 
 
Given an application has required supporting documents 
When the BO user verifies them 
Then the system should ensure only valid documents are accepted before proceeding with approval. 
 
**3. Approving Application** 
 
Given an application is ready for approval 
When the BO user initiates approval 
Then the system should approve the application and triggers Approval email 
 
**4. Approval Notification Email – Trigger** 
 
Given the BO user approves an application 
When the approval action is performed 
Then the system should trigger an “Approve Application Email” pop-up. 
 
**Note**: These Email templates are configured in Settings 
 
**5.** **Customer E-mail Notification** 
 
When the BO user selects the Approve Button 
Then a Approve Email pop-up must appear with: 
 

- From Email: will be retrieved from contract settings (Send-grid) 
 
- Email Template: pre-populated with the “Approve” template with respect to permission (retrieved from contract settings, non-editable). 
 
- Email Body: pre-populated content (from the template) that is editable using a Text Editor. 
 
- Merge Fields : Merge fields should be included in the Email template and BO user can edit , Documents selected are included as a part of merge field and upon choosing it, it should populate the selected reason from the dropdown 
 
- Include Attachments if anything to be included in email. 
 
- **Cancel** and **Preview & Approve**   button is available for User selection 
 
 
 
**6. Attachment Handling (Attachment in the text editor)** 
 
When the user attaches files, 
They should be able to upload multiple attachments 
The file names should be displayed clearly 
There should be an option to remove any attachment before sending 
 
 
**7. Preview E-mail** 
 
When the BO user confirms and selects the "Preview & Approve " 
 
Then the Preview email should be displayed 
Preview details contains, 
-Email type and Application / reference number at top with close button 
- Sent to (email id) 
- Subject 
- Email Body with Merge fields selected 
- Attachments added if any 
With "Cancel" and "Approve & Send Email" 
 
 
 
And Clicking Cancel should return back to Earlier window for BO user edit (in case required details is not available, hence user can include that)    
 
 
**8. Audit Trail Logging** 
Given an application is approved 
When the process is completed 
Then the system should log the approval and all related actions in the audit trail for compliance, traceability, and reporting.. 
**Events to be captured** 
**Event: Application Approved** 
 
 

- **Event Name:** Application Approved 
- **Event Description:** The application was approved by the BO user and moved forward in the process. 
- **Event Category:** Application Processing 
- **Date and Time:** Current $timestamp 
- **User Role:** Role of the User 
- **User Name:** First name and Last name of the user 
 
 
 

 
Note: Send Email is covered in [#174167](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/174167/)
