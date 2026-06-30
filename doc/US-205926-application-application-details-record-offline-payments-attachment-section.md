# US-205926: Application | Application Details |  Record offline payments | Attachment section

| Field | Value |
|-------|-------|
| **ID** | 205926 |
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

 
**Scenario: Open Record Payment modal** 
Given the BO User invokes "Record Payment" 
Then the system displays a modal with fields for BO user to select 

- **Payment Date & Time, (Date & Time should be past date, future date should be hided)** 
- **Amount Paid** 
- Payment Reference no 
 
- **Transaction Receipt - click to upload Attachment  ** 
- **Notes (formatting as already covered)** 
 
And "Cancel" and "Mark as Paid" buttons  

 
**Scenario: Validation - required fields** 
Given the modal is open 
When the BO User clicks "Mark as Paid" without including any attachment in Transaction Receipt section 
Then the system should show inline error below as "Required attachments are missing" 
And only one attachment is allowed to upload  
And need to restrict second attachment. 

 
**Scenario: Contract requires proof for bank transfer or cheque** 
Given when record payment is triggered 
And BO user should be able to attach the proof with respect to the transaction recorder 
And only one attachment is allowed with respect to record of a payment. 
And same will be visible in payment history tab under attachment
