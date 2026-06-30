# US-132580: View Applicant Details - Applications | Buy Now - Dynamic permission type

| Field | Value |
|-------|-------|
| **ID** | 132580 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | LV; southend |

## Acceptance Criteria

Prerequisites
A permission (e.g., Visitor Permit) must be created and published in Apply Back Office (BO).
 
The permission type (e.g., Permit, Licence, Suspension, Exemption, Taxi Card) must be enabled in the Contract Settings. 

 
Navigation and Access
Given a Super Admin / Contract Admin / BO Manager / BO User
 
When the user navigates to:
 
Users → Applicants → Select an Applicant → Application tab
 
Then a Buy Now button should be visible at the top right corner of the Application screen.
 

 
When the user clicks Buy Now,
 
Then a right-side panel titled “Buy New Application” should open.
 

 
Dynamic Permission Type Display (Contract Configuration Driven)
Given the Buy New Application panel is opened,
 
Then the system should display only the permission type categories allowed under that contract, such as:
 
Permits
 
Licences
 
Suspensions
 
Exemptions
 
Taxi Card 

 
And if any of the above permission types are not enabled in the contract settings,
 
Then that category tab should be hidden from view** **if there are no applications. 

 
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

 
Rest of the functionalities are covered in [#205913](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/205913/) 

 
**** 
**Audit Or Events Capturing**: 
Event Type / Name: Application Purchased in BOEvent Description: $ApplicationName purchased in BO 
Date and Time: $CurrentTimestamp
 
User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)
 
User Name: $FirstName $LastName of the user who performed the action 
Category: Application
