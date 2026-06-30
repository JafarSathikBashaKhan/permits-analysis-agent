# US-170288: Application | Application Details | Work Queue States | Approved

| Field | Value |
|-------|-------|
| **ID** | 170288 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
Pre-condition
:  
- ******In-Progress  ** 
 
** ** 
Given a BO user has reviewed the application and
verified all required information are available 
And the application is in the “In-progress” state 
When the BO user selects the “Approve” action 
Then the system should update the application status
to “Approved” 
  
BO
User views the current work queue state in Permission Details page and in
Overview sections which is covered in [**#169334**](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/169334/)** ** 
  
Updated
Work Queue state : “**Approved**” --> **Active/Print** 

 
**Post Action :** 
 

- Once approved , application will be moved to "**Active**" state based on payment status 
- If already paid , it will be moved to Active state 
- If not , it will move to "Waiting for Payment" state. 
 
 
               Approved ---> Waiting for Payment --> payment successful --> Active 
                                                                        --> Payment failed ---> Waiting for payment  
    For a period of time , if payment has not been completed , will move to due to be closed state 
[#174591](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/174591/)
