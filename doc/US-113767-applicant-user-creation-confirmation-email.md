# US-113767: Applicant User Creation - Confirmation Email

| Field | Value |
|-------|-------|
| **ID** | 113767 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | LV |

## Acceptance Criteria

Trigger via Template
 
Given an applicant account is created,
 
When the system raises the Confirmation Link event,
 
Then the email should be generated using the configured **"Confirmation Link" **template. (Linked event already handled in [#141488](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/141488/)) 

 
Template Retrieval
Given a template is configured for the **Confirmation Link** event under MNPS → Templates,
 
When the event is triggered,
 
Then the system should fetch subject, body, and sender email from the template. 

 
Template Merge
Given the template if contains merge fields (e.g., {{FirstName}}, {{VerificationLink}}),
 
When the email is prepared,
 
Then the merge fields should be replaced with actual applicant details. 

 
Email Delivery
Given the email content is successfully prepared,
 
When the system sends the email,
 
Then the applicant should receive the confirmation email at their registered email address. 
& 
Then that email should have the _**Customer Registration & Set Password Link**_ developed in [#124690](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/124690/). 

 
_**VERIFICATION LINK (Customer Registration & Set Password Link)**_ 
Verification Action
Given an applicant account is in Verification Pending status,
 
When the applicant clicks the verification link or Customer Registration & Set Pwd link.  
Then should be taken to the Customer Registration & Set Pwd screen developed in [#124690](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/124690/). 

 
**_Already Developed in [#124690](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/124690/)_** 
**Set Password**When in the Customer Registration & Set Pwd screen, 
Then should be able to set password and confirm the account creation. 

 
When password reset is done, 
Then the account should be changed from "Verification Pending" to "Active". (Already developed in **_[#124690](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/124690/)_**) 

 
**Audit/Event Logging**
 
Given an applicant successfully verifies their account,
 
When the status is changed to Active,
 
Then an audit/event should be recorded with event type = Account Verified, timestamp, user role, and applicant details. 
**Events Capturing** 
Event Type / Name: Applicant Account Verified 
Event Description: Applicant account verified and status changed to 'Active' 
Date and Time: 
Category: <to be defined before devlopment> 
User Role: Customer  
User Name: First Name and Last Name of the user who done the change.
