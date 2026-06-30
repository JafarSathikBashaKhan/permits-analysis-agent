# US-194825: Application | Application Details | BO to Record payments made offline

| Field | Value |
|-------|-------|
| **ID** | 194825 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | southend |

## Acceptance Criteria

**** 
**BO records offline payment for Approved application with Offline payment method** 
**Pre-condition : Approved --> waiting for payment ,** 
**                          And status --> Pending** 
**                          And Payment Method --> Offline** 
**Then enable "Record " button** 

 
**Background**: 
Given a BO User with permission is logged in 
And an application exists with approved state  
And application is in = "waiting for payment" 
And Payment status = "Pending" 
And application selected payment method = "Offline" 

 
**Payment History tab : ** 
Payment History tab needs be reordered and included with new fields 
 

- Payment Method 
- Amount 
- Transaction id   -  Data available only for offline method, for other methods it will be empty 
- Date & Time     - for offline methods it will be empty) 
- Status  (Like Paid, Pending, failed) 
- Receipt - (applicable for offline methods) attached proofs during record payment  
- Action button / icon - to record offline payments 
 
Note:  refer [#179427](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/179427/) 
 

 
**Scenario: "Record " button visible only for Approved + Offline **Payment methods  
When the BO User views the application detail page 
And application is in = "waiting for payment" 
And Payment status = "Pending" 
And application selected payment method = "Offline" 
 
Then the "**Record **" button should be visible only for offline payment methods 
And BO user should be able to record the completed payments which is shared by the applicant 

 
**Scenario: Open Record Payment modal** 
Given the BO User invokes "Record Payment" 
Then the system displays a modal with fields for BO user to select 

- **Payment Date & Time, (Date & Time should be past date, future date should be hided)** 
- **Amount Paid** 
- Payment Reference no 
 
- **Attachment icon ** 
- **Notes (formatting as already covered)** 
 
And "Cancel" and "Mark as Paid" buttons  

 
**Scenario: Validation - required fields** 
Given the modal is open 
When the BO User clicks "Mark as Paid" without filling required fields 
Then the system should show validation errors and not submit 

 
**Scenario: Contract requires proof for bank transfer or cheque** 
Given when record payment is triggered 
And BO user should be able to attach the proof with respect to the transaction recorder 
And only one attachment is allowed with respect to record of a payment. 
And same will be visible in payment history tab under attachment 

 
**Scenario: Successful record of Completed payment (cash/POS)** 
Given the BO User fills valid form values 
When the BO User clicks "Mark as Paid" 
Then the system should create a Payment record with status "Paid" 
And append the entry to the Payment History tab for the application 
And transition application from "Approved" to "Active" 

 
**Scenario: Record Payment should not be visible post Active** 
Given a payment record was created successfully 
And the application is in “Active” state 
Then the Record payment should not be displayed 

 
**Scenario: Cancel Record Payment** 
Given the Record Payment modal is open 
When the BO User clicks "Cancel" 
Then the modal closes and no payment record is created 

 
**Scenario: Payment added to Payment History** 
Given a payment record was created successfully 
When the BO User opens Payment History tab 
Then the new payment appears in the payment tab 
And attached document with respect to record payment has to be displayed  
And BO user should be able to download the attached file 

 
**Scenario: Notes added to Notes section** 
Given a payment record was created successfully 
When the BO User opens the respective application 
Then the notes included with respect to record payment should be included in the notes section 
And applies the format as required in Notes section 
And BO user should be able to download the attached file 

 
**Updated Work Queue state : Active** 

 
**Audit Log Events** 
**Event Name: Record Offline Payment** 
**Event Description: <BO User> recorded an offline payment made by the customer for the application.** 
**Event Category: Payment / Offline** 
**Application ID: $ApplicationID** 
**User Role: BO User** 
**User Name: $UserName** 
**Date & Time: $Timestamp**
