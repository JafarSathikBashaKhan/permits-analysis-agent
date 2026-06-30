# US-141488: Templates | Email | Create | MNPS

| Field | Value |
|-------|-------|
| **ID** | 141488 |
| **Type** | User Story |
| **Module** | MNPS Template Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Figma Added; Fully Complete; LV |

## Acceptance Criteria

**MNPS BO > Configuration > Templates > + Design Template** 
**** 
Given a super admin/contract admin 
When in the Templates list screen in MNPS 
Then should invoke the '+ Design Template' button 
 
When invoke the button 
Then should select the 'Organization' and 'Contract' 
 
When permissions contract is selected 
Then the below **mandatory** fields should be enabled 

- Permission Type - Drop down should display all the permission types created in the contract settings 
- Template Type - The Template Type should default to 'E-mail' when the permission contract is selected. 
- Template Name 
 
- Sender email - Should select from the dropdown created against the permission type in the contract setting (MNPS).
 
- Notification Template (Linked Events) - Single Select drop down 
- E-mail Subject 
 
Template Name & E-mail Subject - Follow existing validation used in MNPS 
  
When in the **Notification Template** (linked events) 
Then should have the predefined values to be displayed in the drop down with search 

- Reject The Application 
- Submit Application 
- Request Support Evidence 
- Cancel 
- Suspend 
- Activate 
- Approve 
- Expiration Reminder 
- Waiting for pay online by card 
- Insufficient funds for a pay 
- Automatic Card Payment Failed 
- Waiting for pay cash 
- Reject Permit Changes 
- VisitorDetails 
- Successful refund 
- Refund fail 
- Permit expired 
- Approve Address Changes 
- Approve VRN Changes 
- Due To Be Closed - Non payment 
- Due to be closed  - No documents received 
- Confirmation Link 
- Reset Link 
- Reset Password 
- Visitor voucher activation (Applicant) 
- Visitor voucher activation (Visitor) 
- Visitor voucher expire (Visitor) 
- Payment card expiration 
- Submit Renewal 
- Forgotten UserName 
- Submit Change of Vehicle 
- Visitor Permit Activation Email 
- Application Form Email 
- Address Challenge Approved 
- Change Zone 
- Change Address Challenge Approved 
- Pre-Approval Link 
- Pre-Approval Submission 
- Temporary Vehicle Added 
- Temporary Vehicle removed ​ 
 
 
Additional events are required to be added for Licensing and Taxi Card processes. 
 
 

 
~~**Example:** ~~ 
 
~~If the 'Account Confirmation' template is created, it is used to send confirmation emails to users. ~~ 
~~Therefore, both the 'Confirmation Link' and 'Resend Confirmation Link' events can be linked to this template,  ~~ 
~~As they serve the same purpose and should use a single email template. ~~ 

 
 
**Text Editor** 
When in the text editor 
Then should write/copy paste the email template 
 
 

 
**Text Formatting** 
When the user selects text and applies formatting
options,
 

Then the text should reflect the chosen style (bold, italic, underline,
font size/style, alignment, lists, hyperlinks). 
 

 
 
**Content Editing** 
When the user performs editing actions (cut, copy,
paste, undo, redo),
 

Then the editor should update the content accordingly and maintain
formatting. 

 
 
**Save Button, Cancel Button and toaster message follow the existing flow used in MNPS.**
 

 
**Error** 
 
When the user enters a template name against the permission type that already exists in the system, 
Then the system should display an error message: "Template name already exist" 
 
 
When not able to create terms and conditions due to technical issue or network issue 
Then should see the indication as "Something went wrong Please try again" 
 

 
**Audit/Event**  
**Success** 
Event Type / Name: Template Created 
Event Description:  "Template Name" created successfully 
Date and Time: Current $timestamp 
User Role: Role of the user 
User Name: First Name and Last Name of the Back office user 
 
 
 

_Note:_ Event to be captured in APPLY
