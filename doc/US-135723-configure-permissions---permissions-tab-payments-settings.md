# User Story 135723: Configure Permissions - Permissions Tab | Payments Settings

## Metadata
| Field | Value |
|-------|-------|
| ID | 135723 |
| Type | User Story |
| Title | Configure Permissions - Permissions Tab | Payments Settings |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | LV |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Given a Super Admin / Contract admin is in the application builder,** 
 
 
 
When they view the “Payment Settings” section,
 
Then they should see a list of pre-defined methods with check boxes:
 
 

 
Online Payments Methods (UI Grouping)
- Use Registered Card 
- Pay Now 
- Pay After Approval 
- Pay Monthly 
- Pay Quarterly 
- Agent Assist 
- Wallet 
 
Offline Payments Methods (UI Grouping)
- Postal Payment 
- Pay on Collection 
- Invoice 
- Cost Centre / Budget Code 
 
When in the payment settings screen, 
Then should be able to check / uncheck the boxes. 

 
When wants to save the Payment settings as draft, 
Then no restriction required even if no options are checked. 

 
When want to publish, 
Then should select at least one payment method. 

 
When viewing the payment method check boxes, 
Then should see a tag line or info text as in Figma. 

 
For Understanding Purpose Only**: (Cannot be developed in this story) 
When tried to publish without at least one payment method selected, 
Then should see an error as "At least one payment method is required to publish this permission".
