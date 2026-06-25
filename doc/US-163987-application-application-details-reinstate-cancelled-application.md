# US-163987: Application | Application Details | Reinstate Cancelled Application

| Field | Value |
|-------|-------|
| **ID** | 163987 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**** 
**Reinstate Cancelled Permit Application** 
**Pre-Condition : Cancelled** 
**BO User sees " Reinstate  Application" option** 
Given the application was in ACTIVE state before cancellation 
And the permit duration has not expired 
When the BO User invokes the application number 
Then the system must display the " Reinstate Application" option 
**BO User cannot see " Reinstate Application" if permit is expired** 
Given the permit duration has expired 
When the BO User opens "More Actions" 
Then the "Reactivate Application" option must NOT be visible 
**BO User successfully Reinstate the application** 
Given the " Reinstate Application" option is visible 
When the BO User selects " Reinstate Application" 
And an email notification must be sent to the customer about the Reinstate 
And the application must be visible in both BO system and Customer Portal 
After Reinstate, Current work-queue Status : Should move to Earlier state of the application ( **ACTIVE ,or  Due to be closed, depends on the application earlier state)** 
**Customer E-mail Notification** 
When the BO user selects the Reinstate button 
Then a Reinstate Email pop-up must appear with: 
*   From Email: will be retrieved from contract settings (Send-grid) 
*   Email Template: pre-populated with the “Reinstate” template with respect to permission (retrieved from contract settings, non-editable). 
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
 
 
With "Cancel" and "Send Reinstate Cancel application Email" 
And Clicking "Cancel" should return back to Earlier window for BO user edit (in case required details is not available, hence user can include that) 
**Send Reinstate Application Email** 
When the BO user confirms and selects the " Send Reinstate Cancel application Email" 
Then Email should be trigger to the applicant with the details 
And Status of the application should be updated to "Active" 
And Clicking "Cancel" should return back to Earlier window for BO user edit (in case required details is not available, hence user can include that) 

 
**After Reinstate, Current work-queue Status** : **ACTIVE** 
**                            current work-queue state :  Due to be closed **(If the application has been cancelled due to non-payment even after grace period)
 
**Audit log entry is created upon Reinstate Cancel ** 
Given the BO User Reinstate the application 
Then an audit log entry must be created with: 
·        Event Name            Cancelled Permit Reinstated 
·        Event Description     BO User Reinstate the cancelled permit application 
·        Event Category        Work Queue 
·        Date and Time           Current $timestamp 
·        User Role                     Role of the User 
·        User Name                 First name and Last name of the user
