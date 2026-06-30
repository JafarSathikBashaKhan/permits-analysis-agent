# US-193671: Default template | Application Form | Resident permit | Checkout

| Field | Value |
|-------|-------|
| **ID** | 193671 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Tab 1 **[User Story 168818](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/168818): Default template | Application Form | Resident permit | Address section**** 
**Tab 2** [User Story 176993](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/176993): Default template | Application Form | Resident permit | Vehicle details 
**Tab 3 **[User Story 176992](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/176992): Default template | Application Form | Resident permit | Document tab 
**Tab 4 [User Story 193418](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/193418): Default template | Application Form | Resident permit | Price** 

 
**Tab 5 | Checkout section** 
**** 
**Payment Method** 
When in the Payment method  
Then should see the payment methods available based on settings against the permission builder** [#135723](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/135723/)** 

 
On selecting a payment method and further flow should be as defined in  
[Feature 25060](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/25060): Payment Methods
 
**** 
**** 
**Terms and Condition** 
**** 
**When** the applicant reaches the final step of the application form,**Then** the system should display a message stating **“By clicking Apply, you agree to our Terms and Conditions and Privacy Policy.”** 
**When** the user clicks on the “Terms and Conditions” (which should be clickable/invokable) 
**Then** the system should display the Terms and Conditions content mapped to that permission in a modal or popup window. 
 
**When** the user clicks on the "Privacy Policy" (which should be clickable/invokable)**Then** the system should display the Privacy policy configured in the contract creation (MNPS) content mapped in a modal or popup window. 
 

 
**Apply** 
When the user has selected a payment mode and entered all mandatory fields 
And clicks the Apply button, 
Then the application should submitted. 
And should display the following **success message:** 
“Application Submitted. Thank you for submitting your application. Your permit will either be auto-approved or sent to the processing team for review, depending on the permit type. You will receive an email with the next steps once your permit is approved. To check your permit status, go to ‘Manage Permits’ on the account home page. Your permit is not valid until its status shows ‘Active’.” 
 
Display an option “Would you like to apply for another "Permission name"?” with the below options: 
Yes! Please→ Navigate to the permit application flow. 
No Thanks Take me back to my permit page → Redirect to my permit page of the customer portal. 
 
 
**Cancel (Include in all tabs)** 
When the user invokes Cancel, 
Then the system should display a pop-up message stating “Would you like to save your work as draft before leaving?” 
And the pop-up should provide Stay on page, Don't Save and Save and Leave options: 
**Continue Purchase**: Closes the pop-up and keeps the user on the current page. 
**Discard:** Confirms the cancellation and discards changes. 
 
**Save and Exit:** 
When the user invokes Save and Exit, 
Then the system should display a toaster message "Progress saved successfully." 
And should redirect to the my permit page should have tag as 'Draft' 
 
 
 
When the user clicks the “Back” button, 
Then the system should display the previous tab with all previously saved data pre-filled. 
 
 
**Note:** 

- In this story, fields marked as optional will be specifically mentioned. 
- All other fields are mandatory. 
 
When the user leaves any mandatory field empty 
Then the system should display the following error message “This field is required.”
