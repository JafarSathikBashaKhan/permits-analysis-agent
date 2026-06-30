# US-177255: Application | Application Details | Reactivate & Renew Permit Application(By BO)  | During Grace Period After Expiry

| Field | Value |
|-------|-------|
| **ID** | 177255 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sureshkumar M  |
| **Tags** | southend |

## Acceptance Criteria

**** 
**Pre-Condition : Expired ** 
**Based on Config : Reactivated the Expired Application** 

 
**Application reaches expiry with a configured grace period** 
** ** 
Given
an application has reached its expiry date 
And
a grace period is configured in permission settings 
When
the application expires 
Then
the system should Enable "**Reactivate**" button ,for the configured
grace period 

 
 
Note : Grace Period configuration is covered in [#177544](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/177544/)        
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 **Current- state : Reactivate** 

 
**BO initiates renewal on applicant’s request** 
** ** 
Given
an application is within the configured grace period 
And
the applicant has requested BO for renewal  
When
the BO clicks the “**Reactivate**” button 
Then a confirmation pop-up displays "Are you sure want to Reactivate this permit ? Reactivating will move the application to previous state. " , with "Reactivate" and "cancel" button 
Then
the application should be reactivated on invoking "Reactivate" and moves to "**ACTIVE**" state 
And
"Renew" button should be enabled for BO user 
 
And an email notification should be triggered to the applicant about renewal availability (Email remainder will be sent based on the grace period settings) 

Updated Work queue state : ACTIVE
 

When invoking "Cancel" reactivate will not be proceeded.  
Application moves to "Expired " state. 

 

 

 
**Grace period expired** 

 
Given
the grace period has passed after the application expiry date 
When
the system validates the application status 
Then
the application should remain in “Expired” state 
And
the “Renew” button should be disabled for both BO and Applicant 
And
no renewal or further actions should be allowed 
And
an audit log entry should record the grace period expiration 
** ** 
** ** 
Renewal Initiated
During Grace Period 

- **Event Name : Renew application during Grace Period** 
- **Event Description:** <BO user> initiating renewal on behalf of the
applicant within the grace period. 
- **Event Category:**
User Action 
- **Date and Time: Current $timestamp** 
- **User Role: Role of the User** 
- User Name: First name and Last name
of the user 
 
  
** **
