# US-205913: View Applicant Details - Applications | Buy Now - Application details

| Field | Value |
|-------|-------|
| **ID** | 205913 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | southend |

## Acceptance Criteria

Prerequisites
A permission (e.g., Visitor Permit) must be created and published in Apply Back Office (BO).
 
The permission type (e.g., Permit, Licence, Suspension, Exemption, Taxi Card) must be enabled in the Contract Settings. 

 
**Buy now button is covered in [#205913](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/205913/) and rest is covered in below** 

 
When the user switches to any available category tab (e.g., Permits),
 
Then only the published and available permissions for that category should be displayed.** **(Eg: Visitors Permit, Resident Permit etc) 

 
When selected "Permits", 
Then should see the permit types published and available ones. (Eg: Visitors Permit, Resident Permit etc). 

 
When selected a permit type in 'Permits' tab, ("Visitor Permit" for this implementation) 
Then the system should open the application form  
And display the default template assigned to that permission. 

 
When the application form is opened  
Then it should display tabs as per template configuration, e.g.:
  - Address
  - Document
  - Price & Payment etc., 

 
**Fill Address Tab **(Address fields validation as per [#169081](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/169081/)) 
When the user enters required details in the Address tab  
Then the system should display a 'Save and Continue' button  

 
When clicks 'Save and Continue' 

Then the system should navigate to the next tab: 'Document'

 
**Fill Document Tab **(Document tab fields validation as per [#180799](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/180799/)) 
When uploads required documents in the Document tab  
And clicks 'Save and Continue'  
Then the system should navigate to the next tab: 'Price & Payment'

 
**Fill Price & Payment Tab **(Price and Checkout fields validation as per [#180803](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/180803/)) 
When in the Price & Payment tab  
Then they should:
  -  

- Select pricing duration 
- Apply discounts if needed 
- Select a payment method 
- Check "I agree to terms and conditions"  
 
 
And the tab should display an 'Apply' button  

 
**If Payment Mode is "Online After Approval" ** 
When clicks 'Apply'  
Then the application should be submitted,  
And
 display a thank you message:
  "Application Submitted. Thank you for submitting your application. 
Your permit will either be auto-approved or sent to the processing team 
for review, depending on the permit type. You will receive an email with
 the next steps once your permit is approved. 
To check your 
permit status, go to ‘Manage Permits’ on the account home page. Your 
permit is not valid until its status shows ‘Active’." 

 
**If Payment Mode is "Online" ** 
Then it should be based on [#179417](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/179417/) 

 
**If Payment Mode is "Offline" ** 
Then directly land in thank you screen. 
And display the message as " A new application has been successfully submitted on behalf of the applicant and is now available for your review.Please proceed with the required validation and processing in accordance with the defined workflow." 

 
 

 
 
**Buttons Available in Price & Payment tab** 
**Apply - **Button is enable only all the required fields are filled 
**Save - **Saves
 the current progress of the application as a draft; allows the 
applicant to return later to complete the application without losing 
data 

 
Cancel (Include in all tabs)
When the user invokes Cancel,
 
Then the system should display a pop-up message stating “Would you like to save your work as draft before leaving?”
 
And the pop-up should provide Stay on page, Don't Save and Save and Leave options:
 
Stay on page: Closes the pop-up and keeps the user on the current page.
 
Don't Save: Confirms the cancellation and discards changes.
 
Save and leave:
 
When the user invokes Save and leave,
 

 
Then the system should display a toaster message "Progress saved successfully."
 
And should redirect to my permit page should have tag as 'Draft'
 
 **Save** 
When the user invokes Save, 
Then the system should display a toaster message "Progress saved successfully." 

 
**Apply BO Application Submission** 
When the application is submitted  
Then in the Apply Back Office (BO) → Application menu → corresponding permission type  
The submitted application should be visible  
And a reference number should be generated [#137749](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/137749/) 

 
**** 
**Audit Or Events Capturing**: 
Event Type / Name: Application Purchased in BOEvent Description: $ApplicationName purchased in BO 
Date and Time: $CurrentTimestamp
 
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
 
User Name: $FirstName $LastName of the user who performed the action 
Category: Application
