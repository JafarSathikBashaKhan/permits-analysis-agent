# User Story 129426: USRN and UPRN toggle settings

## Metadata
| Field | Value |
|-------|-------|
| ID | 129426 |
| Type | User Story |
| Title | USRN and UPRN toggle settings |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete; LV |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a super admin or contract admin ** 
 
 
When in Contract settings screen 
 
Then should see the section titled as Unique Street and Property Reference Numbers**** 
And 
 
Should see two toggles, by defaulted in disabled state;
 

 
USRN toggle - **** 
When turned on, then should have the USRN number auto generated in street creation screen
 
When turned off, then the USRN field in street creation will be a free text field. 

 
When the toggle is enabled on, a prompt should be available as "Enabling this toggle will automatically generate the USRN numbers for the streets. Are you sure you want to enable it? with Yes and No Button. 
Yes - Should enable the toggle for the contract  
No - should close the pop up 

 
When the toggle is disabled, a prompt should be available as "Disabling this toggle will prevent the automatic generation of USRN numbers for the streets. Are you sure you want to disable it? with Yes and No Button. 
Yes - Should enable the toggle for the contract  
No - should close the pop up 
 

 
UPRN toggle - **
 
When turned on, then should have the UPRN number auto generated in street creation screen
 
When turned off, then the USPR field in street creation will be a free text field.
 

 
When the toggle is enabled on, a prompt should be available as "Enabling this toggle will automatically generate the UPRN numbers for the streets. Are you sure you want to enable it? with Yes and No Button. 
Yes - Should enable the toggle for the contract  
No - should close the pop up 
 
When the toggle is disabled, a prompt should be available as "Disabling this toggle will prevent the automatic generation of UPRN numbers for the streets. Are you sure you want to disable it? with Yes and No Button. 
Yes - Should enable the toggle for the contract  
No - should close the pop up 
 
 

 
By default these toggles should be in disabled state 

 
 
 
When these toggles are turned on, capture events as below, 
Event Name: USRN / UPRN toggle enabled.
Event Description:  USRN / UPRN toggle enabled.
 
Date and Time Stamp: Current date and time
 
User Role: The role of the user who made the change
 
User Name: First Name and Last Name of the user who made the change.
 

 
Event Name: USRN / UPRN toggle disabled.Event Description:  USRN / UPRN toggle disabled. 
Date and Time Stamp: Current date and time 
User Role: The role of the user who made the change 
User Name: First Name and Last Name of the user who made the change.
 

 
Ref story: [User Story 125471](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/125471): Street and Property creation for the respective USRN and UPRN fields.
