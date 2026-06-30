# US-174813: Application | Application Details | Reinstate Rejected Application

| Field | Value |
|-------|-------|
| **ID** | 174813 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**Reinstate Cancelled Permit Application** 
**Pre-Condition : Rejected** 
**BO User sees " Reinstate  Application" option** 
Given the application was in Rejected state  
When the BO User invokes the application number 
Then the system must display the " Reinstate Application" option 
**BO User successfully Reinstate the application** 
Given the " Reinstate Application" option is visible 
When the BO User selects " Reinstate Application" 
And an email notification must be sent to the customer about the Reinstate 
And the application must be visible in both BO system and Customer Portal 
After Reinstate, Current work-queue Status : **Pending-Approval / Pending-renewal** 

 
**Customer E-mail Notification** 
When the BO user selects the Reinstate button 
Then a Reinstate Email pop-up must appear with: 
*   From Email: will be retrieved from contract settings (Send-grid) 
*   Email Template: pre-populated with the “Reinstate rejected” template with respect to permission (retrieved from contract settings, non-editable). 
*   Email Body: pre-populated content (from the template) that is editable using a Text Editor. BO should be able to include the required details additionally if needed 
*   Merge Fields : Merge fields should be included in the Email template and BO user can edit ,it should populate the selected merge field in the Email body 
*   Include Attachments if anything to be included in email. 
*   "Cancel" and "Preview & Send " button is available for User selection 
**Preview  mail** 
When the BO user confirms and selects the "Preview & Send " 
Then the Preview email should be displayed 
Preview details contains, 

- Email type and Application / reference number at top with close button 
 
- Sent to (email id) 
 
- Subject 
 
- Email Body with Merge fields selected 
 
- Attachments added if any 
 
 
With "Cancel" and "Send Reinstate Rejected application Email" 
And Clicking "Cancel" should return back to Earlier window for BO user edit (in case required details is not available, hence user can include that) 
**Send Reinstate Application Email** 
When the BO user confirms and selects the " Send Reinstate Rejected application Email" 
Then Email should be trigger to the applicant with the details 
And Status of the application should be updated to "**Pending-Approval / Pending-renewal**" 
And Clicking "Cancel" should return back to Earlier window for BO user edit (in case required details is not available, hence user can include that) 

 
After Reinstate, Current work-queue Status : **Pending-Approval / Pending-renewal** 

 
**** 
**Scenario: Reinstate button visible within 3 days of Rejection / cancellation**  
**Given an application was Rejected / cancelled ** 
**When the BO User views the application detail page ** 
**Then the system should display the "Reinstate" button ** 
**And Reinstate button is visible for next 3 days of rejection or cancellation ** 
**And the BO User should be able to invoke reinstate ** 

  
**** 
**Scenario: Reinstate button hidden after 3 days**  
**Given an application was Rejected or cancelled ** 
**When the BO User views the application detail page after 3rd day ** 
**Then the system should NOT display the "Reinstate" button ** 
**And application remains in Rejected or Cancelled state ** 

  
**Audit log entry is created upon Reinstate Rejected** 
Given the BO User Reinstate the application 
Then an audit log entry must be created with: 
·        Event Name            Rejected Permit Reinstated 
·        Event Description     BO User Reinstate the rejected permit application  
·        Event Category        Work Queue 
·        Date and Time           Current $timestamp 
·        User Role                     Role of the User 
·        User Name                 First name and Last name of the user
