# US-110894: Ability to view the created contract in dashboard screen

| Field | Value |
|-------|-------|
| **ID** | 110894 |
| **Type** | User Story |
| **Module** | Home Screen |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

Given a Super admin user 
When creates a contract type as Apply 
Then should see the contract created as a widget in dashboard screen of MNPS 
 
Given a permissioned Apply user [All user roles of apply] 
When logs into MNPS and if the user has got access to multiple contracts   
Then should land in dashboard screen after successful login to the system. 
AND 
If the logged in user has got only one contract access 
Then should be navigated directly to the home screen of apply BO. 
 
Given a permissioned Apply user [All user roles of apply] 
 
When in the dashboard screen 
Then the UI spec should be similar to the existing contract widget 
AND 
On selecting a particular "Apply" contract should navigate the user to home screen of apply BO.  
AND 
When in dashboard screen except the super admin user  
The other user roles should not see the configuration menu items in their left panel [Configuration, Client Setup, CR Configurations, AIRA Configuration]. 
AND 
The other functionalities in dashboard screen should be applicable to Apply contract widget as similar to PCN Contract.
