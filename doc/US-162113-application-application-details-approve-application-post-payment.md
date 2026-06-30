# US-162113: Application | Application Details | Approve Application | Post-Payment

| Field | Value |
|-------|-------|
| **ID** | 162113 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**** 
**** 
**** 
**Post-Payment Approval Workflow** 

 
 
**Pre-Condition** 
 
- **Work Queue status : In-Progress** 
 
  
**  User Access:** 
    Given an
application is submitted by a customer through the portal 
    And the application
is visible in Applications section 
    And the BO user is
authorized to process applications 
  
  Application eligible
for approval 
** ** 
    Given the
application status is in **"In-Progress"** 
    And all required
documents are uploaded 
    And the BO user
validates that the documents are valid 
    When the BO user
approves the application 
    Then the system
should proceed with the approval workflow 
  
**Post-payment application triggers payment request** 
** ** 
**    **Given the application submitted by
applicant is has not completed payment (Online after approval) 
    And the application
is approved by the BO user 
    When the approval
is processed 
    Then the system
should send an email notification to the applicant to complete payment 
    And the application
status should update to **"Waiting for Payment**" 
  
**Applicant completes payment successfully** 
** ** 
    Given the
application status is in "**Waiting for Payment**" 
    And the applicant
completes payment 
    When the system
verifies the payment 
    And the application
status should updated to "**Active**" 
    
  
**Applicant does not complete payment** 

 
    Given the
application status is "**Waiting for Payment**" 
    And the applicant
has not completed payment 
    When the system
checks for payment completion  
    Then the
application should remain in or return to "**Waiting for Payment**" state 
    And a notification
email should be sent to the applicant 
     
  
**** 
**Approval Notification Email – Trigger** 
 
Given the BO user approves an application 
When the approval action is performed 
Then the system should trigger an “Approve Application Email” pop-up. 
 
**Note**: These Email templates are configured in Settings.. 
**Customer E-mail Notification** 
 
When the BO user selects the Approve Button 
Then a Approve Email pop-up must appear with: 
 

- From Email: will be retrieved from contract settings (Send-grid) 
 
- Email Template: pre-populated with the “Approve” template with respect to permission (retrieved from contract settings, non-editable). 
 
- Email Body: pre-populated content (from the template) that is editable using a Text Editor. 
 
- Merge Fields : Merge fields should be included in the Email template and BO user can edit , Documents selected are included as a part of merge field and upon choosing it, it should populate the selected reason from the dropdown 
 
- Include Attachments if anything to be included in email. 
 
- **Cancel** and **Preview & Approve**   button is available for User selection 
 
 
 
    
**Add Attachment** 

 
     Given a BO user is provided with attachment icon 
     When BO needs to add any attachments with respect to application , that needs to be shared with Applicant 
     Then BO user should choose and select the required file to be attached with email 
     And BO user should be able to add any attachment that needs to send to the applicant 

 
 
**Preview E-mail** 
 
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

 
**Send Approve Email Pop-up** 
When the BO user selects the "Approve & Send Email"  button 
Then a Approve Application Email should be triggered to the applicant. 
And Cancel should stop sending Email and returns back to Edit screen email template. 
 
Application will move to "Approved " State, and Since payment yet to be completed , application moves to "**Waiting for Payment**" state 

 
  
  **Audit trail****** 

 
    Given a BO user
approves an application 
    When the
application moves through approval states 
    Then the audit
trail should capture 

 
 
**** 
****
- **Event Name:** Application Approved 
- **Event Description:** The application was approved by the BO user and moved forward in the process. 
- **Event Category:** Application Processing 
- **Date and Time:** Current $timestamp 
- **User Role:** Role of the User 
- **User Name:** First name and Last name of the user 
 
 

 
**• Event Name:** Application Approved Awaiting for Payment
**• Event Description:** <BO user> approved the application and is awaiting payment completion from customer.
**• Event Category:** System Action
**• Application ID:** $ApplicationID
**• Date & Time:** $timestamp
**• User Role:** System
**• User Name:** System
