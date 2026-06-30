# US-170283: Reject Reason | Grid & Create

| Field | Value |
|-------|-------|
| **ID** | 170283 |
| **Type** | User Story |
| **Module** | MNPS Contract Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Given a Super Admin
 
 
 
 
 
When in the Configuration menu in MNPS
 
Then the submenu Reject Reasons should be available 

 
**List Screen:**
 
When the user selects Reject Reasons
 
Then the grid should display the following columns: 

- Reject Reason 
- Organization 
- Contract 
- Created By 
- Created On 
- Last Updated By 
- Last Updated On 
 
 
And the grid screen should have a + Add Reject Reason button 

 
Default search, filter, sorting, and pagination should be applied
 

 
Add Reject Reason Pop-up:
 
When the user clicks + Add Reject Reason
 
Then a pop-up should open with the following mandatory fields: 

- Organization – Drop-down 
- Contract – Drop-down 
- Reject Reason – Text field 
- Add – Button 
- Cancel – Button 
 
 
**Behavior:** 
Organization Drop-down  

- Should display all organization names 
 
 
Contract Drop-down 

- Should display contracts corresponding to the selected organization 
- Only contracts of type Apply should be shown in the drop down 
 
 
Reject Reason Field 

- Allows alphanumeric and special characters 
- Maximum length: 5000 characters 
 
 
**Add Button** 
Enabled only when all mandatory fields are filled 
Disabled if any mandatory field is empty 

 
**Add Action:**
 
When all mandatory fields are filled and the user clicks Add
 
Then a toaster message should appear: "New rejection reason is added"
 
And the new rejection reason should appear at the top of the list 

 
**Apply BO** 
**When** a new Rejection Reason is created for a specific **Contract**
**Then** the new value should be added to the **Apply BO > Application menu > Reject action** drop-down list **only for that Contract**
 

 
**Cancel/Close Action:** 
When no data is entered/selected and the user clicks Cancel or the Cross icon 
The pop-up should close 

 
When any data is entered/selected and the user clicks Cancel or the Cross icon 
Show the confirmation message: "Unsaved data will be lost. Do you want to continue?" 
Options: Yes / No 
Yes - navigated to the list screen 
No - stay on the same pop up with the data retained. 

 
**Validation:** 
If a contract is selected without selecting an organization 
Show error: "Please select organization" 
If a duplicate rejection reason is added with the same contract 
Show error: "This rejection reason already exists" 

 
~~**Audit/Event** ~~ 
~~Event Type / Name: Reject reason created ~~ 
~~Event Description:  "Reject Reason" created successfully ~~ 
~~Date and Time: Current $timestamp ~~ 
~~User Role: Role of the user ~~ 
~~User Name: First Name and Last Name of the Back office user ~~
