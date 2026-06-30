# US-111166: System Users -View / Edit | Configurations

| Field | Value |
|-------|-------|
| **ID** | 111166 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**View User Details (Invoke Line Item)** 
Given a Super admin / Contract admin,  
When selected a user from the system users list screen, 
Then should see a tab named 'Configurations' next to Overview. 

 
When in the Configuration tab, 
Then should see the Permission sub type configuration settings already enabled for that user. 

When in the configuration settings,
 
Then should be able to edit the configuration settings by adjusting the toggle. 
 
(Permission sub types should be categorized by 'Permission Types') 

 
When want to enable the toggle for a disabled one, 
Then should be able to enable the permission sub type toggles. 

 
When want to disable the toggle for a enabled one, 
Then should be able to disable the permission sub type toggles. 

 
When the toggle is enabled / disabled, 
 
Then that user is should be able to work on the applications of that permission sub type based on the updated configuration settings. 

 
**Workflow Configuration**
 
When in the Workflow configuration settings section,
 
Then should be able to edit or update the work queue settings toggle which is already configured. 

 
When want to active or deactivate any toggles,
 
Then should be able do so.
 

 
When the toggle against one or some workflow queue is updated, 
Then that user should be able to work on the applications which are in that state based on the new update. 

 
When done with configuration updates, 
Then should be able to save those changes by selecting the appropriate button. 

 
When saved the changes, 
Then should see the indication as "Updated successfully" 
 

 
When the changes are not saved due to technical issue, 
Then should see the indication as "Something went wrong". 

 
 
**Deactivation & Activation** 
When want to deactivate or activate the account, 
Then should have the provision to deactivate / activate. (Covered in [#111325](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/111325/)) 

 
**Events Capturing / Audit** 
**Configuration settings / toggle updated  including Work Queue**Event Type / Name: Configuration settings Updated 
Event Description: Configuration settings Updated
 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change
 

 
**Deactivation** 
**** 
 
Event Type / Name: System user deactivatedEvent Description: System user deactivated
 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change
 

 
**Activation** 
Event Type / Name: System user activatedEvent Description: System user activated
 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change 
 
****
