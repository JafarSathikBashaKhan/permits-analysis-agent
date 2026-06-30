# US-111155: Home Screen Apply BO - Header and Menu Item

| Field | Value |
|-------|-------|
| **ID** | 111155 |
| **Type** | User Story |
| **Module** | Home Screen |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

Navigation: 

- Permissioned user logs into the system, 
- Selects a contract if it got multiple contract access in MNPS BO 
- If the user has got single contract access, then after login, the user gets navigated to apply BO Home screen. 
 
 

 
Given a permissioned apply user 
When in the header section of home screen 
Then should see a hamburger menu icon  
AND 
Invoking which should expand and collapse the menu item panel [Should behave as similar to MNPS BO menu item panel] 
AND 
Invoking icon should list all the parent and submenus pertaining to the system. [List of menu items attached] 

 
Given a permissioned apply user 
When in the header section of home screen 
Then should see a **Switch to **dropdown option 
 
AND 
This dropdown should be seen only if the logged user has got access to multiple contracts. 
AND 
On switching to other contract from the dropdown the logo of the contract should also be changed accordingly. 
AND 
When the logged in user has got one contract access 
Then instead of the Switch to drop down, should see the Contract name along with its logo as defined in the design[Ref Figma]. 
AND 
When the user wants to navigate back to MNPS BO [Applicable only for the user who got access to multiple contracts] 
Then the user have a option as "Home (MNPS BO)" in Switch To dropdown.  
AND 
If the list of the contracts are more in switch to option 
Then enable scroller in the dropdown 

 
Note: When the user switches to a different contract, he should be taken to the dashboard screen of the respective contract [Dashboard story ID] 

 
Given a permissioned apply user 
When in the header section of home screen 
Then should see a **Notification icon ** 
AND 
 Should see a **profile icon** of the logged in user.
