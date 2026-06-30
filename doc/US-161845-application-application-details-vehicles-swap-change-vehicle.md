# US-161845: Application | Application Details | Vehicles | Swap/Change Vehicle

| Field | Value |
|-------|-------|
| **ID** | 161845 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**** 
**** 
**** 
**** 
**Swap Vehicle tied to a Permit**
 
  
**Accessing the Swap Vehicle option** 
  Given a permit is tied to a vehicle 
  When the BO user want to Swap/change vehicle for a
vehicle on the permit 
  And clicks the Swap/change icon menu on the permit 
  Then the system must display a list of vehicles mapped
to the applicant’s account 
  Excluding the currently tied vehicle. 

 
 
**Search** 
  
 
Given the BO user chooses Swap icon 
  When the swap window opens 
  Then the BO user must be able to search for a VRM using the search option available 
  
  
**Swap vehicle with an existing mapped vehicle** 

 
  Given the BO user is on the "Swap Vehicle"
screen 
  And the applicant account has multiple vehicles mapped 
  When the BO user selects a different mapped vehicle 
  And clicks the "Change" button 
  Then the selected vehicle must replace the currently
tied vehicle on the permit 
  And the previously tied vehicle must be released 
  And this selected Vehicle will be changed as Primary vehicle and will be shown as "Primary" 
  And the system must log this change in the audit
trail. 
  
**Attempting to swap vehicle when no other vehicles are mapped** 
  Given the BO user has accessed the "Swap
Vehicle" option 
  And the applicant account has no other vehicles mapped 
  When the swap screen loads 
  Then the UI must display a message stating 
       "No additional vehicles
available to swap." 
  And the "Change" action must be disabled. 
  
**Confirmation before swapping vehicle** 
  Given the BO user has selected a different vehicle for
the permit 
  When the BO user clicks the "Change" button 
  Then the system must prompt a confirmation message 
       "Are you sure you want to
change the vehicle for this permit?" 
  And provide options "Confirm" and
"Cancel" 
  When the BO user selects "Cancel" 
  Then no change should occur 
  And the current vehicle tied to the permit must remain
unchanged. 

 

 
**Limit to Swap** 
When in the change vehicle pop-up, 
Then should see an indication as "Only <x> vehicle
changes allowed. No further change will be allowed". (Count of changes
allowed is based on configuration in the Permissions setup _[#142348](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/142348/))_    
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
_ _ 

When the limit is reached,  
Then the following banner message should be
displayed "Vehicle change limit reached. No further changes are
allowed"  
And the "Change" button should be disabled.  

  

  
  
**Audit trail for vehicle swap** 
  Given the BO user has swapped the vehicle tied to the
permit 
  When the swap is confirmed 
  Then the system must record the audit log about the
swap 

 
**Audit Or Events Capturing:** 
 
 

 
Event Name / Event Type: Vehicle changed for permission 
Event Description: Vehicle changed for permission from $VRMNo to &VRMNo 
Category: General
