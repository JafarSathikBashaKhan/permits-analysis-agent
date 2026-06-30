# US-108776: Changes required in MNPS BO for including "Apply" settings.

| Field | Value |
|-------|-------|
| **ID** | 108776 |
| **Type** | User Story |
| **Module** | MNPS Contract Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**** 
**Pre-requisites:** 

 - Log
     in to the MNPS BO and create the organisation [Existing]. 

 - On
     the contract create screen, select the organization, enter the contract name, and get contract ID auto-generate contract ID. 
 
 
**Given** a Super Admin user 
When in Contract create screen 
Then, 
- Should see a new radio button as "Apply" against the Contract type 
- When this new contract type is selected, the system should offer the apply services to its contract users 
- When this new contract type is selected, the data fields pertaining to Apply should be visible in the screen as below. 
 

 
 
**Given** a Super Admin user 
**When** selects Apply as the contract type, 
Then should see a "Create New Permission" button option to add a new permission type. 
AND 
Invoking "Create New Permission" button, should bring up a pop up to input the permission name, with 'Cancel' and 'Create' button. This field should be a, 

- Should be a free text field, 
- Character limitation up to 100,  
- Should not accept special characters, 
- The created type should be available for selection in the permission type drop down field. 
 
 
AND 
On adding a new permission type and invoking "Create" button in the pop up,  
Then should add this new permission type against the permission type field. 

 
 
**Given** a Super Admin user 
**When** selects Apply as the contract type, 
**Then** the system should display existing and new fields as below: 

 - Permission
     Type - [New Field] 

 

  - Should
      be a Mandatory field, drop down selection of services/types. 

  - Values
      should be Permit, Licensing, Suspension, Dispensation, Exemption by default. 

  - User
      should be able to select multiple values, but at least one value must be
      selected to create the contract. 

 

 - Country
     - [Mandatory Field, should function as existing field] 

 - Currency
     - [Mandatory Field, should function as existing field] 

 - Time
     Zone - [Mandatory Field, should function as existing field] 

 - Region
     - [Mandatory Field, should function as existing field] 

 - **Town**
     - [Optional Field, should be a text input field with character length limitation up to 100, attempting to enter more than 100 characters should be restricted.] 
 
  
**Should have Group Titled as: VAT** 

 - **VAT%**
     - Optional field, accepts numerical values between 1 and 100, with the
     value considered as a percentage. 

 

  - If
      the user enters a value greater than 100, an error message should appear:
      "The value of the field cannot exceed 100. 

 

 - VAT
     Registration Number - Mandatory input field, accepts alphanumeric
     values and special characters, with a maximum length of 100 characters. 

 

  - The
      system should restrict any attempt to enter more than 100 characters. 
 
 

 
 
  
**Group Title: Contacts** 

 - Phone
     Number - Mandatory field, accepts numeric values with a maximum length
     of 15 characters. 
 

 - The
     system should restrict the user from entering more than 15 characters. 
 

 - Contract
     Email - [Mandatory Field, should function as existing field] 

 - Contract
     Sender Email - [Mandatory Field, should function as existing field] 

 - **Address**
     - Optional input field, accepts alphanumeric values and special
     characters, with a maximum length of 1000 characters. 

 - URL
     (Privacy Policy) - Link field that should accept privacy policy URLs. 
 

 - The
     system should validate the URL format. 
 

 
Given a super admin user, 
When all required fields for the contract are filled and the user
invokes Save, 
Then the contract of type Apply should be created, and a toast
message should appear on the contract list screen indicating successful
creation. 

 
Given a super admin user, 
When any mandatory field is left empty, 
Then the Save button should remain disabled. 

 
Delete and Edit should be defined as existing. 

 
**Event log:** Contract creation, update, Soft Delete. 
Event Type / name: **Contract creation ** 
Event description: Contract has been created as "Lewisham Apply" 
Date and Time stamp: Current date & Time 
User role: "Super Admin" 
User name: First name and Last name of the user who created the contract eg: "Joanne Archer" 

 
Event Type / name: **Contract updated** 
Event description: Contract value updated "Field name: Field value" 
Date and Time stamp: Current date & Time 
User role: "Super Admin" 
User name: First name and Last name of the user who updated the contract eg: "Joanne Archer" 

 
Updating the below AC, 8/5: 
~~Event Type / name: **Contract deleted [Should be a soft delete]** ~~ 
~~Event description: Contract deleted "Contract name" ~~ 
~~Date and Time stamp: Current date & Time ~~ 
~~User role: "Super Admin" ~~ 
~~User name: First name and Last name of the user who deleted the contract eg: "Joanne Archer" ~~ 

 
Event Type / name: **Contract Deactivated** 
Event description: Contract deactivated "Contract name" 
Date and Time stamp: Current date & Time 
User role: "Super Admin" 
User name: First name and Last name of the user who deactivated the contract eg: "Joanne Archer" 

 
 
 

 
Note: The usage of each of these fields will be
defined in a separate story.
