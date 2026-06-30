# US-170243: Application | Application Details | Change Zone (By BO) without cost

| Field | Value |
|-------|-------|
| **ID** | 170243 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**Change Zone for Applicant's Permit** 
**Background**: 
Given a BO user is logged into the system 
And has permission to update permit details 
And the applicant has requested a zone change 
**BO initiates Change Zone** 
When the BO clicks the "Change Zone" button 
Then the system should display a pop-up titled "Change Zone" 
And a drop-down list of available zones should be displayed 
Cost options displayed 
Email subject 
Email Body  
include attachments icon 
Attachments section 
with Cancel and "Preview & change zone" button 

 
**BO selects a new zone and proceeds** 
Given the "Change Zone" pop-up is open 
When the BO selects a new zone from the drop-down 
And clicks the "Change Zone" button 
Then the system should display a "Process Change of Zone" window 
And the window should show any applicable charges 
And the BO should see three options: "Continue without cost", "Continue with cost", and "Cancel" 
**BO continues without cost** 
Given the Process Change of Zone window is displayed 
When the BO clicks "Continue without cost" 
Then the system should update the permit to the new zone immediately 
And display the updated zone in the permit UI 
And log the event "Change Zone Processed without Cost" 
**BO continues with cost** 
Given the Process Change of Zone window is displayed 
When the BO clicks "Continue with cost" 
Then the system should send an email notification to the applicant to pay the charge 
And update the application status to "Waiting for Payment" 
And log the event "Change Zone Pending Payment" 
When the applicant completes the payment 
Then the system should finalize the zone change 
And display the updated zone in the permit UI 
And log the event "Change Zone Processed with Cost" 
**BO cancels change zone** 
Given the Process Change of Zone window is displayed 
When the BO clicks "Cancel" 
Then the system should close the window 
And no changes should be made to the permit zone 
And log the event "Change Zone Cancelled" 
Work queue state defined in[174594Application | Application Details | Work Queue States | Change Zone](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/174594/) 
 
[In Development](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/174594/) 
 
 

 
**Event Name:** Zone Change initiated**Event Description:** <Bo User> initiated change zone as per applicant request**Event Category:** Zone Change / Requested**Application ID:** $ApplicationID**User Role:** Role of the User**User Name:** First name and Lastname of the user**Date & Time:** $ current Timestamp
 
**Event Name:** Zone Change Completed**Event Description:** Application zone updated from <OldZone> to <NewZone> **Event Category:** Zone Change / Executed**Application ID:** $ApplicationID**User Role:** Role of the User**User Name:** First name and Lastname of the user**Date & Time:** $Current Timestamp 

 
**Event Name:** Zone Change cancelled**Event Description:** Application Change Zone Cancelled**Event Category:** Zone Change / cancelled**Application ID:** $ApplicationID**User Role:** Role of the User**User Name:** First name and Lastname of the user**Date & Time:** $Current Timestamp
