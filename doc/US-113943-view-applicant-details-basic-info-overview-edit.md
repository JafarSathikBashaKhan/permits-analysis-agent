# US-113943: View Applicant Details - Basic Info / Overview | Edit

| Field | Value |
|-------|-------|
| **ID** | 113943 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

Given as a Super admin / Contract admin, 
When navigate to Users – Applicants - Applicant detail view screen – Overview tab,
 
Then the user should be able to edit the applicant details.
 

 
When the user invokes the button to edit the applicant details for accounts in Active and Verification pending status, **(Deactivated account cannot be edited. **Hide **_Pencil icon_)** 
Then the user should be able to edit the following fields:
 

- First Name 
- Last Name 
- DOB 
- Email 
- Mobile number 
- Blue badge number 
 

- Character limit: 20 
- No duplicate validation 
 
- Home address **(EDIT NOT REQUIRED)** 

- ~~Property Name & No (Alpha numeric and special characters up to 50 characters) ~~ 
- ~~Street (Alpha numeric up to 100 characters) ~~ 
- ~~Town (Alphabets upto 50 Characters) ~~ 
- ~~Post Code (Letters, numbers upto 10 characters) ~~ 
 
- Business address **(EDIT NOT REQUIRED)** 

- ~~Property Name & No (Alpha numeric and special characters up to 50 characters) ~~ 
- ~~Street (Alpha numeric up to 100 characters) ~~ 
- ~~Town (Alphabets upto 50 Characters) ~~ 
- ~~Post Code (Letters, numbers upto 10 characters) ~~ 
  
 

 
**Email edit and Confirmation**: 
When edits the email field, 
Then duplicate email ID should not be allowed. 
 
& 
Then should see this email exists indication as per the application standards. 

 
When saved the changes with all mandatory details, 
Then should see the indication as "Updated successfully" 
 

 
When edits the email address and saved the changes,  
Then a confirmation mail should be triggered. 
   
Note: The confirmation email UI will be covered in [#113767](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/113767/). For now, this email triggering will be handled in backend. 
  

  
When confirmation mail is triggered,  
Then status of the account should go back to '**Verification Pending**' status. 

 
When the changes are not saved due to technical issue,
 
Then should see the indication as "Something went wrong". 
 

 
When selects 'Save' without data in any of the mandatory fields, 
Then should see a field level message as "This field is required". 
 

 
When the changes are done and saved, 
Then the updated information should be available in UI. 
 

 
**Cancel** 
When the user invokes the button to cancel the changes,
 
Then the user should see the confirmation pop-up as “Are you sure you want to cancel?” with the button Yes or No.
 
When invoking yes,
 
Then the user should stay back at the applicant details screen.
 
Or
 
When invoked No,
 
Then the user should stay on the applicant edit screen. 

 
**Events Capturing / Audit** 
**General Update** 
Event Type / Name: Applicant Information updated 
Event Description: Applicant user basic information updated 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change 

 
**Email Update** 
Event Type / Name: Applicant Email Updated 
Event Description: Applicant user Email updated 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change
