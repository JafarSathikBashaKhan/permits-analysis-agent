# US-163653: BO | Sign out

| Field | Value |
|-------|-------|
| **ID** | 163653 |
| **Type** | User Story |
| **Module** | Home Screen |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

Given a Super Admin, Contract Admin, Back Office Manager, or Back Office User, 
When they are in the Apply Back Office application, 
Then they should see a Sign out option. 

 
When the user invokes the Sign out option, 
Then a confirmation pop-up should appear with the message "Are you sure want to Sign out? It's good idea to close all the browser windows" and two actions: Sign out and Cancel. 

 
If Yes → the user is redirected to the Login page. 
If No → the user remains on the Apply Back Office application 

 
**Visibility of Sign out Option** 
Given a valid user session 
When the user is logged into Apply Back Office 
Then the Sign out option should always be visible in the header/navigation. 

 
**Session Expiry Handling** 
Given the user’s session has expired due to inactivity 
When the user tries to interact with Apply Back Office 
Then they should be redirected to the Login page automatically (without needing Sign out). 

 
**Multiple Tabs/Windows** 
Given the user has multiple Apply Back Office tabs open 
When they log out from one tab 
Then all other tabs should also be logged out (session terminated globally). 

 
**Event:** 
Event Type/Name: Sign out 
Event Description: Signed out successfully 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
