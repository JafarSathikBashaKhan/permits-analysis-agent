# US-174601: Application | Application Details | Work Queue States | Payment Failed

| Field | Value |
|-------|-------|
| **ID** | 174601 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Natarajan Arumugam  |
| **Tags** |  |

## Acceptance Criteria

**Pre-Condition : Waiting for payment          ** 
** ** 
**Payment Failure Recorded** 
Given
an application is a waiting for payment 
When
the applicant attempts payment and the transaction fails 
Then
the system should update the application status to “Payment Failed”" 
  
**Update Work Queue state **: **Waiting for payment ** 
  
**Retry Payment After Failure** 
** ** 
Given
an application is in “Payment Failed” state 
When
the applicant retries payment 
And
the payment is successful 
Then
the system should update the application status to “Active” 
  
**Update Work Queue state **: **ACTIVE**
