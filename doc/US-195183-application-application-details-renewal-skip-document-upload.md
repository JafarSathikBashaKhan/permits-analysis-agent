# US-195183: Application | Application Details | Renewal | Skip Document upload

| Field | Value |
|-------|-------|
| **ID** | 195183 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Natarajan Arumugam  |
| **Tags** |  |

## Acceptance Criteria

BO Renewal - Proceed to Payment when
documents are valid 
  
 
**Background:** 
   
Given a BO User with renewal permissions is logged in 
   
And an application exists in "Pending-Renewal" state 
   
And the application has an active permit eligible for renewal 
   
And all supporting documents are still valid according to retention
configuration 
  
 
Scenario: BO views valid documents in the Document Section 
** ** 
   
When the BO User opens the Renewal Summary page 
   
Then the system should display each required document with a “Valid” tag 
    And no document upload should be required since the attached documents are in validity (based on document validity configuration) [#164802](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/164802/)    
 
 
 
 
 
 
 

 
    **Note**: Documents type settings --> Renew has to be enabled for document types required for renewal 
              Document expiry has to consider based Document retention and Document expiry settings(in contract level) 
             
 
 
 
 
 
 
 
 
 
 
**** 
***Note**: Yet to confirm details on payment partner.so this implementation is need to be hold and will be covering in a different story.* 
*** *** 
*** ****  Scenario: Renew button displays confirmation pop-up***
  
   
When the BO User clicks the “Renew” button  
*    Then It should take the user to payment partner page .* 
*    **Note**: Yet to confirm details on payment partner.so this implementation is need to be hold and will be covering in a different story.* 
*  * 
 
**Scenario: BO cancels renewal confirmation** 
** ** 
   
Given the confirmation pop-up is displayed 
   
When the BO User clicks “Cancel” 
   
Then the pop-up should close 
   
And no renewal or payment action should be triggered
