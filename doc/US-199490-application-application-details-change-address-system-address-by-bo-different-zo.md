# US-199490: Application | Application Details | Change Address (system address ) By BO - Different zone

| Field | Value |
|-------|-------|
| **ID** | 199490 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | southend |

## Acceptance Criteria

**Pre-condition : Active** 
**Scenario: Change address using system-provided address from dropdown** 
As a BO user  I want to change a customer's address and capture required documents so that the system can show zone differences and pricing only after documents are complete 
**Background:** 
Given an application with exists 
And the application is in ACTIVE state that permits address change 
And BO user proceeds Change address based on applicant request 
And on invoking “Change Address” from more action, change address pop-up window displays 
**Scenario: BO selects new postcode/property and sees zone information** 
 
When the BO user selects Postcode from the dropdown or should type the postcode , based on that pincode displayed in the dropdown 
And BO user should be able to select the PINCODE 
And based on the selected postcode Property dropdown displays and upon selection of property , street list displays for user selection. 
And user should be input the town details 
 
When the postcode, property, street and town details are provided 
System fetches the Zone details and if the ZONE is same as existing it displays the details in a section as :  
"Selected Zone is located on <Zone name> " 
"You are changing the address to the same zone. So no extra charges apply" 
**Scenario: Change address pricing displayed** 
Given zone is changed to a different zone for change address . pricing charges apply and details of cost summary is displayed 
And system displays the Pricing details of the selected zone with the existing zone 
Cost Summary 
| Current Zone price  | 
| Selected Zone price | 
| Price difference    | 
| Admin fee           | 
| VAT (0%)            | 0                   | 
| **Discount **|  (Which is an editable field , and BO user should be able to include price / amount that will be discounted from the price difference) 
| Price Differences |  (Which will include the discount price and calculates the total amount customer has to pay or refund has tp be initiated) 
And the system displays the pricing summary to the BO user 

 
**Scenario: BO uploads required documents for the new address** 
Given the required document types for this permission are displayed 
When the BO user uploads all required documents for the application 
And the system displays the uploaded documents in the UI 

 
**Scenario: BO confirms address change after pricing displayed** 
Given pricing is displayed and documents uploaded as required 
When the BO user confirms "Proceed" button 
Then the BO user is displayed with the Email window 

 

 
Email is covered in different story [#199506](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/199506/)
 
**Note **:  

- Refund has to be initiated if the new zone price is lesser that the existing zone. 
- Payment has to be completed and based on the status , work queue needs to be changed 
- Payment failed scenarios has to be consider 
 
 
**Event Name:** Address Change Initiated (BO)
**Event Description:** BO user started the address change flow and selected new postcode/property.
**Event Category:** Address Change / Initiated
**Application ID:** $ApplicationID
**User Role:** BO User
**User Name:** $UserName
**Date & Time:** $Timestamp
