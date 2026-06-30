# US-160554: Application | Application Details | Vehicles PCN Lookup (Show Active PCN)

| Field | Value |
|-------|-------|
| **ID** | 160554 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**** 
**** 
**** 
**** 
**** 
**Vehicles & PCN Lookup** 
** ** 
**Vehicle Selection** 
  
Given the Application View screen is open 
When the user clicks on a vehicle in the Vehicles section 
Then the system must display a list of Vehicles associated
with that Application/reference number. 
And the list must include a vehicle that has as
permit="Active" , 

 
Excluding Paid and Cancelled state PCN's 
  
**PCN Lookup option is visible when enabled in contract** 
** ** 
 Given the BO user is
viewing the application 
 And PCN Lookup is
enabled in the contract settings 
 When the user views
the list of vehicles 
 Then the "Show Active PCN" button must be visible for each vehicle 

 
PCN toggle reference story : [#162391](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/162391/)  and  [#164946](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/164946/)    
 
 
 
 
Screenshot attached : [PCN toggle .jpg](https://dev.azure.com/MHPortfolio/13c4b98a-5b83-4cbe-b995-d1cf15a63011/_apis/wit/attachments/3455c66f-e1cb-4dc9-8f6f-a5cf71f3d49c?fileName=PCN%20toggle%20.jpg&download=true)  
**"SHOW ACTIVE PCN "Lookup option is hidden when disabled in contract** 
** ** 
 Given the BO user is
viewing the application 
And PCN Lookup is disabled in the contract settings 
When the user views the list of vehicles 
Then the "Show Active PCN" button must not be displayed 
  
**PCN Lookup (Show Active PCN) – Vehicle VRM (API dependency)** 
  
Given the PCN Lookup is triggered for a vehicle 
Then the system must display PCN details corresponding to
that vehicle’s VRM. 
And this is derived through an API call from the existing
system (MNPS) 
  
**Multiple Vehicle Handling** 
  
Given an application has multiple vehicles linked 
When PCN Lookup is triggered 
Then the system must display individual PCN( Active PCN) details for each
vehicle separately. 
  
**Active PCN Filter** 
  
Given the PCN Lookup is performed 
Then only active (outstanding) PCNs must be displayed. 
  
**Display contraventions under the selected vehicle** 
** ** 
  Given the BO user is
viewing the list of vehicles 
  When the BO user
clicks on the "Show Active PCN" button for a vehicle 
  Then the system must
display the list of contraventions directly below the selected vehicle 
  And the rest of the
vehicles in the list must be moved down or adjusted accordingly 
  And the
contraventions must remain visually grouped with the selected vehicle 

 
  And "Hide Active PCN" will be visible for User to close the PCN lookup for respective vehicle 
  And Once closed "Show Active PCN" should be visible and UI should be adjusted accordingly  
  
All PCN details for the respected vehicle are retrieved
from the API and displays the records  
** ** 
**Display details of PCNs** 
  Given an Vehicle details
is expanded 
  Then each PCN must
display the following: Field               

- Contravention
Date & Time 
- Case Number        
- Contravention Path          
- Balance
Amount        
 
-Total outstanding amount 
  When active PCNs are
displayed 
  Then the BO user
should see the ‘Total outstanding amount” (sum of balance amounts) for that
vehicle 
  
**Close contravention list for a vehicle** 
** ** 
  Given the BO user has
opened the contravention list for a vehicle 
  When the BO user
clicks the "Close" button  
  Then the
contravention list for that vehicle must be hidden 
  And the list of
vehicles must readjust back to its original layout 
  And the UI must
remain clear without leftover data or blank spaces 
  
**Default sorting of PCNs** 
** ** 
  Given PCNs are
displayed  
  Then they should be
sorted in Newest to oldest order 
  
**Filtering of PCNs** 
** ** 
  Given PCNs are
displayed  
  When the BO user
applies a filter (e.g., by status, date, amount) 
  Then the system
should display only the PCNs that match the filter criteria 
  
**Pagination of PCNs** 
** ** 
  Given more PCNs exist
than the configured limit per page 
  When the BO user
views the accordion 
  Then pagination
controls must be available 
  And the BO user
should be able to navigate between pages without closing the accordion 
    
  And user should be able to the see the total number of active PCN records displayed. 
  
**Refresh PCN data** 
** ** 
  Given an PCN details is
expanded for a vehicle 
  When the data is
refreshed 
  Then the latest PCN
status and balance must be displayed 

 
 
**Vehicle has no active contraventions** 
** ** 
  Given the BO user has
clicked the "PCN Lookup" button for a vehicle 
  When the vehicle does
not have any active PCNs 
  Then the system must
show the message "No active Contraventions for the selected vehicle" 

 
**PCN service timeout** 
** ** 
  Given the BO user
clicks the "PCN Lookup" button 
  When the request to
the PCN system times out 
  Then the system must
display the message "PCN Lookup service is temporarily unavailable" 
  And allow the BO user
to retry 

 
**Error handling when loading PCNs** 
** ** 
  Given a BO user
clicks on a vehicle 
  When PCN data cannot
be retrieved 
  Then the system
should display the message "Unable to load contraventions at the moment.
Please try again later."
