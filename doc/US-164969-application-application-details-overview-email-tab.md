# US-164969: Application | Application Details | Overview | Email tab

| Field | Value |
|-------|-------|
| **ID** | 164969 |
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
**** 
**Permissions Based on Role** 
** ** 
Given the user is logged in as either a Super Admin or
Contract User, 
When they access the Applications menu, 
Then they should be able so permissions and its
details 
  
**Navigation** 
** ** 
 Given the Permissions details page 
When the user selects a Reference Number 
Then the system must open the Application View screen
for that reference number 
And display all the defined sections (Overview,
Applicant, Vehicles, Documents, Notes, **Emails**, Audit Log, Payment
History). 
  

Display email
history in default order**** 
  
  Given the Application View screen is open 
  When the Emails section is displayed 
  Then the system must show a history of emails
sent and received with respect to application 
   And the emails must be sorted from newest to oldest 

 
**Preview Sent/received email** 

 
** ** Covered in [#165894](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/165894/)   
 
 
    

 
Display email metadata in history

 
  Given the Application View screen is open 
  And the Emails section is displayed 
  When email history is shown 
  Then each record must display the Email ID 
  And must display the Subject of the Email 
  And must display the Date and Timestamp

 
BO user can view sent emails

 
  Given the Application View screen is open 
  And the Emails section is displayed 
  When sent emails are present 
  Then the system must display them in the email
history 
  And they must include the recipient’s email ID,
subject, and timestamp

 

**BO user can view received emails from applicant** 

 
  Given the Application View screen is open 
  And the Emails section is displayed 
  When emails have been received from the
applicant 
  Then the system must display them in the email
history 
  And they must include the sender’s email ID,
subject, and timestamp
  
**Option to send a new email****** 
  
  Given the Application View screen is open 
  And the Emails section is displayed 
  When the BO user needs to send an email to
applicant for any details/queries 
  Then BO user can choose “Send Email “ Button to
draft a new email 

 
Send Email is covered in [#165045](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/165045/)
