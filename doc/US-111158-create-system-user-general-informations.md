# US-111158: Create System User - General Informations

| Field | Value |
|-------|-------|
| **ID** | 111158 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

Given a Super Admin or Contract Admin,
 
 
 
 
 
When want to create a new system user, 
Then should find the option to create a user in the system users list screen. 

 
When selects the button to create the system user, 
Then should be taken to the system user creation screen. 

 
When in the user creation screen, 
Then should be able to a user by entering the below general information. 

- First Name (Text field) 
- Last Name (Text field)
 
- Email (email address field) 
- Contact number (numeric) 
- Role (selection) 
 
First Name: Text field that allows maximum 50 characters 
Last Name: Text field that allows maximum 50 characters
 
Email: Standard email validation applies including **duplication. (Duplicate field message UI: This email already exist)** 
Contact Number: Numeric field upto 15 digits can be allowed. Duplicates should not be allowed. **(Duplicate field message UI: This number already exist)** 

 
When in the 'Role' field, 
Then should be able to select user roles that are configured or created earlier.** **(in roles and permissions menu) 
 
Note: '_Super Admin_' role should not be shown in the role drop-down, as 'Super Admin' users should only be created in the MNPS system. 

 
When wants to create a system user, 
Then the below fields are mandatory fields.
- First Name (Text field) 
- Last Name (Text field)
 
- Email (email address field) 
- Contact Number 
- Role (selection) 
 
When creating a user, 
Then should be able to active or inactive the "Change permit start and end date" toggle. (Non - Mandatory)
 
(Context: Enabling this permission toggle will allow the user to edit the start and end date of Permit) 
 

 
When the role is Super admin or Contract admin, 
Then the "Change permit start and end date" toggle should be enabled by default and should not be allowed to disable. 

 
When it is other roles, 
Then the "Change permit start and end date" toggle should be disabled by default. 
& 
Then can be allowed to disable or enable based on the need. 

 
When "Change permit start and end date" toggle is enabled, 
Then the user should be able to edit or update the start and end date of the permit. (While working on the permits after it is assigned) 

 
When the mandatory fields at the 'General Info' category are filled, 
Then should be able to create the user account by invoking appropriate button in the UI. 
(Configuration settings can be skipped for account creation) 
 

 
When the mandatory fields at the General Info or basic info category are not filled and attempted to save, 
Then should see the field level indication as "This field is required". 

 
When selected button to create, 
Then the user should be created. 
 

 
When successfully created, 
Then should see the "System user created successfully" indication. 
 

 
When the changes are not saved due to technical issue, 
Then should see the indication as "Something went wrong".  
 

 
**Events Capturing / Audit** 
Event Type / Name: System user created 
Event Description: $RoleName user account created 
Date and Time:
 
User Role: $Role of the user who made the change
 
User Name: First Name and Last Name of the user who done the change
