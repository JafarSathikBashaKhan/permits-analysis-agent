# US-193378: Report | Application | NFI

| Field | Value |
|-------|-------|
| **ID** | 193378 |
| **Type** | User Story |
| **Module** | Reports |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Given** a super admin, contract admin, Bo manager, Bo user, 
 
 
 
**When** the user navigates to the **Reports** menu and selects **NFI**,**Then** the system should display the following filters: 

- **Date Range** (From and To – Calendar Picker) - Filters applications based on the date they became active. The user should not be allowed to select a date range longer than 1 year from the current calendar date. 
 
- **Permission Type - Drop down** should displays all permission types for the contract 
 
- **Permission Name - Drop down** should displays all permission names for the contract 
 
 
**All filters** should support **multi-select options** and include an **“All”** option for comprehensive selection. 
If a filter is not selected, the system should include all values for that filter and generate the report based on the remaining selected filters. 
 

 
**When** the user applies the selected filters and runs the report**Then** the system should generate a report displaying the following fields: 

- **Permit Reference Number** – Displays the permit reference number (same as the application reference number if not separately generated). 
- **Surname** – Displays the last name of the applicant. 
- **Forename** – Displays the first name of the applicant. 
- **Address 1** – Displays the property name or property number of the applicant’s address. 
- **Address 2** – Displays the street name. 
- **Address 3** – Displays the town name. 
- **Address 4** – Displays the zone name / locality name. 
- **Postcode** – Displays the postcode of the applicant’s address. 
- **Unique Property Reference Number (UPRN)** – Displays the UPRN associated with the property. 
- **Date of Birth** – Displays the date of birth of the applicant. 
- **Mobile Telephone Number** – Displays the primary mobile number the applicant entered during **account creation**. 
- **Email** – Displays the email address of the applicant. 
- **Start Date** – Displays the start date of the permit/application. 
- **Expiry Date** – Displays the expiry / end date of the permit/application. 
- **Permit Type Flag (Permission Name)** – Displays the permission name. 
 
 
**Export:**When the user chooses to export the report,Then the system should follow the standard Power BI export options, which include: 

- **Data with current layout** 
 
- **Summarized data** 
 
- **Underlying data** 
 
 
The export functionality should comply with the **MNPS reporting standards**. 
Note: The report is built using Power BI
These static PBI reports for Permit should not be part of the application deployment pipeline.Once a report is published or updated in Power BI, it must become immediately available in the Permit Reports module
