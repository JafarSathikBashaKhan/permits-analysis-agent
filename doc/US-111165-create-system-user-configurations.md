# US-111165: Create System User - Configurations

| Field | Value |
|-------|-------|
| **ID** | 111165 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

Given a Super Admin or Contract Admin,
 
 
 
 
 
 
When want to configure work queue configuration settings, 
Then should be able to configure 'Configuration' settings.
 

 
**Permission sub type configuration** 
When in the configuration settings,
 
Then should see the permission sub type toggles based on Permissions type configured in the Contract settings. 

- ~~Permissions enabled in the Roles and Permissions level - (Eg: Permits, Licensing, Suspension) ~~
 
- Sub types configured in the 'Permission setup -> Permission builder' (Eg: For Permit -> Visitors, Licensing and For Suspension, their sub types) 
 
When in the configuration settings, 
Then the Permissions and Sub Types should be **categorized**. 

 
When in the configuration toggle settings, 
Then all the toggles should be disabled by default for all the permission sub types. 

 
When want to enable the toggle, (NON MANDATORY) 
Then should be able to enable the permission sub type toggles. 

 
When the toggle is enabled, 
Then that user is should be able to work on the applications of that permission sub type. 

 
**Workflow Configuration** 
When in the Workflow configuration settings section, 
Then should see the list of states of applications. (Each application will be in different state Eg: Pending approval, Pending Renew, Mail to be Send etc.) 
<List down the states post Jo's approval> 

 
When want to active or deactivate, 
Then should be able do so. 

 
When the one or some workflow queue is enabled, 
Then that user should be able to work on the applications which are in that state. 
Eg: Can work only on the "Permit" applications that are in Pending etc. 

 
When done with both Permissions sub type settings and Workflow settings, 
Then should be able to create user by invoking the appropriate button in UI. 

 
When want to create user,  
Then both Permission types and Workflow queue settings are non- mandatory. 

 
When selected the button to create the system user, 
Then the system user should be created and listed in the list screen. 

 
**Events Capturing / Audit:** 
User creation event covered in [#111158](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/111158/) is applicable. 

 
& Also the below event needs to be captured_Configuration settings / toggle updated  including Work Queue_
 
Event Type / Name: Configuration Settings Updated
 
Event Description: Configuration Settings Updated
 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change
** **
