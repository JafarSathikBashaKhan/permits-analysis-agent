# US-111168: Applicant User - Create

| Field | Value |
|-------|-------|
| **ID** | 111168 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

Given as a super admin / contract admin
 
When navigate to the Users – Applicants,
 
Then the user should see the button to create a new applicant.
 
 
 
When invoking the button to create a new applicant,
 
Then the user should see the following **mandatory fields **listed below:
 

- Title – Drop-down menu 
- First Name – Text field 
- Last Name - Text field 
- DOB – Date Picker (Optional based on contract settings) 
- Mobile number or Contact Number (as in Figma) – Numeric field 
- Email - Alpha numeric field 
 
Title – drop-down menu with options (Dr., Miss., Mr., Mrs., Ms., Sir / Madam.) 
First Name: Text field that allows maximum 50 characters
Last Name: Text field that allows maximum 50 characters
 
Email: Standard email validation applies including **duplication**. (**Duplicate field message** **UI**: This email already exist)
 
Contact Number or Mob Number: Numeric field upto 15 digits can be allowed. (Duplicates can be allowed) 
DOB – Date picker in DD/MM/YYYY format for example 16/04/2025.
 

 
**Data Sharing Policy (Mandatory)** 
When want to create an applicant account, 
Then should enable the "I agree to the data sharing policy" toggle. 

 
When in the **Data Sharing Policy** field, 
Then should have the option to view the set of data sharing policies. 
 
& 
When invoked, 
Then should be taken to the data sharing policies place. 
(Data sharing policy link will be consumed from Contract settings - Covered in separate story) 

 
When the user filled all the above mandatory fields along with the data sharing policy toggle enabled, 
Then should be able to create the applicant user account by invoking appropriate button in the UI. 
 

 
When invoked the save button without any of the mandatory fields, 
Then should see the field level message as "This field is required". 

 
When invokes the button to create,
 
Then the account should be created with a success indication as "Applicant user created successfully". 

 
**Email Triggering**: 
When the user account is created, 
Then a confirmation mail should be triggered. 
 
Note: The confirmation email UI will be covered in [#113767](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/113767/). For now, this email triggering will be handled in backend. 
 

 
When the confirmation link is sent, 
 
Then the link should have a expiration time of **24 hours**. 
(By clicking the link, the applicant should be able to confirm the account) 

 
When the changes are not saved due to technical issue,
 
Then should see the indication as "Something went wrong". 
 

 
When account is created and confirmation mail sent, 
Then the status of the account should be in 'Verification Pending' state. 
 

 
When confirms the account based on the confirmation process, 
Then the account should be moved to 'Active' state from ' Verification pending'. 
 
(Account confirmation and password setup by user covered in [#124690](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/124690/)) 

 
When the account creation and status change happens, 
Then the same should be reflected in the list screen. 

 
 
**Cancel or Quit**: 
When the user invokes the button to cancel the new applicant creation,
 
Then
 the user should see the alert box stating as “Are you sure you want to 
cancel?” with the option to either confirm or decline the action.
 

 
When the user confirms the cancellation,
 
Then it should be redirected back to the Applicant List screen.
 
Or
 
When the user declines the cancellation,
 
Then the user should remain on the Applicant Creation screen. 

 
**Events Capturing** 
Event Type / Name: Applicant User Created 
Event Description: Applicant User Created
 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change.
